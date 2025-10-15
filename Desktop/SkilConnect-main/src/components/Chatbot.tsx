import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useLocation } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! 👋 I'm Chitti, your AI Skill Mentor. What do you want help with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Show chatbot on all pages including homepage

  const quickActions = [
    { text: "💡 Learn a new skill", action: "learn_skill" },
    { text: "🔍 Find skill partners", action: "find_partners" },
    { text: "🧭 Navigate the site", action: "navigate_site" },
    { text: "💬 Ask about web development", action: "web_dev_help" }
  ];

  // GPT Integration (Optional)
  const getGPTResponse = async (userMessage: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      return getBotResponse(userMessage); // Fallback to predefined responses
    }
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are Chitti, an AI Skill Mentor for SkillConnect platform. Help users with:
- Career guidance and skill recommendations
- Finding mentors and learning opportunities
- Using SkillConnect features (CareerLens, SkillExchange, SkillLink, MentorConnect)
- Creating skill exchange posts
Be friendly, concise, and always guide users to relevant SkillConnect features.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });
      
      const data = await response.json();
      return data.choices[0]?.message?.content || getBotResponse(userMessage);
    } catch (error) {
      console.error('GPT API Error:', error);
      return getBotResponse(userMessage); // Fallback to predefined responses
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Website Navigation Help
    if (message.includes('create') && message.includes('post')) {
      return "To create a skill exchange post: Go to SkillExchange page → Click 'Create Post' → Fill what you can teach and what you want to learn → Click 'Create Post'. You'll get matched with relevant learners!";
    }
    
    if (message.includes('navigate') || message.includes('how') && message.includes('use')) {
      return "SkillConnect has 4 main sections:\n🔍 CareerLens - Take assessment to discover your career path\n🤝 SkillExchange - Create posts to teach/learn skills\n🔗 SkillLink - Find local events and opportunities\n👥 Dashboard - Manage your profile and activities\n\nWhich would you like to explore?";
    }
    
    if (message.includes('edit') && message.includes('post')) {
      return "To edit your post: Go to Dashboard → Find your post in 'My Posts' section → Click 'Edit' → Make changes → Save. You can update skills offered, wanted, or description anytime!";
    }
    
    // Skill Partner Finder
    if (message.includes('find') && (message.includes('partner') || message.includes('mentor'))) {
      return "To find skill partners: Go to SkillExchange → Browse posts or use search filters → Look for skills you want to learn → Click 'Connect' to message them. You can also post what you're looking for!";
    }
    
    // Web Development Learning
    if (message.includes('javascript') || message.includes('js')) {
      return "To learn JavaScript: Start with basics on MDN Web Docs → Practice with small projects like a to-do list → Learn DOM manipulation → Try building interactive websites. Want me to find JavaScript mentors on SkillExchange?";
    }
    
    if (message.includes('react')) {
      return "For React learning: Master JavaScript first → Learn React basics (components, props, state) → Practice with create-react-app → Build projects like a weather app. Check SkillExchange for React mentors!";
    }
    
    if (message.includes('css') && message.includes('layout')) {
      return "For CSS layout issues: Try using Flexbox for 1D layouts or CSS Grid for 2D layouts → Avoid floats for modern layouts → Use developer tools to debug. Want sample code or a CSS mentor?";
    }
    
    // Location-based suggestions
    if (message.includes('near') && message.includes('bangalore')) {
      return "For events near Bangalore: Go to SkillLink → Select your profession → Choose 'Bangalore' location → Click Search. You'll see workshops, jobs, and learning opportunities in your area!";
    }
    
    // Career and Skills
    if (message.includes('career') || message.includes('job')) {
      return "For career guidance: Take our CareerLens assessment first! It analyzes your strengths and suggests perfect career paths with learning roadmaps. Click on CareerLens in the navigation menu.";
    }
    
    if (message.includes('skill') && (message.includes('learn') || message.includes('recommend'))) {
      return "Popular skills to learn: Web Development (HTML, CSS, JavaScript, React), Data Analysis (Python, SQL), Digital Marketing (SEO, Social Media), UI/UX Design. What interests you most?";
    }
    
    // Platform-specific questions
    if (message.includes('skillconnect') || message.includes('what is')) {
      return "SkillConnect is a platform where learners and professionals exchange skills! You can teach what you know, learn what you want, find mentors, discover career paths, and connect with local opportunities.";
    }
    
    if (message.includes('contact') && message.includes('user')) {
      return "To contact a user: Visit their profile from SkillExchange → Click 'Message' or 'Connect' button → Send them a message about skill exchange. Be specific about what you can offer and what you want to learn!";
    }
    
    // Greetings
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm Chitti, your learning companion. I can help you navigate SkillConnect, find skill partners, get web development tips, or answer questions about using the platform. What would you like help with?";
    }
    
    return "I can help with:\n• Navigating SkillConnect features\n• Finding skill partners and mentors\n• Web development learning tips\n• Creating and managing posts\n• Career guidance\n\nWhat specific help do you need?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const currentMessage = inputMessage;
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const responseText = await getGPTResponse(currentMessage);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(currentMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      learn_skill: "What skills should I learn?",
      find_partners: "How do I find skill partners?",
      navigate_site: "How do I use SkillConnect?",
      web_dev_help: "How do I start learning JavaScript?"
    };
    
    setInputMessage(actionMessages[action as keyof typeof actionMessages]);
    handleSendMessage();
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-gradient-to-r from-[#00d4aa] to-[#00b894] hover:from-[#00b894] hover:to-[#00a085] shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] flex flex-col bg-white shadow-2xl z-50 border-2 border-[#00d4aa]/30">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#00d4aa] to-[#00b894] text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Chitti</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-[#00d4aa] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="p-3 border-t">
              <div className="grid grid-cols-1 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs justify-start h-8"
                  >
                    {action.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your question..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon" className="h-10 w-10">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;