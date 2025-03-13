import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { TOP_PLAYERS } from "@/lib/constants";

const LeaderboardWidget = () => {
  const [leaderboard, setLeaderboard] = useState(TOP_PLAYERS);

  const { data } = useQuery({
    queryKey: ["/api/leaderboard"],
    staleTime: 60000, // 1 minute
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setLeaderboard(data.slice(0, 3).map(entry => ({
        id: entry.userId,
        username: entry.user.username,
        avatar: entry.user.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        country: entry.user.country || "USA",
        points: entry.points,
        change: Math.floor(Math.random() * 400) - 100 // Random change for demo
      })));
    }
  }, [data]);

  return (
    <Card className="neon-border rounded-xl p-4 bg-dark/80 backdrop-blur-sm animate-float">
      <CardHeader className="p-0 mb-4 space-y-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold font-rajdhani text-white">TOP PLAYERS</CardTitle>
          <a href="#" className="text-xs text-primary hover:text-secondary">View All</a>
        </div>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        {leaderboard.map((player, index) => (
          <div className="flex items-center" key={player.id}>
            <div className="font-orbitron text-lg font-bold w-6 text-center mr-2 text-secondary">
              #{index + 1}
            </div>
            <img 
              src={player.avatar} 
              alt={`${player.username} Avatar`} 
              className="h-8 w-8 rounded-full object-cover border-2 border-primary" 
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center">
                <span className="font-medium text-white">{player.username}</span>
                <span className="ml-2 text-xs text-gray-400">{player.country}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-orbitron text-sm text-white">{player.points.toLocaleString()}</span>
              <div className={`text-xs ${player.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {player.change >= 0 ? '+' : ''}{player.change}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
