import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";
import GameCard from "@/components/home/game-card";
import { Skeleton } from "@/components/ui/skeleton";
import { GAMES } from "@/lib/constants";
import { useEffect } from "react";

const GamesPage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
    staleTime: 60000 // 1 minute
  });

  // Use placeholder data if loading
  const displayGames = games || GAMES;

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-orbitron">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Game Library
            </span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Browse our collection of supported games and find tournaments for your favorite titles.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-surface">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
        
        {!isLoading && displayGames.length === 0 && (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13.5h.01M10.5 16.5h3" />
            </svg>
            <h2 className="text-xl font-medium text-gray-400 mb-2">No Games Found</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              We're currently updating our game library. Please check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
