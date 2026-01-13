import { fetcher } from '@/lib/api/fetcher';
import { Auditorium, AuditoriumRequest } from '@/types/auditorium';
import { ApiResponse } from '@/types/genre'; // Reusing ApiResponse

const BASE_PATH = '/admin/auditoriums';

export const auditoriumApi = {
    getAuditoriums: async (): Promise<ApiResponse<Auditorium[]>> => {
        return fetcher<ApiResponse<Auditorium[]>>(BASE_PATH, {
            method: 'GET',
        });
    },

    getAuditoriumById: async (id: number): Promise<ApiResponse<Auditorium>> => {
        return fetcher<ApiResponse<Auditorium>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },

    createAuditorium: async (data: AuditoriumRequest): Promise<ApiResponse<Auditorium>> => {
        return fetcher<ApiResponse<Auditorium>>(BASE_PATH, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateAuditorium: async (id: number, data: AuditoriumRequest): Promise<ApiResponse<Auditorium>> => {
        return fetcher<ApiResponse<Auditorium>>(`${BASE_PATH}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteAuditorium: async (id: number): Promise<ApiResponse<null>> => {
        return fetcher<ApiResponse<null>>(`${BASE_PATH}/${id}`, {
            method: 'DELETE',
        });
    },
};
