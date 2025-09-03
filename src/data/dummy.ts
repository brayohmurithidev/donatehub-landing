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


export interface Campaign {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  tenant_id: string;
  ngoName: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  category: string;
  status: 'open' | 'closed' | 'urgent';
  startDate: string;
  endDate: string;
  image: string;
  slug: string;
  location: string;
}

export interface Donation {
  id: string;
  campaignId: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  paymentMethod: 'mpesa' | 'card';
  date: string;
  isAnonymous: boolean;
}

export const dummyNGOs: NGO[] = [
  {
    id: '1',
    slug: 'hope-foundation',
    name: 'Hope Foundation Kenya',
    logo: '/hope-foundation-logo.jpg',
    description: `<p>Hope Foundation Kenya has been at the forefront of community development for over 15 years. We focus on education, healthcare, and sustainable development programs that empower communities across Kenya.</p>
    
    <p>Our mission is to create lasting change by working directly with communities to identify their needs and implement solutions that promote self-reliance and growth.</p>
    
    <h3>Our Impact:</h3>
    <ul>
      <li>Built 25 schools in rural Kenya</li>
      <li>Provided clean water to 50,000 people</li>
      <li>Supported 10,000 children's education</li>
      <li>Established 15 health clinics</li>
    </ul>`,
    shortDescription: 'Empowering communities through education, healthcare, and sustainable development across Kenya.',
    email: 'info@hopefoundation.ke',
    phone: '+254 700 123456',
    website: 'https://hopefoundation.ke',
    location: 'Nairobi, Kenya',
    totalCampaigns: 12,
    totalRaised: 15000000,
    isVerified: true,
    dateJoined: '2019-03-15'
  },
  {
    id: '2',
    slug: 'green-earth-initiative',
    name: 'Green Earth Initiative',
    logo: '/green-earth-logo.jpg',
    description: `<p>Green Earth Initiative is dedicated to environmental conservation and climate action across East Africa. We work on reforestation, renewable energy, and environmental education programs.</p>
    
    <p>Founded in 2020, we've quickly become a leading voice in environmental advocacy and action in the region.</p>
    
    <h3>Key Programs:</h3>
    <ul>
      <li>Tree planting and forest restoration</li>
      <li>Solar energy installations in rural areas</li>
      <li>Environmental education in schools</li>
      <li>Climate change advocacy</li>
    </ul>`,
    shortDescription: 'Leading environmental conservation and climate action initiatives across East Africa.',
    email: 'contact@greenearth.org',
    phone: '+254 711 234567',
    website: 'https://greenearth.org',
    location: 'Kisumu, Kenya',
    totalCampaigns: 8,
    totalRaised: 8500000,
    isVerified: true,
    dateJoined: '2020-07-22'
  },
  {
    id: '3',
    slug: 'ubuntu-care',
    name: 'Ubuntu Care Foundation',
    logo: '/ubuntu-care-logo.jpg',
    description: `<p>Ubuntu Care Foundation focuses on elderly care and support for vulnerable populations in urban and rural Kenya. We believe in the Ubuntu philosophy - "I am because we are".</p>
    
    <p>Our programs include elderly care facilities, community support networks, and healthcare services for the most vulnerable members of our society.</p>`,
    shortDescription: 'Providing care and support for elderly and vulnerable populations across Kenya.',
    email: 'info@ubuntucare.ke',
    phone: '+254 722 345678',
    website: 'https://ubuntucare.ke',
    location: 'Mombasa, Kenya',
    totalCampaigns: 6,
    totalRaised: 4200000,
    isVerified: true,
    dateJoined: '2021-01-10'
  }
];


export const donationAmounts = [
  { label: '100 KES', value: 100 },
  { label: '500 KES', value: 500 },
  { label: '1,000 KES', value: 1000 },
  { label: '2,500 KES', value: 2500 },
  { label: '5,000 KES', value: 5000 },
  { label: '10,000 KES', value: 10000 }
];

export const categories = [
  'All Categories',
  'Education',
  'Healthcare',
  'Environment',
  'Emergency Relief',
  'Social Welfare',
  'Infrastructure'
]; 