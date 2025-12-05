import axios from "axios";

export const request = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // masalan: http://localhost:3000/api/v1
    withCredentials: true,
});
