
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Technician = {
  id: string;
  name: string;
  specialty: string; 
  rating: number;
  distance: number;
  available: boolean;
  image?: string;
  contact: string;
};

type Props = {
  latitude?: number;
  longitude?: number;
}

const TechnicianFinder: React.FC<Props> = ({ latitude, longitude }) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // In a real application, we would fetch from an actual API using the location
    // For this demo, we'll generate mock data
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockTechnicians: Technician[] = [
        {
          id: '1',
          name: 'John Mwangi',
          specialty: 'Water Purification Systems',
          rating: 4.9,
          distance: 2.3,
          available: true,
          image: 'https://source.unsplash.com/collection/190727/1',
          contact: '+254 712 345 678'
        },
        {
          id: '2',
          name: 'Amina Ibrahim',
          specialty: 'Solar Pumps Expert',
          rating: 4.7,
          distance: 3.5,
          available: true,
          image: 'https://source.unsplash.com/collection/190727/2',
          contact: '+254 723 456 789'
        },
        {
          id: '3',
          name: 'David Ochieng',
          specialty: 'Irrigation Systems',
          rating: 4.8,
          distance: 4.1,
          available: false,
          image: 'https://source.unsplash.com/collection/190727/3',
          contact: '+254 734 567 890'
        }
      ];
      
      // Sort by distance
      mockTechnicians.sort((a, b) => a.distance - b.distance);
      
      setTechnicians(mockTechnicians);
      setIsLoading(false);
    }, 1500);
  }, [latitude, longitude]);

  const getStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return Array(5).fill(0).map((_, i) => {
      if (i < fullStars) return "★";
      if (i === fullStars && hasHalfStar) return "✫";
      return "☆";
    }).join("");
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Nearby Davis & Shirtliff Technicians</CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <p className="text-muted-foreground">Finding technicians near you...</p>
          </div>
        ) : technicians.length > 0 ? (
          <div className="space-y-4">
            {technicians.map((tech) => (
              <div key={tech.id} className="flex items-center space-x-4 p-3 rounded-md border">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={tech.image} alt={tech.name} />
                  <AvatarFallback>{tech.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{tech.name}</h4>
                    <Badge variant={tech.available ? "default" : "outline"}>
                      {tech.available ? "Available" : "Busy"}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{tech.specialty}</p>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-500">{getStarRating(tech.rating)} ({tech.rating})</span>
                    <span>{tech.distance.toFixed(1)} km away</span>
                  </div>
                </div>
              </div>
            ))}
            
            <Button className="w-full mt-2">Contact Nearest Technician</Button>
          </div>
        ) : (
          <div className="flex justify-center py-6">
            <p className="text-muted-foreground">No technicians found in your area</p>
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t text-xs text-center text-muted-foreground">
          <p>Davis & Shirtliff certified technicians available 24/7</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianFinder;
