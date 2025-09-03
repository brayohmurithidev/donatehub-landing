"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {MapPin, CheckCircle, Calendar} from "lucide-react"
import { NGO } from "@/data/dummy"

interface NGOCardProps {
  ngo: NGO
}

const NGOCard = ({ ngo }: NGOCardProps) => {
  const formatCurrency = (amount: number) =>
      new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
      }).format(amount)

  const formatDate = (dateString: string) =>
      new Intl.DateTimeFormat("en-KE", {
        year: "numeric",
        month: "long",
      }).format(new Date(dateString))

  return (
      <Card className="group pt-0 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white border-0 shadow-lg rounded-2xl overflow-hidden">
        {/* Banner */}
        <div className="relative flex justify-center items-center h-24 bg-gradient-to-br from-secondary via-secondary-light to-secondary/80">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
          
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <Image
                src={ngo.logo}
                alt={`${ngo.name} logo`}
                width={80}
                height={80}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500"
                priority
            />
          </div>
          
          {ngo.isVerified && (
              <Badge
                  variant="secondary"
                  className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 text-white border-0 px-3 py-1 text-xs font-semibold rounded-full shadow-sm"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Verified
              </Badge>
          )}
        </div>

        <CardContent className="pt-16 px-6 flex flex-col items-center text-center">
          {/* Name + Badge */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 truncate">
              {ngo.name}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium">{ngo.location}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-6 line-clamp-2 leading-relaxed max-w-xs">
            {ngo.shortDescription}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl py-4 px-3 shadow-sm hover:shadow-md transition-shadow duration-300 group-hover:scale-105 transition-transform duration-300">
              <p className="text-xs text-blue-600 font-medium mb-1">Active Campaigns</p>
              <p className="text-lg font-bold text-blue-800">
                {ngo.totalCampaigns}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl py-4 px-3 shadow-sm hover:shadow-md transition-shadow duration-300 group-hover:scale-105 transition-transform duration-300">
              <p className="text-xs text-green-600 font-medium mb-1">Total Raised</p>
              <p className="text-lg font-bold text-green-800">
                {formatCurrency(ngo.totalRaised)}
              </p>
            </div>
          </div>

          {/* Join Date */}
          <div className="flex items-center justify-center text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
            <span className="font-medium">Joined {formatDate(ngo.dateJoined)}</span>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Link href={`/ngo/${ngo.id}`} className="w-full">
            <Button
                variant="default"
                className="w-full bg-primary text-white hover:bg-primary-light transition-all duration-300 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
            >
              View Profile
            </Button>
          </Link>
        </CardFooter>
      </Card>
  )
}

export default NGOCard