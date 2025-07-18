import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

interface CampaignCardProps {
  image: string;
  title: string;
  description: string;
  goal: number;
  current: number;
  percentFunded?: number;
  daysLeft?: number;
  totalDonors?: number;
  onDonate?: () => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
                                                            image,
                                                            title,
                                                            description,
                                                            goal,
                                                            current,
                                                            percentFunded,
                                                            daysLeft,
                                                            totalDonors,
                                                            onDonate,
                                                          }) => {
  const percent = percentFunded ?? Math.min(100, Math.round((current / goal) * 100));

  return (
      <Card className="flex flex-col p-4 gap-4 w-full max-w-sm shadow-md rounded-2xl">
        <CardHeader className="flex flex-col items-center gap-2 p-0">
          <Image
              src={image}
              alt={title}
              width={320}
              height={180}
              className="rounded-lg object-cover w-full h-[180px]"
          />
          <CardTitle className="text-lg font-bold text-center">{title}</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-gray-600 text-center">{description}</p>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${current.toLocaleString()} raised</span>
              <span>${goal.toLocaleString()} goal</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span className="font-medium">{percent}% funded</span>
            {typeof daysLeft === "number" && <span>{daysLeft} days left</span>}
            {typeof totalDonors === "number" && <span>{totalDonors} donors</span>}
          </div>

          {onDonate && (
              <Button onClick={onDonate} className="w-full mt-2 cursor-pointer">
                Donate
              </Button>
          )}
        </CardContent>
      </Card>
  );
};