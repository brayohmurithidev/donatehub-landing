"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, Heart } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="text-center border-0 shadow-large">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="text-6xl font-bold text-primary">404</div>
              <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
                             <p className="text-muted-foreground">
                 Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, 
                 deleted, or you entered the wrong URL.
               </p>
            </div>

            <div className="space-y-4">
              <Link href="/">
                <Button className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              
              <div className="grid grid-cols-2 gap-3">
                <Link href="/campaigns">
                  <Button variant="outline" className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Campaigns
                  </Button>
                </Link>
                <Link href="/ngos">
                  <Button variant="outline" className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    NGOs
                  </Button>
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Need help?{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact us
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundPage; 