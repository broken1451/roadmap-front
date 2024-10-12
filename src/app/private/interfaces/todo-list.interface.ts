export interface TodoList {
    todoList:       TodoListElement[];
    total:          number;
    page:           number;
    limit:          number;
    todoListLength: number;
}

export interface TodoListElement {
    _id:         string;
    title:       string;
    description: string;
    completed:   boolean;
    created_at:  Date;
    update_at:   Date;
    __v:         number;
}
