import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { 
  Menu,
  X,
  Gamepad,
  LogIn,
  UserPlus
} from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Navigation items
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/tournaments", label: "Tournaments" },
    { path: "/leaderboard", label: "Leaderboard" },
    { path: "/games", label: "Games" }
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-darker bg-opacity-80 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="mr-2 text-neon-purple text-3xl">
                <Gamepad />
              </div>
              <span className="font-orbitron font-bold text-2xl text-white">Nexus<span className="text-neon-purple">Arena</span></span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6 ml-10">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`font-rajdhani font-semibold ${location === item.path ? 'text-white' : 'text-gray-400'} hover:text-neon-purple transition`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Button variant="outline" className="border-neon-blue text-neon-blue hover:bg-neon-blue/10">
                    My Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-gray-400 hover:text-neon-purple"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <Button 
                    variant="outline" 
                    className="hidden md:flex items-center border-neon-blue text-neon-blue hover:bg-opacity-80"
                  >
                    <LogIn className="h-4 w-4 mr-2" /> Login
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button 
                    className="hidden md:flex items-center bg-neon-purple hover:bg-opacity-80 text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-2" /> Register
                  </Button>
                </Link>
              </>
            )}
            <button 
              className="md:hidden text-white text-xl"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-darker py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`font-rajdhani font-semibold ${location === item.path ? 'text-white' : 'text-gray-400'} hover:text-neon-purple transition py-2`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!user ? (
                <div className="flex flex-col space-y-3 pt-3 border-t border-gray-800">
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-neon-blue text-neon-blue"
                    >
                      <LogIn className="h-4 w-4 mr-2" /> Login
                    </Button>
                  </Link>
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-neon-purple text-white">
                      <UserPlus className="h-4 w-4 mr-2" /> Register
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 pt-3 border-t border-gray-800">
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-neon-blue text-neon-blue">
                      My Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-gray-400 hover:text-neon-purple"
                    onClick={() => {
                      logoutMutation.mutate();
                      setIsMenuOpen(false);
                    }}
                    disabled={logoutMutation.isPending}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
