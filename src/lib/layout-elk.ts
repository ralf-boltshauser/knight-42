import ELK, { ElkExtendedEdge, ElkNode } from "elkjs/lib/elk.bundled.js";
import { Edge, Node, Position } from "reactflow";

const elk = new ELK();

type LayoutOpts = {
  direction?: "DOWN" | "RIGHT" | "UP" | "LEFT";
  nodeSpacing?: number;
  layerSpacing?: number;
};

export async function layoutWithElk(
  nodes: Node[],
  edges: Edge[],
  { direction = "DOWN", nodeSpacing = 80, layerSpacing = 120 }: LayoutOpts = {}
) {
  // Build ELK graph
  const elkGraph: ElkNode = {
    id: "root",
    layoutOptions: {
      // Layered = hierarchical tree/DAG layout
      "elk.algorithm": "layered",
      "elk.direction": direction, // DOWN = top→down
      // Keep parents centered over children:
      "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
      "elk.layered.nodePlacement.bk.fixedAlignment": "CENTER",
      // Avoid overlaps / set spacing:
      "elk.spacing.nodeNode": String(nodeSpacing),
      "elk.layered.spacing.nodeNodeBetweenLayers": String(layerSpacing),
      "elk.edgeRouting": "ORTHOGONAL",
      "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES",
    },
    children: nodes.map((n) => {
      // Set appropriate dimensions based on node type
      let width = 180;
      let height = 60;

      if (n.type === "service") {
        width = 256;
        height = 80;
      } else if (n.type === "group") {
        width = 192;
        height = 70;
      } else if (n.type === "component") {
        width = 144;
        height = 50;
      } else if (n.type === "asset") {
        width = 120;
        height = 60;
      }

      return {
        id: n.id,
        width: Math.max(
          1,
          (n as Node & { measured?: { width?: number; height?: number } })
            .measured?.width ??
            n.width ??
            width
        ),
        height: Math.max(
          1,
          (n as Node & { measured?: { width?: number; height?: number } })
            .measured?.height ??
            n.height ??
            height
        ),
      };
    }),
    edges: edges.map(
      (e) =>
        ({
          id: e.id,
          sources: [e.source],
          targets: [e.target],
        } as ElkExtendedEdge)
    ),
  };

  const res = await elk.layout(elkGraph);

  const laidOutNodes: Node[] =
    res.children?.map((c) => {
      const orig = nodes.find((n) => n.id === c.id)!;
      return {
        ...orig,
        position: { x: c.x ?? 0, y: c.y ?? 0 },
        // Helpful defaults for layered top→down:
        sourcePosition:
          direction === "RIGHT" ? Position.Right : Position.Bottom,
        targetPosition: direction === "RIGHT" ? Position.Left : Position.Top,
      };
    }) ?? nodes;

  return { nodes: laidOutNodes, edges };
}
