import React from "react";
import Link from "next/link";

export const FooterSection: React.FC = () => (
  <footer className="w-full py-8 bg-green-800 text-white flex flex-col items-center mt-12">
    <div className="flex flex-wrap gap-6 mb-4">
      <Link href="#contact" className="hover:underline">Contact</Link>
      <Link href="#terms" className="hover:underline">Terms</Link>
      <Link href="#register" className="hover:underline">Register</Link>
      <Link href="#donate" className="hover:underline">Donate</Link>
    </div>
    <div className="text-sm text-green-100">&copy; {new Date().getFullYear()} DonateHub. All rights reserved.</div>
  </footer>
); 