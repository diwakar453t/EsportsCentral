import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import LiveTournamentWidget from "./live-tournament-widget";
import LeaderboardWidget from "./leaderboard-widget";
import CountdownWidget from "./countdown-widget";
import { useAuth } from "@/hooks/use-auth";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="min-h-screen flex items-center relative">
      <div className="absolute inset-0 z-0 hero-overlay bg-fixed" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(18,18,18,0.9)), url(https://images.unsplash.com/photo-1542751371-adc38448a05e)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div 
            className="flex flex-col justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-secondary text-lg md:text-xl font-medium font-rajdhani mb-2">WELCOME TO THE ARENA</span>
            <h1 className="text-4xl md:text-6xl font-bold font-orbitron leading-tight">
              Dominate the <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Competition</span>
            </h1>
            <p className="mt-4 text-gray-300 text-lg max-w-lg">
              Join thousands of gamers in competitive tournaments, climb the ranks, and win incredible prizes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {user ? (
                <>
                  <Link href="/tournaments">
                    <Button className="px-6 py-6 bg-primary hover:bg-primary/80 shadow-lg shadow-primary/30 hover:shadow-primary/50 font-rajdhani">
                      Browse Tournaments <span className="ml-2">→</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button variant="outline" className="px-6 py-6 border-primary hover:bg-primary/20 font-rajdhani">
                      My Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register">
                    <Button className="px-6 py-6 bg-primary hover:bg-primary/80 shadow-lg shadow-primary/30 hover:shadow-primary/50 font-rajdhani">
                      Join Now & Compete <span className="ml-2">→</span>
                    </Button>
                  </Link>
                  <Link href="/tournaments">
                    <Button variant="outline" className="px-6 py-6 border-primary hover:bg-primary/20 font-rajdhani">
                      Browse Tournaments
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LiveTournamentWidget />
            <LeaderboardWidget />
            <CountdownWidget />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
