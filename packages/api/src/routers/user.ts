import { TRPCError } from '@trpc/server'
import Redis from 'ioredis'
import jwt from 'jsonwebtoken'
import { customAlphabet } from 'nanoid'
import { z } from 'zod'
import { sendEmail } from '@penx/api/lib/aws-ses-client'
import { isProd, redisKeys, ROOT_DOMAIN } from '@penx/constants'
import { prisma } from '@penx/db'
import { ProviderType } from '@penx/db/client'
import { hashPassword } from '@penx/libs/hashPassword'
import { initUserByEmailLoginCode } from '@penx/libs/initUser'
import { SessionData } from '@penx/types'
import { generateNonce } from '../lib/generateNonce'
import { getEthPrice } from '../lib/getEthPrice'
import { getLoginCodeEmailTpl } from '../lib/getLoginCodeEmailTpl'
import { getMe } from '../lib/getMe'
import { getRegisterEmailTpl } from '../lib/getRegisterEmailTpl'
import { protectedProcedure, publicProcedure, router } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const nanoid = customAlphabet(alphabet, 10)

export const userRouter = router({
  getNonce: publicProcedure.query(async ({ ctx, input }) => {
    let nonce = generateNonce()
    return nonce
  }),

  list: publicProcedure.query(async ({ ctx, input }) => {
    return prisma.user.findMany({ take: 20 })
  }),

  byId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return prisma.user.findUniqueOrThrow({
      where: { id: input },
      include: {
        sites: {
          include: { domains: true },
        },
      },
    })
  }),

  search: publicProcedure
    .input(
      z.object({
        q: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.user.findMany({
        where: {
          OR: [
            {
              displayName: {
                contains: input.q,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: input.q,
                mode: 'insensitive',
              },
            },
          ],
        },
        take: 10,
      })
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return prisma.user.findUnique({ where: { id: ctx.token.uid } })
  }),

  getReferralCode: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({ where: { id: ctx.token.uid } })
    if (user?.referralCode) return user?.referralCode
    try {
      const referralCode = nanoid()
      await prisma.user.update({
        where: { id: ctx.token.uid },
        data: { referralCode },
      })
      return referralCode
    } catch (error) {
      const referralCode = nanoid()
      await prisma.user.update({
        where: { id: ctx.token.uid },
        data: { referralCode },
      })
      return referralCode
    }
  }),

  updateReferralCode: protectedProcedure
    .input(
      z.object({
        code: z
          .string()
          .min(4, { message: 'Code length should greater the three' })
          .max(10, { message: 'Code length should not exceed ten' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await prisma.user.update({
          where: { id: ctx.token.uid },
          data: {
            referralCode: input.code,
          },
        })
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This code is existed, please try another code.',
        })
      }
    }),

  getAddressByUserId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const { accounts = [] } = await prisma.user.findUniqueOrThrow({
        where: { id: input },
        include: {
          accounts: {
            select: {
              providerAccountId: true,
              providerType: true,
            },
          },
        },
      })
      const account = accounts.find(
        (a) => a.providerType === ProviderType.WALLET,
      )
      return account?.providerAccountId || ''
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        image: z.string(),
        name: z.string().optional(),
        displayName: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.user.update({
        where: { id: ctx.token.uid },
        data: {
          ...input,
        },
      })
    }),

  ethPrice: publicProcedure.query(({ ctx }) => {
    return getEthPrice()
  }),

  getUserInfoByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          displayName: true,
          image: true,
        },
      })
      return user
    }),

  accountsByUser: publicProcedure.query(({ ctx }) => {
    return prisma.account.findMany({
      where: { userId: ctx.token.uid },
    })
  }),

  loginByPersonalToken: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const token = await prisma.accessToken.findUnique({
        where: { token: input },
      })
      if (!token) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid personal token',
        })
      }

      return getMe(token.userId, true)
    }),

  registerByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        ref: z.string().optional(),
        userId: z.string().optional(),
        password: z.string().min(6, {
          message: 'Password must be at least 6 characters.',
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [account, gmailAccount, user] = await Promise.all([
        prisma.account.findFirst({
          where: {
            providerAccountId: input.email,
          },
        }),
        prisma.account.findFirst({
          where: {
            providerType: ProviderType.GOOGLE,
            email: input.email,
          },
        }),
        prisma.user.findFirst({
          where: {
            email: input.email,
          },
        }),
      ])

      if (account || user || gmailAccount) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email already registered',
        })
      }

      const token = jwt.sign(
        {
          ...input,
          ref: input.ref || '',
        },
        process.env.NEXTAUTH_SECRET!,
        {
          expiresIn: '30d',
        },
      )

      const prefix = isProd ? 'https://' : 'http://'
      const content = getRegisterEmailTpl(
        `${prefix}${ROOT_DOMAIN}/validate-email?token=${token}`,
      )
      const result = await sendEmail({
        from: 'PenX<no-reply@penx.io>',
        to: [input.email],
        subject: 'Verify your email address',
        html: content,
        text: content.replace(/<[^>]*>/g, ''),
      })
      return true
    }),

  linkPassword: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = await prisma.account.findFirst({
        where: { providerAccountId: input.username },
      })

      if (account) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This username already existed',
        })
      }

      await prisma.account.create({
        data: {
          userId: ctx.token.uid,
          providerType: ProviderType.PASSWORD,
          providerAccountId: input.username,
          accessToken: await hashPassword(input.password),
        },
      })
    }),

  disconnectAccount: publicProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const accounts = await prisma.account.findMany({
        where: { userId: ctx.token.uid },
      })

      if (accounts.length === 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot disconnect the last account',
        })
      }

      const account = accounts.find((a) => a.id === input.accountId)

      if (account && account.providerType === ProviderType.GOOGLE) {
        await prisma.user.update({
          where: { id: ctx.token.uid },
          data: {
            email: null,
          },
        })
      }

      await prisma.account.delete({
        where: { id: input.accountId },
      })
      return true
    }),

  sendEmailLoginCode: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        userId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const alphabet = '0123456789'
      const nanoid = customAlphabet(alphabet, 6)
      let code: string

      const expireSeconds = 60 * 100
      while (true) {
        code = nanoid()

        const setResult = await redis.set(
          redisKeys.emailLoginCode(code),
          input.email,
          'EX',
          expireSeconds,
          'NX',
        )

        if (setResult === 'OK') {
          break
        }
      }

      const content = getLoginCodeEmailTpl(code)

      const result = await sendEmail({
        from: 'PenX<no-reply@penx.io>',
        to: [input.email],
        subject: `Login to PenX, Code: ${code}`,
        html: content,
        text: content.replace(/<[^>]*>/g, ''),
      })

      return code
    }),

  loginWithEmailLoginCode: publicProcedure
    .input(
      z.object({
        code: z.string(),
        userId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const email = await redis.get(redisKeys.emailLoginCode(input.code))
      if (!email) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid login code',
        })
      }

      const account = await initUserByEmailLoginCode(email, input.userId)
      const user = account.user
      const site = user.sites[0]

      const session = {} as SessionData
      session.message = ''
      session.uid = user.id
      session.userId = user.id
      session.email = user.email || ''
      session.ensName = user?.ensName as string
      session.name = user.name as string
      session.picture = user.image as string
      session.image = user.image as string
      session.siteId = site?.id
      session.activeSiteId = site?.id
      session.planType = site.sassPlanType
      session.subscriptionStatus = site.sassSubscriptionStatus || ''
      session.currentPeriodEnd = site?.sassCurrentPeriodEnd as any as string
      session.believerPeriodEnd = site?.sassBelieverPeriodEnd as any as string
      session.billingCycle = site?.sassBillingCycle as any as string
      session.isLoggedIn = true

      session.accessToken = jwt.sign(
        {
          sub: user.id,
          siteId: site.id,
          activeSiteId: site.id,
          planType: site.sassPlanType,
        },
        process.env.NEXTAUTH_SECRET!,
        {
          expiresIn: '365d',
        },
      )

      return session
    }),
})
