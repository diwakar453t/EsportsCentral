import { useQuery } from "@tanstack/react-query";
import GameCard from "./game-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Game } from "@shared/schema";
import { GAMES } from "@/lib/constants";

const FeaturedGames = () => {
  const { data: games, isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
    staleTime: 60000 // 1 minute
  });

  // Use placeholder data if loading
  const displayGames = games || GAMES;

  return (
    <section className="bg-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-orbitron">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Featured Games</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Compete in your favorite titles and rise through the ranks of the most popular esports games.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/games">
            <Button variant="outline" className="px-6 py-3 border-primary hover:bg-primary/20">
              View All Games <span className="ml-2">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGames;
