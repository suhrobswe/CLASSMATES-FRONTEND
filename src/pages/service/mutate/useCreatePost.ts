// useCreatePost.ts faylida (taxminiy)

import { useMutation } from "@tanstack/react-query";
import type { Post } from "../../type";
import { request } from "../../../config/request";

// Kiruvchi parametr endi FormData turida
export const useCreatePost = () => {
    // E'tibor bering: useMutation<Qaytuvchi data, Xato turi, Kiruvchi data (FormData)>
    return useMutation<Post, Error, FormData>({
        mutationFn: async (formData) => {
            // Fayllarni serverga yuborish uchun maxsus konfiguratsiya talab qilinishi mumkin,
            // chunki bu FormData.
            const response = await request.post("/post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Bu qator ba'zan avtomatik qo'shiladi, lekin qo'lda berish ham mumkin
                },
            });
            return response.data;
        },
        // ...
    });
};
