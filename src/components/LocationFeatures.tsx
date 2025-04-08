
import React, { useState } from 'react';
import LocationTracker from './LocationTracker';
import WeatherHistory from './WeatherHistory';
import TechnicianFinder from './TechnicianFinder';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const LocationFeatures: React.FC = () => {
  const [location, setLocation] = useState<{ latitude?: number; longitude?: number }>({});

  // This function will be called when location is updated in the LocationTracker component
  const handleLocationUpdate = (lat: number, lng: number) => {
    setLocation({ latitude: lat, longitude: lng });
  };

  return (
    <Card className="p-4 shadow-sm border">
      <h2 className="text-xl font-bold mb-4">Location Services</h2>
      <LocationTracker onLocationUpdate={handleLocationUpdate} />

      <Tabs defaultValue="weather" className="mt-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weather">Weather & UV History</TabsTrigger>
          <TabsTrigger value="technicians">D&S Technicians</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weather" className="mt-4">
          <WeatherHistory 
            latitude={location.latitude} 
            longitude={location.longitude} 
          />
        </TabsContent>
        
        <TabsContent value="technicians" className="mt-4">
          <TechnicianFinder 
            latitude={location.latitude} 
            longitude={location.longitude} 
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default LocationFeatures;
