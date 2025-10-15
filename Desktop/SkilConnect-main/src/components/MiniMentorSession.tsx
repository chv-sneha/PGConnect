import { useState } from "react";
import { Clock, MessageCircle, Video, Calendar, Star, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MiniMentorSessionProps {
  mentor: {
    name: string;
    avatar: string;
    expertise: string[];
    rating: number;
  };
  onBookSession: (sessionData: any) => void;
}

const MiniMentorSession = ({ mentor, onBookSession }: MiniMentorSessionProps) => {
  const [selectedSession, setSelectedSession] = useState("");
  const [question, setQuestion] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const sessionTypes = [
    {
      id: "quick-feedback",
      name: "Quick Feedback",
      duration: "15 min",
      price: "Free",
      description: "Get instant feedback on a specific question or small piece of work",
      icon: <MessageCircle className="w-5 h-5" />,
      color: "bg-green-500"
    },
    {
      id: "portfolio-review",
      name: "Portfolio Review",
      duration: "30 min",
      price: "$25",
      description: "Detailed review of your portfolio with actionable suggestions",
      icon: <CheckCircle className="w-5 h-5" />,
      color: "bg-blue-500"
    },
    {
      id: "skill-validation",
      name: "Skill Validation",
      duration: "20 min",
      price: "$15",
      description: "Validate your skills and get a verified badge",
      icon: <Star className="w-5 h-5" />,
      color: "bg-purple-500"
    },
    {
      id: "career-chat",
      name: "Career Chat",
      duration: "25 min",
      price: "$20",
      description: "Discuss career paths and get personalized advice",
      icon: <Video className="w-5 h-5" />,
      color: "bg-orange-500"
    }
  ];

  const availableSlots = [
    "Today 2:00 PM",
    "Today 4:30 PM",
    "Tomorrow 10:00 AM",
    "Tomorrow 2:00 PM",
    "Tomorrow 5:00 PM"
  ];

  const handleBookSession = () => {
    const sessionData = {
      type: selectedSession,
      question,
      mentor: mentor.name,
      timestamp: new Date().toISOString()
    };
    onBookSession(sessionData);
    setIsOpen(false);
    setSelectedSession("");
    setQuestion("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Clock className="w-4 h-4 mr-2" />
          Quick Session
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img 
              src={mentor.avatar} 
              alt={mentor.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div>Mini Session with {mentor.name}</div>
              <div className="text-sm font-normal text-muted-foreground">
                Choose a quick session type for focused guidance
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Types */}
          <div>
            <h3 className="font-medium mb-3">Choose Session Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sessionTypes.map((session) => (
                <Card 
                  key={session.id}
                  className={`cursor-pointer transition-all ${
                    selectedSession === session.id 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedSession(session.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${session.color} flex items-center justify-center text-white`}>
                        {session.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{session.name}</h4>
                          <Badge variant="secondary">{session.price}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {session.duration} • {session.description}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Question/Details */}
          {selectedSession && (
            <div>
              <h3 className="font-medium mb-3">What would you like to discuss?</h3>
              <Textarea
                placeholder="Describe your question or what you'd like feedback on..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {/* Available Slots */}
          {selectedSession && (
            <div>
              <h3 className="font-medium mb-3">Available Time Slots</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSlots.map((slot, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Why Mini Sessions?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Get quick, focused feedback without long commitments</li>
                <li>• Perfect for specific questions or small reviews</li>
                <li>• Build rapport before longer mentorship sessions</li>
                <li>• Earn Skill Points and Connect Credits</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              disabled={!selectedSession || !question.trim()}
              onClick={handleBookSession}
            >
              Book Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MiniMentorSession;