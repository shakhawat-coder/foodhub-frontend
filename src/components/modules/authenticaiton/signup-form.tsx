"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useForm } from '@tanstack/react-form'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { id } from "zod/v4/locales"

import * as z from "zod"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      isProvider: false,
      phone: '',
      address: '',
    },
    validators: {
      onSubmit: ({ value }) => {
        const errors: Record<string, string> = {}

        if (!value.name || value.name.length < 2) {
          errors.name = "Name must be at least 2 characters."
        }

        if (!value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
          errors.email = "Invalid email address."
        }

        if (!value.password || value.password.length < 6) {
          errors.password = "Password must be at least 6 characters."
        }

        if (value.isProvider) {
          if (!value.phone || value.phone.trim() === '') {
            errors.phone = "Phone is required for providers"
          }
          if (!value.address || value.address.trim() === '') {
            errors.address = "Address is required for providers"
          }
        }

        return Object.keys(errors).length > 0 ? errors : undefined
      }
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating your account...")
      try {
        const signupData: any = {
          name: value.name,
          email: value.email,
          password: value.password,
        }

        // Only add extra fields if signing up as a provider
        if (value.isProvider) {
          signupData.role = 'PROVIDER'
          signupData.phone = value.phone
          signupData.address = value.address
        }

        const { data, error } = await authClient.signUp.email(signupData)
        if (error) {
          console.error("Signup Error:", error) // Debug the 422 error
          toast.error(error.message, { id: toastId })
          return
        }
        toast.success("Account created successfully! Please check your email to verify your account.", { id: toastId })
        form.reset()
      } catch (error) {
        toast.error("Something went wrong. Please try again.", { id: toastId })
      }
    },

  })
  const session = authClient.useSession()
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="signup-form" onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(e)
        }}>
          <FieldGroup>
            <form.Field name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="text"
                      placeholder="Your Name"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }} />
            <form.Field name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="email"
                      placeholder="Your Email"

                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }} />
            <form.Field name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="password"
                      placeholder="Your Password"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }} />
          </FieldGroup>
          <form.Field name="isProvider"
            children={(field) => {
              return (
                <FieldGroup className="mt-4">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="provider-checkbox"
                      name="provider-checkbox"
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked as boolean)}
                    />
                    <FieldLabel htmlFor="provider-checkbox">
                      Sign up as Provider
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              )
            }} />

          {/* Conditional fields for Provider */}
          <form.Subscribe
            selector={(state) => state.values.isProvider}
            children={(isProvider) => {
              if (!isProvider) return null
              return (
                <FieldGroup className="mt-4">
                  <form.Field name="phone"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field>
                          <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="tel"
                            placeholder="Your Phone Number"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }} />
                  <form.Field name="address"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field>
                          <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="text"
                            placeholder="Your Address"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }} />
                </FieldGroup>
              )
            }}
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button form="signup-form" type="submit" className="w-full mt-4 cursor-pointer">
          Sign Up
        </Button>
        <FieldDescription className="text-center">
          Already have an account? <Link href="/login">Sign In</Link> or
        </FieldDescription>
      </CardFooter>
    </Card>
  )
}
