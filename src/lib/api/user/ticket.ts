import { fetcher } from '@/lib/api/fetcher';
import { Ticket } from '@/types/ticket';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/tickets';

export const ticketApi = {
    // Get user's tickets
    getMyTickets: async (): Promise<ApiResponse<Ticket[]>> => {
        return fetcher<ApiResponse<Ticket[]>>(BASE_PATH, {
            method: 'GET',
        });
    },

    // Get ticket details
    getTicketById: async (id: number): Promise<ApiResponse<Ticket>> => {
        return fetcher<ApiResponse<Ticket>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
};
