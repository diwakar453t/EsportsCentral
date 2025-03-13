import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { COUNTDOWNS } from "@/lib/constants";

const CountdownWidget = () => {
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 18,
    minutes: 45,
    seconds: 30,
    tournamentName: "CS:GO CHAMPIONS LEAGUE"
  });

  const { data: tournaments } = useQuery({
    queryKey: ["/api/tournaments"],
    staleTime: 60000 // 1 minute
  });

  useEffect(() => {
    if (tournaments && tournaments.length > 0) {
      // Find the closest upcoming tournament
      const sortedTournaments = [...tournaments].sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      
      const upcomingTournament = sortedTournaments.find(
        t => new Date(t.startDate) > new Date()
      );
      
      if (upcomingTournament) {
        const tournamentDate = new Date(upcomingTournament.startDate);
        updateCountdown(tournamentDate, upcomingTournament.name);
      }
    }
  }, [tournaments]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown.days === 0 && countdown.hours === 0 && 
          countdown.minutes === 0 && countdown.seconds === 0) {
        clearInterval(timer);
      } else {
        updateRemainingTime();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const updateCountdown = (targetDate: Date, name: string) => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        tournamentName: name
      });
    }
  };

  const updateRemainingTime = () => {
    setCountdown(prev => {
      let { days, hours, minutes, seconds } = prev;
      
      if (seconds > 0) {
        seconds -= 1;
      } else {
        seconds = 59;
        if (minutes > 0) {
          minutes -= 1;
        } else {
          minutes = 59;
          if (hours > 0) {
            hours -= 1;
          } else {
            hours = 23;
            days = Math.max(0, days - 1);
          }
        }
      }
      
      return { ...prev, days, hours, minutes, seconds };
    });
  };

  // Function to format numbers with leading zero
  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <Card className="neon-border rounded-xl p-4 bg-dark/80 backdrop-blur-sm animate-float">
      <CardContent className="p-0">
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold font-rajdhani text-white mb-2">NEXT MAJOR TOURNAMENT</h3>
          <div className="text-secondary font-orbitron font-bold text-xl mb-2">
            {countdown.tournamentName}
          </div>
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex flex-col items-center">
              <div className="font-orbitron text-2xl font-bold text-white countdown-item px-4 py-2">
                {formatNumber(countdown.days)}
              </div>
              <div className="text-xs text-gray-400 mt-1">DAYS</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-orbitron text-2xl font-bold text-white countdown-item px-4 py-2">
                {formatNumber(countdown.hours)}
              </div>
              <div className="text-xs text-gray-400 mt-1">HOURS</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-orbitron text-2xl font-bold text-white countdown-item px-4 py-2">
                {formatNumber(countdown.minutes)}
              </div>
              <div className="text-xs text-gray-400 mt-1">MINS</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-orbitron text-2xl font-bold text-white countdown-item px-4 py-2">
                {formatNumber(countdown.seconds)}
              </div>
              <div className="text-xs text-gray-400 mt-1">SECS</div>
            </div>
          </div>
          <Link href="/register">
            <Button className="mt-4 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md text-sm font-medium transition-colors">
              Register Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownWidget;
