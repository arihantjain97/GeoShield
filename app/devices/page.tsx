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

interface Device {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive";
  simNumber: string;
  lastUpdated: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const initialDevices: Device[] = [
      {
        id: "1",
        name: "Armored Truck #1",
        type: "VEHICLE",
        status: "active",
        simNumber: "65912345678",
        lastUpdated: "2 minutes ago",
      },
      {
        id: "2",
        name: "Armored Truck #2",
        type: "VEHICLE",
        status: "active",
        simNumber: "65912345679",
        lastUpdated: "2 minutes ago",
      },
      {
        id: "3",
        name: "Guard #1 Mobile",
        type: "PERSONNEL",
        status: "active",
        simNumber: "65912345680",
        lastUpdated: "2 minutes ago",
      },
      {
        id: "4",
        name: "High-Value Container",
        type: "CONTAINER",
        status: "active",
        simNumber: "65912345681",
        lastUpdated: "2 minutes ago",
      },
      {
        id: "5",
        name: "Backup Tracker",
        type: "ASSET",
        status: "inactive",
        simNumber: "65912345682",
        lastUpdated: "2 minutes ago",
      },
    ];
    setDevices(initialDevices);
  }, []);

  if (!isClient) {
    return null; // Prevent hydration mismatch by not rendering anything on server
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

  return (
    <tr className="border-t hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3 font-medium">{device.name}</td>
      <td className="px-4 py-3">{device.type}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
            device.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
        </span>
      </td>
      <td className="px-4 py-3">{device.simNumber}</td>
      <td className="px-4 py-3">{device.lastUpdated}</td>
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
                <FileText className="mr-2 h-4 w-4" /> View Details
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