// Dummy data for NGOs
export const mockNGOs = [
  {
    id: 'ngo1',
    name: 'Hope Foundation',
    description: 'Empowering communities through education and healthcare.',
    logo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&w=128&h=128&facepad=2',
    campaignCount: 3,
  },
  {
    id: 'ngo2',
    name: 'Green Earth Initiative',
    description: 'Protecting the environment for future generations.',
    logo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=128&h=128&facepad=2',
    campaignCount: 2,
  },
  {
    id: 'ngo3',
    name: 'Bright Future',
    description: 'Supporting children in need with food and shelter.',
    logo: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=128&h=128&facepad=2',
    campaignCount: 4,
  },
];

// Dummy data for Campaigns
export const mockCampaigns = [
  {
    id: 'camp1',
    title: 'Clean Water for All',
    description: 'Help us provide clean water to remote villages.',
    goal: 10000,
    current: 6500,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    is_featured: true,
  },
  {
    id: 'camp2',
    title: 'Plant 10,000 Trees',
    description: 'Join us in our mission to reforest local areas.',
    goal: 5000,
    current: 3200,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    is_featured: true,
  },
  {
    id: 'camp3',
    title: 'School Supplies for Kids',
    description: 'Provide essential school supplies to underprivileged children.',
    goal: 3000,
    current: 1800,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    is_featured: false,
  },
];

export function fetchFeaturedNGOs() {
  return Promise.resolve(mockNGOs);
}

export function fetchFeaturedCampaigns() {
  return Promise.resolve(mockCampaigns.filter(c => c.is_featured));
} 