import React from "react";
import { useUserList } from "../service/query/useUserList";
import type { ColumnDef } from "@tanstack/react-table";
import { UserIcon } from "lucide-react";
import { Spinner } from "../../components/ui/spinner";
import { UserTable } from "../../components/table";

export function Classmates() {
    const { data, isLoading } = useUserList();

    const classmates = React.useMemo(() => {
        if (!Array.isArray(data?.data)) return [];
        return data.data.map(
            (
                item: {
                    id: any;
                    fullName: any;
                    username: any;
                    role: any;
                    imageUrl: any;
                    isActive: any;
                },
                index: number
            ) => ({
                id: item.id,
                count: index + 1,
                fullName: item.fullName,
                username: item.username,
                role: item.role,
                imageUrl: item.imageUrl
                    ? `http://localhost:3000/api/v1${item.imageUrl}`
                    : null,
                isActive: item.isActive ? "Active" : "Blocked",
            })
        );
    }, [data]);

    const classmatesColumn: ColumnDef<any>[] = [
        { accessorKey: "count", header: "№" },
        {
            accessorKey: "fullName",
            header: "Full Name",
            cell: ({ row }) => (
                <span className="cursor-pointer hover:text-cyan-300 transition-colors underline-offset-2 hover:underline">
                    {row.original.fullName}
                </span>
            ),
        },
        { accessorKey: "username", header: "Username" },
        { accessorKey: "role", header: "Role" },
        {
            accessorKey: "imageUrl",
            header: "Image",
            cell: ({ row }) => {
                const mate = row.original;
                return (
                    <div
                        className="w-11 h-11 rounded-full bg-linear-to-br from-[#2e3239] to-[#1f2227] 
                        flex items-center justify-center shadow-md border border-[#3a3f47] overflow-hidden"
                    >
                        {mate.imageUrl ? (
                            <img
                                src={mate.imageUrl}
                                alt={mate.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <UserIcon className="text-gray-400 w-6 h-6 opacity-70" />
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => {
                const mate = row.original;
                return (
                    <span
                        className={`text-sm font-medium ${
                            mate.isActive === "Active"
                                ? "text-green-400"
                                : "text-red-400"
                        }`}
                    >
                        {mate.isActive}
                    </span>
                );
            },
        },
    ];

    return isLoading ? (
        <Spinner />
    ) : (
        <div className="space-y-5">
            <UserTable columns={classmatesColumn} data={classmates} />
        </div>
    );
}
