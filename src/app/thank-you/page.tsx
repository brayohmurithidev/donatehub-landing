'use client'

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import axios from "axios"
import api from "@/lib/axiosConfig.ts";
import {useQuery} from "@tanstack/react-query";

export default function ThankYouPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const sessionId = searchParams.get("session_id")

    // const [loading, setLoading] = useState(true)
    // const [donationInfo, setDonationInfo] = useState<null | {
    //     amount: number
    //     campaignTitle: string
    // }>(null)

    const {data: donationInfo, isLoading:loading} = useQuery({
        queryKey: ["donation_details", sessionId],
        queryFn: async(data) => {
            const res = await api.get(`/stripe/session?session_id=${sessionId}`)
            return res.data
        },
        enabled: !!sessionId
    })

    // useEffect(() => {
    //     const fetchSessionDetails = async () => {
    //         if (!sessionId) return
    //
    //         try {
    //             const res = await api.get(`/stripe/session?session_id=${sessionId}`)
    //             const { amount_total, metadata } = res.data
    //
    //             setDonationInfo({
    //                 amount: (amount_total / 100), // Stripe uses cents
    //                 campaignTitle: metadata?.campaign_title || "the campaign"
    //             })
    //         } catch (error) {
    //             console.error("Failed to fetch session details", error)
    //         } finally {
    //             setLoading(false)
    //         }
    //     }
    //
    //     fetchSessionDetails()
    // }, [sessionId])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            <CheckCircleIcon className="text-green-500 w-16 h-16 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Thank you for your donation! 🎉</h1>

            {loading ? (
                <p>Loading donation details...</p>
            ) : (
                donationInfo && (
                    <p className="text-center text-muted-foreground mb-4">
                        You just donated <strong>${donationInfo.amount_total.toFixed(2)}</strong> to <strong>{donationInfo.campaignTitle}</strong>.
                    </p>
                )
            )}

            <div className="flex gap-4 mt-6">
                <Button onClick={() => router.push("/")}>Back Home</Button>
                <Button variant="outline" onClick={() => router.push("/campaigns")}>
                    Browse More Campaigns
                </Button>
            </div>
        </div>
    )
}