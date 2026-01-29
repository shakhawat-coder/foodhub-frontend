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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import * as z from "zod"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const schema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })

  type FormValues = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: FormValues) => {
    const toastId = toast.loading("Logging into your account...")
    try {
      const loginData: any = {
        email: values.email,
        password: values.password,
      }

      const { data, error } = await authClient.signIn.email(loginData)
      if (error) {
        console.error("Login Error:", error)
        toast.error(error.message, { id: toastId })
        return
      }
      toast.success("Login successful!", { id: toastId })
      reset()
      router.push("/")
    } catch (error) {
      toast.error("Something went wrong. Please try again.", { id: toastId })
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" placeholder="Your Email" {...register("email")} />
              <FieldError errors={errors.email ? [{ message: errors.email.message }] : undefined} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" placeholder="Your Password" {...register("password")} />
              <FieldError errors={errors.password ? [{ message: errors.password.message }] : undefined} />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button form="login-form" type="submit" className="w-full mt-4 cursor-pointer">
          Log In
        </Button>
        <FieldDescription className="text-center">
          Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
        </FieldDescription>
      </CardFooter>
    </Card>
  )
}
