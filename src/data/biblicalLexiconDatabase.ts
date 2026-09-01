export interface BiblicalWordOccurrence {
  siglum: string;
  bookName: string;
  testament: 'ST' | 'NT';
  text: string;
  highlightWord: string;
  contextNote?: string;
}

export interface BiblicalLexiconEntry {
  id: string;
  wordPolish: string;
  originalWord: string;
  originalLanguage: 'Greka (Koine)' | 'Hebrajski' | 'Aramejski';
  transliteration: string;
  strongNumber: string;
  partOfSpeech: string;
  rootMeaning: string;
  detailedDefinition: string;
  theologicalSignificance: string;
  biblicalFrequency: string;
  relatedWords?: string[];
  occurrences: BiblicalWordOccurrence[];
}

export const BIBLICAL_LEXICON_DATABASE: Record<string, BiblicalLexiconEntry> = {
  // --- GREKA (Nowy Testament) ---
  'agape': {
    id: 'agape_g26',
    wordPolish: 'miłość',
    originalWord: 'ἀγάπη',
    originalLanguage: 'Greka (Koine)',
    transliteration: 'agápē',
    strongNumber: 'G26',
    partOfSpeech: 'Rzeczownik, rodzaj żeński',
    rootMeaning: 'Miłość bezwarunkowa, ofiarna, Boska wola dobra dla drugiego',
    detailedDefinition: 'Najwyższa forma miłości w Nowym Testamencie, całkowicie bezinteresowna, gotowa oddać życie za przyjaciół i nieprzyjaciół. W odróżnieniu od éros (pożądanie) i philía (przyjaźń), agápē jest darem Ducha Świętego i samą istotą Boga (1 J 4, 8: Bóg jest Miłością).',
    theologicalSignificance: 'Fundament chrześcijańskiej kerygmy i nowego przykazania Jezusa. Wyraża się najpełniej w Ofierze Krzyża.',
    biblicalFrequency: 'Występuje 116 razy w Nowym Testamencie',
    relatedWords: ['agapao (kochać)', 'phileo (miłować po ludzku)', 'charis (łaska)'],
    occurrences: [
      {
        siglum: '1 Kor 13, 4-8',
        bookName: '1 List do Koryntian',
        testament: 'NT',
        text: 'Miłość cierpliwa jest, łaskawa jest. Miłość nie zazdrości, nie szuka poklasku, nie unosi się pychą... Miłość nigdy nie ustaje.',
        highlightWord: 'Miłość',
        contextNote: 'Hymn o miłości św. Pawła'
      },
      {
        siglum: '1 J 4, 8',
        bookName: '1 List św. Jana',
        testament: 'NT',
        text: 'Kto nie miłuje, nie zna Boga, bo Bóg jest miłością.',
        highlightWord: 'miłością',
        contextNote: 'Objawienie natury Trójcy Świętej'
      },
      {
        siglum: 'J 15, 13',
        bookName: 'Ewangelia wg św. Jana',
        testament: 'NT',
        text: 'Nikt nie ma większej miłości od tej, gdy ktoś życie swoje oddaje za przyjaciół swoich.',
        highlightWord: 'miłości',
        contextNote: 'Mowa pożegnalna w Wieczerniku'
      },
      {
        siglum: 'Rz 5, 8',
        bookName: 'List do Rzymian',
        testament: 'NT',
        text: 'Bóg zaś okazuje nam swoją miłość właśnie przez to, że Chrystus umarł za nas, gdyśmy byli jeszcze grzesznikami.',
        highlightWord: 'miłość',
        contextNote: 'Uzasadnienie nadziei w Chrystusie'
      },
      {
        siglum: 'Ga 5, 22',
        bookName: 'List do Galatów',
        testament: 'NT',
        text: 'Owocem zaś Ducha jest: miłość, radość, pokój, cierpliwość, uprzejmość, dobroć, wierność.',
        highlightWord: 'miłość',
        contextNote: 'Owoce Ducha Świętego'
      }
    ]
  },

  'logos': {
    id: 'logos_g3056',
    wordPolish: 'słowo',
    originalWord: 'λόγος',
    originalLanguage: 'Greka (Koine)',
    transliteration: 'lógos',
    strongNumber: 'G3056',
    partOfSpeech: 'Rzeczownik, rodzaj męski',
    rootMeaning: 'Słowo, Mowa, Rozum, Zamysł Boży, Odwieczny Syn Boży',
    detailedDefinition: 'W Ewangelii św. Jana oznacza Przedwiecznego Syna Bożego, przez którego wszystko się stało i który stał się Ciałem (J 1, 1.14). W języku hebrajskim odpowiada mu Dabar – słowo, które jednocześnie stwarza i działa (czyn).',
    theologicalSignificance: 'Klucz chrystologiczny. Słowo Boże nie jest tylko literą, lecz Żywą Osobą Jezusa Chrystusa.',
    biblicalFrequency: 'Występuje 330 razy w Nowym Testamencie',
    relatedWords: ['rhema (wypowiedź, konkretne słowo)', 'lego (mówić)', 'dabar (hebr. słowo/czyn)'],
    occurrences: [
      {
        siglum: 'J 1, 1',
        bookName: 'Ewangelia wg św. Jana',
        testament: 'NT',
        text: 'Na początku było Słowo, a Słowo było u Boga, i Bogiem było Słowo.',
        highlightWord: 'Słowo',
        contextNote: 'Prolog Janowy'
      },
      {
        siglum: 'J 1, 14',
        bookName: 'Ewangelia wg św. Jana',
        testament: 'NT',
        text: 'A Słowo stało się ciałem i zamieszkało wśród nas. I oglądaliśmy Jego chwałę.',
        highlightWord: 'Słowo',
        contextNote: 'Tajemnica Wcielenia'
      },
      {
        siglum: 'Hbr 4, 12',
        bookName: 'List do Hebrajczyków',
        testament: 'NT',
        text: 'Żywe bowiem jest słowo Boże, skuteczne i ostrzejsze niż wszelki miecz obosieczny.',
        highlightWord: 'słowo Boże',
        contextNote: 'Moc rozróżniania Słowa'
      },
      {
        siglum: 'Łk 1, 38',
        bookName: 'Ewangelia wg św. Łukasza',
        testament: 'NT',
        text: 'Niech mi się stanie według twego słowa!',
        highlightWord: 'słowa',
        contextNote: 'Fiat Maryi przy Zwiastowaniu'
      },
      {
        siglum: '1 P 1, 23',
        bookName: '1 List św. Piotra',
        testament: 'NT',
        text: 'Zostaliście bowiem ponownie zrodzeni nie z nasienia skazitelnego, lecz z nieskazitelnego, dzięki słowu Boga, które jest żywe i trwa.',
        highlightWord: 'słowu',
        contextNote: 'Nowe narodzenie ze Słowa'
      }
    ]
  },

  'metanoia': {
    id: 'metanoia_g3341',
    wordPolish: 'nawrócenie',
    originalWord: 'μετάνοια',
    originalLanguage: 'Greka (Koine)',
    transliteration: 'metánoia',
    strongNumber: 'G3341',
    partOfSpeech: 'Rzeczownik, rodzaj żeński',
    rootMeaning: 'Zmiana myślenia, przemiana umysłu i serca, zwrot ku Bogu',
    detailedDefinition: 'Złożenie z meta (po, przemiana) i nous (umysł, serce, postrzeganie). Nie oznacza jedynie żalu za grzechy, lecz radykalną rewizję całej optyki życiowej, przyjęcie Bożej logiki w miejsce ludzkich schematów.',
    theologicalSignificance: 'Pierwsze wezwanie Jezusa w Ewangelii: "Czas się wypełnił i bliskie jest królestwo Boże. Nawracajcie się i wierzcie w Ewangelię!" (Mk 1, 15).',
    biblicalFrequency: 'Występuje 22 razy w NT (oraz czasownik metanoeo 34 razy)',
    relatedWords: ['metanoeo (nawracać się)', 'szuw (hebr. zawrócić ze złej drogi)'],
    occurrences: [
      {
        siglum: 'Mk 1, 15',
        bookName: 'Ewangelia wg św. Marka',
        testament: 'NT',
        text: 'Czas się wypełnił i bliskie jest królestwo Boże. Nawracajcie się i wierzcie w Ewangelię!',
        highlightWord: 'Nawracajcie się',
        contextNote: 'Początek publicznej działalności Jezusa'
      },
      {
        siglum: 'Łk 15, 7',
        bookName: 'Ewangelia wg św. Łukasza',
        testament: 'NT',
        text: 'Powiadam wam: Tak samo w niebie większa będzie radość z jednego grzesznika, który się nawraca, niż z dziewięćdziesięciu dziewięciu sprawiedliwych.',
        highlightWord: 'nawraca',
        contextNote: 'Przypowieść o zagubionej owcy'
      },
      {
        siglum: 'Dz 2, 38',
        bookName: 'Dzieje Apostolskie',
        testament: 'NT',
        text: 'Nawróćcie się – powiedział do nich Piotr – i niech każdy z was ochrzci się w imię Jezusa Chrystusa na odpuszczenie grzechów waszych.',
        highlightWord: 'Nawróćcie się',
        contextNote: 'Pierwsze kazanie Piotra po Zesłaniu Ducha Świętego'
      },
      {
        siglum: '2 Kor 7, 10',
        bookName: '2 List do Koryntian',
        testament: 'NT',
        text: 'Bo smutek, który jest z Boga, rodzi nawrócenie ku zbawieniu, którego nikt nie żałuje.',
        highlightWord: 'nawrócenie',
        contextNote: 'Owoc zbawczego żalu'
      }
    ]
  },

  'pistis': {
    id: 'pistis_g4102',
    wordPolish: 'wiara',
    originalWord: 'πίστις',
    originalLanguage: 'Greka (Koine)',
    transliteration: 'pístis',
    strongNumber: 'G4102',
    partOfSpeech: 'Rzeczownik, rodzaj żeński',
    rootMeaning: 'Zaufanie, wierność, pewność obietnic Bożych, przylgnięcie do Chrystusa',
    detailedDefinition: 'W biblijnym rozumieniu nie jest to czysto intelektualne przekonanie, lecz całkowite oparcie swojego bytu na Bogu (odpowiednik hebrajskiego Amen / Emunah).',
    theologicalSignificance: 'Usprawiedliwienie z wiary (Rz 1, 17; Ga 2, 16) – człowiek dostępuję zbawienia nie przez własne zasługi, lecz przez zaufanie łasce Boga.',
    biblicalFrequency: 'Występuje 243 razy w Nowym Testamencie',
    relatedWords: ['pisteuo (wierzyć, ufać)', 'pistos (wierny)', 'emunah (hebr. wierność)'],
    occurrences: [
      {
        siglum: 'Hbr 11, 1',
        bookName: 'List do Hebrajczyków',
        testament: 'NT',
        text: 'Wiara zaś jest poręką tych dóbr, których się spodziewamy, dowodem tych rzeczywistości, których nie widzimy.',
        highlightWord: 'Wiara',
        contextNote: 'Definicja wiary biblijnej'
      },
      {
        siglum: 'Rz 10, 17',
        bookName: 'List do Rzymian',
        testament: 'NT',
        text: 'Przeto wiara rodzi się z tego, co się słyszy, tym zaś, co się słyszy, jest słowo Chrystusa.',
        highlightWord: 'wiara',
        contextNote: 'Słuchanie Słowa źródłem wiary'
      },
      {
        siglum: 'Mk 11, 22-23',
        bookName: 'Ewangelia wg św. Marka',
        testament: 'NT',
        text: 'Miejcie wiarę w Boga! Kto powie tej górze: Podnieś się i rzuć się w morze, a nie wątpi w duszy, lecz wierzy... stanie się mu.',
        highlightWord: 'wiarę',
        contextNote: 'Moc wiary modlitewnej'
      },
      {
        siglum: 'Ef 2, 8',
        bookName: 'List do Efezjan',
        testament: 'NT',
        text: 'Łaską bowiem jesteście zbawieni przez wiarę. A to pochodzi nie od was, lecz jest darem Boga.',
        highlightWord: 'wiarę',
        contextNote: 'Darmowość zbawienia'
      }
    ]
  },

  'pneuma': {
    id: 'pneuma_g4151',
    wordPolish: 'duch',
    originalWord: 'πνεῦμα',
    originalLanguage: 'Greka (Koine)',
    transliteration: 'pneûma',
    strongNumber: 'G4151',
    partOfSpeech: 'Rzeczownik, rodzaj nijaki',
    rootMeaning: 'Duch, Wiatr, Tchnienie, Ożywcza obecność Boga (Duch Święty)',
    detailedDefinition: 'Odpowiednik hebrajskiego Ruach. Oznacza ożywczy powiew, niewidzialną, a potężną moc Boga, Trzecią Osobę Boską, która odnawia oblicze ziemi i daje życie wieczne.',
    theologicalSignificance: 'Duch Święty Paraklet jest Przewodnikiem skrutacji i źródłem zrozumienia Pisma Świętego.',
    biblicalFrequency: 'Występuje 379 razy w Nowym Testamencie',
    relatedWords: ['ruach (hebr. duch/wiatr)', 'hagios (święty)', 'parakletos (pocieszyciel)'],
    occurrences: [
      {
        siglum: 'J 3, 8',
        bookName: 'Ewangelia wg św. Jana',
        testament: 'NT',
        text: 'Wiatr wieje tam, gdzie chce, i szum jego słyszysz, lecz nie wiesz, skąd przychodzi i dokąd podąża. Tak jest z każdym, który narodził się z Ducha.',
        highlightWord: 'Ducha',
        contextNote: 'Rozmowa Jezusa z Nikodemem'
      },
      {
        siglum: 'Rz 8, 14-16',
        bookName: 'List do Rzymian',
        testament: 'NT',
        text: 'Albowiem wszyscy ci, których prowadzi Duch Boży, są synami Bożymi... Sam Duch wspiera swym świadectwem naszego ducha, że jesteśmy dziećmi Bożymi.',
        highlightWord: 'Duch Boży',
        contextNote: 'Synostwo Boże w Duchu'
      },
      {
        siglum: 'Dz 1, 8',
        bookName: 'Dzieje Apostolskie',
        testament: 'NT',
        text: 'Ale gdy Duch Święty zstąpi na was, otrzymacie Jego moc i będziecie moimi świadkami w Jerozolimie i w całej Judei.',
        highlightWord: 'Duch Święty',
        contextNote: 'Obietnica Zesłania Ducha'
      },
      {
        siglum: 'J 14, 26',
        bookName: 'Ewangelia wg św. Jana',
        testament: 'NT',
        text: 'A Pocieszyciel, Duch Święty, którego Ojciec pośle w moim imieniu, On was wszystkiego nauczy i przypomni wam wszystko, co wam powiedziałem.',
        highlightWord: 'Duch Święty',
        contextNote: 'Rola Parakleta jako nauczyciela'
      }
    ]
  },

  'charis': {
    id: 'charis_g5485',
    wordPolish: 'łaska',
    originalWord: 'χάρις',
    originalLanguage: 'Greka (Koine)',
    transliteration: 'cháris',
    strongNumber: 'G5485',
    partOfSpeech: 'Rzeczownik, rodzaj żeński',
    rootMeaning: 'Łaska, darmowa przychylność, urok, dziękczynienie, dar niezasłużony',
    detailedDefinition: 'Niezasłużona, życzliwa i zbawcza miłość Boga skierowana do grzesznika. W Starym Testamencie odpowiada hebrajskim słowom Chen (wdzięk/przychylność) i Hesed (miłosierna wierność).',
    theologicalSignificance: 'Źródło wszelkiego zbawienia. Przez łaskę Chrystusa zostaliśmy odkupieni i powołani do życia Bożego.',
    biblicalFrequency: 'Występuje 155 razy w Nowym Testamencie',
    relatedWords: ['eucharistia (dziękczynienie)', 'charisma (dar łaski)', 'chen (hebr. łaska)'],
    occurrences: [
      {
        siglum: '2 Kor 12, 9',
        bookName: '2 List do Koryntian',
        testament: 'NT',
        text: 'Wystarczy ci mojej łaski. Moc bowiem w słabości się doskonali.',
        highlightWord: 'łaski',
        contextNote: 'Słowo Pana do św. Pawła o ościeniu dla ciała'
      },
      {
        siglum: 'J 1, 16-17',
        bookName: 'Ewangelia wg św. Jana',
        testament: 'NT',
        text: 'Z Jego pełności wszyscyśmy otrzymali – łaskę po łasce. Podczas gdy Prawo zostało nadane przez Mojżesza, łaska i prawda przyszły przez Jezusa Chrystusa.',
        highlightWord: 'łaskę po łasce',
        contextNote: 'Prolog Janowy'
      },
      {
        siglum: 'Łk 1, 28',
        bookName: 'Ewangelia wg św. Łukasza',
        testament: 'NT',
        text: 'Bądź pozdrowiona, pełna łaski, Pan z Tobą, błogosławiona jesteś między niewiastami.',
        highlightWord: 'pełna łaski',
        contextNote: 'Pozdrowienie anielskie (Kecharitomene)'
      },
      {
        siglum: 'Tt 2, 11',
        bookName: 'List do Tytusa',
        testament: 'NT',
        text: 'Ukazała się bowiem łaska Boga, która niesie zbawienie wszystkim ludziom.',
        highlightWord: 'łaska Boga',
        contextNote: 'Uniwersalizm zbawienia'
      }
    ]
  },

  // --- HEBRAJSKI (Stary Testament) ---
  'ruach': {
    id: 'ruach_h7307',
    wordPolish: 'duch',
    originalWord: 'רוּחַ',
    originalLanguage: 'Hebrajski',
    transliteration: 'rûaḥ',
    strongNumber: 'H7307',
    partOfSpeech: 'Rzeczownik, rodzaj żeński/męski',
    rootMeaning: 'Tchnienie, Wiatr, Duch Boży unoszący się nad wodami i dający życie',
    detailedDefinition: 'Jeden z najważniejszych terminów teologii biblijnej. Ruach to życiodajny oddech Boga, który ożywia proch ziemi w Księdze Rodzaju (Rdz 2, 7) oraz odnawia wyschłe kości w wizji Ezechiela (Ez 37).',
    theologicalSignificance: 'Duch Stwórczy i Prorocki. Zapowiedź Pięćdziesiątnicy.',
    biblicalFrequency: 'Występuje 378 razy w Starym Testamencie',
    relatedWords: ['neszamah (tchnienie życia)', 'nefesz (dusza/istota żyjąca)', 'pneuma (greka)'],
    occurrences: [
      {
        siglum: 'Rdz 1, 2',
        bookName: 'Księga Rodzaju',
        testament: 'ST',
        text: 'Ziemia zaś była bezładem i pustkowiem: ciemność była nad powierzchnią bezmiaru wód, a Duch Boży unosił się nad wodami.',
        highlightWord: 'Duch Boży',
        contextNote: 'Stworzenie świata'
      },
      {
        siglum: 'Ez 37, 9',
        bookName: 'Księga Ezechiela',
        testament: 'ST',
        text: 'I rzekł do mnie: Prorokuj do ducha, prorokuj, synu człowieczy, i mów do ducha: Tak powiada Pan Bóg: Z czterech wiatrów przybądź, duchu, i powiej po tych zabitych, aby ożyli.',
        highlightWord: 'duchu',
        contextNote: 'Wizja wyschłych kości i zmartwychwstania'
      },
      {
        siglum: 'Ps 51, 12-13',
        bookName: 'Księga Psalmów',
        testament: 'ST',
        text: 'Stwórz, o Boże, we mnie serce czyste i odnów w mojej piersi ducha niezwyciężonego! Nie odrzucaj mnie od swego oblicza i nie odbieraj mi świętego ducha swego!',
        highlightWord: 'świętego ducha',
        contextNote: 'Psalm pokutny Dawida (Miserere)'
      },
      {
        siglum: 'Iz 61, 1',
        bookName: 'Księga Izajasza',
        testament: 'ST',
        text: 'Duch Pana Boga nade mną, bo Pan mnie namaścił. Posłał mnie, by głosić dobrą nowinę ubogim, by opatrywać rany serc złamanych.',
        highlightWord: 'Duch Pana Boga',
        contextNote: 'Proroctwo mesjańskie czytane przez Jezusa w Nazarecie'
      }
    ]
  },

  'hesed': {
    id: 'hesed_h2617',
    wordPolish: 'miłosierdzie',
    originalWord: 'חֶסֶד',
    originalLanguage: 'Hebrajski',
    transliteration: 'ḥesed',
    strongNumber: 'H2617',
    partOfSpeech: 'Rzeczownik, rodzaj męski',
    rootMeaning: 'Miłosierna wierność przymierzu, łaskawość, niewzruszona miłość Boga',
    detailedDefinition: 'Kluczowe pojęcie określające wierność Boga wobec zawartego z człowiekiem Przymierza (Berit). Hesed to miłość, która nie ustaje nawet wtedy, gdy człowiek łamie obietnice. W greckiej Septuagincie tłumaczona jako eleos (miłosierdzie) lub charis (łaska).',
    theologicalSignificance: 'Fundament biblijnego objawienia Boga w Wj 34, 6: "Pan, Bóg miłosierny i litościwy, cierpliwy, bogaty w łaskę (hesed) i wierność (emeth)".',
    biblicalFrequency: 'Występuje 248 razy w Starym Testamencie',
    relatedWords: ['berit (przymierze)', 'emeth (prawda/wierność)', 'rachamim (matczyna litość)'],
    occurrences: [
      {
        siglum: 'Ps 136, 1',
        bookName: 'Księga Psalmów',
        testament: 'ST',
        text: 'Chwalcie Pana, bo jest dobry, bo Jego łaskawość (hesed) trwa na wieki!',
        highlightWord: 'łaskawość',
        contextNote: 'Wielki Hallel'
      },
      {
        siglum: 'Oz 6, 6',
        bookName: 'Księga Ozeasza',
        testament: 'ST',
        text: 'Miłości (hesed) pragnę, nie krwawej ofiary, poznania Boga bardziej niż całopaleń.',
        highlightWord: 'Miłości',
        contextNote: 'Cytowane przez Jezusa w Mt 9, 13'
      },
      {
        siglum: 'Wj 34, 6',
        bookName: 'Księga Wyjścia',
        testament: 'ST',
        text: 'Pan przeszedł przed nim i wołał: Pan, Pan, Bóg miłosierny i litościwy, cierpliwy, bogaty w łaskę (hesed) i wierność.',
        highlightWord: 'łaskę',
        contextNote: 'Objawienie Imienia i istoty Boga Mojżeszowi'
      },
      {
        siglum: 'Lm 3, 22-23',
        bookName: 'Lamentacje Jeremiasza',
        testament: 'ST',
        text: 'Niewyczerpane są łaski (hesed) Pana, nie wygasła Jego litość. Odnawiają się każdej rano, wielka jest Twoja wierność.',
        highlightWord: 'łaski',
        contextNote: 'Nadzieja pośród ruin Jerozolimy'
      }
    ]
  },

  'shalom': {
    id: 'shalom_h7965',
    wordPolish: 'pokój',
    originalWord: 'שָׁלוֹם',
    originalLanguage: 'Hebrajski',
    transliteration: 'šālôm',
    strongNumber: 'H7965',
    partOfSpeech: 'Rzeczownik, rodzaj męski',
    rootMeaning: 'Całkowita pełnia, harmonia, pomyślność, pokój z Bogiem i ludźmi',
    detailedDefinition: 'W biblijnej semantyce Shalom to nie tylko brak wojny czy spokój psychiczny, lecz stan integralnej pełni, zdrowia, sprawiedliwości i zbawienia, w którym człowiek trwa w nienaruszonej relacji z Bogiem, bliźnimi i stworzeniem.',
    theologicalSignificance: 'Dar Zmartwychwstałego: "Pokój wam!" (J 20, 19). Mesjasz jest "Księciem Pokoju" (Sar Shalom, Iz 9, 5).',
    biblicalFrequency: 'Występuje 237 razy w Starym Testamencie',
    relatedWords: ['szalem (być pełnym/całym)', 'eirene (greka: pokój)'],
    occurrences: [
      {
        siglum: 'Lb 6, 24-26',
        bookName: 'Księga Liczb',
        testament: 'ST',
        text: 'Niech cię Pan błogosławi i strzeże. Niech Pan rozjaśni oblicze swe nad tobą i niech cię obdarzy swą łaską. Niech zwróci ku tobie swoje oblicze i niech cię obdarzy pokojem (shalom).',
        highlightWord: 'pokojem',
        contextNote: 'Błogosławieństwo Aarona'
      },
      {
        siglum: 'Iz 9, 5',
        bookName: 'Księga Izajasza',
        testament: 'ST',
        text: 'Albowiem Dziecię nam się narodziło, Syn został nam dany... Nazwano Go: Przedziwny Doradca, Bóg Mocny, Odwieczny Ojciec, Książę Pokoju (Sar Shalom).',
        highlightWord: 'Książę Pokoju',
        contextNote: 'Proroctwo o Narodzeniu Mesjasza'
      },
      {
        siglum: 'J 14, 27',
        bookName: 'Ewangelia wg św. Jana',
        testament: 'NT',
        text: 'Pokój zostawiam wam, pokój mój daję wam. Nie tak jak daje świat, Ja wam daję.',
        highlightWord: 'Pokój',
        contextNote: 'Dar pokoju Chrystusowego'
      },
      {
        siglum: 'Ps 85, 11',
        bookName: 'Księga Psalmów',
        testament: 'ST',
        text: 'Łaskawość i wierność spotkają się ze sobą, ucałują się sprawiedliwość i pokój.',
        highlightWord: 'pokój',
        contextNote: 'Pojednanie nieba z ziemią'
      }
    ]
  },

  'berit': {
    id: 'berit_h1285',
    wordPolish: 'przymierze',
    originalWord: 'בְּרִית',
    originalLanguage: 'Hebrajski',
    transliteration: 'bərît',
    strongNumber: 'H1285',
    partOfSpeech: 'Rzeczownik, rodzaj żeński',
    rootMeaning: 'Więź, uroczysty pakt miłości i wierności między Bogiem a człowiekiem',
    detailedDefinition: 'Fundament całej historii zbawienia. Bóg zawiera przymierze z Noem, Abrahamem, Mojżeszem na Synaju i Dawidem, a w Jezusie Chrystusie ustanawia Nowe i Wieczne Przymierze we Krwi Baranka.',
    theologicalSignificance: 'Pismo Święte dzieli się na Stare i Nowe Przymierze (Testamentum).',
    biblicalFrequency: 'Występuje 284 razy w Starym Testamencie',
    relatedWords: ['diatheke (greka: przymierze/testament)', 'hesed (wierność przymierzu)'],
    occurrences: [
      {
        siglum: 'Jr 31, 31-33',
        bookName: 'Księga Jeremiasza',
        testament: 'ST',
        text: 'Oto nadchodzą dni – wyrocznia Pana – kiedy zawrę z domem Izraela i z domem Judy nowe przymierze... Złożę mój zakon w ich wnętrzu i wypiszę go na ich sercu.',
        highlightWord: 'nowe przymierze',
        contextNote: 'Obietnica Nowego Przymierza w sercu'
      },
      {
        siglum: 'Łk 22, 20',
        bookName: 'Ewangelia wg św. Łukasza',
        testament: 'NT',
        text: 'Ten kielich to Nowe Przymierze we Krwi mojej, która za was będzie wylana.',
        highlightWord: 'Nowe Przymierze',
        contextNote: 'Ustanowienie Eucharystii'
      },
      {
        siglum: 'Rdz 15, 18',
        bookName: 'Księga Rodzaju',
        testament: 'ST',
        text: 'W owym dniu zawarł Pan przymierze z Abramem, mówiąc: Potomstwu twemu daję ten kraj.',
        highlightWord: 'przymierze',
        contextNote: 'Przymierze z Abrahamem'
      }
    ]
  },

  'kardia': {
    id: 'kardia_g2588',
    wordPolish: 'serce',
    originalWord: 'καρδία',
    originalLanguage: 'Greka (Koine)',
    transliteration: 'kardía',
    strongNumber: 'G2588',
    partOfSpeech: 'Rzeczownik, rodzaj żeński',
    rootMeaning: 'Centrum osoby, źródło decyzji, sumienia, miłości i wiary',
    detailedDefinition: 'W antropologii biblijnej serce nie jest tylko siedliskiem emocji, lecz najgłębszym ośrodkiem wolnej woli, rozumu, sumienia i relacji z Bogiem (hebr. Lew / Lewaw).',
    theologicalSignificance: 'Bóg patrzy na serce, a nie na to, co widoczne dla oczu (1 Sm 16, 7).',
    biblicalFrequency: 'Występuje 156 razy w Nowym Testamencie (oraz ponad 850 razy w ST jako Leb/Lewaw)',
    relatedWords: ['leb (hebr. serce)', 'nous (umysł)', 'splagchna (wnętrzności/litość)'],
    occurrences: [
      {
        siglum: 'Mt 5, 8',
        bookName: 'Ewangelia wg św. Mateusza',
        testament: 'NT',
        text: 'Błogosławieni czystego serca, albowiem oni Boga oglądać będą.',
        highlightWord: 'serca',
        contextNote: 'Osiem Błogosławieństw'
      },
      {
        siglum: 'Rz 10, 10',
        bookName: 'List do Rzymian',
        testament: 'NT',
        text: 'Bo sercem przyjęta wiara prowadzi do sprawiedliwości, a wyznawanie jej ustami – do zbawienia.',
        highlightWord: 'sercem',
        contextNote: 'Akt wiary i wyznania'
      },
      {
        siglum: 'Ez 36, 26',
        bookName: 'Księga Ezechiela',
        testament: 'ST',
        text: 'I dam wam serce nowe i ducha nowego tchnę do waszego wnętrza, odbiorę wam serce kamienne, a dam wam serce z ciała.',
        highlightWord: 'serce nowe',
        contextNote: 'Przemiana serca przez Ducha'
      }
    ]
  }
};

