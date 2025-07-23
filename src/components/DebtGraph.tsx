import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import api from '../api';

interface DebtEdge {
  fromUser: string;
  toUser: string;
  amount: number;
}

const DebtGraph: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const res = await api.get<DebtEdge[]>('/debts/graph', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const rawData = res.data;

        const userSet = new Set<string>();
        rawData.forEach((edge) => {
          userSet.add(edge.fromUser);
          userSet.add(edge.toUser);
        });

        // Map users to node positions
        const userList = Array.from(userSet);
        const nodeMap: Record<string, number> = {};
        userList.forEach((user, index) => {
          nodeMap[user] = index;
        });

        const generatedNodes: Node[] = userList.map((user, idx) => ({
          id: user,
          data: { label: user },
          position: { x: (idx % 3) * 200, y: Math.floor(idx / 3) * 150 }
        }));

        const generatedEdges: Edge[] = rawData.map((debt, idx) => ({
          id: `e-${idx}`,
          source: debt.fromUser,
          target: debt.toUser,
          label: `${debt.amount} Tokens`,
          animated: true,
          style: { stroke: '#facc15' }, // yellow
        }));

        setNodes(generatedNodes);
        setEdges(generatedEdges);
      } catch (err) {
        console.error('Failed to fetch graph data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, []);

  if (loading) return <p className="text-white">Loading graph...</p>;

  return (
    <div style={{ height: 500 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default DebtGraph;
