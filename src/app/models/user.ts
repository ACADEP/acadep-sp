
export interface roles{
    administrator ?: boolean;
    employee ?: boolean;
}

export interface User {

     id?: string;
    name: string;
    email: string;
    role?: roles;
      
}
