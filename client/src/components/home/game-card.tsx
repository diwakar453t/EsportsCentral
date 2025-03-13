import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Game } from "@shared/schema";

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="game-card"
    >
      <Card className="rounded-xl overflow-hidden neon-border bg-surface h-full">
        <div className="h-48 overflow-hidden">
          <img 
            src={`${game.image}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500&q=80`} 
            alt={game.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-xl font-rajdhani text-white">{game.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-400">Active Players: {game.activePlayers.toLocaleString()}</span>
            <span className="text-sm font-medium text-secondary">{game.tournamentCount} Tournaments</span>
          </div>
          <div className="mt-4">
            <Link href={`/tournaments?gameId=${game.id}`}>
              <a className="block w-full py-2 bg-primary/20 hover:bg-primary/40 text-center text-white rounded transition-colors">
                View Tournaments
              </a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GameCard;
