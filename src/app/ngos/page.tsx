"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NGOCard from '@/components/cards/NGOCard';
import { Search, ArrowLeft } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { useTenants } from "@/api/hooks/useTenants";

const NGOsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedSort, setSelectedSort] = useState('Name (A-Z)');
  const [page, setPage] = useState(1);
  const pageSize = 9; // show 9 per page (3x3 grid)

  const { data: tenants = [], isLoading, isFetching } = useTenants({
    search: searchTerm,
    page,
    pageSize,
    enabled: true,
  });

  const locations = ['All Locations', 'Nairobi', 'Kisumu', 'Mombasa', 'Nakuru', 'Eldoret'];
  const sortOptions = ['Name (A-Z)', 'Name (Z-A)', 'Most Campaigns', 'Most Raised', 'Recently Joined'];

  // Transform Tenant data to match NGO interface for NGOCard
  const transformedNGOs = tenants.map(tenant => ({
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
  }));

  // Sort the transformed NGOs
  const sortedNGOs = [...transformedNGOs].sort((a, b) => {
    if (selectedSort === 'Name (A-Z)') return a.name.localeCompare(b.name);
    if (selectedSort === 'Name (Z-A)') return b.name.localeCompare(a.name);
    if (selectedSort === 'Most Campaigns') return b.totalCampaigns - a.totalCampaigns;
    if (selectedSort === 'Most Raised') return b.totalRaised - a.totalRaised;
    if (selectedSort === 'Recently Joined') return new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime();
    return 0;
  });

  return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="bg-white py-20 border-b">
            <div className="container mx-auto px-4 max-w-6xl text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-secondary leading-tight">
                  Verified NGOs in Kenya
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Discover and support trusted organizations making a real impact across Kenya.
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-primary/5 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-primary mb-2">150+</div>
                  <div className="text-gray-600">Verified Organizations</div>
                </div>
                <div className="bg-secondary/5 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-secondary mb-2">500+</div>
                  <div className="text-gray-600">Active Campaigns</div>
                </div>
                <div className="bg-green-500/5 p-6 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="bg-white border-b py-8 sticky top-0 z-20 shadow-sm">
            <div className="container mx-auto px-4 max-w-6xl space-y-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                  <Input
                      type="text"
                      placeholder="Search NGOs by name, description, or location..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1); // reset page
                      }}
                      className="pl-10 h-12 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20"
                  />
                </div>

                {/* Location */}
                <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setPage(1);
                    }}
                    className="px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-primary focus:ring-primary/20"
                >
                  {locations.map((location) => (
                      <option key={location} value={location}>
                          {location}
                      </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-primary focus:ring-primary/20"
                >
                  {sortOptions.map((option) => (
                      <option key={option} value={option}>
                          {option}
                      </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">
                  {isFetching ? "Loading..." : `${sortedNGOs.length} NGOs Found`}
                </div>
                <div className="text-sm text-gray-500">
                  Showing page {page} of results
                </div>
              </div>
            </div>
          </section>

          {/* NGOs Grid */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-6xl">
              {isLoading ? (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading NGOs...</h3>
                    <p className="text-gray-600">Please wait while we fetch the latest organizations</p>
                  </div>
              ) : sortedNGOs.length > 0 ? (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {sortedNGOs.map((ngo) => (
                          <NGOCard key={ngo.id} ngo={ngo} />
                      ))}
                    </div>

                    {/* Enhanced Pagination */}
                    <div className="flex justify-center items-center mt-16 gap-4">
                      <Button
                          variant="outline"
                          disabled={page === 1}
                          onClick={() => setPage((p) => p - 1)}
                          className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        ← Previous
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200">
                          Page {page}
                        </span>
                        <span className="text-sm text-gray-500">
                          of {Math.ceil(sortedNGOs.length / pageSize)}
                        </span>
                      </div>
                      
                      <Button
                          variant="outline"
                          disabled={sortedNGOs.length < pageSize}
                          onClick={() => setPage((p) => p + 1)}
                          className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Next →
                      </Button>
                    </div>
                  </>
              ) : (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">No NGOs found</h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                      We couldn&apos;t find any NGOs matching your current filters. Try adjusting your search criteria or location.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedLocation('All Locations');
                          setSelectedSort('Name (A-Z)');
                          setPage(1);
                        }}
                        className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Clear All Filters
                    </Button>
                  </div>
              )}
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
            <ArrowLeft className="h-6 w-6 transform rotate-90" />
          </button>
        </div>
      </PageLayout>
  );
};

export default NGOsPage;