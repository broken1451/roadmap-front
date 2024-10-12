export interface ResponseUpdateTodo {
    _id:         string;
    title:       string;
    description: string;
    completed:   boolean;
    created_at:  Date;
    update_at:   Date;
    __v:         number;
}
