import { useQuery } from "@tanstack/react-query";
import API from "@/api/api";

interface Tenant {
    id: string;
    name: string;
    description?: string;
    logo_url?: string;
    phone?: string;
    email?: string;
    location?: string;
    is_Verified: boolean;
    website?: string;
}

interface UseTenantsOptions {
    search?: string;
    page?: number;
    pageSize?: number;
    enabled?: boolean;
}

export const useTenants = (options: UseTenantsOptions = {}) => {
    return useQuery({
        queryKey: ["tenants", options],
        queryFn: async () => {
            const res = await API.get("/tenants", {
                params: {
                    search: options.search,
                    page: options.page,
                    pageSize: options.pageSize,
                },
            });
            return res.data as Tenant[];
        },
        enabled: options.enabled ?? true,
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    });
};



export const useTenant = (id: string) => {
    return useQuery({
        queryKey: ["tenant", id],
        queryFn: async () => {
            const res = await API.get(`/tenants/${id}`);
            return res.data as Tenant;
        },
        enabled: !!id,
    });
};
