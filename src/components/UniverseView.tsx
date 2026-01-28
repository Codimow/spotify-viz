"use client";

import { useState } from "react";
import { useRef } from "react";
import GraphWrapper, { GraphRef } from "./GraphWrapper";
import ArtistInfoPanel from "./ArtistInfoPanel";
import Controls from "./Controls";

interface UniverseViewProps {
    data: any;
}

export default function UniverseView({ data }: UniverseViewProps) {
    const [selectedArtist, setSelectedArtist] = useState<any>(null);
    const graphRef = useRef<GraphRef>(null);

    return (
        <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-900/10 blur-[150px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px]"></div>
            </div>

            {/* Top Left Stats */}
            <div className="absolute top-6 left-6 z-10 pointer-events-none select-none">
                <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-2xl">
                    Music Verse
                </h1>
                <p className="text-white/50 text-sm mt-1">
                    {data.nodes.length} Artists • {data.links.length} Connections
                </p>
            </div>

            {/* Graph Area */}
            <div className="absolute inset-0 z-0">
                <GraphWrapper
                    ref={graphRef}
                    data={data}
                    onNodeSelect={setSelectedArtist}
                />
            </div>

            {/* Artist Panel Overlay */}
            <ArtistInfoPanel
                artist={selectedArtist}
                onClose={() => setSelectedArtist(null)}
            />

            {/* Interactive Controls */}
            <Controls
                onSearch={(q) => graphRef.current?.searchNode(q)}
                onReset={() => graphRef.current?.resetZoom()}
                onZoomIn={() => graphRef.current?.zoomIn()}
                onZoomOut={() => graphRef.current?.zoomOut()}
            />
        </div>
    );
}
