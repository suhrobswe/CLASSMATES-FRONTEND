import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

export const usePost = () => {
    return useQuery({
        queryKey: ["post_list"],
        queryFn: () => request.get("/post").then((res) => res.data),
    });
};
