import { motion } from "framer-motion";

const MissionSection = () => {
  return (
    <section className="bg-gradient-to-b from-dark to-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-secondary text-lg font-medium font-rajdhani mb-2">OUR MISSION</span>
          <h2 className="text-3xl md:text-4xl font-bold font-orbitron">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Building the Future of Esports</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            NexusArena is dedicated to providing a platform where gamers of all skill levels can compete, improve, and achieve greatness.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <motion.div 
            className="bg-dark/50 backdrop-blur-sm p-6 rounded-xl neon-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-secondary mb-4 text-4xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6h6a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H2"></path>
                <rect x="14" y="15" width="8" height="4" rx="1"></rect>
                <rect x="6" y="3" width="12" height="4" rx="1"></rect>
              </svg>
            </div>
            <h3 className="font-bold text-xl font-rajdhani text-white mb-2">Bringing Gamers Together</h3>
            <p className="text-gray-400">
              We create opportunities for players worldwide to connect, compete, and form lasting communities around their favorite games.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-dark/50 backdrop-blur-sm p-6 rounded-xl neon-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-secondary mb-4 text-4xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 21h8"></path>
                <path d="M12 17v4"></path>
                <path d="M17 13h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1"></path>
                <path d="M6 13H5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1"></path>
                <path d="M17 6V5a2 2 0 0 0-2-2h-1"></path>
                <path d="M8 3H7a2 2 0 0 0-2 2v1"></path>
                <path d="M12 13l-3-3 4-4 3 3 3-3 3 3-4 4 1 1 4-4c.707-.707.293-2.707-1-4s-3.293-1.707-4-1l-3 3-2-2a1 1 0 0 0-1.414 0L7 6.414a1 1 0 0 0 0 1.414L9.172 10"></path>
              </svg>
            </div>
            <h3 className="font-bold text-xl font-rajdhani text-white mb-2">Fostering Competition</h3>
            <p className="text-gray-400">
              Our tournaments are designed to challenge players at every level, from casual gamers to aspiring professionals.
            </p>
          </motion.div>
          
          <motion.div 
            className="bg-dark/50 backdrop-blur-sm p-6 rounded-xl neon-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-secondary mb-4 text-4xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 className="font-bold text-xl font-rajdhani text-white mb-2">Creating Legends</h3>
            <p className="text-gray-400">
              We provide the platform for players to showcase their skills, gain recognition, and rise to legendary status in the esports world.
            </p>
          </motion.div>
        </div>
        
        <div className="mt-16">
          <motion.div 
            className="bg-dark/50 backdrop-blur-sm rounded-xl p-6 neon-border"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-bold text-2xl font-rajdhani text-white mb-4">Game Titles We Support</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-surface/80 p-3 rounded-lg text-center">
                <img src="https://images.unsplash.com/photo-1579139273771-e3a458d80f56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80" alt="Valorant" className="w-12 h-12 rounded-md mx-auto mb-2 object-cover" />
                <div className="text-white text-sm font-medium">Valorant</div>
              </div>
              <div className="bg-surface/80 p-3 rounded-lg text-center">
                <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80" alt="CS:GO" className="w-12 h-12 rounded-md mx-auto mb-2 object-cover" />
                <div className="text-white text-sm font-medium">CS:GO</div>
              </div>
              <div className="bg-surface/80 p-3 rounded-lg text-center">
                <img src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80" alt="Fortnite" className="w-12 h-12 rounded-md mx-auto mb-2 object-cover" />
                <div className="text-white text-sm font-medium">Fortnite</div>
              </div>
              <div className="bg-surface/80 p-3 rounded-lg text-center">
                <img src="https://images.unsplash.com/photo-1619962305107-96a06628c7e1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80" alt="League of Legends" className="w-12 h-12 rounded-md mx-auto mb-2 object-cover" />
                <div className="text-white text-sm font-medium">League of Legends</div>
              </div>
              <div className="bg-surface/80 p-3 rounded-lg text-center">
                <img src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80" alt="DOTA 2" className="w-12 h-12 rounded-md mx-auto mb-2 object-cover" />
                <div className="text-white text-sm font-medium">DOTA 2</div>
              </div>
              <div className="bg-surface/80 p-3 rounded-lg text-center">
                <img src="https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80" alt="Overwatch" className="w-12 h-12 rounded-md mx-auto mb-2 object-cover" />
                <div className="text-white text-sm font-medium">Overwatch</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-16">
          <h3 className="font-bold text-2xl font-rajdhani text-white mb-8 text-center">Pro Player Testimonials</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="player-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Player Avatar" className="h-14 w-14 rounded-full object-cover border-2 border-primary" />
                <div className="ml-4">
                  <div className="font-medium text-white text-lg">Alex "NinjaWarrior" Chen</div>
                  <div className="text-secondary text-sm">Valorant Pro</div>
                </div>
              </div>
              <p className="text-gray-400">
                "NexusArena has been instrumental in my journey from amateur to pro. The platform's tournaments provided the visibility and experience I needed to get noticed by top teams."
              </p>
            </motion.div>
            
            <motion.div 
              className="player-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Player Avatar" className="h-14 w-14 rounded-full object-cover border-2 border-primary" />
                <div className="ml-4">
                  <div className="font-medium text-white text-lg">Sarah "PixelQueen" Johnson</div>
                  <div className="text-secondary text-sm">CS:GO Pro</div>
                </div>
              </div>
              <p className="text-gray-400">
                "The competition on NexusArena is always top-notch. I've met teammates, rivals, and friends here who have all helped me grow as a player and reach new heights in my career."
              </p>
            </motion.div>
            
            <motion.div 
              className="player-card p-6 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Player Avatar" className="h-14 w-14 rounded-full object-cover border-2 border-primary" />
                <div className="ml-4">
                  <div className="font-medium text-white text-lg">Min "ShadowStrike" Park</div>
                  <div className="text-secondary text-sm">League of Legends Pro</div>
                </div>
              </div>
              <p className="text-gray-400">
                "NexusArena tournaments provide the perfect balance of accessibility and challenge. Whether you're just starting out or aiming for the top, there's always a path forward here."
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
