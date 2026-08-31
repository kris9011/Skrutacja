import { BibleBookInfo, BiblicalThemePreset } from '../types';

export const BIBLE_BOOKS: BibleBookInfo[] = [
  // Stary Testament - Pięcioksiąg
  { siglum: 'Rdz', fullName: 'Księga Rodzaju', polishName: 'Księga Rodzaju', latinName: 'Genesis', testament: 'ST', category: 'Pięcioksiąg', chaptersCount: 50 },
  { siglum: 'Wj', fullName: 'Księga Wyjścia', polishName: 'Księga Wyjścia', latinName: 'Exodus', testament: 'ST', category: 'Pięcioksiąg', chaptersCount: 40 },
  { siglum: 'Kpł', fullName: 'Księga Kapłańska', polishName: 'Księga Kapłańska', latinName: 'Leviticus', testament: 'ST', category: 'Pięcioksiąg', chaptersCount: 27 },
  { siglum: 'Lb', fullName: 'Księga Liczb', polishName: 'Księga Liczb', latinName: 'Numeri', testament: 'ST', category: 'Pięcioksiąg', chaptersCount: 36 },
  { siglum: 'Pwt', fullName: 'Księga Powtórzonego Prawa', polishName: 'Księga Powtórzonego Prawa', latinName: 'Deuteronomium', testament: 'ST', category: 'Pięcioksiąg', chaptersCount: 34 },
  
  // Stary Testament - Historyczne
  { siglum: 'Joz', fullName: 'Księga Jozuego', polishName: 'Księga Jozuego', latinName: 'Iosue', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 24 },
  { siglum: 'Sdz', fullName: 'Księga Sędziów', polishName: 'Księga Sędziów', latinName: 'Iudices', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 21 },
  { siglum: 'Rt', fullName: 'Księga Rut', polishName: 'Księga Rut', latinName: 'Ruth', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 4 },
  { siglum: '1 Sm', fullName: '1 Księga Samuela', polishName: '1 Księga Samuela', latinName: '1 Samuelis', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 31 },
  { siglum: '2 Sm', fullName: '2 Księga Samuela', polishName: '2 Księga Samuela', latinName: '2 Samuelis', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 24 },
  { siglum: '1 Krl', fullName: '1 Księga Królewska', polishName: '1 Księga Królewska', latinName: '1 Regum', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 22 },
  { siglum: '2 Krl', fullName: '2 Księga Królewska', polishName: '2 Księga Królewska', latinName: '2 Regum', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 25 },
  { siglum: '1 Krn', fullName: '1 Księga Kronik', polishName: '1 Księga Kronik', latinName: '1 Paralipomenon', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 29 },
  { siglum: '2 Krn', fullName: '2 Księga Kronik', polishName: '2 Księga Kronik', latinName: '2 Paralipomenon', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 36 },
  { siglum: 'Ezd', fullName: 'Księga Ezdrasza', polishName: 'Księga Ezdrasza', latinName: 'Esdrae', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 10 },
  { siglum: 'Ne', fullName: 'Księga Nehemiasza', polishName: 'Księga Nehemiasza', latinName: 'Nehemiae', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 13 },
  { siglum: 'Tb', fullName: 'Księga Tobiasza', polishName: 'Księga Tobiasza', latinName: 'Thobis', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 14 },
  { siglum: 'Jdt', fullName: 'Księga Judyty', polishName: 'Księga Judyty', latinName: 'Iudith', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 16 },
  { siglum: 'Est', fullName: 'Księga Estery', polishName: 'Księga Estery', latinName: 'Esther', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 10 },
  { siglum: '1 Mch', fullName: '1 Księga Machabejska', polishName: '1 Księga Machabejska', latinName: '1 Machabaeorum', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 16 },
  { siglum: '2 Mch', fullName: '2 Księga Machabejska', polishName: '2 Księga Machabejska', latinName: '2 Machabaeorum', testament: 'ST', category: 'Księgi historyczne', chaptersCount: 15 },

  // Stary Testament - Mądrościowe i Poetyckie
  { siglum: 'Hi', fullName: 'Księga Hioba', polishName: 'Księga Hioba', latinName: 'Iob', testament: 'ST', category: 'Księgi mądrościowe i poetyckie', chaptersCount: 42 },
  { siglum: 'Ps', fullName: 'Księga Psalmów', polishName: 'Księga Psalmów', latinName: 'Psalmi', testament: 'ST', category: 'Księgi mądrościowe i poetyckie', chaptersCount: 150 },
  { siglum: 'Prz', fullName: 'Księga Przysłów', polishName: 'Księga Przysłów', latinName: 'Proverbia', testament: 'ST', category: 'Księgi mądrościowe i poetyckie', chaptersCount: 31 },
  { siglum: 'Koh', fullName: 'Księga Koheleta (Eklezjastes)', polishName: 'Księga Koheleta', latinName: 'Ecclesiastes', testament: 'ST', category: 'Księgi mądrościowe i poetyckie', chaptersCount: 12 },
  { siglum: 'Pnp', fullName: 'Pieśń nad Pieśniami', polishName: 'Pieśń nad Pieśniami', latinName: 'Canticum Canticorum', testament: 'ST', category: 'Księgi mądrościowe i poetyckie', chaptersCount: 8 },
  { siglum: 'Mdr', fullName: 'Księga Mądrości', polishName: 'Księga Mądrości', latinName: 'Sapientiae', testament: 'ST', category: 'Księgi mądrościowe i poetyckie', chaptersCount: 19 },
  { siglum: 'Syr', fullName: 'Mądrość Syracha (Eklezjastyk)', polishName: 'Mądrość Syracha', latinName: 'Siracides', testament: 'ST', category: 'Księgi mądrościowe i poetyckie', chaptersCount: 51 },

  // Stary Testament - Prorocy
  { siglum: 'Iz', fullName: 'Księga Izajasza', polishName: 'Księga Izajasza', latinName: 'Isaias', testament: 'ST', category: 'Prorocy więksi', chaptersCount: 66 },
  { siglum: 'Jr', fullName: 'Księga Jeremiasza', polishName: 'Księga Jeremiasza', latinName: 'Ieremias', testament: 'ST', category: 'Prorocy więksi', chaptersCount: 52 },
  { siglum: 'Lm', fullName: 'Lamentacje Jeremiasza', polishName: 'Lamentacje', latinName: 'Lamentationes', testament: 'ST', category: 'Prorocy więksi', chaptersCount: 5 },
  { siglum: 'Ba', fullName: 'Księga Barucha', polishName: 'Księga Barucha', latinName: 'Baruch', testament: 'ST', category: 'Prorocy więksi', chaptersCount: 6 },
  { siglum: 'Ez', fullName: 'Księga Ezechiela', polishName: 'Księga Ezechiela', latinName: 'Ezechiel', testament: 'ST', category: 'Prorocy więksi', chaptersCount: 48 },
  { siglum: 'Dn', fullName: 'Księga Daniela', polishName: 'Księga Daniela', latinName: 'Daniel', testament: 'ST', category: 'Prorocy więksi', chaptersCount: 14 },
  { siglum: 'Oz', fullName: 'Księga Ozeasza', polishName: 'Księga Ozeasza', latinName: 'Osee', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 14 },
  { siglum: 'Jl', fullName: 'Księga Joela', polishName: 'Księga Joela', latinName: 'Ioel', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 4 },
  { siglum: 'Am', fullName: 'Księga Amosa', polishName: 'Księga Amosa', latinName: 'Amos', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 9 },
  { siglum: 'Ab', fullName: 'Księga Abdiasza', polishName: 'Księga Abdiasza', latinName: 'Abdias', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 1 },
  { siglum: 'Jon', fullName: 'Księga Jonasza', polishName: 'Księga Jonasza', latinName: 'Ionas', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 4 },
  { siglum: 'Mi', fullName: 'Księga Micheasza', polishName: 'Księga Micheasza', latinName: 'Michaeas', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 7 },
  { siglum: 'Na', fullName: 'Księga Nahuma', polishName: 'Księga Nahuma', latinName: 'Nahum', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 3 },
  { siglum: 'Ha', fullName: 'Księga Habakuka', polishName: 'Księga Habakuka', latinName: 'Habacuc', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 3 },
  { siglum: 'So', fullName: 'Księga Sofoniasza', polishName: 'Księga Sofoniasza', latinName: 'Sophonias', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 3 },
  { siglum: 'Ag', fullName: 'Księga Aggeusza', polishName: 'Księga Aggeusza', latinName: 'Aggaeus', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 2 },
  { siglum: 'Za', fullName: 'Księga Zachariasza', polishName: 'Księga Zachariasza', latinName: 'Zacharias', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 14 },
  { siglum: 'Ml', fullName: 'Księga Malachiasza', polishName: 'Księga Malachiasza', latinName: 'Malachias', testament: 'ST', category: 'Prorocy mniejsi', chaptersCount: 3 },

  // Nowy Testament - Ewangelie
  { siglum: 'Mt', fullName: 'Ewangelia według św. Mateusza', polishName: 'Ewangelia wg św. Mateusza', latinName: 'Matthaeum', testament: 'NT', category: 'Ewangelie', chaptersCount: 28 },
  { siglum: 'Mk', fullName: 'Ewangelia według św. Marka', polishName: 'Ewangelia wg św. Marka', latinName: 'Marcum', testament: 'NT', category: 'Ewangelie', chaptersCount: 16 },
  { siglum: 'Łk', fullName: 'Ewangelia według św. Łukasza', polishName: 'Ewangelia wg św. Łukasza', latinName: 'Lucam', testament: 'NT', category: 'Ewangelie', chaptersCount: 24 },
  { siglum: 'J', fullName: 'Ewangelia według św. Jana', polishName: 'Ewangelia wg św. Jana', latinName: 'Ioannem', testament: 'NT', category: 'Ewangelie', chaptersCount: 21 },
  
  // Nowy Testament - Dzieje Apostolskie
  { siglum: 'Dz', fullName: 'Dzieje Apostolskie', polishName: 'Dzieje Apostolskie', latinName: 'Actus Apostolorum', testament: 'NT', category: 'Dzieje Apostolskie', chaptersCount: 28 },

  // Nowy Testament - Listy Pawłowe
  { siglum: 'Rz', fullName: 'List do Rzymian', polishName: 'List do Rzymian', latinName: 'Romanos', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 16 },
  { siglum: '1 Kor', fullName: '1 List do Koryntian', polishName: '1 List do Koryntian', latinName: '1 Corinthios', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 16 },
  { siglum: '2 Kor', fullName: '2 List do Koryntian', polishName: '2 List do Koryntian', latinName: '2 Corinthios', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 13 },
  { siglum: 'Ga', fullName: 'List do Galatów', polishName: 'List do Galatów', latinName: 'Galatas', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 6 },
  { siglum: 'Ef', fullName: 'List do Efezjan', polishName: 'List do Efezjan', latinName: 'Ephesios', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 6 },
  { siglum: 'Flp', fullName: 'List do Filipian', polishName: 'List do Filipian', latinName: 'Philippenses', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 4 },
  { siglum: 'Kol', fullName: 'List do Kolosan', polishName: 'List do Kolosan', latinName: 'Colossenses', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 4 },
  { siglum: '1 Tes', fullName: '1 List do Tesaloniczan', polishName: '1 List do Tesaloniczan', latinName: '1 Thessalonicenses', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 5 },
  { siglum: '2 Tes', fullName: '2 List do Tesaloniczan', polishName: '2 List do Tesaloniczan', latinName: '2 Thessalonicenses', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 3 },
  { siglum: '1 Tm', fullName: '1 List do Tymoteusza', polishName: '1 List do Tymoteusza', latinName: '1 Timotheum', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 6 },
  { siglum: '2 Tm', fullName: '2 List do Tymoteusza', polishName: '2 List do Tymoteusza', latinName: '2 Timotheum', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 4 },
  { siglum: 'Tt', fullName: 'List do Tytusa', polishName: 'List do Tytusa', latinName: 'Titum', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 3 },
  { siglum: 'Flm', fullName: 'List do Filemona', polishName: 'List do Filemona', latinName: 'Philemonem', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 1 },
  { siglum: 'Hbr', fullName: 'List do Hebrajczyków', polishName: 'List do Hebrajczyków', latinName: 'Hebraeos', testament: 'NT', category: 'Listy Pawłowe', chaptersCount: 13 },

  // Nowy Testament - Listy Powszechne
  { siglum: 'Jk', fullName: 'List św. Jakuba', polishName: 'List św. Jakuba', latinName: 'Iacobi', testament: 'NT', category: 'Listy powszechne', chaptersCount: 5 },
  { siglum: '1 P', fullName: '1 List św. Piotra', polishName: '1 List św. Piotra', latinName: '1 Petri', testament: 'NT', category: 'Listy powszechne', chaptersCount: 5 },
  { siglum: '2 P', fullName: '2 List św. Piotra', polishName: '2 List św. Piotra', latinName: '2 Petri', testament: 'NT', category: 'Listy powszechne', chaptersCount: 3 },
  { siglum: '1 J', fullName: '1 List św. Jana', polishName: '1 List św. Jana', latinName: '1 Ioannis', testament: 'NT', category: 'Listy powszechne', chaptersCount: 5 },
  { siglum: '2 J', fullName: '2 List św. Jana', polishName: '2 List św. Jana', latinName: '2 Ioannis', testament: 'NT', category: 'Listy powszechne', chaptersCount: 1 },
  { siglum: '3 J', fullName: '3 List św. Jana', polishName: '3 List św. Jana', latinName: '3 Ioannis', testament: 'NT', category: 'Listy powszechne', chaptersCount: 1 },
  { siglum: 'Jud', fullName: 'List św. Judy', polishName: 'List św. Judy', latinName: 'Iudae', testament: 'NT', category: 'Listy powszechne', chaptersCount: 1 },

  // Nowy Testament - Apokalipsa
  { siglum: 'Ap', fullName: 'Apokalipsa św. Jana', polishName: 'Apokalipsa św. Jana', latinName: 'Apocalypsis', testament: 'NT', category: 'Księgi prorockie NT', chaptersCount: 22 },
];

