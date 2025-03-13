import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";
import { GAMES } from "@/lib/constants";

interface TournamentFilterProps {
  onFilterChange: (gameId?: number) => void;
  activeGameId?: number;
}

const TournamentFilter = ({ onFilterChange, activeGameId }: TournamentFilterProps) => {
  const [selectedGameId, setSelectedGameId] = useState<number | undefined>(activeGameId);

  const { data: games } = useQuery<Game[]>({
    queryKey: ["/api/games"],
    staleTime: 60000 // 1 minute
  });

  // Use placeholder data if loading
  const displayGames = games || GAMES;

  useEffect(() => {
    setSelectedGameId(activeGameId);
  }, [activeGameId]);

  const handleGameSelection = (gameId?: number) => {
    setSelectedGameId(gameId);
    onFilterChange(gameId);
  };

  return (
    <div className="flex justify-center mb-8 overflow-x-auto">
      <div className="flex space-x-2 bg-dark rounded-lg p-1">
        <button 
          className={`px-4 py-2 rounded-md text-white font-medium whitespace-nowrap ${selectedGameId === undefined ? 'tab-active' : 'text-gray-400 hover:text-white'}`}
          onClick={() => handleGameSelection(undefined)}
        >
          All Games
        </button>
        
        {displayGames.map(game => (
          <button 
            key={game.id}
            className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${selectedGameId === game.id ? 'tab-active text-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => handleGameSelection(game.id)}
          >
            {game.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TournamentFilter;
