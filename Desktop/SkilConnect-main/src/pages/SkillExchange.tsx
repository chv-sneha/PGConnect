import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import { Plus, Search, MapPin, Clock, Star, Users, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SkillPost {
  id: string;
  user_id: string;
  skill_offered: string;
  skill_wanted: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  duration: string;
  location: string;
  is_online: boolean;
  status: string;
  created_at: string;
  views: number;
  likes: number;
}

interface SkillCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const SkillExchange = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<SkillPost[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<SkillPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState("");

  const [newPost, setNewPost] = useState({
    skill_offered: "",
    skill_wanted: "",
    title: "",
    description: "",
    category: "",
    difficulty_level: "beginner",
    duration: "",
    location: "",
    is_online: true
  });

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedCategory]);

  const fetchPosts = async () => {
    try {
      // Simplified query without orderBy to avoid index issues
      const snapshot = await getDocs(collection(db, "skill_posts"));
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SkillPost[];
      
      // Filter active posts and sort in memory
      const activePosts = postsData
        .filter(post => (post.status === "active" || post.status === "Active" || !post.status))
        .map(post => ({
          ...post,
          views: Number(post.views) || 0,
          likes: Number(post.likes) || 0,
          is_online: post.is_online === true || post.is_online === 'true' || post.is_online === 'Yes'
        }))
        .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      
      setPosts(activePosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // If error, still set empty array to show UI
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "skill_categories"));
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SkillCategory[];
      
      // If no categories in database, use default ones
      if (categoriesData.length === 0) {
        const defaultCategories = [
          { id: '1', name: 'Technology', description: 'Programming, Web Development, etc.', icon: '💻', color: 'blue' },
          { id: '2', name: 'Design', description: 'UI/UX, Graphic Design, etc.', icon: '🎨', color: 'purple' },
          { id: '3', name: 'Business', description: 'Marketing, Sales, Management', icon: '💼', color: 'green' },
          { id: '4', name: 'Languages', description: 'English, Hindi, Regional Languages', icon: '🗣️', color: 'orange' },
          { id: '5', name: 'Arts & Crafts', description: 'Painting, Music, Handicrafts', icon: '🎭', color: 'pink' },
          { id: '6', name: 'Health & Fitness', description: 'Yoga, Nutrition, Exercise', icon: '💪', color: 'red' },
          { id: '7', name: 'Education', description: 'Teaching, Tutoring, Training', icon: '📚', color: 'indigo' },
          { id: '8', name: 'Agriculture', description: 'Farming, Organic Methods', icon: '🌱', color: 'green' }
        ];
        setCategories(defaultCategories);
      } else {
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to default categories on error
      const defaultCategories = [
        { id: '1', name: 'Technology', description: 'Programming, Web Development, etc.', icon: '💻', color: 'blue' },
        { id: '2', name: 'Design', description: 'UI/UX, Graphic Design, etc.', icon: '🎨', color: 'purple' },
        { id: '3', name: 'Business', description: 'Marketing, Sales, Management', icon: '💼', color: 'green' },
        { id: '4', name: 'Languages', description: 'English, Hindi, Regional Languages', icon: '🗣️', color: 'orange' },
        { id: '5', name: 'Arts & Crafts', description: 'Painting, Music, Handicrafts', icon: '🎭', color: 'pink' },
        { id: '6', name: 'Health & Fitness', description: 'Yoga, Nutrition, Exercise', icon: '💪', color: 'red' },
        { id: '7', name: 'Education', description: 'Teaching, Tutoring, Training', icon: '📚', color: 'indigo' },
        { id: '8', name: 'Agriculture', description: 'Farming, Organic Methods', icon: '🌱', color: 'green' }
      ];
      setCategories(defaultCategories);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.skill_offered.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.skill_wanted.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  const handleCreatePost = async () => {
    if (!user) {
      setError("Please log in to create a post");
      return;
    }

    // Validation
    if (!newPost.title.trim()) {
      setError("Please enter a post title");
      return;
    }
    if (!newPost.skill_offered.trim()) {
      setError("Please enter the skill you can offer");
      return;
    }
    if (!newPost.skill_wanted.trim()) {
      setError("Please enter the skill you want to learn");
      return;
    }
    if (!newPost.description.trim()) {
      setError("Please enter a description");
      return;
    }
    if (!newPost.category) {
      setError("Please select a category");
      return;
    }

    setCreateLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "skill_posts"), {
        ...newPost,
        user_id: user.uid,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
        likes: 0
      });

      // Reset form
      setNewPost({
        skill_offered: "",
        skill_wanted: "",
        title: "",
        description: "",
        category: "",
        difficulty_level: "beginner",
        duration: "",
        location: "",
        is_online: true
      });
      setIsCreateDialogOpen(false);
      fetchPosts();
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner": return "bg-green-100 text-green-800 border-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading skill exchanges...</p>
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Skill Exchange</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from peers and teach what you know. Build a community of mutual growth.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, skills offered, or skills wanted..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
              {searchTerm && (
                <div className="absolute right-3 top-3 text-xs text-muted-foreground">
                  {filteredPosts.length} results
                </div>
              )}
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 h-11 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories ({posts.length})</option>
              {categories.map((category) => {
                const count = posts.filter(p => p.category === category.name).length;
                return (
                  <option key={category.id} value={category.name}>
                    {category.name} ({count})
                  </option>
                );
              })}
            </select>

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Skill Exchange Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}
                <Input
                  placeholder="Post Title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Skill I Can Offer"
                    value={newPost.skill_offered}
                    onChange={(e) => setNewPost({...newPost, skill_offered: e.target.value})}
                  />
                  <Input
                    placeholder="Skill I Want to Learn"
                    value={newPost.skill_wanted}
                    onChange={(e) => setNewPost({...newPost, skill_wanted: e.target.value})}
                  />
                </div>

                <Textarea
                  placeholder="Describe your skill exchange proposal..."
                  value={newPost.description}
                  onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                />

                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={newPost.difficulty_level}
                    onChange={(e) => setNewPost({...newPost, difficulty_level: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Duration (e.g., 2 weeks)"
                    value={newPost.duration}
                    onChange={(e) => setNewPost({...newPost, duration: e.target.value})}
                  />
                  <Input
                    placeholder="Location"
                    value={newPost.location}
                    onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={handleCreatePost} 
                  className="w-full" 
                  disabled={createLoading}
                >
                  {createLoading ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Debug Info */}
        {posts.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
            <strong>Debug:</strong> Loaded {posts.length} posts, showing {filteredPosts.length} after filters
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg line-clamp-2">{post.title}</h3>
                  <Badge className={getDifficultyColor(post.difficulty_level)}>
                    {post.difficulty_level}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-green-600">Offering:</span>
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      {post.skill_offered || 'Not specified'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-600">Seeking:</span>
                    <Badge variant="outline" className="text-blue-700 border-blue-300">
                      {post.skill_wanted || 'Not specified'}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{post.is_online ? "🌐 Online" : `📍 ${post.location || 'Location TBD'}`}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.duration || 'Flexible'}</span>
                  </div>
                  {post.category && (
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Users className="h-3 w-3 text-blue-500" />
                      <span className="font-medium">{post.views || 0}</span> views
                    </span>
                    <span className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="font-medium">{post.likes || 0}</span> likes
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    className="gap-1 bg-primary hover:bg-primary/90"
                    onClick={() => navigate(`/connect/skill?query=${encodeURIComponent(post.skill_offered)}`)}
                  >
                    <MessageCircle className="h-3 w-3" />
                    Connect
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Results Summary */}
        {filteredPosts.length > 0 && (
          <div className="mt-6 mb-6 text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {posts.length} skill exchange posts
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </div>
        )}

        {filteredPosts.length === 0 && posts.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">No posts match your search criteria.</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms or category filter.</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {filteredPosts.length === 0 && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No skill exchange posts found.</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)} 
              className="mt-4 gap-2"
            >
              <Plus className="h-4 w-4" />
              Create First Post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillExchange;