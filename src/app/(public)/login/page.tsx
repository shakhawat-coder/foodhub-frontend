import { LoginForm } from "@/components/modules/authenticaiton/login-form"

export default function Page() {
  return (
    <div className="pt-20 md:pt-32 pb-20">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
