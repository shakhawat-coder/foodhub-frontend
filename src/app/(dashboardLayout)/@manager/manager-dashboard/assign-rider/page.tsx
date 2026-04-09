"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { managerAPI } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

export default function ManagerAssignRiderPage() {
  const [orderId, setOrderId] = useState("");
  const [riderId, setRiderId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    try {
      setSubmitting(true);
      await managerAPI.assignRider(orderId, riderId);
      toast.success("Rider assigned");
      setOrderId("");
      setRiderId("");
    } catch (error: any) {
      toast.error(error.message || "Failed to assign rider");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Rider Override</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
        <Input placeholder="Rider ID" value={riderId} onChange={(e) => setRiderId(e.target.value)} />
        <Button onClick={submit} disabled={submitting || !orderId || !riderId}>
          {submitting ? "Assigning..." : "Assign Rider"}
        </Button>
      </CardContent>
    </Card>
  );
}
