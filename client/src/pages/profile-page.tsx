import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Trophy,
  Medal,
  Clock,
  Star,
  BookOpen,
  Settings,
  Edit,
  Gamepad,
  BarChart2,
  Flag,
  Calendar,
  Globe,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { TournamentCard, TournamentCardProps } from "@/components/ui/tournament-card";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "wouter";

// Profile update schema
const profileFormSchema = z.object({
  displayName: z.string().min(3, "Display name must be at least 3 characters"),
  bio: z.string().max(300, "Bio cannot be longer than 300 characters"),
  country: z.string().min(1, "Please select your country"),
  mainGame: z.string().min(1, "Please select your main game"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Fetch profile data
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["/api/profile"],
  });

  // Fetch user's tournaments
  const { data: userTournaments = [], isLoading: isLoadingTournaments } = useQuery<TournamentCardProps[]>({
    queryKey: ["/api/tournaments/user"],
  });

  // Fetch available games
  const { data: games = [] } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["/api/games/list"],
  });

  // Fetch available countries
  const { data: countries = [] } = useQuery<{ code: string; name: string }[]>({
    queryKey: ["/api/countries"],
  });

  // Form setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: profile?.displayName || "",
      bio: profile?.bio || "",
      country: profile?.country || "",
      mainGame: profile?.mainGame || "",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const res = await apiRequest("PATCH", "/api/profile", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  // Handler for watching a tournament
  const handleWatchTournament = (id: number) => {
    setLocation(`/tournaments/${id}/watch`);
  };

  // Handler for viewing tournament brackets
  const handleViewBrackets = (id: number) => {
    setLocation(`/tournaments/${id}/brackets`);
  };

  // Achievement card component
  const AchievementCard = ({ title, description, icon, color }: { title: string; description: string; icon: React.ReactNode; color: string }) => (
    <div className="flex items-center p-3 bg-darker rounded-lg">
      <div className={`mr-3 text-${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );

  // Stat card component
  const StatCard = ({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) => (
    <div className="bg-darker rounded-lg p-3 text-center">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center mx-auto mb-2`}>
        {icon}
      </div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-orbitron font-medium text-lg">{value}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-80">
          <Card className="bg-dark border-gray-800 sticky top-24">
            <CardContent className="p-6">
              {isLoadingProfile ? (
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-gray-800 animate-pulse mb-4"></div>
                  <div className="h-6 w-40 bg-gray-800 animate-pulse mb-2"></div>
                  <div className="h-4 w-20 bg-gray-800 animate-pulse mb-4"></div>
                  <div className="h-2 w-full bg-gray-800 animate-pulse mb-1"></div>
                  <div className="h-2 w-full bg-gray-800 animate-pulse mb-1"></div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-neon-purple mb-4">
                      <img
                        src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                        alt={profile?.displayName || user?.username}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute bottom-3 right-0 h-8 w-8 p-0 rounded-full bg-darker border border-gray-800"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <h2 className="font-rajdhani font-bold text-2xl mb-1">
                    {profile?.displayName || user?.username}
                  </h2>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <Globe className="h-3 w-3 mr-1" />
                    <span>{profile?.country || "Not specified"}</span>
                  </div>

                  {profile?.rank && (
                    <Badge className="bg-neon-purple bg-opacity-20 text-neon-purple mb-4">
                      Rank #{profile.rank}
                    </Badge>
                  )}

                  <p className="text-sm text-gray-400 mb-6">
                    {profile?.bio || "No bio provided yet. Tell us about yourself."}
                  </p>

                  <div className="grid grid-cols-3 gap-2 w-full mb-6">
                    <StatCard
                      label="Tournaments"
                      value={profile?.stats?.tournaments || 0}
                      icon={<Trophy className="h-5 w-5 text-white" />}
                      color="bg-neon-purple bg-opacity-10"
                    />
                    <StatCard
                      label="Win Rate"
                      value={`${profile?.stats?.winRate || 0}%`}
                      icon={<Star className="h-5 w-5 text-white" />}
                      color="bg-neon-blue bg-opacity-10"
                    />
                    <StatCard
                      label="Points"
                      value={profile?.stats?.points?.toLocaleString() || 0}
                      icon={<Medal className="h-5 w-5 text-white" />}
                      color="bg-neon-pink bg-opacity-10"
                    />
                  </div>

                  {profile?.mainGame && (
                    <div className="w-full bg-darker rounded-lg p-3 flex items-center mb-6">
                      <Gamepad className="h-5 w-5 text-neon-blue mr-3" />
                      <div className="text-left">
                        <p className="text-xs text-gray-400">Main Game</p>
                        <p className="font-medium">{profile.mainGame}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-dark border border-gray-800 rounded-md w-full grid grid-cols-4 h-auto mb-6">
              <TabsTrigger
                value="overview"
                className="font-rajdhani font-semibold py-2 data-[state=active]:bg-neon-purple/20 data-[state=active]:text-neon-purple"
              >
                <User className="mr-1 h-4 w-4" /> Overview
              </TabsTrigger>
              <TabsTrigger
                value="tournaments"
                className="font-rajdhani font-semibold py-2 data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue"
              >
                <Trophy className="mr-1 h-4 w-4" /> Tournaments
              </TabsTrigger>
              <TabsTrigger
                value="statistics"
                className="font-rajdhani font-semibold py-2 data-[state=active]:bg-neon-pink/20 data-[state=active]:text-neon-pink"
              >
                <BarChart2 className="mr-1 h-4 w-4" /> Statistics
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="font-rajdhani font-semibold py-2 data-[state=active]:bg-gray-700/20 data-[state=active]:text-gray-300"
              >
                <Settings className="mr-1 h-4 w-4" /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-dark border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-rajdhani">
                    <Trophy className="h-5 w-5 mr-2 text-neon-purple" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest tournament activity and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingProfile ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-gray-800 animate-pulse rounded-lg"></div>
                      ))}
                    </div>
                  ) : profile?.recentActivity?.length ? (
                    <div className="space-y-2">
                      {profile.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center p-3 bg-darker rounded-lg">
                          <div className="mr-3 text-neon-blue">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-gray-400">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Clock className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-dark border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-rajdhani">
                    <Medal className="h-5 w-5 mr-2 text-neon-blue" />
                    Achievements
                  </CardTitle>
                  <CardDescription>Milestones and accomplishments you've earned</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingProfile ? (
                    <div className="space-y-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-14 bg-gray-800 animate-pulse rounded-lg"></div>
                      ))}
                    </div>
                  ) : profile?.achievements?.length ? (
                    <div className="space-y-2">
                      {profile.achievements.map((achievement, index) => (
                        <AchievementCard
                          key={index}
                          title={achievement.title}
                          description={achievement.description}
                          icon={<Trophy className="h-5 w-5" />}
                          color={achievement.color || "neon-purple"}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Trophy className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400">No achievements yet</p>
                      <p className="text-xs text-gray-500">Join tournaments to earn achievements</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-dark border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-rajdhani">
                    <Gamepad className="h-5 w-5 mr-2 text-neon-pink" />
                    Games
                  </CardTitle>
                  <CardDescription>Games you play and your statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingProfile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-14 bg-gray-800 animate-pulse rounded-lg"></div>
                      ))}
                    </div>
                  ) : profile?.games?.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {profile.games.map((game, index) => (
                        <div key={index} className="flex items-center p-3 bg-darker rounded-lg">
                          <img
                            src={game.icon}
                            alt={game.name}
                            className="w-10 h-10 rounded-lg mr-3"
                          />
                          <div>
                            <p className="font-medium">{game.name}</p>
                            <div className="flex items-center text-xs text-gray-400">
                              <span className="mr-2">
                                <Trophy className="h-3 w-3 inline-block mr-1" />
                                {game.wins} wins
                              </span>
                              <span>
                                <Medal className="h-3 w-3 inline-block mr-1" />
                                {game.rank} rank
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Gamepad className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400">No games added</p>
                      <p className="text-xs text-gray-500">Add games to see your statistics</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tournaments">
              <Card className="bg-dark border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-rajdhani">
                    <Trophy className="h-5 w-5 mr-2 text-neon-blue" />
                    My Tournaments
                  </CardTitle>
                  <CardDescription>Tournaments you are participating in or have completed</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingTournaments ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-800 animate-pulse h-80 rounded-lg"></div>
                      ))}
                    </div>
                  ) : userTournaments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userTournaments.map((tournament) => (
                        <TournamentCard
                          key={tournament.id}
                          {...tournament}
                          onWatch={handleWatchTournament}
                          onBrackets={handleViewBrackets}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-rajdhani font-bold mb-2">No tournaments yet</h3>
                      <p className="text-gray-400 mb-4">
                        You haven't joined any tournaments yet. Explore upcoming events and join the competition!
                      </p>
                      <Button
                        className="bg-neon-purple hover:bg-opacity-90 text-white"
                        onClick={() => setLocation("/tournaments")}
                      >
                        Browse Tournaments
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics">
              <Card className="bg-dark border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-rajdhani">
                    <BarChart2 className="h-5 w-5 mr-2 text-neon-purple" />
                    Performance Analytics
                  </CardTitle>
                  <CardDescription>Your tournament performance statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingProfile ? (
                    <div className="space-y-4">
                      <div className="h-80 bg-gray-800 animate-pulse rounded-lg mb-4"></div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-24 bg-gray-800 animate-pulse rounded-lg"></div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <StatCard
                          label="Total Matches"
                          value={profile?.stats?.totalMatches || 0}
                          icon={<BookOpen className="h-5 w-5 text-white" />}
                          color="bg-neon-purple bg-opacity-10"
                        />
                        <StatCard
                          label="Wins"
                          value={profile?.stats?.wins || 0}
                          icon={<Trophy className="h-5 w-5 text-white" />}
                          color="bg-neon-blue bg-opacity-10"
                        />
                        <StatCard
                          label="Win Rate"
                          value={`${profile?.stats?.winRate || 0}%`}
                          icon={<Star className="h-5 w-5 text-white" />}
                          color="bg-neon-pink bg-opacity-10"
                        />
                        <StatCard
                          label="Total Points"
                          value={profile?.stats?.points?.toLocaleString() || 0}
                          icon={<Medal className="h-5 w-5 text-white" />}
                          color="bg-success bg-opacity-10"
                        />
                      </div>

                      {!profile?.stats ? (
                        <div className="text-center py-8">
                          <BarChart2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                          <h3 className="text-xl font-rajdhani font-bold mb-2">No statistics available</h3>
                          <p className="text-gray-400">
                            Participate in tournaments to see your performance statistics.
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-6">
                            <h3 className="font-rajdhani font-semibold mb-3">Recent Match History</h3>
                            {profile.matchHistory?.length > 0 ? (
                              <div className="space-y-2">
                                {profile.matchHistory.map((match, index) => (
                                  <div
                                    key={index}
                                    className={`flex items-center justify-between p-3 bg-darker rounded-lg border-l-4 ${
                                      match.result === "win"
                                        ? "border-success"
                                        : match.result === "loss"
                                        ? "border-destructive"
                                        : "border-warning"
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <img
                                        src={match.gameIcon}
                                        alt={match.game}
                                        className="w-8 h-8 rounded-lg mr-3"
                                      />
                                      <div>
                                        <p className="font-medium">{match.tournament}</p>
                                        <div className="flex items-center text-xs text-gray-400">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          <span>{match.date}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p
                                        className={`font-medium ${
                                          match.result === "win"
                                            ? "text-success"
                                            : match.result === "loss"
                                            ? "text-destructive"
                                            : "text-warning"
                                        }`}
                                      >
                                        {match.result.toUpperCase()}
                                      </p>
                                      <p className="text-xs text-gray-400">{match.score}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 bg-darker rounded-lg">
                                <p className="text-gray-400">No match history available</p>
                              </div>
                            )}
                          </div>

                          <div>
                            <h3 className="font-rajdhani font-semibold mb-3">Game Performance</h3>
                            {profile.gameStats?.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.gameStats.map((gameStat, index) => (
                                  <div key={index} className="bg-darker rounded-lg p-4">
                                    <div className="flex items-center mb-3">
                                      <img
                                        src={gameStat.icon}
                                        alt={gameStat.name}
                                        className="w-8 h-8 rounded-lg mr-3"
                                      />
                                      <h4 className="font-rajdhani font-semibold">{gameStat.name}</h4>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                      <div>
                                        <p className="text-xs text-gray-400">Matches</p>
                                        <p className="font-medium">{gameStat.matches}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-400">Win Rate</p>
                                        <p className="font-medium text-neon-blue">{gameStat.winRate}%</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-400">Rank</p>
                                        <p className="font-medium text-neon-purple">#{gameStat.rank}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 bg-darker rounded-lg">
                                <p className="text-gray-400">No game performance data available</p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="bg-dark border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-rajdhani">
                    <Settings className="h-5 w-5 mr-2 text-gray-400" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-dark border-gray-800" />
                            </FormControl>
                            <FormDescription>
                              This is your public display name. It can be different from your username.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                className="bg-dark border-gray-800 resize-none"
                                placeholder="Tell us about yourself..."
                                rows={4}
                              />
                            </FormControl>
                            <FormDescription>
                              Brief description about yourself that will be visible on your profile.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-dark border-gray-800">
                                    <SelectValue placeholder="Select your country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                      <div className="flex items-center">
                                        <Flag className="h-4 w-4 mr-2" />
                                        {country.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="mainGame"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Main Game</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-dark border-gray-800">
                                    <SelectValue placeholder="Select your main game" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {games.map((game) => (
                                    <SelectItem key={game.id} value={game.id}>
                                      <div className="flex items-center">
                                        <Gamepad className="h-4 w-4 mr-2" />
                                        {game.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator className="bg-gray-800" />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-neon-purple hover:bg-opacity-90 text-white"
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="bg-dark border-gray-800 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-rajdhani text-destructive">
                    <Settings className="h-5 w-5 mr-2 text-destructive" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>Manage your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-darker p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Change Password</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Update your password to maintain account security.
                      </p>
                      <Button variant="outline" className="border-gray-700">
                        Change Password
                      </Button>
                    </div>

                    <div className="bg-darker p-4 rounded-lg border border-destructive/20">
                      <h3 className="font-medium mb-2 text-destructive">Danger Zone</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
