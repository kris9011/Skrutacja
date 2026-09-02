export interface BibleVerse {
  siglum: string;
  book: string;
  chapter: number;
  verse: string;
  testament: 'ST' | 'NT';
  text: string;
  context?: string;
  theologicalNote?: string;
  parallelReferences: string[]; // Sigla references
}

export interface ScrutationNode {
  id: string;
  parentId: string | null;
  siglum: string;
  text: string;
  testament: 'ST' | 'NT';
  theologicalTheme?: string;
  crossReferenceReason?: string; // Why this verse connects (e.g. "Typologia paschalna", "Słowo kluczowe: Baranek")
  userNotes?: string;
  order: number;
  isExpanded?: boolean;
  createdAt: number;
  availableCrossReferences?: {
    siglum: string;
    textPreview?: string;
    testament: 'ST' | 'NT';
    relation: string; // e.g. "Wypełnienie w Nowym Testamencie", "Figura w Starym Testamencie", "To samo słowo kluczowe"
  }[];
}

export interface ScrutationSession {
  id: string;
  title: string;
  theme: string;
  initialSiglum: string;
  initialText: string;
  nodes: ScrutationNode[];
  activeStep: number; // 0: Statio/Invocatio, 1: Lectio, 2: Scrutatio, 3: Meditatio, 4: Oratio, 5: Contemplatio, 6: Actio
  prayerNotes: {
    statio: string;
    invocatio: string;
    lectio: string;
    meditatio: string;
    oratio: string;
    contemplatio: string;
    actio: string;
    wordOfLife: string; // Wybrane jedno "Słowo Życia" (Rhema)
  };
  durationSeconds: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BiblicalThemePreset {
  id: string;
  title: string;
  subtitle: string;
  category: 'Pascha i Krzyż' | 'Przymierze i Wiara' | 'Miłosierdzie' | 'Duch Święty' | 'Eucharystia' | 'Uczniostwo';
  initialSiglum: string;
  initialText: string;
  description: string;
  suggestedChain: {
    siglum: string;
    testament: 'ST' | 'NT';
    text: string;
    relation: string;
  }[];
}

export interface BibleBookInfo {
  siglum: string;
  fullName: string;
  polishName: string;
  latinName: string;
  testament: 'ST' | 'NT';
  category: 'Pięcioksiąg' | 'Księgi historyczne' | 'Księgi mądrościowe i poetyckie' | 'Prorocy więksi' | 'Prorocy mniejsi' | 'Ewangelie' | 'Dzieje Apostolskie' | 'Listy Pawłowe' | 'Listy powszechne' | 'Księgi prorockie NT';
  chaptersCount: number;
}

export interface PatristicCommentary {
  id: string;
  author: string; // np. Św. Augustyn z Hippony, Św. Jan Chryzostom, Orygenes, Św. Hieronim, Św. Tomasz z Akwinu (Catena Aurea)
  century: string; // np. IV w., V w., XIII w.
  tradition: 'Łacińska (Zachodnia)' | 'Grecka (Wschodnia)' | 'Syryjska';
  workTitle: string; // np. In Ioannis Evangelium Tractatus, Homiliae in Genesim, Catena Aurea
  originalLanguage: 'Łacina' | 'Greka' | 'Syriacki';
  originalText: string;
  polishTranslation: string;
  theologicalSense: 'Dosłowny (Litteralis)' | 'Alegoryczny / Typologiczny (Allegoricus)' | 'Moralny / Tropologiczny (Tropologicus)' | 'Anagogiczny (Anagogicus)';
  spiritualInsight: string;
}

export interface OriginalScriptureDetails {
  siglum: string;
  polishText: string;
  originalLanguage: 'Greka (Koine)' | 'Hebrajski' | 'Aramajski';
  originalScript: string;
  transliteration: string;
  latinVulgate: string;
  interlinearWords?: {
    original: string;
    transliteration: string;
    polish: string;
    grammarNote?: string;
  }[];
}

export interface DailyReadingItem {
  id: string;
  type: 'firstReading' | 'psalm' | 'secondReading' | 'gospel';
  label: string; // np. "I Czytanie", "Psalm Responsoryjny", "II Czytanie", "Ewangelia"
  siglum: string; // np. "Pwt 4, 1-2. 6-8", "Ps 15, 2-3ab. 3cd-4ab. 5", "Jk 1, 17-18. 21b-22. 27", "Mk 7, 1-8. 14-15. 21-23"
  text: string;
  psalmResponse?: string;
  theologicalTheme?: string;
  liturgicalIntroduction?: string;
  hebrewText?: string;
  greekText?: string;
  latinText?: string;
  keyVerses?: {
    siglum: string;
    label: string;
    text: string;
    theme?: string;
  }[];
}

export interface DailyLiturgicalReadings {
  date: string; // YYYY-MM-DD
  formattedDate: string; // np. "Niedziela, 30 sierpnia 2026"
  liturgicalCelebration: string; // np. "XXII Niedziela Zwykła, Rok B" lub "Wspomnienie św. Moniki"
  liturgicalColor: 'green' | 'red' | 'purple' | 'white';
  liturgicalCycle: string; // np. "Rok B, Cykl I"
  readings: DailyReadingItem[];
}

export interface CrossReferenceItem {
  siglum: string;
  text: string;
  testament: 'ST' | 'NT';
  relation: string;
  explanation: string;
}

export interface ScriptureLookupResult {
  siglum: string;
  bookFullName: string;
  testament: 'ST' | 'NT';
  pericopeTitle: string;
  text: string;
  theologicalTheme: string;
  keyWords?: string[];
  suggestedScrutationTheme: string;
}

export interface RandomScriptureQuote {
  id: string;
  siglum: string;
  bookName: string;
  testament: 'ST' | 'NT';
  category: 'Pięcioksiąg i Historia' | 'Mądrość i Psalmy' | 'Prorocy' | 'Ewangelie' | 'Dzieje i Listy Apostolskie' | 'Apokalipsa';
  title: string;
  text: string;
  theologicalContext: string;
  crossReferencesPreview?: {
    siglum: string;
    relation: string;
    text: string;
    testament: 'ST' | 'NT';
  }[];
}

export interface JewishTraditionCommentary {
  id: string;
  siglum: string;
  hebrewText: string;
  hebrewTransliteration?: string;
  targumArameicText?: string;
  targumPolish?: string;
  sourceName: string; // np. "Targum Onkelos", "Targum Jonatana", "Midrasz Bereszit Rabba", "Rashi", "Talmud (Sanhedryn)"
  era: string; // np. "Tannaim (I-II w.)", "Amoraim (III-V w.)", "Średniowiecze (Rashi, XI w.)"
  rabbinicInterpretation: string;
  christianTypology: string; // Jak to pojęcie wypełnia się w Jezusie Chrystusie i Nowym Testamencie
  theologicalConcept: string; // np. "Akedah (Związanie Izaaka)", "Kippur (Przebłaganie)", "Szechina (Obecność)", "Memra (Słowo Boga)"
  scrutationQuestion: string; // Pytanie do modlitwy i skrutacji
}

export interface CommunityEcho {
  id: string;
  authorName: string;
  text: string;
  favoriteSiglum?: string;
  timestamp: string;
}

export interface CommunityIntention {
  id: string;
  authorName: string;
  text: string;
  timestamp: string;
}

export interface CommunitySharedSession {
  id: string;
  roomCode: string;
  sessionTitle: string;
  mainSiglum: string;
  mainVerseText: string;
  createdByName: string;
  createdAt: string;
  theme?: string;
  nodes: {
    siglum: string;
    text: string;
    testament: 'ST' | 'NT';
    relation?: string;
  }[];
  echoes: CommunityEcho[];
  intentions: CommunityIntention[];
}

export interface ScrutationReminderSettings {
  enabled: boolean;
  scheduledTime: string; // 'HH:MM' (24h format, e.g. '06:00', '20:30')
  daysOfWeek: number[]; // 0: Sunday, 1: Monday, ..., 6: Saturday
  soundEnabled: boolean;
  reminderTitle: string;
  reminderBody: string;
  lastNotifiedDate?: string; // YYYY-MM-DD
}


