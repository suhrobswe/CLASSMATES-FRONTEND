import { useMutation } from "@tanstack/react-query";
import { request } from "../../../config/request";

export interface LoginT {
    username: string;
    password: string;
    role: string;
}

export interface LoginResponse {
    statusCode: number;
    message: {
        en: string;
        ru: string;
        uz: string;
    };
    data: {
        accessToken: string;
        role: string;
    };
}

export const useLogin = () => {
    return useMutation<LoginResponse, any, LoginT>({
        mutationFn: async (data: LoginT) => {
            const res = await request.post<LoginResponse>("http://localhost:3000/api/v1/user/login", data, {
                withCredentials: true,
            });
            return res.data;
        },
    });
};
