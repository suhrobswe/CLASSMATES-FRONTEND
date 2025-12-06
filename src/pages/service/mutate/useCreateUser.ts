import { useMutation } from "@tanstack/react-query";
import { request } from "../../../config/request";

interface ClassmateInput {
    username: string;
    fullName: string;
    role: string;
    password?: string;
}

export const useCreateUser = () => {
    return useMutation({
        mutationFn: async (data: ClassmateInput) => {
            return request.post("/user", data);
        },
    });
};
