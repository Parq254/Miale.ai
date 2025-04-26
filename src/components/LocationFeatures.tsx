import React, { useState, useEffect } from 'react';
import LocationTracker from './LocationTracker';
import WeatherHistory from './WeatherHistory';
import TechnicianFinder from './TechnicianFinder';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

type LocationFeaturesProps = {
  onLocationUpdate: (latitude: number, longitude: number) => void;
};

const LocationFeatures: React.FC<LocationFeaturesProps> = ({ onLocationUpdate }) => {
  const [location, setLocation] = useState<{ latitude?: number; longitude?: number }>({});

  const handleLocationUpdate = (lat: number, lng: number) => {
    setLocation({ latitude: lat, longitude: lng });
    onLocationUpdate(lat, lng); // Pass the updated location to the parent
  };

  useEffect(() => {
    const latitude = -1.286389; 
    const longitude = 36.817223; 
    setLocation({ latitude, longitude });
    onLocationUpdate(latitude, longitude);
  }, [onLocationUpdate]);

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
