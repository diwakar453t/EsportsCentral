import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Users, 
  Globe, 
  Tv, 
  BarChart2, 
  Gamepad,
  Eye
} from "lucide-react";

export interface TournamentCardProps {
  id: number;
  title: string;
  game: string;
  image: string;
  prizePool: string;
  teams: string;
  region: string;
  stage: string;
  isLive?: boolean;
  viewers?: number;
  onWatch?: (id: number) => void;
  onBrackets?: (id: number) => void;
}

export function TournamentCard({
  id,
  title,
  game,
  image,
  prizePool,
  teams,
  region,
  stage,
  isLive = false,
  viewers,
  onWatch,
  onBrackets
}: TournamentCardProps) {
  return (
    <Card className="bg-dark rounded-lg overflow-hidden glow-border card-hover">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        {isLive && (
          <div className="absolute top-0 left-0 m-3">
            <Badge variant="destructive" className="text-xs font-bold uppercase">LIVE</Badge>
          </div>
        )}
        {viewers && (
          <div className="absolute bottom-0 right-0 m-3 bg-dark bg-opacity-80 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-full">
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" /> {viewers.toLocaleString()}k watching
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-rajdhani font-bold text-xl">{title}</h3>
            <p className="text-muted-foreground text-sm flex items-center mt-1">
              <Gamepad className="h-4 w-4 mr-2" /> {game}
            </p>
          </div>
          <div className="bg-dark px-3 py-1 rounded-full border border-neon-purple">
            <span className="font-orbitron text-neon-purple text-xs">{prizePool}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-black border border-neon-blue flex items-center justify-center mr-2">
              <Users className="text-neon-blue text-xs" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Teams</p>
              <p className="font-medium">{teams}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-black border border-neon-pink flex items-center justify-center mr-2">
              <Globe className="text-neon-pink text-xs" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Region</p>
              <p className="font-medium">{region}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-black border border-neon-purple flex items-center justify-center mr-2">
              <Trophy className="text-neon-purple text-xs" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stage</p>
              <p className="font-medium">{stage}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="bg-neon-blue bg-opacity-10 hover:bg-opacity-20 text-neon-blue"
            onClick={() => onWatch && onWatch(id)}
          >
            <Tv className="h-4 w-4 mr-1" /> Watch
          </Button>
          <Button 
            variant="outline" 
            className="bg-neon-pink bg-opacity-10 hover:bg-opacity-20 text-neon-pink"
            onClick={() => onBrackets && onBrackets(id)}
          >
            <BarChart2 className="h-4 w-4 mr-1" /> Brackets
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
