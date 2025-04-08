
import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type LocationData = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  address?: string; // Making address optional with ? since it might not always be available
};

interface LocationTrackerProps {
  onLocationUpdate?: (latitude: number, longitude: number) => void;
}

const LocationTracker: React.FC<LocationTrackerProps> = ({ onLocationUpdate }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Create newLocation with the optional address property explicitly included
        const newLocation: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          address: undefined // Initialize with undefined, will be updated if data is available
        };
        
        // Try to get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=pk.placeholder&limit=1`
          );
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            newLocation.address = data.features[0].place_name;
          }
        } catch (error) {
          console.error('Error fetching address:', error);
        }

        setLocation(newLocation);
        setIsLoading(false);
        
        // Call the callback function if provided
        if (onLocationUpdate) {
          onLocationUpdate(newLocation.latitude, newLocation.longitude);
        }
        
        toast({
          title: "Location Updated",
          description: "Your location has been successfully updated.",
        });
      },
      (error) => {
        setIsLoading(false);
        setError(`Error getting location: ${error.message}`);
        toast({
          title: "Location Error",
          description: `Unable to retrieve your location: ${error.message}`,
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    // Get location when component mounts
    getLocation();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-background shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Your Location</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={getLocation}
          disabled={isLoading}
        >
          <MapPin className="mr-2 h-4 w-4" />
          {isLoading ? "Updating..." : "Update Location"}
        </Button>
      </div>

      {error ? (
        <div className="text-destructive text-sm py-2">{error}</div>
      ) : location ? (
        <div className="space-y-2 text-sm">
          <p className="font-medium">{location.address || "Location found"}</p>
          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            <div>
              <p>Latitude: {location.latitude.toFixed(6)}</p>
              <p>Longitude: {location.longitude.toFixed(6)}</p>
            </div>
            <div>
              <p>Accuracy: ±{Math.round(location.accuracy)}m</p>
              <p>Updated: {new Date(location.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <span className="animate-pulse">Retrieving your location...</span>
        </div>
      )}
    </div>
  );
};

export default LocationTracker;
