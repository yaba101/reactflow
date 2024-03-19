"use client";
import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  Panel,
} from "reactflow";
import TurboNode from "@/components/nodetree/TurboNode";
import TurboEdge from "@/components/nodetree/TurboEdge";
import "./index.css";
import "reactflow/dist/style.css";
import { cn } from "@/lib/utils";
import dagre from "dagre";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const defaultEdgeOptions = {
  type: "turbo",
  markerEnd: "edge-circle",
};

const NodeTree = ({
  className,
  initialNodes,
  initialEdges,
}: {
  className?: string;
  initialNodes: any;
  initialEdges: any;
}) => {
  const searchParams = useSearchParams();
  const [isVertical, setIsVertical] = useState(true);
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeTypes = useMemo(
    () => ({
      turbo: TurboNode,
    }),
    []
  );
  const edgeTypes = useMemo(
    () => ({
      turbo: TurboEdge,
    }),
    []
  );

  const nodeWidth = 300;
  const nodeHeight = 120;

  const getLayoutedElements = useCallback(
    (nodes: any, edges: any, direction = "TB") => {
      const isHorizontal = direction === "LR";
      dagreGraph.setGraph({ rankdir: direction });

      nodes?.forEach((node: any) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });

      edges?.forEach((edge: any) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      nodes?.forEach((node: any) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? "left" : "top";
        node.sourcePosition = isHorizontal ? "right" : "bottom";

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        };

        return node;
      });

      return { nodes, edges };
    },
    [dagreGraph]
  );

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const onLayout = useCallback(
    (direction: string) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [getLayoutedElements, nodes, edges, setNodes, setEdges]
  );
  const onConnect = useCallback(
    (params: any) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  const proOptions = { hideAttribution: true };
  return (
    <div style={{ height: 800 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        proOptions={proOptions}
        className={cn("bg-transparent dark:text-gray-900", className)}
      >
        <Panel className="mr-16 flex space-x-2" position="top-right">
          <Button
            variant={isVertical ? "default" : "secondary"}
            onClick={() => {
              onLayout("TB");
              setIsVertical(true);
            }}
          >
            <svg
              fill="none"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                height="5"
                rx="0.6"
                stroke="currentColor"
                strokeWidth="1.5"
                transform="matrix(1 0 0 -1 3 22)"
                width="7"
              />
              <rect
                height="5"
                rx="0.6"
                stroke="currentColor"
                strokeWidth="1.5"
                transform="matrix(1 0 0 -1 8.5 7)"
                width="7"
              />
              <rect
                height="5"
                rx="0.6"
                stroke="currentColor"
                strokeWidth="1.5"
                transform="matrix(1 0 0 -1 14 22)"
                width="7"
              />
              <path
                d="M6.5 17V13.5C6.5 12.3954 7.39543 11.5 8.5 11.5H15.5C16.6046 11.5 17.5 12.3954 17.5 13.5V17"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M12 11.5V7" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Button>
          <Button
            variant={isVertical ? "secondary" : "default"}
            onClick={() => {
              onLayout("LR");
              setIsVertical(false);
            }}
          >
            <svg
              fill="none"
              height="24"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                height="5"
                rx="0.6"
                stroke="currentColor"
                strokeWidth="1.5"
                transform="matrix(0 -1 -1 0 22 21)"
                width="7"
              />
              <rect
                height="5"
                rx="0.6"
                stroke="currentColor"
                strokeWidth="1.5"
                transform="matrix(0 -1 -1 0 7 15.5)"
                width="7"
              />
              <rect
                height="5"
                rx="0.6"
                stroke="currentColor"
                strokeWidth="1.5"
                transform="matrix(0 -1 -1 0 22 10)"
                width="7"
              />
              <path
                d="M17 17.5H13.5C12.3954 17.5 11.5 16.6046 11.5 15.5V8.5C11.5 7.39543 12.3954 6.5 13.5 6.5H17"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M11.5 12H7" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Button>
        </Panel>
        <Controls position="top-right" />
      </ReactFlow>
    </div>
  );
};

export default NodeTree;
