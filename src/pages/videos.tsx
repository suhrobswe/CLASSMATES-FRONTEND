import { Skeleton } from "../components/ui/skeleton";
import { usePlaylistVideos } from "./service/query/useVideo";

export const Videos = () => {
    const { data: videos, isLoading: videosLoading } = usePlaylistVideos();

    if (videosLoading) {
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

    return (
        <div className="px-4 py-6">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {videos?.map((video) => (
                    <div
                        key={video.id}
                        className="bg-[#262a31] rounded-xl overflow-hidden shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
                    >
                        <div className="relative w-full pt-[56.25%]">
                            {" "}
                            <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-t-xl"
                                src={`https://www.youtube.com/embed/${video.id}`}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="p-3">
                            <h3 className="text-white text-sm font-semibold line-clamp-1">
                                {video.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
