// useUserByUsername.ts
import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

interface User {
    password: string | number | readonly string[] | undefined;
    id: string;
    username: string;
    fullName: string;
    role: string;
    imageUrl?: string;
    isActive: boolean;
}
export const useUserByUsername = (username?: string) => {
    return useQuery<User>({
        queryKey: ["user", username],
        queryFn: () => request.get(`/user/${username}`).then((res) => res.data),
        enabled: !!username,
    });
};
