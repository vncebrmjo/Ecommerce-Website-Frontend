export interface LoginRequestModel {
    userName: string;
    password: string;
}

export interface LoginResponseModel {
    token: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    expiresAt: string;
}

export interface RegisterRequestModel {
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    password: string;
}

export interface RegisterResponseModel {
    id: number;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface UserResponseModel {
    id: number;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
}

export interface UpdateUserRoleRequestModel {
    role: string;
}

