'use client';

import { useState, useEffect } from 'react';
import { useGeoShieldStore } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeviceType, DeviceStatus, Device } from '@/types/device';

interface DeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string | null;
}

export function DeviceDialog({ 
  open, 
  onOpenChange,
  deviceId
}: DeviceDialogProps) {
  const { devices, addDevice, updateDevice } = useGeoShieldStore();
  
  // Initial form state
  const initialFormState = {
    name: '',
    type: DeviceType.VEHICLE,
    status: DeviceStatus.ACTIVE,
    simNumber: '',
    imei: '',
    description: '',
    assignedTo: '',
    tags: '',
  };
  
  const [formState, setFormState] = useState(initialFormState);
  
  // Load device data if editing
  useEffect(() => {
    if (deviceId) {
      const device = devices.find(d => d.id === deviceId);
      if (device) {
        setFormState({
          name: device.name,
          type: device.type,
          status: device.status,
          simNumber: device.simNumber,
          imei: device.imei || '',
          description: device.description || '',
          assignedTo: device.assignedTo || '',
          tags: device.tags ? device.tags.join(', ') : '',
        });
      }
    } else {
      setFormState(initialFormState);
    }
  }, [deviceId, devices, open]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse tags from comma-separated string
    const tags = formState.tags
      ? formState.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : undefined;
    
    const deviceData: Partial<Device> = {
      name: formState.name,
      type: formState.type,
      status: formState.status,
      simNumber: formState.simNumber,
      imei: formState.imei || undefined,
      description: formState.description || undefined,
      assignedTo: formState.assignedTo || undefined,
      tags,
      lastUpdated: new Date().toISOString(),
    };
    
    if (deviceId) {
      // Update existing device
      updateDevice(deviceId, deviceData);
    } else {
      // Add new device
      addDevice({
        id: uuidv4(),
        ...deviceData as Device,
      });
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{deviceId ? 'Edit Device' : 'Add New Device'}</DialogTitle>
          <DialogDescription>
            {deviceId 
              ? 'Update the details for this device.' 
              : 'Fill out the form below to add a new device to the system.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Device Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            {/* Device Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={formState.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DeviceType.VEHICLE}>Vehicle</SelectItem>
                  <SelectItem value={DeviceType.PERSONNEL}>Personnel</SelectItem>
                  <SelectItem value={DeviceType.CONTAINER}>Container</SelectItem>
                  <SelectItem value={DeviceType.ASSET}>Asset</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Device Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formState.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select device status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DeviceStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={DeviceStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={DeviceStatus.MAINTENANCE}>Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* SIM Number */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="simNumber" className="text-right">
                SIM Number
              </Label>
              <Input
                id="simNumber"
                name="simNumber"
                value={formState.simNumber}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            {/* IMEI */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imei" className="text-right">
                IMEI
              </Label>
              <Input
                id="imei"
                name="imei"
                value={formState.imei}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            
            {/* Assigned To */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedTo" className="text-right">
                Assigned To
              </Label>
              <Input
                id="assignedTo"
                name="assignedTo"
                value={formState.assignedTo}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            
            {/* Tags */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                value={formState.tags}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Comma-separated tags"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {deviceId ? 'Save Changes' : 'Add Device'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}