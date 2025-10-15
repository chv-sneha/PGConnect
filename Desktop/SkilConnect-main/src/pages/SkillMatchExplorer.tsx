import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  MessageCircle, 
  Calendar,
  TrendingUp,
  Users,
  CheckCircle
} from "lucide-react";

interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  proficiency_level: string;
  years_experience: number;
  can_teach: boolean;
  wants_to_learn: boolean;
  verified: boolean;
  certificates: string;
}

interface SkillExpert {
  id: string;
  name: string;
  email: string;
  skill: string;
  proficiency: string;
  experience: number;
  rating: number;
  reviews: number;
  verified: boolean;
  location: string;
  available_online: boolean;
}

const SkillMatchExplorer = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const skillQuery = searchParams.get('query') || '';
  
  const [experts, setExperts] = useState<SkillExpert[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<SkillExpert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [proficiencyFilter, setProficiencyFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [messageDialog, setMessageDialog] = useState({ open: false, expert: null as SkillExpert | null });
  const [exchangeDialog, setExchangeDialog] = useState({ open: false, expert: null as SkillExpert | null });
  const [messageText, setMessageText] = useState('');
  const [exchangeMessage, setExchangeMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    fetchSkillExperts();
  }, [skillQuery]);

  useEffect(() => {
    filterExperts();
  }, [experts, searchTerm, proficiencyFilter, availabilityFilter, verifiedOnly]);

  const fetchSkillExperts = async () => {
    try {
      // Fetch all user skills first (simpler query)
      const skillsSnapshot = await getDocs(collection(db, "user_skills"));
      const allUserSkills = skillsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserSkill[];
      
      // Filter in memory for skills that match query and can teach
      const userSkills = allUserSkills.filter(skill => 
        skill.skill_name?.toLowerCase().includes(skillQuery.toLowerCase()) &&
        (skill.can_teach === true || skill.can_teach === 'Yes' || skill.can_teach === 'yes')
      );

      // Get users data or create mock users if none exist
      const usersSnapshot = await getDocs(collection(db, "users"));
      let users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // If no users in database, create mock users for demonstration
      if (users.length === 0) {
        const mockUsers = Array.from({length: 50}, (_, i) => ({
          id: (i + 1).toString(),
          displayName: `User ${i + 1}`,
          name: `Expert ${i + 1}`,
          email: `user${i + 1}@example.com`,
          location: ['Remote', 'New York', 'London', 'Paris', 'Berlin'][i % 5]
        }));
        users = mockUsers;
      }

      // Get reviews for rating calculation
      const reviewsSnapshot = await getDocs(collection(db, "skill_reviews"));
      const reviews = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get skill sessions for availability info
      const sessionsSnapshot = await getDocs(collection(db, "skill_sessions"));
      const sessions = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Get skill matches for experience tracking
      const matchesSnapshot = await getDocs(collection(db, "skill_matches"));
      const matches = matchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Combine data to create expert profiles
      const expertsData = userSkills.map(skill => {
        const user = users.find(u => u.id === skill.user_id);
        const userReviews = reviews.filter(r => r.reviewee_id === skill.user_id);
        const userSessions = sessions.filter(s => s.exchange_id && s.status === 'completed');
        const userMatches = matches.filter(m => m.provider_id === skill.user_id && m.status === 'completed');
        
        const avgRating = userReviews.length > 0 
          ? userReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / userReviews.length 
          : (3.5 + Math.random() * 1.5); // Random rating between 3.5-5.0 if no reviews

        return {
          id: skill.user_id,
          name: user?.displayName || user?.name || `Expert ${skill.user_id}`,
          email: user?.email || `expert${skill.user_id}@skillconnect.com`,
          skill: skill.skill_name,
          proficiency: skill.proficiency_level,
          experience: Number(skill.years_experience) || 0,
          rating: Math.round(avgRating * 10) / 10,
          reviews: userReviews.length || Math.floor(Math.random() * 15) + 3,
          verified: skill.verified === true || skill.verified === 'Yes' || skill.verified === 'yes',
          location: user?.location || 'Remote',
          available_online: true
        };
      }).filter(expert => expert.name !== 'Anonymous User');

      console.log('Skill Query:', skillQuery);
      console.log('User Skills Found:', userSkills.length);
      console.log('Experts Created:', expertsData.length);
      console.log('Sample Expert:', expertsData[0]);
      
      setExperts(expertsData);
    } catch (error) {
      console.error("Error fetching skill experts:", error);
      setExperts([]);
    } finally {
      setLoading(false);
    }
  };

  const filterExperts = () => {
    let filtered = experts;

    if (searchTerm) {
      filtered = filtered.filter(expert =>
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (proficiencyFilter !== 'all') {
      filtered = filtered.filter(expert => 
        expert.proficiency.toLowerCase() === proficiencyFilter.toLowerCase()
      );
    }

    if (availabilityFilter === 'online') {
      filtered = filtered.filter(expert => expert.available_online);
    }

    if (verifiedOnly) {
      filtered = filtered.filter(expert => expert.verified);
    }

    // Sort by rating and experience
    filtered.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.experience - a.experience;
    });

    setFilteredExperts(filtered);
  };

  const getProficiencyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAnalytics = () => {
    const avgRating = experts.length > 0 
      ? experts.reduce((sum, e) => sum + e.rating, 0) / experts.length 
      : 0;
    const avgExperience = experts.length > 0 
      ? experts.reduce((sum, e) => sum + e.experience, 0) / experts.length 
      : 0;
    const verifiedCount = experts.filter(e => e.verified).length;

    return { avgRating, avgExperience, verifiedCount };
  };

  const analytics = getAnalytics();

  const handleSendMessage = async () => {
    if (!user || !messageDialog.expert || !messageText.trim()) return;

    setSendingMessage(true);
    try {
      await addDoc(collection(db, "skill_messages"), {
        exchange_id: `msg_${Date.now()}`,
        sender_id: user.uid,
        receiver_id: messageDialog.expert.id,
        message: messageText,
        timestamp: new Date().toISOString(),
        is_read: false,
        message_type: "direct_message"
      });

      alert("Message sent successfully!");
      setMessageText('');
      setMessageDialog({ open: false, expert: null });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleRequestExchange = async () => {
    if (!user || !exchangeDialog.expert || !exchangeMessage.trim()) return;

    setSendingRequest(true);
    try {
      // Create skill match entry
      await addDoc(collection(db, "skill_matches"), {
        post_id: `exchange_${Date.now()}`,
        requester_id: user.uid,
        provider_id: exchangeDialog.expert.id,
        status: "pending",
        match_score: 85,
        created_at: new Date().toISOString(),
        accepted_at: null,
        completed_at: null
      });

      // Send initial message
      await addDoc(collection(db, "skill_messages"), {
        exchange_id: `exchange_${Date.now()}`,
        sender_id: user.uid,
        receiver_id: exchangeDialog.expert.id,
        message: `Hi! I'd like to request a skill exchange. ${exchangeMessage}`,
        timestamp: new Date().toISOString(),
        is_read: false,
        message_type: "exchange_request"
      });

      alert("Exchange request sent successfully!");
      setExchangeMessage('');
      setExchangeDialog({ open: false, expert: null });
    } catch (error) {
      console.error("Error sending exchange request:", error);
      alert("Failed to send exchange request. Please try again.");
    } finally {
      setSendingRequest(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Finding skill experts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/skill-exchange" className="hover:text-primary">Skill Exchange</Link>
            <span>/</span>
            <span>Connect</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Skill Match Explorer</h1>
          <div className="flex items-center gap-4 text-lg">
            <span className="flex items-center gap-2">
              🔍 <strong>Skill:</strong> {skillQuery}
            </span>
            <span className="flex items-center gap-2">
              👥 <strong>Available Experts:</strong> {filteredExperts.length} people found
            </span>
          </div>
          
          {/* Debug Info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
            <strong>Debug:</strong> Total experts loaded: {experts.length}, Filtered: {filteredExperts.length}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or skill..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={proficiencyFilter}
                  onChange={(e) => setProficiencyFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>

                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">All Availability</option>
                  <option value="online">Online Only</option>
                </select>

                <Button
                  variant={verifiedOnly ? "default" : "outline"}
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Verified Only
                </Button>
              </div>
            </Card>

            {/* Expert Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredExperts.map((expert) => (
                <Card key={expert.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{expert.name}</h3>
                          {expert.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{expert.skill}</p>
                      </div>
                      <Badge className={getProficiencyColor(expert.proficiency)}>
                        {expert.proficiency}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>{expert.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{expert.available_online ? '🌐 Online' : expert.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{expert.rating}/5 ({expert.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Dialog open={messageDialog.open && messageDialog.expert?.id === expert.id} onOpenChange={(open) => setMessageDialog({ open, expert: open ? expert : null })}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 gap-1"
                            disabled={!user}
                            title={!user ? "Please log in to send messages" : ""}
                          >
                            <MessageCircle className="h-3 w-3" />
                            Message
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Message to {expert.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-md">
                              <p className="text-sm"><strong>Expert:</strong> {expert.name}</p>
                              <p className="text-sm"><strong>Skill:</strong> {expert.skill} ({expert.proficiency})</p>
                              <p className="text-sm"><strong>Experience:</strong> {expert.experience} years</p>
                            </div>
                            <Textarea
                              placeholder="Type your message here..."
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <Button 
                                onClick={handleSendMessage} 
                                disabled={!messageText.trim() || sendingMessage}
                                className="flex-1"
                              >
                                {sendingMessage ? "Sending..." : "Send Message"}
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setMessageDialog({ open: false, expert: null })}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={exchangeDialog.open && exchangeDialog.expert?.id === expert.id} onOpenChange={(open) => setExchangeDialog({ open, expert: open ? expert : null })}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="flex-1 gap-1"
                            disabled={!user}
                            title={!user ? "Please log in to request exchanges" : ""}
                          >
                            <Calendar className="h-3 w-3" />
                            Request Exchange
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Skill Exchange with {expert.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-3 bg-blue-50 rounded-md">
                              <p className="text-sm"><strong>Expert:</strong> {expert.name}</p>
                              <p className="text-sm"><strong>They can teach:</strong> {expert.skill} ({expert.proficiency})</p>
                              <p className="text-sm"><strong>Experience:</strong> {expert.experience} years</p>
                              <p className="text-sm"><strong>Rating:</strong> ⭐ {expert.rating}/5</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">What skill can you offer in exchange?</label>
                              <Input 
                                placeholder="e.g., Python, Graphic Design, etc."
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Additional message (optional)</label>
                              <Textarea
                                placeholder="Tell them about your experience, availability, or any specific topics you'd like to focus on..."
                                value={exchangeMessage}
                                onChange={(e) => setExchangeMessage(e.target.value)}
                                rows={3}
                                className="mt-1"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={handleRequestExchange} 
                                disabled={sendingRequest}
                                className="flex-1"
                              >
                                {sendingRequest ? "Sending..." : "Send Exchange Request"}
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setExchangeDialog({ open: false, expert: null })}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredExperts.length === 0 && experts.length > 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No experts match your current filters</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search terms or filters.</p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setProficiencyFilter('all');
                    setAvailabilityFilter('all');
                    setVerifiedOnly(false);
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {experts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No experts found for "{skillQuery}"</p>
                <p className="text-sm text-muted-foreground">This skill might not be available yet. Try searching for a different skill.</p>
                <Link to="/skill-exchange">
                  <Button variant="outline" className="mt-4">
                    Back to Skill Exchange
                  </Button>
                </Link>
              </div>
            )}

            {!user && experts.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Please <Link to="/auth" className="underline hover:text-yellow-900">log in</Link> to send messages or request skill exchanges.
                </p>
              </div>
            )}
          </div>

          {/* Analytics Sidebar */}
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Skill Analytics
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Skill Popularity</p>
                  <p className="font-medium">{skillQuery} is trending 🔥</p>
                  <p className="text-xs text-muted-foreground">{experts.length} active members</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Average Rating</p>
                  <p className="font-medium">{analytics.avgRating.toFixed(1)}/5</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Average Experience</p>
                  <p className="font-medium">{analytics.avgExperience.toFixed(1)} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Verified Experts</p>
                  <p className="font-medium">{analytics.verifiedCount} verified</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Quick Filters</h3>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => {
                    setProficiencyFilter('advanced');
                    setVerifiedOnly(true);
                  }}
                >
                  <Star className="h-3 w-3 mr-2" />
                  Top Rated
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setVerifiedOnly(true)}
                >
                  <Award className="h-3 w-3 mr-2" />
                  Verified Mentors
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setAvailabilityFilter('online')}
                >
                  <Users className="h-3 w-3 mr-2" />
                  Available Online
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillMatchExplorer;