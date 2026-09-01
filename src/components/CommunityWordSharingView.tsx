import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Share2, 
  MessageSquarePlus, 
  Heart, 
  Sparkles, 
  BookOpen, 
  Copy, 
  Check, 
  Send, 
  Download, 
  FileText, 
  Plus, 
  RotateCw, 
  User, 
  Flame, 
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ScrutationSession, CommunitySharedSession, CommunityEcho, CommunityIntention } from '../types';
import { audioEngine } from '../utils/audioContemplationEngine';

interface CommunityWordSharingViewProps {
  currentSession: ScrutationSession | null;
  onLoadSessionToWorkspace?: (session: ScrutationSession) => void;
}

const LOCAL_STORAGE_COMMUNITY_ROOMS = 'scrutatio_community_sessions_v1';

export const CommunityWordSharingView: React.FC<CommunityWordSharingViewProps> = ({
  currentSession,
  onLoadSessionToWorkspace
}) => {
  const [activeCommunitySession, setActiveCommunitySession] = useState<CommunitySharedSession | null>(() => {
    // Initial sample room
    return {
      id: 'room_emmaus_2026',
      roomCode: 'EMMAUS',
      sessionTitle: 'Droga do Emaus: Otwarcie oczu przez Pisma',
      mainSiglum: 'Łk 24, 13-35',
      mainVerseText: 'Czy serce nasze nie pałało w nas, kiedy rozmawiał z nami w drodze i Pisma nam wyjaśniał?',
      createdByName: 'Animatorka Maria',
      createdAt: new Date().toISOString(),
      theme: 'Pascha i Eucharystia',
      nodes: [
        { siglum: 'Łk 24, 13-35', text: 'Czy serce nasze nie pałało w nas...', testament: 'NT', relation: 'Punkt wyjścia (Ewangelia)' },
        { siglum: 'Rdz 3, 6-7', text: 'Wtedy otworzyły się im obojgu oczy i poznali, że są nadzy...', testament: 'ST', relation: 'Odwrócenie grzechu pierworodnego w łamaniu chleba' },
        { siglum: 'Iz 53, 7', text: 'Dręczono Go, lecz sam się dał gnębić, nawet nie otworzył ust swoich...', testament: 'ST', relation: 'Mesjasz musiał to wycierpieć, aby wejść do swej chwały' },
        { siglum: '1 Kor 11, 23-26', text: 'Pan Jezus tej nocy, której został wydany, wziął chleb...', testament: 'NT', relation: 'Pamiątka Paschy i Obecność Zmartwychwstałego' }
      ],
      echoes: [
        {
          id: 'echo_1',
          authorName: 'Brat Piotr',
          text: 'To słowo uświadomiło mi, jak często jestem "nierozumny i leniwy w sercu", gdy przychodzi trudność w rodzinie. Łamanie chleba przywraca mi nadzieję.',
          favoriteSiglum: 'Łk 24, 25-26',
          timestamp: 'Dziś, 19:42'
        },
        {
          id: 'echo_2',
          authorName: 'Siostra Anna',
          text: 'Proroctwo z Izajasza 53 pokazało mi, że moje cierpienie nie jest bezsensowne, jeśli złączę je z krzyżem Chrystusa.',
          favoriteSiglum: 'Iz 53, 7',
          timestamp: 'Dziś, 19:50'
        }
      ],
      intentions: [
        {
          id: 'int_1',
          authorName: 'Tomek',
          text: 'Módlmy się za małżeństwa w kryzysie w naszej wspólnocie, aby Chrystus przyszedł do nich w drodze.',
          timestamp: 'Dziś, 20:01'
        },
        {
          id: 'int_2',
          authorName: 'Katarzyna',
          text: 'Dziękczynienie za uzdrowienie relacji z moją mamą po wspólnej modlitwie Słowem.',
          timestamp: 'Dziś, 20:05'
        }
      ]
    };
  });

  const [inputRoomCode, setInputRoomCode] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [echoText, setEchoText] = useState<string>('');
  const [selectedFavoriteSiglum, setSelectedFavoriteSiglum] = useState<string>('');
  const [intentionText, setIntentionText] = useState<string>('');
  const [intentionAuthor, setIntentionAuthor] = useState<string>('');
  const [isCopiedLink, setIsCopiedLink] = useState<boolean>(false);
  const [isCopiedSummary, setIsCopiedSummary] = useState<boolean>(false);
  const [newRoomTitle, setNewRoomTitle] = useState<string>('');

  // Generate new community session from current active workspace
  const handleCreateRoomFromWorkspace = () => {
    if (!currentSession) return;

    const generatedCode = 'SKRUT' + Math.floor(10 + Math.random() * 90);
    const newRoom: CommunitySharedSession = {
      id: `room_${Date.now()}`,
      roomCode: generatedCode,
      sessionTitle: newRoomTitle || currentSession.title || 'Wspólnotowa Skrutacja Słowa',
      mainSiglum: currentSession.initialSiglum,
      mainVerseText: currentSession.initialText,
      createdByName: authorName || 'Uczestnik Kręgu',
      createdAt: new Date().toISOString(),
      theme: currentSession.theme,
      nodes: currentSession.nodes.map(n => ({
        siglum: n.siglum,
        text: n.text,
        testament: n.testament,
        relation: n.crossReferenceReason
      })),
      echoes: [],
      intentions: []
    };

    setActiveCommunitySession(newRoom);
    setNewRoomTitle('');
    audioEngine.strikeBowl(528);
  };

  // Add echo
  const handleAddEcho = (e: React.FormEvent) => {
    e.preventDefault();
    if (!echoText.trim() || !activeCommunitySession) return;

    const newEcho: CommunityEcho = {
      id: `echo_${Date.now()}`,
      authorName: authorName.trim() || 'Anonimowy Brat/Siostra',
      text: echoText.trim(),
      favoriteSiglum: selectedFavoriteSiglum || activeCommunitySession.mainSiglum,
      timestamp: 'Przed chwilą'
    };

    setActiveCommunitySession({
      ...activeCommunitySession,
      echoes: [...activeCommunitySession.echoes, newEcho]
    });

    setEchoText('');
    audioEngine.playSoftChime();
  };

  // Add intention
  const handleAddIntention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentionText.trim() || !activeCommunitySession) return;

    const newInt: CommunityIntention = {
      id: `int_${Date.now()}`,
      authorName: intentionAuthor.trim() || authorName.trim() || 'Uczestnik',
      text: intentionText.trim(),
      timestamp: 'Przed chwilą'
    };

    setActiveCommunitySession({
      ...activeCommunitySession,
      intentions: [...activeCommunitySession.intentions, newInt]
    });

    setIntentionText('');
    audioEngine.playSoftChime();
  };

  // Copy shareable link
  const handleCopyShareLink = () => {
    if (!activeCommunitySession) return;
    const shareUrl = `${window.location.origin}?room=${activeCommunitySession.roomCode}`;
    navigator.clipboard.writeText(shareUrl);
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2000);
  };

  // Export full meeting summary
  const handleCopySummary = () => {
    if (!activeCommunitySession) return;

    const summaryText = `📖 WSPÓLNOTOWE DZIELENIE SŁOWEM BOŻYM
Pokój Wam! Oto podsumowanie skrutacji kręgu biblijnego:

🏷️ TEMAT: ${activeCommunitySession.sessionTitle} (Kod: ${activeCommunitySession.roomCode})
📜 WERSET PRZEWODNI: ${activeCommunitySession.mainSiglum}
«${activeCommunitySession.mainVerseText}»

🔗 ZBADANY ŁAŃCUCH PISMA ŚWIĘTEGO:
${activeCommunitySession.nodes.map((n, i) => `${i + 1}. [${n.testament}] ${n.siglum} - «${n.text}» (${n.relation || ''})`).join('\n')}

💬 ECHA SŁOWA (DZIELENIE):
${activeCommunitySession.echoes.map(e => `• ${e.authorName} (Werset: ${e.favoriteSiglum || '-'}): "${e.text}"`).join('\n')}

🙏 MODLITWY I INTENCJE KRĘGU:
${activeCommunitySession.intentions.map(int => `• ${int.authorName}: ${int.text}`).join('\n')}

Chwała Ojcu i Synowi, i Duchowi Świętemu!`;

    navigator.clipboard.writeText(summaryText);
    setIsCopiedSummary(true);
    setTimeout(() => setIsCopiedSummary(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white shadow-md space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-sans font-bold bg-white/20 backdrop-blur-md text-emerald-100 uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
              <Users className="w-3.5 h-3.5 text-emerald-200" />
              Wspólnotowe Dzielenie Słowem
            </span>
            <span className="font-mono text-xs text-emerald-200 bg-emerald-950/50 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
              Krąg Biblijny • Wspólnota • Dzielenie
            </span>
          </div>

          {activeCommunitySession && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans text-emerald-200">Kod Kręgu:</span>
              <span className="font-mono text-base font-bold bg-white text-emerald-950 px-3.5 py-1 rounded-xl shadow-xs tracking-widest">
                {activeCommunitySession.roomCode}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
            „Gdzie dwaj lub trzej zebrani są w imię moje...”
          </h1>
          <p className="font-sans text-sm sm:text-base text-emerald-100 leading-relaxed max-w-3xl">
            Prowadź skrutację razem ze swoją wspólnotą, kręgiem biblijnym lub rodziną. Dzielcie się echem Słowa (jak dotyka ono konkretnego życia) i wpisujcie wspólne intencje modlitewne.
          </p>
        </div>

        {/* Share & Quick Action Bar */}
        {activeCommunitySession && (
          <div className="pt-2 flex items-center gap-2 flex-wrap border-t border-emerald-500/40">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="px-4 py-2 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {isCopiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{isCopiedLink ? 'Skopiowano link!' : 'Kopiuj link do kręgu'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-sans font-bold border border-emerald-500/50 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isCopiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopiedSummary ? 'Skopiowano podsumowanie!' : 'Kopiuj raport kręgu (WhatsApp/Email)'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Room View */}
      {activeCommunitySession && (
        <div className="space-y-6">
          {/* 1. Scripture Chain of the Community */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Łańcuch Pisma Świętego dla tego Kręgu ({activeCommunitySession.nodes.length} wersetów)
                </h3>
              </div>
              <span className="text-xs font-sans text-slate-500">
                Założone przez: <strong className="text-slate-800">{activeCommunitySession.createdByName}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeCommunitySession.nodes.map((node, nIdx) => (
                <div
                  key={nIdx}
                  className={`p-4 rounded-2xl border transition-all ${
                    node.testament === 'ST'
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-emerald-50/40 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {node.siglum} ({node.testament})
                    </span>
                    <span className="text-[11px] font-sans text-slate-500 italic">
                      {node.relation || 'Werset'}
                    </span>
                  </div>
                  <p className="font-scripture text-sm text-slate-900 italic pt-1 leading-relaxed">
                    «{node.text}»
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Echo Słowa (Spiritual Echoes / Testimonies) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Echo Słowa we Wspólnocie ({activeCommunitySession.echoes.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-500">
                  Jak to Słowo dotyka mojego życia dzisiaj?
                </span>
              </div>

              {/* Echo Feed */}
              <div className="space-y-3.5">
                {activeCommunitySession.echoes.map((echo) => (
                  <div
                    key={echo.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold font-sans">
                          {echo.authorName.charAt(0)}
                        </div>
                        <span className="font-sans text-xs font-bold text-slate-900">
                          {echo.authorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {echo.favoriteSiglum && (
                          <span className="font-mono text-[11px] text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                            {echo.favoriteSiglum}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-sans">
                          {echo.timestamp}
                        </span>
                      </div>
                    </div>

                    <p className="font-sans text-sm text-slate-800 leading-relaxed pl-9">
                      "{echo.text}"
                    </p>
                  </div>
                ))}

                {activeCommunitySession.echoes.length === 0 && (
                  <div className="py-8 text-center text-slate-400 text-xs italic">
                    Brak jeszcze wpisów. Bądź pierwszy i podziel się echem Słowa!
                  </div>
                )}
              </div>

              {/* Add Echo Form */}
              <form onSubmit={handleAddEcho} className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-xs font-sans uppercase font-bold text-slate-700 block">
                  Dodaj swoje Echo Słowa do kręgu:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Twoje Imię (np. Jan, Siostra Maria)..."
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-sans text-slate-900 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                  />

                  <select
                    value={selectedFavoriteSiglum}
                    onChange={(e) => setSelectedFavoriteSiglum(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                  >
                    <option value="">Wybierz werset, który Cię poruszył...</option>
                    {activeCommunitySession.nodes.map(n => (
                      <option key={n.siglum} value={n.siglum}>
                        {n.siglum} ({n.testament})
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  required
                  rows={3}
                  value={echoText}
                  onChange={(e) => setEchoText(e.target.value)}
                  placeholder="Podziel się krótko: co Bóg mówi Ci przez ten fragment? Co czujesz, do czego Cię wzywa?..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-sans text-slate-900 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ml-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Wyślij Echo do Kręgu</span>
                </button>
              </form>
            </div>

            {/* Right: Modlitwy i Intencje Kręgu */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <h3 className="font-serif text-base font-bold text-slate-900">
                      Intencje Kręgu ({activeCommunitySession.intentions.length})
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {activeCommunitySession.intentions.map(int => (
                    <div
                      key={int.id}
                      className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-amber-950">
                        <span>{int.authorName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{int.timestamp}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">
                        {int.text}
                      </p>
                    </div>
                  ))}

                  {activeCommunitySession.intentions.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">
                      Brak intencji. Wpisz prośbę lub dziękczynienie poniżej.
                    </p>
                  )}
                </div>
              </div>

              {/* Add Intention Form */}
              <form onSubmit={handleAddIntention} className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <input
                  type="text"
                  value={intentionAuthor}
                  onChange={(e) => setIntentionAuthor(e.target.value)}
                  placeholder="Imię..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-amber-600"
                />
                <textarea
                  required
                  rows={2}
                  value={intentionText}
                  onChange={(e) => setIntentionText(e.target.value)}
                  placeholder="Wpisz intencję modlitwy kręgu..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 focus:outline-amber-600"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-sans font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  Dodaj intencję modlitewną
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create or Switch Room Box */}
      {currentSession && (
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-sans font-bold text-slate-900">
              Przeniesienie własnej skrutacji do grupy:
            </span>
            <p className="text-xs font-sans text-slate-500">
              Masz aktywną sesję: <strong>"{currentSession.title}"</strong> ({currentSession.nodes.length} wersetów). Utwórz dla niej nowy pokój kręgu.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateRoomFromWorkspace}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-sans font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap"
          >
            Utwórz nowy pokój z mojej skrutacji
          </button>
        </div>
      )}
    </div>
  );
};
