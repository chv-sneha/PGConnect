import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/lib/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  Award,
  TrendingUp,
  Users,
  Star,
  Trophy,
  Target,
  BookOpen,
  DollarSign,
  MessageCircle,
  Zap,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const Dashboard = () => {
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading Dashboard</h2>
          <p className="text-muted-foreground">Please wait...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userStats = {
    name: userData?.displayName || user.displayName || user.email?.split('@')[0] || 'User',
    avatar: (userData?.displayName || user.displayName || user.email || 'U').substring(0, 2).toUpperCase(),
    points: userData?.completedAssessments ? userData.completedAssessments * 100 : 0,
    level: Math.floor((userData?.completedAssessments || 0) / 2) + 1,
    nextLevelPoints: (Math.floor((userData?.completedAssessments || 0) / 2) + 2) * 200,
    skillsLearned: userData?.skills?.length || 0,
    skillsTaught: userData?.interests?.length || 0,
    earningsThisMonth: 0,
    exchangesCompleted: 0,
    rating: 4.0,
  };

  const badges = [
    { id: 1, name: "First Steps", icon: Target, color: "text-primary", earned: !!userData },
    { id: 2, name: "Skill Explorer", icon: BookOpen, color: "text-accent", earned: (userData?.skills?.length || 0) > 0 },
    { id: 3, name: "Quick Learner", icon: Zap, color: "text-success", earned: (userData?.completedAssessments || 0) > 0 },
    { id: 4, name: "Community Helper", icon: Users, color: "text-secondary", earned: (userData?.interests?.length || 0) > 2 },
    { id: 5, name: "Career Explorer", icon: Trophy, color: "text-primary", earned: (userData?.completedAssessments || 0) > 1 },
    { id: 6, name: "Profile Complete", icon: Star, color: "text-accent", earned: !!(userData?.bio && userData?.location) },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "badge",
      title: "Welcome to SkillConnect!",
      points: 10,
      time: "Just now",
    },
    ...(userData?.skills?.length ? [{
      id: 2,
      type: "exchange",
      title: `Added ${userData.skills.length} skill${userData.skills.length > 1 ? 's' : ''} to profile`,
      skill: userData.skills[0],
      points: userData.skills.length * 5,
      time: "Recently",
    }] : []),
    ...(userData?.completedAssessments ? [{
      id: 3,
      type: "mentor",
      title: "Completed career assessment",
      points: 20,
      time: "Recently",
    }] : []),
  ];

  const skillPathways = userData?.skills?.map((skill, index) => ({
    id: index + 1,
    name: skill,
    progress: Math.random() * 100, // Random progress for demo
    completed: Math.floor(Math.random() * 5) + 1,
    total: Math.floor(Math.random() * 3) + 3,
  })) || [
    { id: 1, name: "Complete your profile", progress: 20, completed: 1, total: 5 },
    { id: 2, name: "Take CareerLens assessment", progress: 0, completed: 0, total: 1 },
  ];

  const levelProgress = ((userStats.points - 1000) / (userStats.nextLevelPoints - 1000)) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress and achievements on SkillSphere
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Overview */}
              <Card className="p-6 bg-gradient-card border-primary/20">
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="w-20 h-20 border-4 border-primary/20">
                    <AvatarFallback className="bg-gradient-hero text-white text-2xl font-bold">
                      {userStats.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{userStats.name}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span>{userStats.rating} Rating</span>
                      <span>•</span>
                      <span>Level {userStats.level}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress to Level {userStats.level + 1}</span>
                        <span className="font-semibold">{userStats.points} / {userStats.nextLevelPoints} XP</span>
                      </div>
                      <Progress value={levelProgress} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-primary">{userStats.skillsLearned}</div>
                    <div className="text-xs text-muted-foreground mt-1">Skills Learned</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-accent">{userStats.skillsTaught}</div>
                    <div className="text-xs text-muted-foreground mt-1">Skills Taught</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-success">₹{userStats.earningsThisMonth}</div>
                    <div className="text-xs text-muted-foreground mt-1">This Month</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-secondary">{userStats.exchangesCompleted}</div>
                    <div className="text-xs text-muted-foreground mt-1">Exchanges</div>
                  </div>
                </div>
              </Card>

              {/* Skill Pathways */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Your Skill Pathways
                  </h3>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="space-y-4">
                  {skillPathways.map((pathway) => (
                    <div key={pathway.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{pathway.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {pathway.completed}/{pathway.total} completed
                        </span>
                      </div>
                      <Progress value={pathway.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activities */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Recent Activities
                </h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
                        {activity.type === "exchange" && <Users className="w-5 h-5 text-white" />}
                        {activity.type === "gig" && <DollarSign className="w-5 h-5 text-white" />}
                        {activity.type === "mentor" && <MessageCircle className="w-5 h-5 text-white" />}
                        {activity.type === "badge" && <Award className="w-5 h-5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">{activity.title}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{activity.time}</span>
                          {activity.skill && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">
                                {activity.skill}
                              </Badge>
                            </>
                          )}
                          {activity.amount && (
                            <>
                              <span>•</span>
                              <span className="text-success font-semibold">{activity.amount}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <span>+{activity.points}</span>
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Achievements */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Your Badges
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg ${
                        badge.earned
                          ? "bg-gradient-card border border-primary/20"
                          : "bg-muted/30 opacity-50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${
                          badge.earned ? "bg-gradient-hero" : "bg-muted"
                        } flex items-center justify-center`}
                      >
                        <badge.icon
                          className={`w-6 h-6 ${badge.earned ? "text-white" : "text-muted-foreground"}`}
                        />
                      </div>
                      <span className="text-xs text-center font-medium">{badge.name}</span>
                      {badge.earned && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant="outline">
                  View All Achievements
                </Button>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Target className="w-4 h-4" />
                    Take Career Quiz
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <Users className="w-4 h-4" />
                    Find Skill Match
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <MessageCircle className="w-4 h-4" />
                    Connect with Mentor
                  </Button>
                  <Button className="w-full justify-start gap-2" variant="outline">
                    <DollarSign className="w-4 h-4" />
                    Browse Local Gigs
                  </Button>
                </div>
              </Card>

              {/* Leaderboard Preview */}
              <Card className="p-6 bg-gradient-card border-primary/20">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-secondary" />
                  Your Rank
                </h3>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                    #{Math.max(100 - (userData?.completedAssessments || 0) * 10, 1)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    in your local community
                  </p>
                </div>
                <Button className="w-full" variant="secondary">
                  View Full Leaderboard
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
