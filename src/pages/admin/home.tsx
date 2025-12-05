import Masonry from "react-masonry-css";
import { usePost } from "../service/query/usePost";
import type { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

export const AdminHome = () => {
    const { data: postData, isLoading: postLoading } = usePost();

    if (postLoading) return <div>Loading...</div>;

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    const imageCards =
        postData?.flatMap((post: { images: string[]; title: string }) =>
            post.images?.map((img) => ({
                title: post.title,
                url: img,
            }))
        ) || [];

    return (
        <div className="px-4 py-6">
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="flex gap-4"
                columnClassName="masonry-column"
            >
                {imageCards.map((item: { url: string | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => (
                    <div
                        key={index}
                        className="bg-[#262a31] rounded-xl overflow-hidden shadow-lg mb-4 transition-transform duration-200 hover:scale-105"
                    >
                        <img
                            src={item.url}
                            alt={String(item.title)}
                            className="w-full h-auto object-cover"
                        />
                        <div className="p-2">
                            <h3 className="text-white text-sm font-semibold">
                                {item.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </Masonry>
        </div>
    );
};
