"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { managerAPI } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const statuses = ["PENDING", "APPROVED", "BLOCKED", "REJECTED"] as const;

export default function ManagerRidersPage() {
  const [riders, setRiders] = useState<any[]>([]);

  const load = async () => {
    const data: any = await managerAPI.getRiders().catch(() => []);
    setRiders(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id: string, status: (typeof statuses)[number]) => {
    try {
      await managerAPI.updateRiderStatus(id, status);
      toast.success("Rider status updated");
      load();
    } catch (error: any) {
      toast.error(error.message || "Failed to update rider");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Riders</h1>
      <div className="grid gap-4">
        {riders.map((rider) => (
          <Card key={rider.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">{rider.user?.name || "Rider"}</CardTitle>
              <Badge>{rider.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">Phone: {rider.phone}</p>
              <p className="text-sm">Vehicle: {rider.vehicleType}</p>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <Button key={status} variant="outline" size="sm" onClick={() => update(rider.id, status)}>
                    {status}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
