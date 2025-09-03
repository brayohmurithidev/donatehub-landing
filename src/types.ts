export interface CampaignTenant{
    id: string;
    name: string;
    website: string;
    logo_url: string;
}

export interface Campaign{
    id: string;
    name: string;
    description: string;
    status: "active" | "completed" | "cancelled";
    goal_amount: string;
    goal_currency?: string;
    current_amount: string;
    current_currency?: string;
    start_date: string;
    end_date: string;
    image_url: string;
    percentage_funded?: number;
    days_left?: number;
    total_donors?: number;
    total_amount_raised?: number;
    tenant: CampaignTenant;
}