// service/query/usePlaylistVideos.ts
import { useQuery } from "@tanstack/react-query";

const API_KEY = "AIzaSyDkyhXeVs3Ej13Ew30m94qJjAs4vN3l_AI"; // O'zingizning API Key
const PLAYLIST_ID = "PLry07l8OfXhSGqQsUfZCln1IzYQb0MjkR";

interface Video {
    id: string;
    title: string;
    thumbnail: string;
}

async function fetchPlaylistVideos(): Promise<Video[]> {
    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=50&key=${API_KEY}`
    );
    const data = await res.json();
    return data.items.map((v: any) => ({
        id: v.snippet.resourceId.videoId,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails.medium.url,
    }));
}

export function usePlaylistVideos() {
    return useQuery({
        queryKey: ["playlistVideos"],
        queryFn: fetchPlaylistVideos,
    });
}
