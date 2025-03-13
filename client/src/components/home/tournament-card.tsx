import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Users, Trophy, Ticket } from "lucide-react";
import { Tournament } from "@shared/schema";
import { useState } from "react";
import { TournamentPaymentDialog } from "@/components/tournament-payment-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface TournamentCardProps {
  tournament: Tournament;
  onRegister?: (id: number) => void;
}

const TournamentCard = ({ tournament, onRegister }: TournamentCardProps) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [_, setLocation] = useLocation();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeLeft = (startDate: Date) => {
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = Math.abs(start.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Starts today";
    if (diffDays === 1) return "Starts tomorrow";
    if (diffDays < 7) return `Starts in ${diffDays} days`;
    if (diffDays < 30) return `Starts in ${Math.floor(diffDays / 7)} weeks`;
    return `Starts on ${formatDate(startDate)}`;
  };

  const handleRegister = async () => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: tournament.entryFee,
          tournamentId: tournament.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setIsPaymentDialogOpen(true);
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Error",
        description: "Failed to start registration process. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSuccess = () => {
    if (onRegister) {
      onRegister(tournament.id);
    }
    toast({
      title: "Success",
      description: "Successfully registered for the tournament!",
    });
    setIsPaymentDialogOpen(false);
  };

  return (
    <Card className="neon-border rounded-xl overflow-hidden bg-dark h-full">
      <div className="h-48 relative">
        <img 
          src={`${tournament.image}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80`} 
          alt={tournament.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-dark to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="bg-primary/80 text-white text-xs font-medium px-2.5 py-1 rounded">
                {tournament.name.split(' ')[0]} {/* Using first word of tournament name as game name */}
              </span>
            </div>
            <div className="text-right">
              <span className="bg-dark/80 text-white text-xs font-medium px-2.5 py-1 rounded">
                <Calendar className="h-3 w-3 inline mr-1" /> {formatDate(tournament.startDate)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-xl font-rajdhani text-white mb-2">{tournament.name}</h3>
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <Users className="h-4 w-4 mr-2" /> {tournament.playerLimit} Teams
          <Trophy className="h-4 w-4 ml-4 mr-2 text-yellow-400" /> ${tournament.prizePool?.toLocaleString() ?? 0} Prize Pool
          <Ticket className="h-4 w-4 ml-4 mr-2" /> ${(tournament.entryFee / 100).toFixed(2)} Entry
        </div>
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-secondary text-sm font-medium">
              <Calendar className="h-4 w-4 inline mr-1" /> {getTimeLeft(tournament.startDate)}
            </span>
          </div>
          <Link href={`/tournaments/${tournament.id}`}>
            <Button 
              onClick={handleRegister}
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded text-sm font-medium transition-colors"
            >
              Register
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentCard;