export const THEME_PRESETS: BiblicalThemePreset[] = [
  {
    id: 'pascha_baranek',
    title: 'Baranek Paschalny i Zmartwychwstanie',
    subtitle: 'Droga od ofiary Izaaka i nocy Wyjścia aż po zwycięstwo Baranka w Apokalipsie',
    category: 'Pascha i Krzyż',
    initialSiglum: 'J 1, 29',
    initialText: 'Nazajutrz Jan zobaczył Jezusa, nadchodzącego ku niemu, i rzekł: «Oto Baranek Boży, który gładzi grzech świata».',
    description: 'Klasyczna, fundamentalna skrutacja odkrywająca tajemnicę Chrystusa jako prawdziwego Baranka Paschalnego, w którym spełniają się wszystkie figury Starego Testamentu.',
    suggestedChain: [
      { siglum: 'Wj 12, 1-14', testament: 'ST', text: 'Baranek będzie bez skazy, samiec, jednoroczny... Krew posłuży wam do oznaczenia domów, w których będziecie.', relation: 'Ustanowienie Paschy w Egipcie — krew Baranka ocalająca od śmierci.' },
      { siglum: 'Rdz 22, 7-14', testament: 'ST', text: 'Izaak odezwał się do swego ojca: «Gdzież jest baranek na całopalenie?» Abraham odpowiedział: «Bóg upatrzy sobie baranka».', relation: 'Typologia ofiary: Bóg oszczędza syna Abrahama, ale nie oszczędzi własnego Syna.' },
      { siglum: 'Iz 53, 7', testament: 'ST', text: 'Dręczono Go, lecz sam się dał gnębić, nawet nie otworzył ust swoich. Jak baranek na rzeź prowadzony.', relation: 'Proroctwo o Cierpiącym Słudze Jahwe niosącym nasze grzechy.' },
      { siglum: '1 Kor 5, 7', testament: 'NT', text: 'Chrystus bowiem został złożony w ofierze jako nasza Pascha.', relation: 'Św. Paweł ukazuje Paschę chrześcijańską jako rzeczywistość spełnioną w Zmartwychwstałym.' },
      { siglum: '1 P 1, 18-19', testament: 'NT', text: 'Wiecie bowiem, że zostaliście wykupieni drogocenną krwią Chrystusa, jako baranka niepokalanego i bez zmazy.', relation: 'Wykupienie z niewoli grzechu przez bezcenną krew Baranka.' },
      { siglum: 'Ap 5, 6.12', testament: 'NT', text: 'I ujrzałem na środku tronu Baranka stojącego jakby zabitego... «Godzien jest Baranek zabity wziąć potęgę i bogactwo».', relation: 'Triumf Baranka w liturgii niebiańskiej: Zmartwychwstanie i panowanie.' }
    ]
  },
  {
    id: 'dobry_pasterz',
    title: 'Pan jest moim Pasterzem',
    subtitle: 'Od obietnicy Boga z Księgi Ezechiela do oddania życia przez Chrystusa za owce',
    category: 'Przymierze i Wiara',
    initialSiglum: 'J 10, 11',
    initialText: 'Ja jestem dobrym pasterzem. Dobry pasterz daje życie swoje za owce.',
    description: 'Skrutacja ukazująca czułą troskę Boga o człowieka zagubionego, zranionego i poszukującego ratunku.',
    suggestedChain: [
      { siglum: 'Ps 23, 1-6', testament: 'ST', text: 'Pan jest moim pasterzem, nie brak mi niczego. Pozwala mi leżeć na zielonych pastwiskach.', relation: 'Pieśń ufności w nieustanną obecność i prowadzenie Boga.' },
      { siglum: 'Ez 34, 11-16', testament: 'ST', text: 'Oto Ja sam będę szukał moich owiec i będę miał o nie pieczę. Zagubioną odszukam, zabłąkaną sprowadzę z powrotem.', relation: 'Obietnica samego Boga, że zstąpi i sam zatroszczy się o swój lud.' },
      { siglum: 'Łk 15, 3-7', testament: 'NT', text: 'Któż z was, gdy ma sto owiec, a zgubi jedną z nich, nie zostawia dziewięćdziesięciu dziewięciu na pustyni i nie idzie za zgubioną?', relation: 'Przypowieść o radości Boga z nawrócenia jednego grzesznika.' },
      { siglum: 'Hbr 13, 20-21', testament: 'NT', text: 'Bóg pokoju, który wywiódł spośród umarłych Wielkiego Pasterza owiec przez krew przymierza wiecznego, Pana naszego Jezusa.', relation: 'Zmartwychwstały Chrystus jako Wieczny Pasterz Kościoła.' },
      { siglum: '1 P 2, 25', testament: 'NT', text: 'Byliście bowiem jak zbłąkane owce, ale teraz nawróciliście się do Pasterza i Stróża dusz waszych.', relation: 'Powołanie do powrotu pod opiekę Chrystusa.' }
    ]
  },
  {
    id: 'przejscie_morze',
    title: 'Wyjście z Egiptu i Nowe Życie',
    subtitle: 'Niewola, przejście przez morze, chrzest i wejście do Ziemi Obiecanej',
    category: 'Pascha i Krzyż',
    initialSiglum: 'Wj 14, 13-14',
    initialText: 'Mojżesz odpowiedział ludowi: «Nie bójcie się! Pozostańcie na swoim miejscu, a zobaczycie zbawienie od Pana... Pan będzie walczył za was, wy zaś bądźcie spokojni».',
    description: 'Skrutacja o przejściu ze śmierci do życia, z lęku do wolności dzieci Bożych. Podstawa sakramentu chrztu świętego.',
    suggestedChain: [
      { siglum: 'Wj 14, 21-22', testament: 'ST', text: 'Mojżesz wyciągnął rękę nad morze, a Pan cofnął wody... Izraelici szli przez środek morza po suchym dnie.', relation: 'Cudowne ocalenie i rozstąpienie wód — figura zbawienia.' },
      { siglum: 'Ps 114, 1-8', testament: 'ST', text: 'Gdy Izrael wychodził z Egiptu... Morze to ujrzało i uciekło, Jordan cofnął się wstecz.', relation: 'Dziękczynienie za wyzwolenie i moc Bożą nad żywiołami.' },
      { siglum: 'Iz 43, 16-19', testament: 'ST', text: 'Oto Ja czynię rzecz nową: już się wyłania, czyż jej nie widzicie? Otworzę też drogę na pustyni, ścieżyny na pustkowiu.', relation: 'Nowy Exodus — proroctwo o ostatecznym odkupieniu.' },
      { siglum: '1 Kor 10, 1-4', testament: 'NT', text: 'Wszyscy nasi ojcowie byli pod obłokiem, wszyscy przeszli przez morze i wszyscy byli ochrzczeni w Mojżeszu.', relation: 'Chrzcielna interpretacja przejścia przez Morze Czerwone.' },
      { siglum: 'Rz 6, 3-4', testament: 'NT', text: 'Czyż nie wiecie, że my wszyscy, którzyśmy otrzymali chrzest zanurzający w Chrystusa Jezusa, zostaliśmy zanurzeni w Jego śmierć?', relation: 'Zanurzenie w śmierć i zmartwychwstanie z Chrystusem do nowego życia.' }
    ]
  },
  {
    id: 'milosierdzie_ojca',
    title: 'Nieskończone Miłosierdzie Boże',
    subtitle: 'Objawienie Imienia Boga na Synaju i przypowieść o Ojcu marnotrawnym',
    category: 'Miłosierdzie',
    initialSiglum: 'Łk 15, 20',
    initialText: 'A gdy był jeszcze daleko, ujrzał go jego ojciec i wzruszył się głęboko; wybiegł naprzeciw niego, rzucił mu się na szyję i ucałował go.',
    description: 'Głęboka skrutacja odkrywająca serce Boga — miłosiernego, cierpliwego i bogatego w łaskę, który nie męczy się przebaczaniem.',
    suggestedChain: [
      { siglum: 'Wj 34, 6-7', testament: 'ST', text: 'Jahwe, Jahwe, Bóg miłosierny i łaskawy, nieskory do gniewu, bogaty w łaskę i wierność.', relation: 'Najważniejsza definicja Imienia Boga w Starym Testamencie.' },
      { siglum: 'Ps 103, 8-13', testament: 'ST', text: 'Jak ojciec lituje się nad dziećmi, tak Pan lituje się nad tymi, którzy się Go boją. Wie On, z czegośmy powstali: pamięta, że jesteśmy prochem.', relation: 'Psałterz o ojcowskim i współczującym sercu Boga.' },
      { siglum: 'Oz 11, 8-9', testament: 'ST', text: 'Moje serce na to się wzdryga i rozpalają się moje wnętrzności. Nie wykonam zapalczywości mego gniewu... bo Bogiem jestem, nie człowiekiem.', relation: 'Boska miłość silniejsza niż ludzka niewierność.' },
      { siglum: 'Mi 7, 18-19', testament: 'ST', text: 'Któryż bóg jest podobny Tobie, co przebaczasz nieprawość... Zetrze nasze nieprawości i wrzuci w głębokości morskie wszystkie nasze grzechy.', relation: 'Radość z całkowitego wymazania win.' },
      { siglum: 'Ef 2, 4-5', testament: 'NT', text: 'Bóg, będąc bogaty w miłosierdzie, przez wielką swą miłość, jaką nas umiłował, i to nas, umarłych na skutek występków, razem z Chrystusem przywrócił do życia.', relation: 'Wypełnienie miłosierdzia w Chrystusie.' }
    ]
  },
  {
    id: 'duch_nowe_serce',
    title: 'Nowe Serce i Obietnica Ducha',
    subtitle: 'Od proroctwa Ezechiela i Jeremiasza po Wieczernik i owoce Ducha Świętego',
    category: 'Duch Święty',
    initialSiglum: 'Ez 36, 26-27',
    initialText: 'I dam wam serce nowe i ducha nowego tchnę do waszego wnętrza, odbiorę wam serce kamienne, a dam wam serce z ciała.',
    description: 'Skrutacja o przemianie wewnętrznej człowieka, obietnicy Ducha Pocieszyciela i nowym prawie miłości wpisanym w serce.',
    suggestedChain: [
      { siglum: 'Jr 31, 31-34', testament: 'ST', text: 'Zawrę z domem Izraela nowe przymierze... Umieszczę swe prawo w głębi ich jestestwa i wypiszę na ich sercach.', relation: 'Obietnica Nowego Przymierza wnętrza i poznania Boga.' },
      { siglum: 'Jl 3, 1-2', testament: 'ST', text: 'Wyleję Ducha mego na wszelkie ciało, a synowie wasi i córki wasze prorokować będą.', relation: 'Zapowiedź powszechnego wylania Ducha w czasach mesjańskich.' },
      { siglum: 'J 7, 37-39', testament: 'NT', text: '«Jeśli ktoś jest spragniony, a wierzy we Mnie — niech przyjdzie do Mnie i pije!... Strumienie wody żywej popłyną z jego wnętrza». Powiedział to o Duchu.', relation: 'Jezus obiecujący wodę żywą.' },
      { siglum: 'Dz 2, 1-4', testament: 'NT', text: 'Nagle dał się słyszeć z nieba szum, jakby uderzenie gwałtownego wichru... I wszyscy zostali napełnieni Duchem Świętym.', relation: 'Spełnienie obietnicy w Dniu Pięćdziesiątnicy.' },
      { siglum: 'Rz 8, 14-16', testament: 'NT', text: 'Albowiem wszyscy ci, których prowadzi Duch Boży, są synami Bożymi. Nie otrzymaliście przecież ducha niewoli... lecz Ducha przybrania za synów, w którym możemy wołać: «Abba, Ojcze!».', relation: 'Duch daje nam tożsamość dzieci Bożych.' }
    ]
  },
  {
    id: 'kenoza_chrystusa',
    title: 'Hymn o Knozie — Uniżenie i Chwała',
    subtitle: 'Postawa sługi, posłuszeństwo aż do krzyża i wywyższenie Imienia Jezus',
    category: 'Uczniostwo',
    initialSiglum: 'Flp 2, 5-11',
    initialText: 'To dążenie niech was ożywia, które też było w Chrystusie Jezusie: On, istniejąc w postaci Bożej, nie skorzystał ze sposobności, aby na równi być z Bogiem, lecz ogołocił samego siebie...',
    description: 'Kontemplacja tajemnicy ogołocenia Boga, który stał się człowiekiem i sługą wszystkich, aby nas wynieść.',
    suggestedChain: [
      { siglum: 'Iz 52, 13-15', testament: 'ST', text: 'Oto się powiedzie mojemu Słudze, wybije się, wywyższy i bardzo wyrośnie... jak wielu osłupiało na Jego widok.', relation: 'Prorocka zapowiedź uniżenia i późniejszego wywyższenia Sługi.' },
      { siglum: 'J 13, 3-15', testament: 'NT', text: 'Wstał od wieczerzy, złożył szaty, a wziąwszy prześcieradło, przepasał się. Potem nalał wody do miednicy i zaczął umywać uczniom nogi.', relation: 'Chrystus Sługa w geście umywania nóg — wzór dla uczniów.' },
      { siglum: 'Mt 20, 26-28', testament: 'NT', text: 'Syn Człowieczy nie przyszedł, aby Mu służono, lecz żeby służyć i dać swoje życie na okup za wielu.', relation: 'Prawdziwa wielkość w Królestwie Bożym mierzona służbą.' },
      { siglum: '2 Kor 8, 9', testament: 'NT', text: 'Znacie przecież łaskę Pana naszego Jezusa Chrystusa, który będąc bogatym, dla was stał się ubogim, aby was ubóstwem swoim ubogacić.', relation: 'Tajemnica zbawczego ubóstwa Chrystusa.' },
      { siglum: 'Hbr 2, 9-10', testament: 'NT', text: 'Widzimy Jezusa, który mało co od aniołów był pomniejszony, chwałą i czcią ukoronowanego za cierpienia śmierci.', relation: 'Chwała zrodzona z posłuszeństwa miłości.' }
    ]
  }
];

