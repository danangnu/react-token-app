import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import api from '../api';

interface Debt {
  id: number;
  fromUserId: number;
  toUserId: number;
  amount: number;
  isSettled: boolean;
}

const DetectLoopsPage: React.FC = () => {
  const [cycles, setCycles] = useState<Debt[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewAfterOffset, setViewAfterOffset] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCycles = async () => {
    setLoading(true);
    try {
      const endpoint = viewAfterOffset
        ? '/debts/offset-cycles'
        : '/debts/cycles';

      const response = await api[viewAfterOffset ? 'post' : 'get'](endpoint);
      setCycles(response.data);
      setCurrentIndex(0);
    } catch (err) {
      console.error('Failed to fetch cycles:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCycles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewAfterOffset]);

  const buildGraphFromCycle = (cycle: Debt[]): { nodes: Node[]; edges: Edge[] } => {
    const userIds = Array.from(
      new Set(cycle.flatMap(d => [d.fromUserId, d.toUserId]))
    );

    const radius = 200;
    const angleStep = (2 * Math.PI) / userIds.length;

    const nodes: Node[] = userIds.map((userId, i) => ({
      id: String(userId),
      data: { label: `User ${userId}` },
      position: {
        x: radius * Math.cos(i * angleStep),
        y: radius * Math.sin(i * angleStep),
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        padding: 10,
        borderRadius: 8,
        border: '1px solid #555',
        backgroundColor: '#1f2937',
        color: '#fff',
      },
    }));

    const edges: Edge[] = cycle.map((debt, index) => ({
      id: `e-${index}`,
      source: String(debt.fromUserId),
      target: String(debt.toUserId),
      label: `${debt.amount} tokens`,
      animated: !debt.isSettled,
      style: { stroke: debt.isSettled ? '#4ade80' : '#60a5fa' },
      labelStyle: {
        fill: debt.isSettled ? '#4ade80' : '#93c5fd',
        fontWeight: 600,
        fontSize: 12,
      },
    }));

    return { nodes, edges };
  };

  const currentCycle = cycles[currentIndex] || [];
  const { nodes, edges } = buildGraphFromCycle(currentCycle);

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Debt Cycle Visualization</h2>
        <div className="space-x-3">
          <button
            className={`px-4 py-2 rounded ${!viewAfterOffset ? 'bg-blue-500' : 'bg-gray-600'}`}
            onClick={() => setViewAfterOffset(false)}
          >
            Before Offset
          </button>
          <button
            className={`px-4 py-2 rounded ${viewAfterOffset ? 'bg-green-500' : 'bg-gray-600'}`}
            onClick={() => setViewAfterOffset(true)}
          >
            After Offset
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading cycles...</p>
      ) : cycles.length === 0 ? (
        <p className="text-gray-400">No cycles detected.</p>
      ) : (
        <div className="h-[500px] bg-gray-800 rounded-lg border border-gray-700">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            fitViewOptions={{ padding: 0.5 }}
          >
            <Background />
            <Controls />
          </ReactFlow>

          <div className="flex justify-between items-center mt-4 px-4">
            <button
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-300">
              Cycle {currentIndex + 1} of {cycles.length}
            </span>
            <button
              onClick={() => setCurrentIndex(i => Math.min(cycles.length - 1, i + 1))}
              disabled={currentIndex === cycles.length - 1}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetectLoopsPage;
