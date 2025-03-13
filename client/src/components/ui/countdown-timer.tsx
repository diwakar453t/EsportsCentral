import { useState, useEffect } from "react";

export interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

export function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    // Function to calculate time remaining
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Timer has expired
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) onComplete();
        return;
      }
      
      // Calculate remaining time
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    };
    
    // Calculate immediately and then start interval
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [targetDate, onComplete]);
  
  // Helper to format numbers with leading zero
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };
  
  return (
    <div className="flex space-x-4">
      <div className="bg-darker w-16 h-16 rounded-lg flex flex-col items-center justify-center">
        <span className="font-orbitron text-neon-blue text-2xl font-bold">{formatNumber(timeLeft.days)}</span>
        <span className="text-xs text-gray-400 mt-1">DAYS</span>
      </div>
      <div className="bg-darker w-16 h-16 rounded-lg flex flex-col items-center justify-center">
        <span className="font-orbitron text-neon-blue text-2xl font-bold">{formatNumber(timeLeft.hours)}</span>
        <span className="text-xs text-gray-400 mt-1">HOURS</span>
      </div>
      <div className="bg-darker w-16 h-16 rounded-lg flex flex-col items-center justify-center">
        <span className="font-orbitron text-neon-blue text-2xl font-bold">{formatNumber(timeLeft.minutes)}</span>
        <span className="text-xs text-gray-400 mt-1">MINS</span>
      </div>
      <div className="bg-darker w-16 h-16 rounded-lg flex flex-col items-center justify-center">
        <span className="font-orbitron text-neon-blue text-2xl font-bold">{formatNumber(timeLeft.seconds)}</span>
        <span className="text-xs text-gray-400 mt-1">SECS</span>
      </div>
    </div>
  );
}
