import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Search, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { loginUser, registerUser, createUserProfile, getUserProfile } from "@/lib/firebase";
import { validatePassword } from "@/lib/validation";
import Spline from '@splinetool/react-spline';

const Auth = () => {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.email || !formData.password) {
        alert('Please enter email and password');
        return;
      }

      if (isLogin) {
        // Login
        const userCredential = await loginUser(formData.email, formData.password);
        const user = userCredential.user;
        
        const userProfile = await getUserProfile(user.uid);
        
        const userData = { 
          id: parseInt(user.uid.slice(-6), 16), 
          name: userProfile?.fullName || user.displayName || formData.email.split('@')[0], 
          email: user.email, 
          role: userProfile?.role || 'student' 
        };
        
        setAuthenticatedUser(userData);
        
        if (userProfile?.role === 'owner') {
          // Check if owner has registered any PG
          const { collection, query, where, getDocs } = await import('firebase/firestore');
          const { db } = await import('@/config/firebase');
          
          const pgsQuery = query(
            collection(db, 'pgs'),
            where('ownerId', '==', user.uid)
          );
          const pgsSnapshot = await getDocs(pgsQuery);
          
          if (pgsSnapshot.empty) {
            navigate('/owner/register-pg');
          } else {
            navigate('/owner-dashboard');
          }
        } else {
          navigate('/student-dashboard');
        }
      } else {
        // Register
        if (!formData.fullName) {
          alert('Please enter your full name');
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        
        const passwordValidation = validatePassword(
          formData.password, 
          formData.fullName, 
          formData.email, 
          formData.username
        );
        
        if (!passwordValidation.isValid) {
          alert('Password requirements:\n' + passwordValidation.errors.join('\n'));
          return;
        }
        
        const userCredential = await registerUser(formData.email, formData.password);
        const user = userCredential.user;
        
        await createUserProfile(user, {
          fullName: formData.fullName,
          username: formData.username,
          phone: formData.phone,
          role: userType
        });
        
        const userData = { 
          id: parseInt(user.uid.slice(-6), 16), 
          name: formData.fullName, 
          email: user.email, 
          role: userType 
        };
        
        setAuthenticatedUser(userData);
        alert('Welcome to PGConnect!');
        
        setTimeout(() => {
          if (userType === 'owner') {
            navigate('/owner/register-pg');
          } else {
            navigate('/student-dashboard');
          }
        }, 100);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = 'Authentication failed';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please check your credentials.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email address.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'An account with this email already exists.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Password should be at least 6 characters long.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many failed attempts. Please try again later.';
            break;
          default:
            errorMessage = error.message || 'Authentication failed';
        }
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Back to Home */}
      <div className="absolute top-4 left-4 z-10">
        <Link to="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold text-primary text-lg">PGConnect</span>
          </Button>
        </Link>
      </div>
      
      <div className="flex min-h-screen">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">

            {/* Login/Register Tabs */}
            <div className="flex mb-6">
              <Button 
                variant={isLogin ? "default" : "ghost"} 
                onClick={() => setIsLogin(true)} 
                className="flex-1 rounded-r-none"
              >
                Login
              </Button>
              <Button 
                variant={!isLogin ? "default" : "ghost"} 
                onClick={() => setIsLogin(false)} 
                className="flex-1 rounded-l-none"
              >
                Register
              </Button>
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-2">{isLogin ? 'Welcome Back' : 'Welcome to PGConnect'}</h2>
              <p className="text-muted-foreground mb-6">{isLogin ? 'Enter your credentials to log in to your account' : 'Create your account to get started'}</p>

              <div className="space-y-4">
                {!isLogin && (
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>

                {!isLogin && (
                  <div>
                    <Label>Username</Label>
                    <Input
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                    />
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="Your contact number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>

                {!isLogin && (
                  <div>
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    />
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <Label className="mb-3 block">I want to:</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="student"
                          name="userType"
                          checked={userType === "student"}
                          onChange={() => setUserType("student")}
                          className="text-primary"
                        />
                        <Label htmlFor="student" className="cursor-pointer">Find PG as a Student</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="owner"
                          name="userType"
                          checked={userType === "owner"}
                          onChange={() => setUserType("owner")}
                          className="text-primary"
                        />
                        <Label htmlFor="owner" className="cursor-pointer">List my PG as an Owner</Label>
                      </div>
                    </div>
                  </div>
                )}

                <Button onClick={handleSubmit} className="w-full" size="lg">
                  {isLogin ? 'Login' : 'Create Account'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account yet? " : "Already have an account? "}
                  <button 
                    onClick={() => setIsLogin(!isLogin)} 
                    className="text-primary hover:underline"
                  >
                    {isLogin ? 'Create an account' : 'Login'}
                  </button>
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Side - Spline 3D Scene */}
        <div className="flex-1 bg-gradient-to-br from-primary via-primary/90 to-purple-600">
          <Spline scene="https://prod.spline.design/rU2-Ks0SC0T5od9B/scene.splinecode" />
        </div>
      </div>
    </div>
  );
};

export default Auth;