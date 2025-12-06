import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

export const useDetail = (id: string) => {
    return useQuery({
        queryKey: ["teacher", id],
        queryFn: () => request.get(`/user/${id}`).then((res) => res.data),
    });
};
