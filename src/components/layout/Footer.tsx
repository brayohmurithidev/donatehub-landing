"use client"

import Link from 'next/link';
import {Heart, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, XIcon} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className=" p-2.5 rounded-xl">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DonateKenya</span>
            </Link>
            <p className="text-sm text-gray-300">
              Connecting generous hearts with impactful causes across Kenya. Together, we&apos;re building stronger communities.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <XIcon className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/ngos" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Browse NGOs
              </Link>
              <Link href="/campaigns" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Active Campaigns
              </Link>
              <Link href="/about" className="block text-sm text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/register" className="block text-sm text-gray-300 hover:text-white transition-colors">
                How It Works
              </Link>
            </div>
          </div>

          {/* For NGOs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">For NGOs</h3>
            <div className="space-y-2">
              <Link href="/register" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Join Our Platform
              </Link>
              <Link href="/login" className="block text-sm text-gray-300 hover:text-white transition-colors">
                NGO Login
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Resources
              </Link>
              <Link href="#" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Support Center
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-300" />
                <span className="text-sm text-gray-300">info@donatekenya.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-300" />
                <span className="text-sm text-gray-300">+254 700 000000</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-300" />
                <span className="text-sm text-gray-300">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex justify-between items-center">
          <p className="text-sm text-gray-300">
            © 2024 DonateKenya. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 