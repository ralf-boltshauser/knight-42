"use client";
import "@xyflow/react/dist/style.css";

import { layoutWithElk } from "@/lib/layout-elk";
import { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { AssetNode } from "./asset-node";
import { ComponentNode } from "./component-node";
import { GroupNode } from "./group-node";
import { HealthStatus, updateComponentStatusAction } from "./service-actions";
import { ServiceNode } from "./service-node";

const nodeTypes: NodeTypes = {
  service: ServiceNode,
  group: GroupNode,
  component: ComponentNode,
  asset: AssetNode,
};

interface Component {
  id: string;
  name: string;
  isUp: boolean;
  hosting: ComponentHosting[];
}

interface ComponentHosting {
  id: string;
  role: string | null;
  asset: Asset;
}

interface Asset {
  id: string;
  name: string;
  identifier: string;
  type: string;
  assetUptimes: AssetUptime[];
}

interface AssetUptime {
  id: string;
  up: boolean;
  timestamp: Date;
}

interface DependencyItem {
  component: Component;
}

interface DependencyGroup {
  id: string;
  name: string | null;
  operator: "AND" | "OR";
  items: DependencyItem[];
  childGroups: DependencyGroup[];
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  owner: string | null;
  missionCritical: boolean;
  healthStatus: HealthStatus;
  rootGroup: DependencyGroup | null;
}

interface ServiceDependencyGraphProps {
  service: Service;
}

function ServiceDependencyFlow({ service }: ServiceDependencyGraphProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { fitView } = useReactFlow();

  const handleComponentStatusChange = async (
    componentId: string,
    newStatus: boolean
  ) => {
    try {
      const result = await updateComponentStatusAction(componentId, newStatus);
      if (result.success) {
        // Refresh the page to get updated data
        window.location.reload();
      } else {
        console.error("Failed to update component status:", result.error);
      }
    } catch (error) {
      console.error("Error updating component status:", error);
    }
  };

  // Generate initial nodes and edges without positions
  const { initialNodes, initialEdges } = useMemo(() => {
    if (!service.rootGroup) {
      return { initialNodes: [], initialEdges: [] };
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Add service node
    nodes.push({
      id: `service-${service.id}`,
      type: "service",
      position: { x: 0, y: 0 }, // Will be positioned by ELK
      data: {
        name: service.name,
        healthStatus: service.healthStatus,
        missionCritical: service.missionCritical,
      },
    });

    // Process groups and components
    const processGroup = (group: DependencyGroup, parentId: string) => {
      const groupId = `group-${group.id}`;
      const groupHealth = calculateGroupHealth(group);

      nodes.push({
        id: groupId,
        type: "group",
        position: { x: 0, y: 0 }, // Will be positioned by ELK
        data: {
          name: group.name || `${group.operator} Group`,
          operator: group.operator,
          healthStatus: groupHealth,
        },
      });

      edges.push({
        id: `edge-${parentId}-${groupId}`,
        source: parentId,
        target: groupId,
        type: "smoothstep",
        style: { strokeWidth: 2 },
      });

      // Add components
      group.items.forEach((item: DependencyItem) => {
        const componentId = `component-${item.component.id}`;

        nodes.push({
          id: componentId,
          type: "component",
          position: { x: 0, y: 0 }, // Will be positioned by ELK
          data: {
            name: item.component.name,
            healthStatus: calculateComponentHealth(item.component),
            componentId: item.component.id,
            onStatusChange: handleComponentStatusChange,
          },
        });

        edges.push({
          id: `edge-${groupId}-${componentId}`,
          source: groupId,
          target: componentId,
          type: "smoothstep",
          style: { strokeWidth: 1.5 },
        });

        // Add assets for this component
        item.component.hosting.forEach((hosting: ComponentHosting) => {
          const assetId = `asset-${hosting.asset.id}`;

          // Get the latest uptime status
          const latestUptime = hosting.asset.assetUptimes[0];
          const assetHealthStatus = latestUptime
            ? latestUptime.up
              ? "UP"
              : "DOWN"
            : "UP";

          nodes.push({
            id: assetId,
            type: "asset",
            position: { x: 0, y: 0 }, // Will be positioned by ELK
            data: {
              name: hosting.asset.name,
              identifier: hosting.asset.identifier,
              type: hosting.asset.type,
              healthStatus: assetHealthStatus,
              role: hosting.role,
            },
          });

          edges.push({
            id: `edge-${componentId}-${assetId}`,
            source: componentId,
            target: assetId,
            type: "smoothstep",
            style: { strokeWidth: 1 },
          });
        });
      });

      // Process child groups
      group.childGroups.forEach((childGroup: DependencyGroup) => {
        processGroup(childGroup, groupId);
      });
    };

    // Process root group
    processGroup(service.rootGroup, `service-${service.id}`);

    return { initialNodes: nodes, initialEdges: edges };
  }, [service]);

  // Apply ELK layout when nodes/edges change
  useEffect(() => {
    if (initialNodes.length === 0) return;

    (async () => {
      const { nodes: laidOutNodes, edges: laidOutEdges } = await layoutWithElk(
        initialNodes,
        initialEdges,
        {
          direction: "DOWN",
          nodeSpacing: 100,
          layerSpacing: 150,
        }
      );

      setNodes(laidOutNodes);
      setEdges(laidOutEdges);

      // Fit view after layout
      requestAnimationFrame(() => {
        fitView({ padding: 0.2 });
      });
    })();
  }, [initialNodes, initialEdges, fitView]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-left"
        defaultEdgeOptions={{
          style: { strokeWidth: 2 },
          type: "smoothstep",
        }}
      >
        <Background color="#f1f5f9" gap={20} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === "service") return "#3b82f6";
            if (node.type === "group") return "#8b5cf6";
            return "#10b981";
          }}
          style={{ backgroundColor: "#f8fafc" }}
        />
      </ReactFlow>
    </div>
  );
}

