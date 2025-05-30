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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  GeofenceType, 
  GeofencePriority, 
  Geofence, 
  CircleGeofence, 
  PolygonGeofence 
} from '@/types/geofence';

interface GeofenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  geofenceId: string | null;
}

export function GeofenceDialog({ 
  open, 
  onOpenChange,
  geofenceId
}: GeofenceDialogProps) {
  const { geofences, addGeofence, updateGeofence } = useGeoShieldStore();

  const initialFormState = {
    name: '',
    description: '',
    priority: GeofencePriority.MEDIUM,
    active: true,
    geofenceType: GeofenceType.CIRCLE,
    centerLat: 1.3521,
    centerLng: 103.8198,
    radius: 500,
    coordinates: [
      { latitude: 1.3521, longitude: 103.8198 },
      { latitude: 1.3541, longitude: 103.8218 },
      { latitude: 1.3501, longitude: 103.8238 },
    ],
  };

  const [formState, setFormState] = useState(initialFormState);

  useEffect(() => {
    if (geofenceId) {
      const geofence = geofences.find(g => g.id === geofenceId);
      if (geofence) {
        let newFormState = {
          ...initialFormState,
          name: geofence.name,
          description: geofence.description || '',
          priority: geofence.priority,
          active: geofence.active,
          geofenceType: geofence.shape.type,
        };

        if (geofence.shape.type === GeofenceType.CIRCLE) {
          const circleShape = geofence.shape as CircleGeofence;
          newFormState = {
            ...newFormState,
            centerLat: circleShape.center.latitude,
            centerLng: circleShape.center.longitude,
            radius: circleShape.radius,
          };
        } else if (geofence.shape.type === GeofenceType.POLYGON) {
          const polygonShape = geofence.shape as PolygonGeofence;
          newFormState = {
            ...newFormState,
            coordinates: polygonShape.coordinates,
          };
        }

        setFormState(newFormState);
      }
    } else {
      setFormState(initialFormState);
    }
  }, [geofenceId, geofences, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Dedicated handler to update geofence type cleanly and preserve Tabs state
  const handleGeofenceTypeChange = (value: GeofenceType) => {
    setFormState(prev => ({ ...prev, geofenceType: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nativeEvent = e.nativeEvent as SubmitEvent;
    const submitter = nativeEvent?.submitter as HTMLElement;

      // Only submit if the submitter is the real submit button
    if (!submitter || submitter.tagName !== 'BUTTON' || submitter.textContent?.includes('Add Geofence') === false) {
      return;
    }

    console.log('Submitting geofence form with state:', formState); // ✅ Log form submission

    try {
      let shape: CircleGeofence | PolygonGeofence;

      if (formState.geofenceType === GeofenceType.CIRCLE) {
        shape = {
          type: GeofenceType.CIRCLE,
          center: {
            latitude: parseFloat(formState.centerLat.toString()),
            longitude: parseFloat(formState.centerLng.toString()),
          },
          radius: parseFloat(formState.radius.toString()),
        };
      } else {
        if (formState.coordinates.length < 3) {
          alert('Polygon must have at least 3 points.');
          return;
        }
        shape = {
          type: GeofenceType.POLYGON,
          coordinates: formState.coordinates,
        };
      }

      const payload = {
        name: formState.name,
        description: formState.description || undefined,
        priority: formState.priority,
        active: formState.active,
        type: formState.geofenceType,
      };

      const res = await fetch('/api/geofences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, shape }),
      });

      if (!res.ok) {
        console.error('Failed to create geofence', await res.text());
        alert('Failed to create geofence.');
        return;
      }

      const { id } = await res.json();

      addGeofence({
        id,
        ...payload,
        shape,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Exception while creating geofence:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{geofenceId ? 'Edit Geofence' : 'Add New Geofence'}</DialogTitle>
          <DialogDescription>
            {geofenceId 
              ? 'Update the details for this geofence.' 
              : 'Create a new geofenced area for monitoring devices.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown} // ✅ Prevent Enter from submitting prematurely
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleChange}
                  className="col-span-3"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">Priority</Label>
                <Select
                  value={formState.priority}
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GeofencePriority.LOW}>Low</SelectItem>
                    <SelectItem value={GeofencePriority.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={GeofencePriority.HIGH}>High</SelectItem>
                    <SelectItem value={GeofencePriority.CRITICAL}>Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">Active</Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="active"
                    checked={formState.active}
                    onCheckedChange={(checked) => handleSwitchChange('active', checked)}
                  />
                  <Label htmlFor="active" className="cursor-pointer">
                    {formState.active ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
            </div>

            {/* ✅ Tabs remain stable using state-controlled value */}
            <div className="mt-4">
              <Label className="block mb-2">Geofence Type</Label>
              <Tabs
                value={formState.geofenceType}
                onValueChange={handleGeofenceTypeChange}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value={GeofenceType.CIRCLE} asChild>
                    <button type="button">Circle</button>
                  </TabsTrigger>
                  <TabsTrigger value={GeofenceType.POLYGON} asChild>
                    <button type="button">Polygon</button>
                  </TabsTrigger>
                </TabsList>

                {/* Circle & Polygon TabsContent remain unchanged */}
                <TabsContent value={GeofenceType.CIRCLE} className="mt-4 space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="centerLat" className="text-right">Center Latitude</Label>
                    <Input
                      id="centerLat"
                      name="centerLat"
                      type="number"
                      step="0.000001"
                      value={formState.centerLat}
                      onChange={handleChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="centerLng" className="text-right">Center Longitude</Label>
                    <Input
                      id="centerLng"
                      name="centerLng"
                      type="number"
                      step="0.000001"
                      value={formState.centerLng}
                      onChange={handleChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="radius" className="text-right">Radius (meters)</Label>
                    <Input
                      id="radius"
                      name="radius"
                      type="number"
                      min="10"
                      value={formState.radius}
                      onChange={handleChange}
                      className="col-span-3"
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value={GeofenceType.POLYGON} className="mt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Define polygon vertices (at least 3 points required)
                  </p>
                  <div className="space-y-4 max-h-40 overflow-y-auto border rounded-md p-2">
                    {formState.coordinates.map((coord, index) => (
                      <div key={index} className="grid grid-cols-8 gap-2">
                        <Label className="col-span-1 flex items-center justify-end">
                          Point {index + 1}
                        </Label>
                        <Input
                          type="number"
                          step="0.000001"
                          value={coord.latitude}
                          onChange={(e) => {
                            const newCoords = [...formState.coordinates];
                            newCoords[index].latitude = parseFloat(e.target.value);
                            setFormState({ ...formState, coordinates: newCoords });
                          }}
                          placeholder="Latitude"
                          className="col-span-3"
                        />
                        <Input
                          type="number"
                          step="0.000001"
                          value={coord.longitude}
                          onChange={(e) => {
                            const newCoords = [...formState.coordinates];
                            newCoords[index].longitude = parseFloat(e.target.value);
                            setFormState({ ...formState, coordinates: newCoords });
                          }}
                          placeholder="Longitude"
                          className="col-span-3"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="col-span-1"
                          onClick={() => {
                            if (formState.coordinates.length > 3) {
                              const newCoords = [...formState.coordinates];
                              newCoords.splice(index, 1);
                              setFormState({ ...formState, coordinates: newCoords });
                            }
                          }}
                          disabled={formState.coordinates.length <= 3}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const newCoords = [...formState.coordinates];
                      const lastCoord = newCoords[newCoords.length - 1];
                      newCoords.push({
                        latitude: lastCoord.latitude + 0.001,
                        longitude: lastCoord.longitude + 0.001,
                      });
                      setFormState({ ...formState, coordinates: newCoords });
                    }}
                  >
                    Add Point
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {geofenceId ? 'Save Changes' : 'Add Geofence'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}