"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CampaignCard } from "@/components/CampaignCard";
import api from "@/lib/axiosConfig.ts";
import {useRouter} from "next/navigation";

export const FeaturedCampaignsSection: React.FC = () => {
  const router = useRouter();
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ["featured-campaigns"],
    queryFn: async()=> {
      const res = await api.get('/campaigns')
      console.log(res)
      return res.data
    },
  });

  return (
    <section className="w-full py-12 bg-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Featured Campaigns</h2>
      {isLoading ? (
        <div className="text-gray-500">Loading campaigns...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {campaigns.map((campaign: any) => (
            <CampaignCard
              key={campaign.id}
              image={campaign.image_url}
              title={campaign.title}
              description={campaign.description}
              goal={campaign.goal_amount}
              current={campaign.current_amount}
              percentFunded={campaign.percent_funded}
              daysLeft={campaign.days_left}
              totalDonors={campaign.total_donors}
              // onDonate={null}
              onDonate={() => router.push(`/campaigns/${campaign.id}/donate`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}; 