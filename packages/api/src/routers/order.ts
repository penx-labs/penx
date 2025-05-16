import Stripe from 'stripe'
import { prisma } from '@penx/db'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const orderRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const orders = await prisma.order.findMany({
      where: { siteId: ctx.activeSiteId },
      include: {
        product: true,
      },
    })

    return orders.map((order) => ({
      ...order,
      customer: order.customer as any as Stripe.Customer,
    }))
  }),
})
