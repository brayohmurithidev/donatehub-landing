"use client"

import Header from './Header';
import Footer from './Footer';
import CTASection from "@/components/layout/CTA";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
        <CTASection/>
      <Footer />
    </div>
  );
};

export default PageLayout; 