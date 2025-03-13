import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import MultiStepForm from "@/components/forms/multi-step-form";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

const RegisterPage = () => {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-secondary text-lg font-medium font-rajdhani mb-2">JOIN THE ARENA</span>
          <h1 className="text-3xl md:text-4xl font-bold font-orbitron">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Register Now</span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Create your gamer profile and start competing in tournaments right away.
          </p>
        </div>
        
        <Card className="bg-surface/80 backdrop-blur-sm rounded-xl neon-border">
          <CardContent className="p-6">
            <MultiStepForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
