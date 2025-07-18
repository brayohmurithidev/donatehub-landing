import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const HeaderSection: React.FC = () => (
  <header className="w-full bg-white shadow-sm sticky top-0 z-50">
    <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=48&h=48&facepad=2" alt="DonateHub Logo" className="w-10 h-10 rounded-full" />
        <span className="font-bold text-xl text-green-700">DonateHub</span>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <Link href="#about" className="hover:text-green-700 transition">About</Link>
        <Link href="#featured-ngos" className="hover:text-green-700 transition">NGOs</Link>
        <Link href="#featured-campaigns" className="hover:text-green-700 transition">Campaigns</Link>
        <Button asChild variant="outline" className="border-green-600 text-green-700">Register</Button>
        <Button asChild className="bg-green-600 text-white">Donate</Button>
      </div>
      {/* Mobile menu placeholder, can add hamburger menu here if needed */}
    </nav>
  </header>
); 