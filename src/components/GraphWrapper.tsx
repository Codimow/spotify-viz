"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState, useMemo, useEffect } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

// Dynamically import ForceGraph2D with no SSR
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
    ssr: false,
});

interface GraphData {
    nodes: any[];
    links: any[];
}

interface GraphWrapperProps {
    data: GraphData;
    onNodeSelect: (node: any) => void;
}

import { forwardRef, useImperativeHandle } from "react";

export interface GraphRef {
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    searchNode: (query: string) => void;
}

const GraphWrapper = forwardRef<GraphRef, GraphWrapperProps>(({ data, onNodeSelect }, ref) => {
    const fgRef = useRef<any>();
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [hoverNode, setHoverNode] = useState<any>(null);
    const { width, height } = useWindowSize();

    useImperativeHandle(ref, () => ({
        zoomIn: () => {
            if (fgRef.current) {
                fgRef.current.zoom(fgRef.current.zoom() * 1.5, 500);
            }
        },
        zoomOut: () => {
            if (fgRef.current) {
                fgRef.current.zoom(fgRef.current.zoom() / 1.5, 500);
            }
        },
        resetZoom: () => {
            if (fgRef.current) fgRef.current.zoomToFit(1000);
        },
        searchNode: (query: string) => {
            const lowerQuery = query.toLowerCase();
            const node = data.nodes.find((n: any) => n.name.toLowerCase().includes(lowerQuery));
            if (node) {
                if (fgRef.current) {
                    fgRef.current.centerAt(node.x, node.y, 1000);
                    fgRef.current.zoom(3, 1000);
                }
                onNodeSelect(node);
            }
        }
    }));

    // ... existing logic ...

    // Copying the rest of the component body exactly as it was, but adapting to forwardRef structure.

    useEffect(() => {
        if (fgRef.current) {
            (fgRef.current as any).d3Force('charge').strength(-400);
            (fgRef.current as any).d3Force('link').distance(80);
        }
    }, [data]);

    const neighbors = useMemo(() => {
        const map = new Map();
        data.links.forEach((link: any) => {
            const a = link.source.id || link.source;
            const b = link.target.id || link.target;

            if (!map.has(a)) map.set(a, []);
            if (!map.has(b)) map.set(b, []);

            map.get(a).push(b);
            map.get(b).push(a);
        });
        return map;
    }, [data]);

    useEffect(() => {
        data.nodes.forEach(node => {
            node.neighbors = neighbors.get(node.id) || [];
        });
    }, [data, neighbors]);


    const handleNodeHover = (node: any) => {
        setHoverNode(node);

        const newHighlightNodes = new Set();
        const newHighlightLinks = new Set();

        if (node) {
            newHighlightNodes.add(node.id);
            data.links.forEach(link => {
                if (link.source.id === node.id || link.target.id === node.id) {
                    newHighlightLinks.add(link);
                    newHighlightNodes.add(link.source.id);
                    newHighlightNodes.add(link.target.id);
                }
            });
        }

        setHighlightNodes(newHighlightNodes);
        setHighlightLinks(newHighlightLinks);
    };

    const handleNodeClick = (node: any) => {
        onNodeSelect(node);
        if (fgRef.current) {
            fgRef.current.centerAt(node.x, node.y, 1000);
            fgRef.current.zoom(3, 1000);
        }
    };

    const handleBackgroundClick = () => {
        onNodeSelect(null);
        if (fgRef.current) {
            fgRef.current.zoomToFit(1000);
        }
    };

    const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const isHovered = hoverNode === node;
        const isHighlighted = highlightNodes.has(node.id);
        const isDimmed = hoverNode && !isHighlighted;

        const size = Math.max((node.val / 10) * 1.5, 4);
        const fontSize = 12 / globalScale;

        const alpha = isDimmed ? 0.1 : 1;
        ctx.globalAlpha = alpha;

        if (!isDimmed) {
            ctx.shadowColor = node.color || "rgba(29, 185, 84, 0.8)";
            ctx.shadowBlur = isHovered ? 40 : 20;
        } else {
            ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color || "#1DB954";
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";

        if (node.img) {
            if (!node.imgObj) {
                const img = new Image();
                img.src = node.img;
                img.crossOrigin = "Anonymous";
                node.imgObj = img;
            }

            if (node.imgObj && node.imgObj.complete) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                ctx.clip();
                try {
                    ctx.drawImage(node.imgObj, node.x - size, node.y - size, size * 2, size * 2);
                } catch (e) { }
                ctx.restore();
            }
        }

        if (isHovered) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2 / globalScale;
            ctx.beginPath();
            ctx.arc(node.x, node.y, size * 1.1, 0, 2 * Math.PI, false);
            ctx.stroke();
        }

        if (isHovered || globalScale > 2.5) {
            const label = node.name;
            const textY = node.y;
            ctx.font = `600 ${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            const textWidth = ctx.measureText(label).width;
            const padding = 2 / globalScale;

            ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            ctx.roundRect(
                node.x - textWidth / 2 - padding,
                node.y + size + padding,
                textWidth + padding * 2,
                fontSize + padding * 2,
                4 / globalScale
            );
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + size + padding * 2);
        }
    }, [hoverNode, highlightNodes]);

    return (
        <div className="w-full h-full bg-[#050505] cursor-move select-none">
            <ForceGraph2D
                ref={fgRef}
                width={width}
                height={height}
                graphData={data}
                nodeCanvasObject={nodeCanvasObject}
                backgroundColor="#050505"
                linkColor={(link: any) => highlightLinks.has(link) ? "#fff" : "rgba(255,255,255,0.15)"}
                linkWidth={(link: any) => highlightLinks.has(link) ? 2 : 0.5}
                linkDirectionalParticles={(link: any) => highlightLinks.has(link) ? 3 : 0}
                linkDirectionalParticleWidth={3}
                d3AlphaDecay={0.01}
                d3VelocityDecay={0.2}
                cooldownTicks={100}
                onNodeHover={handleNodeHover}
                onNodeClick={handleNodeClick}
                onBackgroundClick={handleBackgroundClick}
                onNodeDragEnd={node => {
                    node.fx = node.x;
                    node.fy = node.y;
                }}
            />
        </div>
    );
});

export default GraphWrapper;
