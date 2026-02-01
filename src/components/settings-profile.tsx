"use client";

import { useEffect, useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ordersAPI, usersAPI } from "@/lib/api";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface UserProfileProps {
  defaultValues?: Partial<ProfileFormData>;
  onSave?: (data: ProfileFormData) => void;
  className?: string;
}

const UserProfile = ({ defaultValues, className }: UserProfileProps) => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: defaultValues?.name || "",
    email: defaultValues?.email || "",
    phone: defaultValues?.phone || "",
    address: defaultValues?.address || "",
  });

  // Track original values to detect changes
  const [originalValues, setOriginalValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        // Fetch user's most recent delivered order to pre-fill address
        const orders = await ordersAPI.getUserOrders() as any[];

        if (Array.isArray(orders)) {
          // Find the most recent delivered order
          const deliveredOrders = orders.filter(
            (order: any) => order.status === "DELIVERED"
          );

          if (deliveredOrders.length > 0) {
            // Sort by createdAt descending and get the first one
            const latestOrder = deliveredOrders.sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0];

            if (latestOrder.address) {
              const orderAddress = latestOrder.address;
              const currentUserPhone = (session.user as any)?.phone;
              const currentUserAddress = (session.user as any)?.address;

              // Parse phone from order address (format: "name, address, city, postal, country, PH: phone")
              let phoneFromOrder = "";
              if (orderAddress.includes("PH:")) {
                phoneFromOrder = orderAddress.split("PH:")[1]?.trim() || "";
              }

              // Check if profile needs to be auto-updated
              const needsUpdate = !currentUserPhone || !currentUserAddress;

              if (needsUpdate) {
                // Automatically update the user's profile with order information
                const updatePayload: any = {};

                if (!currentUserPhone && phoneFromOrder) {
                  updatePayload.phone = phoneFromOrder;
                }

                if (!currentUserAddress) {
                  updatePayload.address = orderAddress;
                }

                // Only make the API call if there's something to update
                if (Object.keys(updatePayload).length > 0) {
                  try {
                    await usersAPI.updateProfile(session.user.id, updatePayload);
                    console.log("Profile auto-updated with order information");
                    // Update the form state
                    setForm((f) => ({
                      ...f,
                      phone: updatePayload.phone || f.phone,
                      address: updatePayload.address || f.address,
                    }));
                  } catch (updateError) {
                    console.error("Error auto-updating profile:", updateError);
                  }
                }
              } else {
                // Just update the form state if profile already has data
                setForm((f) => ({
                  ...f,
                  address: currentUserAddress || orderAddress,
                  phone: currentUserPhone || phoneFromOrder,
                }));
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Populate from session when available
    if (session?.user) {
      const userPhone = (session.user as any).phone || "";
      const userAddress = (session.user as any).address || "";
      const userName = (session.user.name as string) || "";
      const userEmail = session.user.email || "";

      setForm((f) => ({
        ...f,
        email: userEmail || f.email,
        name: userName || f.name,
        phone: userPhone || f.phone,
        address: userAddress || f.address,
      }));

      // Set original values for comparison
      setOriginalValues({
        name: userName,
        email: userEmail,
        phone: userPhone,
        address: userAddress,
      });

      fetchUserData();
    }
  }, [session]);

  // Check if form has changes
  const hasChanges = useMemo(() => {
    // Check if any field has changed
    return (
      form.name !== originalValues.name ||
      form.email !== originalValues.email ||
      form.phone !== originalValues.phone ||
      form.address !== originalValues.address
    );
  }, [form, originalValues]);

  return (
    <Card className={cn("w-full max-w-xl mx-auto", className)}>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Delivery Address</Label>
          <Textarea
            id="address"
            placeholder="Enter your complete delivery address"
            rows={3}
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
          <p className="text-xs text-muted-foreground">
            This address will be used for your future orders
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={() => {
            // reset form to defaults or session values
            setForm({
              name: defaultValues?.name || (session?.user?.name as string) || "",
              email: defaultValues?.email || session?.user?.email || "",
              phone: defaultValues?.phone || (session?.user as any)?.phone || "",
              address: defaultValues?.address || (session?.user as any)?.address || "",
            });
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading || !hasChanges}
          onClick={async () => {
            if (!session?.user?.id) {
              toast.error("You must be signed in to update your profile.");
              return;
            }

            setIsLoading(true);
            try {
              const payload = {
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
              };

              const data: any = await usersAPI.updateProfile(session.user.id, payload);

              toast.success(data.message || "Profile updated successfully");

              // Update original values after successful save
              setOriginalValues({
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
              });

              router.refresh();
            } catch (error) {
              console.error(error);
              toast.error(error instanceof Error ? error.message : "Failed to update profile");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export { UserProfile };
