import MissionSection from "@/components/about/mission-section";
import ContactForm from "@/components/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect } from "react";

const AboutPage = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 px-4 bg-gradient-to-b from-dark to-surface">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-orbitron mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              About NexusArena
            </span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
            A futuristic neon-themed platform bringing gamers together, fostering competition, and creating legends.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <MissionSection />

      {/* FAQ Section */}
      <section className="bg-surface py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-orbitron">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Get answers to common questions about tournaments, gameplay, prizes, and more.
            </p>
          </div>

          <Card className="neon-border bg-dark/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b border-gray-800">
                  <AccordionTrigger className="text-white font-medium">How do I join a tournament?</AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Browse available tournaments, click "Register," and follow the steps. You must have a registered account to join tournaments.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-gray-800">
                  <AccordionTrigger className="text-white font-medium">How do payouts work?</AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Prizes are paid out via the platform's e-wallet system. You can withdraw your winnings to PayPal, bank account, or crypto wallet.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b border-gray-800">
                  <AccordionTrigger className="text-white font-medium">What anti-cheat systems do you use?</AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    We use a combination of automated systems and human moderators to ensure fair play in all tournaments.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-b border-gray-800">
                  <AccordionTrigger className="text-white font-medium">Can I create my own tournament?</AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    Yes, premium users can create custom tournaments with personalized rules, entry requirements, and prize pools.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-white font-medium">What games are supported?</AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    We currently support Valorant, CS:GO, Fortnite, League of Legends, DOTA 2, and Overwatch. We're continuously adding more games based on community feedback.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />
    </div>
  );
};

export default AboutPage;
