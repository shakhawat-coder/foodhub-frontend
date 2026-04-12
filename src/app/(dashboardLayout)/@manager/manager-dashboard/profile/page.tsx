"use client";

import { UserProfile } from "@/components/settings-profile";


export default function ManagerProfilePage() {
  
  return (
    <div className="space-y-8 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          Manager Profile
        </h1>
        <p className="mt-2 text-muted-foreground">Manage your manager account details.</p>
      </div>
      <UserProfile />
    </div>
  );
}
