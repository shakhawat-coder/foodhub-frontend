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
import { riderAPI } from "@/lib/api"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  isProvider: z.boolean(),
  isRider: z.boolean(),
  phone: z.string().optional(),
  address: z.string().optional(),
  vehicleType: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isProvider && data.isRider) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select either Provider or Rider signup, not both",
      path: ["isProvider"],
    });
  }

  if (data.isProvider || data.isRider) {
    if (!data.phone || data.phone.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Phone is required",
        path: ["phone"],
      });
    }
  }

  if (data.isProvider) {
    if (!data.address || data.address.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address is required for providers",
        path: ["address"],
      });
    }
  }

  if (data.isRider && (!data.vehicleType || data.vehicleType.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Vehicle type is required for riders",
      path: ["vehicleType"],
    });
  }
});

type FormValues = z.infer<typeof signupSchema>;

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      isProvider: false,
      isRider: false,
      phone: '',
      address: '',
      vehicleType: '',
    },
  });

  const isProvider = watch("isProvider");
  const isRider = watch("isRider");

  const onSubmit = async (values: FormValues) => {
    const toastId = toast.loading("Creating your account...")
    try {
      if (values.isRider) {
        await riderAPI.signup({
          name: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone || "",
          vehicleType: values.vehicleType || "",
          address: values.address,
        });
      } else {
        const signupData: any = {
          name: values.name,
          email: values.email,
          password: values.password,
        }

        if (values.isProvider) {
          signupData.role = 'PROVIDER'
          signupData.phone = values.phone
          signupData.address = values.address
        }

        const { error } = await authClient.signUp.email(signupData)
        if (error) {
          console.error("Signup Error:", error)
          toast.error(error.message, { id: toastId })
          return
        }
      }
      toast.success("Account created successfully!", { id: toastId })
      reset()

      if (values.isRider) {
        router.push("/login")
      } else if (!values.isProvider) {
        router.push("/")
      } else {
        router.push("/provider-dashboard")
      }

    } catch (error) {
      toast.error("Something went wrong. Please try again.", { id: toastId })
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="signup-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" placeholder="Your Name/Business Name" {...register("name")} />
              <FieldError errors={errors.name ? [{ message: errors.name.message }] : undefined} />
            </Field>
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

          <FieldGroup className="mt-4">
            <Field orientation="horizontal">
              <Checkbox
                id="provider-checkbox"
                checked={isProvider}
                onCheckedChange={(checked) => setValue("isProvider", checked as boolean)}
              />
              <FieldLabel htmlFor="provider-checkbox">
                Sign up as Provider
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox
                id="rider-checkbox"
                checked={isRider}
                onCheckedChange={(checked) => setValue("isRider", checked as boolean)}
              />
              <FieldLabel htmlFor="rider-checkbox">
                Sign up as Rider
              </FieldLabel>
            </Field>
          </FieldGroup>

          {/* Conditional fields for Provider */}
          {(isProvider || isRider) && (
            <FieldGroup className="mt-4">
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input id="phone" type="tel" placeholder="Your Phone Number" {...register("phone")} />
                <FieldError errors={errors.phone ? [{ message: errors.phone.message }] : undefined} />
              </Field>
              {isProvider && (
                <Field>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Input id="address" placeholder="Your Address" {...register("address")} />
                  <FieldError errors={errors.address ? [{ message: errors.address.message }] : undefined} />
                </Field>
              )}
              {isRider && (
                <>
                  <Field>
                    <FieldLabel htmlFor="vehicleType">Vehicle Type</FieldLabel>
                    <Input id="vehicleType" placeholder="Bike / Car / Scooter" {...register("vehicleType")} />
                    <FieldError errors={errors.vehicleType ? [{ message: errors.vehicleType.message }] : undefined} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="address">Address (optional)</FieldLabel>
                    <Input id="address" placeholder="Your Address" {...register("address")} />
                  </Field>
                </>
              )}
            </FieldGroup>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button form="signup-form" type="submit" className="w-full mt-4 cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Sign Up"}
        </Button>
        <FieldDescription className="text-center">
          Already have an account? <Link href="/login">Sign In</Link>
        </FieldDescription>
      </CardFooter>
    </Card>
  )
}