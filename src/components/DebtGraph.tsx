import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import api from '../api';
import { useAuth } from '../context/AuthContext';

interface DebtEdge {
  fromUser: string; // display name or username (backend returns these)
  toUser: string;
  amount: number;
}

const DebtGraph: React.FC = () => {
  const { user } = useAuth();
  const role = (user?.role || '').toLowerCase();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>('');

  useEffect(() => {
    const fetchDebts = async () => {
      setLoading(true);
      setErr('');

      const token = localStorage.getItem('token') || '';
      const headers = { Authorization: `Bearer ${token}` };

      // choose primary endpoint by role
      const primary = role === 'admin' ? '/debts/admin/graph' : '/debts/my/graph';
      const fallback = '/debts/graph';

      const getGraph = async (url: string) =>
        api.get<DebtEdge[]>(url, { headers }).then(r => r.data);

      try {
        let data: DebtEdge[] = [];

        try {
          data = await getGraph(primary);
        } catch {
          // if role endpoints aren’t implemented yet, try the original
          data = await getGraph(fallback);
        }

        // build nodes/edges
        const userSet = new Set<string>();
        data.forEach(e => {
          if (e.fromUser) userSet.add(e.fromUser);
          if (e.toUser) userSet.add(e.toUser);
        });

        const users = Array.from(userSet);
        // simple grid layout (3 columns)
        const generatedNodes: Node[] = users.map((u, idx) => ({
          id: u,
          data: { label: u },
          position: { x: (idx % 3) * 220, y: Math.floor(idx / 3) * 160 },
          style: {
            padding: 10,
            borderRadius: 8,
            border: '1px solid #4b5563',
            backgroundColor: '#1f2937',
            color: '#fff',
          },
        }));

        const generatedEdges: Edge[] = data.map((d, i) => ({
          id: `e-${i}`,
          source: d.fromUser,
          target: d.toUser,
          label: `${d.amount} Tokens`,
          animated: true,
          style: { stroke: '#facc15' },
          labelStyle: { fill: '#fde68a', fontWeight: 600 },
        }));

        setNodes(generatedNodes);
        setEdges(generatedEdges);
      } catch (e) {
        console.error('Failed to fetch graph data:', e);
        setErr('Failed to load debt graph.');
      } finally {
        setLoading(false);
      }
    };

    fetchDebts();
  }, [role]);

  if (loading) return <p className="text-white">Loading graph...</p>;
  if (err) return <p className="text-red-400">{err}</p>;
  if (nodes.length === 0) return <p className="text-gray-300">No relationships to show.</p>;

  return (
    <div style={{ height: 500 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.4 }}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default DebtGraph;