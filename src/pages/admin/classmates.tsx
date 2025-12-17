import React, { useState } from "react";
import { useUserList } from "../service/query/useUserList";
import { useQueryClient } from "@tanstack/react-query";
import { useToggle } from "../../hooks/useToggle";
import type { ColumnDef } from "@tanstack/react-table";
import { useUpdateActive } from "../service/mutate/useUpdateActive";
import { toast } from "sonner";
import { Switch } from "../../components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { MoreHorizontal, UserIcon } from "lucide-react";
import { useDeleteUser } from "../service/mutate/useDeleteUser";
import { Spinner } from "../../components/ui/spinner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { ClassmateForm } from "../../components/classmates-form";
import { ClassmateFormWrapper } from "../../components/classmates-form-wrapper";
import { UserTable } from "../../components/table";

export function AdminClassmates() {
    const { data, isLoading } = useUserList();
    const queryClient = useQueryClient();

    const { isOpen, open, close } = useToggle();
    const { isOpen: isOpenEdit, close: closeEdit } = useToggle();

    const [editId] = useState("");
    const [deleteId, setDeleteId] = useState("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const deleteMutation = useDeleteUser(deleteId);

    const handleDelete = () => {
        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("Deleted successfully!");
                setOpenDeleteDialog(false);
                queryClient.invalidateQueries({
                    queryKey: ["userList"],
                });
            },
            onError: () => toast.error("Failed to delete!"),
        });
    };

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
                const isChecked = mate.isActive === "Active";
                const updateStatus = useUpdateActive(String(mate.id));

                const handleChange = (state: boolean) => {
                    toast.info("Updating status...");
                    updateStatus.mutate(state, {
                        onSuccess: () => {
                            toast.success("Status updated!");
                            queryClient.invalidateQueries({
                                queryKey: ["userList"],
                            });
                        },
                        onError: () => toast.error("Error occurred!"),
                    });
                };

                return (
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={isChecked}
                            disabled={updateStatus.isPending}
                            onCheckedChange={handleChange}
                            className={`cursor-pointer transition-all duration-300 rounded-full
                data-[state=checked]:bg-green-500
                data-[state=unchecked]:bg-red-600
                ${
                    isChecked
                        ? "shadow-lg shadow-green-400/40"
                        : "shadow-lg shadow-red-400/40"
                }
              `}
                        />

                        <span
                            className={`text-sm font-medium transition-all duration-300 ${
                                isChecked ? "text-green-400" : "text-red-400"
                            }`}
                        >
                            {isChecked ? "Active" : "Blocked"}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const mate = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-gray-800 rounded-md"
                            >
                                <MoreHorizontal className="h-4 w-4 text-gray-300" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="bg-black border border-gray-800 text-gray-200 shadow-xl cursor-pointer"
                        >
                            <DropdownMenuItem
                                onClick={() => {
                                    setDeleteId(String(mate.id));
                                    setOpenDeleteDialog(true);
                                }}
                                className="cursor-pointer hover:bg-red-900/50 text-red-400"
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return isLoading ? (
        <Spinner />
    ) : (
        <div className="space-y-5">
            {/* CREATE MODAL */}
            <Dialog open={isOpen} onOpenChange={close}>
                <DialogContent className="bg-black text-gray-200 border border-gray-800 backdrop-blur-xl shadow-2xl">
                    <AlertDialogHeader>
                        <DialogTitle className="text-lg font-bold text-blue-400">
                            Create Classmate
                        </DialogTitle>
                    </AlertDialogHeader>
                    <DialogDescription>
                        <ClassmateForm closeModal={close} />
                    </DialogDescription>
                </DialogContent>
            </Dialog>

            {/* EDIT MODAL */}
            <Dialog open={isOpenEdit} onOpenChange={closeEdit}>
                <DialogContent className="bg-black text-gray-200 border border-gray-800 backdrop-blur-xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-yellow-400">
                            Edit Classmate
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <ClassmateFormWrapper
                            id={editId}
                            closeEditModal={closeEdit}
                        />
                    </DialogDescription>
                </DialogContent>
            </Dialog>

            {/* DELETE DIALOG */}
            <AlertDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
            >
                <AlertDialogContent className="bg-black border border-gray-800 shadow-xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-500 text-lg font-bold">
                            Delete Confirmation
                        </AlertDialogTitle>
                        <p className="text-gray-300 mt-2">
                            Are you sure? This action cannot be undone.
                        </p>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-900 hover:bg-gray-700 text-white cursor-pointer">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete} // ✅ Mutate shu yerda ishlatiladi
                            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <UserTable columns={classmatesColumn} data={classmates} />

            <div className="flex justify-end">
                <Button
                    onClick={open}
                    className="cursor-pointer flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-5 py-2 shadow-xl rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                    <UserIcon className="w-5 h-5" /> Add Classmate
                </Button>
            </div>
        </div>
    );
}
