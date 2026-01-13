'use client';

import { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  name: string;
  handle?: string;
  role?: string;
  era?: string;
  connections: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface Link {
  id: string;
  source: string | Node;
  target: string | Node;
  type: string;
  year: number;
  description: string;
}

interface NetworkData {
  nodes: Node[];
  links: Link[];
  stats: {
    totalPeople: number;
    totalConnections: number;
    yearRange: { min: number; max: number };
    mostConnected: { name: string; connections: number }[];
  };
}

// Relationship type colors
const RELATIONSHIP_COLORS: Record<string, string> = {
  'co-founder': '#10B981', // green
  'mentor': '#8B5CF6', // purple
  'investor': '#F59E0B', // amber
  'colleague': '#3B82F6', // blue
  'spouse': '#EC4899', // pink
  'covered': '#6B7280', // gray
  'documented': '#6B7280', // gray
};

export default function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<NetworkData | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [yearFilter, setYearFilter] = useState<number>(2015);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulation state
  const nodesRef = useRef<Node[]>([]);
  const linksRef = useRef<Link[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    fetch('/api/network')
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setData(d);
          // Initialize node positions
          const nodes = d.nodes.map((n: Node, i: number) => ({
            ...n,
            x: 400 + Math.cos(i * 0.5) * 200 + Math.random() * 100,
            y: 300 + Math.sin(i * 0.5) * 200 + Math.random() * 100,
            vx: 0,
            vy: 0
          }));
          nodesRef.current = nodes;
          linksRef.current = d.links;
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Force simulation
  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Build node map for link lookups
    const nodeMap = new Map<string, Node>();
    nodesRef.current.forEach(n => nodeMap.set(n.id, n));

    const simulate = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current.filter(l => (l.year || 0) <= yearFilter);

      // Apply forces
      for (const node of nodes) {
        // Center gravity
        node.vx! += (centerX - node.x!) * 0.001;
        node.vy! += (centerY - node.y!) * 0.001;

        // Repulsion between all nodes
        for (const other of nodes) {
          if (node.id === other.id) continue;
          const dx = node.x! - other.x!;
          const dy = node.y! - other.y!;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 500 / (dist * dist);
          node.vx! += (dx / dist) * force;
          node.vy! += (dy / dist) * force;
        }
      }

      // Link attraction
      for (const link of links) {
        const source = typeof link.source === 'string' ? nodeMap.get(link.source) : link.source;
        const target = typeof link.target === 'string' ? nodeMap.get(link.target) : link.target;
        if (!source || !target) continue;

        const dx = target.x! - source.x!;
        const dy = target.y! - source.y!;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 100) * 0.01;

        source.vx! += (dx / dist) * force;
        source.vy! += (dy / dist) * force;
        target.vx! -= (dx / dist) * force;
        target.vy! -= (dy / dist) * force;
      }

      // Apply velocity and damping
      for (const node of nodes) {
        node.vx! *= 0.9;
        node.vy! *= 0.9;
        node.x! += node.vx!;
        node.y! += node.vy!;

        // Boundary constraints
        node.x = Math.max(50, Math.min(width - 50, node.x!));
        node.y = Math.max(50, Math.min(height - 50, node.y!));
      }

      // Draw
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, width, height);

      // Draw links
      for (const link of links) {
        const source = typeof link.source === 'string' ? nodeMap.get(link.source) : link.source;
        const target = typeof link.target === 'string' ? nodeMap.get(link.target) : link.target;
        if (!source || !target) continue;

        ctx.beginPath();
        ctx.moveTo(source.x!, source.y!);
        ctx.lineTo(target.x!, target.y!);
        ctx.strokeStyle = RELATIONSHIP_COLORS[link.type] || '#374151';
        ctx.lineWidth = selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id) ? 2 : 0.5;
        ctx.globalAlpha = selectedNode && (selectedNode.id === source.id || selectedNode.id === target.id) ? 1 : 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw nodes
      for (const node of nodes) {
        const radius = 5 + Math.min(node.connections * 2, 20);
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const isConnected = selectedNode && links.some(l => {
          const srcId = typeof l.source === 'string' ? l.source : l.source.id;
          const tgtId = typeof l.target === 'string' ? l.target : l.target.id;
          return (srcId === selectedNode.id && tgtId === node.id) ||
                 (tgtId === selectedNode.id && srcId === node.id);
        });

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, radius, 0, Math.PI * 2);

        if (isSelected) {
          ctx.fillStyle = '#F59E0B';
        } else if (isConnected) {
          ctx.fillStyle = '#3B82F6';
        } else if (isHovered) {
          ctx.fillStyle = '#10B981';
        } else {
          ctx.fillStyle = '#64748B';
        }
        ctx.globalAlpha = selectedNode && !isSelected && !isConnected ? 0.3 : 1;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Node label
        if (isSelected || isHovered || isConnected || node.connections > 3) {
          ctx.fillStyle = '#F8FAFC';
          ctx.font = isSelected || isHovered ? 'bold 12px system-ui' : '10px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(node.name, node.x!, node.y! + radius + 14);
        }
      }

      animationRef.current = requestAnimationFrame(simulate);
    };

    simulate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [data, yearFilter, selectedNode, hoveredNode]);

  // Mouse interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);

      const clicked = nodesRef.current.find(n => {
        const dx = n.x! - x;
        const dy = n.y! - y;
        const radius = 5 + Math.min(n.connections * 2, 20);
        return Math.sqrt(dx * dx + dy * dy) < radius;
      });

      setSelectedNode(clicked || null);
    };

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);

      const hovered = nodesRef.current.find(n => {
        const dx = n.x! - x;
        const dy = n.y! - y;
        const radius = 5 + Math.min(n.connections * 2, 20);
        return Math.sqrt(dx * dx + dy * dy) < radius;
      });

      setHoveredNode(hovered || null);
      canvas.style.cursor = hovered ? 'pointer' : 'default';
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMove);

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMove);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-slate-900 rounded-xl">
        <div className="text-white">Loading network...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline slider */}
      <div className="absolute top-4 left-4 right-4 z-10 bg-slate-800/90 backdrop-blur rounded-lg p-4">
        <div className="flex items-center gap-4">
          <span className="text-white text-sm font-medium">Year: {yearFilter}</span>
          <input
            type="range"
            min={data?.stats.yearRange.min || 1994}
            max={data?.stats.yearRange.max || 2015}
            value={yearFilter}
            onChange={(e) => setYearFilter(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-slate-400 text-xs">
            {data?.links.filter(l => l.year <= yearFilter).length || 0} connections
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-800/90 backdrop-blur rounded-lg p-3">
        <div className="text-xs text-slate-400 mb-2">Connection Types</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(RELATIONSHIP_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-white text-xs">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected node info */}
      {selectedNode && (
        <div className="absolute top-20 right-4 z-10 bg-slate-800/95 backdrop-blur rounded-lg p-4 max-w-xs">
          <h3 className="text-white font-bold text-lg">{selectedNode.name}</h3>
          {selectedNode.handle && <p className="text-slate-400 text-sm">{selectedNode.handle}</p>}
          {selectedNode.role && <p className="text-slate-300 text-sm mt-1">{selectedNode.role}</p>}
          {selectedNode.era && <p className="text-slate-400 text-xs mt-1">Era: {selectedNode.era}</p>}
          <p className="text-amber-400 text-sm mt-2">{selectedNode.connections} connections</p>
          <button
            onClick={() => setSelectedNode(null)}
            className="text-slate-500 text-xs mt-2 hover:text-white"
          >
            × Clear selection
          </button>
        </div>
      )}

      {/* Stats panel */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-800/90 backdrop-blur rounded-lg p-3">
        <div className="text-xs text-slate-400 mb-1">Network Stats</div>
        <div className="text-white text-sm">{data?.stats.totalPeople} people</div>
        <div className="text-white text-sm">{data?.stats.totalConnections} connections</div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-[600px] rounded-xl"
      />
    </div>
  );
}
