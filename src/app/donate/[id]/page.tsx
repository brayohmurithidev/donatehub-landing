"use client"

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import StripePaymentForm from '@/components/payment/StripePaymentForm';
import { donationAmounts } from '@/data/dummy';
import { 
  ArrowLeft, 
  Heart, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Smartphone,
  CheckCircle,
  AlertCircle,
  Users,
  Target,
  Globe,
  RefreshCw
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { useGetCampaignById } from "@/api/hooks/useCampaigns";
import { useCreateDonation, useProcessStripePayment, startPaymentStatusPolling, formatPhoneForMPESA } from "@/api/hooks/useDonation";
import API from "@/api/api";

const DonationPage = () => {
  const params = useParams();
  const campaignId = params.id as string;
  
  const [selectedAmount, setSelectedAmount] = useState<number | string>('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donationMessage, setDonationMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [isTrackingPayment, setIsTrackingPayment] = useState(false);
  const [currentDonationId, setCurrentDonationId] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [hasClearedHistory, setHasClearedHistory] = useState(false);

  // Fetch individual campaign from API
  const { data: campaign, isLoading, error } = useGetCampaignById(campaignId);
  
  // Donation hooks
  const createDonation = useCreateDonation();
  const processStripePayment = useProcessStripePayment();

  // LocalStorage utility functions
  const getStoredDonationId = (campaignId: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`donation_${campaignId}`);
    }
    return null;
  };

  const storeDonationId = (campaignId: string, donationId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`donation_${campaignId}`, donationId);
    }
  };

  const removeStoredDonationId = (campaignId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`donation_${campaignId}`);
    }
  };

  // Check for existing donation on component mount
  React.useEffect(() => {
    // Don't check for stored donations if user has manually cleared history
    if (hasClearedHistory) {
      return;
    }
    
    const storedDonationId = getStoredDonationId(campaignId);
    if (storedDonationId) {
      setCurrentDonationId(storedDonationId);
      setIsTrackingPayment(true);
      setShowPaymentForm(false);
      checkPaymentStatus(storedDonationId);
    }
  }, [campaignId, hasClearedHistory]);

  // Cleanup localStorage when payment is completed or user navigates away
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      // Clean up localStorage when user leaves the page
      if (paymentStatus === 'SUCCESS' || paymentStatus === 'PAID' || paymentStatus === 'FAILED') {
        removeStoredDonationId(campaignId);
      }
    };

    // Listen for page unload
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also cleanup when component unmounts
      if (paymentStatus === 'SUCCESS' || paymentStatus === 'PAID' || paymentStatus === 'FAILED') {
        removeStoredDonationId(campaignId);
      }
    };
  }, [campaignId, paymentStatus]);

  // Function to check payment status
  const checkPaymentStatus = async (donationId: string) => {
    try {
      const response = await API.get(`/donations/pay/${donationId}/status`);
      const { status, transaction_code } = response.data;
      
      console.log('Payment status update:', { status, transaction_code });
      setPaymentStatus(status);
      
      // If payment is completed or failed, stop tracking but keep in localStorage
      if (['SUCCESS', 'PAID', 'FAILED', 'COMPLETED'].includes(status)) {
        setIsTrackingPayment(false);
        
        if (status === 'SUCCESS' || status === 'PAID') {
          setDonationMessage({ 
            type: 'success', 
            message: `Payment completed successfully! Transaction: ${transaction_code || 'N/A'}. Thank you for your donation.` 
          });
        } else if (status === 'FAILED') {
          setDonationMessage({ type: 'error', message: 'Payment failed. Please try again.' });
        }
        
        // Update localStorage with final status but don't remove it yet
        // This allows users to see their payment history even after refresh
        // localStorage will be cleaned up when they navigate away from the page
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md mx-auto text-center border-0 shadow-soft">
            <CardContent className="p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-3xl font-bold mb-3 text-gray-800">Loading Campaign...</h2>
              <p className="text-gray-600 text-lg">
                Please wait while we fetch the campaign details.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }
  
  if (error) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md mx-auto text-center border-0 shadow-soft">
            <CardContent className="p-8">
              <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-3 text-gray-800">Error Loading Campaign</h2>
              <p className="text-gray-600 text-lg mb-6">
                We encountered an error while loading the campaign. Please try again.
              </p>
              <Link href="/campaigns">
                <Button className="bg-primary hover:bg-primary-light">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse Campaigns
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }
  
  if (!campaign) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md mx-auto text-center border-0 shadow-soft">
            <CardContent className="p-8">
              <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-3 text-gray-800">Campaign Not Found</h2>
              <p className="text-gray-600 text-lg mb-6">
                 The campaign you&apos;re looking for doesn&apos;t exist or has been removed.
               </p>
              <Link href="/campaigns">
                <Button className="bg-primary hover:bg-primary-light">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse Campaigns
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const progressPercentage = Math.min(
    ((parseFloat(campaign.current_amount || campaign.raisedAmount || '0') / 
      parseFloat(campaign.goal_amount || campaign.goalAmount || '1')) * 100), 100
  );
  const daysRemaining = Math.ceil(
    (new Date(campaign.end_date || campaign.endDate || Date.now()).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );


  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount('');
  };

  const getFinalAmount = () => {
    if (selectedAmount) return Number(selectedAmount);
    if (customAmount) return Number(customAmount);
    return 0;
  };

  const handleDonorInfoChange = (field: string, value: string) => {
    setDonorInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentSuccess = (paymentIntent: { id: string; amount: number; status: string; created: number }) => {
    console.log('Payment successful:', paymentIntent);
    // Handle successful payment
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    // Handle payment error
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (getFinalAmount() <= 0) {
      alert('Please select a donation amount');
      return;
    }

    if (!isAnonymous && (!donorInfo.name || !donorInfo.email)) {
      alert('Please provide your name and email, or select anonymous donation');
      return;
    }

    if (paymentMethod === 'mpesa' && !donorInfo.phone) {
      alert('Please provide your Safaricom phone number for M-Pesa payment');
      return;
    }

    try {
      // Create donation payload
      const donationPayload = {
        campaign_id: campaignId,
        tenant_id: campaign.tenant?.id || campaign.ngoId || '1',
        amount: getFinalAmount(),
        donor_name: isAnonymous ? null : donorInfo.name,
        donor_email: isAnonymous ? null : donorInfo.email,
        donor_phone: donorInfo.phone,
        message: donorInfo.message || null,
        method: paymentMethod === 'mpesa' ? 'MPESA' as const : 'CARD' as const,
        is_anonymous: isAnonymous
      };

      // Submit donation
      const result = await createDonation.mutateAsync(donationPayload);

      if (result.payment_status === 'initiated') {
        // M-Pesa payment initiated successfully
        setDonationMessage({ type: 'success', message: `M-Pesa payment initiated! ${result.message}` });
        
        // Store donation ID and start tracking
        if (result.donation_id) {
          setCurrentDonationId(result.donation_id);
          storeDonationId(campaignId, result.donation_id);
          setIsTrackingPayment(true);
          setShowPaymentForm(false);
          setPaymentStatus('PENDING');
          
          console.log('Payment initiated, donation ID stored:', result.donation_id);
          
          // Start periodic status checking
          const statusInterval = setInterval(async () => {
            const response = await API.get(`/donations/pay/${result.donation_id}/status`);
            const { status } = response.data;
            
            // Stop polling if payment is completed
            if (['SUCCESS', 'PAID', 'FAILED', 'COMPLETED'].includes(status)) {
              clearInterval(statusInterval);
              await checkPaymentStatus(result.donation_id);
            }
          }, 5000); // Check every 5 seconds
          
          // Clear interval after 10 minutes (120 checks) as fallback
          setTimeout(() => {
            clearInterval(statusInterval);
            if (isTrackingPayment) {
              setIsTrackingPayment(false);
              setShowPaymentForm(true);
            }
          }, 600000);
        }
        
        // Clear success message after 10 seconds
        setTimeout(() => setDonationMessage(null), 10000);
      } else if (result.requires_stripe_payment) {
        // For card payments, handle Stripe payment
        setDonationMessage({ type: 'success', message: 'Donation created! Please complete your card payment.' });
        // Clear message after 5 seconds
        setTimeout(() => setDonationMessage(null), 5000);
      }
    } catch (error: any) {
      console.error('Donation failed:', error);
      setDonationMessage({ type: 'error', message: error.response?.data?.detail || 'Donation failed. Please try again.' });
      // Clear error message after 5 seconds
      setTimeout(() => setDonationMessage(null), 5000);
    }
  };

  const getStatusBadge = () => {
    switch (campaign.status) {
      case 'urgent':
        return <Badge variant="destructive" className="animate-pulse">Urgent</Badge>;
      case 'closed':
        return <Badge variant="secondary" className="bg-success/10 text-success border-success/20">Completed</Badge>;
      default:
        return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Active</Badge>;
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Link href="/campaigns" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors duration-200 font-medium">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaigns
              </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Campaign Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 shadow-soft overflow-hidden">
                  <div className="relative">
                    <Image
                      src={campaign.image_url || campaign.image || '/hero-image.jpg'}
                      alt={campaign.title}
                      width={800}
                      height={400}
                      className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105"
                      priority
                    />
                    <div className="absolute top-4 left-4">
                      {getStatusBadge()}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">{campaign.title}</h1>
                        <p className="text-gray-600 text-xl leading-relaxed">{campaign.shortDescription || campaign.description}</p>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                        <Card className="text-center p-3 lg:p-4 bg-blue-50 border-blue-100 hover:shadow-md transition-shadow duration-200">
                          <CardContent className="p-0">
                            <div className="text-lg lg:text-xl xl:text-2xl font-bold text-primary mb-1 lg:mb-2 break-words">
                            {new Intl.NumberFormat('en-KE', {
                              style: 'currency',
                              currency: 'KES',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                                notation: 'compact',
                                compactDisplay: 'short'
                              }).format(parseFloat(campaign.current_amount || campaign.raisedAmount || '0'))}
                          </div>
                            <div className="text-xs lg:text-sm font-medium text-blue-700">Raised</div>
                          </CardContent>
                        </Card>
                        <Card className="text-center p-3 lg:p-4 bg-green-50 border-green-100 hover:shadow-md transition-shadow duration-200">
                          <CardContent className="p-0">
                            <div className="text-lg lg:text-xl xl:text-2xl font-bold text-green-700 mb-1 lg:mb-2 break-words">
                            {new Intl.NumberFormat('en-KE', {
                              style: 'currency',
                              currency: 'KES',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                                notation: 'compact',
                                compactDisplay: 'short'
                              }).format(parseFloat(campaign.goal_amount || campaign.goalAmount || '0'))}
                          </div>
                            <div className="text-xs lg:text-sm font-medium text-green-700">Goal</div>
                          </CardContent>
                        </Card>
                        <Card className="text-center p-3 lg:p-4 bg-purple-50 border-purple-100 hover:shadow-md transition-shadow duration-200">
                          <CardContent className="p-0">
                            <div className="text-lg lg:text-xl xl:text-2xl font-bold text-purple-700 mb-1 lg:mb-2 break-words">{campaign.total_donors || campaign.donorCount || 0}</div>
                            <div className="text-xs lg:text-sm font-medium text-purple-700">Donors</div>
                          </CardContent>
                        </Card>
                        <Card className="text-center p-3 lg:p-4 bg-orange-50 border-orange-100 hover:shadow-md transition-shadow duration-200">
                          <CardContent className="p-0">
                            <div className="text-lg lg:text-xl xl:text-2xl font-bold text-orange-700 mb-1 lg:mb-2 break-words">{daysRemaining}</div>
                            <div className="text-xs lg:text-sm font-medium text-orange-700">Days Left</div>
                          </CardContent>
                        </Card>
                        </div>

                      <div className="space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-700">Campaign Progress</span>
                          <span className="text-2xl font-bold text-primary">{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-4" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Raised: {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(parseFloat(campaign.current_amount || campaign.raisedAmount || '0'))}</span>
                          <span>Goal: {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(parseFloat(campaign.goal_amount || campaign.goalAmount || '0'))}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                            Ends {new Date(campaign.end_date || campaign.endDate || Date.now()).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-4 w-4" />
                            {campaign.location || 'Kenya'}
                          </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Campaign Description */}
                <Card className="border-0 shadow-soft">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                      <Target className="mr-3 h-6 w-6 text-primary" />
                      About This Campaign
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
                      <div dangerouslySetInnerHTML={{ __html: campaign.description }} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Donation Form */}
              <div className="space-y-6">
                {/* Donation Message Display */}
                {donationMessage && (
                  <div className={`p-4 rounded-lg border ${
                    donationMessage.type === 'success' 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center">
                      {donationMessage.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                      )}
                      <span className="font-medium">{donationMessage.message}</span>
                    </div>
                  </div>
                )}
                
                {/* Payment Status Tracking */}
                {isTrackingPayment && (
                  <Card className="border-0 shadow-soft bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="inline-flex items-center justify-center w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                          <span className="text-blue-800 font-medium">Tracking Payment Status</span>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${
                            paymentStatus === 'PAID' ? 'bg-green-100 text-green-800 border-green-200' :
                            paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800 border-red-200' :
                            'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {paymentStatus || 'PENDING'}
                        </Badge>
                      </div>
                      <p className="text-blue-600 text-sm mt-2">
                        Please check your phone for the M-Pesa prompt and complete the payment.
                      </p>
                      
                      {/* Manual Status Check Button */}
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-blue-700 border-blue-300 hover:bg-blue-100"
                          onClick={async () => {
                            try {
                              if (!currentDonationId) {
                                console.log('No donation ID available');
                                return;
                              }
                              
                              console.log('Checking status for donation:', currentDonationId);
                              
                              // Try the payment status endpoint first
                              try {
                                const response = await API.get(`/donations/pay/${currentDonationId}/status`);
                                console.log('Payment status response:', response.data);
                                setPaymentStatus(response.data.status);
                                
                                // If payment is completed, stop tracking
                                if (['PAID', 'FAILED', 'COMPLETED'].includes(response.data.status)) {
                                  setIsTrackingPayment(false);
                                }
                              } catch (statusError) {
                                console.log('Payment status endpoint failed, trying campaign donations:', statusError);
                                
                                // Fallback: check campaign donations to see if our donation is there
                                const donationsResponse = await API.get(`/donations/campaigns/${campaignId}`);
                                console.log('Campaign donations response:', donationsResponse.data);
                                
                                // Find our donation by phone number
                                const ourDonation = donationsResponse.data.find((d: any) => 
                                  d.donor_phone === donorInfo.phone || 
                                  d.donor_phone === formatPhoneForMPESA(donorInfo.phone)
                                );
                                
                                if (ourDonation) {
                                  console.log('Found our donation:', ourDonation);
                                  setPaymentStatus(ourDonation.status);
                                  setCurrentDonationId(ourDonation.id);
                                }
                              }
                            } catch (error) {
                              console.error('Manual status check failed:', error);
                            }
                          }}
                        >
                          Check Status Now
                        </Button>
                        
                        {/* Debug Info */}
                        <div className="mt-2 text-xs text-blue-600">
                          <div>Donation ID: {currentDonationId || 'None'}</div>
                          <div>Current Status: {paymentStatus || 'None'}</div>
                          <div>Tracking: {isTrackingPayment ? 'Yes' : 'No'}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Payment Form or Status Tracking */}
                {showPaymentForm ? (
                <Card className="border-0 shadow-soft sticky top-8">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                        <Heart className="mr-3 h-6 w-6 text-primary" />
                      Make a Donation
                    </CardTitle>
                      <p className="text-gray-600 mt-2">Support this cause and make a difference today</p>
                  </CardHeader>
                    <form onSubmit={handleFormSubmit}>
                      <CardContent className="space-y-8">
                    {/* Amount Selection */}
                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg font-semibold text-gray-700 mb-3 block">Select Amount</Label>
                        <div className="grid grid-cols-2 gap-4">
                        {donationAmounts.map((amount) => (
                          <Button
                            key={amount.value}
                            variant={selectedAmount === amount.value ? "default" : "outline"}
                            onClick={() => handleAmountSelect(amount.value)}
                              className={`h-14 text-lg font-semibold transition-all duration-200 ${
                                selectedAmount === amount.value 
                                  ? "bg-primary hover:bg-primary-light shadow-lg" 
                                  : "hover:bg-gray-50 hover:border-primary"
                              }`}
                          >
                            {amount.label}
                          </Button>
                        ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label htmlFor="customAmount" className="text-lg font-semibold text-gray-700">Or enter custom amount</Label>
                        <Input
                          id="customAmount"
                          type="number"
                          placeholder="Enter amount in KES"
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          className="h-14 text-lg border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    {/* Donor Information */}
                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg font-semibold text-gray-700 mb-3 block">Your Information</Label>
                        <p className="text-gray-600 text-sm mb-4">Choose whether to provide your details or remain anonymous</p>
                      </div>
                      
                      {/* Anonymous Toggle */}
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                        />
                        <Label htmlFor="anonymous" className="text-lg font-medium text-gray-700 cursor-pointer">
                          Make this donation anonymously
                        </Label>
                      </div>

                      {/* Conditional Donor Fields */}
                      {!isAnonymous && (
                    <div className="space-y-4">
                        <Input
                          placeholder="Full Name"
                          value={donorInfo.name}
                          onChange={(e) => handleDonorInfoChange('name', e.target.value)}
                            className="h-12 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <Input
                          type="email"
                          placeholder="Email Address"
                          value={donorInfo.email}
                          onChange={(e) => handleDonorInfoChange('email', e.target.value)}
                            className="h-12 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <Input
                          placeholder="Phone Number"
                          value={donorInfo.phone}
                          onChange={(e) => handleDonorInfoChange('phone', e.target.value)}
                            className="h-12 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <textarea
                          placeholder="Message (optional)"
                          value={donorInfo.message}
                          onChange={(e) => handleDonorInfoChange('message', e.target.value)}
                            className="w-full p-4 border-2 rounded-lg resize-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          rows={3}
                        />
                      </div>
                      )}

                      {/* Phone Number Required for M-Pesa */}
                      {paymentMethod === 'mpesa' && (
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold text-gray-700">Safaricom Phone Number *</Label>
                          <p className="text-gray-600 text-sm">Required for M-Pesa payment (e.g., 07XXXXXXXX)</p>
                          <Input
                            placeholder="Safaricom Phone Number"
                            value={donorInfo.phone}
                            onChange={(e) => handleDonorInfoChange('phone', e.target.value)}
                            className="h-12 border-2 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg font-semibold text-gray-700 mb-3 block">Payment Method</Label>
                        <p className="text-gray-600 text-sm mb-4">Choose your preferred payment method</p>
                      </div>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="space-y-4">
                          <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                            paymentMethod === 'mpesa' 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-primary'
                          }`}>
                            <RadioGroupItem value="mpesa" id="mpesa" className="text-primary" />
                            <Label htmlFor="mpesa" className="flex items-center text-lg font-medium text-gray-700 cursor-pointer">
                              <Smartphone className="mr-3 h-5 w-5 text-green-600" />
                            M-Pesa
                          </Label>
                        </div>
                          <div className={`flex items-center space-x-3 p-4 border-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                            paymentMethod === 'card' 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-primary'
                          }`}>
                            <RadioGroupItem value="card" id="card" className="text-primary" />
                            <Label htmlFor="card" className="flex items-center text-lg font-medium text-gray-700 cursor-pointer">
                              <CreditCard className="mr-3 h-5 w-5 text-blue-600" />
                            Credit/Debit Card
                          </Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {/* Stripe Form Fields for Card Payment */}
                      {paymentMethod === 'card' && (
                        <div className="space-y-6 p-6 bg-blue-50 rounded-xl border border-blue-100">
                          <div>
                            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                              <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                              Card Details
                            </h3>
                            <p className="text-blue-600 text-sm">Please provide your card information securely</p>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="cardNumber" className="text-sm font-medium text-blue-700">Card Number</Label>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                className="h-12 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiryDate" className="text-sm font-medium text-blue-700">Expiry Date</Label>
                                <Input
                                  id="expiryDate"
                                  placeholder="MM/YY"
                                  className="h-12 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvv" className="text-sm font-medium text-blue-700">CVV</Label>
                                <Input
                                  id="cvv"
                                  placeholder="123"
                                  className="h-12 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="cardholderName" className="text-sm font-medium text-blue-700">Cardholder Name</Label>
                              <Input
                                id="cardholderName"
                                placeholder="Name on card"
                                className="h-12 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Donation Summary */}
                    {getFinalAmount() > 0 && (
                      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 space-y-4">
                        <h3 className="text-lg font-semibold text-blue-800 flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5 text-blue-600" />
                          Donation Summary
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 font-medium">Donation Amount:</span>
                            <span className="text-xl font-bold text-primary">
                            {new Intl.NumberFormat('en-KE', {
                              style: 'currency',
                              currency: 'KES',
                            }).format(getFinalAmount())}
                          </span>
                        </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Processing Fee:</span>
                            <span className="text-gray-700 font-medium">KES 0</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Donor Status:</span>
                            <span className={`font-medium ${isAnonymous ? 'text-orange-600' : 'text-green-600'}`}>
                              {isAnonymous ? 'Anonymous' : 'Named Donor'}
                            </span>
                        </div>
                          <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                            <span className="text-lg font-semibold text-blue-800">Total:</span>
                            <span className="text-2xl font-bold text-blue-800">
                            {new Intl.NumberFormat('en-KE', {
                              style: 'currency',
                              currency: 'KES',
                            }).format(getFinalAmount())}
                          </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Form or M-Pesa Button */}
                    <div className="space-y-4">
                      {getFinalAmount() > 0 ? (
                        (isAnonymous || (donorInfo.name && donorInfo.email)) && 
                        (paymentMethod === 'mpesa' ? donorInfo.phone : true) ? (
                      <div className="space-y-4">
                        {paymentMethod === 'card' ? (
                            <Button 
                              type="submit" 
                              disabled={createDonation.isPending}
                              className="w-full h-14 bg-primary hover:bg-primary-light text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {createDonation.isPending ? (
                                <>
                                  <div className="inline-flex items-center justify-center w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CreditCard className="mr-3 h-5 w-5" />
                                  Pay with Card
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button 
                              type="submit" 
                              disabled={createDonation.isPending}
                              className="w-full h-14 bg-green-600 hover:bg-green-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {createDonation.isPending ? (
                                <>
                                  <div className="inline-flex items-center justify-center w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Smartphone className="mr-3 h-5 w-5" />
                                  Pay with M-Pesa
                                </>
                              )}
                            </Button>
                          )}
                          </div>
                        ) : (
                          <Button disabled className="w-full h-14 bg-gray-300 text-gray-500 text-lg font-semibold">
                            <CheckCircle className="mr-3 h-5 w-5" />
                            {!isAnonymous && (!donorInfo.name || !donorInfo.email) ? 'Complete donor information' :
                             paymentMethod === 'mpesa' && !donorInfo.phone ? 'Enter Safaricom phone number' :
                             'Complete form to donate'}
                          </Button>
                        )
                      ) : (
                        <Button disabled className="w-full h-14 bg-gray-300 text-gray-500 text-lg font-semibold">
                          <CheckCircle className="mr-3 h-5 w-5" />
                          Select a donation amount
                        </Button>
                      )}
                    </div>
                  </CardContent>
                    </form>
                  </Card>
                ) : (
                  /* Payment Status Tracking Card */
                  <Card className="border-0 shadow-soft sticky top-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader className="pb-6 text-center">
                      <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Heart className="w-10 h-10 text-blue-600" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-blue-800 mb-2">
                        Payment in Progress
                      </CardTitle>
                      <p className="text-blue-600 text-lg">Your M-Pesa payment is being processed</p>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Payment Status with Enhanced Styling */}
                      <div className="text-center p-8 bg-white rounded-2xl border-2 border-blue-200 shadow-lg">
                        {/* Animated Status Icon */}
                        <div className="mb-6">
                          {paymentStatus === 'SUCCESS' || paymentStatus === 'PAID' ? (
                            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                          ) : paymentStatus === 'FAILED' ? (
                            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                              <AlertCircle className="w-12 h-12 text-red-600" />
                            </div>
                          ) : (
                            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                        
                        {/* Status Text */}
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                          {paymentStatus === 'SUCCESS' || paymentStatus === 'PAID' ? 'Payment Successful!' :
                           paymentStatus === 'FAILED' ? 'Payment Failed' :
                           'Processing Payment...'}
                        </h3>
                        
                        <p className="text-gray-600 text-lg mb-6">
                          {paymentStatus === 'SUCCESS' || paymentStatus === 'PAID' ? 'Thank you for your donation!' :
                           paymentStatus === 'FAILED' ? 'Please try again or contact support' :
                           'Please check your phone for the M-Pesa prompt and complete the payment'}
                        </p>
                        
                        {/* Enhanced Status Badge */}
                        <Badge 
                          variant="secondary" 
                          className={`text-lg px-6 py-3 font-semibold ${
                            paymentStatus === 'SUCCESS' || paymentStatus === 'PAID' ? 'bg-green-100 text-green-800 border-green-300 shadow-md' :
                            paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800 border-red-300 shadow-md' :
                            'bg-blue-100 text-blue-800 border-blue-300 shadow-md animate-pulse'
                          }`}
                        >
                          {paymentStatus === 'SUCCESS' ? 'SUCCESS' :
                           paymentStatus === 'PAID' ? 'PAID' :
                           paymentStatus === 'FAILED' ? 'FAILED' :
                           paymentStatus || 'PENDING'}
                        </Badge>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="text-center space-y-4">
                        {paymentStatus !== 'SUCCESS' && paymentStatus !== 'PAID' && paymentStatus !== 'FAILED' && (
                          <Button 
                            onClick={() => checkPaymentStatus(currentDonationId)}
                            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <RefreshCw className="mr-2 h-5 w-5" />
                            Check Payment Status
                          </Button>
                        )}
                        
                        {(paymentStatus === 'SUCCESS' || paymentStatus === 'PAID') && (
                          <Button 
                            onClick={() => {
                              setShowPaymentForm(true);
                              setIsTrackingPayment(false);
                              removeStoredDonationId(campaignId);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            Make Another Donation
                          </Button>
                        )}
                        
                        {paymentStatus === 'FAILED' && (
                          <Button 
                            onClick={() => {
                              setShowPaymentForm(true);
                              setIsTrackingPayment(false);
                              removeStoredDonationId(campaignId);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            Try Again
                          </Button>
                        )}
                        
                        {/* Clear Payment History Button */}
                        {(paymentStatus === 'SUCCESS' || paymentStatus === 'PAID' || paymentStatus === 'FAILED') && (
                          <Button 
                            onClick={() => {
                              // Clear all payment tracking states
                              removeStoredDonationId(campaignId);
                              setIsTrackingPayment(false);
                              setCurrentDonationId('');
                              setPaymentStatus('');
                              setShowPaymentForm(true);
                              
                              // Clear any donation messages
                              setDonationMessage(null);
                              
                              // Set flag to prevent useEffect from re-checking localStorage
                              setHasClearedHistory(true);
                              
                              console.log('Payment history cleared, returning to donation form');
                            }}
                            variant="outline"
                            className="text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
                          >
                            Clear Payment History
                          </Button>
                        )}
                      </div>
                      
                      {/* Progress Indicator */}
                      {paymentStatus !== 'SUCCESS' && paymentStatus !== 'PAID' && paymentStatus !== 'FAILED' && (
                        <div className="bg-white rounded-xl p-6 border border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-blue-700 font-medium">Payment Progress</span>
                            <span className="text-blue-600 text-sm">Checking every 5 seconds...</span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Enhanced Debug Info */}
                      <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200 text-sm text-blue-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div><span className="font-semibold">Donation ID:</span> {currentDonationId}</div>
                          <div><span className="font-semibold">Status:</span> {paymentStatus || 'PENDING'}</div>
                          <div><span className="font-semibold">Campaign:</span> {campaignId}</div>
                        </div>
                      </div>
                  </CardContent>
                </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DonationPage; 