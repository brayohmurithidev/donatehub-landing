import { HeaderSection } from "@/sections/HeaderSection";
import { HeroSection } from "@/sections/HeroSection";
import { AboutSection } from "@/sections/AboutSection";
import { FeaturedNGOsSection } from "@/sections/FeaturedNGOsSection";
import { FeaturedCampaignsSection } from "@/sections/FeaturedCampaignsSection";
import { FooterSection } from "@/sections/FooterSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col">
      <HeaderSection />
      <HeroSection />
      <AboutSection />
      <FeaturedNGOsSection />
      <FeaturedCampaignsSection />
      <FooterSection />
    </main>
  );
}