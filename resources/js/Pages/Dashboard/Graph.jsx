import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Share2, Filter, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import axios from 'axios';

// Custom node styles
const CustomNode = ({ data }) => (
  <div className={`px-4 py-2.5 rounded-2xl border text-sm font-semibold shadow-sm min-w-[120px] text-center ${data.nodeStyle}`}>
    <Handle type="target" position={Position.Top} className="!bg-ui-black !border-white !w-2 !h-2" />
    {data.icon && <span className="mr-1.5">{data.icon}</span>}
    {data.label}
    <Handle type="source" position={Position.Bottom} className="!bg-ui-black !border-white !w-2 !h-2" />
  </div>
);

const nodeTypes = { custom: CustomNode };

const fallbackNodes = [
  { id: '1', type: 'custom', position: { x: 400, y: 50 }, data: { label: 'NexusAI Platform', nodeStyle: 'bg-ui-black text-white border-ui-black', icon: '🧠' } },
  { id: '2', type: 'custom', position: { x: 100, y: 180 }, data: { label: 'NLP Research', nodeStyle: 'bg-white text-ui-heading border-ui-border', icon: '📝' } },
  { id: '3', type: 'custom', position: { x: 380, y: 200 }, data: { label: 'AI / ML', nodeStyle: 'bg-white text-ui-heading border-ui-border', icon: '🤖' } },
  { id: '4', type: 'custom', position: { x: 660, y: 180 }, data: { label: 'Materials Science', nodeStyle: 'bg-white text-ui-heading border-ui-border', icon: '⚗️' } },
  { id: '5', type: 'custom', position: { x: 0, y: 340 }, data: { label: 'LLM Fine-tuning', nodeStyle: 'bg-bg-main text-ui-heading border-ui-border', icon: '🔧' } },
  { id: '6', type: 'custom', position: { x: 200, y: 340 }, data: { label: 'Semantic Search', nodeStyle: 'bg-bg-main text-ui-heading border-ui-border', icon: '🔍' } },
  { id: '7', type: 'custom', position: { x: 340, y: 340 }, data: { label: 'Vector DB', nodeStyle: 'bg-bg-main text-ui-heading border-ui-border', icon: '🗄️' } },
  { id: '8', type: 'custom', position: { x: 500, y: 340 }, data: { label: 'Knowledge Graph', nodeStyle: 'bg-bg-main text-ui-heading border-ui-border', icon: '🕸️' } },
  { id: '9', type: 'custom', position: { x: 660, y: 340 }, data: { label: 'Lithium Batteries', nodeStyle: 'bg-bg-main text-ui-heading border-ui-border', icon: '🔋' } },
  { id: '10', type: 'custom', position: { x: 800, y: 340 }, data: { label: 'Graphene', nodeStyle: 'bg-bg-main text-ui-heading border-ui-border', icon: '🔬' } },
  { id: '11', type: 'custom', position: { x: 100, y: 490 }, data: { label: 'Medical AI', nodeStyle: 'bg-bg-main text-ui-heading border-ui-border', icon: '🏥' } },
  { id: '12', type: 'custom', position: { x: 400, y: 490 }, data: { label: 'Embeddings', nodeStyle: 'bg-bg-main text-ui-heading border-ui-border', icon: '📊' } },
  { id: '13', type: 'custom', position: { x: 700, y: 490 }, data: { label: 'Quantum Computing', nodeStyle: 'bg-bg-main text-ui-heading border-ui-border', icon: '⚛️' } },
];

const fallbackEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#111', strokeWidth: 1.5 } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#111', strokeWidth: 1.5 } },
  { id: 'e1-4', source: '1', target: '4', animated: true, style: { stroke: '#111', strokeWidth: 1.5 } },
  { id: 'e2-5', source: '2', target: '5', style: { stroke: '#E5E7EB', strokeWidth: 1 } },
  { id: 'e2-6', source: '2', target: '6', style: { stroke: '#E5E7EB', strokeWidth: 1 } },
  { id: 'e3-6', source: '3', target: '6', style: { stroke: '#E5E7EB', strokeWidth: 1 } },
  { id: 'e3-7', source: '3', target: '7', style: { stroke: '#E5E7EB', strokeWidth: 1 } },
  { id: 'e3-8', source: '3', target: '8', style: { stroke: '#E5E7EB', strokeWidth: 1 } },
  { id: 'e4-9', source: '4', target: '9', style: { stroke: '#E5E7EB', strokeWidth: 1 } },
  { id: 'e4-10', source: '4', target: '10', style: { stroke: '#E5E7EB', strokeWidth: 1 } },
  { id: 'e5-11', source: '5', target: '11', style: { stroke: '#E5E7EB', strokeWidth: 1 } },
  { id: 'e7-12', source: '7', target: '12', style: { stroke: '#E5E7EB', strokeWidth: 1 } },
  { id: 'e9-13', source: '9', target: '13', style: { stroke: '#E5E7EB', strokeWidth: 1 } },
  { id: 'e10-13', source: '10', target: '13', style: { stroke: '#E5E7EB', strokeWidth: 1 } },
];

const filters = ['All', 'NLP', 'AI/ML', 'Materials', 'Energy', 'Medical'];

export default function Graph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(fallbackNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(fallbackEdges);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/graph/data');
        if (response.data.nodes?.length > 0) {
          setNodes(response.data.nodes);
          setEdges(response.data.edges);
        }
      } catch (error) {
        // Keep fallback nodes on error
      } finally {
        setLoading(false);
      }
    };
    fetchGraphData();
  }, []);

  return (
    <DashboardLayout>
      <div className="h-full w-full flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-ui-heading">Knowledge Graph</h1>
            <p className="text-ui-muted text-sm">Interactive visualization of topics, papers, and technologies across your R&D corpus.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setNodes(fallbackNodes); setEdges(fallbackEdges); }}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-bg-main border border-ui-border rounded-xl text-sm font-medium transition-colors text-ui-heading"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-ui-black text-white hover:bg-gray-900 rounded-xl text-sm font-medium transition-colors">
              <Share2 className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ui-muted shrink-0" />
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeFilter === f ? 'bg-ui-black text-white' : 'bg-white border border-ui-border text-ui-muted hover:text-ui-black hover:border-ui-black'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-ui-muted">{nodes.length} nodes · {edges.length} connections</span>
        </div>

        {/* Graph Canvas */}
        <div className="flex-1 rounded-3xl border border-ui-border bg-white overflow-hidden shadow-sm" style={{ minHeight: '520px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Controls className="!bg-white !border !border-ui-border !rounded-xl !shadow-sm" />
            <MiniMap
              className="!bg-bg-main !border !border-ui-border !rounded-xl"
              nodeColor={(node) => node.data?.nodeStyle?.includes('bg-ui-black') ? '#000' : '#E5E7EB'}
              maskColor="rgba(247,247,248,0.7)"
            />
            <Background color="#E5E7EB" gap={24} size={1} />
          </ReactFlow>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 px-2">
          <span className="text-xs text-ui-muted font-semibold uppercase tracking-wider">Legend</span>
          {[{ label: 'Core Platform', style: 'bg-ui-black' }, { label: 'Domain', style: 'bg-white border border-ui-border' }, { label: 'Topic', style: 'bg-bg-main border border-ui-border' }].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-md ${l.style}`}></div>
              <span className="text-xs text-ui-muted">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
