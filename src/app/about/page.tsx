"use client"

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Shield, 
  TrendingUp, 
  Users, 
  Target, 
  Star,
  ArrowRight,
  Globe,
  CheckCircle,
} from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: 'Transparency',
      description: 'We believe in complete transparency, NGO verification, and donation tracking to ensure every contribution makes a real difference.'
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'We build trust through rigorous verification and continuous monitoring of our partner organizations.'
    },
    {
      icon: Target,
      title: 'Impact',
      description: 'We focus on measurable impact and ensuring real change in communities across Kenya.'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'We make charitable giving accessible through simple, secure, and user-friendly processes.'
    }
  ];

  const team = [
    {
      name: 'Sarah Wanjiku',
      role: 'CEO & Co-Founder',
      image: '/sarah-wanjiku.jpg',
      bio: 'Former NGO director with 15+ years experience in community development across East Africa.'
    },
    {
      name: 'David Ochieng',
      role: 'CTO & Co-Founder',
      image: '/david-ochieng.jpg',
      bio: 'Tech entrepreneur passionate about using technology to solve social challenges.'
    },
    {
      name: 'Grace Muthoni',
      role: 'Head of NGO Relations',
      image: '/grace-muthoni.jpg',
      bio: 'Development expert with deep connections in the Kenyan NGO sector.'
    }
  ];

  const stats = [
    { label: 'Verified NGOs', value: '150+', icon: Users },
    { label: 'Total Donations', value: 'KES 28M+', icon: TrendingUp },
    { label: 'Lives Impacted', value: '50K+', icon: Heart },
    { label: 'Success Rate', value: '98%', icon: Star },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-secondary">
                  About DonateKenya
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We&apos;re on a mission to transform charitable giving in Kenya by connecting generous hearts with verified NGOs making real impact in our communities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className=" hover:bg-primary-light text-white">
                    Start Donating
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-secondary text-secondary-dark hover:bg-secondary-light hover:text-white">
                    Join as NGO
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl  font-bold text-secondary mb-6">
                      Our Mission
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      To create a transparent, trustworthy platform for Kenyans to support causes they care about and ensure measurable impact in communities across the country.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary mb-4">
                      Our Vision
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      A Kenya where everyone can contribute to positive change and NGOs have sustainable funding for education, healthcare, environment, and social welfare.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Users className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                  Our Impact in Numbers
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Together, we&apos;re creating meaningful change across Kenya.
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
                    <stat.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                  Our Core Values
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  The principles that guide everything we do.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {values.map((value, index) => (
                  <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-6 space-y-4">
                      <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto">
                        <value.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Journey */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                  Our Journey
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Key milestones in our mission to transform charitable giving.
                </p>
              </div>
              <div className="space-y-8">
                <div className="flex items-center space-x-6">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold p-1">
                    2022
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Platform Launch</h3>
                    <p className="text-gray-600">DonateKenya was founded with a mission to transform charitable giving in Kenya.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                    2023
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">50+ NGOs Onboarded</h3>
                    <p className="text-gray-600">Reached our first major milestone of verified partner organizations.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                    2023
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">KES 10M+ Raised</h3>
                    <p className="text-gray-600">Surpassed 10 million Kenyan Shillings in total donations facilitated.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                    2024
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">150+ NGOs & Growing</h3>
                    <p className="text-gray-600">Expanded to become Kenya&apos;s largest NGO donation platform.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                  Meet Our Team
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Passionate individuals working to create positive change.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {team.map((member, index) => (
                  <Card key={index} className="text-center border-0 shadow-sm bg-white">
                    <CardContent className="p-6 space-y-4">
                      <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto flex items-center justify-center">
                        <Users className="h-12 w-12 text-gray-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                      <Badge className="bg-blue-100 text-primary border-blue-200">
                        {member.role}
                      </Badge>
                      <p className="text-gray-600">{member.bio}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* NGO Verification */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
                  How We Verify NGOs
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our rigorous verification process ensures your donations go to legitimate organizations.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-4">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">01 Documentation Review</h3>
                  <p className="text-gray-600">Verifies legal registration, tax-exempt status, and organizational documents.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">02 Background Check</h3>
                  <p className="text-gray-600">Conducts background checks on leadership and financial history.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">03 Impact Assessment</h3>
                  <p className="text-gray-600">Reviews past projects, beneficiary testimonials, and impact reports.</p>
                </div>
                <div className="text-center space-y-4">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">04 Ongoing Monitoring</h3>
                  <p className="text-gray-600">Continuously monitors NGO activities and requires regular impact updates.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  );
};

export default AboutPage; 