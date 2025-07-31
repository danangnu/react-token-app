import React from 'react';
import ReactFlow, { Background, Controls, Edge, Node } from 'react-flow-renderer';

interface UserNode {
  id: string;
  label: string;
}

interface LoopEntry {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

interface LoopGraphProps {
  loop: LoopEntry[]; // Each loop is an array of from ➝ to with amount
}

const LoopGraph: React.FC<LoopGraphProps> = ({ loop }) => {
  const userSet = new Set<string>();
  loop.forEach(entry => {
    userSet.add(entry.fromUserId);
    userSet.add(entry.toUserId);
  });

  const users = Array.from(userSet);

  // Generate node positions in a circle layout
  const radius = 250;
  const centerX = 300;
  const centerY = 300;

  const nodes: Node[] = users.map((id, index) => {
    const angle = (2 * Math.PI * index) / users.length;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return {
      id,
      data: { label: id },
      position: { x, y },
      style: { padding: 10, border: '1px solid #888', borderRadius: 8 },
    };
  });

  const edges: Edge[] = loop.map((entry, index) => ({
    id: `e-${index}`,
    source: entry.fromUserId,
    target: entry.toUserId,
    label: `${entry.amount}`,
    animated: true,
    style: { stroke: '#0ea5e9' },
    labelStyle: { fill: '#0ea5e9', fontWeight: 'bold' },
  }));

  return (
    <div style={{ height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        panOnScroll
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default LoopGraph;