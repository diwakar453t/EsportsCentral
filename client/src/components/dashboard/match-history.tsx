import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Users, Trophy } from "lucide-react";
import { Match } from "@shared/schema";

const MatchHistory = () => {
  const { user } = useAuth();
  
  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
    enabled: !!user,
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="neon-border mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="font-rajdhani">Match History</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-surface border-gray-800">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="mt-3 flex justify-between">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : matches && matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map(match => {
              const isWinner = match.winnerId === user.id;
              const tournamentName = match.tournament ? match.tournament.name : "Tournament";
              const opponent = match.player1Id === user.id ? "Player 2" : "Player 1";
              
              return (
                <Card key={match.id} className={`bg-surface border-gray-800 ${isWinner ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-white">{tournamentName}</h3>
                      <span className={`text-sm font-semibold ${isWinner ? 'text-green-500' : 'text-red-500'}`}>
                        {isWinner ? 'Victory' : 'Defeat'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" /> 
                      {match.matchDate ? formatDate(match.matchDate) : 'Date not set'}
                      <span className="mx-2">•</span>
                      <Users className="h-4 w-4 mr-1" /> 
                      vs {opponent}
                      {match.score && (
                        <>
                          <span className="mx-2">•</span>
                          <Trophy className="h-4 w-4 mr-1" /> 
                          {match.score}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="h-16 w-16 mx-auto text-gray-600 mb-3" />
            <h3 className="text-gray-400 font-medium text-lg">No matches yet</h3>
            <p className="text-gray-500 text-sm mt-1">
              Join a tournament to start building your match history
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchHistory;
