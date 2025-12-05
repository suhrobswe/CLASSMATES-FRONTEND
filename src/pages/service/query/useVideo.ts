import { useQuery } from "@tanstack/react-query";
import { request } from "../../../config/request";

export const useVideo = () => {
    return useQuery({
        queryKey: ["post_list"],
        queryFn: () => request.get("/video").then((res) => res.data),
    });
};
