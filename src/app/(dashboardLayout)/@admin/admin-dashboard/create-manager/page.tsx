"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { managerAPI } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateManagerPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      await managerAPI.createManager(form);
      toast.success("Manager account created");
      setForm({ name: "", email: "", password: "", phone: "", address: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to create manager");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Manager Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
        <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
        <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
        <Input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
        <Input placeholder="Address (optional)" value={form.address} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} />
        <Button onClick={submit} disabled={loading || !form.name || !form.email || !form.password}>
          {loading ? "Creating..." : "Create Manager"}
        </Button>
      </CardContent>
    </Card>
  );
}
