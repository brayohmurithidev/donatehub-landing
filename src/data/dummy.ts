// Dummy data for the NGO donation platform

export interface NGO {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
  shortDescription: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  totalCampaigns: number;
  totalRaised: number;
  isVerified: boolean;
  dateJoined: string;
}









export const donationAmounts = [
  { label: '100 KES', value: 100 },
  { label: '500 KES', value: 500 },
  { label: '1,000 KES', value: 1000 },
  { label: '2,500 KES', value: 2500 },
  { label: '5,000 KES', value: 5000 },
  { label: '10,000 KES', value: 10000 }
];
