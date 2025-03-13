import { Badge } from "@/components/ui/badge";
import { Users, Trophy } from "lucide-react";

export interface GameCardProps {
  id: number;
  name: string;
  description: string;
  image: string;
  tournamentCount: number;
  prizePool: string;
  onClick?: (id: number) => void;
}

export function GameCard({
  id,
  name,
  description,
  image,
  tournamentCount,
  prizePool,
  onClick
}: GameCardProps) {
  return (
    <div 
      className="relative group overflow-hidden rounded-lg card-hover cursor-pointer"
      onClick={() => onClick && onClick(id)}
    >
      <img 
        src={image} 
        alt={name} 
        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="font-rajdhani font-bold text-2xl">{name}</h3>
        <p className="text-gray-300 text-sm mb-2">{description}</p>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary bg-opacity-20 text-primary">
            <Users className="h-3 w-3 mr-1" /> {tournamentCount} Tournaments
          </Badge>
          <Badge variant="outline" className="bg-secondary bg-opacity-20 text-secondary">
            <Trophy className="h-3 w-3 mr-1" /> {prizePool} Prize Pool
          </Badge>
        </div>
      </div>
    </div>
  );
}
