import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { User as UserIcon, Trophy, Medal } from "lucide-react";

const UserProfile = () => {
  const { user } = useAuth();
  
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: [`/api/users/${user?.id}/leaderboard`],
    enabled: !!user,
  });

  // Create initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const formatRank = (rank: number) => {
    if (rank === 1) return "1st";
    if (rank === 2) return "2nd";
    if (rank === 3) return "3rd";
    return `${rank}th`;
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="neon-border">
      <CardHeader className="pb-4">
        <CardTitle className="font-rajdhani">Player Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.username} />
            ) : (
              <AvatarFallback className="text-2xl bg-primary/20">
                <UserIcon className="h-12 w-12 text-primary" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold font-orbitron mb-1">{user.username}</h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
              {user.country && (
                <Badge variant="outline" className="font-rajdhani">
                  {user.country}
                </Badge>
              )}
              {user.skillLevel && (
                <Badge variant="secondary" className="font-rajdhani">
                  {user.skillLevel}
                </Badge>
              )}
            </div>
            {user.bio && <p className="text-sm text-gray-400 mb-3">{user.bio}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-surface border-gray-800">
            <CardContent className="p-4 flex items-center gap-3">
              <Trophy className="h-10 w-10 text-yellow-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-400">Global Rank</h3>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-xl font-bold text-white">
                    {leaderboardData ? formatRank(leaderboardData.rank) : "Unranked"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-surface border-gray-800">
            <CardContent className="p-4 flex items-center gap-3">
              <Medal className="h-10 w-10 text-secondary" />
              <div>
                <h3 className="text-sm font-medium text-gray-400">Total Points</h3>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-xl font-bold text-white">
                    {leaderboardData ? leaderboardData.points.toLocaleString() : "0"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-surface border-gray-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-500/20">
                <span className="text-green-500 font-bold text-lg">
                  {isLoading ? "?" : (leaderboardData ? leaderboardData.wins : "0")}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400">Win/Loss</h3>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-xl font-bold text-white">
                    {leaderboardData ? 
                      `${leaderboardData.wins} / ${leaderboardData.losses}` : 
                      "0 / 0"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
