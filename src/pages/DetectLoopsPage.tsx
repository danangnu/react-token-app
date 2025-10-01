import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import api from '../api';

type Debt = {
  id?: number;
  fromUserId: number;
  toUserId: number;
  amount: number;
  isSettled?: boolean;
};

// Try to coerce various shapes from the backend into Debt[][]
function normalizeCycles(raw: any): Debt[][] {
  if (!raw) return [];

  // Case: { cycles: [...] }
  if (Array.isArray(raw?.cycles)) return normalizeCycles(raw.cycles);

  // Case: already Debt[][]
  if (Array.isArray(raw) && raw.every((item: any) => Array.isArray(item))) {
    return raw.map((arr: any[]) =>
      arr
        .map((d) => ({
          fromUserId: Number(d.fromUserId ?? d.FromUserId ?? d.source ?? d.Source ?? d.from ?? d.From),
          toUserId: Number(d.toUserId ?? d.ToUserId ?? d.target ?? d.Target ?? d.to ?? d.To),
          amount: Number(d.amount ?? d.Amount ?? d.value ?? 0),
          isSettled: Boolean(d.isSettled ?? d.IsSettled ?? false),
          id: d.id ?? d.Id,
        }))
        .filter((d) => Number.isFinite(d.fromUserId) && Number.isFinite(d.toUserId))
    );
  }

  // Case: a single Debt[] (wrap as one cycle)
  if (Array.isArray(raw)) {
    // Array of objects -> treat it as 1 cycle
    if (raw.every((d) => typeof d === 'object')) {
      const oneCycle = raw
        .map((d) => ({
          fromUserId: Number(d.fromUserId ?? d.FromUserId ?? d.source ?? d.Source ?? d.from ?? d.From),
          toUserId: Number(d.toUserId ?? d.ToUserId ?? d.target ?? d.Target ?? d.to ?? d.To),
          amount: Number(d.amount ?? d.Amount ?? d.value ?? 0),
          isSettled: Boolean(d.isSettled ?? d.IsSettled ?? false),
          id: d.id ?? d.Id,
        }))
        .filter((d) => Number.isFinite(d.fromUserId) && Number.isFinite(d.toUserId));
      return oneCycle.length ? [oneCycle] : [];
    }
  }

  // Anything else -> empty
  return [];
}

const DetectLoopsPage: React.FC = () => {
  const [cycles, setCycles] = useState<Debt[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewAfterOffset, setViewAfterOffset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>('');

  const fetchCycles = async () => {
    setLoading(true);
    setErr('');
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const endpoint = viewAfterOffset ? '/debts/offset-cycles' : '/debts/cycles';
      // GET for cycles, POST for offset-cycles (admin only)
      const response = await (viewAfterOffset
        ? api.post(endpoint, null, { headers })
        : api.get(endpoint, { headers }));

      const normalized = normalizeCycles(response.data);
      setCycles(normalized);
      setCurrentIndex(0);
    } catch (e: any) {
      console.error('Failed to fetch cycles:', e);
      setErr(e?.response?.data ?? 'Failed to fetch cycles.');
      setCycles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewAfterOffset]);

  const buildGraphFromCycle = (cycle: Debt[]): { nodes: Node[]; edges: Edge[] } => {
    // Collect unique user ids without flatMap
    const userSet = new Set<number>();
    for (const d of cycle) {
      if (Number.isFinite(d.fromUserId)) userSet.add(d.fromUserId);
      if (Number.isFinite(d.toUserId)) userSet.add(d.toUserId);
    }
    const userIds = Array.from(userSet);

    const radius = 200;
    const angleStep = userIds.length ? (2 * Math.PI) / userIds.length : 1;

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

  const currentCycle: Debt[] = Array.isArray(cycles[currentIndex]) ? cycles[currentIndex] : [];
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
      ) : err ? (
        <p className="text-red-400">{String(err)}</p>
      ) : !cycles.length ? (
        <p className="text-gray-400">No cycles detected.</p>
      ) : (
        <>
          <div className="h-[500px] bg-gray-800 rounded-lg border border-gray-700">
            <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.5 }}>
              <Background />
              <Controls />
            </ReactFlow>
          </div>

          <div className="flex justify-between items-center mt-4 px-1">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-300">
              Cycle {currentIndex + 1} of {cycles.length}
            </span>
            <button
              onClick={() => setCurrentIndex((i) => Math.min(cycles.length - 1, i + 1))}
              disabled={currentIndex === cycles.length - 1}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DetectLoopsPage;