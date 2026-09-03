/**
 * Bible Verse Parser & Formatter (Wersyfikacja i Segregacja jak w Biblii św. Pawła)
 * 
 * Pozwala podzielić dowolny tekst biblijny (zarówno z numerami w nawiasach jak (1), [1],
 * jak i tekst ciągły bez numerów) na wyodrębnione wersety, indeksy górne, przypisy
 * oraz akapity perykop wzorowane na Edycji Świętego Pawła (Biblia Paulistów).
 */

export interface ParsedVerse {
  verseNum: number;
  siglum: string;
  text: string;
  chapterHeader?: string;
  words: string[];
}

export interface VerseParagraph {
  paragraphIndex: number;
  verses: ParsedVerse[];
}

/**
 * Konwertuje liczbę na indeks górny unicode (np. 1 -> ¹, 12 -> ¹²)
 */
export function toSuperscript(num: number): string {
  const map: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  return String(num).split('').map(c => map[c] || c).join('');
}

/**
 * Ekstrahuje numer początkowy i końcowy wersetu z siglum, np.
 * "Dn 5, 1-12" -> { startVerse: 1, endVerse: 12 }
 * "Rz 8, 28-39" -> { startVerse: 28, endVerse: 39 }
 * "Dn 5" -> { startVerse: 1, endVerse: undefined }
 */
export function extractVerseRangeFromSiglum(siglum: string): { startVerse: number; endVerse?: number; baseSiglum: string } {
  const cleanSiglum = siglum.trim();
  
  // Format: "Księga Rozdział, Wersety" np. "Dn 5, 1-12" lub "J 3, 16"
  const commaMatch = cleanSiglum.match(/^(.+?)(?:,\s*|\s+w\.\s*)(\d+)(?:[-–—](\d+))?/);
  if (commaMatch) {
    const base = commaMatch[1].trim();
    const start = parseInt(commaMatch[2], 10);
    const end = commaMatch[3] ? parseInt(commaMatch[3], 10) : start;
    return {
      startVerse: !isNaN(start) ? start : 1,
      endVerse: !isNaN(end) ? end : undefined,
      baseSiglum: base
    };
  }

  // Format bez przecinka: np. "Jon 1"
  return {
    startVerse: 1,
    endVerse: undefined,
    baseSiglum: cleanSiglum
  };
}

/**
 * Bezpieczne dzielenie tekstu na zdania (nie tnie po skrótach takich jak np., św., ks., tys., itp.)
 */
