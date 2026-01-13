import { fetcher } from '@/lib/api/fetcher';
import { Food } from '@/types/food';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/foods';

export const foodApi = {
    getFoods: async (): Promise<ApiResponse<Food[]>> => {
        return fetcher<ApiResponse<Food[]>>(BASE_PATH, {
            method: 'GET',
        });
    },

    getFoodById: async (id: number): Promise<ApiResponse<Food>> => {
        return fetcher<ApiResponse<Food>>(`${BASE_PATH}/${id}`, {
            method: 'GET',
        });
    },
};