export const PRAYER_STEPS_INFO = [
  {
    step: 0,
    latinName: 'Statio & Invocatio Spiritus Sancti',
    polishName: 'Wyciszenie i Wezwanie Ducha Świętego',
    shortDesc: 'Uświadomienie sobie obecności Boga i błaganie o światło Ducha Świętego, który jest jedynym Autorem i Nauczycielem Pisma.',
    guide: 'Zatrzymaj się (Statio). Odłóż pośpiech, telefon i rozproszenia. Zapal świecę, zrób znak krzyża. Pamiętaj, że Pismo Święte zostało napisane pod natchnieniem Ducha Świętego i tylko z Jego pomocą może być właściwie zrozumiane. Módl się żarliwie o Jego światło.',
    defaultTimeMin: 3
  },
  {
    step: 1,
    latinName: 'Lectio',
    polishName: 'Czytanie Słowa (Werset wyjściowy)',
    shortDesc: 'Uważne, powolne odczytanie wybranego wersetu lub fragmentu biblijnego z otwartym sercem.',
    guide: 'Przeczytaj werset wyjściowy powoli, nawet kilkakrotnie, w razie potrzeby na głos. Zwróć uwagę na kluczowe słowa, czasowniki, postacie, symbole (np. krew, woda, droga, pasterz, góra, chleb). Co ten tekst mówi sam w sobie?',
    defaultTimeMin: 4
  },
  {
    step: 2,
    latinName: 'Scrutatio Scripturae',
    polishName: 'Właściwa Skrutacja — Badanie Pism',
    shortDesc: 'Wędrówka ścieżką odnośników biblijnych (Biblia Jerozolimska). Pozwól, by Biblia sama tłumaczyła Biblię.',
    guide: 'To serce metody: przejdź do odnośników marginesowych znajdujących się przy wersecie (np. litery a, b, c w Biblii Jerozolimskiej). Otwieraj kolejne księgi, odkrywaj jak Stary Testament zapowiada Nowy, a Nowy wyjaśnia Stary (typologia). Twórz łańcuch / drzewo wersetów i notuj powiązania.',
    defaultTimeMin: 15
  },
  {
    step: 3,
    latinName: 'Meditatio',
    polishName: 'Medytacja — Odniesienie do Życia',
    shortDesc: 'Konfrontacja odkrytej prawdy Bożej z moją osobistą historią, aktualną sytuacją, lękami i nadziejami.',
    guide: 'Zadaj sobie pytanie: Co Bóg mówi przez te powiązane wersety DZISIAJ do mojego konkretnego życia? W czym przypominam Izraela na pustyni, Piotra, Abrahama czy syna marnotrawnego? Pozwól, by Słowo stało się mieczem obosiecznym osądzającym myśli i zamiary serca (Hbr 4,12).',
    defaultTimeMin: 7
  },
  {
    step: 4,
    latinName: 'Oratio',
    polishName: 'Modlitwa — Dialog z Bogiem',
    shortDesc: 'Moja szczera, spontaniczna odpowiedź na usłyszane Słowo Boże: dziękczynienie, prośba o przebaczenie, krzyk o pomoc.',
    guide: 'Odpowiedz Bogu Jego własnym Słowem lub słowami płynącymi prosto z serca. Jeśli Słowo ukazało twój grzech — przeproś i proś o łaskę. Jeśli ukazało Bożą wierność — wielbij Go. Nie używaj wyuczonych formuł, rozmawiaj jak syn z Ojcem.',
    defaultTimeMin: 5
  },
  {
    step: 5,
    latinName: 'Contemplatio',
    polishName: 'Kontemplacja — Spoczynek w Bogu',
    shortDesc: 'Trwanie w miłosnym milczeniu przed Bogiem. Spojrzenie wiary utkwione w Chrystusie.',
    guide: 'Ucisz wszelkie myśli, słowa i analizy. Pozostań w prostej obecności przed Panem. «Ja patrzę na Niego, a On patrzy na mnie» (św. Jan Vianney). Pozwól, by pokój Boży, który przewyższa wszelki umysł, strzegł twojego serca.',
    defaultTimeMin: 4
  },
  {
    step: 6,
    latinName: 'Actio & Rhema (Słowo Życia)',
    polishName: 'Działanie i Wybór Słowa Życia',
    shortDesc: 'Zapisanie konkretnego owocu skrutacji: jedno Słowo (Rhema) do zapamiętania na cały dzień oraz konkretne postanowienie nawrócenia.',
    guide: 'Wybierz jeden werset lub zdanie, które najbardziej cię dotknęło — noś je w sercu przez cały dzień jak duchową broń. Jakie konkretne działanie miłości, przebaczenia lub posłuszeństwa podejmiesz dzisiaj?',
    defaultTimeMin: 3
  }
];

