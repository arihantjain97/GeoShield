'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useGeoShieldStore } from '@/lib/store';
import { AlertType, AlertSeverity } from '@/types/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bell, Check, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AlertsPage() {
  const { alerts, clearAlerts } = useGeoShieldStore();
  const [filter, setFilter] = useState<string>('all');
  
  // Filter alerts based on selected filter
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'critical') return alert.severity === AlertSeverity.CRITICAL;
    if (filter === 'error') return alert.severity === AlertSeverity.ERROR;
    if (filter === 'warning') return alert.severity === AlertSeverity.WARNING;
    if (filter === 'info') return alert.severity === AlertSeverity.INFO;
    return true;
  });
  
  // Helper function to get severity badge
  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return <Badge variant="destructive">Critical</Badge>;
      case AlertSeverity.ERROR:
        return <Badge variant="destructive">Error</Badge>;
      case AlertSeverity.WARNING:
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case AlertSeverity.INFO:
        return <Badge variant="outline">Info</Badge>;
    }
  };
  
  // Helper function to get alert icon
  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.GEOFENCE_ENTRY:
      case AlertType.GEOFENCE_EXIT:
        return <Bell className="h-5 w-5" />;
      case AlertType.DEVICE_OFFLINE:
      case AlertType.DEVICE_ONLINE:
      case AlertType.SIGNAL_LOST:
      case AlertType.SIGNAL_DEGRADED:
        return <AlertCircle className="h-5 w-5" />;
      case AlertType.BATTERY_LOW:
      case AlertType.TAMPER_DETECTED:
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  // Format relative time
  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return 'Unknown time';
    }
  };
  
  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Alerts</h1>
          <p className="text-muted-foreground">
            View and manage system alerts and notifications
          </p>
        </div>
        
        <Button variant="outline" size="sm" onClick={clearAlerts}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="error">Error</TabsTrigger>
            <TabsTrigger value="warning">Warning</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground">
            {filteredAlerts.length} {filteredAlerts.length === 1 ? 'alert' : 'alerts'}
          </div>
        </div>
        
        <TabsContent value={filter} className="mt-0">
          <Card>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {filteredAlerts.length > 0 ? (
                <div className="divide-y">
                  {filteredAlerts.map(alert => (
                    <div key={alert.id} className="p-4 hover:bg-muted/50">
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full mr-3 ${
                          alert.severity === AlertSeverity.CRITICAL || alert.severity === AlertSeverity.ERROR
                            ? 'bg-destructive/10 text-destructive'
                            : alert.severity === AlertSeverity.WARNING
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-primary/10 text-primary'
                        }`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">
                              {alert.message}
                            </h3>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-muted-foreground">
                              Device ID: {alert.deviceId}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatTime(alert.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-2">
                        <Button variant="ghost" size="sm" className="h-8">
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Acknowledge
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">No alerts found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    There are no alerts matching your filter criteria.
                  </p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}