import { useKeenSlider } from "keen-slider/react";
import Masonry from "react-masonry-css";
import { usePostList } from "../service/query/usePostList";
import { Skeleton } from "../../components/ui/skeleton";
import {
    type JSXElementConstructor,
    type Key,
    type ReactElement,
    type ReactNode,
    type ReactPortal,
} from "react";

// ✅ TO'G'IRLANGAN PLUGIN: Har safar yangi interval o'rnatishdan oldin eskisini tozalaydi.
function AutoplayPlugin(slider: any) {
    let interval: number | undefined;

    const clear = () => {
        clearInterval(interval);
    };

    const autoplay = () => {
        // !!! MUHIM O'ZGARTIRISH: Har safar yangi taymer o'rnatishdan oldin eskisini tozalaymiz.
        clear();
        interval = setInterval(() => {
            slider.next();
        }, 2000);
    };

    slider.on("created", autoplay);
    slider.on("destroyed", clear);
    slider.on("dragStarted", clear);
    slider.on("animationEnded", autoplay); // Animatsiya tugagach, eskisini o'chirib, yangi taymer ishga tushadi
}

export const Home = () => {
    const { data: postData, isLoading: postLoading } = usePostList();

    // KeenSlider hook-i
    const [sliderRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: true,
            renderMode: "performance",
            drag: true,
            slides: { perView: 1 },
        },
        [AutoplayPlugin] // O'zgartirilgan pluginni ishlatish
    );

    const breakpointColumnsObj = { default: 4, 1300: 3, 700: 2, 600: 1 };

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

    // Rasmlarni tayyorlash
    const imageCards =
        postData?.flatMap((post: { images: string[]; title: string }) =>
            post.images?.map((img: string) => ({
                title: post.title,
                url: img,
            }))
        ) || [];

    return (
        <div className="px-4 py-6 space-y-6">
            {/* 🎞 Infinite Slider */}
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

            {/* 🖼 Masonry Grid */}
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
        </div>
    );
};
