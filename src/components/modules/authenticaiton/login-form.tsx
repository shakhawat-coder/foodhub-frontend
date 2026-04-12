"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import { useRouter } from "next/navigation" 
import { IconBrandGoogle } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) { 
  const router = useRouter() 
  const quickLoginCredentials = [ 
    { label: "Customer", email: "shamim5@gmail.com", password: "123456" },
    { label: "Provider", email: "shamim1@gmail.com", password: "123456" },
    { label: "Rider", email: "rider1@gmail.com", password: "rider1" },
    { label: "Manager", email: "manager1@gmail.com", password: "manager1" },
    { label: "Admin", email: "admin@example.com", password: "password" },
  ] as const 
  const schema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })

  type FormValues = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  const loginWithCredentials = async (values: FormValues) => {
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

      // Determine user role from response and redirect accordingly
      const user = (data as any)?.user ?? (data as any)?.session?.user
      const role = (user?.role as string | undefined)?.toLowerCase()
      console.debug("login response user:", user, "role:", role)

      toast.success("Login successful!", { id: toastId })
      reset()

      if (role === "admin") {
        router.push("/admin-dashboard")
        return
      }

      if (role === "provider") {
        router.push("/provider-dashboard")
        return
      }

      if (role === "manager") {
        router.push("/manager-dashboard")
        return
      }

      if (role === "rider") {
        router.push("/rider-dashboard")
        return
      }

      // Default: regular user goes to homepage
      router.push("/")
    } catch (error) {
      toast.error("Something went wrong. Please try again.", { id: toastId })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth-callback`, 
      })
    } catch (error) {
      console.error("Google login error:", error)
      toast.error("Failed to initiate Google login.")
    }
  }

  const onSubmit = async (values: FormValues) => {
    await loginWithCredentials(values)
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
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium">Quick Login Credentials</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {quickLoginCredentials.map((account) => (
              <Button
                key={account.label}
                type="button"
                variant="outline"
                className="h-auto items-start justify-start p-3 text-left"
                onClick={() =>
                  loginWithCredentials({
                    email: account.email,
                    password: account.password,
                  })
                }
                disabled={isSubmitting}
              >
                <div>
                  <p className="font-medium">{account.label}</p>
                  {/* <p className="text-muted-foreground text-xs">{account.email}</p>
                  <p className="text-muted-foreground text-xs">{account.password}</p> */}
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button form="login-form" type="submit" className="w-full mt-4 cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log In"}
        </Button>

        <div className="flex items-center gap-4 w-full">
          <Separator className="flex-1" />
          <span className="text-muted-foreground text-xs uppercase">Or</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
        >
          <IconBrandGoogle className="mr-2 h-4 w-4" />
          Login with Google
        </Button>
        <FieldDescription className="text-center">
          Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
        </FieldDescription>
      </CardFooter>
    </Card>
  )
}