import { fetcher } from '@/lib/api/fetcher';
import { Food, FoodRequest } from '@/types/food';
import { ApiResponse } from '@/types/genre';

const BASE_PATH = '/admin/foods';

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

    createFood: async (data: FoodRequest): Promise<ApiResponse<Food>> => {
        return fetcher<ApiResponse<Food>>(BASE_PATH, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateFood: async (id: number, data: FoodRequest): Promise<ApiResponse<Food>> => {
        return fetcher<ApiResponse<Food>>(`${BASE_PATH}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteFood: async (id: number): Promise<ApiResponse<null>> => {
        return fetcher<ApiResponse<null>>(`${BASE_PATH}/${id}`, {
            method: 'DELETE',
        });
    },
};
