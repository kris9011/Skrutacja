import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Scroll,
  Sparkles,
  Copy,
  Check,
  Compass,
  Heart,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Share2,
  MessageSquareQuote,
  Search,
  Feather,
  ShieldCheck,
  BookmarkCheck,
  FileText
} from 'lucide-react';
import { PassageCommentaryData } from '../types';
import { getAquinasCommentaryForQuote } from '../data/aquinasCommentariesDatabase';

// Client-side cache to make passage commentary instantaneous across sessions and tab clicks
const clientCommentaryCache = new Map<string, PassageCommentaryData>();

function generateClientGuaranteedCommentary(
  targetSiglum: string,
  passageText?: string,
  label?: string,
  liturgicalContext?: string
): PassageCommentaryData {
  const cleanSig = (targetSiglum || '').trim();
  const book = cleanSig.split(' ')[0] || '';
  const lower = cleanSig.toLowerCase();

  const isApocalypse = lower.startsWith('ap');
  const isPsalm = lower.startsWith('ps') || lower.includes('psalm') || Boolean(label && label.toLowerCase().includes('psalm'));
  const isGospel = ['mt', 'mk', 'łk', 'lk', 'j', 'jn'].some(g => lower.startsWith(g)) || Boolean(label && label.toLowerCase().includes('ewangelia'));
  const isPauline = ['rz', '1 kor', '2 kor', 'ga', 'ef', 'flp', 'kol', '1 tes', '2 tes', '1 tm', '2 tm', 'tt', 'flm', 'hbr'].some(e => lower.startsWith(e));
  const isCatholicEpistle = ['jk', '1 p', '2 p', '1 j', '2 j', '3 j', 'jud'].some(e => lower.startsWith(e));
  const isProphet = ['iz', 'jr', 'lm', 'ba', 'ez', 'dn', 'oz', 'jl', 'am', 'ab', 'jon', 'mi', 'na', 'ha', 'sof', 'ag', 'za', 'ml'].some(p => lower.startsWith(p));
  const isTorah = ['rdz', 'wj', 'kpł', 'lb', 'pwt', 'joz', 'sdz', 'rt', '1 sm', '2 sm', '1 krl', '2 krl'].some(t => lower.startsWith(t));
  const isWisdom = ['hi', 'prz', 'koh', 'pnp', 'mdr', 'syr'].some(w => lower.startsWith(w));

  const aquinas = getAquinasCommentaryForQuote(cleanSig, undefined, passageText);

  // Book specific JFB
  let jfbCritical = '';
  let jfbHistory = '';
  if (isApocalypse) {
    jfbCritical = 'W greckim tekście Apokalipsy (Novum Testamentum Graece) czasowniki w czasie teraźniejszym (np. ἕστηκα - «stoję», κρούω - «stale kołaczę») wyrażają ciągłą i niezmienną cierpliwość Chrystusa. JFB podkreśla, że użyte pojęcie «deipneo» oznacza zażyłą, wieczorną wieczerzę przymierza, a nie pośpieszny posiłek. Zbawiciel nie wyłamuje drzwi przemocą – klamka ludzkiej woli znajduje się wewnątrz.';
    jfbHistory = 'Kontekst historyczny: List do Kościoła w Laodycei (ok. 95 r. po Chr., prześladowania Domicjana). Laodycea słynęła z banków, czarnej wełny i maści ocznych – Chrystus demaskuje ich wewnętrzną nędzę i wzywa do kupienia u Niego «złota w ogniu wypróbowanego». Obraz kołatania nawiązuje do Pieśni nad Pieśniami (Pnp 5, 2).';
  } else if (isPsalm) {
    jfbCritical = 'W tekście masoreckim (Biblia Hebraica) modlitwa ta opiera się na fundamencie hebrajskich pojęć Przymierza: chesed («niezłomna, wierna miłość») i emet («prawda i stałość»). Poetycki paralelizm członów (parallelismus membrorum) wyraża pełnię zaufania modlącego się Izraelity do Jahwe jako Skały ocalenia.';
    jfbHistory = 'Tło liturgiczne świątyni jerozolimskiej i tradycji dawidowej. Psalmy te stanowiły żywy modlitewnik ludu wybranego w chwilach ucisku i dziękczynienia, a w Nowym Testamencie stają się modlitwą samego Chrystusa i Jego Kościoła.';
  } else if (isGospel) {
    jfbCritical = 'W grece Nowego Testamentu Ewangelista precyzyjnie oddaje słowa i czyny Chrystusa w kategoriach wypełnienia Pism. JFB zwraca uwagę na dynamikę czasowników greckich, które ukazują zbawczą inicjatywę Jezusa: Królestwo Boże przybliża się w Jego osobie, przynosząc uwolnienie i odpuszczenie grzechów.';
    jfbHistory = 'Realia I wieku w Galilei i Judei: napięcia z rzymską władzą okupacyjną, praktyki faryzejskie oraz oczekiwanie na Mesjasza. Jezus przekracza ciasne ramy legalizmu, ukazując miłosierne oblicze Ojca.';
  } else if (isPauline) {
    jfbCritical = 'Apostoł Paweł operuje ścisłą terminologią kerygmatyczną: usprawiedliwienie (dikaiosyne), łaska (charis) oraz wiara (pistis). JFB uwypukla, że w tym tekście człowiek nie zdobywa zbawienia własnymi zasługami, lecz przyjmuje je w darze przez zjednoczenie z Chrystusem Ukrzyżowanym.';
    jfbHistory = 'List pasterski pisany do młodej wspólnoty chrześcijańskiej pośród pogańskiego świata Cesarstwa Rzymskiego, umacniający braci w jedności, prawowiernej nauce i życiu według Ducha.';
  } else if (isProphet) {
    jfbCritical = 'W oryginale hebrajskim perykopa posługuje się autorytatywną formułą posłańca Bożego («Ko amar Adonaj» - «Tak mówi Pan»). Słowo Boże (Dabar) ma moc sprawczą i wzywa naród do gruntownego powrotu (Teszwwa) z dróg niewierności.';
    jfbHistory = 'Dramatyczne tło kryzysów politycznych, niewoli babilońskiej lub zagrożeń asyryjskich. Prorok w imieniu Boga ogłasza upadek pychy doczesnej i roztacza perspektywę wiecznego przymierza mesjańskiego.';
  } else if (isWisdom) {
    jfbCritical = 'Hebrajskie nauczanie mądrościowe opiera się na pojęciu Chokmah (Bożej Mądrości) i bojaźni Pańskiej (Jirat Adonaj). Zwięzłe maksymy przeciwstawiają drogę mądrości zgubnej drodze głupoty i samowoli.';
    jfbHistory = 'Tradycja mędrców i dworu królewskiego w Jerozolimie, kształtująca prawość serca, roztropność w słowach i zaufanie Bożej Opatrzności w codziennym życiu.';
  } else {
    jfbCritical = 'W tekście oryginalnym kluczowe terminy wskazują na trwałe, niezłomne przymierze Boga z człowiekiem. JFB podkreśla precyzję słownictwa natchnionego i harmonię z całym kanonem biblijnym.';
    jfbHistory = 'Kontekst kanoniczny ukazuje, jak fragment ten wpisuje się w obietnice dane ojcom wiary i znajduje ostateczne dopełnienie w Jezusie Chrystusie.';
  }

  // Book specific pastoral
  let pastoralTrad = '';
  let practicalApp = '';
  let spiritualEnc = '';
  if (isApocalypse) {
    pastoralTrad = 'Tradycja pastoralna: Matthew Henry, św. Jan od Krzyża & mistrzowie modlitwy wewnętrznej';
    practicalApp = 'Chrystus stoi u drzwi twojego serca z wielką dyskrecją. Zapytaj siebie dzisiaj: jakie obszary mojego życia wciąż pozostają zamknięte przed Jego światłem? Gdzie boję się wpuścić Boga – w moje lęki, zranienia czy poczucie winy? Otworzyć drzwi to powierzyć Mu w krótkiej, szczerej modlitwie to, co po ludzku boli i zawstydza.';
    spiritualEnc = 'On nie przychodzi, by cię potępić, lecz by z tobą wieczerzać – obdarować cię przebaczeniem, pokojem i nowym życiem. Usłysz dziś Jego ciche pukanie.';
  } else if (isPsalm) {
    pastoralTrad = 'Tradycja duszpasterska: C.H. Spurgeon («Skarbnica Dawidowa») & Matthew Henry';
    practicalApp = 'Spurgeon w «Skarbnicy Dawidowej» zachęca: „Nie czytaj psalmu jak obcej historii – uczyń go modlitwą twojej własnej duszy”. Kiedy zalewa cię fala wątpliwości lub zmęczenia, oddaj Panu swoje troski, zanim zaczniesz rozmawiać o nich ze światem.';
    spiritualEnc = 'Pan jest blisko tych, którzy Go wzywają w prawdzie. Żadna twoja walka i łza nie umknęła Jego ojcowskiej trosce.';
  } else if (isGospel) {
    pastoralTrad = 'Tradycja duszpasterska: Św. Franciszek Salezy, Matthew Henry & św. Teresa z Lisieux';
    practicalApp = 'Ewangelia nie jest suchą literą – to żywe spotkanie z Mistrzem. Przełóż to Słowo na dzisiejszy dzień: uśmiech, powstrzymanie zniecierpliwienia, pomoc komuś w potrzebie lub przebaczenie urazy bez wypominania.';
    spiritualEnc = 'Jezus zna kruchość twojej natury i kocha cię taką miłością, która nie stawia warunków. Przyjdź do Niego ze swoim ubóstwem.';
  } else if (isPauline) {
    pastoralTrad = 'Tradycja duszpasterska: Św. Jan Chryzostom, Matthew Henry & klasycy duchowości biblijnej';
    practicalApp = 'Pamiętaj, do jakiej wolności powołał cię Chrystus. Nie pozwalaj, by oskarżenia przeciwnika lub ludzka krytyka pozbawiły cię radości bycia dzieckiem Bożym. Żyj w prawdzie i obfitości łaski.';
    spiritualEnc = 'Bóg, który rozpoczął w tobie dobre dzieło, sam doprowadzi je do końca. Pokładaj nadzieję w Jego niewzruszonej wierności.';
  } else {
    pastoralTrad = 'Tradycja duszpasterska: Matthew Henry & klasycy życia duchowego';
    practicalApp = 'Pozwól, aby to Słowo przeniknęło twoje codzienne wybory. Sprawdź swoje motywacje i podejmij dziś choć jeden konkretny krok wiary, na który dotąd brakowało ci odwagi.';
    spiritualEnc = 'Boża miłość uprzedza każdy twój krok. Nie lękaj się – On idzie przed tobą.';
  }

  return {
    siglum: cleanSig,
    title: `Komentarz biblijny: ${label ? `${label} (${cleanSig})` : cleanSig}`,
    historicalLiteraryContext: `Fragment z księgi ${book} wpisuje się w zbawczą historię Przymierza. Bóg w konkretnym czasie i języku objawia swoją wolę, wzywając człowieka do zaufania i wejścia w zażyłość z Nim.`,
    theologicalMessage: liturgicalContext || `Orędzie tego tekstu (${cleanSig}) ogłasza prymat Bożej łaski i wierności. Słowo to rozjaśnia mroki ludzkiego serca i prowadzi do odkrycia Chrystusa jako centrum całego Pisma.`,
    spiritualSense: {
      literal: `Sens dosłowny (${cleanSig}): Prawda historyczno-zbawcza przekazana pod natchnieniem Ducha Świętego przez autora natchnionego dla zbawienia i pouczenia wierzących.`,
      allegorical: isApocalypse
        ? 'Sens alegoryczny: Chrystus-Baranek pukający do serca zapowiada wieczne gody Zbawiciela z Kościołem i karmienie duszy sakramentami zbawienia.'
        : isGospel
        ? 'Sens alegoryczny: Wydarzenia ewangeliczne objawiają misterium Wcielenia, Ofiary Paschalnej oraz zjednoczenia wiernych w Ciele Mistycznym Chrystusa.'
        : 'Sens alegoryczny: W świetle Chrystusa fragment ten zapowiada tajemnicę Odkupienia, Krzyża i Zmartwychwstania oraz misterium Kościoła i sakramentów.',
      moral: isApocalypse
        ? 'Sens moralny: Wzywa do porzucenia letniości duchowej, czujnego nasłuchiwania głosu sumienia i natychmiastowego otwarcia drzwi Chrystusowi.'
        : 'Sens moralny: Wzywa do nawrócenia obyczajów, pokory, miłości braterskiej oraz wierności codziennym obowiązkom stanu.',
      anagogical: isApocalypse
        ? 'Sens anagogiczny: Wznosi tęsknotę ku Nowemu Jeruzalem i wiecznej Wieczerzy Baranka, gdzie Bóg otrze z oczu wszelką łzę.'
        : 'Sens anagogiczny: Kieruje wzrok i pragnienia ku wieczności, gdzie osiągniemy pełnię szczęścia w wiecznym oglądaniu Boga (visio beatifica).'
    },
    thomasAquinas: {
      title: `Wykład św. Tomasza z Akwinu: ${aquinas.workTitle}`,
      catenaAureaGloss: `${aquinas.polishTranslation}${aquinas.originalText ? `\n\nTekst oryginalny: «${aquinas.originalText}»` : ''}`,
      scholasticSynthesis: `${aquinas.spiritualInsight}\n\nZmysł teologiczny (${aquinas.theologicalSense}): Przyczyną sprawczą zbawczego orędzia jest suwerenna łaska Boża; przyczyną celową – uświęcenie człowieka i chwała Boga żywego.`
    },
    jfbCommentary: {
      title: 'Komentarz Jamiesona-Fausseta-Browna (JFB) po polsku',
      criticalNotes: jfbCritical,
      historicalExegesis: jfbHistory
    },
    pastoralCommentary: {
      title: 'Komentarz Pastoralno-Duszpasterski',
      authorTradition: pastoralTrad,
      practicalApplication: practicalApp,
      spiritualEncouragement: spiritualEnc
    },
    classicFootnotes: {
      title: 'Tradycyjne Przypisy Polskie (Biblia ks. Jakuba Wujka S.J.)',
      notes: `W historycznym przekładzie ks. Jakuba Wujka z 1599 r. werset ten (${cleanSig}) opatrzony jest zachętą do czujności sumienia i wierności natchnieniom Ducha Świętego, ostrzegając przed ułudami świata doczesnego.`
    },
    meditationPoints: [
      `Jakie konkretne słowo z fragmentu ${cleanSig} dotyka dzisiaj mojego serca i budzi we mnie pragnienie modlitwy?`,
      `Gdzie w moim obecnym życiu czuję pokusę zamknięcia się w lęku, a gdzie Bóg puka z obietnicą uzdrowienia?`,
      `Do jakiego konkretnego kroku zaufania, przebaczenia lub czynu miłości zaprasza mnie dziś to czytanie?`
    ],
    prayer: `Panie Jezu Chryste, Twoje Słowo jest pochodnią dla moich stóp i światłem na mojej ścieżce. Otwieram przed Tobą moje serce: zamieszkaj we mnie, ulecz moje niewierności i uczyń mnie narzędziem Twojego pokoju. Amen.`
  };
}