export const HOLY_SPIRIT_PRAYERS = [
  {
    title: 'Hymn do Ducha Świętego (Veni Creator Spiritus)',
    author: 'Tradycja Kościoła',
    latin: `Veni, Creator Spiritus,
mentes tuorum visita,
imple superna gratia,
quae tu creasti pectora.

Qui diceris Paraclitus,
altissimi donum Dei,
fons vivus, ignis, caritas,
et spiritalis unctio...`,
    text: `O Stworzycielu, Duchu, przyjdź,
Nawiedź dusz wiernych Tobie krąg,
Niebieską łaską serca syć,
Co dziełem są Twych boskich rąk.

Pocieszycielem jesteś zwan,
I Najwyższego Boga dar,
Tyś źródłem życia, miłość, żar,
I namaszczenie naszych ran.

Daj nam przez Ciebie Ojca znać,
Daj, by i Syn poznany był,
I Ciebie, jedno Tchnienie Dwóch,
Niech wyznajemy z wszystkich sił. Amen.`
  },
  {
    title: 'Sekwencja do Ducha Świętego (Veni Sancte Spiritus)',
    author: 'Św. Stefan Langton',
    latin: `Veni, Sancte Spiritus,
et emitte caelitus
lucis tuae radium...`,
    text: `Przybądź, Duchu Święty,
Ześlij z nieba wzięty
Światła Twego strumień.

Przyjdź, Ojcze ubogich,
Przyjdź, Dawco łask drogich,
Przyjdź, Światłości sumień.

O Najmilszy z Gości,
Słodka serc radości,
Słodkie orzeźwienie.

W pracy Tyś ochłodą,
W skwarze żywą wodą,
W płaczu utulenie.

Światłości najświętsza,
Serc wierzących wnętrza
Poddaj Twej potędze! Amen. Alleluja.`
  },
  {
    title: 'Modlitwa przed czytaniem Pisma Świętego',
    author: 'Św. Jan Chryzostom',
    text: `Panie Jezu Chryste, otwórz oczy mego serca, abym usłyszał Twoje Słowo i zrozumiał je, oraz wypełniał Twoją świętą wolę. 

Nie ukrywaj przede mną Twoich przykazań, lecz otwórz moje oczy, abym ujrzał cuda Twojego Prawa. Opowiedz mi nieznane i tajemne rzeczy Twojej mądrości. W Tobie pokładam nadzieję, Boże mój, że oświecisz mój umysł i serce światłem Twojego poznania, abym nie tylko czytał to, co zostało napisane, lecz także to wypełniał. 

Gdyż Ty jesteś światłością tych, którzy leżą w ciemności, i Tobie oddajemy chwałę, Ojcu i Synowi, i Duchowi Świętemu, teraz i zawsze, i na wieki wieków. Amen.`
  },
  {
    title: 'Modlitwa o Ducha Prawdy',
    author: 'Św. Augustyn z Hippony',
    text: `Oddychaj we mnie, Duchu Święty, abym święcie myślał.
Przymuszaj mnie, Duchu Święty, abym święcie postępował.
Pobudzaj mnie, Duchu Święty, abym miłował to, co święte.
Umacniaj mnie, Duchu Święty, abym strzegł tego, co święte.
Strzeż mnie, Duchu Święty, abym nigdy nie utracił tego, co święte. Amen.`
  }
];

