import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Spline from '@splinetool/react-spline';
import {
  Sparkles,
  Users,
  TrendingUp,
  MapPin,
  Award,
  Briefcase,
  ArrowRight,
  BookOpen,
  Target,
  CheckCircle2,
  Zap,
} from "lucide-react";

import skillsPattern from "@/assets/skills-pattern.jpg";

const Index = () => {
  const features = [
    {
      icon: Target,
      title: "CareerLens",
      description:
        "AI-powered career guidance to discover your strengths and map your perfect career path.",
      color: "text-primary",
      gradient: "bg-gradient-hero",
      link: "/career-lens",
    },
    {
      icon: Users,
      title: "Skill Exchange",
      description:
        "Learn from peers and teach what you know. Build a community of mutual growth.",
      color: "text-accent",
      gradient: "bg-gradient-to-br from-accent to-primary",
      link: "/skill-exchange",
    },
    {
      icon: MapPin,
      title: "SkillLink",
      description:
        "Connect with local opportunities. Offer your skills, find gigs, and earn in your community.",
      color: "text-secondary",
      gradient: "bg-gradient-secondary",
      link: "/skill-link",
    },
  ];



  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white">
        <Navigation />
      </div>

      {/* Hero Section */}
      <section className="relative pt-8 pb-4 px-4 overflow-hidden bg-gradient-to-br from-primary to-primary/90">
        {/* Animated Glow Effects */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm animate-fade-in">
                <Zap className="w-4 h-4 text-white animate-pulse" />
                <span className="text-sm font-semibold text-white">
                  Empowering 10,000+ Learners Across Rural India
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-white">
                  Learn. Earn.
                </span>
                <br />
                <span className="text-white/90">Connect & Grow.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                Bridge the gap between learning and earning. Discover your strengths,
                exchange skills with peers, and unlock{" "}
                <span className="text-white font-semibold">local opportunities</span> with
                SkillConnect.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="gap-2 shadow-glow text-lg px-8 py-6 hover:scale-105 transition-transform bg-white text-primary border-2 border-white hover:bg-white/90">
                    <Sparkles className="w-5 h-5" />
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/skill-exchange">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 backdrop-blur-sm hover:scale-105 transition-transform border-2 border-primary bg-primary text-white hover:bg-primary/90">
                    Explore Features
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-6 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>AI-Powered Guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Verified Mentors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Local Opportunities</span>
                </div>
              </div>
            </div>

            {/* Right Side - 3D Robot */}
            <div className="relative h-[700px] lg:h-[900px] w-full lg:w-[120%] lg:ml-16 lg:pl-8">
              <div className="absolute inset-0 w-full h-full lg:left-8">
                <Spline scene="https://prod.spline.design/rU2-Ks0SC0T5od9B/scene.splinecode" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 px-4 relative">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url(${skillsPattern})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">Grow</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive ecosystem designed to help you discover, learn,
              and monetize your skills locally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="p-8 h-full hover:shadow-glow transition-all duration-300 cursor-pointer group border-border/50 hover:border-primary/50 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
                  <div
                    className={`w-14 h-14 rounded-xl ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  <div className="flex items-center gap-2 mt-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    <span className="text-sm">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="py-16 px-4 border-t border-border bg-gradient-to-br from-primary to-primary/90">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  SkillConnect
                </span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Empowering communities through skills and opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Platform</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/career-lens" className="hover:text-white transition-colors">CareerLens</Link></li>
                <li><Link to="/skill-exchange" className="hover:text-white transition-colors">Skill Exchange</Link></li>
                <li><Link to="/skill-link" className="hover:text-white transition-colors">SkillLink</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Community</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Find Mentors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Join Hub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/20">
            <p className="text-sm text-white/70">
              © 2025 SkillConnect. Empowering communities through skills and opportunities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
