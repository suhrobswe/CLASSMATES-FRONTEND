import { useMutation } from "@tanstack/react-query";
import { request } from "../../../config/request";

export const useDeleteUser = (id: string) => {
    return useMutation({
        mutationFn: () =>
            request.delete(`/user/${id}`).then((res) => res.data),
    });
};
