import { useQuery } from "@tanstack/react-query";
import { Tournament } from "@shared/schema";
import TournamentCard from "@/components/home/tournament-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const UpcomingTournaments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: tournaments, isLoading } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
    staleTime: 60000 // 1 minute
  });

  // Filter for upcoming tournaments and limit to 3
  const upcomingTournaments = tournaments
    ?.filter(tournament => new Date(tournament.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 3);

  const handleRegister = async (tournamentId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login or register to join tournaments",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", `/api/tournaments/${tournamentId}/register`);
      toast({
        title: "Registration Successful",
        description: "You've successfully registered for the tournament",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "Failed to register for tournament",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="tournaments" className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-secondary text-lg font-medium font-rajdhani mb-2">COMPETITION AWAITS</span>
          <h2 className="text-3xl md:text-4xl font-bold font-orbitron">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Upcoming Tournaments</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Register for upcoming tournaments across various game titles and compete for glory and prizes.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-dark">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : upcomingTournaments && upcomingTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingTournaments.map(tournament => (
              <TournamentCard 
                key={tournament.id} 
                tournament={tournament} 
                onRegister={handleRegister}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-400 mb-2">No Upcoming Tournaments</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              We're preparing new tournaments. Please check back soon!
            </p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/tournaments">
            <Button variant="outline" className="px-6 py-3 border-primary hover:bg-primary/20">
              View All Tournaments <span className="ml-2">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingTournaments;
