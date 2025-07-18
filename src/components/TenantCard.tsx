import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

interface TenantCardProps {
  logo: string;
  name: string;
  description: string;
  campaignCount: number;
  onViewCampaigns?: () => void;
}

export const TenantCard: React.FC<TenantCardProps> = ({
  logo,
  name,
  description,
  campaignCount,
  onViewCampaigns,
}) => (
  <Card className="flex flex-col items-center p-4 gap-2 w-full max-w-xs shadow-md">
    <CardHeader className="flex flex-col items-center">
      <CardTitle className="text-lg font-semibold text-center">
          {name}
      </CardTitle>

    </CardHeader>
    <CardContent className="flex flex-col items-center">
      <p className="text-sm text-gray-600 text-center mb-2">{description}</p>
      <p className="text-xs text-gray-500 mb-4">{campaignCount} Campaign{campaignCount !== 1 ? 's' : ''}</p>
      {onViewCampaigns && (
        <Button variant="outline" onClick={onViewCampaigns} className="w-full">View Campaigns</Button>
      )}
    </CardContent>
  </Card>
); 