"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { riderAPI } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export default function RiderProfilePage() {
  const [form, setForm] = useState({
    phone: "",
    vehicleType: "",
    lat: "",
    lng: "",
  });
  const [saving, setSaving] = useState(false);

  const onSubmit = async () => {
    try {
      setSaving(true);
      await riderAPI.updateProfile({
        phone: form.phone || undefined,
        vehicleType: form.vehicleType || undefined,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
      });
      toast.success("Profile updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rider Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
        />
        <Input
          placeholder="Vehicle Type"
          value={form.vehicleType}
          onChange={(e) => setForm((s) => ({ ...s, vehicleType: e.target.value }))}
        />
        <Input
          placeholder="Latitude"
          value={form.lat}
          onChange={(e) => setForm((s) => ({ ...s, lat: e.target.value }))}
        />
        <Input
          placeholder="Longitude"
          value={form.lng}
          onChange={(e) => setForm((s) => ({ ...s, lng: e.target.value }))}
        />
        <Button onClick={onSubmit} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </CardContent>
    </Card>
  );
}
