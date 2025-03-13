import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfile from "@/components/dashboard/user-profile";
import MatchHistory from "@/components/dashboard/match-history";
import { useQuery } from "@tanstack/react-query";
import { Tournament } from "@shared/schema";
import { Calendar, Trophy, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPage = () => {
  const { user } = useAuth();
  
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: tournaments, isLoading: isLoadingTournaments } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments"],
    enabled: !!user,
  });

  // Filter tournaments by status
  const upcomingTournaments = tournaments?.filter(t => 
    new Date(t.startDate) > new Date() && t.status === "upcoming"
  ).slice(0, 3);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold font-orbitron mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Player Dashboard
          </span>
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile and History Section */}
          <div className="lg:col-span-2">
            <UserProfile />
            <MatchHistory />
          </div>
          
          {/* Side Panel */}
          <div className="space-y-6">
            {/* Upcoming Tournaments */}
            <Card className="neon-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-rajdhani">Upcoming Tournaments</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingTournaments ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-surface rounded-lg p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-3" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ))}
                  </div>
                ) : upcomingTournaments && upcomingTournaments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingTournaments.map(tournament => (
                      <div key={tournament.id} className="bg-surface rounded-lg p-4">
                        <h3 className="font-medium text-white text-lg">{tournament.name}</h3>
                        <div className="flex items-center text-xs text-gray-400 mb-3">
                          <Calendar className="h-3 w-3 mr-1" /> {formatDate(tournament.startDate)}
                          <span className="mx-1">•</span>
                          <Users className="h-3 w-3 mr-1" /> {tournament.playerLimit} Players
                          <span className="mx-1">•</span>
                          <Trophy className="h-3 w-3 mr-1 text-yellow-400" /> ${tournament.prizePool.toLocaleString()}
                        </div>
                        <Link href={`/tournaments/${tournament.id}`}>
                          <Button className="w-full bg-primary/20 hover:bg-primary/40 text-white">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    ))}
                    <div className="text-center mt-2">
                      <Link href="/tournaments">
                        <a className="text-primary hover:text-secondary text-sm font-medium">
                          View All Tournaments
                        </a>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Clock className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                    <h3 className="text-gray-400 font-medium text-lg">No upcoming tournaments</h3>
                    <p className="text-gray-500 text-sm mt-1 mb-4">
                      Check back soon for new tournaments
                    </p>
                    <Link href="/tournaments">
                      <Button className="bg-primary hover:bg-primary/80">
                        Browse Tournaments
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Quick Stats */}
            <Card className="neon-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-rajdhani">My Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="weekly">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="weekly" className="flex-1">This Week</TabsTrigger>
                    <TabsTrigger value="monthly" className="flex-1">This Month</TabsTrigger>
                    <TabsTrigger value="alltime" className="flex-1">All Time</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="weekly" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Matches Played</div>
                        <div className="text-2xl font-bold text-white">3</div>
                      </div>
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Win Rate</div>
                        <div className="text-2xl font-bold text-white">67%</div>
                      </div>
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Points Earned</div>
                        <div className="text-2xl font-bold text-white">125</div>
                      </div>
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Tournaments</div>
                        <div className="text-2xl font-bold text-white">1</div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="monthly" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Matches Played</div>
                        <div className="text-2xl font-bold text-white">12</div>
                      </div>
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Win Rate</div>
                        <div className="text-2xl font-bold text-white">58%</div>
                      </div>
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Points Earned</div>
                        <div className="text-2xl font-bold text-white">430</div>
                      </div>
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Tournaments</div>
                        <div className="text-2xl font-bold text-white">3</div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="alltime" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Matches Played</div>
                        <div className="text-2xl font-bold text-white">47</div>
                      </div>
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Win Rate</div>
                        <div className="text-2xl font-bold text-white">62%</div>
                      </div>
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Points Earned</div>
                        <div className="text-2xl font-bold text-white">1,855</div>
                      </div>
                      <div className="bg-surface p-4 rounded-lg">
                        <div className="text-gray-400 text-sm">Tournaments</div>
                        <div className="text-2xl font-bold text-white">12</div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
