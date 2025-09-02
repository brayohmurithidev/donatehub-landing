import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/api/api";

// Helper function to format phone number for MPESA
export const formatPhoneForMPESA = (phone: string): string => {
  if (!phone) return phone;
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 0, replace with 254 (Kenya country code)
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  
  // If it starts with +, remove it
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // If it doesn't start with 254, add it (assuming Kenya)
  if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  // Ensure it's exactly 12 digits (254 + 9 digits)
  if (cleaned.length === 12 && cleaned.startsWith('254')) {
    return cleaned;
  }
  
  // If it's 9 digits, add 254 prefix
  if (cleaned.length === 9) {
    return '254' + cleaned;
  }
  
  // If it's 10 digits and starts with 0, replace 0 with 254
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return '254' + cleaned.substring(1);
  }
  
  // Return as is if we can't determine the format
  return cleaned;
};

// Types for the donation request and response
export interface CreateDonationPayload {
  campaign_id: string;
  tenant_id: string;
  amount: number;
  donor_name?: string | null;
  donor_phone: string;
  donor_email?: string | null;
  message?: string | null;
  method: "MPESA" | "CARD";
  is_anonymous: boolean;
}

export interface DonationResponse {
  donation_id: string; // Add this line for the donation ID
  donation: {
    id: string;
    tenant_id: string;
    campaign_id: string;
    amount: number;
    donor_name?: string | null;
    donor_phone: string;
    donor_email?: string | null;
    message?: string | null;
    method: "MPESA" | "CARD";
    is_anonymous: boolean;
    status: string;
    payment_reference?: string;
    created_at: string;
  };
  payment_status: "initiated" | "pending" | "failed";
  payment_data?: any;
  message: string;
  requires_stripe_payment?: boolean;
}

export const useCreateDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDonationPayload): Promise<DonationResponse> => {
      // Format the payload to ensure proper phone number format for MPESA
      const formattedPayload = {
        ...payload,
        donor_phone: formatPhoneForMPESA(payload.donor_phone)
      };
      
      const response = await API.post('/donations/one-click', formattedPayload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch campaigns to update amounts
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaign_id] });
      
      // Invalidate tenant campaigns if we have tenant_id
      if (variables.tenant_id) {
        queryClient.invalidateQueries({ queryKey: ['tenant_campaigns', variables.tenant_id] });
      }
      
      console.log('Donation created successfully:', data);
    },
    onError: (error: any) => {
      console.error('Donation failed:', error);
      
      // You can add toast notifications here
      // toast.error(error.response?.data?.detail || 'Donation failed. Please try again.');
    }
  });
};

// Hook for getting donation status
export const useGetDonationStatus = (donationId: string) => {
  return useMutation({
    mutationFn: async (): Promise<any> => {
      const response = await API.get(`/donations/pay/${donationId}/status`);
      return response.data;
    }
  });
};

// Hook for getting payment status with polling
export const usePollPaymentStatus = (donationId: string, enabled: boolean = false) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (): Promise<any> => {
      const response = await API.get(`/donations/pay/${donationId}/status`);
      return response.data;
    },
    onSuccess: (data) => {
      // Update the donation in cache if status changes
      queryClient.setQueryData(['donation', donationId], (old: any) => {
        if (old) {
          return { ...old, status: data.status, transaction_id: data.transaction_code };
        }
        return old;
      });
    }
  });
};

// Hook for processing Stripe payment after donation creation
export const useProcessStripePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { donationId: string; paymentIntent: any }): Promise<any> => {
      const response = await API.post(`/donations/${payload.donationId}/stripe-payment`, {
        payment_intent: payload.paymentIntent
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate campaigns to refresh amounts
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      console.log('Stripe payment processed successfully:', data);
    },
    onError: (error: any) => {
      console.error('Stripe payment failed:', error);
    }
  });
};

// Utility function to start payment status polling
export const startPaymentStatusPolling = (
  donationId: string, 
  onStatusChange: (status: string) => void,
  interval: number = 5000
): NodeJS.Timeout => {
  const pollStatus = async () => {
    try {
      const response = await API.get(`/donations/pay/${donationId}/status`);
      const { status } = response.data;
      
      onStatusChange(status);
      
      // Stop polling if payment is completed or failed
      if (['PAID', 'FAILED', 'COMPLETED'].includes(status)) {
        clearInterval(pollingInterval);
      }
    } catch (error) {
      console.error('Error polling payment status:', error);
    }
  };
  
  // Start polling immediately
  pollStatus();
  
  // Set up interval for continuous polling
  const pollingInterval = setInterval(pollStatus, interval);
  
  return pollingInterval;
};
