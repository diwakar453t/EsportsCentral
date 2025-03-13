import { useQuery } from "@tanstack/react-query";
import { Tournament } from "@shared/schema";
import TournamentCard from "@/components/home/tournament-card";
import TournamentFilter from "@/components/tournaments/tournament-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const TournamentsPage = () => {
  // Get the current location to access query parameters
  const [pathname] = useLocation();
  // Parse query parameters from the URL
  const queryParams = new URLSearchParams(window.location.search);
  const initialGameId = queryParams.get("gameId") ? parseInt(queryParams.get("gameId") as string) : undefined;
  
  const [selectedGameId, setSelectedGameId] = useState<number | undefined>(initialGameId);
  const { toast } = useToast();
  const { user } = useAuth();

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: tournaments, isLoading, error } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments", selectedGameId],
    queryFn: async ({ queryKey }) => {
      const [_, gameId] = queryKey;
      const url = gameId 
        ? `/api/tournaments?gameId=${gameId}` 
        : "/api/tournaments";
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch tournaments");
      return res.json();
    },
  });

  const handleFilterChange = (gameId?: number) => {
    setSelectedGameId(gameId);
  };

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
    <div className="min-h-screen pt-24 md:pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-orbitron">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Tournaments
            </span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Register for upcoming tournaments across various game titles and compete for glory and prizes.
          </p>
        </div>
        
        <TournamentFilter onFilterChange={handleFilterChange} activeGameId={selectedGameId} />
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load tournaments. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments && tournaments.length > 0 ? (
              tournaments.map(tournament => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  onRegister={handleRegister}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-medium text-gray-400 mb-2">No Tournaments Found</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  {selectedGameId ? 
                    "There are no tournaments available for this game at the moment. Please check back later or select another game." : 
                    "There are no tournaments available at the moment. Please check back later."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentsPage;
