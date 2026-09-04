// Słownik Stronga (Greka i Hebrajski) z polskimi definicjami, transliteracją i kodami gramatycznymi
// Zgodny ze standardem Concordance Stronga i biblia.oblubienica.eu

export interface StrongEntry {
  number: string; // np. "3049", "G3049", "H7225"
  language: 'Greek' | 'Hebrew';
  lemma: string; // słowo w alfabecie greckim lub hebrajskim
  transliteration: string; // transkrypcja fonetyczna
  pronunciation?: string;
  partOfSpeech: string; // kod gramatyczny lub część mowy
  shortMeaning: string; // podstawowe znaczenie
  secondaryMeaning?: string; // drugie znaczenie
  definitionPolish: string; // pełna definicja słownikowa
  etymologyNote?: string;
  hebrewOrGreekEquivalent?: string;
  occurrencesCount?: number;
  rootWord?: string;
}

export const STRONGS_DICTIONARY: Record<string, StrongEntry> = {
  // --- 1 Kor 4:1-5 (zgodnie ze zrzutami ekranu z biblia.oblubienica.eu) ---
  '3779': {
    number: '3779',
    language: 'Greek',
    lemma: 'οὕτως',
    transliteration: 'houtōs',
    partOfSpeech: 'Adv',
    shortMeaning: 'Tak',
    secondaryMeaning: 'w ten sposób',
    definitionPolish: 'w ten sposób, tak, w taki sposób, tak samo; przysłówek wskazujący sposób działania lub stan rzeczy.',
    occurrencesCount: 208
  },
  '2248': {
    number: '2248',
    language: 'Greek',
    lemma: 'ἡμᾶς',
    transliteration: 'hēmas',
    partOfSpeech: 'pp 1 Acc Pl',
    shortMeaning: 'nas',
    secondaryMeaning: 'nami',
    definitionPolish: 'nas, nam; zaimek osobowy pierwszej osoby liczby mnogiej w bierniku (od ἐγώ / ἡμεῖς).',
    occurrencesCount: 420
  },
  '3049': {
    number: '3049',
    language: 'Greek',
    lemma: 'λογίζομαι',
    transliteration: 'logizomai',
    partOfSpeech: 'vm Pres midD/pasD 3 Sg',
    shortMeaning: 'niech zalicza',
    secondaryMeaning: 'niech liczy',
    definitionPolish: 'poczytywać, liczyć, sądzić, decydować, rozważać, brać pod uwagę, kalkulować, uznawać za; termin księgowy i prawny oznaczający wpisanie na czyjś rachunek.',
    etymologyNote: 'Od λόγος (logos) – słowo, rachunek, powód.',
    hebrewOrGreekEquivalent: 'hebr. חָשַׁב [chaszaw] (H2803)',
    occurrencesCount: 41
  },
  '444': {
    number: '444',
    language: 'Greek',
    lemma: 'ἄνθρωπος',
    transliteration: 'anthrōpos',
    partOfSpeech: 'n_ Nom Sg m',
    shortMeaning: 'człowiek',
    secondaryMeaning: 'ludzie',
    definitionPolish: 'człowiek, istota ludzka (mężczyzna lub kobieta), śmiertelnik; w przeciwieństwie do zwierząt lub Boga.',
    hebrewOrGreekEquivalent: 'hebr. אָדָם [Adam] (H120) / אִישׁ [Isz] (H376)',
    occurrencesCount: 550
  },
  '5613': {
    number: '5613',
    language: 'Greek',
    lemma: 'ὡς',
    transliteration: 'hōs',
    partOfSpeech: 'Adv',
    shortMeaning: 'jak',
    secondaryMeaning: 'jako',
    definitionPolish: 'jak, jako, jak gdyby, na sposób; przysłówek porównawczy.',
    occurrencesCount: 490
  },
  '5257': {
    number: '5257',
    language: 'Greek',
    lemma: 'ὑπηρέτης',
    transliteration: 'hypēretēs',
    partOfSpeech: 'n_ Acc Pl m',
    shortMeaning: 'podwładnych',
    secondaryMeaning: 'pomocników',
    definitionPolish: 'podwładny, pomocnik, opiekun, sługa; pierwotnie: wioślarz dolnego rzędu na galerze wojennej, następnie urzędnik wykonawczy, pomocnik podlegający dowódcy lub mistrzowi.',
    etymologyNote: 'Złożenie ὑπό (hypo – pod) i ἐρέσσω (eressō – wiosłować).',
    occurrencesCount: 20
  },
  '5547': {
    number: '5547',
    language: 'Greek',
    lemma: 'Χριστός',
    transliteration: 'Christos',
    partOfSpeech: 'n_ Gen Sg m',
    shortMeaning: 'Pomazańca',
    secondaryMeaning: 'Chrystusa',
    definitionPolish: 'Pomazaniec, Namaszczony; Termin, którym określano zazwyczaj królów, kapłanów-lewitów i proroków, ale także zapowiedzianego przez Boga Zbawiciela; W języku hebr. "מָשִׁיחַ" [Masziasz] - Namaszczony, Mesjasz.',
    etymologyNote: 'Od χρίω (chriō) – namaszczać oliwą świętą.',
    hebrewOrGreekEquivalent: 'hebr. מָשִׁיחַ [Masziasz] (H4899)',
    occurrencesCount: 529
  },
  '2532': {
    number: '2532',
    language: 'Greek',
    lemma: 'καί',
    transliteration: 'kai',
    partOfSpeech: 'Conj',
    shortMeaning: 'i',
    secondaryMeaning: 'oraz',
    definitionPolish: 'i, oraz, także, również, nawet; najczęstszy spójnik łączący w grece biblijnej.',
    occurrencesCount: 9000
  },
  '3623': {
    number: '3623',
    language: 'Greek',
    lemma: 'οἰκονόμος',
    transliteration: 'oikonomos',
    partOfSpeech: 'n_ Acc Pl m',
    shortMeaning: 'zarządców',
    secondaryMeaning: 'szafarzy',
    definitionPolish: 'zarządca, szafarz, włodarz, ekonom domu; osoba zarządzająca mieniem i sługami pana domu, odpowiedzialna przed nim za powierzony majątek.',
    etymologyNote: 'Złożenie οἶκος (oikos – dom) i νέμω (nemō – rozdzielać, zarządzać).',
    occurrencesCount: 10
  },
  '3466': {
    number: '3466',
    language: 'Greek',
    lemma: 'μυστήριον',
    transliteration: 'mystērion',
    partOfSpeech: 'n_ Gen Pl n',
    shortMeaning: 'tajemnic',
    secondaryMeaning: 'misteriów',
    definitionPolish: 'tajemnica, coś ukrytego, misterium; w Biblii zamysł Boga niepoznawalny ludzkim rozumem, lecz objawiony przez Ducha Świętego w Chrystusie.',
    etymologyNote: 'Od μύω (myō) – zamykać usta lub oczy.',
    occurrencesCount: 28
  },
  '2316': {
    number: '2316',
    language: 'Greek',
    lemma: 'θεός',
    transliteration: 'theos',
    partOfSpeech: 'n_ Gen Sg m',
    shortMeaning: 'Boga',
    secondaryMeaning: 'Bożych',
    definitionPolish: 'Bóg, jedyny Najwyższy Bóg Stwórca, Bóstwo; w Septuagincie i Nowym Testamencie odpowiednik hebrajskiego Elohim i Jahwe.',
    hebrewOrGreekEquivalent: 'hebr. אֱלֹהִים [Elohim] (H430) / יַהְוֶה [Jahwe] (H3068)',
    occurrencesCount: 1317
  },

  // 1 Kor 4:2
  '5602': {
    number: '5602',
    language: 'Greek',
    lemma: 'ὧδε',
    transliteration: 'hōde',
    partOfSpeech: 'Adv',
    shortMeaning: 'tutaj',
    secondaryMeaning: 'w tym miejscu',
    definitionPolish: 'tutaj, tu, w tej sprawie, w tym położeniu.',
    occurrencesCount: 61
  },
  '3063': {
    number: '3063',
    language: 'Greek',
    lemma: 'λοιπόν',
    transliteration: 'loipon',
    partOfSpeech: 'a_ Nom Sg n',
    shortMeaning: 'wreszcie',
    secondaryMeaning: 'co do reszty',
    definitionPolish: 'wreszcie, w końcu, już, co do reszty, na koniec, ponadto.',
    occurrencesCount: 42
  },
  '2212': {
    number: '2212',
    language: 'Greek',
    lemma: 'ζητέω',
    transliteration: 'zēteō',
    partOfSpeech: 'vi Pres Mid 3 Sg',
    shortMeaning: 'żąda się',
    secondaryMeaning: 'wymaga się',
    definitionPolish: 'żądać, poszukiwać, wymagać, badać, dociekać z usilnością.',
    occurrencesCount: 117
  },
  '1722': {
    number: '1722',
    language: 'Greek',
    lemma: 'ἐν',
    transliteration: 'en',
    partOfSpeech: 'Prep',
    shortMeaning: 'w',
    secondaryMeaning: 'wśród',
    definitionPolish: 'w, wewnątrz, pośród, przez, za pomocą; przyimek z celownikiem.',
    occurrencesCount: 2752
  },
  '3588': {
    number: '3588',
    language: 'Greek',
    lemma: 'ὁ, ἡ, τό',
    transliteration: 'ho, hē, to',
    partOfSpeech: 'd_',
    shortMeaning: 'ten / ta / to',
    secondaryMeaning: 'artykuł określony',
    definitionPolish: 'rodzajnik określony (odpowiednik „ów”, „ten”).',
    occurrencesCount: 19800
  },
  '2443': {
    number: '2443',
    language: 'Greek',
    lemma: 'ἵνα',
    transliteration: 'hina',
    partOfSpeech: 'Conj',
    shortMeaning: 'aby',
    secondaryMeaning: 'żeby',
    definitionPolish: 'aby, by, żeby, w celu aby; spójnik celowy.',
    occurrencesCount: 663
  },
  '4103': {
    number: '4103',
    language: 'Greek',
    lemma: 'πιστός',
    transliteration: 'pistos',
    partOfSpeech: 'a_ Nom Sg m',
    shortMeaning: 'wierny',
    secondaryMeaning: 'godny zaufania',
    definitionPolish: 'wierny, godny zaufania, stały w wierze, prawdomówny, nieugięty w wierności.',
    hebrewOrGreekEquivalent: 'hebr. נֶאֱמָן [ne’eman] (H539)',
    occurrencesCount: 67
  },
  '5100': {
    number: '5100',
    language: 'Greek',
    lemma: 'τις',
    transliteration: 'tis',
    partOfSpeech: 'px Nom Sg m',
    shortMeaning: 'każdy',
    secondaryMeaning: 'ktoś',
    definitionPolish: 'ktoś, jakiś, pewien, ktokolwiek.',
    occurrencesCount: 525
  },
  '2147': {
    number: '2147',
    language: 'Greek',
    lemma: 'εὑρίσκω',
    transliteration: 'heuriskō',
    partOfSpeech: 'vs Aor Pass 3 Sg',
    shortMeaning: 'się okazał',
    secondaryMeaning: 'został znaleziony',
    definitionPolish: 'znaleźć, odnaleźć, okazać się, zostać uznanym.',
    occurrencesCount: 176
  },

  // 1 Kor 4:3-5
  '1698': {
    number: '1698',
    language: 'Greek',
    lemma: 'ἐμοί',
    transliteration: 'emoi',
    partOfSpeech: 'p_ Dat Sg m',
    shortMeaning: 'mnie',
    secondaryMeaning: 'dla mnie',
    definitionPolish: 'mnie, dla mnie (forma emfatyczna).',
    occurrencesCount: 90
  },
  '1161': {
    number: '1161',
    language: 'Greek',
    lemma: 'δέ',
    transliteration: 'de',
    partOfSpeech: 'Conj',
    shortMeaning: 'zaś',
    secondaryMeaning: 'natomiast',
    definitionPolish: 'zaś, a, lecz, natomiast, z kolei.',
    occurrencesCount: 2792
  },
  '1519': {
    number: '1519',
    language: 'Greek',
    lemma: 'εἰς',
    transliteration: 'eis',
    partOfSpeech: 'Prep',
    shortMeaning: 'do',
    secondaryMeaning: 'w / na',
    definitionPolish: 'do, ku, w stronę, na rzecz.',
    occurrencesCount: 1760
  },
  '1646': {
    number: '1646',
    language: 'Greek',
    lemma: 'ἐλάχιστος',
    transliteration: 'elachistos',
    partOfSpeech: 'a_ Acc Sg n',
    shortMeaning: 'najmniejszy',
    secondaryMeaning: 'znikomy',
    definitionPolish: 'najmniejszy, znikomy, bez najmniejszego znaczenia; stopień najwyższy od μικρός.',
    occurrencesCount: 14
  },
  '1510': {
    number: '1510',
    language: 'Greek',
    lemma: 'εἰμί',
    transliteration: 'eimi',
    partOfSpeech: 'vi Pres Act',
    shortMeaning: 'jest',
    secondaryMeaning: 'istnieje',
    definitionPolish: 'być, istnieć, trwać, pozostawać.',
    occurrencesCount: 2460
  },
  '5216': {
    number: '5216',
    language: 'Greek',
    lemma: 'ὑμῶν',
    transliteration: 'hymōn',
    partOfSpeech: 'p_ Gen Pl',
    shortMeaning: 'was',
    secondaryMeaning: 'od was',
    definitionPolish: 'was, wasz, od was.',
    occurrencesCount: 600
  },
  '350': {
    number: '350',
    language: 'Greek',
    lemma: 'ἀνακρίνω',
    transliteration: 'anakrinō',
    partOfSpeech: 'vs Aor Pass 1 Sg',
    shortMeaning: 'sądzony',
    secondaryMeaning: 'badany',
    definitionPolish: 'badać, rozstrzygać, sądzić, przesłuchiwać sądownie, poddawać wnikliwej ocenie.',
    etymologyNote: 'Złożenie ἀνά (w górę/dokładnie) i κρίνω (sądzić).',
    occurrencesCount: 16
  },
  '2228': {
    number: '2228',
    language: 'Greek',
    lemma: 'ἤ',
    transliteration: 'ē',
    partOfSpeech: 'Conj',
    shortMeaning: 'czy',
    secondaryMeaning: 'albo',
    definitionPolish: 'lub, albo, czy też, aniżeli.',
    occurrencesCount: 343
  },
  '5259': {
    number: '5259',
    language: 'Greek',
    lemma: 'ὑπό',
    transliteration: 'hypo',
    partOfSpeech: 'Prep',
    shortMeaning: 'przez',
    secondaryMeaning: 'pod',
    definitionPolish: 'przez (sprawcę), pod, u dołu.',
    occurrencesCount: 220
  },
  '442': {
    number: '442',
    language: 'Greek',
    lemma: 'ἀνθρώπινος',
    transliteration: 'anthrōpinos',
    partOfSpeech: 'a_ Gen Sg f',
    shortMeaning: 'ludzki',
    secondaryMeaning: 'człowieczy',
    definitionPolish: 'ludzki, właściwy ludziom, na miarę człowieka.',
    occurrencesCount: 7
  },
  '2250': {
    number: '2250',
    language: 'Greek',
    lemma: 'ἡμέρα',
    transliteration: 'hēmera',
    partOfSpeech: 'n_ Gen Sg f',
    shortMeaning: 'dzień',
    secondaryMeaning: 'trybunał / sąd',
    definitionPolish: 'dzień, doba, czas, trybunał (dzień sądu ludzkiego).',
    occurrencesCount: 389
  },
  '4893': {
    number: '4893',
    language: 'Greek',
    lemma: 'συνείδησις',
    transliteration: 'syneidēsis',
    partOfSpeech: 'n_ Nom Sg f',
    shortMeaning: 'sumienie',
    secondaryMeaning: 'świadomość',
    definitionPolish: 'świadomość, sumienie, wewnętrzne poczucie prawości lub winy przed Bogiem.',
    occurrencesCount: 30
  },
  '1344': {
    number: '1344',
    language: 'Greek',
    lemma: 'δικαιόω',
    transliteration: 'dikaioō',
    partOfSpeech: 'vi Perf Pass 1 Sg',
    shortMeaning: 'usprawiedliwiony',
    secondaryMeaning: 'uznany prawym',
    definitionPolish: 'ogłaszać prawym, usprawiedliwiać, oczyszczać z zarzutu, uznawać za sprawiedliwego.',
    hebrewOrGreekEquivalent: 'hebr. צָדַק [cadak] (H6663)',
    occurrencesCount: 39
  },
  '2962': {
    number: '2962',
    language: 'Greek',
    lemma: 'Κύριος',
    transliteration: 'Kyrios',
    partOfSpeech: 'n_ Nom Sg m',
    shortMeaning: 'Pan',
    secondaryMeaning: 'Władca',
    definitionPolish: 'Pan, Władca, Suweren, Kyrios; w Septuagincie i Nowym Testamencie tytuł Jahwe oraz zmartwychwstałego Jezusa Chrystusa.',
    hebrewOrGreekEquivalent: 'hebr. יַהְוֶה [Jahwe] (H3068) / אֲדֹנָי [Adonai] (H136)',
    occurrencesCount: 717
  },
  '5461': {
    number: '5461',
    language: 'Greek',
    lemma: 'φωτίζω',
    transliteration: 'phōtizō',
    partOfSpeech: 'vi Fut Act 3 Sg',
    shortMeaning: 'rozjaśni',
    secondaryMeaning: 'oświetli',
    definitionPolish: 'rozjaśniać, oświecać, wydobywać na światło, ujawniać w blasku prawdy (od phōs – światłość).',
    occurrencesCount: 11
  },
  '4655': {
    number: '4655',
    language: 'Greek',
    lemma: 'σκότος',
    transliteration: 'skotos',
    partOfSpeech: 'n_ Gen Sg n',
    shortMeaning: 'ciemnościach',
    secondaryMeaning: 'mroku',
    definitionPolish: 'ciemność, mrok, to co skrywane przed ludźmi i Bogiem, stan grzechu i niewiedzy.',
    occurrencesCount: 31
  },
  '5319': {
    number: '5319',
    language: 'Greek',
    lemma: 'φανερόω',
    transliteration: 'phaneroō',
    partOfSpeech: 'vi Fut Act 3 Sg',
    shortMeaning: 'ujawni',
    secondaryMeaning: 'uczyni jawnym',
    definitionPolish: 'ujawniać, czynić widocznym, manifestować, ukazywać w pełnym świetle.',
    occurrencesCount: 49
  },
  '2588': {
    number: '2588',
    language: 'Greek',
    lemma: 'καρδία',
    transliteration: 'kardia',
    partOfSpeech: 'n_ Gen Pl f',
    shortMeaning: 'serc',
    secondaryMeaning: 'wnętrz',
    definitionPolish: 'serce, najgłębsze wnętrze człowieka, źródło decyzji, woli, sumienia i miłości.',
    hebrewOrGreekEquivalent: 'hebr. לֵבָב [lewaw] / לֵב [lew] (H3824)',
    occurrencesCount: 156
  },

  // --- EWANGELIA JANA 1:1-14 ---
  '3056': {
    number: '3056',
    language: 'Greek',
    lemma: 'λόγος',
    transliteration: 'logos',
    partOfSpeech: 'n_ Nom Sg m',
    shortMeaning: 'Słowo',
    secondaryMeaning: 'Logos',
    definitionPolish: 'Słowo, Mowa, Rozum Boży, Odwieczny Sens; w chrystologii św. Jana przedwieczny Syn Boży, przez którego wszystko się stało.',
    hebrewOrGreekEquivalent: 'hebr. דָּבָר [Dawar] (H1697) / מֵימְרָא [Memra]',
    occurrencesCount: 330
  },
  '746': {
    number: '746',
    language: 'Greek',
    lemma: 'ἀρχή',
    transliteration: 'archē',
    partOfSpeech: 'n_ Dat Sg f',
    shortMeaning: 'początku',
    secondaryMeaning: 'zasadzie',
    definitionPolish: 'początek, zarzewie, źródło, zasada, praprzyczyna wszelkiego bytu.',
    hebrewOrGreekEquivalent: 'hebr. רֵאשִׁית [reszit] (H7225)',
    occurrencesCount: 55
  },
  '4314': {
    number: '4314',
    language: 'Greek',
    lemma: 'πρός',
    transliteration: 'pros',
    partOfSpeech: 'Prep',
    shortMeaning: 'u (ku)',
    secondaryMeaning: 'w relacji twarzą w twarz',
    definitionPolish: 'ku, do, u, naprzeciw; wskazuje na intymną relację dialogu i wspólnoty twarzą w twarz (Słowo było u Boga).',
    occurrencesCount: 700
  },
  '2222': {
    number: '2222',
    language: 'Greek',
    lemma: 'ζωή',
    transliteration: 'zōē',
    partOfSpeech: 'n_ Nom Sg f',
    shortMeaning: 'życie',
    secondaryMeaning: 'życie wieczne',
    definitionPolish: 'życie, życie Boże, niezniszczalna pełnia istnienia w Bogu (w odróżnieniu od bios - biologicznego przetrwania).',
    hebrewOrGreekEquivalent: 'hebr. חַיִּים [chajim] (H2416)',
    occurrencesCount: 135
  },
  '5457': {
    number: '5457',
    language: 'Greek',
    lemma: 'φῶς',
    transliteration: 'phōs',
    partOfSpeech: 'n_ Nom Sg n',
    shortMeaning: 'światłość',
    secondaryMeaning: 'światło',
    definitionPolish: 'światłość, światło, prawda Boża rozpraszająca mroki kłamstwa i grzechu.',
    hebrewOrGreekEquivalent: 'hebr. אוֹר [or] (H216)',
    occurrencesCount: 73
  },
  '4561': {
    number: '4561',
    language: 'Greek',
    lemma: 'σάρξ',
    transliteration: 'sarx',
    partOfSpeech: 'n_ Nom Sg f',
    shortMeaning: 'ciałem',
    secondaryMeaning: 'ludzką naturą',
    definitionPolish: 'ciało, ludzka natura w jej kruchości i śmiertelności; „A Słowo stało się ciałem” (J 1, 14) – tajemnica Wcielenia.',
    hebrewOrGreekEquivalent: 'hebr. בָּשָׂר [basar] (H1320)',
    occurrencesCount: 147
  },

  // --- KLUCZOWE SŁOWA NOWEGO TESTAMENTU ---
  '26': {
    number: '26',
    language: 'Greek',
    lemma: 'ἀγάπη',
    transliteration: 'agapē',
    partOfSpeech: 'n_ Nom Sg f',
    shortMeaning: 'miłość',
    secondaryMeaning: 'miłość ofiarna',
    definitionPolish: 'miłość Boża, ofiarna, bezinteresowna, wierna aż do oddania życia; Bóg jest miłością (1 J 4, 8).',
    hebrewOrGreekEquivalent: 'hebr. אַהֲבָה [ahawa] (H160) / חֶסֶד [chesed] (H2617)',
    occurrencesCount: 116
  },
  '4151': {
    number: '4151',
    language: 'Greek',
    lemma: 'πνεῦμα',
    transliteration: 'pneuma',
    partOfSpeech: 'n_ Nom Sg n',
    shortMeaning: 'Duch',
    secondaryMeaning: 'tchnienie / wiatr',
    definitionPolish: 'Duch, Duch Święty, tchnienie życia, oddech Boga; ożywcza moc uświęcająca człowieka.',
    hebrewOrGreekEquivalent: 'hebr. רוּחַ [Ruach] (H7307)',
    occurrencesCount: 379
  },
  '5485': {
    number: '5485',
    language: 'Greek',
    lemma: 'χάρις',
    transliteration: 'charis',
    partOfSpeech: 'n_ Nom Sg f',
    shortMeaning: 'łaska',
    secondaryMeaning: 'życzliwość darmo dana',
    definitionPolish: 'łaska, darmo dany dar Bożej miłości i przychylności, wdzięk, dar zbawienia.',
    hebrewOrGreekEquivalent: 'hebr. חֵן [chen] (H2580)',
    occurrencesCount: 155
  },
  '4102': {
    number: '4102',
    language: 'Greek',
    lemma: 'πίστις',
    transliteration: 'pistis',
    partOfSpeech: 'n_ Nom Sg f',
    shortMeaning: 'wiara',
    secondaryMeaning: 'zaufanie',
    definitionPolish: 'wiara, ufność, przylgnięcie całym sercem do Boga i Jego obietnic, wierność.',
    hebrewOrGreekEquivalent: 'hebr. אֱמוּנָה [emuna] (H530)',
    occurrencesCount: 243
  },
  '225': {
    number: '225',
    language: 'Greek',
    lemma: 'ἀλήθεια',
    transliteration: 'alētheia',
    partOfSpeech: 'n_ Nom Sg f',
    shortMeaning: 'prawda',
    secondaryMeaning: 'rzeczywistość Boża',
    definitionPolish: 'prawda, wierność prawdzie, niestosowanie kłamstwa; odsłonięta rzeczywistość Boża.',
    hebrewOrGreekEquivalent: 'hebr. אֱמֶת [emet] (H571)',
    occurrencesCount: 109
  },
  '1515': {
    number: '1515',
    language: 'Greek',
    lemma: 'εἰρήνη',
    transliteration: 'eirēnē',
    partOfSpeech: 'n_ Nom Sg f',
    shortMeaning: 'pokój',
    secondaryMeaning: 'zbawcza pełnia',
    definitionPolish: 'pokój, pokój serca, pojednanie z Bogiem; grecki odpowiednik hebrajskiego Szalom.',
    hebrewOrGreekEquivalent: 'hebr. שָׁלוֹם [Szalom] (H7965)',
    occurrencesCount: 92
  },

  // --- STARY TESTAMENT (Hebrajski) ---
  'H7225': {
    number: 'H7225',
    language: 'Hebrew',
    lemma: 'רֵאשִׁית',
    transliteration: 'rē’shît',
    partOfSpeech: 'Rzeczownik żeński',
    shortMeaning: 'początek',
    secondaryMeaning: 'pierwociny',
    definitionPolish: 'początek, pierwocina, główna część, najwcześniejszy czas, pierwsze plony; w Rdz 1, 1: «Bereszit» – Na początku.',
    hebrewOrGreekEquivalent: 'gr. ἀρχή [archē] (G746)',
    occurrencesCount: 51
  },
  'H1254': {
    number: 'H1254',
    language: 'Hebrew',
    lemma: 'בָּרָא',
    transliteration: 'bārā’',
    partOfSpeech: 'Czasownik Qal',
    shortMeaning: 'stworzył',
    secondaryMeaning: 'powołał z niczego',
    definitionPolish: 'stworzyć, powołać do bytu z niczego (creatio ex nihilo); w Biblii hebrajskiej orzecznik zarezerwowany wyłącznie dla stwórczego działania samego Boga.',
    occurrencesCount: 54
  },
  'H430': {
    number: 'H430',
    language: 'Hebrew',
    lemma: 'אֱלֹהִים',
    transliteration: '’ĕlōhîm',
    partOfSpeech: 'Rzeczownik męski l.mn. majestatis',
    shortMeaning: 'Bóg',
    secondaryMeaning: 'Sędzia Najwyższy',
    definitionPolish: 'Bóg, Najwyższy Bóg Stwórca, Bóstwo; forma gramatyczna liczby mnogiej majestatu (pluralis majestatis), wskazująca na nieskończoną wielkość i pełnię mocy jedynego Boga.',
    hebrewOrGreekEquivalent: 'gr. θεός [theos] (G2316)',
    occurrencesCount: 2602
  },
  'H8064': {
    number: 'H8064',
    language: 'Hebrew',
    lemma: 'שָׁמַיִם',
    transliteration: 'shāmayim',
    partOfSpeech: 'Rzeczownik męski l.podwójna',
    shortMeaning: 'niebiosa',
    secondaryMeaning: 'niebo',
    definitionPolish: 'niebiosa, niebo, sklepienie niebieskie, mieszkanie chwały Bożej.',
    occurrencesCount: 421
  },
  'H776': {
    number: 'H776',
    language: 'Hebrew',
    lemma: 'אֶרֶץ',
    transliteration: '’erets',
    partOfSpeech: 'Rzeczownik żeński',
    shortMeaning: 'ziemia',
    secondaryMeaning: 'kraj / ląd',
    definitionPolish: 'ziemia, glob ziemski, ląd, kraj, terytorium.',
    occurrencesCount: 2504
  },
  'H7307': {
    number: 'H7307',
    language: 'Hebrew',
    lemma: 'רוּחַ',
    transliteration: 'rûach',
    partOfSpeech: 'Rzeczownik żeński/męski',
    shortMeaning: 'Duch',
    secondaryMeaning: 'wiatr / tchnienie',
    definitionPolish: 'Duch, wiatr, tchnienie, oddech; w Rdz 1, 2: «Ruach Elohim» – Duch Boży unoszący się nad wodami.',
    hebrewOrGreekEquivalent: 'gr. πνεῦμα [pneuma] (G4151)',
    occurrencesCount: 378
  },
  'H3068': {
    number: 'H3068',
    language: 'Hebrew',
    lemma: 'יַהְוֶה',
    transliteration: 'YHWH / Yahweh',
    partOfSpeech: 'Imię własne Boga',
    shortMeaning: 'JAHWE',
    secondaryMeaning: 'Pan (On Jest)',
    definitionPolish: 'Tetragrammaton – Najświętsze Imię Boga objawione Mojżeszowi w krzewie gorejącym (Wj 3, 14: „Jestem, Który Jestem”). Z szacunku zastępowane w czytaniu słowem Adonai (Pan).',
    hebrewOrGreekEquivalent: 'gr. Κύριος [Kyrios] (G2962)',
    occurrencesCount: 6828
  },
  'H2617': {
    number: 'H2617',
    language: 'Hebrew',
    lemma: 'חֶסֶד',
    transliteration: 'chesed',
    partOfSpeech: 'Rzeczownik męski',
    shortMeaning: 'miłosierdzie',
    secondaryMeaning: 'łaskawość przymierza',
    definitionPolish: 'miłosierdzie, wierność przymierzu, łaskawość, niezłomna miłość Boga do swego ludu; fundament hebrajskiej teologii przymierza.',
    hebrewOrGreekEquivalent: 'gr. ἔλεος [eleos] / ἀγάπη [agapē]',
    occurrencesCount: 248
  },
  'H7965': {
    number: 'H7965',
    language: 'Hebrew',
    lemma: 'שָׁלוֹם',
    transliteration: 'shālôm',
    partOfSpeech: 'Rzeczownik męski',
    shortMeaning: 'pokój',
    secondaryMeaning: 'pomyślność / pełnia',
    definitionPolish: 'pokój, harmonia, pełnia zbawienia, pomyślność, zdrowie, brak wojny i pojednanie z Bogiem i bliźnimi.',
    hebrewOrGreekEquivalent: 'gr. εἰρήνη [eirēnē] (G1515)',
    occurrencesCount: 236
  },
  'H7462': {
    number: 'H7462',
    language: 'Hebrew',
    lemma: 'רָעָה',
    transliteration: 'rā‘āh',
    partOfSpeech: 'Czasownik Qal',
    shortMeaning: 'pasterzuje',
    secondaryMeaning: 'pasie / prowadzi',
    definitionPolish: 'paść trzodę, być pasterzem, karmić, prowadzić na pastwiska; w Ps 23, 1: «Jahwe ro’i» – Pan jest moim pasterzem.',
    occurrencesCount: 167
  },

  // --- MODŁY / MODLITWA / BŁAGANIE (Łk 5:33, Flp 4:6, Hbr 5:7, 1 Tm 2:1) ---
  '1162': {
    number: '1162',
    language: 'Greek',
    lemma: 'δέησις',
    transliteration: 'deēsis',
    partOfSpeech: 'n_ Acc Pl f / n_ Nom Sg f',
    shortMeaning: 'modły',
    secondaryMeaning: 'błagania / modlitwa błagalna',
    definitionPolish: 'modły, błaganie, usilna prośba, modlitwa błagalna zanoszona do Boga w poczuciu osobistej bezsilności i głębokiej potrzeby; w Łk 5, 33: «Uczniowie Jana poszczą często i modły odprawiają» (δεήσεις ποιοῦνται). Występuje w kluczowych miejscach Nowego Testamentu obok προσευχή (proseuchē), oznaczając wołanie o Boże zmiłowanie.',
    etymologyNote: 'Rzeczownik od δέομαι (deomai – prosić, błagać z głębi serca).',
    hebrewOrGreekEquivalent: 'hebr. תְּפִלָּה [tefillah] (H8605) / תַּחֲנוּן [tachanun] (H8469)',
    occurrencesCount: 19
  },
  '4335': {
    number: '4335',
    language: 'Greek',
    lemma: 'προσευχή',
    transliteration: 'proseuchē',
    partOfSpeech: 'n_ Nom Sg f',
    shortMeaning: 'modlitwa',
    secondaryMeaning: 'modły / rozmowa z Bogiem',
    definitionPolish: 'modlitwa, zanoszenie próśb, cześć oddawana Bogu, miejsce modlitwy (synagoga, dom modlitwy); najszerszy i najświętszy termin określający relację synowską człowieka z Bogiem Ojcem.',
    etymologyNote: 'Złożenie πρός (pros – twarzą w twarz ku) i εὔχομαι (euchomai – ślubować, modlić się).',
    hebrewOrGreekEquivalent: 'hebr. תְּפִלָּה [tefillah] (H8605)',
    occurrencesCount: 86
  },
  '4336': {
    number: '4336',
    language: 'Greek',
    lemma: 'προσεύχομαι',
    transliteration: 'proseuchomai',
    partOfSpeech: 'vi Pres Mid / Aor Mid',
    shortMeaning: 'modlić się',
    secondaryMeaning: 'odprawiać modły / wołać do Pana',
    definitionPolish: 'modlić się, zanosić modły, rozmawiać z Bogiem w ufności; Jezus wzór modlitwy w samotności i w Getsemani (Mt 6, 5-9; Łk 11, 1-2; Rz 8, 26).',
    etymologyNote: 'Czasownik od προσευχή.',
    hebrewOrGreekEquivalent: 'hebr. פָּלַל [palal] (H6419)',
    occurrencesCount: 87
  },
  '1189': {
    number: '1189',
    language: 'Greek',
    lemma: 'δέομαι',
    transliteration: 'deomai',
    partOfSpeech: 'v_ Dep Mid/Pass',
    shortMeaning: 'błagać',
    secondaryMeaning: 'prosić usilnie / modlić się',
    definitionPolish: 'błagać, prosić z udręką i pokorą, zanosić suplikacje do Boga lub władcy; odczuwać brak i wołać o ratunek.',
    occurrencesCount: 22
  },
  '2428': {
    number: '2428',
    language: 'Greek',
    lemma: 'ἱκετηρία',
    transliteration: 'hiketēria',
    partOfSpeech: 'n_ Acc Pl f',
    shortMeaning: 'modły błagalne',
    secondaryMeaning: 'błagania ze łzami',
    definitionPolish: 'modlitwy błagalne, usilne prośby; pierwotnie gałązka oliwna opleciona wełną niesiona przez błagalnika o ratunek. W Hbr 5, 7: Chrystus z głośnym wołaniem i płaczem zanosił gorące prośby i modły błagalne do Ojca.',
    occurrencesCount: 1
  },

  // --- POST / UCZNIOWIE / FARYZEUSZE / OBLUBIENIEC (Łk 5:33-39) ---
  '3522': {
    number: '3522',
    language: 'Greek',
    lemma: 'νηστεύω',
    transliteration: 'nēsteuō',
    partOfSpeech: 'vi Pres Act / vi Fut Act',
    shortMeaning: 'poszczą',
    secondaryMeaning: 'powstrzymują się od jedzenia',
    definitionPolish: 'pościć, wstrzymywać się od pokarmów ze względów religijnych, umartwiać duszę w oczekiwaniu na przyjście Mesjasza; w Łk 5, 33: «Uczniowie Jana poszczą często».',
    etymologyNote: 'Od νῆστις (nēstis – nie jedzący, poszczący: νη- przedrostek przeczący + ἐσθίω).',
    hebrewOrGreekEquivalent: 'hebr. צוּם [tsum] (H6684)',
    occurrencesCount: 21
  },
  '3521': {
    number: '3521',
    language: 'Greek',
    lemma: 'νηστεία',
    transliteration: 'nēsteia',
    partOfSpeech: 'n_ Nom Sg f',
    shortMeaning: 'post',
    secondaryMeaning: 'czas wstrzemięźliwości',
    definitionPolish: 'post, czas wstrzemięźliwości i żalu za grzechy, Dzień Pojednania (Jom Kippur); w tradycji biblijnej znak pokory przed Bogiem.',
    hebrewOrGreekEquivalent: 'hebr. צוֹם [tsom] (H6685)',
    occurrencesCount: 8
  },
  '3101': {
    number: '3101',
    language: 'Greek',
    lemma: 'μαθητής',
    transliteration: 'mathētēs',
    partOfSpeech: 'n_ Nom Pl m / n_ Nom Sg m',
    shortMeaning: 'uczeń',
    secondaryMeaning: 'naśladowca / adept',
    definitionPolish: 'uczeń, naśladowca, uczeń Chrystusa, Jana Chrzciciela lub faryzeuszów; ten, który przyswaja naukę mistrza i naśladuje jego styl życia.',
    etymologyNote: 'Od μανθάνω (manthanō – uczyć się, poznawać przez doświadczenie).',
    hebrewOrGreekEquivalent: 'hebr. תַּלְמִיד [talmid] (H8527)',
    occurrencesCount: 261
  },
  '2491': {
    number: '2491',
    language: 'Greek',
    lemma: 'Ἰωάννης',
    transliteration: 'Iōannēs',
    partOfSpeech: 'n_ Gen Sg m / n_ Nom Sg m',
    shortMeaning: 'Jan',
    secondaryMeaning: 'Jana Chrzciciela',
    definitionPolish: 'Jan – imię hebrajskie Jochanan: «Jahwe okazał łaskę / Jahwe jest miłościwy»; Jan Chrzciciel, prekursor Chrystusa, oraz Jan Apostoł, umiłowany uczeń.',
    hebrewOrGreekEquivalent: 'hebr. יוֹחָנָן [Jochanan] (H3110)',
    occurrencesCount: 135
  },
  '5330': {
    number: '5330',
    language: 'Greek',
    lemma: 'Φαρισαῖος',
    transliteration: 'Pharisaios',
    partOfSpeech: 'n_ Gen Pl m / n_ Nom Sg m',
    shortMeaning: 'faryzeusz',
    secondaryMeaning: 'odłączony',
    definitionPolish: 'faryzeusz; członek żydowskiego stronnictwa religijnego, kładącego nacisk na drobiazgowe przestrzeganie Prawa Mojżeszowego i tradycji starszych.',
    etymologyNote: 'Z języka aramejskiego i hebrajskiego: פְּרוּשִׁים [peruszim – odłączeni, wyodrębnieni].',
    occurrencesCount: 100
  },
  '3566': {
    number: '3566',
    language: 'Greek',
    lemma: 'νυμφίος',
    transliteration: 'nymphios',
    partOfSpeech: 'n_ Nom Sg m',
    shortMeaning: 'pan młody',
    secondaryMeaning: 'oblubieniec',
    definitionPolish: 'pan młody, oblubieniec; w Ewangelii tytuł mesjański samego Jezusa Chrystusa, Oblubieńca Kościoła i Nowego Izraela (Łk 5, 34-35; J 3, 29; Mt 25, 1-13).',
    etymologyNote: 'Od νύμφη (nymphē – oblubienica).',
    hebrewOrGreekEquivalent: 'hebr. חָתָן [chatan] (H2860)',
    occurrencesCount: 16
  },
  '3567': {
    number: '3567',
    language: 'Greek',
    lemma: 'νυμφών',
    transliteration: 'nymphōn',
    partOfSpeech: 'n_ Gen Sg m',
    shortMeaning: 'komnata weselna',
    secondaryMeaning: 'goście weselni / orszak',
    definitionPolish: 'komnata weselna, łożnica zaślubin; wyrażenie «synowie komnaty weselnej» (υἱοὶ τοῦ νυμφῶνος) w Łk 5, 34 oznacza druhów pana młodego, biesiadników i gości weselnych cieszących się obecnością Oblubieńca.',
    occurrencesCount: 3
  },
  '3565': {
    number: '3565',
    language: 'Greek',
    lemma: 'νύμφη',
    transliteration: 'nymphē',
    partOfSpeech: 'n_ Nom Sg f',
    shortMeaning: 'oblubienica',
    secondaryMeaning: 'panna młoda / synowa',
    definitionPolish: 'oblubienica, panna młoda, nowo poślubiona; w teologii biblijnej Kościół jako Oblubienica Baranka (Ap 21, 2; 22, 17).',
    hebrewOrGreekEquivalent: 'hebr. כַּלָּה [kallah] (H3618)',
    occurrencesCount: 8
  },
  '3631': {
    number: '3631',
    language: 'Greek',
    lemma: 'οἶνος',
    transliteration: 'oinos',
    partOfSpeech: 'n_ Nom Sg m / n_ Acc Sg m',
    shortMeaning: 'wino',
    secondaryMeaning: 'młode wino / napój weselny',
    definitionPolish: 'wino; w Piśmie Świętym znak radości mesjańskiej, obfitości błogosławieństwa eschatologicznego oraz Nowego Przymierza we Krwi Chrystusa (Łk 5, 37; J 2, 1-11; Ps 104, 15).',
    hebrewOrGreekEquivalent: 'hebr. יַיִן [jajin] (H3196) / תִּירוֹשׁ [tirosz] (H8492)',
    occurrencesCount: 34
  },
  '779': {
    number: '779',
    language: 'Greek',
    lemma: 'ἀσκός',
    transliteration: 'askos',
    partOfSpeech: 'n_ Acc Pl m / n_ Nom Sg m',
    shortMeaning: 'bukłak',
    secondaryMeaning: 'skórzany wór na płyny',
    definitionPolish: 'bukłak, wór wykonany ze skóry koźlej lub owczej służący do przechowywania wina, wody lub mleka; młode wino fermentując rozszerza nowy, elastyczny bukłak, podczas gdy stwardniały stary bukłak pęka (Łk 5, 37-38).',
    hebrewOrGreekEquivalent: 'hebr. נֹאד [nod] (H4997)',
    occurrencesCount: 12
  },
  '2537': {
    number: '2537',
    language: 'Greek',
    lemma: 'καινός',
    transliteration: 'kainos',
    partOfSpeech: 'a_ Nom Sg m / a_ Acc Sg m',
    shortMeaning: 'nowy',
    secondaryMeaning: 'świeży / odnowiony w jakości',
    definitionPolish: 'nowy, nowatorski, niespotykany, odnowiony w naturze i substancji (w odróżnieniu od νέος – nowy jedynie w czasie); Nowe Przymierze, nowe wino Ewangelii, nowe stworzenie w Chrystusie (Łk 5, 38; 2 Kor 5, 17; Ap 21, 5).',
    hebrewOrGreekEquivalent: 'hebr. חָדָשׁ [chadasz] (H2319)',
    occurrencesCount: 42
  },
  '3820': {
    number: '3820',
    language: 'Greek',
    lemma: 'παλαιός',
    transliteration: 'palaios',
    partOfSpeech: 'a_ Nom Sg m / a_ Acc Sg m',
    shortMeaning: 'stary',
    secondaryMeaning: 'dawny / zużyty',
    definitionPolish: 'stary, dawny, znoszony, należący do przemijającego porządku rzeczy; stary człowiek grzechu i stare szaty (Łk 5, 36-39; Rz 6, 6; Ef 4, 22).',
    hebrewOrGreekEquivalent: 'hebr. יָשָׁן [jaszan] (H3465)',
    occurrencesCount: 19
  },
  '4160': {
    number: '4160',
    language: 'Greek',
    lemma: 'ποιέω',
    transliteration: 'poieō',
    partOfSpeech: 'vi Pres Mid 3 Pl / v_ Act',
    shortMeaning: 'odprawiają',
    secondaryMeaning: 'czynią / sprawują',
    definitionPolish: 'czynić, odprawiać, wykonywać, wytwarzać, sprawować; w idiomie greckim «δεήσεις ποιοῦνται» oznacza odprawiać modły, wznosić błagania (Łk 5, 33; 1 Tm 2, 1).',
    hebrewOrGreekEquivalent: 'hebr. עָשָׂה [asah] (H6213)',
    occurrencesCount: 568
  },
  '4437': {
    number: '4437',
    language: 'Greek',
    lemma: 'πυκνός',
    transliteration: 'pyknos',
    partOfSpeech: 'Adv / a_ Nom Sg n',
    shortMeaning: 'często',
    secondaryMeaning: 'gęsto / gorliwie',
    definitionPolish: 'często, gęsto, wielokrotnie, nieustannie; w Łk 5, 33: «poszczą często» – o regularnej, częstej praktyce ascetycznej.',
    occurrencesCount: 4
  },
  '3668': {
    number: '3668',
    language: 'Greek',
    lemma: 'ὁμοίως',
    transliteration: 'homoiōs',
    partOfSpeech: 'Adv',
    shortMeaning: 'podobnie',
    secondaryMeaning: 'tak samo / w ten sam sposób',
    definitionPolish: 'podobnie, tak samo, w równy sposób, jednolicie (Łk 5, 33; 10, 32; 16, 25).',
    occurrencesCount: 30
  },
  '2068': {
    number: '2068',
    language: 'Greek',
    lemma: 'ἐσθίω',
    transliteration: 'esthiō',
    partOfSpeech: 'vi Pres Act 3 Pl',
    shortMeaning: 'jedzą',
    secondaryMeaning: 'spożywają pokarm',
    definitionPolish: 'jeść, spożywać, biesiadować; w kontekście ewangelicznym zasiadanie do stołu z grzesznikami i uczta weselna Królestwa (Łk 5, 33; Mt 26, 26).',
    hebrewOrGreekEquivalent: 'hebr. אָכַל [akhal] (H398)',
    occurrencesCount: 158
  },
  '4095': {
    number: '4095',
    language: 'Greek',
    lemma: 'πίνω',
    transliteration: 'pinō',
    partOfSpeech: 'vi Pres Act 3 Pl',
    shortMeaning: 'piją',
    secondaryMeaning: 'przyjmują napój',
    definitionPolish: 'pić, zaspokajać pragnienie; picie kielicha zbawienia lub kielicha męki Pańskiej (Łk 5, 33; J 4, 14; 1 Kor 11, 26).',
    hebrewOrGreekEquivalent: 'hebr. שָׁתָה [szatah] (H8354)',
    occurrencesCount: 73
  },
  '1410': {
    number: '1410',
    language: 'Greek',
    lemma: 'δύναμαι',
    transliteration: 'dynamai',
    partOfSpeech: 'vi Pres Mid 2 Pl',
    shortMeaning: 'możecie',
    secondaryMeaning: 'jesteście w mocy',
    definitionPolish: 'móc, być w stanie, posiadać siłę lub prawo do uczynienia czegoś (Łk 5, 34: «Czy możecie sprawić, by goście weselni pościli?»).',
    occurrencesCount: 210
  },
  '5207': {
    number: '5207',
    language: 'Greek',
    lemma: 'υἱός',
    transliteration: 'huios',
    partOfSpeech: 'n_ Nom Pl m / n_ Nom Sg m',
    shortMeaning: 'synowie',
    secondaryMeaning: 'potomkowie',
    definitionPolish: 'syn, potomek, uczeń; «Syn Boży» – tytuł Jezusa Chrystusa; «synowie wesela» – goście weselni (Łk 5, 34; Mt 3, 17; Rz 8, 14).',
    hebrewOrGreekEquivalent: 'hebr. בֵּן [ben] (H1121)',
    occurrencesCount: 377
  },
  '2036': {
    number: '2036',
    language: 'Greek',
    lemma: 'εἶπον',
    transliteration: 'eipon',
    partOfSpeech: 'vi Aor Act 3 Pl',
    shortMeaning: 'rzekli',
    secondaryMeaning: 'powiedzieli',
    definitionPolish: 'rzec, powiedzieć, oświadczyć, odpowiedzieć (Łk 5, 33).',
    occurrencesCount: 1300
  },
  '846': {
    number: '846',
    language: 'Greek',
    lemma: 'αὐτός',
    transliteration: 'autos',
    partOfSpeech: 'p_ Acc Sg m / p_',
    shortMeaning: 'Niego',
    secondaryMeaning: 'Jego / samego',
    definitionPolish: 'on, sam, tenże, Jego, Niego; zaimek wskazujący i osobowy trzeciej osoby.',
    occurrencesCount: 5590
  },
  '4674': {
    number: '4674',
    language: 'Greek',
    lemma: 'σός',
    transliteration: 'sos',
    partOfSpeech: 'ps 2 Nom Pl m',
    shortMeaning: 'Twoi',
    secondaryMeaning: 'należący do ciebie',
    definitionPolish: 'twój, twoi; zaimek dzierżawczy drugiej osoby (Łk 5, 33: «Twoi zaś jedzą i piją»).',
    occurrencesCount: 27
  },

  // --- HEBRAJSKIE ODPOWIEDNIKI MODŁÓW I POSTU ---
  'H8605': {
    number: 'H8605',
    language: 'Hebrew',
    lemma: 'תְּפִלָּה',
    transliteration: 'təp̄illāh',
    partOfSpeech: 'Rzeczownik żeński',
    shortMeaning: 'modlitwa',
    secondaryMeaning: 'modły / pieśń błagalna',
    definitionPolish: 'modlitwa, modły, hymn błagalny, wstawiennictwo; najczęstszy hebrajski termin oznaczający modlitwę w Psałterzu (np. nagłówki Ps 17; 86; 90; 102: «Modlitwa strapionego, gdy omdlewa i przed Panem wylewa swą troskę») oraz w Iz 56, 7: «dom Mój będzie nazwany domem modlitwy dla wszystkich narodów».',
    etymologyNote: 'Od czasownika פָּלַל (palal – rozsądzać, wstawiać się, orędować w pokorze).',
    hebrewOrGreekEquivalent: 'gr. προσευχή [proseuchē] (G4335) / δέησις [deēsis] (G1162)',
    occurrencesCount: 77
  },
  'H6419': {
    number: 'H6419',
    language: 'Hebrew',
    lemma: 'פָּלַל',
    transliteration: 'pālal',
    partOfSpeech: 'Czasownik Hitpael',
    shortMeaning: 'modlić się',
    secondaryMeaning: 'wstawiać się / zanosić błaganie',
    definitionPolish: 'modlić się, zanosić usilne modły, orędować za kimś; w formie Hitpael (hitpallel) dosłownie: czynić siebie przedmiotem sądu Bożego, uznawać swą nicość i zdawać się na miłosierdzie Najwyższego (Rdz 20, 7; 1 Sm 2, 1; 1 Krl 8, 28).',
    hebrewOrGreekEquivalent: 'gr. προσεύχομαι [proseuchomai] (G4336)',
    occurrencesCount: 84
  },
  'H8469': {
    number: 'H8469',
    language: 'Hebrew',
    lemma: 'תַּחֲנוּן',
    transliteration: 'taḥănûn',
    partOfSpeech: 'Rzeczownik męski',
    shortMeaning: 'błagania',
    secondaryMeaning: 'modły o zmiłowanie',
    definitionPolish: 'modły błagalne, suplikacje, wołanie o litość i darmo daną łaskę; Za 12, 10: «Wyleję na dom Dawida Ducha łaski i modlitwy (błagania)»; Ps 28, 2: «Usłysz głos mego błagania».',
    etymologyNote: 'Od חָנַן (chanan – okazać łaskę, zmiłować się z daru).',
    hebrewOrGreekEquivalent: 'gr. δέησις [deēsis] (G1162)',
    occurrencesCount: 25
  },
  'H6684': {
    number: 'H6684',
    language: 'Hebrew',
    lemma: 'צוּם',
    transliteration: 'tsûm',
    partOfSpeech: 'Czasownik Qal',
    shortMeaning: 'pościć',
    secondaryMeaning: 'wstrzymywać się od pokarmu',
    definitionPolish: 'pościć, powstrzymywać się od pokarmu i napoju przed obliczem Boga; łączyć post z modlitwą wstawienniczą (2 Sm 12, 16; Ne 1, 4; Est 4, 16; Jl 2, 12).',
    hebrewOrGreekEquivalent: 'gr. νηστεύω [nēsteuō] (G3522)',
    occurrencesCount: 21
  },
  'H1285': {
    number: 'H1285',
    language: 'Hebrew',
    lemma: 'בְּרִית',
    transliteration: 'bərît',
    partOfSpeech: 'Rzeczownik żeński',
    shortMeaning: 'przymierze',
    secondaryMeaning: 'ugoda święta / testament',
    definitionPolish: 'przymierze, uroczysta więź miłości i wierności zawarta między Bogiem a Jego ludem (Rdz 15; Wj 24; Jer 31, 31).',
    hebrewOrGreekEquivalent: 'gr. διαθήκη [diathēkē] (G1242)',
    occurrencesCount: 284
  },
  'H3820': {
    number: 'H3820',
    language: 'Hebrew',
    lemma: 'לֵב',
    transliteration: 'lēḇ',
    partOfSpeech: 'Rzeczownik męski',
    shortMeaning: 'serce',
    secondaryMeaning: 'wnętrze / umysł / wola',
    definitionPolish: 'serce; w antropologii semickiej centrum decyzyjne człowieka, miejsce myśli, sumienia i pragnień (Pwt 6, 5; Ps 51, 12).',
    hebrewOrGreekEquivalent: 'gr. καρδία [kardia] (G2588)',
    occurrencesCount: 598
  },
  'H1818': {
    number: 'H1818',
    language: 'Hebrew',
    lemma: 'דָּם',
    transliteration: 'dām',
    partOfSpeech: 'Rzeczownik męski',
    shortMeaning: 'krew',
    secondaryMeaning: 'życie',
    definitionPolish: 'krew; siedlisko życia stworzonego przez Boga, krew przymierza i ofiary przebłagania (Kpł 17, 11).',
    hebrewOrGreekEquivalent: 'gr. αἷμα [haima] (G129)',
    occurrencesCount: 361
  },
  'H5315': {
    number: 'H5315',
    language: 'Hebrew',
    lemma: 'נֶפֶשׁ',
    transliteration: 'nep̄eš',
    partOfSpeech: 'Rzeczownik żeński',
    shortMeaning: 'dusza',
    secondaryMeaning: 'życie / gardło / pragnienie',
    definitionPolish: 'dusza, istota żyjąca, oddech, gardło łaknące Boga (Rdz 2, 7; Ps 42, 2).',
    hebrewOrGreekEquivalent: 'gr. ψυχή [psychē] (G5590)',
    occurrencesCount: 753
  },
  'H853': {
    number: 'H853',
    language: 'Hebrew',
    lemma: 'אֵת',
    transliteration: '’ēt',
    partOfSpeech: 'Znak biernika',
    shortMeaning: '[biernik]',
    secondaryMeaning: 'wskaźnik dopełnienia bliższego',
    definitionPolish: 'partykuła wskazująca dopełnienie bliższe w języku hebrajskim (np. Rdz 1, 1: bereszit bara Elohim et haszamajim).',
    occurrencesCount: 7000
  },
  'H3808': {
    number: 'H3808',
    language: 'Hebrew',
    lemma: 'לֹא',
    transliteration: 'lō’',
    partOfSpeech: 'Przysłówek przeczący',
    shortMeaning: 'nie',
    secondaryMeaning: 'ani / wcale',
    definitionPolish: 'nie, ani; bezwzględne przeczenie w języku hebrajskim (Ps 23, 1: «nie braknie mi niczego»).',
    occurrencesCount: 5000
  },
  'H4210': {
    number: 'H4210',
    language: 'Hebrew',
    lemma: 'מִזְמוֹר',
    transliteration: 'mizmôr',
    partOfSpeech: 'Rzeczownik męski',
    shortMeaning: 'psalm',
    secondaryMeaning: 'pieśń z instrumentem',
    definitionPolish: 'psalm, pieśń religijna wykonywana przy akompaniamencie instrumentów strunowych (nagłówek 57 psalmów).',
    occurrencesCount: 57
  },
  'H1732': {
    number: 'H1732',
    language: 'Hebrew',
    lemma: 'דָּוִד',
    transliteration: 'dāwid',
    partOfSpeech: 'Imię własne',
    shortMeaning: 'Dawid',
    secondaryMeaning: 'umiłowany',
    definitionPolish: 'Dawid – król Izraela, prorok i autor natchnionych psalmów, praojciec Mesjasza; imię oznacza «umiłowany».',
    occurrencesCount: 1075
  },
  'H2637': {
    number: 'H2637',
    language: 'Hebrew',
    lemma: 'חָסֵר',
    transliteration: 'ḥāsēr',
    partOfSpeech: 'Czasownik Qal',
    shortMeaning: 'brakować',
    secondaryMeaning: 'być w niedostatku',
    definitionPolish: 'doznawać braku, ponosić szkodę, niedomagać (Ps 23, 1: «Jahwe moim pasterzem: nie braknie mi niczego»).',
    occurrencesCount: 23
  }
};

