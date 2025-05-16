'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { FileUpload } from '@penx/components/FileUpload'
import { useSession } from '@penx/session'
import { api, trpc } from '@penx/trpc-client'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@penx/uikit/form'
import { Input } from '@penx/uikit/input'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Textarea } from '@penx/uikit/textarea'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

const FormSchema = z.object({
  image: z.string().min(1, { message: 'Please upload your avatar' }),
  displayName: z.string().min(1, {
    message: 'Display name must be at least 1 characters.',
  }),
  bio: z.string(),
})

export function ProfileSettingForm() {
  const { isPending, mutateAsync } = trpc.user.updateProfile.useMutation()
  const { data, refetch } = trpc.user.me.useQuery()
  const { update } = useSession()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: '',
      displayName: '',
      bio: '',
    },
  })

  useEffect(() => {
    if (!data) return
    form.reset({
      image: data.image || '',
      displayName: data.displayName || '',
      bio: data.bio || '',
    })
  }, [data, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync(data)
      refetch()
      update({
        type: 'update-profile',
        ...data,
      })
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col justify-center gap-3">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => <FileUpload {...field} />}
          />
        </div>

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Bio</FormLabel>
              <FormDescription>A brief your introduction.</FormDescription>
              <FormControl>
                <Textarea placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button size="lg" type="submit" className="w-32">
            {isPending ? <LoadingDots /> : <p>Save</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
