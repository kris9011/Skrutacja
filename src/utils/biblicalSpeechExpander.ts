/**
 * Polish Biblical Speech Expander
 * Formats biblical sigla, book names, numbers, and liturgical abbreviations
 * into smooth, natural, and prayerful spoken Polish for Web Speech API text-to-speech.
 */

const BOOK_SPOKEN_NAMES: Record<string, string> = {
  // Stary Testament - Pięcioksiąg & Historyczne
  'Rdz': 'Księga Rodzaju',
  'Wj': 'Księga Wyjścia',
  'Kpł': 'Księga Kapłańska',
  'Lb': 'Księga Liczb',
  'Pwt': 'Księga Powtórzonego Prawa',
  'Joz': 'Księga Jozuego',
  'Sdz': 'Księga Sędziów',
  'Rt': 'Księga Rut',
  '1 Sm': 'Pierwsza Księga Samuela',
  '2 Sm': 'Druga Księga Samuela',
  '1 Krl': 'Pierwsza Księga Królewska',
  '2 Krl': 'Druga Księga Królewska',
  '1 Krn': 'Pierwsza Księga Kronik',
  '2 Krn': 'Druga Księga Kronik',
  'Ezd': 'Księga Ezdrasza',
  'Ne': 'Księga Nehemiasza',
  'Tb': 'Księga Tobiasza',
  'Jdt': 'Księga Judyty',
  'Est': 'Księga Estery',
  '1 Mch': 'Pierwsza Księga Machabejska',
  '2 Mch': 'Druga Księga Machabejska',

  // Dydaktyczne & Mądrościowe
  'Hi': 'Księga Hioba',
  'Ps': 'Psalm',
  'Prz': 'Księga Przysłów',
  'Koh': 'Księga Koheleta',
  'Pnp': 'Pieśń nad Pieśniami',
  'Mdr': 'Księga Mądrości',
  'Syr': 'Mądrość Syracha',

  // Prorocy
  'Iz': 'Księga Proroka Izajasza',
  'Jer': 'Księga Proroka Jeremiasza',
  'Lm': 'Lamentacje Jeremiasza',
  'Ba': 'Księga Barucha',
  'Ez': 'Księga Proroka Ezechiela',
  'Dn': 'Księga Proroka Daniela',
  'Oz': 'Księga Proroka Ozeasza',
  'Jl': 'Księga Proroka Joela',
  'Am': 'Księga Proroka Amosa',
  'Ab': 'Księga Proroka Abdiasza',
  'Jon': 'Księga Proroka Jonasza',
  'Mi': 'Księga Proroka Micheasza',
  'Na': 'Księga Proroka Nahuma',
  'Ha': 'Księga Proroka Habakuka',
  'So': 'Księga Proroka Sofoniasza',
  'Ag': 'Księga Proroka Aggeusza',
  'Za': 'Księga Proroka Zachariasza',
  'Ml': 'Księga Proroka Malachiasza',

  // Nowy Testament - Ewangelie
  'Mt': 'Ewangelia według świętego Mateusza',
  'Mk': 'Ewangelia według świętego Marka',
  'Łk': 'Ewangelia według świętego Łukasza',
  'J': 'Ewangelia według świętego Jana',

  // Dzieje i Listy
  'Dz': 'Dzieje Apostolskie',
  'Rz': 'List do Rzymian',
  '1 Kor': 'Pierwszy List do Koryntian',
  '2 Kor': 'Drugi List do Koryntian',
  'Ga': 'List do Galatów',
  'Ef': 'List do Efezjan',
  'Flp': 'List do Filipian',
  'Kol': 'List do Kolosan',
  '1 Tes': 'Pierwszy List do Tesaloniczan',
  '2 Tes': 'Drugi List do Tesaloniczan',
  '1 Tm': 'Pierwszy List do Tymoteusza',
  '2 Tm': 'Drugi List do Tymoteusza',
  'Tt': 'List do Tytusa',
  'Flm': 'List do Filemona',
  'Hbr': 'List do Hebrajczyków',
  'Jk': 'List świętego Jakuba',
  '1 P': 'Pierwszy List świętego Piotra',
  '2 P': 'Drugi List świętego Piotra',
  '1 J': 'Pierwszy List świętego Jana',
  '2 J': 'Drugi List świętego Jana',
  '3 J': 'Trzeci List świętego Jana',
  'Jud': 'List świętego Judy',
  'Ap': 'Apokalipsa świętego Jana'
};