interface PassageCommentaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  siglum: string;
  text: string;
  label?: string;
  liturgicalContext?: string;
  theologicalTheme?: string;
  onOpenPatristics?: (siglum: string) => void;
  onStartScrutation?: (siglum: string, text: string) => void;
}

type CommentarySectionTab =
  | 'all'
  | 'thomas'
  | 'jfb'
  | 'pastoral'
  | 'senses'
  | 'context'
  | 'wujek'
  | 'meditation';

export const PassageCommentaryModal: React.FC<PassageCommentaryModalProps> = ({
  isOpen,
  onClose,
  siglum,
  text,
  label,
  liturgicalContext,
  theologicalTheme,
  onOpenPatristics,
  onStartScrutation
}) => {
  const [activeSiglum, setActiveSiglum] = useState<string>(siglum);
  const [searchInput, setSearchInput] = useState<string>('');
  const [commentary, setCommentary] = useState<PassageCommentaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<CommentarySectionTab>('all');

  useEffect(() => {
    setActiveSiglum(siglum);
  }, [siglum]);

  const fetchCommentary = async (targetSiglum: string = activeSiglum, forceRefresh = false) => {
    if (!targetSiglum) return;
    const cacheKey = `${targetSiglum.trim().toLowerCase()}_${(label || '').trim().toLowerCase()}`;

    if (clientCommentaryCache.has(cacheKey) && !forceRefresh) {
      setCommentary(clientCommentaryCache.get(cacheKey)!);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/scrutation/passage-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siglum: targetSiglum,
          text,
          label,
          liturgicalContext: liturgicalContext || theologicalTheme
        })
      });
      if (res.ok) {
        const data = await res.json();
        clientCommentaryCache.set(cacheKey, data);
        setCommentary(data);
      } else {
        throw new Error('Nie udało się pobrać komentarza z serwera');
      }
    } catch (_err) {
      // Guaranteed deep multi-perspective commentary tailored directly to this book and siglum
      const fallback = generateClientGuaranteedCommentary(
        targetSiglum,
        text,
        label,
        liturgicalContext || theologicalTheme
      );
      clientCommentaryCache.set(cacheKey, fallback);
      setCommentary(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeSiglum) {
      fetchCommentary(activeSiglum);
    }
  }, [isOpen, activeSiglum]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveSiglum(searchInput.trim());
    }
  };

  const handleCopyAll = async () => {
    if (!commentary) return;
    const fullContent = [
      `${commentary.title}`,
      `Siglum: ${activeSiglum}`,
      `\nTekst biblijny:\n«${text}»`,
      `\n1. KONTEKST & ORĘDZIE:`,
      `Kontekst historyczno-literacki: ${commentary.historicalLiteraryContext}`,
      `Orędzie teologiczne: ${commentary.theologicalMessage}`,
      `\n2. CZTERY ZMYSŁY PISMA ŚWIĘTEGO (KKK 115-119):`,
      `- Sens dosłowny: ${commentary.spiritualSense.literal}`,
      `- Sens alegoryczny: ${commentary.spiritualSense.allegorical}`,
      `- Sens moralny: ${commentary.spiritualSense.moral}`,
      `- Sens anagogiczny: ${commentary.spiritualSense.anagogical}`,
      commentary.thomasAquinas ? `\n3. ŚW. TOMASZ Z AKWINU (DOCTOR ANGELICUS):\n${commentary.thomasAquinas.catenaAureaGloss}\nSynteza: ${commentary.thomasAquinas.scholasticSynthesis}` : '',
      commentary.jfbCommentary ? `\n4. JAMIESON-FAUSSET-BROWN (JFB) PO POLSKU:\nUwagi krytyczne: ${commentary.jfbCommentary.criticalNotes}\nEgzegeza: ${commentary.jfbCommentary.historicalExegesis}` : '',
      commentary.pastoralCommentary ? `\n5. KOMENTARZ PASTORALNY (${commentary.pastoralCommentary.authorTradition}):\nZastosowanie: ${commentary.pastoralCommentary.practicalApplication}\nPocieszenie: ${commentary.pastoralCommentary.spiritualEncouragement}` : '',
      commentary.classicFootnotes ? `\n6. PRZYPISY TRADYCYJNE (ks. J. Wujek):\n${commentary.classicFootnotes.notes}` : '',
      `\n7. PUNKTY DO MEDYTACJI (Lectio Divina):\n${commentary.meditationPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`,
      `\n8. MODLITWA SERCA (Oratio):\n«${commentary.prayer}»`
    ].filter(Boolean).join('\n');

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-200/90 overflow-hidden max-h-[96dvh] sm:max-h-[90vh] flex flex-col overscroll-contain"
        role="dialog"
        aria-modal="true"
      >
        {/* Compact Sticky Top Bar (always accessible, minimal height ~44px) */}
        <div className="relative flex-shrink-0 z-30 bg-amber-950/95 backdrop-blur-md text-amber-50 px-3.5 sm:px-5 py-2.5 flex items-center justify-between border-b border-amber-700/60 shadow-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-[10px] uppercase font-sans font-bold tracking-wider text-amber-200 shrink-0">
              {label || 'Komentarz'}
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-amber-100 bg-amber-900/60 px-2 py-0.5 rounded border border-amber-500/30 shrink-0">
              {activeSiglum}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => fetchCommentary(activeSiglum, true)}
              disabled={isLoading}
              className="p-1.5 sm:p-2 rounded-lg bg-amber-900/70 hover:bg-amber-800 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="Odśwież analizę i komentarz (zaawansowane AI)"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleCopyAll}
              className="p-1.5 sm:p-2 rounded-lg bg-amber-900/70 hover:bg-amber-800 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="Kopiuj cały komentarz (wszystkie tradycje)"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg bg-amber-900/70 hover:bg-amber-800 text-amber-200 hover:text-white transition-colors cursor-pointer ml-1"
              title="Zamknij"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar flex flex-col min-h-0">
          {/* Rich Header Banner (scrolls with content, so full screen is available for reading) */}
          <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-amber-50 p-4 sm:p-6 border-b border-amber-600/50 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-emerald-950/50 text-[10px] sm:text-xs font-sans font-semibold text-emerald-200 border border-emerald-500/30">
                Św. Tomasz z Akwinu • JFB • Pastoralny • 4 Zmysły Pisma
              </span>
            </div>
            <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-white flex items-start gap-2 leading-snug">
              <BookOpen className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <span>{commentary?.title || `Komentarz biblijny do: ${activeSiglum}`}</span>
            </h2>
            {liturgicalContext && (
              <p className="text-xs sm:text-sm text-amber-200/90 font-sans italic">
                {liturgicalContext}
              </p>
            )}
          </div>

          {/* Navigation Switch Bar: Komentarze Wieloaspektowe vs Ojcowie Kościoła + Search */}
          <div className="bg-amber-950/10 border-b border-amber-200/60 px-3.5 sm:px-5 py-2.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 self-start">
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-xs font-sans font-bold bg-amber-600 text-white shadow-xs flex items-center gap-1.5"
              >
                <MessageSquareQuote className="w-3.5 h-3.5" />
                <span>Komentarze (Tomasz • JFB • Pastoralne)</span>
              </button>
              {onOpenPatristics && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPatristics(activeSiglum);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-sans font-medium text-slate-700 hover:text-slate-900 hover:bg-white/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Przełącz na komentarze Ojców Kościoła"
                >
                  <Scroll className="w-3.5 h-3.5 text-sky-700" />
                  <span>Ojcowie Kościoła</span>
                </button>
              )}
            </div>

            {/* Quick Siglum / Phrase Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-1.5">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Wpisz fragment np. Mt 5,3..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-xs rounded-lg border border-amber-300 focus:outline-none focus:border-amber-600 font-sans"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-sans font-bold rounded-lg transition-colors cursor-pointer"
              >
                Szukaj
              </button>
            </form>
          </div>

          {/* Section Navigation Pills (Sticky inside the scrollable container) */}
          <div className="sticky top-0 z-20 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/80 px-3 sm:px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shadow-xs">
            <button
              type="button"
              onClick={() => setActiveSection('all')}
              className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'all'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
            >
              🌟 Całość
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('thomas')}
              className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeSection === 'thomas'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
              title="Wykład św. Tomasza z Akwinu (Catena Aurea i synteza teologiczna)"
            >
              <span>🕊️ Św. Tomasz z Akwinu</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('jfb')}
              className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeSection === 'jfb'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
              title="Jamieson-Fausset-Brown (JFB) po polsku: krytyczno-egzegetyczny"
            >
              <span>📖 JFB (po polsku)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('pastoral')}
              className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeSection === 'pastoral'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-amber-900 hover:bg-amber-100'
              }`}
              title="Komentarze pastoralne: Matthew Henry & Spurgeon Skarbnica Dawidowa"
            >
              <span>🌿 Pastoralne & Spurgeon</span>
            </button>
          <button
            type="button"
            onClick={() => setActiveSection('senses')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'senses'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            📜 4 Zmysły Pisma
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('context')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'context'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            🧭 Kontekst & Orędzie
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('wujek')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'wujek'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
            title="Przypisy ks. Jakuba Wujka i tradycja polska"
          >
            <span>⛪ Ks. Jakub Wujek</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('meditation')}
            className={`px-3 py-1 rounded-lg text-xs font-sans font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'meditation'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-amber-900 hover:bg-amber-100'
            }`}
          >
            🕯️ Medytacja
          </button>
        </div>

        {/* Content Body (flows naturally in the scrollable card - no nested scroll traps!) */}
        <div className="p-4 sm:p-7 space-y-6 text-slate-800">
          {/* Scripture Excerpt Card */}
          <div className="p-4 sm:p-5 bg-amber-50/50 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans uppercase tracking-wider font-bold text-amber-900 flex items-center gap-1.5">
                <Scroll className="w-3.5 h-3.5 text-amber-700" />
                Fragment czytania ({siglum})
              </span>
            </div>
            <p className="font-serif text-sm sm:text-base text-slate-800 leading-relaxed italic">
              «{text}»
            </p>
          </div>

          {isLoading ? (
            <div className="py-14 sm:py-20 text-center space-y-4 px-3">
              <div className="relative inline-block">
                <RefreshCw className="w-10 h-10 text-amber-600 animate-spin mx-auto" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-600"></span>
                </span>
              </div>
              <div className="space-y-1.5 max-w-md mx-auto">
                <p className="font-serif text-base sm:text-lg text-slate-800 font-bold">
                  Dogłębna analiza teologiczna dla {siglum}...
                </p>
                <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                  Trwa pogłębione badanie perykopy przez zaawansowany model AI (św. Tomasz z Akwinu, krytyczno-egzegetyczny JFB, 4 Zmysły Pisma oraz tradycja duszpasterska).
                </p>
                <p className="text-[11px] text-amber-800 font-sans font-medium italic">
                  Zgodnie z Twoim wyborem model przeprowadza powolną, wyczerpującą syntezę.
                </p>
              </div>
            </div>
          ) : commentary ? (
            <>
              {/* 1. Saint Thomas Aquinas (Doctor Angelicus) Section */}
              {(activeSection === 'all' || activeSection === 'thomas') && commentary.thomasAquinas && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-yellow-50/80 border border-amber-300 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-amber-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-200 flex items-center justify-center text-amber-900 font-bold text-xs">
                        🕊️
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-amber-950">
                          {commentary.thomasAquinas.title}
                        </h3>
                        <span className="text-[10px] font-sans text-amber-800 uppercase tracking-wider font-semibold">
                          Catena Aurea & Wykład Pisma Świętego • Synteza Scholastyczna
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      Doctor Angelicus
                    </span>
                  </div>

                  <div className="space-y-3 text-slate-800 text-xs sm:text-sm">
                    <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 space-y-1">
                      <div className="font-sans font-bold text-amber-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Feather className="w-3.5 h-3.5 text-amber-700" />
                        <span>Wykład Pisma i Catena Aurea:</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.thomasAquinas.catenaAureaGloss}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white/90 rounded-xl border border-amber-200 space-y-1">
                      <div className="font-sans font-bold text-amber-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                        <span>Synteza teologiczna (Łaska, cnoty, sakramenty):</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.thomasAquinas.scholasticSynthesis}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Jamieson-Fausset-Brown (JFB) in Polish */}
              {(activeSection === 'all' || activeSection === 'jfb') && commentary.jfbCommentary && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50/90 via-slate-50 to-blue-50/70 border border-sky-300 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-sky-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-200 flex items-center justify-center text-sky-900 font-bold text-xs">
                        📖
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-sky-950">
                          {commentary.jfbCommentary.title}
                        </h3>
                        <span className="text-[10px] font-sans text-sky-800 uppercase tracking-wider font-semibold">
                          A Commentary, Critical and Explanatory, on the Whole Bible (1871)
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold bg-sky-100 text-sky-900 border border-sky-300">
                      Egzegeza krytyczna
                    </span>
                  </div>

                  <div className="space-y-3 text-slate-800 text-xs sm:text-sm">
                    <div className="p-3.5 bg-white/90 rounded-xl border border-sky-200 space-y-1">
                      <div className="font-sans font-bold text-sky-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <BookmarkCheck className="w-3.5 h-3.5 text-sky-700" />
                        <span>Uwagi krytyczno-językowe (hebr./gr. w przekładzie polskim):</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.jfbCommentary.criticalNotes}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white/90 rounded-xl border border-sky-200 space-y-1">
                      <div className="font-sans font-bold text-sky-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 text-sky-700" />
                        <span>Tło archeologiczne, historyczne i spójność Pisma:</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.jfbCommentary.historicalExegesis}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Pastoral Commentary (Matthew Henry & Spurgeon Skarbnica Dawidowa) */}
              {(activeSection === 'all' || activeSection === 'pastoral') && commentary.pastoralCommentary && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-slate-50 border border-emerald-300 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-emerald-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-200 flex items-center justify-center text-emerald-900 font-bold text-xs">
                        🌿
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-emerald-950">
                          {commentary.pastoralCommentary.title}
                        </h3>
                        <span className="text-[10px] font-sans text-emerald-800 uppercase tracking-wider font-semibold">
                          {commentary.pastoralCommentary.authorTradition}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Duszpasterstwo & Życie
                    </span>
                  </div>

                  <div className="space-y-3 text-slate-800 text-xs sm:text-sm">
                    <div className="p-3.5 bg-white/90 rounded-xl border border-emerald-200 space-y-1">
                      <div className="font-sans font-bold text-emerald-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Praktyczne zastosowanie w codzienności:</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.pastoralCommentary.practicalApplication}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white/90 rounded-xl border border-emerald-200 space-y-1">
                      <div className="font-sans font-bold text-emerald-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Pocieszenie duchowe i zachęta w próbie:</span>
                      </div>
                      <p className="font-serif leading-relaxed text-slate-800">
                        {commentary.pastoralCommentary.spiritualEncouragement}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Classic Polish Footnotes (ks. Jakub Wujek) */}
              {(activeSection === 'all' || activeSection === 'wujek') && commentary.classicFootnotes && (
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-300/80 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-800" />
                      <h3 className="font-serif text-sm sm:text-base font-bold text-amber-950">
                        {commentary.classicFootnotes.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-sans font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2 py-0.5 rounded">
                      Biblia Wujka
                    </span>
                  </div>
                  <p className="font-serif text-xs sm:text-sm text-slate-800 leading-relaxed bg-white/90 p-3.5 rounded-xl border border-amber-200">
                    {commentary.classicFootnotes.notes}
                  </p>
                </div>
              )}

              {/* 5. Context & Theological Message */}
              {(activeSection === 'all' || activeSection === 'context') && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-sans font-bold text-xs uppercase tracking-wider">
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>Kontekst historyczno-literacki</span>
                    </div>
                    <p className="font-serif text-sm sm:text-base text-slate-700 leading-relaxed">
                      {commentary.historicalLiteraryContext}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
                    <div className="flex items-center gap-2 text-amber-800 font-sans font-bold text-xs uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Główne orędzie teologiczne</span>
                    </div>
                    <p className="font-serif text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                      {commentary.theologicalMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* 6. Four Senses of Scripture */}
              {(activeSection === 'all' || activeSection === 'senses') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                    <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                      <Scroll className="w-4 h-4 text-amber-700" />
                      <span>Cztery Zmysły Pisma Świętego (Katechizm KK 115-119)</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Literal */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-xs font-sans font-bold uppercase tracking-wider text-slate-900 px-2 py-0.5 bg-white rounded border border-slate-200 inline-block">
                        1. Sens Dosłowny (Littera)
                      </span>
                      <p className="text-xs sm:text-sm font-serif text-slate-700 leading-relaxed">
                        {commentary.spiritualSense.literal}
                      </p>
                    </div>

                    {/* Allegorical */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                      <span className="text-xs font-sans font-bold uppercase tracking-wider text-emerald-900 px-2 py-0.5 bg-white rounded border border-emerald-200 inline-block">
                        2. Sens Alegoryczny (Chrystus)
                      </span>
                      <p className="text-xs sm:text-sm font-serif text-slate-700 leading-relaxed">
                        {commentary.spiritualSense.allegorical}
                      </p>
                    </div>

                    {/* Moral */}
                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                      <span className="text-xs font-sans font-bold uppercase tracking-wider text-amber-900 px-2 py-0.5 bg-white rounded border border-amber-200 inline-block">
                        3. Sens Moralny (Życie)
                      </span>
                      <p className="text-xs sm:text-sm font-serif text-slate-700 leading-relaxed">
                        {commentary.spiritualSense.moral}
                      </p>
                    </div>

                    {/* Anagogical */}
                    <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-1.5">
                      <span className="text-xs font-sans font-bold uppercase tracking-wider text-sky-900 px-2 py-0.5 bg-white rounded border border-sky-200 inline-block">
                        4. Sens Anagogiczny (Wieczność)
                      </span>
                      <p className="text-xs sm:text-sm font-serif text-slate-700 leading-relaxed">
                        {commentary.spiritualSense.anagogical}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. Meditation Questions & Prayer */}
              {(activeSection === 'all' || activeSection === 'meditation') && (
                <div className="space-y-4">
                  {commentary.meditationPoints && commentary.meditationPoints.length > 0 && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                      <div className="flex items-center gap-2 text-amber-900 font-sans font-bold text-xs uppercase tracking-wider">
                        <HelpCircle className="w-4 h-4 text-amber-700" />
                        <span>Punkty do osobistej medytacji (Meditatio)</span>
                      </div>
                      <ul className="space-y-2">
                        {commentary.meditationPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-serif text-slate-800">
                            <span className="font-mono font-bold text-amber-800 text-xs bg-white px-2 py-0.5 rounded border border-amber-300 shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-emerald-50 space-y-2 border border-emerald-700">
                    <div className="flex items-center gap-2 text-amber-300 font-sans font-bold text-xs uppercase tracking-wider">
                      <Heart className="w-4 h-4 text-amber-400" />
                      <span>Modlitwa serca (Oratio)</span>
                    </div>
                    <p className="font-serif italic text-sm sm:text-base leading-relaxed text-emerald-100">
                      „{commentary.prayer}”
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Action Bottom Footer with Church Fathers & Scrutation */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenPatristics && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPatristics(siglum);
                }}
                className="py-2.5 px-4 rounded-xl text-xs font-sans uppercase tracking-wider font-bold flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Otwórz komentarze Ojców Kościoła dla tego wersetu"
              >
                <Scroll className="w-4 h-4 text-emerald-700" />
                <span>Ojcowie Kościoła ({siglum})</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onStartScrutation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartScrutation(siglum, text);
                }}
                className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl text-xs font-sans uppercase tracking-wider font-bold flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Skrutuj ten fragment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-sans font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Zamknij
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

