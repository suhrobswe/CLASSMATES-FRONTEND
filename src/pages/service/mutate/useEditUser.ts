// service/mutate/useEditProfile.ts
import { useMutation } from "@tanstack/react-query";
import { request } from "../../../config/request";

interface ProfileUpdateInput {
    username?: string;
    fullName?: string;
    password?: string;
    imageUrl?: string;
}

export const useEditProfile = (id: string) => {
    return useMutation({
        mutationFn: async (data: ProfileUpdateInput) => {
            return request.patch(`/user/${id}`, data);
        },
    });
};
