"use client";

import { Search, RotateCcw, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface ControlsProps {
    onSearch: (query: string) => void;
    onReset: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
}

export default function Controls({ onSearch, onReset, onZoomIn, onZoomOut }: ControlsProps) {
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 animate-in slide-in-from-bottom-10 fade-in duration-700">
            {/* Search Bar */}
            <form
                onSubmit={handleSearch}
                className="group flex items-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 transition-all hover:bg-black/60 focus-within:ring-1 focus-within:ring-green-500/50 w-48 focus-within:w-64"
            >
                <Search size={16} className="text-white/50 mr-2 group-focus-within:text-green-400 transition-colors" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Find artist..."
                    className="bg-transparent border-none outline-none text-sm text-white placeholder-white/30 w-full"
                />
            </form>

            {/* Separator */}
            <div className="w-px h-6 bg-white/10 mx-1"></div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full p-1">
                <button onClick={onZoomOut} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition">
                    <Minus size={16} />
                </button>
                <button onClick={onReset} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition" title="Reset View">
                    <RotateCcw size={16} />
                </button>
                <button onClick={onZoomIn} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition">
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}
