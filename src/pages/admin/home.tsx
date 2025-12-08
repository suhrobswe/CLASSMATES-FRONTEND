import { useKeenSlider } from "keen-slider/react";
import Masonry from "react-masonry-css";
import { usePostList } from "../service/query/usePostList";
import { Skeleton } from "../../components/ui/skeleton";
import {
    useState,
    type JSXElementConstructor,
    type Key,
    type ReactElement,
    type ReactNode,
    type ReactPortal,
} from "react";
import { useCreatePost } from "../service/mutate/useCreatePost";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";

import { FileText, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

function AutoplayPlugin(slider: any) {
    let interval: number | undefined;

    const clear = () => {
        clearInterval(interval);
    };

    const autoplay = () => {
        clear();
        interval = setInterval(() => {
            slider.next();
        }, 2000);
    };

    slider.on("created", autoplay);
    slider.on("destroyed", clear);
    slider.on("dragStarted", clear);
    slider.on("animationEnded", autoplay);
}

export const AdminHome = () => {
    const { data: postData, isLoading: postLoading } = usePostList();
    const { mutate, isPending } = useCreatePost();

    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const [title, setTitle] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const [sliderRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: true,
            renderMode: "performance",
            drag: true,
            slides: { perView: 1 },
        },
        [AutoplayPlugin]
    );

    const breakpointColumnsObj = { default: 4, 1300: 3, 700: 2, 600: 1 };

    const client = useQueryClient();
    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Post title is required");
            return;
        }

        if (!selectedFiles || selectedFiles.length === 0) {
            toast.error("Image is required.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title.trim());

        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("files", selectedFiles[i]);
        }

        mutate(formData, {
            onSuccess: () => {
                toast.success("Post muvaffaqiyatli yaratildi!");
                setIsDialogOpen(false);
                setTitle("");
                setSelectedFiles(null);
                client.invalidateQueries({ queryKey: ["post_list"] });
            },
            onError: (error) => {
                toast.error(
                    `Xatolik yuz berdi: ${error.message || "No post created."}`
                );
            },
        });
    };

    if (postLoading) {
        return (
            <div className="px-4 py-6 space-y-6">
                <Skeleton className="h-56 w-full rounded-xl" />

                <div className="grid grid-cols-4 gap-4 md:grid-cols-3 sm:grid-cols-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-[#262a31] rounded-xl overflow-hidden shadow-md"
                        >
                            <Skeleton className="h-48 w-full rounded-none" />
                            <div className="p-3">
                                <Skeleton className="h-4 w-2/3 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const imageCards =
        postData?.flatMap((post: { images: string[]; title: string }) =>
            post.images?.map((img: string) => ({
                title: post.title,
                url: img,
            }))
        ) || [];

    return (
        <div className="px-4 py-6 space-y-6">
            {imageCards.length > 0 && (
                <div
                    ref={sliderRef}
                    className="keen-slider rounded-xl overflow-hidden shadow-xl"
                >
                    {imageCards.map(
                        (
                            item: { url: string | undefined; title: any },
                            i: Key
                        ) => (
                            <div
                                key={i}
                                className="keen-slider__slide flex items-center justify-center bg-black"
                            >
                                <img
                                    src={item.url}
                                    alt={String(item.title)}
                                    className="w-full h-64 md:h-80 object-contain bg-black"
                                />
                            </div>
                        )
                    )}
                </div>
            )}

            <div className="flex justify-start">
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    disabled={isPending}
                    className="cursor-pointer flex items-center gap-2 
                               bg-linear-to-r from-blue-600 to-cyan-500 
                               hover:from-blue-500 hover:to-cyan-400 
                               text-white px-5 py-2 shadow-xl rounded-lg 
                               transition-all duration-300 transform hover:scale-105"
                >
                    <FileText className="w-5 h-5" />
                    {isPending ? "Creating..." : "Create a new post"}
                </Button>
            </div>


            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex gap-4"
                columnClassName="masonry-column"
            >
                {imageCards.map(
                    (
                        item: {
                            url: string | undefined;
                            title:
                                | string
                                | number
                                | bigint
                                | boolean
                                | ReactElement<
                                      unknown,
                                      string | JSXElementConstructor<any>
                                  >
                                | Iterable<ReactNode>
                                | ReactPortal
                                | Promise<
                                      | string
                                      | number
                                      | bigint
                                      | boolean
                                      | ReactPortal
                                      | ReactElement<
                                            unknown,
                                            string | JSXElementConstructor<any>
                                        >
                                      | Iterable<ReactNode>
                                      | null
                                      | undefined
                                  >
                                | null
                                | undefined;
                        },
                        index: Key
                    ) => (
                        <div
                            key={index}
                            className="bg-[#262a31] rounded-xl overflow-hidden shadow-lg mb-4 
                        transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                        >
                            <img
                                src={item.url}
                                alt={String(item.title)}
                                className="w-full h-auto object-contain bg-black"
                            />
                            <div className="p-3">
                                <h3 className="text-white text-sm font-semibold line-clamp-1">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    )
                )}
            </Masonry>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent
                    className="sm:max-w-[425px] 
                               bg-[#1e2024] 
                               border border-gray-700 
                               text-white 
                               shadow-2xl"
                >
                    <DialogHeader>
                        <DialogTitle className="text-cyan-400 flex items-center gap-2">
                            <FileText className="w-5 h-5" /> Create a new post
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Choose a title and image
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleCreatePost}
                        className="grid gap-4 py-4"
                    >
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="title"
                                className="text-right text-gray-300"
                            >
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3 
                                           bg-[#262a31] 
                                           border-gray-600 
                                           text-white 
                                           focus:ring-cyan-500"
                                placeholder="title"
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="files"
                                className="text-right text-gray-300"
                            >
                                Image
                            </Label>
                            <div className="col-span-3">
                                <Input
                                    id="files"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) =>
                                        setSelectedFiles(e.target.files)
                                    }
                                    className="col-span-3 
                                               bg-[#262a31] 
                                               border-gray-600 
                                               text-white 
                                               file:text-cyan-400 
                                               file:bg-[#1e2024] 
                                               file:border-r file:border-gray-600
                                               cursor-pointer"
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-4">
                            <Button
                                type="submit"
                                disabled={
                                    isPending ||
                                    !title.trim() ||
                                    !selectedFiles ||
                                    selectedFiles.length === 0
                                }
                                className={`
        text-white flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all duration-300

        
        bg-linear-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 
        shadow-lg shadow-cyan-500/50 
        hover:shadow-xl hover:shadow-cyan-400/60 
        transform hover:scale-[1.02]

        disabled:opacity-50 
        disabled:cursor-not-allowed
        disabled:shadow-none
        disabled:transform-none

        ${isPending ? "bg-gray-700 pointer-events-none" : ""}
    `}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        Create Post
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
