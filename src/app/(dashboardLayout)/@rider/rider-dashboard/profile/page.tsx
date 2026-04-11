"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { riderAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Phone, Truck, MapPin, Save, User, Globe } from "lucide-react";

export default function RiderProfilePage() {
  const [form, setForm] = useState({
    phone: "",
    vehicleType: "",
    lat: "",
    lng: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await riderAPI.getProfile();
        if (profile) {
          setForm({
            phone: profile.phone || "",
            vehicleType: profile.vehicleType || "",
            lat: profile.lat?.toString() || "",
            lng: profile.lng?.toString() || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const onSubmit = async () => {
    try {
      setSaving(true);
      await riderAPI.updateProfile({
        phone: form.phone || undefined,
        vehicleType: form.vehicleType || undefined,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
      });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          Rider Profile
        </h1>
        <p className="text-muted-foreground mt-1">Manage your professional delivery information.</p>
      </div>

      <Card className="border-muted/60 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            General Information
          </CardTitle>
          <CardDescription>All fields are used for delivery coordination.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                Phone Number
              </label>
              <Input
                placeholder="+1 234 567 890"
                value={form.phone}
                onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                className="bg-muted/5 border-muted-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Truck className="h-3.5 w-3.5" />
                Vehicle Type
              </label>
              <Input
                placeholder="Bike, Car, Van..."
                value={form.vehicleType}
                onChange={(e) => setForm((s) => ({ ...s, vehicleType: e.target.value }))}
                className="bg-muted/5 border-muted-foreground/20"
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                Real-time Location
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                    Latitude
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="0.0000"
                        className="pl-9 bg-muted/5 border-muted-foreground/20"
                        value={form.lat}
                        onChange={(e) => setForm((s) => ({ ...s, lat: e.target.value }))}
                    />
                </div>
                </div>
                <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                    Longitude
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="0.0000"
                        className="pl-9 bg-muted/5 border-muted-foreground/20"
                        value={form.lng}
                        onChange={(e) => setForm((s) => ({ ...s, lng: e.target.value }))}
                    />
                </div>
                </div>
            </div>
          </div>

          <div className="pt-2">
            <Button 
                onClick={onSubmit} 
                disabled={saving} 
                className="w-full sm:w-auto font-bold gap-2 px-8 shadow-lg shadow-primary/20"
            >
                {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Save className="h-4 w-4" />
                )}
                {saving ? "Saving Changes..." : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

