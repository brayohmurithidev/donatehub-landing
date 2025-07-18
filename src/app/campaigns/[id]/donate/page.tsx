"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {useMutation, useQuery} from "@tanstack/react-query";
import api from "@/lib/axiosConfig.ts";
import {Loader2Icon} from "lucide-react";
import {Formik} from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    amount: Yup.number()
        .typeError("Amount must be a number")
        .required("Please enter an amount")
        .min(1, "Amount must be at least $1"),
});

export default function DonatePage({ params }: { params: { id: string } }) {
    const campaignId = params.id;
    const [amount, setAmount] = useState<number | null>(null);
    const router = useRouter();

    const initialValues: {amount:number | null} = {
        amount: null
    }

    const {data: campaign} = useQuery({
        queryKey: [`campaign-${campaignId}`],
        queryFn: async()=> {
            const res = await  api.get(`/campaigns/${campaignId}`);
            return res.data
        }
    })

    const quickAmounts = [5, 10, 20, 50, 100];


    // HANDLE DONATE
    const {mutate, isPending} = useMutation({
        mutationFn: async(data) => {
            const res = await api.post('/donations/checkout', data)
            return res.data
        },
        onSuccess: async (data) => {
            console.log(data);
            if(data?.checkout_url) window.location.href = data?.checkout_url;
        }
    })


    // const handleDonate = async () => {
    //     if (!amount || amount < 1) return alert("Enter a valid donation amount");
    //     mutate({campaign_id: campaignId, amount})
    // };

    if (!campaign) return <p className="text-center py-10">Loading campaign...</p>;

    const percent = Math.min(100, Math.round((campaign.current_amount / campaign.goal_amount) * 100));
    const daysLeft = campaign.end_date ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

    return (
        <div className="min-h-screen p-6 flex flex-col items-center justify-start">
            <Card className="max-w-xl w-full">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl">{campaign.title}</CardTitle>
                    <p className="text-gray-600">
                        by{" "}
                        <span className="font-medium text-primary">
      {campaign.tenant?.name}
    </span>
                    </p>
                    {campaign.tenant?.website && (
                        <a
                            href={campaign.tenant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Visit organization website
                        </a>
                    )}
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {campaign.image_url && (
                        <Image src={campaign.image_url} alt="Campaign Image" width={600} height={320} className="rounded w-full object-cover" />
                    )}
                    <p>{campaign.description}</p>

                    <div className="text-sm text-gray-500">
                        <p>🎯 Goal: ${campaign.goal_amount.toLocaleString()}</p>
                        <p>💸 Raised: ${campaign.current_amount.toLocaleString()} ({percent}%)</p>
                        <p>⏳ Days left: {daysLeft}</p>
                    </div>



                    {/* ✍️ Custom Input */}
                    <Formik initialValues={initialValues} onSubmit={(values)=>mutate({campaign_id: campaignId, amount: values.amount})} validationSchema={validationSchema} >
                        {({values: {amount}, setFieldValue, errors, handleSubmit, handleBlur, touched})=> (
                            <form onSubmit={handleSubmit}>
                                {/* 💰 Quick Amounts */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {quickAmounts.map((val) => (
                                        <Button key={val} variant={amount === val ? "default" : "outline"} onClick={() => setFieldValue("amount", val)}>
                                            ${val}
                                        </Button>
                                    ))}
                                </div>
                                <Input
                                    type="number"
                                    placeholder="Or enter custom amount"
                                    value={amount ?? ""}
                                    onChange={(e) => setFieldValue("amount", Number(e.target.value))}
                                    className="mt-2"
                                    onBlur={handleBlur("amount")}
                                />
                                {errors.amount && touched.amount && <p className="text-sm text-red-500">{errors.amount}</p>}

                                <Button type="submit" className="w-full mt-4" disabled={isPending}>
                                    {isPending && <Loader2Icon className="animate-spin" />}
                                    Donate Now
                                </Button>
                            </form>
                        )}
                    </Formik>

                </CardContent>
            </Card>
        </div>
    );
}