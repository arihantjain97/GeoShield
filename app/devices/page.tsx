'use client';

import { useState } from 'react';
import { useGeoShieldStore } from '@/lib/store';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload, FileText, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { DeviceDialog } from '@/components/devices/device-dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { DeviceType, DeviceStatus } from '@/types/device';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function DevicesPage() {
  const { devices, removeDevice } = useGeoShieldStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<string | null>(null);
  
  // Function to handle editing a device
  const handleEditDevice = (deviceId: string) => {
    setEditingDevice(deviceId);
    setIsDialogOpen(true);
  };
  
  // Function to handle adding a new device
  const handleAddDevice = () => {
    setEditingDevice(null);
    setIsDialogOpen(true);
  };
  
  // Function to handle deleting a device
  const handleDeleteDevice = (deviceId: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      removeDevice(deviceId);
    }
  };
  
  // Function to format the last updated time
  const formatLastUpdated = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'Unknown';
    }
  };
  
  // Function to render status badge
  const renderStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-emerald-500">Active</Badge>;
      case 'INACTIVE':
        return <Badge variant="outline">Inactive</Badge>;
      case 'MAINTENANCE':
        return <Badge className="bg-yellow-500">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Devices</h1>
          <p className="text-muted-foreground">
            Manage and monitor your connected devices
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm" onClick={handleAddDevice}>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>SIM Number</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.length > 0 ? (
              devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>{renderStatusBadge(device.status)}</TableCell>
                  <TableCell>{device.simNumber}</TableCell>
                  <TableCell>{formatLastUpdated(device.lastUpdated)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditDevice(device.id)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteDevice(device.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No devices found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get started by adding your first device.
                    </p>
                    <Button className="mt-4" onClick={handleAddDevice}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Device
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      
      <DeviceDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        deviceId={editingDevice}
      />
    </div>
  );
}