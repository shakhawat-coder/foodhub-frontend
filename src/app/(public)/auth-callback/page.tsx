"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending) {
            if (session?.user) {
                const role = (session.user.role as string)?.toLowerCase();
                
                toast.success("Login successful!");
                
                // Redirect based on user role
                if (role === "admin") {
                    router.push("/admin-dashboard");
                } else if (role === "provider") {
                    router.push("/provider-dashboard");
                } else if (role === "manager") {
                    router.push("/manager-dashboard");
                } else if (role === "rider") {
                    router.push("/rider-dashboard");
                } else {
                    // Default: regular user/customer goes to homepage
                    router.push("/");
                }
            } else {
                // If no session found after callback, something went wrong or login was cancelled
                router.push("/login");
            }
        }
    }, [session, isPending, router]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                    </div>
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">Completing Login</h2>
                    <p className="text-sm text-muted-foreground animate-pulse">
                        Please wait while we set up your session...
                    </p>
                </div>
            </div>
        </div>
    );
}
