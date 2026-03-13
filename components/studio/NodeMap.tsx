"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { StudioChapter } from "@/types/studio";

export default function NodeMap({ chapter }: { chapter: StudioChapter }) {
  // Translate our flat array of Chapter nodes into React Flow nodes & edges
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  chapter.nodes.forEach((node, idx) => {
    // Basic auto-layout attempt (can be improved with dagre later)
    initialNodes.push({
      id: node.id,
      position: { x: 50, y: idx * 100 },
      data: {
        label: (
          <div className="flex flex-col items-center">
            <span className="text-[8px] uppercase tracking-wider text-purple-400 font-bold mb-1">
              {node.type}
            </span>
            <span className="text-xs truncate max-w-[120px] text-white">
              {node.type === "choice" ? "Branch Splitting" : node.text || "Empty Block"}
            </span>
          </div>
        ),
      },
      style: {
        background: node.type === "choice" ? "rgba(168, 85, 247, 0.2)" : "rgba(0, 0, 0, 0.8)",
        border: "1px solid rgba(196,181,253,0.3)",
        borderRadius: "8px",
        color: "white",
        width: 150,
      },
    });

    if (node.type === "choice" && node.choices) {
      node.choices.forEach((choice, choiceIdx) => {
        if (choice.next) {
          initialEdges.push({
            id: `e-${node.id}-${choice.next}-${choiceIdx}`,
            source: node.id,
            target: choice.next,
            label: choice.text || "Choice",
            animated: true,
            style: { stroke: "#a855f7" },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#a855f7" },
          });
        }
      });
    } else {
      // Linear connection to the next node in the array
      // If `node.next` exists, go there. Otherwise default to next in list.
      const targetId = node.next || chapter.nodes[idx + 1]?.id;
      if (targetId) {
        initialEdges.push({
          id: `e-${node.id}-${targetId}`,
          source: node.id,
          target: targetId,
          markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(255,255,255,0.4)" },
          style: { stroke: "rgba(255,255,255,0.2)" },
        });
      }
    }
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync when chapter changes (e.g. adding a new node on the left side)
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [chapter.nodes]);

  return (
    <div className="w-full h-full" style={{ background: "#090614" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodesDraggable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Controls showInteractive={false} className="bg-white/10 fill-white" />
        <Background color="#ffffff" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}
