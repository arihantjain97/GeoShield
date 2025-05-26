'use client';

import { useState } from 'react';
import { useGeoShieldStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GeofenceDialog } from '@/components/geofences/geofence-dialog';
import { GeofenceMap } from '@/components/geofences/geofence-map';
import { GeofencePriority } from '@/types/geofence';

export default function GeofencesPage() {
  const { geofences, removeGeofence } = useGeoShieldStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);
  
  // Handle adding a new geofence
  const handleAddGeofence = () => {
    setEditingGeofence(null);
    setIsDialogOpen(true);
  };
  
  // Handle editing a geofence
  const handleEditGeofence = (geofenceId: string) => {
    setEditingGeofence(geofenceId);
    setIsDialogOpen(true);
  };
  
  // Handle deleting a geofence
  const handleDeleteGeofence = (geofenceId: string) => {
    if (confirm('Are you sure you want to delete this geofence?')) {
      removeGeofence(geofenceId);
    }
  };
  
  // Helper function to render priority badge
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
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Geofences</h1>
          <p className="text-muted-foreground">
            Create and manage geofenced areas for your devices
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
            <Map className="h-4 w-4 mr-2" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
          <Button size="sm" onClick={handleAddGeofence}>
            <Plus className="h-4 w-4 mr-2" />
            Add Geofence
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Geofence list */}
        <div className={showMap ? "lg:col-span-1" : "lg:col-span-3"}>
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Geofence List</h2>
            
            {geofences.length > 0 ? (
              <div className="space-y-4">
                {geofences.map(geofence => (
                  <div key={geofence.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{geofence.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {geofence.description || 'No description provided'}
                        </p>
                      </div>
                      <div>
                        {renderPriorityBadge(geofence.priority)}
                      </div>
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
                <Button className="mt-4" onClick={handleAddGeofence}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Geofence
                </Button>
              </div>
            )}
          </Card>
        </div>
        
        {/* Map view */}
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
        geofenceId={editingGeofence}
      />
    </div>
  );
}