import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Navigation from "@/components/Navigation";
import { 
  Search,
  MapPin, 
  Calendar, 
  DollarSign,
  Clock,
  User,
  Phone,
  Mail,
  MoreVertical,
  Check,
  X,
  Briefcase,
  Trophy,
  Users,
  GraduationCap
} from "lucide-react";

interface Opportunity {
  id: string;
  name: string;
  type: 'job' | 'event' | 'workshop' | 'school';
  organizer: string;
  organizerContact: string;
  description: string;
  requirements: string;
  address: string;
  lat: number;
  lng: number;
  salary?: string;
  fees?: string;
  date?: string;
  time?: string;
  profession: string;
  location: string;
}

interface RequestStatus {
  id: string;
  memberName: string;
  memberAvatar: string;
  opportunityName: string;
  status: 'requested' | 'accepted' | 'rejected';
  requestDate: string;
  organizerName: string;
}

const SkillLinkSearch = () => {
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState<RequestStatus[]>([]);

  const mockOpportunities: Opportunity[] = [
    {
      id: "1",
      name: "Professional Dance Academy",
      type: "school",
      organizer: "Nritya Academy",
      organizerContact: "info@nrityaacademy.com | +91-9876543210",
      description: "Learn classical and contemporary dance forms from expert instructors",
      requirements: "No prior experience required, flexible timings available",
      address: "MG Road, Bangalore",
      lat: 12.9716,
      lng: 77.5946,
      fees: "₹8,000/month",
      profession: "dancer",
      location: "bangalore"
    },
    {
      id: "2", 
      name: "Wedding Dance Performance",
      type: "job",
      organizer: "Celebration Events",
      organizerContact: "bookings@celebration.com | +91-9876543211",
      description: "Choreograph and perform for a 3-day wedding celebration",
      requirements: "Professional dance experience, team coordination skills",
      address: "Palace Grounds, Bangalore",
      lat: 13.0067,
      lng: 77.5845,
      salary: "₹25,000",
      date: "2025-03-15",
      time: "6:00 PM",
      profession: "dancer",
      location: "bangalore"
    },
    {
      id: "3",
      name: "Cultural Dance Festival",
      type: "event",
      organizer: "Karnataka Cultural Society",
      organizerContact: "events@kcsociety.org | +91-9876543212",
      description: "Annual dance festival showcasing regional dance forms",
      requirements: "Audition required, traditional costume provided",
      address: "Chowdiah Memorial Hall, Bangalore",
      lat: 12.9698,
      lng: 77.5986,
      salary: "₹15,000 + Certificate",
      date: "2025-04-20",
      time: "7:30 PM",
      profession: "dancer",
      location: "bangalore"
    },
    {
      id: "4",
      name: "Dance Workshop - Bollywood Fusion",
      type: "workshop",
      organizer: "DanceHub Studio",
      organizerContact: "workshop@dancehub.in | +91-9876543213",
      description: "3-day intensive workshop on Bollywood fusion choreography",
      requirements: "Basic dance knowledge, comfortable clothing",
      address: "Koramangala, Bangalore",
      lat: 12.9352,
      lng: 77.6245,
      fees: "₹3,500",
      date: "2025-02-28",
      time: "10:00 AM",
      profession: "dancer",
      location: "bangalore"
    }
  ];

  const mockRequests: RequestStatus[] = [
    {
      id: "1",
      memberName: "Rahul Singh",
      memberAvatar: "RS",
      opportunityName: "Wedding Dance Performance",
      status: "requested",
      requestDate: "2025-01-15",
      organizerName: "Celebration Events"
    },
    {
      id: "2",
      memberName: "Harshit",
      memberAvatar: "H", 
      opportunityName: "Cultural Dance Festival",
      status: "requested",
      requestDate: "2025-01-16",
      organizerName: "Karnataka Cultural Society"
    },
    {
      id: "3",
      memberName: "Tushar Saini",
      memberAvatar: "T",
      opportunityName: "Dance Workshop - Bollywood Fusion",
      status: "requested", 
      requestDate: "2025-01-17",
      organizerName: "DanceHub Studio"
    }
  ];

  const handleSearch = () => {
    if (!profession.trim() || !location.trim()) {
      alert("Please enter both profession and location");
      return;
    }

    const filtered = mockOpportunities.filter(opp => 
      opp.profession.toLowerCase().includes(profession.toLowerCase()) &&
      opp.location.toLowerCase().includes(location.toLowerCase())
    );
    
    setOpportunities(filtered);
    setRequests(mockRequests);
    setHasSearched(true);
  };

  const handleMarkerClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowModal(true);
  };

  const handleRequest = (opportunity: Opportunity) => {
    const newRequest: RequestStatus = {
      id: Date.now().toString(),
      memberName: "You",
      memberAvatar: "Y",
      opportunityName: opportunity.name,
      status: "requested",
      requestDate: new Date().toISOString().split('T')[0],
      organizerName: opportunity.organizer
    };
    
    setRequests(prev => [newRequest, ...prev]);
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
    switch (type) {
      case 'job': return <Briefcase className="h-4 w-4" />;
      case 'event': return <Trophy className="h-4 w-4" />;
      case 'workshop': return <Users className="h-4 w-4" />;
      case 'school': return <GraduationCap className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Opportunities</h1>
          <p className="text-lg text-muted-foreground">
            Search for jobs, events, workshops, and schools in your area
          </p>
        </div>

        {/* Search Form */}
        <Card className="p-6 mb-8">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Profession/Skill
              </label>
              <Input
                placeholder="e.g., dancer, musician, photographer"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              />
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">
                Location
              </label>
              <Input
                placeholder="e.g., Bangalore, Mumbai, Delhi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            
            <Button onClick={handleSearch} className="gap-2" size="lg">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </Card>

        {hasSearched && (
          <>
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">
                Search Results for "{profession}" in "{location}"
              </h2>
              <p className="text-muted-foreground">
                Found {opportunities.length} opportunities
              </p>
            </div>

            {/* Interactive Map */}
            <Card className="mb-8 h-80 bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-blue-200">
              <div className="h-full flex items-center justify-center relative">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-blue-700">Interactive Map - {location}</h3>
                  <p className="text-blue-600">Click red markers to view opportunity details</p>
                </div>
                
                {/* Mock map markers */}
                {opportunities.map((opp, index) => (
                  <div 
                    key={opp.id}
                    className="absolute bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs cursor-pointer hover:bg-red-600 transition-colors"
                    style={{
                      top: `${20 + (index * 15)}%`,
                      left: `${15 + (index * 20)}%`
                    }}
                    onClick={() => handleMarkerClick(opp)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </Card>

            {/* Opportunities List */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {opportunities.map((opportunity) => (
                <Card key={opportunity.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleMarkerClick(opportunity)}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(opportunity.type)}
                      <Badge variant="secondary" className="capitalize">
                        {opportunity.type}
                      </Badge>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {opportunity.salary || opportunity.fees}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{opportunity.name}</h3>
                  <p className="text-muted-foreground mb-3">{opportunity.description}</p>
                  
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
                
                {requests.map((request) => (
                  <div key={request.id} className="grid grid-cols-3 gap-4 items-center py-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {request.memberAvatar}
                      </div>
                      <div>
                        <p className="font-medium">{request.memberName}</p>
                        <p className="text-sm text-muted-foreground">{request.opportunityName}</p>
                      </div>
                    </div>
                    
                    <div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {request.status === 'requested' && (
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
                ))}
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
                {selectedOpportunity?.name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOpportunity && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {selectedOpportunity.type}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    {selectedOpportunity.salary || selectedOpportunity.fees}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedOpportunity.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <p className="text-muted-foreground">{selectedOpportunity.requirements}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Organizer</h3>
                    <p>{selectedOpportunity.organizer}</p>
                    <p className="text-sm text-muted-foreground">{selectedOpportunity.organizerContact}</p>
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
                      <p>{selectedOpportunity.salary || selectedOpportunity.fees}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => handleRequest(selectedOpportunity)} className="flex-1">
                    Request
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(`mailto:${selectedOpportunity.organizerContact.split(' | ')[0]}`, '_blank')}
                    className="flex-1"
                  >
                    Contact Organizer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SkillLinkSearch;