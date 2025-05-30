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

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "",
    phone_number: "",
  });


  // Ensure rendering only happens on the client side
  useEffect(() => {
    setIsClient(true);
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const res = await fetch("/api/devices", { method: "GET" });
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();

      for (const device of data) {
        const res = await fetch(`/api/device-status/${device.simNumber}`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        device.connectivityStatus = data.connectivity;
        device.lastUpdated = data.lastStatusTime;
      }

      setDevices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load device list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevices();
  }, [reloadFlag]);


  const addDevice = async () => {
    try {
      const postData = {
        name: formData.name,
        type: formData.type,
        status: formData.status,
        phone_number: formData.phone_number
      };
      await fetch("/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

    } catch (error) {
      console.error("Failed to add device", error);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await fetch(`/api/devices`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await addDevice();
      }

      setPopUp(false);
      setReloadFlag(prev => prev + 1);
      setFormData({
        name: "",
        type: "",
        status: "",
        phone_number: "",
      });
      setIsEditMode(false);
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const handleReload = () => {
    setReloadFlag(prev => prev + 1);
    console.log("i am here");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between w-full mb-6">
        <div className="flex items-baseline gap-2">
          <h1 className="text-2xl font-bold">Devices</h1>
          <p className="text-muted-foreground">Manage and monitor your connected devices</p>
        </div>
        <button
          className="bg-white border border-black text-black px-4 py-2 rounded hover:bg-gray-100"
          onClick={() => {
            setPopUp(true);
            setIsEditMode(false);
            setFormData({
              name: "",
              type: "",
              status: "",
              phone_number: "",
            });
          }}
        >
          Add
        </button>      </div>
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
              <DeviceRow
                key={device.id}
                device={device}
                onDeleteSuccess={handleReload}
                onEdit={(device) => {
                  setFormData({
                    name: device.name,
                    type: device.type,
                    status: device.status,
                    phone_number: device.simNumber,
                  });
                  setIsEditMode(true);
                  setPopUp(true);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
      {popUp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit Device" : "Add New Device"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="VEHICLE">VEHICLE</option>
                <option value="PERSONNEL">PERSONNEL</option>
                <option value="CONTAINER">CONTAINER</option>
                <option value="ASSET">ASSET</option>
              </select>

              {/* Dropdown for Status */}
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="Active">Active</option>
                <option value="InActive">InActive</option>
              </select>

              <input
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={isEditMode}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setPopUp(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function DeviceRow({ device, onDeleteSuccess, onEdit, }: {
  device: Device; onDeleteSuccess: () => void;
  onEdit: (device: Device) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleDelete = (simNumber: string) => {
    if (confirm(`Are you sure you want to delete device with SIM ${simNumber}?`)) {
      fetch(`/api/device-status/${simNumber}`, {
        method: 'DELETE',
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to delete device');
          alert('Device deleted successfully');
          onDeleteSuccess();
          // optionally refresh or update UI here
        })
        .catch(err => alert(`Error deleting device: ${err.message}`));
    }
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <tr className="border-t hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3 font-medium">{device.name}</td>
      <td className="px-4 py-3">{device.type}</td>
      <td className="px-4 py-3">
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold`}>
          {device.connectivityStatus?.map((status, index) => (
            <span key={index} className="mr-2">{status}</span>
          ))}
        </span>
      </td>
      <td className="px-4 py-3">{device.simNumber}</td>
      <td className="px-4 py-3">{formatLastUpdated(device.lastUpdated)}</td>
      <td className="px-4 py-3 relative">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setOpen(prev => !prev)}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          {open && (
            <DropdownMenuContent align="end" className="z-50 bg-white">
              <DropdownMenuItem onClick={() => onEdit(device)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(device.simNumber)} // pass simNumber here
                className="text-red-600 hover:bg-red-100"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </td>
    </tr>
  );
}
