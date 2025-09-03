"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NGOCard from '@/components/cards/NGOCard';
import CampaignCard from '@/components/cards/CampaignCard';

import {
  Search,
  Heart,
  CreditCard,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  Star,
  Target
} from 'lucide-react';
import Image from 'next/image';
import PageLayout from '@/components/layout/PageLayout';
import {useCampaigns} from "@/api/hooks/useCampaigns";
import {useTenants} from "@/api/hooks/useTenants";
import { Campaign } from "@/types";

const Landing = () => {
  const {data: featuredCampaigns, isLoading: fetchingCampaigns } = useCampaigns()
  const {data: featuredTenants, isLoading: fetchingTenants} = useTenants()

  // Transform Tenant data to match NGO interface for NGOCard
  const transformedNGOs = featuredTenants?.map(tenant => ({
    id: tenant.id,
    slug: tenant.name.toLowerCase().replace(/\s+/g, '-'),
    name: tenant.name,
    logo: tenant.logo_url || '/hope-foundation-logo.jpg',
    description: tenant.description || 'Empowering communities through sustainable development.',
    shortDescription: tenant.description || 'Empowering communities through sustainable development.',
    email: tenant.email || 'info@example.org',
    phone: tenant.phone || '+254 700 000000',
    website: tenant.website || 'https://example.org',
    location: tenant.location || 'Kenya',
    totalCampaigns: 5, // Default value since API doesn't provide this
    totalRaised: 2500000, // Default value since API doesn't provide this
    isVerified: tenant.is_Verified,
    dateJoined: '2023-01-01' // Default value since API doesn't provide this
  })) || []

  const stats = [
    { label: 'Total Donations', value: 'KES 28M+', icon: TrendingUp },
    { label: 'Active NGOs', value: '150+', icon: Users },
    { label: 'Lives Impacted', value: '50K+', icon: Heart },
    { label: 'Success Rate', value: '98%', icon: Star },
  ];


  const steps = [
    {
      number: '01',
      title: 'Browse NGOs & Campaigns',
      description: 'Explore verified NGOs and their active campaigns. Filter by cause, location, or urgency.',
      icon: Search,
    },
    {
      number: '02',
      title: 'Choose Your Impact',
      description: 'Select a cause that resonates with you and decide how much you want to contribute.',
      icon: Heart,
    },
    {
      number: '03',
      title: 'Secure Donation',
      description: 'Complete your donation securely via M-Pesa or card payment. Get instant confirmation.',
      icon: CreditCard,
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/8 py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/8" />
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, var(--color-primary) 1px, transparent 1px),
                                radial-gradient(circle at 75% 75%, var(--color-secondary) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <Badge className="bg-green-100 text-primary border-green-200 px-3 py-1 text-sm font-medium animate-fade-in-up">
                    🇰🇪 Trusted by 150+ Kenyan NGOs
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up animation-delay-200">
                    Empower
                    <span className="bg-secondary bg-clip-text text-transparent"> Change</span>,
                    <br />
                    Transform Lives
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-2xl animate-fade-in-up animation-delay-400">
                    Connect with verified NGOs across Kenya and make a direct impact in your community.
                    Every donation counts, every story matters.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
                  <Link href="/campaigns">
                    <Button variant="hero" size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 group">
                      Start Donating
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Link>
                  <Link href="/ngos">
                    <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-gray-300 hover:border-gray-400 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
                      Explore NGOs
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 animate-fade-in-up animation-delay-800">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center group cursor-pointer transform hover:scale-105 transition-all duration-300">
                      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                        <stat.icon className="h-8 w-8 text-secondary mx-auto mb-2 group-hover:text-primary transition-colors duration-300" />
                        <div className="text-2xl font-bold text-gray-900 group-hover:text-secondary transition-colors duration-300">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative animate-fade-in-up animation-delay-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-green-200/40 to-blue-200/40 rounded-3xl blur-3xl transform rotate-6 animate-pulse" />
                <Image
                  src="/hero-image.jpg"
                  alt="Community impact in Kenya"
                  width={600}
                  height={500}
                  className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-gray-50 hover:bg-gray-100/50 transition-colors duration-500">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-6">
                  Building Stronger Communities Together
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  DonateHub is a trusted platform connecting generous hearts with impactful causes.
                  We work with verified NGOs to ensure your donations create real, measurable change
                  in communities across Kenya.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center p-8 border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="space-y-6">
                    <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                      <Shield className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Verified NGOs</h3>
                    <p className="text-gray-600">
                      All NGOs undergo thorough verification to ensure legitimacy and impact.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="space-y-6">
                    <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Transparent Impact</h3>
                    <p className="text-gray-600">
                      Track exactly how your donations are used with detailed progress reports.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center p-8 border-0 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="space-y-6">
                    <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                      <Heart className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Local Impact</h3>
                    <p className="text-gray-600">
                      Support causes in your community and see the direct impact of your generosity.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                How Donating Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Making a difference has never been easier. Follow these simple steps to start creating impact.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="relative group">
                  <Card className="h-full text-center p-8 border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
                    <CardContent className="space-y-6">
                      <div className="relative">
                        <div className="bg-secondary-light rounded-full p-6 w-20 h-20 flex items-center justify-center mx-auto group-hover:bg-secondary transition-colors duration-300">
                          <step.icon className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-primary text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center group-hover:bg-primary-light transition-colors duration-300">
                          {step.number}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-secondary transition-colors duration-300">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </CardContent>
                  </Card>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 group-hover:translate-x-1 transition-transform duration-300">
                      <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-secondary transition-colors duration-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured NGOs */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                Featured NGOs
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Discover verified organizations making real impact across Kenya
              </p>
              <Link href="/ngos">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 group">
                  View All NGOs
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fetchingTenants ? (
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
              ) : transformedNGOs.length > 0 ? (
                transformedNGOs.slice(0, 3).map((ngo) => (
                  <NGOCard key={ngo.id} ngo={ngo} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No NGOs available at the moment</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Campaigns */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                Urgent Campaigns
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                These campaigns need your support right now
              </p>
              <Link href="/campaigns">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 group">
                  View All Campaigns
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fetchingCampaigns ? (
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
              ) : featuredCampaigns && featuredCampaigns.length > 0 ? (
                featuredCampaigns.slice(0, 3).map((campaign: Campaign) => {
                  // Transform our Campaign type to match CampaignCard's expected interface
                  const transformedCampaign = {
                    id: campaign.id,
                    title: campaign.name,
                    description: campaign.description,
                    status: (campaign.status === 'completed' ? 'closed' : campaign.status === 'cancelled' ? 'closed' : 'active') as 'active' | 'closed' | 'urgent',
                    goal_amount: campaign.goal_amount,
                    current_amount: campaign.current_amount,
                    start_date: campaign.start_date,
                    end_date: campaign.end_date,
                    image_url: campaign.image_url,
                    percent_funded: campaign.percentage_funded || 0,
                    days_left: campaign.days_left || 0,
                    total_donors: campaign.total_donors || 0,
                    tenant: {
                      id: campaign.tenant.id,
                      name: campaign.tenant.name,
                      logo_url: campaign.tenant.logo_url
                    }
                  };
                  return <CampaignCard key={campaign.id} campaign={transformedCampaign} />;
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No campaigns available at the moment</p>
                </div>
              )}
            </div>
          </div>
        </section>

      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-primary hover:bg-primary-light text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
          aria-label="Scroll to top"
        >
          <ArrowRight className="h-6 w-6 transform rotate-[-90deg] group-hover:rotate-[-90deg] transition-transform duration-300" />
        </button>
      </div>
    </PageLayout>
  );
};

export default Landing;