/**
 * Transforms an abbreviated biblical siglum like "Łk 4, 31-37" or "1 Kor 2, 10b-16"
 * into a spoken introduction like:
 * "Ewangelia według świętego Łukasza, rozdział 4, wersety od 31 do 37."
 */
export function expandSiglumForSpeech(siglum: string): string {
  if (!siglum || !siglum.trim()) return '';

  const clean = siglum.trim().replace(/[()[\]]/g, '');

  // Extract Book part and chapter/verses part
  // e.g. "1 Kor 2, 10-16" -> book: "1 Kor", ref: "2, 10-16"
  // e.g. "Łk 4, 31-37" -> book: "Łk", ref: "4, 31-37"
  const match = clean.match(/^((?:\d\s+)?[A-Za-ząćęłńóśźż]+)\s*(.*)$/i);
  if (!match) {
    return clean;
  }

  const rawBook = match[1].trim();
  const rawRef = match[2]?.trim() || '';

  // Look up full book name
  let bookName = BOOK_SPOKEN_NAMES[rawBook];
  if (!bookName) {
    // Try matching without spaces or case-insensitive
    const foundKey = Object.keys(BOOK_SPOKEN_NAMES).find(
      k => k.toLowerCase() === rawBook.toLowerCase()
    );
    bookName = foundKey ? BOOK_SPOKEN_NAMES[foundKey] : rawBook;
  }

  if (!rawRef) {
    return `${bookName}.`;
  }

  // Handle Psalm special syntax (e.g. "Ps 145 (144), 8-9")
  if (rawBook.toLowerCase() === 'ps') {
    const psalmParts = rawRef.replace(/\s*\(\d+\)/g, '').split(',');
    const psalmNum = psalmParts[0]?.trim();
    const versesPart = psalmParts[1]?.trim();

    if (versesPart) {
      return `Psalm ${psalmNum}, wersety ${versesPart.replace(/-/g, ' do ')}.`;
    }
    return `Psalm ${psalmNum}.`;
  }

  // General format: "rozdział X, wersety Y-Z"
  if (rawRef.includes(',')) {
    const [chapter, verses] = rawRef.split(',').map(s => s.trim());
    const cleanVerses = verses.replace(/[a-d]/gi, '').replace(/-/g, ' do ');
    return `${bookName}, rozdział ${chapter}, wersety ${cleanVerses}.`;
  }

  // Single chapter or single verse
  return `${bookName}, ${rawRef}.`;
}

/**
 * Cleans biblical text for natural reading by the speech synthesizer:
 * - Removes editorial bracket marks, foot numbers, asterisks, internal citation symbols
 * - Adds slight phonetic pauses at colons and dashes
 */
export function prepareScriptureTextForSpeech(text: string, siglum?: string, title?: string): string {
  if (!text) return '';

  let cleaned = text
    // Remove footnote numbers & letters e.g. [1], (a), [10b]
    .replace(/\[\d+[a-z]?\]/gi, '')
    .replace(/\(\d+[a-z]?\)/gi, '')
    .replace(/\[[a-z]\]/gi, '')
    // Remove editorial brackets but keep content
    .replace(/[[\]]/g, '')
    // Remove quotation marks that can confuse synthesizer rhythm
    .replace(/[«»„”"]/g, '')
    // Expand ellipsis into a serene pause
    .replace(/\.{3,}/g, ', ')
    // Normalize dashes
    .replace(/—/g, ', ')
    // Clean excessive spaces
    .replace(/\s+/g, ' ')
    .trim();

  let intro = '';
  if (title && !title.includes('(')) {
    intro += `${title}. `;
  }

  if (siglum) {
    const spokenSiglum = expandSiglumForSpeech(siglum);
    intro += `${spokenSiglum} `;
  }

  return intro ? `${intro}\n\n${cleaned}` : cleaned;
}
