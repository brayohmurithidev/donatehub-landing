"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { TenantCard } from "@/components/TenantCard";
import api from "@/lib/axiosConfig.ts";

export const FeaturedNGOsSection: React.FC = () => {
  const { data: ngos = [], isLoading } = useQuery({
    queryKey: ["featured-ngos"],
    queryFn: async()=> {
      const res = await api.get('/tenants')
      console.log(res)
      return res.data
    },
  });

  return (
    <section className="w-full py-12 bg-green-50 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Featured NGOs</h2>
      {isLoading ? (
        <div className="text-gray-500">Loading NGOs...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {ngos.map((ngo: any) => (
            <TenantCard
              key={ngo.id}
              logo={ngo.logo}
              name={ngo.name}
              description={ngo.description}
              campaignCount={ngo.campaignCount}
              onViewCampaigns={() => {}}
            />
          ))}
        </div>
      )}
    </section>
  );
}; 