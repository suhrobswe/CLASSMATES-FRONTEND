import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useLogin } from "./service/useLogin";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { PasswordInput } from "../../components/ui/password-input";

const formSchema = z.object({
    username: z.string().min(1, "Username is required."),
    password: z.string().min(1, "Password is required."),
    role: z.string().min(2, "Role must be selected."),
});

export const Login = () => {
    const { mutate, isPending } = useLogin();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "suhrobswe",
            password: "Suhrob1222!",
            role: "STUDENT",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        mutate(data, {
            onSuccess: (res) => {
                Cookies.set("token", res.data.accessToken, { path: "/" });

                Cookies.set("role", res.data.role.toLowerCase(), { path: "/" });

                Cookies.set("username", data.username);

                toast.success("Login successfully!");
                navigate(`/${String(res.data.role.toLowerCase())}`);
            },
            onError: (_err) =>
                toast.error("Username, role or password incorrect"),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-800 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white tracking-wide">
                        Welcome to the Classmates Website!
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        Sign in to continue
                    </p>
                </div>

                <div className="bg-[#1e2127] border border-gray-700 rounded-2xl p-10 shadow-xl">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300 text-sm font-medium">
                                            Role
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <SelectTrigger className="bg-[#25282f] border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#2a2d34] text-white rounded-lg">
                                                    <SelectItem value="ADMIN">
                                                        ADMIN
                                                    </SelectItem>
                                                    <SelectItem value="STUDENT">
                                                        STUDENT
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300 text-sm font-medium">
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter a username"
                                                className="bg-[#25282f] border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-300 text-sm font-medium">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="Enter a password"
                                                className="bg-[#25282f] border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400 text-xs mt-1" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg py-2 flex items-center justify-center transition-colors duration-200"
                            >
                                {isPending && (
                                    <Spinner className="w-4 h-4 mr-2" />
                                )}
                                {isPending ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};
