import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  TournamentCard, 
  TournamentCardProps 
} from "@/components/ui/tournament-card";
import { 
  GameCard,
  GameCardProps
} from "@/components/ui/game-card";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { 
  ChevronDown, 
  Trophy, 
  Users, 
  Gamepad,
  ArrowRight,
  Info,
  InfoIcon
} from "lucide-react";
import { LeaderboardTable, Player } from "@/components/ui/leaderboard-table";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  
  // Fetch tournaments
  const { data: tournaments = [] } = useQuery<TournamentCardProps[]>({
    queryKey: ["/api/tournaments/live"],
  });
  
  // Fetch game titles
  const { data: games = [] } = useQuery<GameCardProps[]>({
    queryKey: ["/api/games"],
  });
  
  // Fetch top players
  const { data: topPlayers = [] } = useQuery<Player[]>({
    queryKey: ["/api/leaderboard/top"],
  });
  
  // Handler for watching a tournament
  const handleWatchTournament = (id: number) => {
    setLocation(`/tournaments/${id}/watch`);
  };
  
  // Handler for viewing tournament brackets
  const handleViewBrackets = (id: number) => {
    setLocation(`/tournaments/${id}/brackets`);
  };
  
  // Handler for viewing a game
  const handleGameClick = (id: number) => {
    setLocation(`/games/${id}`);
  };
  
  // Handler for player profile click
  const handlePlayerClick = (id: number) => {
    setLocation(`/players/${id}`);
  };
  
  // Featured tournament date
  const featuredTournamentDate = new Date("2023-12-15T00:00:00");
  
  return (
    <main className="pt-16">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-dark z-0">
          <div className="absolute inset-0 hero-gradient z-10"></div>
          <div className="absolute inset-0 grid-bg z-10"></div>
        </div>
        
        <div className="container mx-auto px-4 z-20 text-center">
          <h1 className="font-rajdhani font-bold text-4xl md:text-6xl lg:text-7xl mb-4 leading-tight">
            <span className="block">DOMINATE THE</span>
            <span className="gradient-text">ESPORTS ARENA</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light text-gray-300">
            Join thousands of gamers competing for glory, recognition, and prize pools
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-neon-purple hover:bg-opacity-80 text-white font-rajdhani font-bold py-4 px-8 rounded-md transition duration-300 transform hover:-translate-y-1 animate-pulse-slow" 
              onClick={() => setLocation('/auth')}
            >
              <span className="mr-2">{user ? 'JOIN TOURNAMENTS' : 'JOIN NOW & COMPETE'}</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-neon-blue text-neon-blue hover:bg-neon-blue hover:bg-opacity-10 font-rajdhani font-bold"
              onClick={() => setLocation('/tournaments')}
            >
              BROWSE TOURNAMENTS
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
            <div className="bg-darker bg-opacity-80 backdrop-blur-sm px-5 py-3 rounded-full flex items-center">
              <Trophy className="text-neon-pink mr-2 h-4 w-4" />
              <span className="text-sm font-medium text-gray-300">$250K+ PRIZE POOL</span>
            </div>
            <div className="bg-darker bg-opacity-80 backdrop-blur-sm px-5 py-3 rounded-full flex items-center">
              <Users className="text-neon-blue mr-2 h-4 w-4" />
              <span className="text-sm font-medium text-gray-300">50K+ PLAYERS</span>
            </div>
            <div className="bg-darker bg-opacity-80 backdrop-blur-sm px-5 py-3 rounded-full flex items-center">
              <Gamepad className="text-neon-purple mr-2 h-4 w-4" />
              <span className="text-sm font-medium text-gray-300">15+ GAME TITLES</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center">
          <a href="#upcoming-tournaments" className="text-white animate-bounce">
            <ChevronDown className="h-6 w-6" />
          </a>
        </div>
      </section>
      
      {/* Live Tournaments Section */}
      <section id="upcoming-tournaments" className="py-16 bg-darker">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="font-rajdhani font-bold text-3xl md:text-4xl">
                <span className="gradient-text">LIVE</span> TOURNAMENTS
              </h2>
              <p className="text-gray-400 mt-2">Watch and join ongoing competitions</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center bg-dark rounded-full px-5 py-3">
                <span className="flex h-3 w-3 relative mr-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                </span>
                <span className="font-orbitron text-sm">{tournaments.length} TOURNAMENTS LIVE NOW</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                {...tournament}
                onWatch={handleWatchTournament}
                onBrackets={handleViewBrackets}
              />
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <Button 
              variant="outline"
              className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:bg-opacity-10 font-rajdhani font-semibold"
              onClick={() => setLocation('/tournaments')}
            >
              VIEW ALL TOURNAMENTS <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Tournament Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-blue/5 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-rajdhani font-bold text-3xl md:text-4xl mb-4">
              FEATURED <span className="gradient-text">TOURNAMENT</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Mark your calendar for the most anticipated esports event of the year</p>
          </div>
          
          <div className="bg-dark rounded-lg overflow-hidden border border-neon-blue glow-border">
            <div className="md:flex">
              <div className="md:w-1/2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1605979257913-1704eb7b6246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Championship" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="bg-neon-purple text-white text-xs font-bold uppercase py-1 px-3 rounded">Championship</span>
                  <h3 className="font-rajdhani font-bold text-3xl mt-3 text-white">NEXUS ARENA CHAMPIONSHIP 2023</h3>
                  <p className="text-gray-300 mt-2 text-sm">The ultimate battle for esports glory across multiple titles</p>
                </div>
              </div>
              
              <div className="md:w-1/2 p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Game 1" className="w-10 h-10 rounded-full border-2 border-dark" />
                      <img src="https://images.unsplash.com/photo-1627896157734-46e122c170cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Game 2" className="w-10 h-10 rounded-full border-2 border-dark" />
                      <img src="https://images.unsplash.com/photo-1556438064-2d7646166914?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Game 3" className="w-10 h-10 rounded-full border-2 border-dark" />
                    </div>
                    <span className="ml-3 text-sm text-gray-400">Multiple Games</span>
                  </div>
                  
                  <div className="bg-darker px-4 py-2 rounded-full">
                    <span className="font-orbitron text-neon-pink font-medium">$250,000</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Start Date</p>
                    <p className="font-orbitron font-medium">DEC 15, 2023</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Duration</p>
                    <p className="font-medium">3 Weeks</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Format</p>
                    <p className="font-medium">Double Elimination</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Teams</p>
                    <p className="font-medium">64 Teams</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <p className="text-gray-400 text-sm mb-3">Tournament Countdown</p>
                  <CountdownTimer 
                    targetDate={featuredTournamentDate} 
                    onComplete={() => console.log("Tournament has started!")}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="flex-1 bg-neon-purple hover:bg-opacity-90 text-white font-rajdhani font-bold"
                    onClick={() => setLocation('/tournaments/featured/register')}
                  >
                    <Trophy className="mr-2 h-4 w-4" /> REGISTER NOW
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="flex-1 border-neon-blue text-neon-blue hover:bg-neon-blue hover:bg-opacity-10 font-rajdhani font-bold"
                    onClick={() => setLocation('/tournaments/featured')}
                  >
                    <InfoIcon className="mr-2 h-4 w-4" /> MORE DETAILS
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Leaderboard Section */}
      <section className="py-16 bg-darker">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-rajdhani font-bold text-3xl md:text-4xl mb-2">
              GLOBAL <span className="gradient-text">LEADERBOARD</span>
            </h2>
            <p className="text-gray-400">Top ranked players across all game titles</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-dark rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  <div>
                    <h3 className="font-rajdhani font-bold text-xl">Top Players</h3>
                  </div>
                  <div className="flex space-x-2 overflow-x-auto">
                    <Button size="sm" className="bg-neon-purple bg-opacity-10 text-neon-purple">All Games</Button>
                    <Button size="sm" variant="ghost" className="hover:bg-white hover:bg-opacity-5 text-gray-400">Valorant</Button>
                    <Button size="sm" variant="ghost" className="hover:bg-white hover:bg-opacity-5 text-gray-400">Fortnite</Button>
                    <Button size="sm" variant="ghost" className="hover:bg-white hover:bg-opacity-5 text-gray-400">CS:GO</Button>
                  </div>
                </div>
                
                <LeaderboardTable 
                  players={topPlayers} 
                  onPlayerClick={handlePlayerClick}
                />
                
                <div className="p-4 border-t border-gray-800 flex justify-center">
                  <Button 
                    variant="link" 
                    className="text-neon-purple hover:underline font-medium"
                    onClick={() => setLocation('/leaderboard')}
                  >
                    VIEW FULL LEADERBOARD
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-dark rounded-lg overflow-hidden h-full">
                <div className="p-4 border-b border-gray-800">
                  <h3 className="font-rajdhani font-bold text-xl">Featured Player</h3>
                </div>
                
                {topPlayers.length > 0 && (
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-neon-purple mb-4">
                        <img src={topPlayers[0].avatar} alt={topPlayers[0].username} className="h-full w-full object-cover" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-neon-purple text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center">
                        #{topPlayers[0].rank}
                      </div>
                    </div>
                    
                    <h4 className="font-rajdhani font-bold text-2xl mb-1">{topPlayers[0].username}</h4>
                    <p className="text-gray-400 text-sm mb-4">
                      {topPlayers[0].country}
                    </p>
                    
                    <div className="flex justify-center space-x-4 mb-6">
                      <div className="bg-darker rounded-lg p-3 w-20 text-center">
                        <p className="text-xs text-gray-400">Tournaments</p>
                        <p className="font-orbitron font-medium text-neon-pink">287</p>
                      </div>
                      <div className="bg-darker rounded-lg p-3 w-20 text-center">
                        <p className="text-xs text-gray-400">Win Rate</p>
                        <p className="font-orbitron font-medium text-neon-blue">{topPlayers[0].winRate}%</p>
                      </div>
                      <div className="bg-darker rounded-lg p-3 w-20 text-center">
                        <p className="text-xs text-gray-400">Rank</p>
                        <p className="font-orbitron font-medium text-neon-purple">Pro</p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-darker h-2 rounded-full mb-4">
                      <div 
                        className="bg-gradient-to-r from-neon-purple to-neon-blue h-2 rounded-full" 
                        style={{ width: `${topPlayers[0].winRate}%` }}></div>
                    </div>
                    
                    <div className="mb-6">
                      <h5 className="font-medium mb-2">Top Games</h5>
                      <div className="flex justify-center space-x-3 mb-4">
                        <div className="relative group">
                          <img src={topPlayers[0].gameIcon} alt={topPlayers[0].game} className="w-10 h-10 rounded-lg" />
                          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-darker px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {topPlayers[0].game}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full bg-neon-purple hover:bg-opacity-90 text-white font-rajdhani font-bold"
                      onClick={() => handlePlayerClick(topPlayers[0].id)}
                    >
                      VIEW FULL PROFILE
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Game Titles Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-rajdhani font-bold text-3xl md:text-4xl mb-2">
              SUPPORTED <span className="gradient-text">GAME TITLES</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Compete in tournaments across these popular competitive titles</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard 
                key={game.id} 
                {...game} 
                onClick={handleGameClick}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              variant="outline"
              className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:bg-opacity-10 font-rajdhani font-semibold"
              onClick={() => setLocation('/games')}
            >
              VIEW ALL GAMES <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-darker relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-blue/10 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="bg-neon-pink bg-opacity-20 text-neon-pink px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
              JOIN THE COMPETITION
            </span>
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              READY TO PROVE YOUR <span className="gradient-text">GAMING SKILLS?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Register now to compete in tournaments, track your stats, and climb the global leaderboard. Your journey to esports glory starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button 
                size="lg"
                className="bg-neon-purple hover:bg-opacity-90 text-white font-rajdhani font-bold py-4 px-8 rounded-md transition duration-300"
                onClick={() => setLocation('/auth')}
              >
                <span className="mr-2">CREATE ACCOUNT</span>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-neon-blue text-neon-blue hover:bg-neon-blue hover:bg-opacity-10 font-rajdhani font-bold py-4 px-8 rounded-md transition duration-300"
              >
                <span>JOIN OUR DISCORD</span>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-neon-purple bg-opacity-20 flex items-center justify-center mb-3">
                  <Gamepad className="h-6 w-6 text-neon-purple" />
                </div>
                <h3 className="font-rajdhani font-bold text-xl mb-1">Multiple Games</h3>
                <p className="text-gray-400 text-sm">Compete across various titles</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-neon-blue bg-opacity-20 flex items-center justify-center mb-3">
                  <Trophy className="h-6 w-6 text-neon-blue" />
                </div>
                <h3 className="font-rajdhani font-bold text-xl mb-1">Big Prizes</h3>
                <p className="text-gray-400 text-sm">Win rewards and recognition</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-neon-pink bg-opacity-20 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-neon-pink" />
                </div>
                <h3 className="font-rajdhani font-bold text-xl mb-1">Global Community</h3>
                <p className="text-gray-400 text-sm">Connect with players worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
