"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import CampaignCard from '@/components/cards/CampaignCard';
import { Search, Target, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { useCampaigns } from "@/api/hooks/useCampaigns";

const CampaignsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSort, setSelectedSort] = useState('Newest First');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Fetch campaigns from API
  const { data: campaigns = [], isLoading, isFetching } = useCampaigns();

  const categories = ['All Categories', 'Education', 'Healthcare', 'Environment', 'Emergency Relief', 'Social Welfare'];
  const sortOptions = ['Newest First', 'Oldest First', 'Most Funded', 'Least Funded', 'Ending Soon'];
  const filterOptions = ['All', 'Active', 'Urgent', 'Completed'];

  const filteredCampaigns = campaigns.filter((campaign: any) => {
    const matchesSearch = campaign.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || 
                           campaign.category === selectedCategory;
    const matchesFilter = selectedFilter === 'All' || 
                         (selectedFilter === 'Active' && campaign.status === 'active') ||
                         (selectedFilter === 'Urgent' && campaign.status === 'urgent') ||
                         (selectedFilter === 'Completed' && campaign.status === 'completed');
    
    return matchesSearch && matchesCategory && matchesFilter;
  });

  const totalRaised = campaigns.reduce((sum: number, campaign: any) => sum + parseFloat(campaign.current_amount || '0'), 0);
  const activeCampaigns = campaigns.filter((c: any) => c.status === 'active').length;
  const urgentCampaigns = campaigns.filter((c: any) => c.status === 'urgent').length;

  const stats = [
    { 
      label: 'Total Campaigns', 
      value: campaigns.length, 
      icon: Target 
    },
    { 
      label: 'Active', 
      value: activeCampaigns, 
      icon: Clock 
    },
    { 
      label: 'Urgent', 
      value: urgentCampaigns, 
      icon: AlertTriangle 
    },
    { 
      label: 'Funds Raised', 
      value: `Ksh ${(totalRaised / 1000000).toFixed(1)}M`, 
      icon: TrendingUp 
    },
  ];



  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold text-secondary leading-tight">
                    Active Campaigns
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Support causes that matter to you. Every donation brings us closer to creating positive change in communities across Kenya.
                  </p>
                </div>
                
                {/* Enhanced Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
                      <div className="bg-primary/5 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                        <stat.icon className="h-8 w-8 text-primary group-hover:text-primary-dark transition-colors duration-300" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors duration-300">{stat.value}</div>
                      <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="bg-white border-b py-8 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Search and Dropdowns Row */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                  <Input
                    type="text"
                    placeholder="Search campaigns, NGOs, or categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                {/* Dropdowns */}
                <div className="flex gap-3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-primary/20 bg-gray-50"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-primary/20 bg-gray-50"
                  >
                    {sortOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3">
                {filterOptions.map((option) => (
                  <Button
                    key={option}
                    variant={selectedFilter === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(option)}
                    className={`rounded-full transition-all duration-300 ${
                      selectedFilter === option 
                        ? 'bg-primary text-white hover:bg-primary-light shadow-lg' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-primary/30'
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">
                  {isLoading ? "Loading..." : `${filteredCampaigns.length} Campaigns Found`}
                </div>
                <div className="text-sm text-gray-500">
                  {isLoading ? "Fetching campaigns..." : "Showing all matching results"}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Campaigns Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {isLoading ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Campaigns...</h3>
                  <p className="text-gray-600">Please wait while we fetch the latest campaigns</p>
                </div>
              ) : filteredCampaigns.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCampaigns.map((campaign: any) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <Search className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">No campaigns found</h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {campaigns.length === 0 
                        ? "No campaigns are available at the moment. Please check back later."
                        : "We couldn't find any campaigns matching your current filters. Try adjusting your search terms or category selection."
                      }
                    </p>
                    {campaigns.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('All Categories');
                          setSelectedSort('Newest First');
                          setSelectedFilter('All');
                        }}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
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
            className="bg-primary hover:bg-primary-light text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
            aria-label="Scroll to top"
          >
            <Search className="h-6 w-6 transform rotate-90" />
          </button>
        </div>
      </PageLayout>
    );
  };

export default CampaignsPage; 