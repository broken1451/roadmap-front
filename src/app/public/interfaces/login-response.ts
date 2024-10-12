export interface LoginResponse {
    ok:    boolean;
    user:  User;
    token: string;
}

export interface User {
    _id:        string;
    name:       string;
    email:      string;
    password:   string;
    roles:      string[];
    isActive:   boolean;
    retry:      number;
    created_at: Date;
    update_at:  Date;
    __v:        number;
}