export const SCRUTATION_THEOLOGY_FAQ = [
  {
    question: 'Czym jest Skrutacja Pisma Świętego (Scrutatio Scripturae)?',
    answer: 'Skrutacja (z łac. *scrutatio* – badanie, dociekanie, przeszukiwanie; od czasownika *scrutari* – badać, zgłębiać) to tradycyjna chrześcijańska metoda modlitewnego badania Pisma Świętego. Jej nazwa wywodzi się bezpośrednio ze słów Jezusa Chrystusa zapisanych w Ewangelii wg św. Jana: «Badajcie Pisma, ponieważ sądzicie, że w nich zawarte jest życie wieczne: to one właśnie dają o Mnie świadectwo» (J 5,39; w Wulgacie: *Scrutamini Scripturas*).'
  },
  {
    question: 'Na czym polega zasada "Biblia tłumaczy się sama" (Scriptura sui ipsius interpres)?',
    answer: 'Kluczową zasadą skrutacji jest to, że Pismo Święte stanowi jedną nierozerwalną całość natchnioną przez Ducha Świętego. Jeden fragment Pisma rzuca światło na inny. Poprzez śledzenie odnośników marginesowych (zwłaszcza wypracowanych w tradycji Biblii Jerozolimskiej), odkrywamy, jak wydarzenia, proroctwa i figury Starego Testamentu znajdują swoje pełne wyjaśnienie i wypełnienie w osobie, męce i zmartwychwstaniu Jezusa Chrystusa w Nowym Testamencie (typologia biblijna).'
  },
  {
    question: 'Czym różni się Skrutacja od Lectio Divina?',
    answer: 'Obydwie metody są głęboko zakorzenione w tradycji Ojców Kościoła i monastycyzmu. Klasyczne Lectio Divina koncentruje się zazwyczaj na medytacji i kontemplacji jednego wybranego fragmentu (perykopy) krok po kroku. Skrutacja natomiast polega na dynamicznym wędrowaniu po całym kanonie biblijnym: od wersetu wyjściowego podążamy za odnośnikami (wersety paralelne, wspólne pojęcia hebrajskie i greckie, motywy teologiczne), tworząc "drzewo" lub "łańcuch" biblijny, który ukazuje pełną historię zbawienia skupioną wokół Chrystusa.'
  },
  {
    question: 'Jakie narzędzia są potrzebne do skrutacji?',
    answer: 'Tradycyjnie do skrutacji potrzebna jest Biblia z dobrym aparatem odnośników marginesowych i przypisów (najlepiej Biblia Jerozolimska lub Biblia Tysiąclecia z odnośnikami), notatnik do rysowania drzewa powiązań i zapisywania myśli, oraz czas wyciszenia (zwykle od 45 do 90 minut).'
  }
];
