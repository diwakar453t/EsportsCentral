import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeaderboardTable, Player } from "@/components/ui/leaderboard-table";
import { 
  Search, 
  Medal, 
  Trophy, 
  Filter,
  User,
  Globe,
  Star
} from "lucide-react";

export default function LeaderboardPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [gameFilter, setGameFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  
  // Fetch leaderboard data
  const { data: players = [], isLoading } = useQuery<Player[]>({
    queryKey: ["/api/leaderboard", { game: gameFilter, region: regionFilter }],
  });
  
  // Fetch available games
  const { data: games = [] } = useQuery<{ id: string, name: string }[]>({
    queryKey: ["/api/games/list"],
  });
  
  // Fetch available regions
  const { data: regions = [] } = useQuery<{ id: string, name: string }[]>({
    queryKey: ["/api/regions"],
  });
  
  // Filter players based on search query
  const filteredPlayers = searchQuery 
    ? players.filter(player => 
        player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.country.toLowerCase().includes(searchQuery.toLowerCase()))
    : players;
  
  // Handle player profile click
  const handlePlayerClick = (id: number) => {
    setLocation(`/players/${id}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <h1 className="font-rajdhani font-bold text-4xl mb-2">
          GLOBAL <span className="gradient-text">LEADERBOARD</span>
        </h1>
        <p className="text-gray-400">View top ranked players across all games and regions</p>
      </div>
      
      {/* Top Players Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {filteredPlayers.slice(0, 3).map((player, index) => (
          <Card 
            key={player.id} 
            className={`bg-dark border-${index === 0 ? 'neon-purple' : index === 1 ? 'neon-pink' : 'neon-blue'} glow-border card-hover cursor-pointer`}
            onClick={() => handlePlayerClick(player.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`rounded-full flex items-center justify-center w-14 h-14 bg-${index === 0 ? 'neon-purple' : index === 1 ? 'neon-pink' : 'neon-blue'} bg-opacity-10 mr-4`}>
                    <Medal className={`h-8 w-8 text-${index === 0 ? 'neon-purple' : index === 1 ? 'neon-pink' : 'neon-blue'}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Rank</p>
                    <p className="font-rajdhani font-bold text-2xl">
                      # {player.rank}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-400">Points</div>
                  <div className="font-orbitron text-neon-blue font-medium">{player.points.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="relative mr-3">
                  <img 
                    src={player.avatar} 
                    alt={player.username} 
                    className="h-16 w-16 rounded-full border-2 border-dark"
                  />
                  <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full ${player.isOnline ? 'bg-success' : 'bg-gray-500'} border-2 border-dark`}></div>
                </div>
                <div>
                  <h3 className="font-rajdhani font-bold text-xl">{player.username}</h3>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Globe className="h-3 w-3 mr-1" /> {player.country}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 px-2 py-1 bg-darker rounded-lg">
                <div className="flex items-center">
                  <img src={player.gameIcon} alt={player.game} className="w-5 h-5 mr-1 rounded" />
                  <span className="text-sm">{player.game}</span>
                </div>
                <div className="text-xs">
                  <span className="text-success">{player.winRate}%</span> win rate
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-64 relative">
          <Input
            type="text"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-dark border-gray-800 pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={gameFilter} onValueChange={setGameFilter}>
            <SelectTrigger className="bg-dark border-gray-800">
              <SelectValue placeholder="Filter by game" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Games</SelectItem>
              {games.map((game) => (
                <SelectItem key={game.id} value={game.id}>{game.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-64">
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="bg-dark border-gray-800">
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" className="md:ml-auto bg-dark border-gray-800 text-gray-300">
          <Filter className="mr-2 h-4 w-4" /> More Filters
        </Button>
      </div>
      
      {/* Main Leaderboard */}
      <Card className="bg-dark border-gray-800">
        <CardHeader className="border-b border-gray-800">
          <div className="flex justify-between items-center">
            <CardTitle className="font-rajdhani text-xl">
              <Trophy className="inline-block mr-2 h-5 w-5 text-neon-purple" /> 
              Player Rankings
            </CardTitle>
            <Tabs defaultValue="overall" className="w-auto">
              <TabsList className="bg-sidebar-background">
                <TabsTrigger value="overall" className="text-xs">
                  <Star className="h-3 w-3 mr-1" /> Overall
                </TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-neon-purple border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading leaderboard data...</p>
            </div>
          ) : filteredPlayers.length > 0 ? (
            <LeaderboardTable players={filteredPlayers} onPlayerClick={handlePlayerClick} />
          ) : (
            <div className="p-8 text-center">
              <User className="h-10 w-10 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-rajdhani font-bold mb-2">No players found</h3>
              <p className="text-gray-400">
                {searchQuery ? `No players match "${searchQuery}"` : "There are no players in this category."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
