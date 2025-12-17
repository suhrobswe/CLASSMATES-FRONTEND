"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useUserByUsername } from "./service/query/useProfile";
import { useEditProfile } from "./service/mutate/useEditUser";
import { useUploadImage } from "./service/mutate/useUploadImage";
import { toast } from "sonner";
import { Spinner } from "../components/ui/spinner";
import defaultProfileImage from "../assets/profile.jpg";
import { Camera } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export const Profile = () => {
    const usernameCookie = Cookies.get("username");
    const {
        data: user,
        isLoading,
        isFetching,
    } = useUserByUsername(usernameCookie);

    const client = useQueryClient();

    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    const editProfile = useEditProfile(user?.id || "");
    const uploadImage = useUploadImage(user?.id || "");

    // Initialize form values
    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setFullName(user.fullName);
            setPreview(
                user.imageUrl
                    ? `http://localhost:3000/api/v1${user.imageUrl}`
                    : ""
            );
        }
    }, [user]);

    if (isLoading || isFetching) return <Spinner />;

    if (!user)
        return (
            <div className="text-center text-red-500 mt-10">User not found</div>
        );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let imageUrl = user.imageUrl;

        // Upload image if selected
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await uploadImage.mutateAsync(formData);

                imageUrl = res.data.data.imageUrl; // <-- To‘g‘ri

                setPreview(`http://localhost:3000/api/v1${imageUrl}`);
                toast.success("Avatar uploaded!");
            } catch (err) {
                console.log(err);
                // toast.error("Avatar upload failed!");
                return;
            }
        }

        editProfile.mutate(
            { username, fullName, imageUrl },
            {
                onSuccess: () => {
                    toast.success("Profile updated!");
                    client.invalidateQueries({ queryKey: ["user", username] });
                },
                onError: () => toast.error("Failed to update profile"),
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-5">
            <div className="max-w-lg w-full bg-[#111] rounded-2xl shadow-xl p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-white">
                    Edit Profile
                </h2>

                {/* Avatar */}
                <div className="flex flex-col items-center gap-3 relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                        <img
                            src={preview || defaultProfileImage}
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-gray-800 hover:bg-gray-700 p-2 rounded-full cursor-pointer shadow-md transition-all flex items-center justify-center"
                    >
                        <Camera size={18} />
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="flex flex-col text-white">
                        Username
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>
                    <label className="flex flex-col text-white">
                        Full Name
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="mt-1 p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>

                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded shadow text-white font-semibold transition-colors"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};
