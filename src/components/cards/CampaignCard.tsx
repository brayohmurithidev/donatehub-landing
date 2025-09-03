"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  status: "active" | "urgent" | "closed";
  goal_amount: string;
  current_amount: string;
  start_date: string;
  end_date: string;
  image_url: string | null;
  percent_funded: number;
  days_left: number;
  total_donors: number;
  tenant: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const progressPercentage = Math.min(campaign.percent_funded || 
    ((parseFloat(campaign.current_amount || '0') /
     parseFloat(campaign.goal_amount || '1')) * 100), 100);
  const isUrgent = campaign.status === "urgent";
  const daysLeft = campaign.days_left || 
    Math.ceil((new Date(campaign.end_date  || Date.now()).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isClosed = campaign.status === "closed" || daysLeft <= 0;

  const formatCurrency = (amount: string) =>
      new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
      }).format(parseFloat(amount));

  const getStatusBadge = () => {
    if (isClosed) {
      return (
          <Badge className="bg-green-500 text-white border-0 shadow-sm font-semibold px-3 py-1">
            ✓ Completed
          </Badge>
      );
    }
    if (isUrgent || campaign.days_left <= 3) {
      return (
          <Badge className="bg-red-500 text-white border-0 shadow-sm font-semibold px-3 py-1 animate-pulse">
            ⚡ Urgent
          </Badge>
      );
    }
    return (
        <Badge className="bg-secondary text-white border-0 shadow-sm font-semibold px-3 py-1">
          🔄 Active
        </Badge>
    );
  };

    return (
      <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden rounded-2xl">
        {/* Image section */}
        <div className="relative overflow-hidden">
          <Image
              src={
                  campaign.image_url  ||
                  "https://via.placeholder.com/400x200.png?text=Campaign+Image"
              }
              alt={campaign.title}
              width={400}
              height={192}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
              priority
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          {/* Status badges */}
          <div className="absolute top-4 left-4">{getStatusBadge()}</div>
          {daysLeft > 0 && !isClosed && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/95 backdrop-blur-sm border-0 text-gray-700 shadow-sm font-medium">
                  <Clock className="h-3 w-3 mr-1" />
                  {daysLeft} days left
                </Badge>
              </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <div className="space-y-5">
            {/* Title & NGO */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                {campaign.title}
              </h3>
              <div className="flex items-center gap-3">
                {campaign.tenant?.logo_url && (
                    <Image
                        src={campaign.tenant.logo_url}
                        alt={campaign.tenant.name || 'NGO Logo'}
                        width={24}
                        height={24}
                        className="rounded-full ring-2 ring-gray-100"
                    />
                )}
                <p className="text-sm font-medium text-gray-700">
                  {campaign.tenant?.name  || 'NGO Name'}
                </p>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {campaign.description}
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 font-medium">Progress</span>
                <span className="text-gray-500">
                  {progressPercentage.toFixed(0)}% funded
                </span>
              </div>
              
              {/* Progress bar with better styling */}
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                    className="bg-gradient-to-r from-secondary to-secondary-light h-3 rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              {/* Amount display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Raised</div>
                  <div className="font-bold text-lg text-primary">
                    {formatCurrency(campaign.current_amount  || '0')}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Goal</div>
                  <div className="font-bold text-lg text-gray-700">
                    {formatCurrency(campaign.goal_amount  || '0')}
                  </div>
                </div>
              </div>
            </div>

            {/* Donors & End Date */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                <Users className="h-4 w-4 mr-2 text-blue-600" />
                <span className="font-medium text-blue-700">{campaign.total_donors  || 0} donors</span>
              </div>
              {daysLeft > 0 && !isClosed && (
                  <div className="flex items-center bg-orange-50 px-3 py-2 rounded-lg">
                    <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                    <span className="font-medium text-orange-700">
                      {daysLeft <= 7 ? `${daysLeft} days left` : 'Ends soon'}
                    </span>
                  </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Actions */}
        <CardFooter className="p-6 pt-0">
          <div className="flex gap-3 w-full">
            <Link href={`/ngo/${campaign.tenant?.id  || '1'}`} className="flex-1">
              <Button
                  variant="outline"
                  className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium"
              >
                View NGO
              </Button>
            </Link>
            <Link href={`/donate/${campaign.id}`} className="flex-1">
              <Button
                  className={`w-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isUrgent
                          ? "bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-xl"
                          : "bg-secondary hover:bg-secondary-light text-white shadow-md hover:shadow-lg"
                  }`}
                  disabled={isClosed}
              >
                {isClosed
                    ? "Campaign Ended"
                    : isUrgent
                        ? "Donate Now!"
                        : "Donate"}
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
  );
};

export default CampaignCard;