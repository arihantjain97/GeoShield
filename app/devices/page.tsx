"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Device } from "@/types/device";
import {getCAMARADeviceStatus} from "../api/device-status/route"

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ensure rendering only happens on the client side
  useEffect(() => {
    setIsClient(true);
    loadDevices();
  }, []);

  const loadDevices = async () => {
  try {
    const res = await fetch("/api/devices");
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();

    for (const device of data) {
        const response = await getCAMARADeviceStatus(device.simNumber);
        device.connectivityStatus = response;
    }
    
    setDevices(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Failed to load device list:", error);
  } finally {
    setLoading(false);
  }
};

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-1">Devices</h1>
        <p className="text-muted-foreground mb-6">Loading devices...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1">Devices</h1>
      <p className="text-muted-foreground mb-6">
        Manage and monitor your connected devices
      </p>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y">
          <thead>
            <tr className="text-left text-sm font-semibold">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">SIM Number</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {devices.map((device) => (
              <DeviceRow key={device.id} device={device} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeviceRow({ device }: { device: Device }) {
  const [open, setOpen] = useState(false);

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      -Math.round((Date.now() - date.getTime()) / 60000),
      "minutes"
    );
  };

  return (
    <tr className="border-t hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3 font-medium">{device.name}</td>
      <td className="px-4 py-3">{device.type}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold`}>
        {device.connectivityStatus?.map((status, index) => (
        <span key={index}  className="mr-2">{status}</span>
         ))}
        </span>
      </td>
      <td className="px-4 py-3">{device.simNumber}</td>
      <td className="px-4 py-3">{formatLastUpdated(device.lastUpdated)}</td>
      <td className="px-4 py-3 relative">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          {open && (
            <DropdownMenuContent align="end" className="z-50">
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </td>
    </tr>
  );
}
