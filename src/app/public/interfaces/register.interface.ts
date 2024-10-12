export interface RegisterRequest {
    name:     string;
    email:    string;
    password: string;
}


export interface RegisterResponse {
    userCreated: UserCreated;
    token:       string;
}

export interface UserCreated {
    name:       string;
    email:      string;
    password:   string;
    roles:      string[];
    isActive:   boolean;
    retry:      number;
    _id:        string;
    created_at: Date;
    update_at:  Date;
    __v:        number;
}
