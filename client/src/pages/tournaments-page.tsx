import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TournamentCard, TournamentCardProps } from "@/components/ui/tournament-card";
import { 
  Search, 
  Trophy, 
  Filter,
  Flame,
  Clock,
  CheckCircle,
  ArrowDown
} from "lucide-react";

export default function TournamentsPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch all tournaments
  const { data: allTournaments = [], isLoading } = useQuery<TournamentCardProps[]>({
    queryKey: ["/api/tournaments"],
  });
  
  // Filter tournaments based on search query and active tab
  const filteredTournaments = allTournaments.filter(tournament => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tournament.game.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "live") return matchesSearch && tournament.isLive;
    if (activeTab === "upcoming") return matchesSearch && !tournament.isLive;
    
    return matchesSearch;
  });
  
  // Handler for watching a tournament
  const handleWatchTournament = (id: number) => {
    setLocation(`/tournaments/${id}/watch`);
  };
  
  // Handler for viewing tournament brackets
  const handleViewBrackets = (id: number) => {
    setLocation(`/tournaments/${id}/brackets`);
  };
  
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-rajdhani font-bold text-4xl mb-2">
            <span className="gradient-text">TOURNAMENTS</span>
          </h1>
          <p className="text-gray-400">Find and join competitive gaming tournaments</p>
        </div>
        <Button 
          className="bg-neon-purple hover:bg-opacity-90 text-white font-rajdhani font-bold" 
          onClick={() => setLocation("/tournaments/create")}
        >
          <Trophy className="mr-2 h-4 w-4" /> CREATE TOURNAMENT
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-64 relative">
          <Input
            type="text"
            placeholder="Search tournaments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-dark border-gray-800 pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex-grow">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-dark border border-gray-800 rounded-md w-full grid grid-cols-3 h-auto">
              <TabsTrigger value="all" className="font-rajdhani font-semibold py-2 data-[state=active]:bg-neon-purple/20 data-[state=active]:text-neon-purple">
                All Tournaments
              </TabsTrigger>
              <TabsTrigger value="live" className="font-rajdhani font-semibold py-2 data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink">
                <Flame className="mr-1 h-4 w-4" /> Live
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="font-rajdhani font-semibold py-2 data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue">
                <Clock className="mr-1 h-4 w-4" /> Upcoming
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Button variant="outline" className="bg-dark border-gray-800 text-gray-300">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-dark rounded-lg overflow-hidden animate-pulse h-96"></div>
          ))}
        </div>
      ) : filteredTournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              {...tournament}
              onWatch={handleWatchTournament}
              onBrackets={handleViewBrackets}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-dark rounded-full p-8 mb-4">
            <Trophy className="h-12 w-12 text-gray-600" />
          </div>
          <h3 className="text-2xl font-rajdhani font-bold mb-2">No tournaments found</h3>
          <p className="text-gray-400 mb-4">
            {searchQuery ? 
              `No tournaments match "${searchQuery}"` : 
              "There are no tournaments available right now."}
          </p>
          {searchQuery && (
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear search
            </Button>
          )}
        </div>
      )}
      
      {filteredTournaments.length > 0 && (
        <div className="mt-12 flex justify-center">
          <Button variant="outline" className="border-neon-purple text-neon-purple hover:bg-neon-purple/10 font-rajdhani">
            LOAD MORE <ArrowDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
