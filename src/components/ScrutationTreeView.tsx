import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Network, 
  Sparkles, 
  BookOpen, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw,
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Flame, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Compass, 
  ArrowRight, 
  Filter, 
  Loader2, 
  Star, 
  PenLine, 
  BookmarkCheck, 
  Save, 
  Search, 
  ListTree, 
  Heart, 
  HelpCircle,
  Clock,
  Wand2
} from 'lucide-react';
import { ScrutationSession, ScrutationNode, CrossReferenceItem } from '../types';
import { getGuaranteedCrossReferences } from '../data/crossReferenceDatabase';
import { audioEngine } from '../utils/audioContemplationEngine';

interface ScrutationTreeViewProps {
  session: ScrutationSession;
  onUpdateSession: (session: ScrutationSession) => void;
  onSaveToJournal?: (session: ScrutationSession) => void;
  onSelectVerseToInspect?: (siglum: string, text: string) => void;
  onOpenPatristicsForSiglum?: (siglum: string) => void;
  onOpenJewishTraditionForSiglum?: (siglum: string) => void;
  onResetTree?: () => void;
}

interface TreeNodeLayout {
  node: ScrutationNode;
  x: number;
  y: number;
  level: number;
  children: TreeNodeLayout[];
}

export const ScrutationTreeView: React.FC<ScrutationTreeViewProps> = ({
  session,
  onUpdateSession,
  onSaveToJournal,
  onOpenPatristicsForSiglum,
  onOpenJewishTraditionForSiglum,
  onResetTree
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(session.nodes[0]?.id || null);
  const [filterTestament, setFilterTestament] = useState<'ALL' | 'ST' | 'NT'>('ALL');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'scrutatio' | 'prayer' | 'tradition'>('scrutatio');
  
  // Custom branch state
  const [isAddingBranch, setIsAddingBranch] = useState<boolean>(false);
  const [newBranchSiglum, setNewBranchSiglum] = useState<string>('');
  const [newBranchText, setNewBranchText] = useState<string>('');
  const [newBranchReason, setNewBranchReason] = useState<string>('');
  const [newBranchTestament, setNewBranchTestament] = useState<'ST' | 'NT'>('NT');
  const [isFetchingVerseText, setIsFetchingVerseText] = useState<boolean>(false);

  // Dynamic AI & Aparat Cross-References
  const [isLoadingAiRefs, setIsLoadingAiRefs] = useState<boolean>(false);
  const [dynamicAiRefs, setDynamicAiRefs] = useState<CrossReferenceItem[]>([]);
  const [theologicalContext, setTheologicalContext] = useState<string>('');
  const [isAutoScrutating, setIsAutoScrutating] = useState<boolean>(false);

  // Meditation questions state
  const [isLoadingMeditation, setIsLoadingMeditation] = useState<boolean>(false);
  const [meditationQuestions, setMeditationQuestions] = useState<string[]>([]);
  const [suggestedWordOfLife, setSuggestedWordOfLife] = useState<string>('');

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const selectedNode = useMemo(() => {
    return session.nodes.find(n => n.id === selectedNodeId) || session.nodes[0];
  }, [session.nodes, selectedNodeId]);

  // Statistics
  const totalNodes = session.nodes.length;
  const stCount = session.nodes.filter(n => n.testament === 'ST').length;
  const ntCount = session.nodes.filter(n => n.testament === 'NT').length;

  // Build tree hierarchy
  const treeData = useMemo(() => {
    const nodeMap = new Map<string, ScrutationNode>();
    session.nodes.forEach(n => nodeMap.set(n.id, n));

    const childrenMap = new Map<string, ScrutationNode[]>();
    session.nodes.forEach(n => {
      const pId = n.parentId || 'root';
      if (!childrenMap.has(pId)) childrenMap.set(pId, []);
      childrenMap.get(pId)!.push(n);
    });

    const rootNode = session.nodes.find(n => !n.parentId) || session.nodes[0];
    if (!rootNode) return null;

    // Recursive layout computation
    let currentY = 50;
    const levelWidth = 340;
    const nodeHeight = 160;

    function layoutSubtree(node: ScrutationNode, level: number): TreeNodeLayout {
      const children = childrenMap.get(node.id) || [];
      const childLayouts: TreeNodeLayout[] = [];

      let myY = currentY;

      if (children.length === 0) {
        currentY += nodeHeight + 45;
      } else {
        children.forEach(child => {
          childLayouts.push(layoutSubtree(child, level + 1));
        });
        // Center parent relative to children
        const firstY = childLayouts[0].y;
        const lastY = childLayouts[childLayouts.length - 1].y;
        myY = (firstY + lastY) / 2;
      }

      return {
        node,
        x: 40 + level * levelWidth,
        y: myY,
        level,
        children: childLayouts
      };
    }

    return layoutSubtree(rootNode, 0);
  }, [session.nodes]);

  // Flattened layout nodes for rendering
  const flatLayoutNodes = useMemo(() => {
    if (!treeData) return [];
    const list: TreeNodeLayout[] = [];
    function traverse(item: TreeNodeLayout) {
      list.push(item);
      item.children.forEach(traverse);
    }
    traverse(treeData);
    return list;
  }, [treeData]);

  // Guaranteed fallback references for selected node
  const guaranteedRefs = useMemo(() => {
    if (!selectedNode) return [];
    return getGuaranteedCrossReferences(selectedNode.siglum, selectedNode.text).crossReferences;
  }, [selectedNode]);

  // Combined references list (AI dynamic + guaranteed)
  const displayReferences = useMemo(() => {
    if (dynamicAiRefs.length > 0) return dynamicAiRefs;
    return guaranteedRefs;
  }, [dynamicAiRefs, guaranteedRefs]);

  // Fetch dynamic AI references for selected node
  const handleFetchAiReferences = async () => {
    if (!selectedNode) return;
    setIsLoadingAiRefs(true);
    try {
      const res = await fetch('/api/scrutation/cross-references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siglum: selectedNode.siglum,
          text: selectedNode.text,
          contextTheme: session.theme || session.title
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.crossReferences && data.crossReferences.length > 0) {
          setDynamicAiRefs(data.crossReferences);
        }
        if (data.theologicalContext) {
          setTheologicalContext(data.theologicalContext);
        }
        audioEngine.playSoftChime();
      }
    } catch (err) {
      console.error('Error fetching cross-references:', err);
    } finally {
      setIsLoadingAiRefs(false);
    }
  };

  // Reset dynamic references when selected node changes
  useEffect(() => {
    setDynamicAiRefs([]);
    setTheologicalContext('');
  }, [selectedNodeId]);

  // Auto-scrutate 2 consecutive steps (expand branch automatically)
  const handleAutoScrutateBranch = async () => {
    if (!selectedNode) return;
    setIsAutoScrutating(true);
    try {
      const res = await fetch('/api/scrutation/cross-references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siglum: selectedNode.siglum,
          text: selectedNode.text,
          contextTheme: session.theme
        })
      });
      const data = res.ok ? await res.json() : null;
      const refs = data?.crossReferences?.length > 0 ? data.crossReferences : guaranteedRefs;

      if (refs && refs.length > 0) {
        const unadded = refs.filter((r: CrossReferenceItem) => !session.nodes.some(n => n.siglum === r.siglum)).slice(0, 2);
        if (unadded.length > 0) {
          let currentParentId = selectedNode.id;
          const newNodes: ScrutationNode[] = [];

          unadded.forEach((ref: CrossReferenceItem, i: number) => {
            const newNodeId = `node_${Date.now()}_auto_${i}`;
            newNodes.push({
              id: newNodeId,
              parentId: currentParentId,
              siglum: ref.siglum,
              text: ref.text,
              testament: ref.testament,
              theologicalTheme: ref.relation,
              crossReferenceReason: ref.relation,
              order: session.nodes.length + i,
              isExpanded: true,
              createdAt: Date.now() + i * 1000
            });
            currentParentId = newNodeId;
          });

          onUpdateSession({
            ...session,
            nodes: [...session.nodes, ...newNodes],
            updatedAt: new Date().toISOString()
          });
          audioEngine.strikeBowl(432);
        }
      }
    } catch (err) {
      console.error('Auto-scrutation error:', err);
    } finally {
      setIsAutoScrutating(false);
    }
  };

  // Add branch from recommendation
  const handleAddBranchFromRef = (ref: CrossReferenceItem) => {
    if (!selectedNode) return;
    const newNode: ScrutationNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      parentId: selectedNode.id,
      siglum: ref.siglum,
      text: ref.text,
      testament: ref.testament,
      theologicalTheme: ref.relation,
      crossReferenceReason: ref.relation,
      order: session.nodes.length,
      isExpanded: true,
      createdAt: Date.now()
    };

    onUpdateSession({
      ...session,
      nodes: [...session.nodes, newNode],
      updatedAt: new Date().toISOString()
    });

    setSelectedNodeId(newNode.id);
    audioEngine.playSoftChime();
  };

  // Fetch Scripture text for manual siglum entry
  const handleFetchVerseTextForManualEntry = async () => {
    if (!newBranchSiglum) return;
    setIsFetchingVerseText(true);
    try {
      const res = await fetch('/api/scrutation/cross-references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siglum: newBranchSiglum.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setNewBranchText(data.text);
        }
        if (data.siglum) {
          const isST = data.siglum.startsWith('Rdz') || data.siglum.startsWith('Wj') || data.siglum.startsWith('Kpł') || 
                       data.siglum.startsWith('Lb') || data.siglum.startsWith('Pwt') || data.siglum.startsWith('Iz') || 
                       data.siglum.startsWith('Jer') || data.siglum.startsWith('Ez') || data.siglum.startsWith('Ps') ||
                       data.siglum.startsWith('Prz') || data.siglum.startsWith('Mdr');
          setNewBranchTestament(isST ? 'ST' : 'NT');
        }
      }
    } catch (e) {
      console.warn('Could not auto-fetch text:', e);
    } finally {
      setIsFetchingVerseText(false);
    }
  };

  // Add custom branch
  const handleAddCustomBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchSiglum || !newBranchText || !selectedNode) return;

    const newNode: ScrutationNode = {
      id: `node_${Date.now()}`,
      parentId: selectedNode.id,
      siglum: newBranchSiglum.trim(),
      text: newBranchText.trim(),
      testament: newBranchTestament,
      theologicalTheme: newBranchReason || 'Własny odnośnik skrutacji',
      crossReferenceReason: newBranchReason || 'Własny odnośnik',
      order: session.nodes.length,
      isExpanded: true,
      createdAt: Date.now()
    };

    onUpdateSession({
      ...session,
      nodes: [...session.nodes, newNode],
      updatedAt: new Date().toISOString()
    });

    setNewBranchSiglum('');
    setNewBranchText('');
    setNewBranchReason('');
    setIsAddingBranch(false);
    setSelectedNodeId(newNode.id);
    audioEngine.playSoftChime();
  };

  // Delete node and reparent children
  const handleDeleteNode = (nodeId: string) => {
    if (session.nodes.length <= 1) return;
    const target = session.nodes.find(n => n.id === nodeId);
    if (!target) return;

    const parentId = target.parentId;
    const updatedNodes = session.nodes
      .filter(n => n.id !== nodeId)
      .map(n => n.parentId === nodeId ? { ...n, parentId: parentId } : n);

    onUpdateSession({
      ...session,
      nodes: updatedNodes,
      updatedAt: new Date().toISOString()
    });

    if (selectedNodeId === nodeId) {
      setSelectedNodeId(session.nodes[0].id);
    }
  };

  // Mark as Word of Life (Słowo Życia)
  const handleToggleWordOfLife = (siglum: string, text: string) => {
    const isAlready = session.prayerNotes?.wordOfLife === `${siglum}: «${text}»`;
    const newWord = isAlready ? '' : `${siglum}: «${text}»`;

    onUpdateSession({
      ...session,
      prayerNotes: {
        ...session.prayerNotes,
        wordOfLife: newWord
      },
      updatedAt: new Date().toISOString()
    });
    audioEngine.strikeBowl(528);
  };

  // Update Prayer Note
  const handleUpdatePrayerNote = (field: keyof ScrutationSession['prayerNotes'], value: string) => {
    onUpdateSession({
      ...session,
      prayerNotes: {
        ...session.prayerNotes,
        [field]: value
      },
      updatedAt: new Date().toISOString()
    });
  };

  // Fetch Meditation Guidance
  const handleGenerateMeditationGuidance = async () => {
    setIsLoadingMeditation(true);
    try {
      const chainPayload = session.nodes.map(n => ({
        siglum: n.siglum,
        text: n.text,
        relation: n.crossReferenceReason
      }));

      const res = await fetch('/api/scrutation/meditation-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chain: chainPayload, currentStep: 'Meditatio' })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.meditationQuestions) {
          setMeditationQuestions(data.meditationQuestions);
        }
        if (data.suggestedWordOfLife) {
          setSuggestedWordOfLife(data.suggestedWordOfLife);
        }
        audioEngine.playSoftChime();
      }
    } catch (e) {
      console.warn('Error fetching meditation questions:', e);
    } finally {
      setIsLoadingMeditation(false);
    }
  };

  // Calculate SVG bounds
  const maxX = Math.max(...flatLayoutNodes.map(n => n.x), 900) + 400;
  const maxY = Math.max(...flatLayoutNodes.map(n => n.y), 600) + 240;

  const handleCopyChain = () => {
    const textChain = session.nodes
      .map((n, i) => `${i + 1}. [${n.testament}] ${n.siglum}: «${n.text}» (${n.crossReferenceReason || 'Werset'})`)
      .join('\n\n');
    navigator.clipboard.writeText(`DRZEWKO SKRUTACJI: ${session.title}\nTemat: ${session.theme}\nSłowo Życia: ${session.prayerNotes?.wordOfLife || 'brak'}\n\n${textChain}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveSession = () => {
    if (onSaveToJournal) {
      onSaveToJournal(session);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-50 p-6 overflow-y-auto' : ''}`}>
      {/* Top Header & Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-sans font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
              <Network className="w-3.5 h-3.5 text-emerald-700" />
              Wizualne Drzewo Skrutacji (Graf Powiązań)
            </span>
            <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200 font-semibold">
              {totalNodes} wersetów ({stCount} ST, {ntCount} NT)
            </span>
            {session.prayerNotes?.wordOfLife && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
                Słowo Życia ustalone
              </span>
            )}
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
            {session.title || 'Skrutacja Biblijna'}
          </h2>
          <p className="text-xs font-sans text-slate-600">
            Kliknij dowolny węzeł na grafie, aby zbadać powiązania w Piśmie Świętym, rozbudować nową gałąź lub zapisać medytację.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
          {/* Reset Tree */}
          {onResetTree && (
            <button
              type="button"
              onClick={onResetTree}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-sans font-bold border border-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
              title="Wyczyść i wyzeruj bieżące drzewko skrutacji"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Wyzeruj drzewko</span>
            </button>
          )}

          {/* Save to Journal */}
          {onSaveToJournal && (
            <button
              type="button"
              onClick={handleSaveSession}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Zapisano w Dzienniku' : 'Zapisz do Dziennika'}</span>
            </button>
          )}

          {/* Copy Chain */}
          <button
            type="button"
            onClick={handleCopyChain}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-sans font-semibold border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            <span className="hidden sm:inline">{isCopied ? 'Skopiowano' : 'Kopiuj drzewo'}</span>
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs border border-slate-300 transition-colors cursor-pointer shadow-2xs"
            title={isFullscreen ? 'Wyłącz pełny ekran' : 'Pełny ekran'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas & Inspector Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Graph Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Canvas Controls Bar - Light High Contrast */}
          <div className="flex items-center justify-between gap-2 bg-white text-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 shadow-xs text-xs">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setFilterTestament('ALL')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${filterTestament === 'ALL' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Wszystkie ({totalNodes})
              </button>
              <button
                type="button"
                onClick={() => setFilterTestament('ST')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${filterTestament === 'ST' ? 'bg-amber-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                ST ({stCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterTestament('NT')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${filterTestament === 'NT' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                NT ({ntCount})
              </button>
            </div>

            {/* Quick Auto-Scrutate Button */}
            <button
              type="button"
              onClick={handleAutoScrutateBranch}
              disabled={isAutoScrutating || !selectedNode}
              className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-xs font-sans font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Automatycznie wyszukaj i dodaj 2 powiązane wersety ST/NT do wybranego węzła"
            >
              {isAutoScrutating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-800" /> : <Wand2 className="w-3.5 h-3.5 text-amber-800" />}
              <span className="hidden sm:inline">Autoskrutuj gałąź</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Pomniejsz"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-slate-800 w-10 text-center font-bold">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Powiększ"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Reset widoku"
              >
                <RotateCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* SVG Visual Interactive Graph Canvas (Light theme with clean grid) */}
          <div 
            ref={containerRef}
            className="rounded-3xl bg-slate-50/90 border border-slate-300 shadow-inner overflow-x-auto overflow-y-auto p-4 sm:p-6 min-h-[580px] max-h-[760px] relative select-none"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)',
              backgroundSize: '24px 24px'
            }}
          >
            <div 
              className="transition-transform duration-150 origin-top-left relative"
              style={{ 
                transform: `scale(${zoomLevel})`, 
                width: `${maxX}px`, 
                height: `${maxY}px` 
              }}
            >
              <svg 
                className="absolute inset-0 pointer-events-none w-full h-full"
                style={{ width: `${maxX}px`, height: `${maxY}px` }}
              >
                <defs>
                  <marker id="arrowHeadST" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#b45309" />
                  </marker>
                  <marker id="arrowHeadNT" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#047857" />
                  </marker>
                </defs>

                {/* Render Connecting Curves */}
                {flatLayoutNodes.map(layoutItem => {
                  return layoutItem.children.map(childItem => {
                    const startX = layoutItem.x + 270;
                    const startY = layoutItem.y + 70;
                    const endX = childItem.x;
                    const endY = childItem.y + 70;

                    const midX = (startX + endX) / 2;
                    const pathData = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
                    const isST = childItem.node.testament === 'ST';

                    return (
                      <g key={`edge_${layoutItem.node.id}_${childItem.node.id}`}>
                        <path
                          d={pathData}
                          fill="none"
                          stroke={isST ? '#b45309' : '#047857'}
                          strokeWidth="2.5"
                          strokeDasharray={isST ? '5 4' : 'none'}
                          className="transition-all"
                        />
                        {childItem.node.crossReferenceReason && (
                          <foreignObject
                            x={midX - 75}
                            y={(startY + endY) / 2 - 14}
                            width="150"
                            height="28"
                          >
                            <div className="text-[11px] font-sans font-bold bg-white text-slate-800 px-2.5 py-0.5 rounded-full border border-slate-300 text-center truncate shadow-sm">
                              {childItem.node.crossReferenceReason}
                            </div>
                          </foreignObject>
                        )}
                      </g>
                    );
                  });
                })}
              </svg>

              {/* Render Tree Nodes as Interactive Cards - Light, Crisp, High Contrast */}
              {flatLayoutNodes.map(item => {
                const isSelected = item.node.id === selectedNodeId;
                const isRoot = !item.node.parentId;
                const isST = item.node.testament === 'ST';
                const isWordOfLife = session.prayerNotes?.wordOfLife?.includes(item.node.siglum);

                const isDimmed = (filterTestament === 'ST' && !isST) || (filterTestament === 'NT' && isST);
                
                // Fallback text if verse text is empty
                const nodeTextDisplay = item.node.text && item.node.text.trim().length > 0 
                  ? item.node.text 
                  : isRoot && session.initialText 
                  ? session.initialText 
                  : 'Werset z Pisma Świętego';

                return (
                  <div
                    key={item.node.id}
                    onClick={() => setSelectedNodeId(item.node.id)}
                    style={{
                      position: 'absolute',
                      left: `${item.x}px`,
                      top: `${item.y}px`,
                      width: '270px'
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-md bg-white ${
                      isDimmed ? 'opacity-30' : 'opacity-100'
                    } ${
                      isSelected
                        ? 'border-emerald-600 ring-4 ring-emerald-500/25 shadow-xl scale-105 z-30'
                        : isWordOfLife
                        ? 'border-amber-400 ring-2 ring-amber-300/60 shadow-amber-100'
                        : isRoot
                        ? 'border-amber-500/80 hover:border-amber-600'
                        : isST
                        ? 'border-amber-300 hover:border-amber-500'
                        : 'border-emerald-300 hover:border-emerald-500'
                    }`}
                  >
                    {/* Top Node Pill */}
                    <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider ${
                          isRoot
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : isST
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {isRoot ? 'START' : isST ? 'ST' : 'NT'}
                        </span>
                        {isWordOfLife && (
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" title="Słowo Życia" />
                        )}
                      </div>

                      <span className="font-mono text-xs font-bold text-slate-950">
                        {item.node.siglum}
                      </span>
                    </div>

                    {/* Node Text Preview - High Contrast Clear Text */}
                    <p className="font-scripture text-xs text-slate-800 leading-relaxed pt-2 line-clamp-3 italic">
                      «{nodeTextDisplay}»
                    </p>

                    {/* Footer Actions on Card */}
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100 mt-2 font-medium">
                      <span className="truncate max-w-[150px] font-sans">
                        {item.node.crossReferenceReason || 'Punkt startowy'}
                      </span>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNodeId(item.node.id);
                          setActiveInspectorTab('scrutatio');
                          handleFetchAiReferences();
                        }}
                        className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs text-[10px]"
                        title="Skrutuj ten werset (znajdź powiązania)"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Skrutuj</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: In-Tree Scrutation & Prayer Workspace (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedNode ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              {/* Selected Node Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-sans font-bold ${
                      selectedNode.testament === 'ST'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {selectedNode.testament === 'ST' ? 'Stary Testament' : 'Nowy Testament'}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-950 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {selectedNode.siglum}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 pt-1">
                    Pulpit Skrutacji Wersetu
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Star as Word of Life */}
                  <button
                    type="button"
                    onClick={() => handleToggleWordOfLife(selectedNode.siglum, selectedNode.text)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      session.prayerNotes?.wordOfLife?.includes(selectedNode.siglum)
                        ? 'bg-amber-50 border-amber-300 text-amber-700'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-amber-700'
                    }`}
                    title="Oznacz ten werset jako Słowo Życia (Rhema)"
                  >
                    <Star className={`w-4 h-4 ${session.prayerNotes?.wordOfLife?.includes(selectedNode.siglum) ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>

                  {/* Delete button (only for child nodes) */}
                  {session.nodes.length > 1 && selectedNode.parentId && (
                    <button
                      type="button"
                      onClick={() => handleDeleteNode(selectedNode.id)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer transition-colors"
                      title="Usuń ten werset z drzewka"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Full Scripture Text of Selected Node */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <p className="font-scripture text-base text-slate-900 leading-relaxed italic">
                  «{selectedNode.text || session.initialText || 'Werset biblijny'}»
                </p>
                {selectedNode.crossReferenceReason && (
                  <p className="text-xs font-sans text-emerald-900 font-semibold pt-2 border-t border-emerald-200 mt-2">
                    Klucz teologiczny: {selectedNode.crossReferenceReason}
                  </p>
                )}
              </div>

              {/* Inspector Sub-Tabs (Odnośniki / Modlitwa / Tradycja) */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-sans">
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('scrutatio')}
                  className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeInspectorTab === 'scrutatio'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Odnośniki i Gałęzie</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('prayer')}
                  className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeInspectorTab === 'prayer'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <PenLine className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Modlitwa & Lectio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInspectorTab('tradition')}
                  className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeInspectorTab === 'tradition'
                      ? 'bg-white text-emerald-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>Tradycja</span>
                </button>
              </div>

              {/* Tab 1: Scrutatio (Odnośniki, Badanie i Rozgałęzianie) */}
              {activeInspectorTab === 'scrutatio' && (
                <div className="space-y-4 animate-fade-in">
                  {/* AI & Aparat Search Button */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleFetchAiReferences}
                      disabled={isLoadingAiRefs}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
                    >
                      {isLoadingAiRefs ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Szukanie powiązań w Piśmie Świętym...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" />
                          <span>Skrutuj ten werset (Szukaj powiązań)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {theologicalContext && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-slate-800">
                      <span className="font-bold text-amber-950 block pb-0.5">Kontekst zbawczy:</span>
                      {theologicalContext}
                    </div>
                  )}

                  {/* List of Cross-References to Add as Branch */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {displayReferences.length > 0 ? (
                      displayReferences.map((ref, rIdx) => {
                        const alreadyInTree = session.nodes.some(n => n.siglum === ref.siglum);

                        return (
                          <div
                            key={rIdx}
                            className={`p-3 rounded-xl border text-xs transition-all ${
                              alreadyInTree
                                ? 'bg-slate-50 border-slate-200 opacity-60'
                                : 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono font-bold text-emerald-950">
                                {ref.siglum} ({ref.testament})
                              </span>
                              <span className="text-[10px] text-slate-600 font-sans font-semibold">
                                {ref.relation}
                              </span>
                            </div>
                            <p className="font-scripture text-xs text-slate-800 line-clamp-2 pt-1">
                              «{ref.text}»
                            </p>

                            {!alreadyInTree ? (
                              <button
                                type="button"
                                onClick={() => handleAddBranchFromRef(ref)}
                                className="mt-2 w-full py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-sans font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Dodaj gałąź do «{selectedNode.siglum}»</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic block pt-1">
                                Werset znajduje się już w drzewku
                              </span>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-600 italic p-3 text-center bg-slate-50 rounded-xl border border-slate-200">
                        Kliknij przycisk powyżej, aby zbadać powiązania biblijne dla tego wersetu.
                      </p>
                    )}
                  </div>

                  {/* Manual Branch Accordion */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddingBranch(!isAddingBranch)}
                      className="w-full py-2 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-900 text-xs font-sans font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAddingBranch ? 'Anuluj ręczne dodawanie' : 'Wpisz własny werset do gałęzi'}</span>
                    </button>

                    {isAddingBranch && (
                      <form onSubmit={handleAddCustomBranch} className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-in text-xs">
                        <div>
                          <label className="font-semibold text-slate-800 block pb-1">
                            Siglum wersetu:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              value={newBranchSiglum}
                              onChange={(e) => setNewBranchSiglum(e.target.value)}
                              placeholder="np. Wj 12, 1-14 lub J 1, 29"
                              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-slate-900 focus:outline-emerald-600"
                            />
                            <button
                              type="button"
                              onClick={handleFetchVerseTextForManualEntry}
                              disabled={isFetchingVerseText || !newBranchSiglum}
                              className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] cursor-pointer disabled:opacity-50"
                              title="Pobierz tekst wersetu z Biblii"
                            >
                              {isFetchingVerseText ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Pobierz'}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <label className="flex items-center gap-1.5 cursor-pointer text-slate-800">
                            <input
                              type="radio"
                              name="testament"
                              checked={newBranchTestament === 'ST'}
                              onChange={() => setNewBranchTestament('ST')}
                            />
                            <span>Stary Testament</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer text-slate-800">
                            <input
                              type="radio"
                              name="testament"
                              checked={newBranchTestament === 'NT'}
                              onChange={() => setNewBranchTestament('NT')}
                            />
                            <span>Nowy Testament</span>
                          </label>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-800 block pb-1">
                            Treść wersetu:
                          </label>
                          <textarea
                            required
                            rows={2}
                            value={newBranchText}
                            onChange={(e) => setNewBranchText(e.target.value)}
                            placeholder="Wklej lub wpisz tekst..."
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-scripture text-slate-900 focus:outline-emerald-600"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-800 block pb-1">
                            Klucz powiązania z {selectedNode.siglum}:
                          </label>
                          <input
                            type="text"
                            value={newBranchReason}
                            onChange={(e) => setNewBranchReason(e.target.value)}
                            placeholder="np. Baranek Paschalny, Zbawienie z grzechu"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-emerald-600"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-sans font-bold cursor-pointer transition-colors shadow-sm"
                        >
                          Utwórz gałąź w drzewie
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Modlitwa & Lectio Divina */}
              {activeInspectorTab === 'prayer' && (
                <div className="space-y-4 animate-fade-in text-xs">
                  {/* AI Meditation Questions Generator */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-950 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                        Pytania do Medytacji Egzystencjalnej (Meditatio):
                      </span>
                      <button
                        type="button"
                        onClick={handleGenerateMeditationGuidance}
                        disabled={isLoadingMeditation}
                        className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[11px] cursor-pointer disabled:opacity-50"
                      >
                        {isLoadingMeditation ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Generuj pytania'}
                      </button>
                    </div>

                    {meditationQuestions.length > 0 ? (
                      <ul className="space-y-1.5 pt-1">
                        {meditationQuestions.map((q, qIdx) => (
                          <li key={qIdx} className="text-slate-800 bg-white p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                            • {q}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-600 italic">
                        Kliknij „Generuj pytania”, aby otrzymać światło do odniesienia całej ścieżki wersetów do Twojego konkretnego życia.
                      </p>
                    )}
                  </div>

                  {/* Word of Life (Rhema) */}
                  <div>
                    <label className="font-bold text-slate-800 block pb-1">
                      Słowo Życia (Rhema na dziś):
                    </label>
                    <input
                      type="text"
                      value={session.prayerNotes?.wordOfLife || ''}
                      onChange={(e) => handleUpdatePrayerNote('wordOfLife', e.target.value)}
                      placeholder="Wpisz lub wybierz gwiazdką werset z drzewka..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-scripture text-slate-900 font-bold focus:outline-emerald-600"
                    />
                  </div>

                  {/* Meditatio Notes */}
                  <div>
                    <label className="font-bold text-slate-800 block pb-1">
                      Medytacja osobista (Co Bóg mówi do Twojego serca?):
                    </label>
                    <textarea
                      rows={3}
                      value={session.prayerNotes?.meditatio || ''}
                      onChange={(e) => handleUpdatePrayerNote('meditatio', e.target.value)}
                      placeholder="Zapisz swoje refleksje z przebytej drogi biblijnej..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-sans text-slate-900 focus:outline-emerald-600"
                    />
                  </div>

                  {/* Oratio Notes */}
                  <div>
                    <label className="font-bold text-slate-800 block pb-1">
                      Modlitwa serca (Oratio / Twoja odpowiedź):
                    </label>
                    <textarea
                      rows={2}
                      value={session.prayerNotes?.oratio || ''}
                      onChange={(e) => handleUpdatePrayerNote('oratio', e.target.value)}
                      placeholder="Twoje dziękczynienie, prośba lub pieśń..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-sans text-slate-900 focus:outline-emerald-600"
                    />
                  </div>

                  {/* Actio Notes */}
                  <div>
                    <label className="font-bold text-slate-800 block pb-1">
                      Konkretny czyn wiary (Actio):
                    </label>
                    <input
                      type="text"
                      value={session.prayerNotes?.actio || ''}
                      onChange={(e) => handleUpdatePrayerNote('actio', e.target.value)}
                      placeholder="Do jakiego czynu miłości, przebaczenia lub nawrócenia zostałeś wezwany?"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-sans text-slate-900 focus:outline-emerald-600"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Tradycja (Ojcowie Kościoła i Tradycja Żydowska) */}
              {activeInspectorTab === 'tradition' && (
                <div className="space-y-3 animate-fade-in">
                  <p className="text-xs text-slate-700">
                    Zbadaj werset <strong className="font-mono">{selectedNode.siglum}</strong> w świetle patrystyki i korzeni hebrajskich:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {onOpenPatristicsForSiglum && (
                      <button
                        type="button"
                        onClick={() => onOpenPatristicsForSiglum(selectedNode.siglum)}
                        className="p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 text-xs font-sans font-bold flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-center shadow-2xs"
                      >
                        <BookOpen className="w-5 h-5 text-sky-700" />
                        <span>Ojcowie Kościoła</span>
                        <span className="text-[10px] text-sky-700 font-normal">Komentarze patrystyczne i Catena Aurea</span>
                      </button>
                    )}

                    {onOpenJewishTraditionForSiglum && (
                      <button
                        type="button"
                        onClick={() => onOpenJewishTraditionForSiglum(selectedNode.siglum)}
                        className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 text-xs font-sans font-bold flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-center shadow-2xs"
                      >
                        <Flame className="w-5 h-5 text-amber-700" />
                        <span>Tradycja Żydowska</span>
                        <span className="text-[10px] text-amber-700 font-normal">Tora, Targumy i korzenie Przymierza</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <Compass className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-sans text-slate-600">
                Wybierz werset na grafie po lewej, aby zbadać jego odnośniki i dodać gałąź.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
