"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

const FormSchema = z.object({
  bio: z
    .string()
    .min(10, {
      message: "Text must be at least 10 characters.",
    })
    .max(5000, {
      message: "Text must not be longer than 5000 characters.",
    }),
})

export default function TextareaForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const router = useRouter()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Store text in sessionStorage and navigate to reading page
    sessionStorage.setItem('readingText', data.bio)
    router.push('/read')
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-background overflow-hidden">
      <div className="w-full max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="What would you like to read? Enter your text here."
                    className="resize-none min-h-[300px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Start Reading</Button>
        </form>
      </Form>
      </div>
    </div>
  )
}