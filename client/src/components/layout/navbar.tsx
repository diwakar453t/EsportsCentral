import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-dark/95 shadow-lg" : "bg-dark/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-orbitron text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                NEXUS<span className="text-white">ARENA</span>
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/">
                <a className={`text-sm font-rajdhani font-medium px-3 py-2 transition-colors ${location === "/" ? "text-white" : "text-gray-300 hover:text-secondary"}`}>
                  HOME
                </a>
              </Link>
              <Link href="/about">
                <a className={`text-sm font-rajdhani font-medium px-3 py-2 transition-colors ${location === "/about" ? "text-white" : "text-gray-300 hover:text-secondary"}`}>
                  ABOUT
                </a>
              </Link>
              <Link href="/games">
                <a className={`text-sm font-rajdhani font-medium px-3 py-2 transition-colors ${location === "/games" ? "text-white" : "text-gray-300 hover:text-secondary"}`}>
                  GAMES
                </a>
              </Link>
              <Link href="/tournaments">
                <a className={`text-sm font-rajdhani font-medium px-3 py-2 transition-colors ${location === "/tournaments" ? "text-white" : "text-gray-300 hover:text-secondary"}`}>
                  TOURNAMENTS
                </a>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex border-primary hover:bg-primary/20"
                  >
                    DASHBOARD
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="default"
                  className="hidden md:inline-flex bg-primary hover:bg-primary/80"
                >
                  LOGOUT
                </Button>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button
                    variant="default"
                    className="hidden md:inline-flex bg-primary hover:bg-primary/80"
                  >
                    REGISTER
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex border-primary hover:bg-primary/20"
                  >
                    LOGIN
                  </Button>
                </Link>
              </>
            )}
            <button
              onClick={toggleNav}
              className="md:hidden text-gray-200 hover:text-white focus:outline-none"
            >
              {isNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isNavOpen && (
        <div className="md:hidden bg-dark border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" onClick={closeNav}>
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/" ? "text-white bg-primary/20" : "text-gray-300 hover:text-white hover:bg-primary/20"}`}>
                Home
              </a>
            </Link>
            <Link href="/about" onClick={closeNav}>
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/about" ? "text-white bg-primary/20" : "text-gray-300 hover:text-white hover:bg-primary/20"}`}>
                About
              </a>
            </Link>
            <Link href="/games" onClick={closeNav}>
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/games" ? "text-white bg-primary/20" : "text-gray-300 hover:text-white hover:bg-primary/20"}`}>
                Games
              </a>
            </Link>
            <Link href="/tournaments" onClick={closeNav}>
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${location === "/tournaments" ? "text-white bg-primary/20" : "text-gray-300 hover:text-white hover:bg-primary/20"}`}>
                Tournaments
              </a>
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-800">
              <div className="flex items-center px-3">
                {user ? (
                  <>
                    <Link href="/dashboard" onClick={closeNav}>
                      <a className="flex-1 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/80 mr-2">
                        Dashboard
                      </a>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeNav();
                      }}
                      className="flex-1 px-4 py-2 border border-primary text-base font-medium rounded-md text-white hover:bg-primary/20"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/register" onClick={closeNav}>
                      <a className="flex-1 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/80 mr-2">
                        Register
                      </a>
                    </Link>
                    <Link href="/auth" onClick={closeNav}>
                      <a className="flex-1 px-4 py-2 border border-primary text-base font-medium rounded-md text-white hover:bg-primary/20">
                        Login
                      </a>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
