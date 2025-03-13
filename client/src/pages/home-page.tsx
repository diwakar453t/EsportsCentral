import HeroSection from "@/components/home/hero-section";
import FeaturedGames from "@/components/home/featured-games";
import UpcomingTournaments from "@/components/upcoming-tournaments";
import ContactForm from "@/components/contact-form";
import { useEffect } from "react";

const HomePage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedGames />
      <UpcomingTournaments />
      <ContactForm />
    </div>
  );
};

export default HomePage;
