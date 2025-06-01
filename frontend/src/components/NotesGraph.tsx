import React, { useEffect, useRef, useState } from 'react';
import type { Note } from '@/hooks/notes';
import * as d3 from 'd3';
import { Link } from '@tanstack/react-router';

interface NotesGraphProps {
  notes: Note[];
  onNodeClick?: (noteId: string) => void;
  onRefresh?: () => void;
  onAcceptSuggestion?: (sourceId: string, targetId: string) => void;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  tags: string[];
  radius: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: GraphNode;
  target: GraphNode;
  value: number;
  suggested?: boolean;  // Flag for suggested relationships
}

interface HoverMenuProps {
  note: Note;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onRefresh: () => void;
}

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sourceNote: Note | null;
  targetNote: Note | null;
  position: { x: number; y: number } | null;
}

const HoverMenu: React.FC<HoverMenuProps> = ({ note, position, onClose, onRefresh }) => {
  if (!position) return null;

  return (
    <div
      className="absolute bg-white rounded-bl-lg shadow-lg p-4 w-64 z-50 border-b border-l border-gray-200"
      style={{
        top: -60,
        right: -20,
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 pr-6">{note.title}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm font-medium text-gray-500">Tags:</div>
          <button
            onClick={onRefresh}
            className="p-1.5 text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            aria-label="Refresh graph"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-500 mb-1">Comprehension Score:</div>
        <div className="flex items-center">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${note.accuracy || 0}%` }}
            />
          </div>
          <span className="ml-2 text-sm text-gray-600">{note.accuracy || 0}%</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Link
          to="/quiz-selection"
          search={{ noteId: note.id }}
          className="flex-1 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-indigo-700 transition-colors text-center"
        >
          Start Quiz
        </Link>
      </div>
    </div>
  );
};

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sourceNote,
  targetNote,
  position
}) => {
  if (!isOpen || !sourceNote || !targetNote || !position) return null;

  return (
    <div 
      className="fixed z-50"
      style={{
        top: position.y - 30, // Position above the click point
        left: position.x + 195, // Position slightly to the right of click point
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-4 w-64 border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Spotted a relationship here</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3 mb-4">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">From:</div>
            <div className="text-sm text-gray-900">{sourceNote.title}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">To:</div>
            <div className="text-sm text-gray-900">{targetNote.title}</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-indigo-700 transition-colors text-center"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

const NotesGraph: React.FC<NotesGraphProps> = ({ 
  notes, 
  onNodeClick, 
  onRefresh = () => {},
  onAcceptSuggestion = () => {} 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNote, setHoveredNote] = useState<Note | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedLink, setSelectedLink] = useState<{ source: Note; target: Note; position: { x: number; y: number } } | null>(null);

  useEffect(() => {
    if (!svgRef.current || !notes.length) return;

    console.log('Rendering graph with notes:', notes);

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create nodes from notes
    const nodes: GraphNode[] = notes.map(note => ({
      id: note.id,
      title: note.title,
      tags: note.tags,
      radius: 10,
      x: undefined,
      y: undefined
    }));

    // Create links between notes based on shared tags and add suggested links for lonely nodes
    const links: GraphLink[] = [];
    const nodeConnections = new Map<string, number>();
    const existingRelationships = new Set<string>();

    // First, create regular links based on relationships
    notes.forEach(note => {
      if (note.relationships) {
        note.relationships.forEach(relatedId => {
          const relationshipKey = [note.id, relatedId].sort().join('-');
          if (!existingRelationships.has(relationshipKey)) {
            const relatedNode = nodes.find(n => n.id === relatedId);
            if (relatedNode) {
              console.log('Adding relationship link:', note.id, '→', relatedId);
              links.push({
                source: nodes.find(n => n.id === note.id)!,
                target: relatedNode,
                value: 1,
                suggested: false
              });
              existingRelationships.add(relationshipKey);
              // Count connections
              nodeConnections.set(note.id, (nodeConnections.get(note.id) || 0) + 1);
              nodeConnections.set(relatedId, (nodeConnections.get(relatedId) || 0) + 1);
            }
          }
        });
      }
    });

    // Then, create links based on shared tags (if not already connected)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const sourceNote = notes[i];
        const targetNote = notes[j];
        const relationshipKey = [sourceNote.id, targetNote.id].sort().join('-');
        
        // Skip if there's already a relationship
        if (existingRelationships.has(relationshipKey)) {
          continue;
        }
        
        const sharedTags = nodes[i].tags.filter(tag => nodes[j].tags.includes(tag));
        if (sharedTags.length > 0) {
          console.log('Adding shared tags link:', sourceNote.id, '→', targetNote.id);
          links.push({
            source: nodes[i],
            target: nodes[j],
            value: sharedTags.length,
            suggested: false
          });
          existingRelationships.add(relationshipKey);
          // Count connections
          nodeConnections.set(nodes[i].id, (nodeConnections.get(nodes[i].id) || 0) + 1);
          nodeConnections.set(nodes[j].id, (nodeConnections.get(nodes[j].id) || 0) + 1);
        }
      }
    }

    // Finally, add suggested links for lonely nodes
    nodes.forEach((node, i) => {
      if (!nodeConnections.has(node.id) || nodeConnections.get(node.id) === 0) {
        // Find the most relevant node to suggest a connection with
        const suggestedPartner = nodes.find((n, index) => {
          if (index === i) return false;
          const relationshipKey = [node.id, n.id].sort().join('-');
          return !existingRelationships.has(relationshipKey) && 
                 nodeConnections.get(n.id) && 
                 nodeConnections.get(n.id)! > 0;
        });
        
        if (suggestedPartner) {
          console.log('Adding suggested link:', node.id, '→', suggestedPartner.id);
          links.push({
            source: node,
            target: suggestedPartner,
            value: 1,
            suggested: true
          });
        }
      }
    });

    console.log('Final links:', links);

    // Set up the SVG container
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const svg = d3.select(svgRef.current);

    // Add border rectangle
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 2)
      .attr('rx', 8); // rounded corners

    // Create the simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links)
        .id(d => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody<GraphNode>().strength(-200))
      .force('center', d3.forceCenter<GraphNode>(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius(d => d.radius + 10))
      // Add boundary forces
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));

    // Create the links with different styles for suggested relationships
    const link = svg.append('g')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links)
      .join('line')
      .attr('stroke', d => {
        if (d.suggested) return '#ec4899';  // Tailwind pink-500
        return '#999';
      })
      .attr('stroke-opacity', d => {
        if (d.suggested) return 0.7;
        return 0.6;
      })
      .attr('stroke-width', d => {
        if (d.suggested) return 2;
        return Math.sqrt(d.value);
      })
      .style('stroke-dasharray', d => {
        if (d.suggested) return '6, 3';
        return 'none';
      })
      .style('cursor', d => d.suggested ? 'pointer' : 'default')
      .on('mouseover', (_event, d) => {
        if (d.suggested) {
          d3.select(_event.target)
            .attr('stroke-opacity', 0.9)
            .attr('stroke-width', 3);
        }
      })
      .on('mouseout', (_event, d) => {
        if (d.suggested) {
          d3.select(_event.target)
            .attr('stroke-opacity', 0.7)
            .attr('stroke-width', 2);
        }
      })
      .on('click', (_event, d) => {
        if (d.suggested) {
          const sourceNote = notes.find(n => n.id === (d.source as GraphNode).id);
          const targetNote = notes.find(n => n.id === (d.target as GraphNode).id);
          if (sourceNote && targetNote) {
            setSelectedLink({ 
              source: sourceNote, 
              target: targetNote,
              position: { x: _event.clientX, y: _event.clientY }
            });
            setShowConfirmation(true);
          }
        }
      });

    // Create the nodes
    const node = svg.append('g')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (_event, d) => {
        if (onNodeClick) {
          onNodeClick(d.id);
        }
      });

    // Add circles for nodes with hover behavior
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', '#69b3a2')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .on('mouseenter', (_event, d) => {
        const note = notes.find(n => n.id === d.id);
        if (note) {
          setHoveredNote(note);
          setMenuPosition({ x: 0, y: 0 });
        }
      });

    // Add titles for nodes
    node.append('title')
      .text(d => d.title);

    // Add text labels
    node.append('text')
      .text(d => d.title)
      .attr('x', d => d.radius + 5)
      .attr('y', 3)
      .style('font-size', '10px')
      .style('fill', '#333')
      .style('pointer-events', 'none'); // Make text labels non-interactive

    // Update positions on each tick
    simulation.on('tick', () => {
      // Constrain nodes within boundaries
      nodes.forEach(node => {
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x || 0));
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y || 0));
      });

      link
        .attr('x1', d => d.source.x || 0)
        .attr('y1', d => d.source.y || 0)
        .attr('x2', d => d.target.x || 0)
        .attr('y2', d => d.target.y || 0);

      node
        .attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, unknown>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, unknown>, d: GraphNode) {
      d.fx = Math.max(d.radius, Math.min(width - d.radius, event.x));
      d.fy = Math.max(d.radius, Math.min(height - d.radius, event.y));
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, unknown>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [notes, onNodeClick]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      {hoveredNote && (
        <HoverMenu
          note={hoveredNote}
          position={menuPosition}
          onClose={() => {
            setHoveredNote(null);
            setMenuPosition(null);
          }}
          onRefresh={onRefresh}
        />
      )}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setSelectedLink(null);
        }}
        onConfirm={() => {
          if (selectedLink) {
            onAcceptSuggestion(selectedLink.source.id, selectedLink.target.id);
            setShowConfirmation(false);
            setSelectedLink(null);
          }
        }}
        sourceNote={selectedLink?.source || null}
        targetNote={selectedLink?.target || null}
        position={selectedLink?.position || null}
      />
    </div>
  );
};

export default NotesGraph; 