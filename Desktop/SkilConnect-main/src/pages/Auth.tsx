import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, Eye, EyeOff, Sparkles, Check, X, Loader2 } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    const rules = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[@#$%!*?&]/.test(pwd),
      notCommon: !['password123', 'admin', '12345678', 'password', '123456789', 'qwerty', 'abc123'].includes(pwd.toLowerCase()),
      notName: !fullName || !pwd.toLowerCase().includes(fullName.toLowerCase().split(' ')[0]) || fullName.length < 2,
      notEmail: !email || !pwd.toLowerCase().includes(email.split('@')[0].toLowerCase()) || email.length < 2,
      notRepeated: !/(..).*\1/.test(pwd) && !/^(.)\\1+$/.test(pwd)
    };
    
    const score = Object.values(rules).filter(Boolean).length;
    let strength = 'Weak';
    if (score >= 8) strength = 'Strong';
    else if (score >= 6) strength = 'Medium';
    
    return { rules, strength, score };
  };

  const passwordValidation = validatePassword(password);

  // Create user document in Firestore
  const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const { displayName, email } = user;
      const createdAt = new Date().toISOString();
      
      try {
        await setDoc(userRef, {
          uid: user.uid,
          displayName: displayName || additionalData.fullName,
          email,
          createdAt,
          lastActive: createdAt,
          skills: [],
          interests: [],
          location: '',
          bio: '',
          verified: false,
          profilePicture: '',
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user document:', error);
      }
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordValidation.strength === 'Weak') {
      toast({
        title: "Weak Password",
        description: "Please create a stronger password",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(user, { fullName });
      
      toast({
        title: "Account Created!",
        description: "Welcome to SkillConnect",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { user } = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
      await createUserDocument(user); // Create document if doesn't exist
      
      // Update last active
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { lastActive: new Date().toISOString() }, { merge: true });
      
      toast({
        title: "Welcome Back!",
        description: "Successfully signed in",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-white">
      {/* Left Panel */}
      <div className={`${isSignUp ? 'w-1/2 bg-teal-500' : 'w-1/2 bg-white'} transition-all duration-700 ease-in-out relative flex flex-col justify-center items-center p-12`}>
        {/* SkillConnect Logo - Always at top-left */}
        <div className="absolute top-6 left-6 flex items-center z-20 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center mr-3 shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className={`text-xl font-bold ${isSignUp ? 'text-white' : 'text-teal-600'}`}>SkillConnect</span>
        </div>
        {isSignUp ? (
          // Welcome Back Panel (Sign Up Mode)
          <div className="text-center text-white">
            
            <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
            <p className="text-lg mb-12 leading-relaxed max-w-sm mx-auto">
              To keep connected with us please login with your personal info
            </p>
            <Button 
              onClick={() => setIsSignUp(false)}
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-500 px-12 py-3 rounded-full font-semibold text-lg"
            >
              SIGN IN
            </Button>
          </div>
        ) : (
          // Sign In Panel
          <div className="w-full max-w-md">
            
            <h2 className="text-4xl font-bold text-teal-600 mb-8 text-center">Sign in to SkillConnect</h2>
            
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  type="email" 
                  placeholder="Email" 
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  className="pl-12 py-4 bg-gray-50 border-none rounded-lg text-lg"
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  className="pl-12 py-4 bg-gray-50 border-none rounded-lg text-lg"
                  required
                />
              </div>
            </div>
            
            <p className="text-center text-gray-500 mb-8 cursor-pointer hover:text-teal-600">Forgot your password?</p>
            
            <Button 
              onClick={handleSignIn}
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-full font-semibold text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              SIGN IN
            </Button>
          </div>
        )}
      </div>
      
      {/* Right Panel */}
      <div className={`${isSignUp ? 'w-1/2 bg-white' : 'w-1/2 bg-teal-500'} transition-all duration-700 ease-in-out relative flex flex-col justify-center items-center p-12`}>
        {isSignUp ? (
          // Create Account Panel (Sign Up Mode)
          <div className="w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-4xl font-bold text-teal-600 mb-6 text-center">Create Account</h2>
            
            {/* Basic Info */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-12 py-3 bg-gray-50 border-none rounded-lg"
                  required
                />
              </div>
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 py-3 bg-gray-50 border-none rounded-lg"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Create a password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 py-3 bg-gray-50 border-none rounded-lg"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Re-enter your password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 pr-12 py-3 bg-gray-50 border-none rounded-lg"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-600 text-xs flex items-center space-x-1">
                    <X className="w-3 h-3" />
                    <span>Passwords do not match</span>
                  </p>
                )}
                {confirmPassword && password === confirmPassword && (
                  <p className="text-green-600 text-xs flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Passwords match</span>
                  </p>
                )}
              </div>
            </div>
            

            
            <Button 
              onClick={handleSignUp}
              disabled={loading || !fullName || !email || !password || password !== confirmPassword}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-full font-semibold text-lg mb-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              SIGN UP
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              Already have an account? <button onClick={() => setIsSignUp(false)} className="text-teal-600 hover:underline">Log In</button>
            </p>
          </div>
        ) : (
          // Hello Friend Panel (Sign In Mode)
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">Hello, Friend!</h1>
            <p className="text-lg mb-12 leading-relaxed max-w-sm mx-auto">
              Enter your personal details and start journey with us
            </p>
            <Button 
              onClick={() => setIsSignUp(true)}
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-500 px-12 py-3 rounded-full font-semibold text-lg"
            >
              SIGN UP
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;