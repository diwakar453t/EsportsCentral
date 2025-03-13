import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LIVE_TOURNAMENTS } from "@/lib/constants";
import { Link } from "wouter";

const LiveTournamentWidget = () => {
  return (
    <Card className="neon-border rounded-xl p-4 bg-dark/80 backdrop-blur-sm animate-float">
      <CardHeader className="p-0 mb-4 space-y-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold font-rajdhani text-white">LIVE NOW</CardTitle>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
            <span className="h-2 w-2 mr-1 rounded-full bg-white animate-pulse"></span>
            LIVE
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {LIVE_TOURNAMENTS.map(tournament => (
          <div key={tournament.id} className="bg-surface rounded-lg p-3 flex items-center">
            <img 
              src={`${tournament.image}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80`} 
              alt={`${tournament.name} Tournament`} 
              className="h-14 w-14 object-cover rounded-md mr-3" 
            />
            <div className="flex-1">
              <h4 className="font-medium text-white">{tournament.name}</h4>
              <div className="flex items-center text-xs text-gray-400">
                <span>{tournament.stage} • {tournament.players} Players</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-secondary font-orbitron font-bold">${tournament.prizePool.toLocaleString()}</div>
              <Link href={`/tournaments/${tournament.id}`}>
                <a className="text-xs text-primary hover:text-secondary">View</a>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default LiveTournamentWidget;
