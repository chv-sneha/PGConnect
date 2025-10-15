import { useState } from "react";
import { Brain, ArrowRight, CheckCircle, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SkillPathwayGeneratorProps {
  mentorExpertise: string[];
  onPathwaySelect: (pathway: any) => void;
}

const SkillPathwayGenerator = ({ mentorExpertise, onPathwaySelect }: SkillPathwayGeneratorProps) => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const pathwayTemplates = {
    "AI/ML": {
      beginner: {
        title: "AI/ML Engineer Path",
        duration: "6-12 months",
        difficulty: "Intermediate",
        steps: [
          { name: "Python Fundamentals", duration: "2-3 weeks", completed: false },
          { name: "Statistics & Mathematics", duration: "3-4 weeks", completed: false },
          { name: "Data Manipulation (Pandas/NumPy)", duration: "2 weeks", completed: false },
          { name: "Machine Learning Basics", duration: "4-6 weeks", completed: false },
          { name: "Deep Learning Fundamentals", duration: "6-8 weeks", completed: false },
          { name: "MLOps & Deployment", duration: "3-4 weeks", completed: false },
          { name: "Portfolio Projects", duration: "4-6 weeks", completed: false }
        ],
        skills: ["Python", "TensorFlow", "Scikit-learn", "MLOps", "Statistics"],
        outcomes: ["Junior ML Engineer", "Data Scientist", "AI Researcher"]
      },
      advanced: {
        title: "Senior AI/ML Specialist",
        duration: "8-15 months",
        difficulty: "Advanced",
        steps: [
          { name: "Advanced Deep Learning", duration: "6-8 weeks", completed: false },
          { name: "Computer Vision", duration: "4-6 weeks", completed: false },
          { name: "Natural Language Processing", duration: "6-8 weeks", completed: false },
          { name: "MLOps & Production Systems", duration: "4-6 weeks", completed: false },
          { name: "Research & Publications", duration: "8-12 weeks", completed: false },
          { name: "Leadership & Team Management", duration: "4-6 weeks", completed: false }
        ],
        skills: ["PyTorch", "Transformers", "Kubernetes", "Research", "Leadership"],
        outcomes: ["Senior ML Engineer", "AI Research Lead", "CTO"]
      }
    },
    "UI/UX Design": {
      beginner: {
        title: "UI/UX Designer Path",
        duration: "4-8 months",
        difficulty: "Beginner",
        steps: [
          { name: "Design Fundamentals", duration: "2-3 weeks", completed: false },
          { name: "User Research Methods", duration: "3-4 weeks", completed: false },
          { name: "Wireframing & Prototyping", duration: "3-4 weeks", completed: false },
          { name: "Visual Design & Typography", duration: "4-5 weeks", completed: false },
          { name: "Design Tools (Figma/Sketch)", duration: "2-3 weeks", completed: false },
          { name: "Usability Testing", duration: "2-3 weeks", completed: false },
          { name: "Portfolio Development", duration: "4-6 weeks", completed: false }
        ],
        skills: ["Figma", "User Research", "Prototyping", "Visual Design", "Testing"],
        outcomes: ["Junior UX Designer", "Product Designer", "UI Designer"]
      }
    },
    "Digital Marketing": {
      beginner: {
        title: "Digital Marketing Specialist",
        duration: "3-6 months",
        difficulty: "Beginner",
        steps: [
          { name: "Marketing Fundamentals", duration: "2 weeks", completed: false },
          { name: "SEO & Content Marketing", duration: "3-4 weeks", completed: false },
          { name: "Social Media Marketing", duration: "2-3 weeks", completed: false },
          { name: "Google Ads & PPC", duration: "3-4 weeks", completed: false },
          { name: "Analytics & Data Analysis", duration: "2-3 weeks", completed: false },
          { name: "Email Marketing", duration: "2 weeks", completed: false },
          { name: "Campaign Management", duration: "4-6 weeks", completed: false }
        ],
        skills: ["SEO", "Google Analytics", "Social Media", "PPC", "Content Strategy"],
        outcomes: ["Digital Marketing Specialist", "Growth Marketer", "Marketing Manager"]
      }
    }
  };

  const getRelevantPathways = () => {
    const pathways = [];
    mentorExpertise.forEach(skill => {
      if (pathwayTemplates[skill as keyof typeof pathwayTemplates]) {
        const templates = pathwayTemplates[skill as keyof typeof pathwayTemplates];
        Object.entries(templates).forEach(([level, pathway]) => {
          pathways.push({ ...pathway, skill, level });
        });
      }
    });
    return pathways;
  };

  const relevantPathways = getRelevantPathways();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">AI-Powered Skill Pathways</h2>
        </div>
        <p className="text-muted-foreground">
          Personalized learning roadmaps generated based on your mentor's expertise and your career goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {relevantPathways.map((pathway, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onPathwaySelect(pathway)}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{pathway.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{pathway.skill}</Badge>
                    <Badge variant={pathway.level === 'beginner' ? 'secondary' : 'default'}>
                      {pathway.level}
                    </Badge>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {pathway.duration}
                  </div>
                  <div className="mt-1">{pathway.difficulty}</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress Overview */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>0/{pathway.steps.length} completed</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>

              {/* Key Steps Preview */}
              <div>
                <h4 className="font-medium text-sm mb-2">Learning Path:</h4>
                <div className="space-y-2">
                  {pathway.steps.slice(0, 3).map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {stepIndex + 1}
                      </div>
                      <span className="flex-1">{step.name}</span>
                      <span className="text-muted-foreground text-xs">{step.duration}</span>
                    </div>
                  ))}
                  {pathway.steps.length > 3 && (
                    <div className="text-sm text-muted-foreground text-center">
                      +{pathway.steps.length - 3} more steps
                    </div>
                  )}
                </div>
              </div>

              {/* Skills & Outcomes */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Skills You'll Learn:</h4>
                  <div className="flex flex-wrap gap-1">
                    {pathway.skills.slice(0, 4).map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {pathway.skills.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{pathway.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Career Outcomes:</h4>
                  <div className="flex flex-wrap gap-1">
                    {pathway.outcomes.slice(0, 2).map((outcome, outcomeIndex) => (
                      <Badge key={outcomeIndex} variant="outline" className="text-xs">
                        <Target className="w-3 h-3 mr-1" />
                        {outcome}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={() => onPathwaySelect(pathway)}>
                Start This Pathway
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {relevantPathways.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">Custom Pathway Available</h3>
            <p className="text-muted-foreground mb-4">
              This mentor can create a personalized learning path based on your specific goals and current skill level.
            </p>
            <Button onClick={() => onPathwaySelect({ custom: true })}>
              Request Custom Pathway
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SkillPathwayGenerator;