function splitIntoSentences(text: string): string[] {
  const normalized = text
    .replace(/[«»]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Zastąp kropki w popularnych skrótach unikalnym placeholderem
  const abbrevProtected = normalized
    .replace(/\bnp\./gi, 'np___DOT___')
    .replace(/\bśw\./gi, 'św___DOT___')
    .replace(/\bks\./gi, 'ks___DOT___')
    .replace(/\btys\./gi, 'tys___DOT___')
    .replace(/\br\./gi, 'r___DOT___')
    .replace(/\bw\./gi, 'w___DOT___')
    .replace(/\bm\.in\./gi, 'm___DOT___in___DOT___')
    .replace(/\bitd\./gi, 'itd___DOT___')
    .replace(/\bitp\./gi, 'itp___DOT___');

  // Dzielimy po kropce, wykrzykniku lub znaku zapytania, po których następuje spacja i wielka litera/cudzysłów/myślnik
  const rawSentences = abbrevProtected.split(/(?<=[.!?])\s+(?=[A-ZĘÓĄŚŁŻŹĆŃ„"1-9—])/);

  return rawSentences
    .map(s => s.replace(/___DOT___/g, '.').trim())
    .filter(s => s.length > 0);
}

/**
 * Główna funkcja parsująca tekst biblijny na ustrukturyzowane wersety
 */
export function parseBiblicalVerses(rawText: string, siglum: string): ParsedVerse[] {
  if (!rawText || !rawText.trim()) return [];

  const { startVerse, endVerse, baseSiglum } = extractVerseRangeFromSiglum(siglum);
  const cleanInput = rawText.trim();

  // 1. Sprawdź, czy tekst zawiera numery w nawiasach (np. (1), (2), [1], [2])
  const bracketRegex = /(?:\((\d+)\)|\[(\d+)\])\s*([^()\[\]]+)/g;
  const bracketMatches: { vNum: number; text: string }[] = [];
  let m;
  while ((m = bracketRegex.exec(cleanInput)) !== null) {
    const vNum = parseInt(m[1] || m[2], 10);
    const vText = m[3].trim();
    if (vText && !isNaN(vNum)) {
      bracketMatches.push({ vNum, text: vText });
    }
  }

  if (bracketMatches.length >= 2) {
    return bracketMatches.map(item => {
      const verseSig = `${baseSiglum}, ${item.vNum}`;
      return {
        verseNum: item.vNum,
        siglum: verseSig,
        text: item.text,
        words: item.text.split(/\s+/).filter(Boolean)
      };
    });
  }

  // 2. Sprawdź, czy tekst zawiera nagłówki rozdziałów, np. [ROZDZIAŁ 1 ...]
  if (cleanInput.includes('[ROZDZIAŁ') || cleanInput.includes('[Rozdział')) {
    const sections = cleanInput.split(/(?=\[ROZDZIAŁ|\bROZDZIAŁ)/i).filter(Boolean);
    const resultVerses: ParsedVerse[] = [];
    
    sections.forEach((section, sIdx) => {
      const headerMatch = section.match(/^\[([^\]]+)\]/);
      const header = headerMatch ? headerMatch[1] : undefined;
      const sectionContent = headerMatch ? section.substring(headerMatch[0].length).trim() : section.trim();
      
      const subVerses = parseBiblicalVerses(sectionContent, `${baseSiglum} ${sIdx + 1}`);
      if (subVerses.length > 0) {
        if (header) {
          subVerses[0].chapterHeader = header;
        }
        resultVerses.push(...subVerses);
      }
    });

    if (resultVerses.length > 0) return resultVerses;
  }

  // 3. Sprawdź numerację w formacie "1 ", "2 " lub "1. ", "2. " na początku zdań, linii lub w tekście
  const lineNumberedRegex = /(?:^|\n|\s{2,})(?:(\d+)[.)\s]+)(.+?)(?=(?:\n\d+[.)\s]+|\s{2,}\d+[.)\s]+)|$)/gs;
  const lineMatches: { vNum: number; text: string }[] = [];
  let lm;
  while ((lm = lineNumberedRegex.exec(cleanInput)) !== null) {
    const vNum = parseInt(lm[1], 10);
    const vText = lm[2].trim();
    if (vText && !isNaN(vNum)) {
      lineMatches.push({ vNum, text: vText });
    }
  }

  if (lineMatches.length >= 2) {
    return lineMatches.map(item => ({
      verseNum: item.vNum,
      siglum: `${baseSiglum}, ${item.vNum}`,
      text: item.text,
      words: item.text.split(/\s+/).filter(Boolean)
    }));
  }

  // 3b. Sprawdź numerację inline np. "1 Słowo... 2 Drugie słowo..."
  const inlineNumberedRegex = /(?:^|\s+)(\d+)[.)\s]+([A-ZĘÓĄŚŁŻŹĆŃ„"«].+?)(?=(?:\s+\d+[.)\s]+[A-ZĘÓĄŚŁŻŹĆŃ„"«])|$)/gs;
  const inlineMatches: { vNum: number; text: string }[] = [];
  let im;
  while ((im = inlineNumberedRegex.exec(cleanInput)) !== null) {
    const vNum = parseInt(im[1], 10);
    const vText = im[2].trim();
    if (vText && !isNaN(vNum)) {
      inlineMatches.push({ vNum, text: vText });
    }
  }

  if (inlineMatches.length >= 2) {
    // Sprawdź czy numery są w miarę sekwencyjne
    const isSequential = inlineMatches.every((item, idx) => idx === 0 || item.vNum > inlineMatches[idx - 1].vNum);
    if (isSequential) {
      return inlineMatches.map(item => ({
        verseNum: item.vNum,
        siglum: `${baseSiglum}, ${item.vNum}`,
        text: item.text,
        words: item.text.split(/\s+/).filter(Boolean)
      }));
    }
  }

  // 4. Fallback dla tekstu ciągłego bez jawnych numerów wersetów (jak w załączonym zrzucie ekranu z Dn 5)
  // Dzielimy tekst na zdania biblijne i przypisujemy im kolejne numery wersetów
  const sentences = splitIntoSentences(cleanInput);

  if (sentences.length === 0) {
    const fallbackText = cleanInput.replace(/[«»]/g, '').trim();
    return [{
      verseNum: startVerse,
      siglum: `${baseSiglum}, ${startVerse}`,
      text: fallbackText,
      words: fallbackText.split(/\s+/).filter(Boolean)
    }];
  }

  // Jeśli znamy zakres wersetów z siglum (np. Dn 5, 1-12 to 12 wersetów)
  const expectedCount = endVerse && endVerse >= startVerse ? (endVerse - startVerse + 1) : sentences.length;

  // Jeżeli liczba zdań odpowiada lub jest zbliżona do liczby wersetów
  if (Math.abs(sentences.length - expectedCount) <= 3 || !endVerse) {
    return sentences.map((sentence, idx) => {
      const vNum = startVerse + idx;
      return {
        verseNum: vNum,
        siglum: `${baseSiglum}, ${vNum}`,
        text: sentence,
        words: sentence.split(/\s+/).filter(Boolean)
      };
    });
  }

  // Jeśli liczba zdań różni się bardziej, łączymy zbyt krótkie zdania lub mapujemy proporcjonalnie
  const verses: ParsedVerse[] = [];
  let currentSentenceIdx = 0;
  for (let i = 0; i < expectedCount && currentSentenceIdx < sentences.length; i++) {
    const vNum = startVerse + i;
    const remainingVerses = expectedCount - i;
    const remainingSentences = sentences.length - currentSentenceIdx;
    
    // Ile zdań wziąć do tego wersetu
    const takeSentences = Math.max(1, Math.round(remainingSentences / remainingVerses));
    const verseSentences = sentences.slice(currentSentenceIdx, currentSentenceIdx + takeSentences);
    currentSentenceIdx += takeSentences;
    
    const verseText = verseSentences.join(' ');
    verses.push({
      verseNum: vNum,
      siglum: `${baseSiglum}, ${vNum}`,
      text: verseText,
      words: verseText.split(/\s+/).filter(Boolean)
    });
  }

  // Jeśli zostały jeszcze jakieś zdania na końcu, dopisz do ostatniego wersetu
  if (currentSentenceIdx < sentences.length && verses.length > 0) {
    const remaining = sentences.slice(currentSentenceIdx).join(' ');
    const last = verses[verses.length - 1];
    last.text += ' ' + remaining;
    last.words = last.text.split(/\s+/).filter(Boolean);
  }

  return verses;
}

