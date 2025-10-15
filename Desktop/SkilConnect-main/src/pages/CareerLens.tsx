import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import { Target, ArrowRight, TrendingUp, Loader2, ExternalLink, BookOpen, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CareerLens = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [descriptiveAnswers, setDescriptiveAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState<any[]>([]);
  const [questionWeights, setQuestionWeights] = useState<any[]>([]);
  const [careerRoadmaps, setCareerRoadmaps] = useState<any[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [showCareerDetails, setShowCareerDetails] = useState(false);

  const questions = [
    {
      question: "What type of activities do you enjoy most?",
      type: "multiple",
      options: [
        { text: "Working with technology", category: "Tech" },
        { text: "Creating art", category: "Creative" },
        { text: "Helping others", category: "Social" },
        { text: "Building things", category: "Practical" }
      ]
    },
    {
      question: "What are your strongest skills?",
      type: "multiple",
      options: [
        { text: "Problem-solving", category: "Tech" },
        { text: "Creativity", category: "Creative" },
        { text: "Communication", category: "Social" },
        { text: "Practical skills", category: "Practical" }
      ]
    },
    {
      question: "What motivates you the most?",
      type: "multiple",
      options: [
        { text: "Innovation", category: "Tech" },
        { text: "Creativity", category: "Creative" },
        { text: "Helping others", category: "Social" },
        { text: "Tangible results", category: "Practical" }
      ]
    },
    {
      question: "How do you prefer to learn new skills?",
      type: "multiple",
      options: [
        { text: "Online tutorials", category: "Tech" },
        { text: "Hands-on practice", category: "Creative" },
        { text: "Mentors & guidance", category: "Social" },
        { text: "Books & manuals", category: "Practical" }
      ]
    },
    {
      question: "What kind of projects excite you?",
      type: "multiple",
      options: [
        { text: "Coding/app development", category: "Tech" },
        { text: "Art & design", category: "Creative" },
        { text: "Community service", category: "Social" },
        { text: "Engineering & building", category: "Practical" }
      ]
    },
    {
      question: "What do you value most in a career?",
      type: "multiple",
      options: [
        { text: "Growth & innovation", category: "Tech" },
        { text: "Creative freedom", category: "Creative" },
        { text: "Social impact", category: "Social" },
        { text: "Stability & security", category: "Practical" }
      ]
    },
    {
      question: "How comfortable are you with technology?",
      type: "multiple",
      options: [
        { text: "Very comfortable", category: "Tech" },
        { text: "Somewhat comfortable", category: "Creative" },
        { text: "Basic usage only", category: "Social" },
        { text: "Prefer non-tech work", category: "Practical" }
      ]
    },
    {
      question: "What are the things that make you happy?",
      type: "descriptive",
      placeholder: "Describe activities, experiences, or situations that bring you joy and satisfaction...",
      options: []
    },
    {
      question: "What are your hobbies?",
      type: "descriptive",
      placeholder: "List your hobbies and interests (e.g., reading, sports, music, cooking, etc.)...",
      options: []
    },
    {
      question: "What skills do you currently know?",
      type: "descriptive",
      placeholder: "List your current skills and abilities (technical, creative, interpersonal, etc.)...",
      options: []
    }
  ];

  // Firebase data fetching
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch careers
      const careersSnapshot = await getDocs(collection(db, 'careers'));
      const careersData = careersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCareers(careersData);
      
      // Fetch question weights
      const weightsSnapshot = await getDocs(collection(db, 'question_weights'));
      const weightsData = weightsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuestionWeights(weightsData);
      
      // Fetch career roadmaps
      const roadmapsSnapshot = await getDocs(collection(db, 'career_roadmaps_with_skills_links'));
      const roadmapsData = roadmapsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCareerRoadmaps(roadmapsData);
      
      setLoading(false);
    } catch (error) {
      console.error('Firebase error:', error);
      setLoading(false);
      // Set fallback data
      setCareers([
        { id: '1', title: 'Software Developer', category: 'Tech', description: 'Build web applications', min_salary: 600000, max_salary: 1500000, skills_required: 'JavaScript,Python,React', growth_rate: 'High', remote_work: true },
        { id: '2', title: 'Data Scientist', category: 'Tech', description: 'Analyze data for insights', min_salary: 800000, max_salary: 2500000, skills_required: 'Python,SQL,Machine Learning', growth_rate: 'Very High', remote_work: true },
        { id: '3', title: 'UI/UX Designer', category: 'Creative', description: 'Design user experiences', min_salary: 400000, max_salary: 1500000, skills_required: 'Figma,Design,Prototyping', growth_rate: 'High', remote_work: true },
        { id: '4', title: 'HR Specialist', category: 'Social', description: 'Manage human resources', min_salary: 400000, max_salary: 1200000, skills_required: 'Communication,Leadership,Training', growth_rate: 'Medium', remote_work: false },
        { id: '5', title: 'Civil Engineer', category: 'Practical', description: 'Design construction projects', min_salary: 400000, max_salary: 1500000, skills_required: 'AutoCAD,Project Management,Design', growth_rate: 'Medium', remote_work: false }
      ]);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleAnswer = (value: string) => {
    if (questions[currentQuestion].type === 'multiple') {
      setAnswers({ ...answers, [currentQuestion]: value });
    } else {
      setDescriptiveAnswers({ ...descriptiveAnswers, [currentQuestion]: value });
    }
  };

  const handleNext = () => {
    const currentQ = questions[currentQuestion];
    
    if (currentQ.type === 'multiple' && !answers[currentQuestion]) {
      toast({
        title: "Please select an option",
        description: "Choose an answer to continue",
        variant: "destructive",
      });
      return;
    }
    
    if (currentQ.type === 'descriptive' && !descriptiveAnswers[currentQuestion]?.trim()) {
      toast({
        title: "Please provide an answer",
        description: "Write your response to continue",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Handle Start Learning button - use CSV roadmap links
  const handleStartLearning = (career: any) => {
    // Find roadmap link from CSV data
    const roadmapData = careerRoadmaps.find(roadmap => 
      roadmap.title?.toLowerCase() === career.title?.toLowerCase()
    );
    
    let url = 'https://roadmap.sh/'; // Default fallback
    
    if (roadmapData && roadmapData.link) {
      url = roadmapData.link;
    } else {
      // Fallback: try to find partial match
      const partialMatch = careerRoadmaps.find(roadmap => 
        roadmap.title?.toLowerCase().includes(career.title?.toLowerCase().split(' ')[0]) ||
        career.title?.toLowerCase().includes(roadmap.title?.toLowerCase().split(' ')[0])
      );
      
      if (partialMatch && partialMatch.link) {
        url = partialMatch.link;
      }
    }
    
    console.log(`Career: ${career.title} -> Roadmap: ${url}`);
    window.open(url, '_blank');
  };

  // Handle View Details button
  const handleViewDetails = (career: any) => {
    setSelectedCareer(career);
    setShowCareerDetails(true);
  };

  // Get learning path for career
  const getLearningPath = (category: string) => {
    const paths = {
      Tech: ['HTML/CSS Basics', 'JavaScript Fundamentals', 'React Framework', 'System Design'],
      Creative: ['Design Principles', 'Adobe Creative Suite', 'UI/UX Principles', 'Portfolio Development'],
      Social: ['Communication Skills', 'Psychology Basics', 'Counseling Techniques', 'Leadership Development'],
      Practical: ['Technical Drawing', 'Project Planning', 'Quality Control', 'Advanced Engineering']
    };
    return paths[category as keyof typeof paths] || [];
  };

  // Advanced AI Analysis for descriptive answers
  const analyzeDescriptiveAnswers = () => {
    const scores = { Tech: 0, Creative: 0, Social: 0, Practical: 0 };
    
    // Enhanced keyword dictionaries with weighted importance
    const keywords = {
      Tech: {
        core: { weight: 3, terms: ['programming', 'coding', 'software', 'development', 'algorithm', 'data', 'tech', 'digital', 'computer'] },
        languages: { weight: 2.5, terms: ['python', 'javascript', 'java', 'react', 'node', 'html', 'css', 'sql', 'c++', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript'] },
        tools: { weight: 2, terms: ['github', 'vscode', 'docker', 'kubernetes', 'aws', 'cloud', 'linux', 'android', 'ios', 'web', 'mobile', 'app', 'database', 'api'] },
        advanced: { weight: 3.5, terms: ['ai', 'ml', 'machine learning', 'data science', 'cybersecurity', 'blockchain', 'devops', 'automation', 'testing', 'debugging', 'fullstack'] },
        activities: { weight: 2, terms: ['hackathon', 'opensource', 'github', 'stackoverflow', 'leetcode', 'competitive programming', 'tech blog'] }
      },
      Creative: {
        core: { weight: 3, terms: ['art', 'design', 'creative', 'artistic', 'visual', 'aesthetic', 'beautiful', 'imagination', 'inspiration', 'expression'] },
        skills: { weight: 2.5, terms: ['drawing', 'painting', 'sketching', 'illustration', 'photography', 'videography', 'editing', 'animation', 'graphics', 'ui', 'ux'] },
        tools: { weight: 2, terms: ['photoshop', 'illustrator', 'figma', 'canva', 'premiere', 'after effects', 'blender', 'sketch', 'indesign', 'procreate'] },
        activities: { weight: 2.5, terms: ['music', 'singing', 'dancing', 'writing', 'storytelling', 'poetry', 'theater', 'film', 'fashion', 'interior design', 'crafts'] },
        advanced: { weight: 3, terms: ['portfolio', 'exhibition', 'gallery', 'commission', 'freelance design', 'brand identity', 'motion graphics'] }
      },
      Social: {
        core: { weight: 3, terms: ['people', 'helping', 'community', 'social', 'teamwork', 'collaboration', 'communication', 'interaction', 'relationship'] },
        skills: { weight: 2.5, terms: ['leadership', 'management', 'teaching', 'mentoring', 'counseling', 'coaching', 'training', 'presenting', 'negotiation'] },
        activities: { weight: 2.5, terms: ['volunteering', 'charity', 'nonprofit', 'social work', 'healthcare', 'education', 'customer service', 'hr', 'recruiting'] },
        traits: { weight: 2, terms: ['empathy', 'listening', 'understanding', 'caring', 'supportive', 'motivating', 'inspiring', 'organizing', 'events'] },
        advanced: { weight: 3, terms: ['public speaking', 'workshop', 'seminar', 'conference', 'networking', 'community building', 'social impact'] }
      },
      Practical: {
        core: { weight: 3, terms: ['building', 'making', 'fixing', 'repairing', 'constructing', 'assembling', 'manufacturing', 'hands-on', 'physical'] },
        skills: { weight: 2.5, terms: ['mechanical', 'electrical', 'plumbing', 'carpentry', 'welding', 'maintenance', 'installation', 'troubleshooting'] },
        activities: { weight: 2, terms: ['crafting', 'woodworking', 'metalworking', 'gardening', 'farming', 'cooking', 'baking', 'sewing', 'knitting', 'diy'] },
        tools: { weight: 2, terms: ['tools', 'machinery', 'equipment', 'hardware', 'instruments', 'workshop', 'garage', 'laboratory'] },
        advanced: { weight: 3, terms: ['engineering', 'architecture', 'construction', 'automotive', 'electronics', 'robotics', 'prototype'] }
      }
    };

    // Sentiment and context analysis patterns
    const contextPatterns = {
      passion: /\b(love|passion|enjoy|excited|fascinated|obsessed)\b/gi,
      expertise: /\b(expert|professional|experienced|skilled|proficient|advanced)\b/gi,
      learning: /\b(learning|studying|practicing|improving|developing)\b/gi,
      achievement: /\b(built|created|developed|designed|managed|led|achieved)\b/gi
    };

    Object.entries(descriptiveAnswers).forEach(([questionIndex, answer]) => {
      const qIndex = parseInt(questionIndex);
      const text = answer.toLowerCase().trim();
      
      if (!text || text.length < 10) return; // Skip very short answers
      
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
      const words = text.split(/\s+/).filter(w => w.length > 2);
      
      // Question-specific weights and analysis
      const questionConfig = {
        7: { weight: 3.5, focus: 'passion' }, // Happiness - what drives you
        8: { weight: 2.5, focus: 'interest' }, // Hobbies - personal interests
        9: { weight: 4, focus: 'expertise' }   // Skills - professional abilities
      };
      
      const config = questionConfig[qIndex as keyof typeof questionConfig] || { weight: 1, focus: 'general' };
      
      // Analyze each category with enhanced scoring
      Object.entries(keywords).forEach(([category, categoryGroups]) => {
        let categoryScore = 0;
        let matchCount = 0;
        
        // Process each keyword group with weights
        Object.entries(categoryGroups).forEach(([groupName, group]) => {
          const { weight: groupWeight, terms } = group;
          
          terms.forEach(term => {
            let termScore = 0;
            const termRegex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            const matches = text.match(termRegex);
            
            if (matches) {
              matchCount++;
              // Base score for exact matches
              termScore += matches.length * groupWeight;
              
              // Bonus for multi-word terms (more specific)
              if (term.includes(' ')) termScore *= 1.3;
              
              // Context bonus based on surrounding words
              sentences.forEach(sentence => {
                if (sentence.includes(term)) {
                  // Passion indicators
                  if (contextPatterns.passion.test(sentence)) termScore *= 1.4;
                  // Expertise indicators  
                  if (contextPatterns.expertise.test(sentence)) termScore *= 1.3;
                  // Achievement indicators
                  if (contextPatterns.achievement.test(sentence)) termScore *= 1.2;
                  // Learning indicators
                  if (contextPatterns.learning.test(sentence)) termScore *= 1.1;
                }
              });
            }
            
            // Fuzzy matching for related terms
            words.forEach(word => {
              if (word.includes(term) && word !== term && word.length > term.length) {
                termScore += groupWeight * 0.3; // Partial match bonus
              }
            });
            
            categoryScore += termScore;
          });
        });
        
        // Apply question-specific multipliers
        if (qIndex === 7) { // Happiness analysis - emotional connection
          if (category === 'Tech' && (text.includes('solve') || text.includes('problem') || text.includes('logic'))) categoryScore *= 1.5;
          if (category === 'Creative' && (text.includes('create') || text.includes('express') || text.includes('beauty'))) categoryScore *= 1.5;
          if (category === 'Social' && (text.includes('connect') || text.includes('help') || text.includes('share'))) categoryScore *= 1.5;
          if (category === 'Practical' && (text.includes('build') || text.includes('make') || text.includes('useful'))) categoryScore *= 1.5;
        }
        
        if (qIndex === 8) { // Hobbies analysis - personal interests
          // Time investment indicators
          if (text.includes('daily') || text.includes('regularly') || text.includes('often')) categoryScore *= 1.2;
          if (text.includes('weekend') || text.includes('free time') || text.includes('spare time')) categoryScore *= 1.1;
        }
        
        if (qIndex === 9) { // Skills analysis - professional capabilities
          // Experience level indicators
          const experienceMatch = text.match(/(\d+)\s*(year|yr|month|mo)/gi);
          if (experienceMatch) {
            experienceMatch.forEach(match => {
              const timeValue = parseInt(match);
              const isYears = match.includes('year') || match.includes('yr');
              const experienceBonus = isYears ? timeValue * 0.3 : timeValue * 0.025;
              categoryScore += experienceBonus;
            });
          }
          
          // Certification and formal training
          if (text.includes('certified') || text.includes('certificate') || text.includes('degree')) categoryScore *= 1.4;
          if (text.includes('course') || text.includes('training') || text.includes('bootcamp')) categoryScore *= 1.2;
          
          // Professional context
          if (text.includes('work') || text.includes('job') || text.includes('professional') || text.includes('company')) categoryScore *= 1.3;
        }
        
        // Diversity bonus - reward varied interests
        if (matchCount > 3) categoryScore *= 1.1;
        if (matchCount > 6) categoryScore *= 1.2;
        
        // Apply final question weight and add to total
        scores[category as keyof typeof scores] += categoryScore * config.weight;
      });
      
      // Advanced pattern recognition
      const advancedPatterns = {
        Tech: [
          /\b(full.?stack|front.?end|back.?end|dev.?ops)\b/gi,
          /\b(startup|tech.?company|software.?company)\b/gi,
          /\b(open.?source|github|stack.?overflow)\b/gi
        ],
        Creative: [
          /\b(portfolio|exhibition|gallery|commission)\b/gi,
          /\b(brand|identity|visual.?design|user.?experience)\b/gi,
          /\b(freelance|creative.?agency|design.?studio)\b/gi
        ],
        Social: [
          /\b(public.?speaking|presentation|workshop|seminar)\b/gi,
          /\b(team.?lead|project.?manager|community.?manager)\b/gi,
          /\b(volunteer|charity|non.?profit|social.?impact)\b/gi
        ],
        Practical: [
          /\b(hands.?on|diy|maker|builder)\b/gi,
          /\b(engineer|architect|technician|specialist)\b/gi,
          /\b(prototype|manufacture|assembly|construction)\b/gi
        ]
      };
      
      Object.entries(advancedPatterns).forEach(([category, patterns]) => {
        patterns.forEach(pattern => {
          const matches = text.match(pattern);
          if (matches) {
            scores[category as keyof typeof scores] += matches.length * config.weight * 2;
          }
        });
      });
    });
    
    // Smart normalization to prevent category domination while preserving relative strengths
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    if (totalScore > 0) {
      const maxScore = Math.max(...Object.values(scores));
      const avgScore = totalScore / 4;
      
      // Normalize only if one category is extremely dominant
      if (maxScore > avgScore * 3) {
        Object.keys(scores).forEach(category => {
          const currentScore = scores[category as keyof typeof scores];
          // Gentle normalization that preserves ranking but reduces extreme differences
          scores[category as keyof typeof scores] = Math.sqrt(currentScore * avgScore);
        });
      }
    }
    
    return scores;
  };

  if (showResults) {
    // Enhanced scoring with Firebase weights + AI analysis
    const scores = { Tech: 0, Creative: 0, Social: 0, Practical: 0 };
    
    // Multiple choice scoring (70% weight)
    Object.entries(answers).forEach(([questionIndex, selectedOption]) => {
      const questionId = parseInt(questionIndex) + 1;
      const question = questions[parseInt(questionIndex)];
      if (question.type === 'multiple') {
        const option = question.options?.find(opt => opt.text === selectedOption);
        
        if (option) {
          // Get weight from Firebase or use default
          const weightData = questionWeights.find(w => w.question_id === questionId);
          const weight = (weightData?.weight || 1) * 0.7; // 70% weight for multiple choice
          scores[option.category as keyof typeof scores] += weight;
        }
      }
    });
    
    // Descriptive analysis scoring (30% weight)
    const descriptiveScores = analyzeDescriptiveAnswers();
    Object.keys(descriptiveScores).forEach(category => {
      scores[category as keyof typeof scores] += descriptiveScores[category as keyof typeof descriptiveScores] * 0.3; // 30% weight for descriptive
    });

    // Get top category
    const topCategory = Object.entries(scores).sort(([,a], [,b]) => b - a)[0][0];
    const topScore = scores[topCategory as keyof typeof scores];
    const matchPercentage = Math.round((topScore / 20) * 100);
    
    // Filter careers from Firebase data
    const categorycareers = careers.filter(career => career.category === topCategory).slice(0, 3);

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Your Career Matches</h1>
              <p className="text-lg text-muted-foreground">
                Top Category: {topCategory} ({topScore} out of 10 points)
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {categorycareers.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Loading career matches from Firebase...</p>
                  </div>
                </div>
              ) : (
                categorycareers.map((career, index) => {
                  const salaryRange = `₹${(career.min_salary / 100000).toFixed(0)}-${(career.max_salary / 100000).toFixed(0)} LPA`;
                  const skillsList = career.skills_required ? career.skills_required.split(',') : [];
                  
                  return (
                    <Card key={career.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-primary mb-2">{career.title}</h3>
                          <p className="text-muted-foreground mb-2">{career.description}</p>
                          <div className="flex gap-4 text-sm font-medium">
                            <span>💰 {salaryRange}</span>
                            {career.growth_rate && <span>📈 {career.growth_rate} Growth</span>}
                            {career.remote_work && <span>🏠 Remote Available</span>}
                          </div>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-gradient-hero text-white font-semibold">
                          {Math.max(matchPercentage - (index * 10), 60)}% Match
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {skillsList.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-muted text-sm">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleStartLearning(career)}>Start Learning</Button>
                        <Button variant="outline" onClick={() => handleViewDetails(career)}>View Details</Button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>

            <Card className="p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Learning Path for {topCategory}</h3>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  📊 Your Score: {topCategory} ({topScore.toFixed(1)} points) | 
                  🎯 Match: {matchPercentage}% | 
                  📈 {categorycareers.length} careers found
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Beginner</h4>
                  {topCategory === 'Tech' && (
                    <ul className="space-y-1 text-sm">
                      <li>• HTML/CSS Basics</li>
                      <li>• JavaScript Fundamentals</li>
                      <li>• Git Version Control</li>
                    </ul>
                  )}
                  {topCategory === 'Creative' && (
                    <ul className="space-y-1 text-sm">
                      <li>• Design Principles</li>
                      <li>• Color Theory</li>
                      <li>• Typography Basics</li>
                    </ul>
                  )}
                  {topCategory === 'Social' && (
                    <ul className="space-y-1 text-sm">
                      <li>• Communication Skills</li>
                      <li>• Active Listening</li>
                      <li>• Empathy Building</li>
                    </ul>
                  )}
                  {topCategory === 'Practical' && (
                    <ul className="space-y-1 text-sm">
                      <li>• Basic Tools Usage</li>
                      <li>• Safety Protocols</li>
                      <li>• Technical Drawing</li>
                    </ul>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-600 mb-2">Intermediate</h4>
                  {topCategory === 'Tech' && (
                    <ul className="space-y-1 text-sm">
                      <li>• React Framework</li>
                      <li>• Database Design</li>
                      <li>• API Development</li>
                    </ul>
                  )}
                  {topCategory === 'Creative' && (
                    <ul className="space-y-1 text-sm">
                      <li>• Adobe Creative Suite</li>
                      <li>• UI/UX Principles</li>
                      <li>• Brand Design</li>
                    </ul>
                  )}
                  {topCategory === 'Social' && (
                    <ul className="space-y-1 text-sm">
                      <li>• Counseling Techniques</li>
                      <li>• Group Dynamics</li>
                      <li>• Conflict Resolution</li>
                    </ul>
                  )}
                  {topCategory === 'Practical' && (
                    <ul className="space-y-1 text-sm">
                      <li>• Project Planning</li>
                      <li>• Quality Control</li>
                      <li>• Team Coordination</li>
                    </ul>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Advanced</h4>
                  {topCategory === 'Tech' && (
                    <ul className="space-y-1 text-sm">
                      <li>• System Design</li>
                      <li>• Cloud Architecture</li>
                      <li>• DevOps Practices</li>
                    </ul>
                  )}
                  {topCategory === 'Creative' && (
                    <ul className="space-y-1 text-sm">
                      <li>• Motion Graphics</li>
                      <li>• 3D Design</li>
                      <li>• Creative Direction</li>
                    </ul>
                  )}
                  {topCategory === 'Social' && (
                    <ul className="space-y-1 text-sm">
                      <li>• Leadership Development</li>
                      <li>• Organizational Psychology</li>
                      <li>• Change Management</li>
                    </ul>
                  )}
                  {topCategory === 'Practical' && (
                    <ul className="space-y-1 text-sm">
                      <li>• Advanced Engineering</li>
                      <li>• Innovation Management</li>
                      <li>• Sustainability Practices</li>
                    </ul>
                  )}
                </div>
              </div>
            </Card>

            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => navigate('/mentor-connect')}>Find Mentors</Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/skill-exchange')}>Explore Skill Exchange</Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => { 
                    setShowResults(false); 
                    setCurrentQuestion(0); 
                    setAnswers({}); 
                    setDescriptiveAnswers({});
                  }}
                >
                  Retake Assessment
                </Button>
              </div>
            </div>

            {/* Career Details Modal */}
            <Dialog open={showCareerDetails} onOpenChange={setShowCareerDetails}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary">
                    {selectedCareer?.title}
                  </DialogTitle>
                </DialogHeader>
                
                {selectedCareer && (
                  <div className="space-y-6">
                    {/* Career Overview */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Career Overview</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Description:</strong> {selectedCareer.description}</p>
                        <p><strong>Salary Range:</strong> ₹{(selectedCareer.min_salary / 100000).toFixed(0)}-{(selectedCareer.max_salary / 100000).toFixed(0)} LPA</p>
                        <p><strong>Growth Rate:</strong> {selectedCareer.growth_rate}</p>
                        <p><strong>Remote Work:</strong> {selectedCareer.remote_work ? 'Available' : 'Not Available'}</p>
                        <p><strong>Category:</strong> {selectedCareer.category}</p>
                      </div>
                    </div>

                    {/* Required Skills */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Top Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.skills_required?.split(',').map((skill: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Learning Path */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Recommended Learning Path</h3>
                      <div className="space-y-2">
                        {getLearningPath(selectedCareer.category).map((step, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                            <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button onClick={() => handleStartLearning(selectedCareer)} className="flex-1">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Start Learning
                      </Button>
                      <Button variant="outline" onClick={() => setShowCareerDetails(false)}>
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading CareerLens</h2>
          <p className="text-muted-foreground">Fetching data from Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Discover Your Path
            </h1>
            <p className="text-lg text-muted-foreground">
              Answer 10 questions to find careers that match your strengths and interests
            </p>
            <div className="mt-4 text-sm text-green-600">
              ✅ Connected to Firebase • {careers.length} careers loaded
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="p-8 shadow-card">
            <div className="mb-4 text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length} • Type: {questions[currentQuestion]?.type || 'unknown'}
            </div>
            <h2 className="text-2xl font-semibold mb-6">
              {questions[currentQuestion]?.question || 'Loading question...'}
            </h2>
            {questions[currentQuestion]?.type === 'multiple' ? (
              <RadioGroup
                value={answers[currentQuestion] || ""}
                onValueChange={handleAnswer}
                className="space-y-4"
              >
                {questions[currentQuestion]?.options?.map((option, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-gradient-card transition-all cursor-pointer"
                  >
                    <RadioGroupItem value={option.text} id={`option-${index}`} />
                    <Label
                      htmlFor={`option-${index}`}
                      className="flex-1 cursor-pointer text-base"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div>
                <Textarea
                  placeholder={questions[currentQuestion]?.placeholder || 'Please provide your answer...'}
                  value={descriptiveAnswers[currentQuestion] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  rows={6}
                  className="text-base"
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  {(descriptiveAnswers[currentQuestion] || '').length} characters
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                Previous
              </Button>
              <Button onClick={handleNext} className="flex-1 gap-2">
                {currentQuestion === questions.length - 1 ? (
                  <>
                    View Results
                    <TrendingUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareerLens;