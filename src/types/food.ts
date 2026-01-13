export interface Food {
    id: number;
    name: string;
    price: number;
    imgUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface FoodRequest {
    name: string;
    price: number;
    imgUrl: string;
}
