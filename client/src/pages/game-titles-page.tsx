import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
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
import { GameCard, GameCardProps } from "@/components/ui/game-card";
import { 
  Search, 
  Gamepad, 
  Filter,
  Trophy,
  Users,
  ArrowRight,
  Globe
} from "lucide-react";

export default function GameTitlesPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  
  // Fetch game titles
  const { data: games = [], isLoading } = useQuery<GameCardProps[]>({
    queryKey: ["/api/games", { genre: genreFilter, sort: sortBy }],
  });
  
  // Fetch game genres
  const { data: genres = [] } = useQuery<{ id: string, name: string }[]>({
    queryKey: ["/api/games/genres"],
  });
  
  // Filter games based on search query
  const filteredGames = searchQuery 
    ? games.filter(game => 
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : games;
  
  // Handle game click navigation
  const handleGameClick = (id: number) => {
    setLocation(`/games/${id}`);
  };
  
  // Featured game section component
  const FeaturedGame = () => {
    const featuredGame = games.length > 0 ? games[0] : null;
    
    if (!featuredGame) return null;
    
    return (
      <div className="relative bg-dark rounded-lg overflow-hidden mb-12 glow-border">
        <div className="md:flex">
          <div className="md:w-1/2 relative">
            <img 
              src={featuredGame.image}
              alt={featuredGame.name}
              className="w-full h-full object-cover max-h-96 md:max-h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <span className="bg-neon-purple text-white text-xs font-bold uppercase py-1 px-3 rounded">
                Featured Game
              </span>
              <h3 className="font-rajdhani font-bold text-3xl mt-3 text-white">
                {featuredGame.name}
              </h3>
              <p className="text-gray-300 mt-2 text-sm">
                {featuredGame.description}
              </p>
            </div>
          </div>
          
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="mb-6">
              <h3 className="font-rajdhani font-semibold text-xl mb-2">Game Overview</h3>
              <p className="text-gray-400 text-sm">
                Join the most competitive tournaments in {featuredGame.name} and prove your skills
                against players from around the world. With {featuredGame.tournamentCount} active 
                tournaments and a prize pool of {featuredGame.prizePool}, there's never been a better
                time to compete.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-darker rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="bg-neon-purple bg-opacity-10 p-2 rounded-full mb-2">
                  <Trophy className="h-5 w-5 text-neon-purple" />
                </div>
                <p className="text-center text-xs text-gray-400">Prize Pool</p>
                <p className="font-orbitron font-medium">{featuredGame.prizePool}</p>
              </div>
              
              <div className="bg-darker rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="bg-neon-blue bg-opacity-10 p-2 rounded-full mb-2">
                  <Users className="h-5 w-5 text-neon-blue" />
                </div>
                <p className="text-center text-xs text-gray-400">Active Players</p>
                <p className="font-orbitron font-medium">12,450+</p>
              </div>
              
              <div className="bg-darker rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="bg-neon-pink bg-opacity-10 p-2 rounded-full mb-2">
                  <Gamepad className="h-5 w-5 text-neon-pink" />
                </div>
                <p className="text-center text-xs text-gray-400">Tournaments</p>
                <p className="font-orbitron font-medium">{featuredGame.tournamentCount}</p>
              </div>
              
              <div className="bg-darker rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="bg-success bg-opacity-10 p-2 rounded-full mb-2">
                  <Globe className="h-5 w-5 text-success" />
                </div>
                <p className="text-center text-xs text-gray-400">Regions</p>
                <p className="font-orbitron font-medium">Global</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="flex-1 bg-neon-purple hover:bg-opacity-90 text-white font-rajdhani font-bold"
                onClick={() => handleGameClick(featuredGame.id)}
              >
                <Gamepad className="mr-2 h-4 w-4" /> GAME DETAILS
              </Button>
              <Button 
                variant="outline"
                className="flex-1 border-neon-blue text-neon-blue hover:bg-neon-blue hover:bg-opacity-10 font-rajdhani font-bold"
                onClick={() => setLocation(`/tournaments?game=${featuredGame.id}`)}
              >
                <Trophy className="mr-2 h-4 w-4" /> VIEW TOURNAMENTS
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <h1 className="font-rajdhani font-bold text-4xl mb-2">
          SUPPORTED <span className="gradient-text">GAME TITLES</span>
        </h1>
        <p className="text-gray-400">Compete in tournaments across these popular competitive titles</p>
      </div>
      
      {/* Featured Game */}
      {!isLoading && games.length > 0 && <FeaturedGame />}
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="w-full md:w-64 relative">
          <Input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-dark border-gray-800 pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="bg-dark border-gray-800">
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id}>{genre.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-64">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-dark border-gray-800">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="tournaments">Most Tournaments</SelectItem>
              <SelectItem value="prizepool">Highest Prize Pool</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" className="md:ml-auto bg-dark border-gray-800 text-gray-300">
          <Filter className="mr-2 h-4 w-4" /> More Filters
        </Button>
      </div>
      
      {/* Tabs for Categories */}
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="bg-dark border border-gray-800 rounded-md w-full grid grid-cols-4 h-auto">
          <TabsTrigger value="all" className="font-rajdhani font-semibold py-2 data-[state=active]:bg-neon-purple/20 data-[state=active]:text-neon-purple">
            All Games
          </TabsTrigger>
          <TabsTrigger value="fps" className="font-rajdhani font-semibold py-2 data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue">
            FPS
          </TabsTrigger>
          <TabsTrigger value="moba" className="font-rajdhani font-semibold py-2 data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink">
            MOBA
          </TabsTrigger>
          <TabsTrigger value="battle-royale" className="font-rajdhani font-semibold py-2 data-[state=active]:bg-success/20 data-[state=active]:text-success">
            Battle Royale
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-dark rounded-lg overflow-hidden animate-pulse h-64"></div>
              ))}
            </div>
          ) : filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  {...game}
                  onClick={handleGameClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-dark rounded-full p-8 mb-4">
                <Gamepad className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-rajdhani font-bold mb-2">No games found</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery ? 
                  `No games match "${searchQuery}"` : 
                  "There are no games available with the selected filters."}
              </p>
              {(searchQuery || genreFilter !== "all") && (
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setGenreFilter("all");
                }}>
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Similar structure for other tabs */}
        <TabsContent value="fps" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGames
              .filter(game => game.description.toLowerCase().includes("fps") || game.description.toLowerCase().includes("shooter"))
              .map((game) => (
                <GameCard
                  key={game.id}
                  {...game}
                  onClick={handleGameClick}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="moba" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGames
              .filter(game => game.description.toLowerCase().includes("moba"))
              .map((game) => (
                <GameCard
                  key={game.id}
                  {...game}
                  onClick={handleGameClick}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="battle-royale" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGames
              .filter(game => game.description.toLowerCase().includes("battle royale"))
              .map((game) => (
                <GameCard
                  key={game.id}
                  {...game}
                  onClick={handleGameClick}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Game Categories */}
      <Card className="bg-dark border-gray-800 mt-12">
        <CardHeader>
          <CardTitle className="font-rajdhani font-bold text-2xl flex items-center">
            <Gamepad className="mr-2 h-5 w-5 text-neon-purple" />
            Game Categories
          </CardTitle>
          <CardDescription>
            Browse tournaments by game category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {genres.slice(0, 8).map((genre) => (
              <Button
                key={genre.id}
                variant="outline"
                className="h-auto py-4 border-gray-800 hover:border-neon-purple justify-start"
                onClick={() => {
                  setGenreFilter(genre.id);
                  setSearchQuery("");
                }}
              >
                <div className="flex items-center">
                  <div className="bg-neon-purple bg-opacity-10 p-2 rounded-full mr-3">
                    <Gamepad className="h-5 w-5 text-neon-purple" />
                  </div>
                  <div className="text-left">
                    <p className="font-rajdhani font-semibold">{genre.name}</p>
                    <p className="text-xs text-muted-foreground">Browse games</p>
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Call to Action */}
      <div className="mt-16 bg-dark rounded-lg p-8 border border-neon-blue/30 text-center">
        <h2 className="font-rajdhani font-bold text-3xl mb-4">
          Can't find your <span className="gradient-text">favorite game</span>?
        </h2>
        <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
          We're constantly adding new games to our platform. Submit a request and we'll consider adding it
          to our supported titles for tournaments.
        </p>
        <Button className="bg-neon-purple hover:bg-opacity-90 text-white">
          Request a New Game
        </Button>
      </div>
    </div>
  );
}
