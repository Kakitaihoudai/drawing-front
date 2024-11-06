export interface Drawing {
    id: number;
    created_at: Date;
    updated_at: Date;
    posted_at: null | Date;
    title: string;
    content: string;
    posted: boolean;
    user_id: number;
    likes: number;
    dislikes: number;
}