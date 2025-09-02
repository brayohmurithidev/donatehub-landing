"use client"

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import CampaignCard from '@/components/cards/CampaignCard';
import {
  ArrowLeft,
  Heart,
  Calendar,
  MapPin,
  Search,
  Globe,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Target
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { useTenant } from "@/api/hooks/useTenants";
import { useGetNGOCampaigns } from "@/api/hooks/useCampaigns";

const NGODetailPage = () => {
  const params = useParams();
  const ngoId = params.id as string;

  const { data: tenant, isLoading } = useTenant(ngoId);
  const { data: campaigns, isLoading: loadingCampaigns } = useGetNGOCampaigns(ngoId);

  if (isLoading) return <div>Loading...</div>;

  if (!tenant) {
    return (
        <PageLayout>
          <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center">
            <Card className="max-w-md mx-auto text-center">
              <CardContent className="p-8">
                <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">NGO Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  The NGO you&apos;re looking for doesn&apos;t exist or has been removed.
                </p>
                <Link href="/ngos">
                  <Button>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Browse NGOs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </PageLayout>
    );
  }

  // Derive campaigns stats
  const activeCampaigns = (campaigns || []).filter((c: any) => c.status === "active").length;
  const completedCampaigns = (campaigns || []).filter((c: any) => c.status !== "active").length;

  const formatDate = (dateString: string) =>
      new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="bg-white py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <div className="mb-8">
                  <Link href="/ngos" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors duration-300 group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="font-medium">Back to NGOs</span>
                  </Link>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                  {/* NGO Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-start space-x-8">
                      <div className="relative">
                        <Image
                            src={tenant.logo_url || '/hope-foundation-logo.jpg'}
                            alt={`${tenant.name} logo`}
                            width={120}
                            height={120}
                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300"
                            priority
                        />
                        {tenant.is_Verified && (
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg">
                              <CheckCircle className="h-4 w-4" />
                            </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-5">
                        <div className="space-y-3">
                          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{tenant.name}</h1>
                          {tenant.location && (
                              <div className="flex items-center text-lg text-gray-600">
                                <MapPin className="mr-2 h-5 w-5 text-primary" />
                                <span className="font-medium">{tenant.location}</span>
                              </div>
                          )}
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">{tenant.description}</p>
                        
                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                          {tenant.email && (
                              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                <Mail className="mr-3 h-4 w-4 text-primary" />
                                <a href={`mailto:${tenant.email}`} className="text-primary hover:text-primary-dark font-medium">
                                  {tenant.email}
                                </a>
                              </div>
                          )}
                          {tenant.phone && (
                              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                <Phone className="mr-3 h-4 w-4 text-primary" />
                                <a href={`tel:${tenant.phone}`} className="text-primary hover:text-primary-dark font-medium">
                                  {tenant.phone}
                                </a>
                              </div>
                          )}
                          {tenant.website && (
                              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                <Globe className="mr-3 h-4 w-4 text-primary" />
                                <a href={tenant.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-dark font-medium flex items-center">
                                  Visit Website
                                  <ExternalLink className="ml-2 h-3 w-3" />
                                </a>
                              </div>
                          )}
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Calendar className="mr-3 h-4 w-4 text-primary" />
                            <span className="text-gray-700 font-medium">Joined recently</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impact Statistics Card */}
                  <div className="space-y-6">
                    <Card className="bg-white border-0 shadow-xl rounded-2xl overflow-hidden">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Impact Statistics</h3>
                          <p className="text-gray-600">Making a difference in communities</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 mb-8">
                          <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <div className="text-2xl font-bold text-blue-800 mb-1">{campaigns?.length || 0}</div>
                            <div className="text-sm text-blue-600 font-medium">Total Campaigns</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-xl">
                            <div className="text-2xl font-bold text-green-800 mb-1">{activeCampaigns}</div>
                            <div className="text-sm text-green-600 font-medium">Active Now</div>
                          </div>
                        </div>
                        
                        <Button className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                          <Heart className="mr-2 h-5 w-5" />
                          Support This NGO
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">About {tenant.name}</h2>
                  <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <p className="text-lg text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">{tenant.description}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Campaigns Section */}
          {campaigns && campaigns.length > 0 && (
              <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                  <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Campaigns by {tenant.name}</h2>
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover and support the impactful campaigns this organization is running</p>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                          <Input
                              type="text"
                              placeholder="Search campaigns..."
                              className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20"
                          />
                        </div>
                        <select className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-primary/20 bg-gray-50">
                          <option>All Categories</option>
                          <option>Education</option>
                          <option>Healthcare</option>
                          <option>Environment</option>
                          <option>Emergency Relief</option>
                          <option>Social Welfare</option>
                        </select>
                      </div>
                    </div>

                    {/* Campaign Status Tabs */}
                    <div className="flex justify-center space-x-2 mb-12">
                      <Button
                          variant="default"
                          size="lg"
                          className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-xl shadow-lg"
                      >
                        Active ({activeCampaigns})
                      </Button>
                      <Button
                          variant="outline"
                          size="lg"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-xl"
                      >
                        Completed ({completedCampaigns})
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {loadingCampaigns ? (
                        <>
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
                              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                            </div>
                          ))}
                        </>
                      ) : (
                        campaigns.map((campaign: any) => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </section>
          )}

          {/* Empty State for No Campaigns */}
          {campaigns && campaigns.length === 0 && (
              <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl mx-auto text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Target className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No Campaigns Yet</h3>
                    <p className="text-lg text-gray-600 mb-8">
                      This NGO hasn't launched any campaigns yet. Check back later or contact them directly to learn about upcoming initiatives.
                    </p>
                    <Button className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-xl">
                      Contact NGO
                    </Button>
                  </div>
                </div>
              </section>
          )}

        </div>
      </PageLayout>
  );
};

export default NGODetailPage;