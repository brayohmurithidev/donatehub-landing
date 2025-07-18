import React from "react";

export const AboutSection: React.FC = () => (
  <section className="w-full py-12 bg-white flex flex-col items-center text-center">
    <h2 className="text-3xl font-bold mb-4 text-green-800">About Us</h2>
    <p className="text-lg text-gray-700 max-w-2xl mb-6">
      DonateHub is dedicated to empowering NGOs and connecting them with donors who care. Our mission is to foster transparency, trust, and real impact by making it easy for anyone to support meaningful causes.
    </p>
    <div className="flex flex-col md:flex-row gap-8 justify-center">
      <div className="bg-green-50 rounded-lg p-6 shadow w-64">
        <h3 className="font-semibold text-green-700 mb-2">Transparency</h3>
        <p className="text-gray-600 text-sm">We ensure every donation reaches its intended cause, with clear reporting and updates.</p>
      </div>
      <div className="bg-green-50 rounded-lg p-6 shadow w-64">
        <h3 className="font-semibold text-green-700 mb-2">Community</h3>
        <p className="text-gray-600 text-sm">We build bridges between NGOs and donors, creating a supportive, engaged community.</p>
      </div>
      <div className="bg-green-50 rounded-lg p-6 shadow w-64">
        <h3 className="font-semibold text-green-700 mb-2">Impact</h3>
        <p className="text-gray-600 text-sm">We highlight real stories and measurable results, so you see the difference your support makes.</p>
      </div>
    </div>
  </section>
); 