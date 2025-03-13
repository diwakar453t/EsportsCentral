import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Gamepad,
  Twitter,
  Instagram,
  Youtube,
  Headset,
  Send
} from "lucide-react";
import { FaDiscord } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-darker pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="mr-2 text-neon-purple text-3xl">
                <Gamepad />
              </div>
              <span className="font-orbitron font-bold text-2xl text-white">Nexus<span className="text-neon-purple">Arena</span></span>
            </div>
            <p className="text-gray-400 mb-4">
              The ultimate esports tournament platform for competitive gamers. Join tournaments, track stats, and win prizes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-dark flex items-center justify-center text-gray-400 hover:text-neon-purple transition">
                <Twitter size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-dark flex items-center justify-center text-gray-400 hover:text-neon-purple transition">
                <FaDiscord size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-dark flex items-center justify-center text-gray-400 hover:text-neon-purple transition">
                <Instagram size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-dark flex items-center justify-center text-gray-400 hover:text-neon-purple transition">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-rajdhani font-bold text-xl mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-400 hover:text-neon-blue transition">Home</Link></li>
              <li><Link href="/tournaments" className="text-gray-400 hover:text-neon-blue transition">Tournaments</Link></li>
              <li><Link href="/leaderboard" className="text-gray-400 hover:text-neon-blue transition">Leaderboard</Link></li>
              <li><Link href="/games" className="text-gray-400 hover:text-neon-blue transition">Game Titles</Link></li>
              <li><Link href="/profile" className="text-gray-400 hover:text-neon-blue transition">Profile</Link></li>
              <li><Link href="/auth" className="text-gray-400 hover:text-neon-blue transition">Login/Register</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-rajdhani font-bold text-xl mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-neon-blue transition">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-blue transition">Rules & Guidelines</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-blue transition">Anti-Cheat Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-blue transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-blue transition">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-neon-blue transition">Refund Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-rajdhani font-bold text-xl mb-6">Subscribe</h4>
            <p className="text-gray-400 mb-4">Get the latest news and tournament updates</p>
            <div className="flex mb-4">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-dark border-0 py-3 px-4 rounded-l-md w-full focus:ring-2 focus:ring-neon-purple focus:outline-none"
              />
              <Button type="submit" className="bg-neon-purple text-white py-3 px-4 rounded-r-md hover:bg-opacity-90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center bg-dark rounded-md px-4 py-3">
              <div className="mr-3 text-neon-blue">
                <Headset className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium">24/7 Support</p>
                <p className="text-xs text-gray-400">support@nexusarena.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2023 NexusArena. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
