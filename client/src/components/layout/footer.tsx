import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-dark py-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="font-orbitron text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              NEXUS<span className="text-white">ARENA</span>
            </span>
            <p className="mt-2 text-gray-400">
              The ultimate esports tournament platform for gamers of all skill levels.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-discord"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Tournaments</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tournaments">
                  <a className="text-gray-400 hover:text-primary transition-colors">Upcoming</a>
                </Link>
              </li>
              <li>
                <Link href="/tournaments">
                  <a className="text-gray-400 hover:text-primary transition-colors">Past Tournaments</a>
                </Link>
              </li>
              <li>
                <Link href="/tournaments">
                  <a className="text-gray-400 hover:text-primary transition-colors">Rules & Guidelines</a>
                </Link>
              </li>
              <li>
                <Link href="/tournaments">
                  <a className="text-gray-400 hover:text-primary transition-colors">Prize Pool Info</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register">
                  <a className="text-gray-400 hover:text-primary transition-colors">Sign Up</a>
                </Link>
              </li>
              <li>
                <Link href="/auth">
                  <a className="text-gray-400 hover:text-primary transition-colors">Login</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-400 hover:text-primary transition-colors">Dashboard</a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-400 hover:text-primary transition-colors">Profile Settings</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-primary transition-colors">Help Center</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-primary transition-colors">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-primary transition-colors">FAQs</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-primary transition-colors">Community Guidelines</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} NexusArena. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-primary text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-primary text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-primary text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
