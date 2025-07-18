import { Button } from "@/components/ui/button";
import React from "react";

export const HeroSection: React.FC = () => (
  <section className="w-full flex flex-col items-center justify-center py-16 bg-gradient-to-b from-green-50 to-white text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-green-800">Empower Change. Support NGOs. Make a Difference.</h1>
    <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
      DonateHub connects passionate donors with impactful NGOs and their campaigns. Join us in building a brighter, more equitable future for all.
    </p>
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">Join as an NGO</Button>
      <Button size="lg" variant="outline" className="border-green-600 text-green-700">Start a Campaign</Button>
      <Button size="lg" variant="secondary" className="bg-yellow-400 hover:bg-yellow-500 text-green-900">Support a Cause Today</Button>
    </div>
  </section>
); 