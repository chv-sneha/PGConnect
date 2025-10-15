import { Star, MapPin, Clock, MessageCircle, Video, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MiniMentorSession from "@/components/MiniMentorSession";

interface MentorCardProps {
  mentor: {
    id: number;
    name: string;
    avatar: string;
    expertise: string[];
    experience: number;
    location: string;
    rating: number;
    reviews: number;
    bio: string;
    availability: string;
    language: string[];
    sessions: number;
    badges: string[];
  };
  onSelect: (mentor: any) => void;
}

const MentorCard = ({ mentor, onSelect }: MentorCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{mentor.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{mentor.location}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{mentor.rating}</span>
                <span className="text-sm text-muted-foreground">({mentor.reviews})</span>
              </div>
              <Badge 
                variant={mentor.availability === 'Active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {mentor.availability}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Expertise */}
        <div>
          <div className="flex flex-wrap gap-1">
            {mentor.expertise.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {mentor.expertise.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{mentor.expertise.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {mentor.bio}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{mentor.experience}y exp</span>
          </div>
          <div className="flex items-center gap-1">
            <Video className="w-3 h-3" />
            <span>{mentor.sessions} sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>{mentor.badges.length} badges</span>
          </div>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Languages:</span>
          <span>{mentor.language.join(', ')}</span>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onSelect(mentor)}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              View Profile
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onSelect(mentor)}
            >
              Connect Now
            </Button>
          </div>
          <MiniMentorSession 
            mentor={mentor}
            onBookSession={(sessionData) => console.log('Booked session:', sessionData)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorCard;