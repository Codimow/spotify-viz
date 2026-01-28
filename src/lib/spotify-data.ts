import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

interface Artist {
    id: string;
    name: string;
    genres: string[];
    images: { url: string }[];
    popularity: number;
}

interface GraphNode {
    id: string;
    name: string;
    img: string;
    val: number; // Popularity/Size
    genres: string[];
    color?: string;
}

interface GraphLink {
    source: string;
    target: string;
    value: number; // Strength based on shared genres
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export async function getMusicGraphData(): Promise<GraphData | null> {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return null;
    }

    try {
        const res = await fetch(
            "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=long_term",
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
            }
        );

        if (!res.ok) {
            console.error("Failed to fetch top artists", await res.text());
            return null;
        }

        const data = await res.json();
        const artists: Artist[] = data.items;

        // Simple color palette for genres
        const stringToColor = (str: string) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            let c = (hash & 0x00ffffff).toString(16).toUpperCase();
            // Pad with zeros
            c = "00000".substring(0, 6 - c.length) + c;
            return "#" + c;
        };

        const nodes: GraphNode[] = artists.map((artist) => {
            const primaryGenre = artist.genres[0] || "unknown";
            return {
                id: artist.id,
                name: artist.name,
                img: artist.images[0]?.url || "",
                val: artist.popularity,
                genres: artist.genres,
                color: stringToColor(primaryGenre) // Add color property
            };
        });

        const links: GraphLink[] = [];

        // Create links based on shared genres
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const source = nodes[i];
                const target = nodes[j];

                const sharedGenres = source.genres.filter((g) =>
                    target.genres.includes(g)
                );

                if (sharedGenres.length > 0) {
                    links.push({
                        source: source.id,
                        target: target.id,
                        value: sharedGenres.length,
                    });
                }
            }
        }

        return { nodes, links };
    } catch (error) {
        console.error("Error fetching Spotify data", error);
        return null;
    }
}
