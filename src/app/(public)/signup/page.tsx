import { SignupForm } from "@/components/modules/authenticaiton/signup-form";

export default function Page() {
  return (
    <div className="pt-20 md:pt-32 pb-20">
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
