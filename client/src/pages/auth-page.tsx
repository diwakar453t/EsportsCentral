import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/forms/login-form";
import RegisterForm from "@/components/forms/register-form";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";

const AuthPage = () => {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Hero Section */}
          <div className="order-2 lg:order-1">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold font-orbitron mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Join the Ultimate Gaming Community
                </span>
              </h1>
              <p className="text-gray-400 mb-6">
                Create your account to participate in tournaments, track your progress, and compete with gamers from around the world. Rise through the ranks and become a legend.
              </p>
              <div className="space-y-4 neon-border p-6 rounded-xl bg-dark/50 backdrop-blur-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/20 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white font-rajdhani">Access Exclusive Tournaments</h3>
                    <p className="mt-1 text-sm text-gray-400">Compete in tournaments across various games and skill levels.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/20 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white font-rajdhani">Create Your Gaming Profile</h3>
                    <p className="mt-1 text-sm text-gray-400">Build your reputation and track your tournament history.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/20 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white font-rajdhani">Connect with Gamers</h3>
                    <p className="mt-1 text-sm text-gray-400">Join a community of passionate players from around the world.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Auth Form */}
          <div className="order-1 lg:order-2">
            <Card className="neon-border w-full max-w-md mx-auto overflow-hidden">
              <CardContent className="p-0">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid grid-cols-2 w-full rounded-none">
                    <TabsTrigger value="login" className="font-rajdhani">LOGIN</TabsTrigger>
                    <TabsTrigger value="register" className="font-rajdhani">REGISTER</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="pt-6 px-6 pb-8">
                    <LoginForm />
                  </TabsContent>
                  
                  <TabsContent value="register" className="pt-6 px-6 pb-8">
                    <RegisterForm />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
