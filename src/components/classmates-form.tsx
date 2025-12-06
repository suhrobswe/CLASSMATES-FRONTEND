import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import React from "react";
import { useCreateUser } from "../pages/service/mutate/useCreateUser";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { PasswordInput } from "./ui/password-input";
import { Spinner } from "./ui/spinner";
import { useEditProfile } from "../pages/service/mutate/useEditUser";

const formSchema = z.object({
    username: z.string().min(2, "Minimum 2 characters").max(50),
    password: z.string().optional(),
    fullName: z.string().min(2).max(50),
    role: z.string().min(1, "Please select role"),
});

type ClassmateFormInput = z.infer<typeof formSchema>;

interface ClassmateFormProps {
    defaultValueData?: any; // xohlasang aniq tip beraman
    closeModal?: () => void;
    classmateId?: string;
}
export const ClassmateForm = ({
    defaultValueData,
    closeModal,
    classmateId,
}: ClassmateFormProps) => {
    const form = useForm<ClassmateFormInput>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            fullName: "",
            role: "",
        },
    });

    React.useEffect(() => {
        if (defaultValueData?.data) {
            form.reset({
                username: defaultValueData.data.username || "",
                fullName: defaultValueData.data.fullName || "",
                role: defaultValueData.data.role || "",
            });
        }
    }, [defaultValueData, form]);

    const client = useQueryClient();
    const { mutate, isPending } = useCreateUser();
    const { mutate: editMutate, isPending: editIsPending } = useEditProfile(
        classmateId as string
    );

    const onSubmit = (data: ClassmateFormInput) => {
        if (defaultValueData) {
            editMutate(data, {
                onSuccess: () => {
                    toast.success("Success operation!");
                    client.invalidateQueries({ queryKey: ["userList"] });
                    closeModal?.();
                },
                onError: (err: any) => {
                    const message =
                        err?.response?.data?.message || err?.message;
                    if (message === "Username already exists") {
                        form.setError("username", {
                            type: "manual",
                            message: message,
                        });
                    } else {
                        toast.error(message || "Something went wrong!");
                    }
                },
            });
            return;
        }

        mutate(data, {
            onSuccess: () => {
                toast.success("Success operation!");
                client.invalidateQueries({ queryKey: ["userList"] });
                form.reset();
                closeModal?.();
            },
            onError: (err: any) => {
                const message = err?.response?.data?.message || err?.message;
                if (message === "Username already exists") {
                    form.setError("username", {
                        type: "manual",
                        message: message,
                    });
                } else {
                    toast.error(message || "Error creating classmate!");
                }
            },
        });
    };

    const roles = ["ADMIN", "STUDENT"];

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 p-8 rounded-xl bg-linear-to-br from-slate-900/60 to-black/40 border border-gray-700 backdrop-blur-lg shadow-xl"
            >
                {/* Role */}
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200 font-semibold">
                                Role
                            </FormLabel>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between text-gray-200 bg-black/30 border-gray-700 hover:bg-gray-800 transition-all"
                                    >
                                        {field.value || "Select role..."}
                                        <ChevronDown size={16} />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent className="bg-gray-900/95 border-gray-700 backdrop-blur-md rounded-lg shadow-lg">
                                    {roles.map((role) => (
                                        <DropdownMenuItem
                                            key={role}
                                            onClick={() => field.onChange(role)}
                                            className="hover:bg-gray-800 text-gray-200 cursor-pointer"
                                        >
                                            {role}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                {/* Username */}
                <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200 font-semibold">
                                Username
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter username..."
                                    className="bg-black/40 border-gray-700 text-white placeholder-gray-400 focus:ring-cyan-500"
                                />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                {/* Full Name */}
                <FormField
                    name="fullName"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-200 font-semibold">
                                Full Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter full name..."
                                    className="bg-black/40 border-gray-700 text-white focus:ring-cyan-500 placeholder-gray-400"
                                />
                            </FormControl>
                            <FormMessage className="text-red-400" />
                        </FormItem>
                    )}
                />

                {/* Password only for create */}
                {!defaultValueData && (
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-200 font-semibold">
                                    Password
                                </FormLabel>
                                <PasswordInput
                                    {...field}
                                    placeholder="Password..."
                                    className="bg-black/40 border-gray-700 text-white placeholder-gray-400 focus:ring-cyan-500"
                                />
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />
                )}

                <Button
                    type="submit"
                    className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-200 flex justify-center items-center gap-2"
                >
                    {(isPending || editIsPending) && <Spinner />}
                    {defaultValueData ? "Update Classmate" : "Create Classmate"}
                </Button>
            </form>
        </Form>
    );
};