// Pomocnicza funkcja wyszukiwania hasła Stronga z inteligentnym dopasowaniem synonimów
export function getStrongEntry(numOrKey: string): StrongEntry | undefined {
  if (!numOrKey) return undefined;
  const clean = numOrKey.replace(/^[GHgh]/, '').trim();
  
  if (STRONGS_DICTIONARY[clean]) return STRONGS_DICTIONARY[clean];
  if (STRONGS_DICTIONARY[`H${clean}`]) return STRONGS_DICTIONARY[`H${clean}`];
  if (STRONGS_DICTIONARY[`G${clean}`]) return STRONGS_DICTIONARY[`G${clean}`];
  if (STRONGS_DICTIONARY[numOrKey]) return STRONGS_DICTIONARY[numOrKey];
  
  // Szukaj po lemma, transliteracji, polskim haśle lub słowach kluczowych
  const lower = numOrKey.toLowerCase().trim().replace(/[.,;!?:«»"()—]/g, '');
  if (!lower) return undefined;

  // 1. Dokładne dopasowanie lemmata / transliteracji / shortMeaning
  const exact = Object.values(STRONGS_DICTIONARY).find(e => 
    e.lemma.toLowerCase() === lower || 
    e.transliteration.toLowerCase() === lower ||
    e.shortMeaning.toLowerCase() === lower ||
    (e.secondaryMeaning && e.secondaryMeaning.toLowerCase() === lower)
  );
  if (exact) return exact;

  // 2. Specjalne reguły dla kluczowych pojęć w różnych formach fleksyjnych
  if (/^(modł|modły|modlić|modlitwa|modlitwy|modłach|modlitwą|modlitwom|modląc)$/i.test(lower)) {
    return STRONGS_DICTIONARY['1162'] || STRONGS_DICTIONARY['4335'] || STRONGS_DICTIONARY['H8605'];
  }
  if (/^(post|poszczą|poszcza|pościć|poście|postem|posty)$/i.test(lower)) {
    return STRONGS_DICTIONARY['3522'] || STRONGS_DICTIONARY['3521'];
  }
  if (/^(uczeń|uczniowie|uczniów|uczniami|uczniom|ucznia)$/i.test(lower)) {
    return STRONGS_DICTIONARY['3101'];
  }
  if (/^(faryzeusz|faryzeusze|faryzeuszów|faryzeuszom|faryzeuszami)$/i.test(lower)) {
    return STRONGS_DICTIONARY['5330'];
  }
  if (/^(jan|jana|janowi|janem)$/i.test(lower)) {
    return STRONGS_DICTIONARY['2491'];
  }
  if (/^(pan młody|pana młodego|oblubieniec|oblubieńca|oblubieńcze)$/i.test(lower)) {
    return STRONGS_DICTIONARY['3566'];
  }
  if (/^(komnata weselna|goście weselni|wesele|wesela|weselu)$/i.test(lower)) {
    return STRONGS_DICTIONARY['3567'];
  }
  if (/^(wino|wina|winem|winie)$/i.test(lower)) {
    return STRONGS_DICTIONARY['3631'];
  }
  if (/^(bukłak|bukłaki|bukłaków|bukłakami|bukłakom)$/i.test(lower)) {
    return STRONGS_DICTIONARY['779'];
  }
  if (/^(nowy|nowe|nowego|nowym|nowa|nowej|nowych)$/i.test(lower)) {
    return STRONGS_DICTIONARY['2537'];
  }
  if (/^(stary|stare|starego|starym|stara|starej|starych)$/i.test(lower)) {
    return STRONGS_DICTIONARY['3820'];
  }
  if (/^(bóg|boga|bogu|bogiem|boży|boża|bożych)$/i.test(lower)) {
    return STRONGS_DICTIONARY['2316'] || STRONGS_DICTIONARY['H430'];
  }
  if (/^(pan|pana|panu|panem|panie)$/i.test(lower)) {
    return STRONGS_DICTIONARY['2962'] || STRONGS_DICTIONARY['H3068'];
  }
  if (/^(jezus|jezusa|jezusowi|jezusem)$/i.test(lower)) {
    return STRONGS_DICTIONARY['2424'];
  }
  if (/^(chrystus|chrystusa|pomazaniec|mesjasz)$/i.test(lower)) {
    return STRONGS_DICTIONARY['5547'];
  }
  if (/^(słowo|słowa|słowu|słowem|logos)$/i.test(lower)) {
    return STRONGS_DICTIONARY['3056'];
  }

  // 3. Wyszukiwanie częściowe
  return Object.values(STRONGS_DICTIONARY).find(e => 
    e.shortMeaning.toLowerCase().includes(lower) ||
    lower.includes(e.shortMeaning.toLowerCase()) ||
    (e.secondaryMeaning && e.secondaryMeaning.toLowerCase().includes(lower)) ||
    e.definitionPolish.toLowerCase().includes(lower)
  );
}

// Wyszukiwarka konkordancji Stronga
export function searchStrongsConcordance(query: string): StrongEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return Object.values(STRONGS_DICTIONARY);

  return Object.values(STRONGS_DICTIONARY).filter(e => {
    return (
      e.number.toLowerCase().includes(q) ||
      e.lemma.toLowerCase().includes(q) ||
      e.transliteration.toLowerCase().includes(q) ||
      e.shortMeaning.toLowerCase().includes(q) ||
      (e.secondaryMeaning && e.secondaryMeaning.toLowerCase().includes(q)) ||
      e.definitionPolish.toLowerCase().includes(q)
    );
  });
}
