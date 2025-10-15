import { useState } from "react";
import { Bot, Send, Lightbulb, BookOpen, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SmartMentorProps {
  skillArea: string;
  onRecommendMentor: (mentorId: string) => void;
}

const SmartMentor = ({ skillArea, onRecommendMentor }: SmartMentorProps) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: `Hi! I'm SmartMentor, your AI-powered guidance assistant. I can help you with ${skillArea} questions, suggest learning paths, and recommend the best human mentors for your needs. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: "Learning Path",
      action: "learning-path",
      description: "Get a personalized learning roadmap"
    },
    {
      icon: <Target className="w-4 h-4" />,
      label: "Career Advice",
      action: "career-advice",
      description: "Discuss career goals and next steps"
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: "Skill Assessment",
      action: "skill-assessment",
      description: "Evaluate your current skill level"
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      label: "Project Ideas",
      action: "project-ideas",
      description: "Get suggestions for practice projects"
    }
  ];

  const aiResponses = {
    "learning-path": `Based on your interest in ${skillArea}, here's a suggested learning path:

1. **Foundation** (2-4 weeks)
   - Core concepts and terminology
   - Basic tools and setup

2. **Intermediate** (4-8 weeks)
   - Hands-on projects
   - Best practices and patterns

3. **Advanced** (6-12 weeks)
   - Complex implementations
   - Industry standards

4. **Specialization** (Ongoing)
   - Choose your focus area
   - Build portfolio projects

Would you like me to connect you with a human mentor who specializes in ${skillArea} for personalized guidance?`,

    "career-advice": `For a career in ${skillArea}, consider these paths:

**Entry Level Roles:**
- Junior positions requiring 0-2 years experience
- Focus on building foundational skills
- Average salary: $45,000 - $65,000

**Mid-Level Roles:**
- 2-5 years experience
- Lead small projects and mentor juniors
- Average salary: $65,000 - $95,000

**Senior Level Roles:**
- 5+ years experience
- Strategic decision making and architecture
- Average salary: $95,000 - $150,000+

I can connect you with experienced professionals who've navigated these career paths successfully.`,

    "skill-assessment": `Let's assess your ${skillArea} skills:

**Beginner Level:**
- Understanding basic concepts
- Can follow tutorials
- Needs guidance for projects

**Intermediate Level:**
- Can work independently on projects
- Understands best practices
- Can debug common issues

**Advanced Level:**
- Can architect solutions
- Mentors others
- Contributes to community

Based on your self-assessment, I can recommend mentors who specialize in your skill level.`,

    "project-ideas": `Here are some ${skillArea} project ideas to build your portfolio:

**Beginner Projects:**
- Simple applications following tutorials
- Basic implementations of core concepts
- Small personal projects

**Intermediate Projects:**
- Full-stack applications
- Integration with APIs
- Collaborative projects

**Advanced Projects:**
- Open source contributions
- Complex system architecture
- Innovation and research projects

A mentor can help you choose the right projects and provide code reviews!`
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: `I understand you're asking about "${inputMessage}". While I can provide general guidance, a human mentor with expertise in ${skillArea} would give you much more personalized and detailed advice. 

Here are some immediate suggestions:
- Practice regularly with hands-on projects
- Join communities and forums related to ${skillArea}
- Build a portfolio showcasing your work
- Stay updated with industry trends

Would you like me to recommend some top-rated mentors who can provide deeper insights into your specific question?`,
        timestamp: new Date(),
        showMentorRecommendation: true
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const response = {
      id: messages.length + 1,
      type: 'ai',
      content: aiResponses[action as keyof typeof aiResponses],
      timestamp: new Date(),
      showMentorRecommendation: true
    };
    
    setMessages(prev => [...prev, response]);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          SmartMentor AI
          <Badge variant="secondary" className="ml-auto">
            {skillArea}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.action}
              variant="outline"
              size="sm"
              className="h-auto p-2 flex flex-col items-start gap-1"
              onClick={() => handleQuickAction(action.action)}
            >
              <div className="flex items-center gap-2 w-full">
                {action.icon}
                <span className="text-xs font-medium">{action.label}</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                {action.description}
              </span>
            </Button>
          ))}
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                  {message.showMentorRecommendation && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => onRecommendMentor('recommended')}
                      >
                        Connect with Human Mentor
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything about your learning journey..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!inputMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-muted-foreground text-center">
          SmartMentor provides general guidance. For personalized advice, connect with human mentors.
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartMentor;