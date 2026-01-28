import React from "react";
import { X, ExternalLink, Activity, Disc } from "lucide-react";

interface ArtistInfoPanelProps {
    artist: any | null;
    onClose: () => void;
}

export default function ArtistInfoPanel({ artist, onClose }: ArtistInfoPanelProps) {
    if (!artist) return null;

    return (
        <div className="absolute top-4 right-4 z-50 w-80 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform transition-all duration-300 animate-in slide-in-from-right-10">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition"
            >
                <X size={20} />
            </button>

            <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-500 to-blue-500 blur-lg opacity-50 animate-pulse"></div>
                    <img
                        src={artist.img}
                        alt={artist.name}
                        className="relative w-full h-full object-cover rounded-full border-2 border-white/20 shadow-xl"
                    />
                </div>
                <h2 className="text-2xl font-black text-white text-center leading-tight">
                    {artist.name}
                </h2>
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                    {artist.genres?.slice(0, 3).map((g: string) => (
                        <span
                            key={g}
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70 border border-white/5"
                        >
                            {g}
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 text-white/70">
                        <Activity size={18} className="text-green-400" />
                        <span className="text-sm font-medium">Popularity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-400 rounded-full"
                                style={{ width: `${artist.val}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-bold text-white">{artist.val}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3 text-white/70">
                        <Disc size={18} className="text-blue-400" />
                        <span className="text-sm font-medium">Connections</span>
                    </div>
                    <span className="text-xs font-bold text-white">
                        {artist.neighbors ? artist.neighbors.length : "0"} Linked
                    </span>
                </div>

                <button
                    className="w-full py-3 mt-2 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                    onClick={() => window.open(`https://open.spotify.com/artist/${artist.id}`, '_blank')}
                >
                    <span className="text-sm">Open in Spotify</span>
                    <ExternalLink size={16} />
                </button>
            </div>
        </div>
    );
}
