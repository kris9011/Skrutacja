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
  Wand2,
  X
} from 'lucide-react';
import { ScrutationSession, ScrutationNode, CrossReferenceItem } from '../types';
import { getGuaranteedCrossReferences } from '../data/crossReferenceDatabase';
import { audioEngine } from '../utils/audioContemplationEngine';

interface ScrutationTreeViewProps {
  session: ScrutationSession | null;
  onUpdateSession: (session: ScrutationSession) => void;
  onSaveToJournal?: (session: ScrutationSession) => void;
  onSelectVerseToInspect?: (siglum: string, text: string) => void;
  onOpenPatristicsForSiglum?: (siglum: string) => void;
  onOpenJewishTraditionForSiglum?: (siglum: string) => void;
  onResetTree?: () => void;
  onOpenDailyTab?: () => void;
  onOpenThemesTab?: () => void;
  onOpenBooksTab?: () => void;
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
  onResetTree,
  onOpenDailyTab,
  onOpenThemesTab,
  onOpenBooksTab
}) => {
  const [quickInputSiglum, setQuickInputSiglum] = useState<string>('');
  const [quickInputText, setQuickInputText] = useState<string>('');
  const [isCreatingCustom, setIsCreatingCustom] = useState<boolean>(false);

  // If session is null or empty, display a clean sacred empty state
  if (!session || !session.nodes || session.nodes.length === 0) {
    const handleStartWithPreset = (sig: string, txt: string, title: string, reason: string) => {
      const isNT = sig.startsWith('Mt') || sig.startsWith('Mk') || sig.startsWith('Łk') || sig.startsWith('J') || sig.startsWith('Dz') || sig.startsWith('Rz') || sig.startsWith('1 Kor') || sig.startsWith('2 Kor') || sig.startsWith('Ga') || sig.startsWith('Ef') || sig.startsWith('Flp') || sig.startsWith('Kol') || sig.startsWith('1 Tes') || sig.startsWith('2 Tes') || sig.startsWith('1 Tm') || sig.startsWith('2 Tm') || sig.startsWith('Tt') || sig.startsWith('Flm') || sig.startsWith('Hbr') || sig.startsWith('Jk') || sig.startsWith('1 P') || sig.startsWith('2 P') || sig.startsWith('1 J') || sig.startsWith('2 J') || sig.startsWith('3 J') || sig.startsWith('Jud') || sig.startsWith('Ap');
      const newSession: ScrutationSession = {
        id: 'session_' + Date.now(),
        title: title || `Skrutacja: ${sig}`,
        theme: 'Skrutacja Słowa Bożego',
        initialSiglum: sig,
        initialText: txt,
        nodes: [
          {
            id: 'node_root',
            parentId: null,
            siglum: sig,
            text: txt,
            testament: isNT ? 'NT' : 'ST',
            crossReferenceReason: reason || 'Werset wyjściowy do skrutacji',
            order: 0,
            isExpanded: true,
            createdAt: Date.now()
          }
        ],
        activeStep: 0,
        prayerNotes: {
          statio: '',
          invocatio: '',
          lectio: '',
          meditatio: '',
          oratio: '',
          contemplatio: '',
          actio: '',
          wordOfLife: ''
        },
        durationSeconds: 0,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onUpdateSession(newSession);
    };

    return (
      <div className="space-y-6 max-w-4xl mx-auto py-8 text-slate-900 animate-fade-in">
        {/* Empty Tree Banner */}
        <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
            <ListTree className="w-8 h-8" />
          </div>
          
          <div className="space-y-1.5 max-w-lg mx-auto">
            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Drzewko Skrutacji Wyzerowane
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 pt-2">
              Rozpocznij Nową Skrutację
            </h2>
            <p className="text-sm font-sans text-slate-600 leading-relaxed">
              Drzewo jest obecnie czyste. Wybierz punkt startowy, aby rozpocząć modlitwę Słowem Bożym i rozbudowywać kolejne powiązania biblijne.
            </p>
          </div>

          {/* Quick Launch Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
            {/* Action 1: Daily Readings */}
            <div 
              onClick={() => onOpenDailyTab && onOpenDailyTab()}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-emerald-900">
                1. Z Dzisiejszych Czytań Mszalnych
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Wybierz Ewangelię lub I Czytanie z dzisiejszego Lekcjonarza Kościoła i rozpocznij modlitwę w jedności z liturgią dnia.
              </p>
            </div>

            {/* Action 2: Thematic Paths */}
            <div 
              onClick={() => onOpenThemesTab && onOpenThemesTab()}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-amber-700 text-white shadow-2xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-amber-900">
                2. Wybierz Ścieżkę Tematyczną
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pascha Chrystusa, Krzew Gorejący, Związanie Izaaka, Przebaczenie, Nowe Serce lub Osiem Błogosławieństw.
              </p>
            </div>

            {/* Action 3: Quick Start Samples */}
            <div 
              onClick={() => handleStartWithPreset('Łk 24, 32', 'Czy serce nasze nie pałało w nas, kiedy rozmawiał z nami w drodze i Pisma nam wyjaśniał?', 'Uczniowie z Emaus: Ogień Słowa Bożego', 'Otwarcie oczu i serc przez Pisma')}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-800 text-white shadow-2xs">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">
                3. Rozpocznij z Emaus (Łk 24, 32)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                «Czy serce nasze nie pałało w nas...» — klasyczny punkt wyjścia do badania ognia Bożej obecności w ST i NT.
              </p>
            </div>

            {/* Action 4: Custom Siglum Input */}
            <div 
              onClick={() => setIsCreatingCustom(true)}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-emerald-900 text-white shadow-2xs">
                  <Plus className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">
                4. Wpisz Dowolny Werset
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Wprowadź siglum (np. Wj 3, 2 / Mk 7, 6 / Iz 53, 5 / Ps 23) i zacznij własną medytację.
              </p>
            </div>
          </div>

          {/* Inline Custom Input Form */}
          {isCreatingCustom && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-100 border border-slate-300 text-left space-y-3 animate-fade-in">
              <h4 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Wpisz werset wyjściowy do nowego drzewka:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="np. Wj 3, 2 lub Mk 7, 6"
                  value={quickInputSiglum}
                  onChange={(e) => setQuickInputSiglum(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono font-semibold text-slate-900 focus:outline-emerald-600"
                />
                <input
                  type="text"
                  placeholder="Treść wersetu (opcjonalnie)"
                  value={quickInputText}
                  onChange={(e) => setQuickInputText(e.target.value)}
                  className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-sans text-slate-900 focus:outline-emerald-600"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingCustom(false)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-sans font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!quickInputSiglum.trim()) return;
                    handleStartWithPreset(
                      quickInputSiglum.trim(),
                      quickInputText.trim() || `Werset ${quickInputSiglum.trim()}`,
                      `Skrutacja: ${quickInputSiglum.trim()}`,
                      'Werset startowy'
                    );
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Rozpocznij Drzewo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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

  // New Fragment Picker Modal & Last Added feedback banner
  const [pickerModalNode, setPickerModalNode] = useState<ScrutationNode | null>(null);
  const [lastAddedNodeInfo, setLastAddedNodeInfo] = useState<{ parentSiglum: string; node: ScrutationNode } | null>(null);
  const [pickerFilterTestament, setPickerFilterTestament] = useState<'ALL' | 'ST' | 'NT'>('ALL');
  const [pickerSearchQuery, setPickerSearchQuery] = useState<string>('');
  const [pickerCustomSiglum, setPickerCustomSiglum] = useState<string>('');
  const [pickerCustomText, setPickerCustomText] = useState<string>('');
  const [isFetchingPickerCustom, setIsFetchingPickerCustom] = useState<boolean>(false);

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

  // Auto-scroll canvas to newly selected or added node smoothly
  useEffect(() => {
    if (selectedNodeId && containerRef.current && flatLayoutNodes.length > 0) {
      const layoutItem = flatLayoutNodes.find(item => item.node.id === selectedNodeId);
      if (layoutItem) {
        const container = containerRef.current;
        const targetX = layoutItem.x * zoomLevel - container.clientWidth / 2 + 135;
        const targetY = layoutItem.y * zoomLevel - container.clientHeight / 2 + 80;
        container.scrollTo({
          left: Math.max(0, targetX),
          top: Math.max(0, targetY),
          behavior: 'smooth'
        });
      }
    }
  }, [selectedNodeId, session.nodes.length, flatLayoutNodes, zoomLevel]);

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
          const lastNode = newNodes[newNodes.length - 1];
          setSelectedNodeId(lastNode.id);
          setLastAddedNodeInfo({
            parentSiglum: selectedNode.siglum,
            node: lastNode
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
  const handleAddBranchFromRef = (ref: CrossReferenceItem, parentOverride?: ScrutationNode) => {
    const parent = parentOverride || selectedNode;
    if (!parent) return;
    const newNode: ScrutationNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      parentId: parent.id,
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
    setLastAddedNodeInfo({
      parentSiglum: parent.siglum,
      node: newNode
    });
    audioEngine.strikeBowl(432);
  };

  // Directly scrutes a node by finding the next best connected scripture fragment and attaching it to the tree
  const handleScrutateFromNode = (parentNode: ScrutationNode) => {
    const refData = getGuaranteedCrossReferences(parentNode.siglum, parentNode.text);
    const existingSigla = new Set(session.nodes.map(n => n.siglum.toLowerCase().trim()));

    // Available from database & dynamic AI
    const allCandidates = [
      ...(refData.crossReferences || []),
      ...dynamicAiRefs
    ];

    const available = allCandidates.filter(
      r => !existingSigla.has(r.siglum.toLowerCase().trim())
    );

    let chosenRef: CrossReferenceItem;

    if (available.length > 0) {
      chosenRef = available[0];
    } else {
      // Universal pool of theological scripture links for deep scrutation
      const universalPool: CrossReferenceItem[] = [
        { siglum: 'J 5, 39', text: 'Badacie Pisma, ponieważ sądzicie, że w nich zawarte jest życie wieczne: to one właśnie dają o Mnie świadectwo.', testament: 'NT', relation: 'Klucz chrystologiczny Pisma Świętego', explanation: 'Chrystus jako cel i centrum całego Pisma Świętego.' },
        { siglum: 'Łk 24, 27', text: 'I zaczynając od Mojżesza, poprzez wszystkich proroków, wykładał im, co we wszystkich Pismach odnosiło się do Niego.', testament: 'NT', relation: 'Droga do Emaus i wyjaśnianie Pism', explanation: 'Jezus objawia sens Starego Testamentu w Nowym.' },
        { siglum: 'Iz 55, 10-11', text: 'Zaiste, podobnie jak ulewa i śnieg spadają z nieba i tam nie powracają, dopóki nie nawodnią ziemi (...) tak słowo, które wychodzi z ust moich, nie wraca do Mnie bezowocne.', testament: 'ST', relation: 'Niezawodna skuteczność Słowa Bożego', explanation: 'Boże Słowo zawsze dokonuje tego, co Bóg zamierzył.' },
        { siglum: 'Hbr 4, 12', text: 'Żywe bowiem jest słowo Boże, skuteczne i ostrzejsze niż wszelki miecz obosieczny, przenikające aż do rozdzielenia duszy i ducha.', testament: 'NT', relation: 'Moc i skuteczność Słowa Bożego', explanation: 'Słowo Boże osądza pragnienia i myśli serca.' },
        { siglum: 'Ps 119, 105', text: 'Twoje słowo jest lampą dla moich stóp i światłem na mojej ścieżce.', testament: 'ST', relation: 'Słowo jako światło w ciemności', explanation: 'Drogowskaz na każdy dzień życia chrześcijańskiego.' },
        { siglum: 'Rz 10, 17', text: 'Przeto wiara rodzi się z tego, co się słyszy, tym zaś, co się słyszy, jest słowo Chrystusa.', testament: 'NT', relation: 'Wiara rodzi się ze słuchania Słowa', explanation: 'Głoszone Słowo rozbudza żywą wiarę w sercu.' },
        { siglum: 'Mt 4, 4', text: 'Nie samym chlebem żyje człowiek, lecz każdym słowem, które pochodzi z ust Bożych.', testament: 'NT', relation: 'Chleb Życia i pokarm Słowa', explanation: 'Człowiek potrzebuje duchowego pokarmu Słowa.' },
        { siglum: '2 Tm 3, 16', text: 'Wszelkie Pismo od Boga natchnione jest i pożyteczne do nauczania, do przekonywania, do poprawiania, do wychowywania w sprawiedliwości.', testament: 'NT', relation: 'Natchnienie Pisma Świętego', explanation: 'Pismo formuje człowieka Bożego.' },
        { siglum: 'Jr 15, 16', text: 'Ilekroć otrzymywałem Twoje słowa, pochłaniałem je, a Twoje słowo stawało się dla mnie rozkoszą i radością mego serca.', testament: 'ST', relation: 'Słodkość i zachwyt Słowem Bożym', explanation: 'Rozkoszowanie się Słowem w modlitwie.' },
        { siglum: 'Ap 3, 20', text: 'Oto stoję u drzwi i kołaczę: jeśli kto posłyszy mój głos i drzwi otworzy, wejdę do niego i będę z nim wieczerzał, a on ze Mną.', testament: 'NT', relation: 'Otwarcie serca na głos Pana', explanation: 'Osobiste spotkanie ze Zmartwychwstałym Chrystusem.' }
      ];
      const unusedUniversal = universalPool.find(u => !existingSigla.has(u.siglum.toLowerCase().trim()));
      chosenRef = unusedUniversal || {
        siglum: `${parentNode.siglum} (bis)`,
        text: parentNode.text,
        testament: parentNode.testament,
        relation: 'Dalsza kontemplacja wersetu',
        explanation: 'Pogłębienie medytacji nad tym samym fragmentem.'
      };
    }

    const newNodeId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newNode: ScrutationNode = {
      id: newNodeId,
      parentId: parentNode.id,
      siglum: chosenRef.siglum,
      text: chosenRef.text,
      testament: chosenRef.testament,
      theologicalTheme: chosenRef.relation,
      crossReferenceReason: chosenRef.relation,
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
    setLastAddedNodeInfo({
      parentSiglum: parentNode.siglum,
      node: newNode
    });

    audioEngine.strikeBowl(432);
  };

  // Filtered references for the interactive Selection Modal
  const modalReferences = useMemo(() => {
    if (!pickerModalNode) return [];
    const refData = getGuaranteedCrossReferences(pickerModalNode.siglum, pickerModalNode.text);
    const existingSigla = new Set(session.nodes.map(n => n.siglum.toLowerCase().trim()));

    const list: (CrossReferenceItem & { alreadyInTree?: boolean })[] = [];

    // Add guaranteed references
    (refData.crossReferences || []).forEach(r => {
      list.push({
        ...r,
        alreadyInTree: existingSigla.has(r.siglum.toLowerCase().trim())
      });
    });

    // Add universal references to ensure rich choices
    const universalPool: CrossReferenceItem[] = [
      { siglum: 'J 5, 39', text: 'Badacie Pisma, ponieważ sądzicie, że w nich zawarte jest życie wieczne: to one właśnie dają o Mnie świadectwo.', testament: 'NT', relation: 'Klucz chrystologiczny Pisma Świętego', explanation: 'Chrystus jako cel i centrum całego Pisma Świętego.' },
      { siglum: 'Łk 24, 27', text: 'I zaczynając od Mojżesza, poprzez wszystkich proroków, wykładał im, co we wszystkich Pismach odnosiło się do Niego.', testament: 'NT', relation: 'Droga do Emaus i wyjaśnianie Pism', explanation: 'Jezus objawia sens Starego Testamentu w Nowym.' },
      { siglum: 'Iz 55, 10-11', text: 'Zaiste, podobnie jak ulewa i śnieg spadają z nieba i tam nie powracają, dopóki nie nawodnią ziemi (...) tak słowo, które wychodzi z ust moich, nie wraca do Mnie bezowocne.', testament: 'ST', relation: 'Niezawodna skuteczność Słowa Bożego', explanation: 'Boże Słowo zawsze dokonuje tego, co Bóg zamierzył.' },
      { siglum: 'Hbr 4, 12', text: 'Żywe bowiem jest słowo Boże, skuteczne i ostrzejsze niż wszelki miecz obosieczny, przenikające aż do rozdzielenia duszy i ducha.', testament: 'NT', relation: 'Moc i skuteczność Słowa Bożego', explanation: 'Słowo Boże osądza pragnienia i myśli serca.' },
      { siglum: 'Ps 119, 105', text: 'Twoje słowo jest lampą dla moich stóp i światłem na mojej ścieżce.', testament: 'ST', relation: 'Słowo jako światło w ciemności', explanation: 'Drogowskaz na każdy dzień życia chrześcijańskiego.' },
      { siglum: 'Rz 10, 17', text: 'Przeto wiara rodzi się z tego, co się słyszy, tym zaś, co się słyszy, jest słowo Chrystusa.', testament: 'NT', relation: 'Wiara rodzi się ze słuchania Słowa', explanation: 'Głoszone Słowo rozbudza żywą wiarę w sercu.' },
      { siglum: 'Mt 4, 4', text: 'Nie samym chlebem żyje człowiek, lecz każdym słowem, które pochodzi z ust Bożych.', testament: 'NT', relation: 'Chleb Życia i pokarm Słowa', explanation: 'Człowiek potrzebuje duchowego pokarmu Słowa.' },
      { siglum: '2 Tm 3, 16', text: 'Wszelkie Pismo od Boga natchnione jest i pożyteczne do nauczania, do przekonywania, do poprawiania, do wychowywania w sprawiedliwości.', testament: 'NT', relation: 'Natchnienie Pisma Świętego', explanation: 'Pismo formuje człowieka Bożego.' },
      { siglum: 'Jr 15, 16', text: 'Ilekroć otrzymywałem Twoje słowa, pochłaniałem je, a Twoje słowo stawało się dla mnie rozkoszą i radością mego serca.', testament: 'ST', relation: 'Słodkość i zachwyt Słowem Bożym', explanation: 'Rozkoszowanie się Słowem w modlitwie.' },
      { siglum: 'Ap 3, 20', text: 'Oto stoję u drzwi i kołaczę: jeśli kto posłyszy mój głos i drzwi otworzy, wejdę do niego i będę z nim wieczerzał, a on ze Mną.', testament: 'NT', relation: 'Otwarcie serca na głos Pana', explanation: 'Osobiste spotkanie ze Zmartwychwstałym Chrystusem.' }
    ];

    universalPool.forEach(u => {
      if (!list.some(item => item.siglum.toLowerCase().trim() === u.siglum.toLowerCase().trim())) {
        list.push({
          ...u,
          alreadyInTree: existingSigla.has(u.siglum.toLowerCase().trim())
        });
      }
    });

    return list.filter(item => {
      if (pickerFilterTestament === 'ST' && item.testament !== 'ST') return false;
      if (pickerFilterTestament === 'NT' && item.testament !== 'NT') return false;
      if (pickerSearchQuery.trim()) {
        const query = pickerSearchQuery.toLowerCase().trim();
        return item.siglum.toLowerCase().includes(query) ||
               item.text.toLowerCase().includes(query) ||
               (item.relation && item.relation.toLowerCase().includes(query));
      }
      return true;
    });
  }, [pickerModalNode, session.nodes, pickerFilterTestament, pickerSearchQuery]);

  const handleFetchPickerCustomText = async () => {
    if (!pickerCustomSiglum.trim()) return;
    setIsFetchingPickerCustom(true);
    try {
      const res = await fetch('/api/scrutation/cross-references', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siglum: pickerCustomSiglum.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          setPickerCustomText(data.text);
        }
      }
    } catch (e) {
      console.warn('Error fetching picker custom text:', e);
    } finally {
      setIsFetchingPickerCustom(false);
    }
  };

  const handleAddCustomFromPicker = () => {
    if (!pickerModalNode || !pickerCustomSiglum.trim()) return;
    const isST = pickerCustomSiglum.startsWith('Rdz') || pickerCustomSiglum.startsWith('Wj') || pickerCustomSiglum.startsWith('Kpł') || 
                 pickerCustomSiglum.startsWith('Lb') || pickerCustomSiglum.startsWith('Pwt') || pickerCustomSiglum.startsWith('Iz') || 
                 pickerCustomSiglum.startsWith('Jer') || pickerCustomSiglum.startsWith('Ez') || pickerCustomSiglum.startsWith('Ps') ||
                 pickerCustomSiglum.startsWith('Prz') || pickerCustomSiglum.startsWith('Mdr');

    handleAddBranchFromRef({
      siglum: pickerCustomSiglum.trim(),
      text: pickerCustomText.trim() || 'Werset Pisma Świętego do osobistej medytacji',
      testament: isST ? 'ST' : 'NT',
      relation: 'Własny odnośnik biblijny',
      explanation: 'Odnośnik wprowadzony przez użytkownika podczas skrutacji'
    }, pickerModalNode);

    setPickerCustomSiglum('');
    setPickerCustomText('');
    setPickerModalNode(null);
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
    <div 
      className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-50 p-4 sm:p-6 overflow-y-auto' : ''}`}
      style={isFullscreen ? {
        paddingTop: 'max(env(safe-area-inset-top, 0px) + 16px, 20px)',
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px) + 16px, 20px)',
        paddingLeft: 'max(env(safe-area-inset-left, 0px) + 16px, 16px)',
        paddingRight: 'max(env(safe-area-inset-right, 0px) + 16px, 16px)'
      } : undefined}
    >
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
          {/* Newly added branch confirmation banner */}
          {lastAddedNodeInfo && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-200/80 px-2 py-0.5 rounded-md">
                    <Check className="w-3.5 h-3.5 text-emerald-800" />
                    Nowy fragment dodany do drzewka:
                  </span>
                  <span className="font-mono text-xs font-black text-emerald-950 bg-white px-2 py-0.5 rounded-md border border-emerald-300">
                    {lastAddedNodeInfo.node.siglum} ({lastAddedNodeInfo.node.testament})
                  </span>
                  <span className="text-[11px] text-emerald-800 italic">
                    (z węzła: {lastAddedNodeInfo.parentSiglum})
                  </span>
                </div>
                <p className="font-scripture text-xs text-slate-800 line-clamp-2 italic">
                  «{lastAddedNodeInfo.node.text}»
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => {
                    const parent = session.nodes.find(n => n.id === lastAddedNodeInfo.node.parentId) || lastAddedNodeInfo.node;
                    setPickerModalNode(parent);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                >
                  Zmień powiązanie
                </button>
                <button
                  type="button"
                  onClick={() => setLastAddedNodeInfo(null)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-emerald-100/50 cursor-pointer"
                  title="Zamknij powiadomienie"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

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
                          <span title="Słowo Życia">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                          </span>
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
                    <div className="pt-2 flex items-center justify-between gap-1 text-[11px] text-slate-600 border-t border-slate-100 mt-2 font-medium">
                      <span className="truncate max-w-[105px] font-sans text-[10px] text-slate-500" title={item.node.crossReferenceReason || 'Punkt startowy'}>
                        {item.node.crossReferenceReason || 'Punkt startowy'}
                      </span>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNodeId(item.node.id);
                            setPickerModalNode(item.node);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                          title="Przeglądaj wszystkie powiązania wersetu"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScrutateFromNode(item.node);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs text-[11px] active:scale-95"
                          title="Dodaj kolejny powiązany werset do drzewka"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Skrutuj</span>
                        </button>
                      </div>
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
                  {/* Actions Bar in Inspector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleScrutateFromNode(selectedNode)}
                      className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
                      title="Natychmiast dołącz kolejny powiązany werset do drzewka"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Dodaj fragment do drzewa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPickerModalNode(selectedNode)}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-sans font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                      title="Otwórz pełną listę odnośników biblijnych i wybierz werset"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-700" />
                      <span>Wybierz z listy powiązań</span>
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

      {/* Scrutation Fragment Picker Modal */}
      {pickerModalNode && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
          onClick={() => setPickerModalNode(null)}
        >
          <div 
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-4 sm:p-6 space-y-4 max-h-[90vh] flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Wybierz Fragment do Skrutacji
                  </h3>
                </div>
                <p className="text-xs text-slate-600 font-sans">
                  Rozwiń gałąź ze Słowa: <span className="font-mono font-bold text-emerald-950 bg-emerald-100/60 px-1.5 py-0.5 rounded">{pickerModalNode.siglum}</span> ({pickerModalNode.testament === 'ST' ? 'Stary Testament' : 'Nowy Testament'})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPickerModalNode(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-colors"
                title="Zamknij"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Source Verse Preview */}
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs font-scripture italic text-slate-800 leading-relaxed">
              «{pickerModalNode.text}»
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setPickerFilterTestament('ALL')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    pickerFilterTestament === 'ALL'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Wszystkie ({modalReferences.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPickerFilterTestament('ST')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    pickerFilterTestament === 'ST'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ST
                </button>
                <button
                  type="button"
                  onClick={() => setPickerFilterTestament('NT')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    pickerFilterTestament === 'NT'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  NT
                </button>
              </div>

              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pickerSearchQuery}
                  onChange={(e) => setPickerSearchQuery(e.target.value)}
                  placeholder="Filtruj powiązania (np. psalm, światło, J)..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-emerald-600"
                />
              </div>
            </div>

            {/* References List */}
            <div className="overflow-y-auto max-h-[42vh] pr-1 space-y-2.5 divide-y divide-slate-100">
              {modalReferences.length > 0 ? (
                modalReferences.map((ref, idx) => (
                  <div 
                    key={idx} 
                    className={`pt-2.5 first:pt-0 p-3 rounded-2xl border transition-all ${
                      ref.alreadyInTree 
                        ? 'bg-slate-50/80 border-slate-200 opacity-75' 
                        : 'bg-white hover:bg-emerald-50/30 border-slate-200 hover:border-emerald-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                          ref.testament === 'ST'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}>
                          {ref.testament}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-950">
                          {ref.siglum}
                        </span>
                        {ref.alreadyInTree && (
                          <span className="text-[10px] font-sans font-medium text-slate-500 bg-slate-200/70 px-1.5 py-0.5 rounded">
                            (już w drzewie)
                          </span>
                        )}
                      </div>

                      {ref.relation && (
                        <span className="text-[10px] font-sans font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full truncate max-w-[170px]">
                          {ref.relation}
                        </span>
                      )}
                    </div>

                    <p className="font-scripture text-xs text-slate-800 italic leading-relaxed pb-2">
                      «{ref.text}»
                    </p>

                    {ref.explanation && (
                      <p className="text-[11px] text-slate-600 pb-2 font-sans">
                        {ref.explanation}
                      </p>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          handleAddBranchFromRef(ref, pickerModalNode);
                          setPickerModalNode(null);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{ref.alreadyInTree ? 'Dodaj ponownie jako nową gałąź' : 'Dodaj ten fragment do drzewka'}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 font-sans italic">
                  Brak wersetów pasujących do filtra. Skorzystaj z pola poniżej, aby wpisać dowolny werset.
                </div>
              )}
            </div>

            {/* Custom Siglum Option at bottom of modal */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-800 block">
                Lub wprowadź dowolny inny werset z Pisma Świętego:
              </span>
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <input
                  type="text"
                  value={pickerCustomSiglum}
                  onChange={(e) => setPickerCustomSiglum(e.target.value)}
                  placeholder="Siglum (np. Rdz 22, 1-18)..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-mono text-xs text-slate-900 focus:outline-emerald-600"
                />
                <button
                  type="button"
                  onClick={handleFetchPickerCustomText}
                  disabled={isFetchingPickerCustom || !pickerCustomSiglum.trim()}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  {isFetchingPickerCustom ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
                  <span>Pobierz treść</span>
                </button>
              </div>

              {pickerCustomText && (
                <div className="space-y-2 pt-1">
                  <textarea
                    value={pickerCustomText}
                    onChange={(e) => setPickerCustomText(e.target.value)}
                    rows={2}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs font-scripture text-slate-900 focus:outline-emerald-600"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddCustomFromPicker}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                    >
                      + Dołącz werset do drzewka
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