/**
 * Grupuje wersety w logiczne akapity (wzorem Edycji Świętego Pawła zazwyczaj 2–4 wersety w akapicie)
 */
export function groupVersesIntoParagraphs(verses: ParsedVerse[], versesPerParagraph: number = 3): VerseParagraph[] {
  if (!verses || verses.length === 0) return [];

  const paragraphs: VerseParagraph[] = [];
  let currentGroup: ParsedVerse[] = [];
  let pIdx = 0;

  verses.forEach((verse, idx) => {
    // Jeśli werset zawiera nagłówek rozdziału, zaczynamy nowy akapit bezwarunkowo
    if (verse.chapterHeader && currentGroup.length > 0) {
      paragraphs.push({
        paragraphIndex: pIdx++,
        verses: currentGroup
      });
      currentGroup = [];
    }

    currentGroup.push(verse);

    // Domyślny podział na akapity co versesPerParagraph wersetów
    if (currentGroup.length >= versesPerParagraph || idx === verses.length - 1) {
      paragraphs.push({
        paragraphIndex: pIdx++,
        verses: currentGroup
      });
      currentGroup = [];
    }
  });

  if (currentGroup.length > 0) {
    paragraphs.push({
      paragraphIndex: pIdx++,
      verses: currentGroup
    });
  }

  return paragraphs;
}
