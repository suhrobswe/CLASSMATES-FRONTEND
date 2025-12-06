import { useMutation } from "@tanstack/react-query";
import { request } from "../../../config/request";

export const useUpdateActive = (id: string) => {
    return useMutation({
        mutationFn: (isActive: boolean) =>
            request
                .patch(`/user/status/${id}`, { isActive })
                .then((res) => res.data),
    });
};