function calculateComponentHealth(component: Component): HealthStatus {
  // If component itself is marked as down, it's down regardless of assets
  if (!component.isUp) return "DOWN";

  // If no hosting assets, assume component is up
  if (component.hosting.length === 0) return "UP";

  // Check asset health status
  const assetHealthStatuses = component.hosting.map((hosting) => {
    const latestUptime = hosting.asset.assetUptimes[0];
    return latestUptime ? (latestUptime.up ? "UP" : "DOWN") : "UP";
  });

  // If all assets are down, component is down
  if (assetHealthStatuses.every((status) => status === "DOWN")) {
    return "DOWN";
  }

  // If some assets are down, component is degraded
  if (assetHealthStatuses.some((status) => status === "DOWN")) {
    return "DEGRADED";
  }

  // If all assets are up, component is up
  return "UP";
}

function calculateGroupHealth(group: DependencyGroup): HealthStatus {
  const componentHealth = group.items.map((item: DependencyItem) =>
    calculateComponentHealth(item.component)
  );
  const childGroupHealth = group.childGroups.map((child: DependencyGroup) =>
    calculateGroupHealth(child)
  );

  const allHealthValues = [...componentHealth, ...childGroupHealth];

  if (allHealthValues.length === 0) return "UP";

  if (group.operator === "AND") {
    if (allHealthValues.every((status) => status === "UP")) return "UP";
    if (allHealthValues.some((status) => status === "DOWN")) return "DOWN";
    return "DEGRADED";
  } else {
    if (allHealthValues.every((status) => status === "UP")) return "UP";
    if (allHealthValues.every((status) => status === "DOWN")) return "DOWN";
    return "DEGRADED";
  }
}

export function ServiceDependencyGraph({
  service,
}: ServiceDependencyGraphProps) {
  return (
    <ReactFlowProvider>
      <ServiceDependencyFlow service={service} />
    </ReactFlowProvider>
  );
}
