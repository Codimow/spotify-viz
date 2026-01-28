"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

// Dynamically import ForceGraph2D with no SSR
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
    ssr: false,
});

interface GraphData {
    nodes: any[];
    links: any[];
}

export default function GraphWrapper({ data }: { data: GraphData }) {
    const containerRef = useRef<HTMLDivElement>(null);
    // Use a hook or just read window size safely (will handle client side check inside useWindowSize or just let ForceGraph2D handle generic size)
    // ForceGraph2D automatically resizes to container if width/height not provided? Or parent size.
    // We'll trust it to fill the screen or pass props.

    const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const size = (node.val / 10) * 1.5; // Base size on popularity
        const label = node.name;
        const fontSize = 12 / globalScale;

        // Draw Glow
        ctx.shadowColor = node.color || "rgba(29, 185, 84, 0.8)";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color || "#1DB954";
        ctx.fill();

        // Clean shadow for image
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";

        // Draw Image
        if (node.img) {
            if (!node.imgObj) {
                const img = new Image();
                img.src = node.img;
                img.crossOrigin = "Anonymous";
                node.imgObj = img;
                img.onload = () => {
                    // Ideally trigger a re-render here, but react-force-graph might not expose it easily. 
                    // Often it just works on next frame or interaction. 
                    // To force, we can wiggle the graph?
                };
            }

            if (node.imgObj && node.imgObj.complete) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                ctx.clip();
                try {
                    ctx.drawImage(node.imgObj, node.x - size, node.y - size, size * 2, size * 2);
                } catch (e) {
                    // ignore error
                }
                ctx.restore();
            }
        }

        // Draw Text on Hover (or always if zoomed in?)
        // Let's just draw text below node
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 0.5;

        if (globalScale > 1.5) {
            ctx.fillText(label, node.x, node.y + size + fontSize);
        }
    }, []);

    const nodePointerAreaPaint = useCallback((node: any, color: string, ctx: CanvasRenderingContext2D) => {
        const size = (node.val / 10) * 1.5;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
        ctx.fill();
    }, []);

    return (
        <div className="w-full h-screen bg-[#050505]" ref={containerRef}>
            <ForceGraph2D
                graphData={data}
                nodeCanvasObject={nodeCanvasObject}
                nodePointerAreaPaint={nodePointerAreaPaint}
                backgroundColor="#050505"
                linkColor={() => "rgba(255,255,255,0.1)"}
                linkWidth={1}
                nodeLabel="name"
                d3AlphaDecay={0.02}
                d3VelocityDecay={0.08}
                cooldownTicks={100}
                onNodeDragEnd={node => {
                    node.fx = node.x;
                    node.fy = node.y;
                }}
                onNodeClick={node => {
                    // Zoom to node logic or expand info
                    // For now just focus
                }}
            />
        </div>
    );
}
