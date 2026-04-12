"use client";
import DashboardLoading from "@/components/common/DashboardLoading";

import { useEffect, useState } from "react";
import { Loader2, Store } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { providersAPI } from "@/lib/api";
import ImageUpload from "@/components/common/ImageUpload";
import ProfilePictureUpload from "@/components/common/ProfilePictureUpload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

const DEFAULT_LOGO = "/restaurantlogo.png";

export default function ProviderProfilePage() {
  const { data: session } = authClient.useSession();
  const [provider, setProvider] = useState<any>(null);
  const [logo, setLogo] = useState<string>(DEFAULT_LOGO);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!session?.user?.email) return;
      try {
        setLoading(true);
        const providerData: any = await providersAPI.getByEmail(session.user.email);
        setProvider(providerData);
        setLogo(providerData?.logo || DEFAULT_LOGO);
      } catch (error) {
        toast.error("Failed to load provider profile");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [session]);

  const handleUpdateLogo = async () => {
    if (!provider?.id) return;
    try {
      setIsUpdating(true);
      await providersAPI.update(provider.id, { logo });
      toast.success("Logo updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update logo");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          Provider Profile
        </h1>
        <p className="mt-2 text-muted-foreground">Manage your business identity and information.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* User Profile Picture Card (For Provider User) */}
        <Card className="border shadow-sm lg:col-span-2">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Avatar
             </CardTitle>
             <CardDescription>Your personal profile picture (different from restaurant logo).</CardDescription>
           </CardHeader>
           <CardContent className="flex flex-col items-center py-6">
              <ProfilePictureUpload
                currentImage={session?.user?.image}
                userName={session?.user?.name}
                size="lg"
              />
           </CardContent>
        </Card>

        <Card className="border-primary/10 pt-0 shadow-lg">
          <CardHeader className="bg-primary/5 pb-6 pt-4">
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle>Restaurant Logo</CardTitle>
            </div>
            <CardDescription>Upload your restaurant logo to represent your brand.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <ImageUpload
              onUploadComplete={(url) => setLogo(url)}
              defaultValue={logo}
              label="Logo Image"
            />
            <div className="flex justify-end border-t pt-4">
              <Button
                onClick={handleUpdateLogo}
                disabled={isUpdating || !logo}
                className="w-full px-8 md:w-auto"
              >
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Logo
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Your registered business details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-3 border-b border-muted py-3">
              <span className="text-sm font-medium text-muted-foreground">Name</span>
              <span className="col-span-2 text-sm">{provider?.name || "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-muted py-3">
              <span className="text-sm font-medium text-muted-foreground">Email</span>
              <span className="col-span-2 text-sm">{provider?.email || "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-muted py-3">
              <span className="text-sm font-medium text-muted-foreground">Phone</span>
              <span className="col-span-2 text-sm">{provider?.phone || "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-muted py-3">
              <span className="text-sm font-medium text-muted-foreground">Address</span>
              <span className="col-span-2 text-sm">{provider?.address || "N/A"}</span>
            </div>
            <div className="grid grid-cols-3 py-3">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <span className="col-span-2">
                <Badge
                  variant={provider?.isActive ? "outline" : "destructive"}
                  className={provider?.isActive ? "border-green-200 bg-green-100 text-green-700" : ""}
                >
                  {provider?.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
