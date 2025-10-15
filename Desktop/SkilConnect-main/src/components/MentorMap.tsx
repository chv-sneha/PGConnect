import { useState } from "react";
import { MapPin, Star, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MentorMapProps {
  mentors: any[];
  onMentorSelect: (mentor: any) => void;
}

const MentorMap = ({ mentors, onMentorSelect }: MentorMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Group mentors by location
  const mentorsByLocation = mentors.reduce((acc, mentor) => {
    const location = mentor.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(mentor);
    return acc;
  }, {} as Record<string, any[]>);

  // Mock coordinates for demonstration
  const locationCoords: Record<string, { x: number; y: number; country: string }> = {
    "San Francisco, USA": { x: 15, y: 40, country: "USA" },
    "London, UK": { x: 50, y: 25, country: "UK" },
    "Mumbai, India": { x: 75, y: 55, country: "India" },
    "Austin, USA": { x: 25, y: 50, country: "USA" },
    "Sydney, Australia": { x: 85, y: 80, country: "Australia" },
    "Bangalore, India": { x: 77, y: 58, country: "India" }
  };

  return (
    <div className="space-y-6">
      {/* World Map Visualization */}
      <Card className="p-6">
        <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
          {/* Simple world map background */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 100 60" className="w-full h-full">
              {/* Simplified continent shapes */}
              <path d="M10,20 L30,15 L35,25 L25,35 L15,30 Z" fill="#94a3b8" />
              <path d="M40,15 L60,10 L65,20 L55,30 L45,25 Z" fill="#94a3b8" />
              <path d="M70,25 L85,20 L90,35 L80,45 L75,40 Z" fill="#94a3b8" />
              <path d="M80,50 L95,45 L90,60 L85,55 Z" fill="#94a3b8" />
            </svg>
          </div>

          {/* Mentor location pins */}
          {Object.entries(locationCoords).map(([location, coords]) => {
            const mentorsAtLocation = mentorsByLocation[location] || [];
            if (mentorsAtLocation.length === 0) return null;

            return (
              <div
                key={location}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                    {mentorsAtLocation.length}
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                    {location} ({mentorsAtLocation.length} mentors)
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-sm font-medium mb-2">Global Mentor Network</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Active Mentors</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span>Online Now</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Location Details */}
      {selectedLocation && mentorsByLocation[selectedLocation] && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{selectedLocation}</h3>
              <Badge variant="secondary">
                {mentorsByLocation[selectedLocation].length} mentors
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mentorsByLocation[selectedLocation].map((mentor) => (
                <div key={mentor.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{mentor.name}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {mentor.expertise.slice(0, 2).join(', ')}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{mentor.rating}</span>
                      </div>
                      <Badge 
                        variant={mentor.availability === 'Active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {mentor.availability}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onMentorSelect(mentor)}
                  >
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(mentorsByLocation).map(([location, mentorsAtLocation]) => {
          const coords = locationCoords[location];
          if (!coords) return null;
          
          const avgRating = mentorsAtLocation.reduce((sum, m) => sum + m.rating, 0) / mentorsAtLocation.length;
          const activeMentors = mentorsAtLocation.filter(m => m.availability === 'Active').length;
          
          return (
            <Card key={location} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedLocation(location)}>
              <CardContent className="pt-4">
                <div className="text-sm font-medium truncate">{coords.country}</div>
                <div className="text-xs text-muted-foreground truncate mb-2">{location}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Mentors
                    </span>
                    <span className="font-medium">{mentorsAtLocation.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Rating
                    </span>
                    <span className="font-medium">{avgRating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Active</span>
                    <span className="font-medium text-green-600">{activeMentors}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MentorMap;