import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Gamepad } from "lucide-react";

export interface Player {
  id: number;
  rank: number;
  username: string;
  avatar: string;
  country: string;
  game: string;
  gameIcon: string;
  wins: number;
  points: number;
  winRate: number;
  isOnline: boolean;
}

interface LeaderboardTableProps {
  players: Player[];
  onPlayerClick?: (id: number) => void;
}

export function LeaderboardTable({ players, onPlayerClick }: LeaderboardTableProps) {
  // Function to render the rank badge with appropriate color
  const renderRankBadge = (rank: number) => {
    let bgColor = "bg-gray-700";
    let textColor = "text-gray-300";
    
    if (rank === 1) {
      bgColor = "bg-neon-purple bg-opacity-10";
      textColor = "text-neon-purple";
    } else if (rank === 2) {
      bgColor = "bg-neon-pink bg-opacity-10";
      textColor = "text-neon-pink";
    } else if (rank === 3) {
      bgColor = "bg-neon-blue bg-opacity-10";
      textColor = "text-neon-blue";
    }
    
    return (
      <div className={`w-8 h-8 rounded-full ${bgColor} ${textColor} flex items-center justify-center font-medium mx-auto`}>
        {rank}
      </div>
    );
  };
  
  // Function to render win rate badge with appropriate color
  const renderWinRateBadge = (winRate: number) => {
    let color = "bg-success bg-opacity-10 text-success";
    
    if (winRate < 50) {
      color = "bg-destructive bg-opacity-10 text-destructive";
    } else if (winRate < 65) {
      color = "bg-warning bg-opacity-10 text-warning";
    }
    
    return (
      <Badge variant="outline" className={color}>
        {winRate}%
      </Badge>
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-left text-xs font-medium text-muted-foreground uppercase">
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Game</TableHead>
            <TableHead className="text-center">Wins</TableHead>
            <TableHead className="text-center">Points</TableHead>
            <TableHead className="text-center">Win Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-800">
          {players.map((player) => (
            <TableRow 
              key={player.id} 
              className="hover:bg-white hover:bg-opacity-5 cursor-pointer"
              onClick={() => onPlayerClick && onPlayerClick(player.id)}
            >
              <TableCell className="p-4 text-center">
                {renderRankBadge(player.rank)}
              </TableCell>
              <TableCell className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 relative">
                    <img className="h-10 w-10 rounded-full" src={player.avatar} alt={player.username} />
                    <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full ${player.isOnline ? 'bg-success' : 'bg-gray-500'} border-2 border-dark`}></div>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">{player.username}</div>
                    <div className="text-gray-400 text-xs">{player.country}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="p-4">
                <div className="flex items-center">
                  <img src={player.gameIcon} alt={player.game} className="w-5 h-5 mr-2 rounded" />
                  <span>{player.game}</span>
                </div>
              </TableCell>
              <TableCell className="p-4 text-center font-medium">{player.wins}</TableCell>
              <TableCell className="p-4 text-center">
                <span className="font-orbitron text-neon-blue font-medium">{player.points.toLocaleString()}</span>
              </TableCell>
              <TableCell className="p-4 text-center">
                {renderWinRateBadge(player.winRate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