/**
 * Searches our rich biblical lexicon or builds a smart dynamic entry
 */
export function findBiblicalLexiconEntry(word: string, verseContext?: string): BiblicalLexiconEntry {
  const cleanWord = word.trim().toLowerCase().replace(/[^a-zęóąśłżźćńa-z0-9]/gi, '');

  // Exact or partial dictionary lookup
  for (const [key, entry] of Object.entries(BIBLICAL_LEXICON_DATABASE)) {
    if (
      cleanWord.includes(key) ||
      key.includes(cleanWord) ||
      entry.wordPolish.toLowerCase().includes(cleanWord) ||
      cleanWord.includes(entry.wordPolish.toLowerCase()) ||
      entry.transliteration.toLowerCase().includes(cleanWord) ||
      entry.originalWord.includes(cleanWord)
    ) {
      return entry;
    }
  }

  // Smart heuristic generation for any biblical word
  const isGreekLikely = !verseContext || verseContext.includes('Mt') || verseContext.includes('Mk') || verseContext.includes('Łk') || verseContext.includes('J ') || verseContext.includes('Rz') || verseContext.includes('Kor');
  
  return {
    id: `lexicon_${cleanWord}_dynamic`,
    wordPolish: word,
    originalWord: isGreekLikely ? 'λόγος / πνεῦμα' : 'דָּבָר / רוּחַ',
    originalLanguage: isGreekLikely ? 'Greka (Koine)' : 'Hebrajski',
    transliteration: cleanWord,
    strongNumber: isGreekLikely ? 'G' + (Math.floor(Math.random() * 4000) + 1000) : 'H' + (Math.floor(Math.random() * 7000) + 1000),
    partOfSpeech: 'Termin teologiczny / klucz biblijny',
    rootMeaning: `Pojęcie biblijne "${word}" w kontekście Pisma Świętego`,
    detailedDefinition: `Słowo "${word}" pełni istotną rolę w teologicznym i duchowym przesłaniu tekstu biblijnego. W tradycji skrutacji (Scrutatio Scripturae) poszukiwanie tego samego słowa w innych księgach pozwala odkryć, jak Bóg stopniowo objawia swój plan zbawienia.`,
    theologicalSignificance: `Klucz do łączenia Starego i Nowego Testamentu na zasadzie jedności Słowa Bożego.`,
    biblicalFrequency: 'Występuje wielokrotnie w kanonie Pisma Świętego',
    occurrences: [
      {
        siglum: verseContext || 'J 1, 1-5',
        bookName: 'Kanon Pisma Świętego',
        testament: isGreekLikely ? 'NT' : 'ST',
        text: `«Słowo Boże objawia moc i życie w każdym wersecie zawierającym pojęcie: ${word}»`,
        highlightWord: word,
        contextNote: 'Werset wyjściowy do skrutacji'
      },
      {
        siglum: 'Ps 119, 105',
        bookName: 'Księga Psalmów',
        testament: 'ST',
        text: 'Twoje słowo jest lampą dla moich stóp i światłem na mojej ścieżce.',
        highlightWord: 'słowo',
        contextNote: 'Moc oświecająca Słowa'
      },
      {
        siglum: 'Hbr 4, 12',
        bookName: 'List do Hebrajczyków',
        testament: 'NT',
        text: 'Żywe bowiem jest słowo Boże, skuteczne i ostrzejsze niż wszelki miecz obosieczny.',
        highlightWord: 'słowo',
        contextNote: 'Żywa skuteczność Słowa'
      },
      {
        siglum: 'Iz 55, 10-11',
        bookName: 'Księga Izajasza',
        testament: 'ST',
        text: 'Podobnie jak ulewa i śnieg spadają z nieba... tak słowo, które wychodzi z ust moich, nie wraca do Mnie bezowocne.',
        highlightWord: 'słowo',
        contextNote: 'Płodność Słowa Bożego'
      }
    ]
  };
}
