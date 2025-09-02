import {useQuery} from "@tanstack/react-query";
import API from "@/api/api";

export const useCampaigns = () => {
    return  useQuery({
        queryKey: ['campaigns'],
        queryFn: async() => {
            const res = await API.get('/campaigns')
            return res.data;
        }
    })
}


export const useGetNGOCampaigns = (id: string) => {
    return useQuery({
        queryKey: ['tenant_campaigns', id],
        queryFn: async() => {
            const res = await API.get(`/tenants/${id}/campaigns`)
            return res.data;
        },
        enabled: !!id,
    })
}

export const useGetCampaignById = (id: string) => {
    return useQuery({
        queryKey: ['campaign', id],
        queryFn: async() => {
            const res = await API.get(`/campaigns/${id}`)
            return res.data;
        },
        enabled: !!id,
    })
}