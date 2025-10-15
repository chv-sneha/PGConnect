import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Star, Clock, Users, Video, MessageCircle, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import MentorCard from "@/components/MentorCard";
import MentorProfile from "@/components/MentorProfile";
import MentorMap from "@/components/MentorMap";
import SmartMentor from "@/components/SmartMentor";

const MentorConnect = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  // Mock mentor data
  const mockMentors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      avatar: "/placeholder.svg",
      expertise: ["AI/ML", "Data Science", "Python"],
      experience: 8,
      location: "San Francisco, USA",
      rating: 4.9,
      reviews: 127,
      bio: "AI Research Scientist at Google with 8+ years in machine learning and deep learning. Passionate about mentoring the next generation of AI engineers.",
      availability: "Active",
      language: ["English", "Mandarin"],
      sessions: 89,
      badges: ["Top Rated", "AI Expert", "Career Coach"],
      portfolio: "https://sarahchen.dev",
      social: { linkedin: "sarahchen", twitter: "sarahchen_ai" }
    },
    {
      id: 2,
      name: "Marcus Johnson",
      avatar: "/placeholder.svg",
      expertise: ["UI/UX Design", "Product Design", "Figma"],
      experience: 6,
      location: "London, UK",
      rating: 4.8,
      reviews: 94,
      bio: "Senior Product Designer at Spotify. Specialized in user-centered design and design systems. Love helping designers grow their careers.",
      availability: "Active",
      language: ["English"],
      sessions: 67,
      badges: ["Design Guru", "Rising Mentor"],
      portfolio: "https://marcusdesigns.com",
      social: { linkedin: "marcusjohnson", dribbble: "marcusj" }
    },
    {
      id: 3,
      name: "Priya Sharma",
      avatar: "/placeholder.svg",
      expertise: ["Digital Marketing", "SEO", "Content Strategy"],
      experience: 5,
      location: "Mumbai, India",
      rating: 4.7,
      reviews: 78,
      bio: "Digital Marketing Manager with expertise in growth hacking and content marketing. Helped 100+ startups scale their online presence.",
      availability: "Active",
      language: ["English", "Hindi"],
      sessions: 45,
      badges: ["Marketing Pro", "Growth Hacker"],
      portfolio: "https://priyamarketing.com",
      social: { linkedin: "priyasharma", twitter: "priya_marketing" }
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg",
      expertise: ["Entrepreneurship", "Startup Strategy", "Fundraising"],
      experience: 12,
      location: "Austin, USA",
      rating: 4.9,
      reviews: 156,
      bio: "Serial entrepreneur with 3 successful exits. Currently partner at Techstars. Passionate about helping founders build scalable businesses.",
      availability: "Active",
      language: ["English", "Spanish"],
      sessions: 134,
      badges: ["Startup Guru", "Top Rated", "Investor"],
      portfolio: "https://alexrodriguez.vc",
      social: { linkedin: "alexrodriguez", twitter: "alex_startup" }
    },
    {
      id: 5,
      name: "Emma Thompson",
      avatar: "/placeholder.svg",
      expertise: ["Photography", "Creative Direction", "Adobe Suite"],
      experience: 7,
      location: "Sydney, Australia",
      rating: 4.6,
      reviews: 89,
      bio: "Award-winning photographer and creative director. Worked with brands like Nike and Apple. Love teaching creative storytelling through visuals.",
      availability: "Offline",
      language: ["English"],
      sessions: 56,
      badges: ["Creative Master", "Visual Storyteller"],
      portfolio: "https://emmathompson.photo",
      social: { instagram: "emmathompson_photo", behance: "emmathompson" }
    },
    {
      id: 6,
      name: "Raj Patel",
      avatar: "/placeholder.svg",
      expertise: ["Blockchain", "Web3", "Smart Contracts"],
      experience: 4,
      location: "Bangalore, India",
      rating: 4.8,
      reviews: 67,
      bio: "Blockchain developer and Web3 evangelist. Built DeFi protocols handling $100M+ TVL. Excited to guide developers into the decentralized future.",
      availability: "Active",
      language: ["English", "Hindi", "Gujarati"],
      sessions: 34,
      badges: ["Web3 Pioneer", "Blockchain Expert"],
      portfolio: "https://rajpatel.web3",
      social: { linkedin: "rajpatel", github: "rajpatel-web3" }
    }
  ];

  useEffect(() => {
    setMentors(mockMentors);
    setFilteredMentors(mockMentors);
  }, []);

  useEffect(() => {
    let filtered = mentors.filter(mentor => {
      const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSkill = selectedSkill === "all" || mentor.expertise.includes(selectedSkill);
      const matchesExperience = selectedExperience === "all" || 
                               (selectedExperience === "junior" && mentor.experience <= 3) ||
                               (selectedExperience === "mid" && mentor.experience > 3 && mentor.experience <= 7) ||
                               (selectedExperience === "senior" && mentor.experience > 7);
      const matchesLocation = selectedLocation === "all" || mentor.location.includes(selectedLocation);
      
      return matchesSearch && matchesSkill && matchesExperience && matchesLocation;
    });
    setFilteredMentors(filtered);
  }, [searchTerm, selectedSkill, selectedExperience, selectedLocation, mentors]);

  const skillAreas = ["AI/ML", "UI/UX Design", "Digital Marketing", "Entrepreneurship", "Photography", "Blockchain", "Web Development", "Data Science"];
  const locations = ["USA", "India", "UK", "Australia", "Canada", "Germany"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              MentorConnect
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Bridge the gap between passion and guidance. Connect with experienced mentors who help you grow, review your work, and provide personalized feedback.
            </p>
          </div>



          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search mentors by name or skill..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Skill Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    {skillAreas.map(skill => (
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                    <SelectItem value="mid">Mid (4-7 years)</SelectItem>
                    <SelectItem value="senior">Senior (8+ years)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* View Toggle */}
          <Tabs value={viewMode} onValueChange={setViewMode} className="mb-6">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="ai">AI Mentor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid">
              {/* Mentors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map(mentor => (
                  <MentorCard 
                    key={mentor.id} 
                    mentor={mentor} 
                    onSelect={setSelectedMentor}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="map">
              <MentorMap mentors={filteredMentors} onMentorSelect={setSelectedMentor} />
            </TabsContent>
            
            <TabsContent value="ai">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">SmartMentor AI</h2>
                  <p className="text-muted-foreground">
                    Get instant guidance while you search for the perfect human mentor
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SmartMentor 
                    skillArea={selectedSkill === 'all' ? 'General Skills' : selectedSkill}
                    onRecommendMentor={(mentorId) => {
                      setViewMode('grid');
                      // Could implement mentor recommendation logic here
                    }}
                  />
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Why Use SmartMentor?</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-blue-600 text-sm font-bold">1</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Instant Availability</h4>
                            <p className="text-sm text-muted-foreground">Get guidance 24/7, even when human mentors are offline</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-green-600 text-sm font-bold">2</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Personalized Paths</h4>
                            <p className="text-sm text-muted-foreground">AI-generated learning roadmaps based on your goals</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-purple-600 text-sm font-bold">3</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Smart Matching</h4>
                            <p className="text-sm text-muted-foreground">Get recommendations for the best human mentors</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Popular AI Guidance Topics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {['Career Planning', 'Skill Assessment', 'Learning Paths', 'Portfolio Review', 'Interview Prep', 'Project Ideas'].map((topic) => (
                            <Badge key={topic} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No mentors found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mentor Profile Modal */}
      {selectedMentor && (
        <MentorProfile 
          mentor={selectedMentor} 
          onClose={() => setSelectedMentor(null)}
        />
      )}
    </div>
  );
};

export default MentorConnect;