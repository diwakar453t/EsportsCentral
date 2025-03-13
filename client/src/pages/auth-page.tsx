import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Gamepad, 
  User, 
  Lock, 
  Trophy, 
  LogIn, 
  UserPlus,
  AlertCircle
} from "lucide-react";
import { insertUserSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { FaDiscord, FaGoogle, FaSteam } from "react-icons/fa";

// Add extra validation rules
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Add extra validation for registration
const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [authTab, setAuthTab] = useState("login");
  const [location, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  // Login form
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Submit login form
  const onLoginSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };
  
  // Submit register form
  const onRegisterSubmit = (data: RegisterInput) => {
    // Remove confirmPassword as it's not in the expected server schema
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Auth Form */}
        <div className="flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-3">
            <Gamepad className="h-8 w-8 text-neon-purple" />
            <h1 className="font-orbitron font-bold text-3xl">Nexus<span className="text-neon-purple">Arena</span></h1>
          </div>
          
          <Card className="bg-dark border-gray-800">
            <CardHeader>
              <Tabs defaultValue="login" value={authTab} onValueChange={setAuthTab}>
                <TabsList className="grid w-full grid-cols-2 bg-sidebar-background">
                  <TabsTrigger value="login" className="font-rajdhani font-semibold">
                    <LogIn className="h-4 w-4 mr-2" /> Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="font-rajdhani font-semibold">
                    <UserPlus className="h-4 w-4 mr-2" /> Register
                  </TabsTrigger>
                </TabsList>
                <div className="mt-4">
                  <TabsContent value="login">
                    <CardTitle className="text-2xl font-rajdhani">Welcome back</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                  </TabsContent>
                  <TabsContent value="register">
                    <CardTitle className="text-2xl font-rajdhani">Create an account</CardTitle>
                    <CardDescription>Join the ultimate esports tournament platform</CardDescription>
                  </TabsContent>
                </div>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter your username"
                                className="pl-10"
                                {...field}
                              />
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="password"
                                placeholder="Enter your password"
                                className="pl-10"
                                {...field}
                              />
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-neon-purple hover:bg-opacity-90 font-semibold"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Logging in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Choose a username"
                                className="pl-10"
                                {...field}
                              />
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="password"
                                placeholder="Create a password"
                                className="pl-10"
                                {...field}
                              />
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="password"
                                placeholder="Confirm your password"
                                className="pl-10"
                                {...field}
                              />
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-neon-purple hover:bg-opacity-90 font-semibold"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <div className="mt-6 space-y-4">
                <div className="relative flex items-center">
                  <Separator className="flex-grow" />
                  <span className="mx-2 text-xs text-gray-400 bg-dark px-2">OR CONTINUE WITH</span>
                  <Separator className="flex-grow" />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-900">
                    <FaGoogle className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-900">
                    <FaDiscord className="mr-2 h-4 w-4" />
                    Discord
                  </Button>
                  <Button variant="outline" className="border-gray-700 hover:bg-gray-900">
                    <FaSteam className="mr-2 h-4 w-4" />
                    Steam
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Hero Section */}
        <div className="hidden lg:flex flex-col justify-center">
          <div className="bg-dark rounded-xl p-8 border border-neon-blue/30 glow-border">
            <div className="flex items-center bg-neon-purple/10 p-3 rounded-lg mb-8">
              <Trophy className="h-10 w-10 text-neon-purple mr-4" />
              <div>
                <h3 className="font-rajdhani font-bold text-xl">Compete at the highest level</h3>
                <p className="text-gray-400 text-sm">Join professional tournaments and win real prizes</p>
              </div>
            </div>
            
            <h2 className="font-rajdhani font-bold text-3xl md:text-4xl mb-4">
              Your Journey to <span className="gradient-text">Esports Glory</span> Starts Here
            </h2>
            
            <p className="text-gray-300 mb-6">
              NexusArena is the ultimate platform for competitive gamers. Create your profile, join tournaments across multiple game titles, and track your performance on global leaderboards.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start">
                <div className="bg-neon-blue/10 rounded-lg p-2 mr-3">
                  <Trophy className="h-5 w-5 text-neon-blue" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Professional Tournaments</h4>
                  <p className="text-sm text-gray-400">Compete in events with cash prizes and recognition</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-neon-purple/10 rounded-lg p-2 mr-3">
                  <Gamepad className="h-5 w-5 text-neon-purple" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Multiple Game Titles</h4>
                  <p className="text-sm text-gray-400">Valorant, CS:GO, Fortnite, League of Legends & more</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-neon-pink/10 rounded-lg p-2 mr-3">
                  <User className="h-5 w-5 text-neon-pink" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Player Profiles</h4>
                  <p className="text-sm text-gray-400">Show off your achievements and stats</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-success/10 rounded-lg p-2 mr-3">
                  <AlertCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">24/7 Support</h4>
                  <p className="text-sm text-gray-400">Get help whenever you need it</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center bg-darker rounded-lg p-4">
              <div className="flex -space-x-3 mr-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="h-8 w-8 rounded-full border-2 border-dark" />
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="h-8 w-8 rounded-full border-2 border-dark" />
                <img src="https://randomuser.me/api/portraits/men/67.jpg" alt="User" className="h-8 w-8 rounded-full border-2 border-dark" />
              </div>
              <div className="text-sm">
                <span className="font-medium">50,000+ gamers</span>
                <span className="text-gray-400"> have already joined our platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
