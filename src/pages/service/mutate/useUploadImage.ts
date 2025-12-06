import { useMutation } from "@tanstack/react-query";
import { request } from "../../../config/request";

export const useUploadImage = (id: string) => {
    return useMutation({
        mutationFn: (data: FormData) =>
            request
                .patch(`/user/image/${id}`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => res.data),
    });
};
