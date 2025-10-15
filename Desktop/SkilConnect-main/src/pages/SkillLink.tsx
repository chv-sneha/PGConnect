import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Navigation from "@/components/Navigation";
import { 
  Search,
  MapPin, 
  Calendar, 
  DollarSign,
  User,
  MoreVertical,
  Check,
  X,
  Briefcase,
  Trophy,
  Users,
  GraduationCap,
  ExternalLink
} from "lucide-react";

interface Profession {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Location {
  id: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  map_url: string;
}

interface Opportunity {
  id: string;
  title: string;
  profession_id: string;
  organizer: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  salary?: string;
  fee?: string;
  contact_email: string;
  contact_phone: string;
  type: string;
  required_skills: string;
  status: string;
  registration_url: string;
}

interface RequestStatus {
  id: string;
  user_id: string;
  skill_needed: string;
  title: string;
  description: string;
  budget_range: string;
  deadline: string;
  location: string;
  status: string;
  created_at: string;
}

const SkillLink = () => {
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [requests, setRequests] = useState<RequestStatus[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapUrl, setMapUrl] = useState("");
  const [filteredRequests, setFilteredRequests] = useState<RequestStatus[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch professions from Firebase
      const professionsSnapshot = await getDocs(collection(db, "professions"));
      const professionsData = professionsSnapshot.docs.map(doc => ({
        id: doc.data().id || doc.id,
        ...doc.data()
      })) as Profession[];
      setProfessions(professionsData);

      // Fetch skill requests first to get unique locations
      const requestsSnapshot = await getDocs(collection(db, "skill_requests"));
      const requestsData = requestsSnapshot.docs.map(doc => ({
        id: doc.data().id || doc.id,
        ...doc.data()
      })) as RequestStatus[];
      setRequests(requestsData);
      
      // Get unique locations from skill requests + Firebase locations
      const locationsSnapshot = await getDocs(collection(db, "locations"));
      const firebaseLocations = locationsSnapshot.docs.map(doc => ({
        id: doc.data().id || doc.id,
        ...doc.data()
      })) as Location[];
      
      // Extract unique locations from skill requests
      const requestLocations = [...new Set(requestsData.map(req => req.location))]
        .filter(loc => loc && loc.trim())
        .map((city, index) => ({
          id: `req_${index + 1000}`,
          city: city,
          state: city === 'Remote' ? 'Remote' : 'International',
          latitude: 0,
          longitude: 0,
          map_url: `https://www.google.com/maps?q=${city}`
        }));
      
      // Combine both location sources
      const allLocations = [...firebaseLocations, ...requestLocations];
      setLocations(allLocations);

      // Fetch opportunities from Firebase
      const opportunitiesSnapshot = await getDocs(collection(db, "opportunities"));
      const opportunitiesData = opportunitiesSnapshot.docs.map(doc => ({
        id: doc.data().id || doc.id,
        ...doc.data()
      })) as Opportunity[];
      setOpportunities(opportunitiesData);


      
      // Fetch users from Firebase
      const usersSnapshot = await getDocs(collection(db, "users"));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.data().id || doc.id,
        ...doc.data()
      }));
      setUsers(usersData);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    if (!selectedProfession || !selectedLocation) {
      alert("Please select both profession and location");
      return;
    }

    setLoading(true);
    
    // Filter opportunities by profession and location
    const selectedLocationName = locations.find(l => l.id === selectedLocation)?.city?.toLowerCase();
    const filtered = opportunities.filter(opp => {
      const professionMatch = opp.profession_id === selectedProfession;
      // All opportunities are in Bangalore area based on coordinates, so match with Bangalore
      const locationMatch = selectedLocationName === 'bangalore';
      return professionMatch && locationMatch;
    });
    
    // Get selected location data for map
    const locationData = locations.find(loc => loc.id === selectedLocation);
    if (locationData) {
      setMapUrl(locationData.map_url);
    }
    
    // Filter requests based on selected profession and location
    const selectedProfessionName = professions.find(p => p.id === selectedProfession)?.name?.toLowerCase();
    
    // Create profession-skill mapping for better matching
    const professionSkillMap: Record<string, string[]> = {
      'dancer': ['dance', 'choreography', 'performance'],
      'web developer': ['javascript', 'html', 'css', 'react', 'web development', 'programming'],
      'graphic designer': ['photoshop', 'graphic design', 'logo design', 'design'],
      'photographer': ['photography', 'photo editing', 'portrait'],
      'music teacher': ['guitar', 'piano', 'music theory', 'music'],
      'chef': ['cooking', 'baking', 'culinary'],
      'content writer': ['writing', 'content'],
      'data analyst': ['python', 'sql', 'data analysis', 'excel'],
      'software engineer': ['programming', 'c++', 'python', 'javascript'],
      'seo specialist': ['seo', 'digital marketing']
    };
    
    const relatedSkills = selectedProfessionName ? professionSkillMap[selectedProfessionName] || [selectedProfessionName] : [];
    
    const filteredRequests = requests.filter(req => {
      // Check if request skill matches selected profession
      const skillMatch = relatedSkills.some(skill => 
        req.skill_needed?.toLowerCase().includes(skill) ||
        req.title?.toLowerCase().includes(skill) ||
        req.description?.toLowerCase().includes(skill)
      );
      
      // Check location match - must match selected location or be remote
      const locationMatch = selectedLocationName ? 
        req.location?.toLowerCase().includes(selectedLocationName) ||
        req.location?.toLowerCase() === 'remote'
        : true;
      
      return skillMatch && locationMatch;
    });
    
    console.log(`Filtered ${filteredRequests.length} requests for ${selectedProfessionName} in ${selectedLocationName}`);
    
    // Update state with filtered requests
    setFilteredRequests(filteredRequests);
    setHasSearched(true);
    setLoading(false);
  };

  const handleMarkerClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowModal(true);
  };

  const handleRequest = (opportunity: Opportunity) => {
    alert(`Request sent to ${opportunity.organizer}!`);
    setShowModal(false);
  };

  const handleRequestAction = (requestId: string, action: 'accept' | 'reject') => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'accept' ? 'accepted' : 'rejected' }
          : req
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'job': return <Briefcase className="h-4 w-4" />;
      case 'event': return <Trophy className="h-4 w-4" />;
      case 'workshop': return <Users className="h-4 w-4" />;
      case 'school': return <GraduationCap className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredOpportunities = hasSearched ? opportunities.filter(opp => {
    const professionMatch = opp.profession_id === selectedProfession;
    const selectedLocationName = locations.find(l => l.id === selectedLocation)?.city?.toLowerCase();
    const locationMatch = selectedLocationName === 'bangalore';
    return professionMatch && locationMatch;
  }) : [];

  const selectedProfessionName = professions.find(p => p.id === selectedProfession)?.name || "";
  const selectedLocationName = locations.find(l => l.id === selectedLocation)?.city || "";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">SkillLink</h1>
          <p className="text-lg text-muted-foreground">
            Find opportunities for jobs, events, workshops, and schools
          </p>
        </div>

        {/* Search Form */}
        <Card className="p-6 mb-8">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Profession/Skill
              </label>
              <Select value={selectedProfession} onValueChange={setSelectedProfession}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select profession" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {professions.length > 0 ? (
                    professions.map((profession) => (
                      <SelectItem key={profession.id} value={profession.id}>
                        {profession.name} - {profession.category}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Loading professions...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Location
              </label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  {locations.length > 0 ? (
                    locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.city}, {location.state}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Loading locations...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleSearch} className="gap-2" size="lg" disabled={loading}>
              <Search className="h-4 w-4" />
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </Card>

        {hasSearched && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                Search Results for "{selectedProfessionName}" in "{selectedLocationName}"
              </h2>
              <p className="text-muted-foreground">
                Found {filteredOpportunities.length} opportunities
              </p>
            </div>

            {/* Google Maps Integration */}
            <Card className="mb-8 h-96">
              <div className="h-full relative">
                {mapUrl ? (
                  <>
                    {/* Embedded Google Maps */}
                    <iframe
                      src={`https://maps.google.com/maps?q=${locations.find(l => l.id === selectedLocation)?.latitude},${locations.find(l => l.id === selectedLocation)?.longitude}&hl=en&z=14&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    />
                    
                    {/* Map Controls */}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-white/90 hover:bg-white text-xs"
                        onClick={() => window.open(mapUrl, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Enlarge
                      </Button>
                    </div>
                    
                    {/* Location Info */}
                    <div className="absolute bottom-2 left-2 bg-white/90 rounded px-3 py-1">
                      <p className="text-sm font-medium">{selectedLocationName}</p>
                      <p className="text-xs text-muted-foreground">{filteredOpportunities.length} opportunities</p>
                    </div>
                    
                    {/* Opportunity markers overlay */}
                    {filteredOpportunities.slice(0, 6).map((opp, index) => (
                      <div 
                        key={opp.id}
                        className="absolute bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600 transition-colors shadow-lg z-10 border-2 border-white"
                        style={{
                          top: `${25 + (index * 12)}%`,
                          left: `${20 + (index * 12)}%`
                        }}
                        onClick={() => handleMarkerClick(opp)}
                        title={opp.title}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                      <h3 className="text-lg font-semibold text-blue-700">Select Location</h3>
                      <p className="text-blue-600">Choose a location to view the map</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Opportunities Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {filteredOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleMarkerClick(opportunity)}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(opportunity.type)}
                      <Badge variant="secondary" className="capitalize">
                        {opportunity.type || 'Workshop'}
                      </Badge>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      ₹{opportunity.salary || opportunity.fee || 'TBD'}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
                  <p className="text-muted-foreground mb-3 line-clamp-2">{opportunity.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3" />
                      <span>{opportunity.organizer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>{opportunity.address}</span>
                    </div>
                    {opportunity.date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>{opportunity.date} {opportunity.time}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {opportunity.required_skills?.split(';').slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Request Status Table */}
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Request Status</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                  <span>Member Name</span>
                  <span>Request Status</span>
                  <span>Action</span>
                </div>
                
                {(filteredRequests.length > 0 ? filteredRequests : requests.slice(0, 5)).map((request) => {
                  const user = users.find(u => u.id === request.user_id?.toString());
                  const userName = user?.name || `User ${request.user_id}`;
                  const userAvatar = user?.avatar || userName.charAt(0);
                  
                  return (
                    <div key={request.id} className="grid grid-cols-3 gap-4 items-center py-3 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {userAvatar}
                        </div>
                        <div>
                          <p className="font-medium">{userName}</p>
                          <p className="text-sm text-muted-foreground">{request.title}</p>
                          <p className="text-xs text-muted-foreground">{request.budget_range}</p>
                        </div>
                      </div>
                    
                    <div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {request.status === 'Open' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleRequestAction(request.id, 'accept')}
                            className="gap-1"
                          >
                            <Check className="h-3 w-3" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRequestAction(request.id, 'reject')}
                            className="gap-1"
                          >
                            <X className="h-3 w-3" />
                            Reject
                          </Button>
                        </>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Message</DropdownMenuItem>
                          <DropdownMenuItem>Report</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </>
        )}

        {/* Opportunity Details Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedOpportunity && getTypeIcon(selectedOpportunity.type)}
                {selectedOpportunity?.title}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOpportunity && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {selectedOpportunity.type || 'Workshop'}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    ₹{selectedOpportunity.salary || selectedOpportunity.fee || 'TBD'}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedOpportunity.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOpportunity.required_skills?.split(';').map((skill, idx) => (
                      <Badge key={idx} variant="outline">
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Organizer</h3>
                    <p>{selectedOpportunity.organizer}</p>
                    <p className="text-sm text-muted-foreground">{selectedOpportunity.contact_email}</p>
                    <p className="text-sm text-muted-foreground">{selectedOpportunity.contact_phone}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p>{selectedOpportunity.address}</p>
                  </div>
                </div>
                
                {selectedOpportunity.date && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Date & Time</h3>
                      <p>{selectedOpportunity.date}</p>
                      <p className="text-sm text-muted-foreground">{selectedOpportunity.time}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Compensation</h3>
                      <p>₹{selectedOpportunity.salary || selectedOpportunity.fee || 'TBD'}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => handleRequest(selectedOpportunity)} className="flex-1">
                    Request
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(`mailto:${selectedOpportunity.contact_email}`, '_blank')}
                    className="flex-1"
                  >
                    Contact Organizer
                  </Button>
                  {selectedOpportunity.registration_url && (
                    <Button 
                      variant="outline"
                      onClick={() => window.open(selectedOpportunity.registration_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SkillLink;