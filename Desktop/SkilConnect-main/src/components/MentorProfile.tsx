import { useState } from "react";
import { X, Star, MapPin, Clock, MessageCircle, Video, Calendar, Award, ExternalLink, Globe, Linkedin, Twitter, Github, Instagram, Dribbble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SkillPathwayGenerator from "@/components/SkillPathwayGenerator";
import MiniMentorSession from "@/components/MiniMentorSession";

interface MentorProfileProps {
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
    portfolio?: string;
    social?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      instagram?: string;
      dribbble?: string;
      behance?: string;
    };
  };
  onClose: () => void;
}

const MentorProfile = ({ mentor, onClose }: MentorProfileProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'github': return <Github className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'dribbble': return <Dribbble className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const mockReviews = [
    {
      id: 1,
      name: "Alex Johnson",
      rating: 5,
      comment: "Incredible mentor! Sarah helped me transition into AI/ML and land my dream job at a top tech company.",
      date: "2 weeks ago",
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Maria Garcia",
      rating: 5,
      comment: "Very knowledgeable and patient. The portfolio review session was extremely valuable.",
      date: "1 month ago",
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "David Chen",
      rating: 4,
      comment: "Great insights on machine learning career paths. Highly recommend!",
      date: "2 months ago",
      avatar: "/placeholder.svg"
    }
  ];

  const skillPathways = [
    {
      title: "AI/ML Engineer Path",
      steps: ["Python Fundamentals", "Statistics & Math", "Machine Learning", "Deep Learning", "MLOps", "Portfolio Projects"],
      duration: "6-12 months"
    },
    {
      title: "Data Scientist Path",
      steps: ["Python/R", "Statistics", "Data Analysis", "Machine Learning", "Data Visualization", "Business Intelligence"],
      duration: "8-14 months"
    }
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={mentor.avatar} alt={mentor.name} />
              <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{mentor.name}</DialogTitle>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{mentor.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{mentor.experience} years experience</span>
                </div>
                <Badge variant={mentor.availability === 'Active' ? 'default' : 'secondary'}>
                  {mentor.availability}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mentor.rating}</span>
                  <span className="text-muted-foreground">({mentor.reviews} reviews)</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{mentor.sessions} sessions completed</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="pathways">Skill Paths</TabsTrigger>
            <TabsTrigger value="connect">Connect</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Bio */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{mentor.bio}</p>
              </CardContent>
            </Card>

            {/* Expertise & Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mentor.badges.map((badge, index) => (
                      <Badge key={index} className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <Award className="w-3 h-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Languages & Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mentor.language.map((lang, index) => (
                      <Badge key={index} variant="outline">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mentor.portfolio && (
                    <a 
                      href={mentor.portfolio} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Portfolio
                    </a>
                  )}
                  {mentor.social && Object.entries(mentor.social).map(([platform, username]) => (
                    <a 
                      key={platform}
                      href={`https://${platform}.com/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-primary hover:underline capitalize"
                    >
                      {getSocialIcon(platform)}
                      {platform}
                    </a>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={review.avatar} alt={review.name} />
                      <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.name}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pathways" className="space-y-4">
            <SkillPathwayGenerator 
              mentorExpertise={mentor.expertise}
              onPathwaySelect={(pathway) => console.log('Selected pathway:', pathway)}
            />
          </TabsContent>

          <TabsContent value="connect" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Mentorship</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Session Type</label>
                  <Select value={sessionType} onValueChange={setSessionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick-chat">Quick Chat (15 min) - Free</SelectItem>
                      <SelectItem value="portfolio-review">Portfolio Review (30 min) - $25</SelectItem>
                      <SelectItem value="career-guidance">Career Guidance (45 min) - $40</SelectItem>
                      <SelectItem value="skill-validation">Skill Validation (60 min) - $50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Preferred Time</label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (1 PM - 5 PM)</SelectItem>
                      <SelectItem value="evening">Evening (6 PM - 9 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <Textarea
                    placeholder="Tell the mentor about your goals and what you'd like to discuss..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Request
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Video className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                </div>
                
                <div className="pt-4 border-t">
                  <MiniMentorSession 
                    mentor={mentor}
                    onBookSession={(sessionData) => console.log('Booked session:', sessionData)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Available Slots
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Request Skill Validation
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Join Group Session
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MentorProfile;