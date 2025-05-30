'use client';

import { useEffect, useState } from 'react';
import { useGeoShieldStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GeofenceDialog } from '@/components/geofences/geofence-dialog';
import { GeofenceMap } from '@/components/geofences/geofence-map';
import { Geofence, GeofencePriority } from '@/types/geofence';

export default function GeofencesPage() {
  const {
    geofences,
    addGeofence,
    updateGeofence,
    removeGeofence,
    setGeofences
  } = useGeoShieldStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
  const loadGeofences = async () => {
      try {
        const res = await fetch('/api/geofences');
        if (!res.ok) throw new Error('Failed to fetch geofences');
        const data = await res.json();
        console.log('Loaded geofences from backend:', data);
        setGeofences(data);
      } catch (error) {
        console.error('Error loading geofences:', error);
      }
    };
    loadGeofences();
  }, [setGeofences]);


  // Handle adding a new geofence
  const handleAddGeofence = async () => {
    setEditingGeofence(null);
    setIsDialogOpen(true);
  };


  const handleDialogSubmit = async (data: Partial<Geofence>) => {
    try {
      const res = await fetch('/api/geofences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create geofence');

      const { id } = await res.json();

      // Add to local store
      addGeofence({
        id,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Geofence);

      setIsDialogOpen(false);
    } catch (err) {
      console.error('Failed to add geofence:', err);
    }
  };

  // Handle editing a geofence
  const handleEditGeofence = (geofenceId: string) => {
    setEditingGeofence(geofenceId);
    setIsDialogOpen(true);
  };

  // Delete geofence via API
  const handleDeleteGeofence = async (geofenceId: string) => {
    if (!confirm('Are you sure you want to delete this geofence?')) return;
    try {
      const res = await fetch(`/api/geofences/${geofenceId}/delete`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete geofence');
      console.log('Deleted geofence:', geofenceId);
      removeGeofence(geofenceId);
    } catch (error) {
      console.error('Error deleting geofence:', error);
    }
  };

  // Render geofence priority badge
  const renderPriorityBadge = (priority: GeofencePriority) => {
    switch (priority) {
      case 'LOW':
        return <Badge variant="outline">Low</Badge>;
      case 'MEDIUM':
        return <Badge variant="secondary">Medium</Badge>;
      case 'HIGH':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'CRITICAL':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Geofences</h1>
          <p className="text-muted-foreground">
            Create and manage geofenced areas for your devices
          </p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
            <Map className="h-4 w-4 mr-2" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleAddGeofence}>
            <Plus className="h-4 w-4 mr-2" />
            Add Geofence
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={showMap ? "lg:col-span-1" : "lg:col-span-3"}>
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Geofence List</h2>

            {geofences.length > 0 ? (
              <div className="space-y-4">
                {geofences.map((geofence) => (
                  <div key={geofence.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{geofence.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {geofence.description || 'No description provided'}
                        </p>
                      </div>
                      <div>{renderPriorityBadge(geofence.priority)}</div>
                    </div>

                    <div className="flex items-center mt-2">
                      <span className="text-xs text-muted-foreground">
                        Type: {geofence.shape.type}
                      </span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {geofence.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditGeofence(geofence.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteGeofence(geofence.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Map className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 text-lg font-medium">No geofences found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get started by adding your first geofence.
                </p>
                <Button variant="outline" className="mt-4" onClick={handleAddGeofence}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Geofence
                </Button>
              </div>
            )}
          </Card>
        </div>

        {showMap && (
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="h-[calc(100vh-12rem)]">
                <GeofenceMap
                  geofences={geofences}
                  onAddGeofence={handleAddGeofence}
                  onEditGeofence={handleEditGeofence}
                />
              </div>
            </Card>
          </div>
        )}
      </div>

      <GeofenceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        geofence={
          geofences.find((g) => g.id === editingGeofence) || null
        }
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}