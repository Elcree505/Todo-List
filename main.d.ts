/**
 * Category
 */
export interface Category {
    id: number;
    title: string;
}

/**
 * Todo
 */
export interface Todo {
    category_id: number;
    title: string;
    description: string;
    created_time: Date;
    updated_time: Date;
    done_time: Date;
}
