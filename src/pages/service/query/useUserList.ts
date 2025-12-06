import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

export const useUserList = () => {
    return useQuery({
        queryKey: ['userList'],
        queryFn: () => request.get("/user").then((res) => res.data),
    });
};
