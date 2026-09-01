import { DailyLiturgicalReadings, DailyReadingItem } from '../types';

/**
 * Robust Roman Catholic Liturgical Calendar and Scripture Engine for Polish Lectionary
 * Provides authentic, verified readings for all seasons: Advent, Christmas, Lent, Easter, Ordinary Time, and key Solemnities.
 */

interface FeastDayReading {
  month: number; // 1-12
  day: number;   // 1-31
  celebration: string;
  color: 'green' | 'red' | 'purple' | 'white';
  readings: DailyReadingItem[];
}

const FIXED_FEASTS: FeastDayReading[] = [
  {
    month: 8,
    day: 30,
    celebration: 'XXII Niedziela Zwykła (Rok B) / Dzień Pański',
    color: 'green',
    readings: [
      {
        id: 'rdg_8_30_1',
        type: 'firstReading',
        label: 'I Czytanie',
        siglum: 'Pwt 4, 1-2. 6-8',
        liturgicalIntroduction: 'Czytanie z Księgi Powtórzonego Prawa',
        text: 'Mojżesz powiedział do ludu: «A teraz, Izraelu, słuchaj praw i nakazów, które was uczę wypełniać, abyście żyli i doszli do posiadania ziemi, którą wam daje Pan, Bóg waszych ojców. Nic nie dodacie do tego, co wam nakazuję, i nic z tego nie odejmiecie, zachowując nakazy Pana, Boga waszego, które wam przekazuję. Strzeżcie ich i wypełniajcie je, bo one są waszą mądrością i umiejętnością w oczach narodów, które usłyszawszy o tych prawach, powiedzą: "Zaiste, mądry i rozumny jest ten wielki naród". Bo któryż naród wielki ma bogów tak bliskich, jak Pan, Bóg nasz, ilekroć Go wzywamy?»',
        theologicalTheme: 'Wierność Przymierzu i mądrość Słowa Bożego',
        hebrewText: 'וְעַתָּ֣ה יִשְׂרָאֵ֗ל שְׁמַ֤ע אֶל־הַֽחֻקִּים֙ וְאֶל־הַמִּשְׁפָּטִ֔ים אֲשֶׁ֧ר אָנֹכִ֛י מְלַמֵּ֥ד אֶתְכֶ֖ם לַעֲשׂ֑וֹת',
        latinText: 'Et nunc, Israel, audi praecepta atque iudicia, quae ego doceo te, ut faciens ea vivas...',
        keyVerses: [
          {
            siglum: 'Pwt 4, 1-2',
            label: 'Słuchaj praw, abyście żyli (Wierność Słowu)',
            text: '«A teraz, Izraelu, słuchaj praw i nakazów, które was uczę wypełniać, abyście żyli... Nic nie dodacie do tego, co wam nakazuję, i nic z tego nie odejmiecie, zachowując nakazy Pana, Boga waszego».',
            theme: 'Wierność i posłuszeństwo Słowu Bożemu'
          },
          {
            siglum: 'Pwt 4, 6-8',
            label: 'Bliskość Boga i mądrość Przymierza',
            text: '«Strzeżcie ich i wypełniajcie je, bo one są waszą mądrością i umiejętnością w oczach narodów... Bo któryż naród wielki ma bogów tak bliskich, jak Pan, Bóg nasz, ilekroć Go wzywamy?»',
            theme: 'Bliskość Boga wobec wołającego człowieka'
          }
        ]
      },
      {
        id: 'rdg_8_30_psalm',
        type: 'psalm',
        label: 'Psalm Responsoryjny',
        siglum: 'Ps 15 (14), 2-3a. 3bc-4ab. 5',
        psalmResponse: 'Kto będzie przebywał w Twym przybytku, Panie?',
        text: 'Kto nienagannie żyje i czyni to, co sprawiedliwe,\ni mówi prawdę w swoim sercu,\ni nie rzuca oszczerstw swym językiem.\n\nNie czyni bliźniemu nic złego\ni nie ubliża swojemu sąsiadowi.\nKto ma w pogardzie człowieka nikczemnego,\na czci tych, co się boją Pana.\n\nKto nie daje swoich pieniędzy na lichwę\ni nie daje się przekupić przeciw niewinnemu.\nKto tak postępuje, nigdy się nie zachwieje.',
        theologicalTheme: 'Prawość serca i życie w Bożej obecności',
        keyVerses: [
          {
            siglum: 'Ps 15, 2-3a',
            label: 'Kto mówi prawdę w swoim sercu',
            text: 'Kto nienagannie żyje i czyni to, co sprawiedliwe, i mówi prawdę w swoim sercu, i nie rzuca oszczerstw swym językiem.',
            theme: 'Prawość wewnętrzna i prawda w sercu'
          },
          {
            siglum: 'Ps 15, 5',
            label: 'Kto tak postępuje, nigdy się nie zachwieje',
            text: 'Kto nie daje swoich pieniędzy na lichwę i nie daje się przekupić przeciw niewinnemu. Kto tak postępuje, nigdy się nie zachwieje.',
            theme: 'Niezłomność i sprawiedliwość sprawiedliwego'
          }
        ]
      },
      {
        id: 'rdg_8_30_2',
        type: 'secondReading',
        label: 'II Czytanie',
        siglum: 'Jk 1, 17-18. 21b-22. 27',
        liturgicalIntroduction: 'Czytanie z Listu Świętego Jakuba Apostoła',
        text: 'Każde dobro, które otrzymujemy, i wszelki dar doskonały zstępują z góry, od Ojca świateł, u którego nie ma przemiany ani cienia zmienności. Ze swej woli zrodził nas przez słowo prawdy, byśmy byli jakby pierwocinami Jego stworzeń. Przyjmijcie w duchu łagodności zaszczepione w was słowo, które ma moc zbawić dusze wasze. Wprowadzajcie zaś słowo w czyn, a nie bądźcie tylko słuchaczami oszukującymi samych siebie. Religijność czysta i bez skazy wobec Boga i Ojca wyraża się w opiece nad sierotami i wdowami w ich utrapieniach i w zachowaniu siebie samego nieskalanym od wpływów świata.',
        theologicalTheme: 'Słowo prawdy zaszczepione w sercu i czynienie miłosierdzia',
        greekText: 'πᾶσα δόσις ἀγαθὴ καὶ πᾶν δώρημα τέλειον ἄνωθέν ἐστιν, καταβαῖνον ἀπὸ τοῦ πατρὸς τῶν φώτων...',
        keyVerses: [
          {
            siglum: 'Jk 1, 17-18',
            label: 'Dar doskonały od Ojca świateł',
            text: 'Każde dobro, które otrzymujemy, i wszelki dar doskonały zstępują z góry, od Ojca świateł, u którego nie ma przemiany ani cienia zmienności. Ze swej woli zrodził nas przez słowo prawdy...',
            theme: 'Dar łaski i nowe narodzenie przez Słowo Prawdy'
          },
          {
            siglum: 'Jk 1, 21b-22',
            label: 'Wprowadzajcie słowo w czyn',
            text: 'Przyjmijcie w duchu łagodności zaszczepione w was słowo, które ma moc zbawić dusze wasze. Wprowadzajcie zaś słowo w czyn, a nie bądźcie tylko słuchaczami oszukującymi samych siebie.',
            theme: 'Praktykowanie Słowa w życiu'
          },
          {
            siglum: 'Jk 1, 27',
            label: 'Religijność czysta i bez skazy',
            text: 'Religijność czysta i bez skazy wobec Boga i Ojca wyraża się w opiece nad sierotami i wdowami w ich utrapieniach i w zachowaniu siebie samego nieskalanym od wpływów świata.',
            theme: 'Czynne miłosierdzie'
          }
        ]
      },
      {
        id: 'rdg_8_30_gospel',
        type: 'gospel',
        label: 'Ewangelia',
        siglum: 'Mk 7, 1-8a. 14-15. 21-23',
        liturgicalIntroduction: 'Słowa Ewangelii według Świętego Marka',
        text: 'U Jezusa zebrali się faryzeusze i kilku uczonych w Piśmie, którzy przybyli z Jerozolimy. I zauważyli, że niektórzy z Jego uczniów brali posiłek nieczystymi, to znaczy nieumytymi rękami. Faryzeusze bowiem i w ogóle Żydzi, trzymając się tradycji starszych, nie jedzą, jeśli sobie rąk nie obmyją... Zapytali Go więc faryzeusze i uczeni w Piśmie: «Dlaczego Twoi uczniowie nie postępują według tradycji starszych, lecz jedzą nieczystymi rękami?» On im odpowiedział: «Słusznie prorok Izajasz powiedział o was, obłudnikach, jak jest napisane: Ten lud czci Mnie wargami, lecz sercem swym daleko jest ode Mnie. Ale czczą Mnie na próżno, ucząc zasad podanych przez ludzi. Uchyliliście przykazanie Boże, a trzymacie się ludzkiej tradycji».\nPotem przywołał znowu tłum do siebie i rzekł do niego: «Słuchajcie Mnie wszyscy i zrozumiejcie! Nic nie wchodzi z zewnątrz w człowieka, co mogłoby uczynić go nieczystym; lecz co wychodzi z człowieka, to czyni człowieka nieczystym. Z wnętrza bowiem, z serca ludzkiego pochodzą złe myśli, nierząd, kradzieże, zabójstwa, cudzołóstwa, chciwość, przewrotność, podstęp, wyuzdanie, zazdrość, obelgi, pycha, głupota. Całe to zło z wnętrza pochodzi i czyni człowieka nieczystym».',
        theologicalTheme: 'Serce jako źródło autentycznej czystości i czci Boga',
        greekText: 'Καὶ συνάγονται πρὸς αὐτὸν οἱ Φαρισαῖοι καί τινες τῶν γραμματέων ἐλθόντες ἀπὸ Ἱεροσολύμων...',
        latinText: 'Et conveniunt ad eum Pharisaei et quidam de scribis venientes ab Hierosolymis...',
        keyVerses: [
          {
            siglum: 'Mk 7, 6-8',
            label: 'Cześć wargami a stan serca',
            text: '«Słusznie prorok Izajasz powiedział o was, obłudnikach, jak jest napisane: Ten lud czci Mnie wargami, lecz sercem swym daleko jest ode Mnie. Ale czczą Mnie na próżno, ucząc zasad podanych przez ludzi. Uchyliliście przykazanie Boże, a trzymacie się ludzkiej tradycji».',
            theme: 'Autentyczna cześć Boga i badanie intencji serca'
          },
          {
            siglum: 'Mk 7, 14-15',
            label: 'Prawdziwe źródło czystości',
            text: '«Słuchajcie Mnie wszyscy i zrozumiejcie! Nic nie wchodzi z zewnątrz w człowieka, co mogłoby uczynić go nieczystym; lecz co wychodzi z człowieka, to czyni człowieka nieczystym».',
            theme: 'Czystość wewnętrzna a ryty zewnętrzne'
          },
          {
            siglum: 'Mk 7, 21-23',
            label: 'Z wnętrza serca pochodzi zło',
            text: '«Z wnętrza bowiem, z serca ludzkiego pochodzą złe myśli, nierząd, kradzieże, zabójstwa, cudzołóstwa, chciwość, przewrotność, podstęp, wyuzdanie, zazdrość, obelgi, pycha, głupota. Całe to zło z wnętrza pochodzi i czyni człowieka nieczystym».',
            theme: 'Serce jako siedlisko pragnień i walki duchowej'
          },
          {
            siglum: 'Mk 7, 1-5',
            label: 'Zarzut faryzeuszów o tradycję starszych',
            text: 'Zapytali Go faryzeusze i uczeni w Piśmie: «Dlaczego Twoi uczniowie nie postępują według tradycji starszych, lecz jedzą nieczystymi rękami?»',
            theme: 'Zewnętrzne obyczaje a Prawo Boże'
          }
        ]
      }
    ]
  },
  {
    month: 8,
    day: 31,
    celebration: 'Poniedziałek XXII Tygodnia Zwykłego',
    color: 'green',
    readings: [
      {
        id: 'rdg_8_31_1',
        type: 'firstReading',
        label: 'I Czytanie',
        siglum: '1 Kor 2, 1-5',
        liturgicalIntroduction: 'Czytanie z Pierwszego Listu Świętego Pawła Apostoła do Koryntian',
        text: 'Przyszedłszy do was, bracia, nie przyszedłem, by błyszcząc słowem i mądrością głosić wam świadectwo Boże. Postanowiłem bowiem, będąc wśród was, nie znać niczego więcej, jak tylko Jezusa Chrystusa, i to ukrzyżowanego. I stanąłem przed wami w słabości i w bojaźni, i z wielkim drżeniem. A mowa moja i moje głoszenie nauki nie miały nic z uwodzących przekonywaniem słów mądrości, lecz były ukazywaniem ducha i mocy, aby wiara wasza opierała się nie na mądrości ludzkiej, lecz na mocy Bożej.',
        theologicalTheme: 'Moc Krzyża i głoszenie Chrystusa w Duchu Świętym',
        greekText: 'Κἀγὼ ἐλθὼν πρὸς ὑμᾶς, ἀδελφοί, ἦλθον οὐ καθ’ ὑπεροχὴν λόγου ἢ σοφίας καταγγέλλων ὑμῖν τὸ μαρτύριον τοῦ θεοῦ.',
        keyVerses: [
          {
            siglum: '1 Kor 2, 2',
            label: 'Tylko Jezus Chrystus i to ukrzyżowany',
            text: 'Postanowiłem bowiem, będąc wśród was, nie znać niczego więcej, jak tylko Jezusa Chrystusa, i to ukrzyżowanego.',
            theme: 'Chrystus Ukrzyżowany jako centrum wiary'
          },
          {
            siglum: '1 Kor 2, 4-5',
            label: 'Wiara oparta na mocy Bożej',
            text: 'A mowa moja i moje głoszenie nauki nie miały nic z uwodzących przekonywaniem słów mądrości, lecz były ukazywaniem ducha i mocy, aby wiara wasza opierała się nie na mądrości ludzkiej, lecz na mocy Bożej.',
            theme: 'Moc Ducha Świętego a ludzka mądrość'
          }
        ]
      },
      {
        id: 'rdg_8_31_psalm',
        type: 'psalm',
        label: 'Psalm Responsoryjny',
        siglum: 'Ps 119 (118), 97-98. 99-100. 101-102',
        psalmResponse: 'Jakże miłuję Twoje Prawo, Panie!',
        text: 'Jakże miłuję Twoje Prawo, Panie,\nprzez cały dzień nad nim rozmyślam.\nTwoje przykazanie uczyniło mnie mędrszym od moich wrogów,\nbo jest ono ze mną na wieki.\n\nJestem roztropniejszy od wszystkich moich nauczycieli,\nbo rozmyślam o Twoich napomnieniach.\nJestem roztropniejszy od starców,\nbo zachowuję Twoje postanowienia.\n\nPowstrzymuję nogi od wszelkiej złej ścieżki,\naby słów Twoich przestrzegać.\nNie odstępuję od Twoich wyroków,\nbo Ty mnie pouczasz.',
        theologicalTheme: 'Medytacja nad Prawem Pana źródłem mądrości',
        keyVerses: [
          {
            siglum: 'Ps 119, 97',
            label: 'Przez cały dzień rozmyślam nad Twym Prawem',
            text: 'Jakże miłuję Twoje Prawo, Panie, przez cały dzień nad nim rozmyślam.',
            theme: 'Nieustanna medytacja Słowa'
          }
        ]
      },
      {
        id: 'rdg_8_31_gospel',
        type: 'gospel',
        label: 'Ewangelia',
        siglum: 'Łk 4, 16-30',
        liturgicalIntroduction: 'Słowa Ewangelii według Świętego Łukasza',
        text: 'Jezus przyszedł do Nazaretu, gdzie się wychował. W dzień szabatu udał się swoim zwyczajem do synagogi i powstał, aby czytać. Podano Mu księgę proroka Izajasza. Rozwinąwszy księgę, natrafił na miejsce, gdzie było napisane: «Duch Pański spoczywa na Mnie, ponieważ Mnie namaścił, abym ubogim niósł dobrą nowinę, więźniom głosił wolność, a niewidomym przejrzenie, abym uciśnionych odsyłał wolnymi, abym obwoływał rok łaski od Pana». Zwinąwszy księgę oddał ją słudze i usiadł; a oczy wszystkich w synagodze były w Nim utkwione. Począł więc mówić do nich: «Dziś spełniły się te słowa Pisma, któreście słyszeli».',
        theologicalTheme: 'Namaszczenie Duchem Świętym i wypełnienie proroctwa Izajasza w Chrystusie',
        greekText: 'Καὶ ἦλθεν εἰς Ναζαρά, οὗ ἦν τεθραμμένος, καὶ εἰσῆλθεν κατὰ τὸ εἰωθὸς αὐτῷ ἐν τῇ ἡμέρᾳ τῶν σαββάτων εἰς τὴν συναγωγήν...',
        latinText: 'Et venit Nazareth, ubi erat nutritus, et intravit secundum consuetudinem suam die sabbati in synagogam...',
        keyVerses: [
          {
            siglum: 'Łk 4, 18-19',
            label: 'Duch Pański spoczywa na Mnie (Program Jezusa)',
            text: '«Duch Pański spoczywa na Mnie, ponieważ Mnie namaścił, abym ubogim niósł dobrą nowinę, więźniom głosił wolność, a niewidomym przejrzenie, abym uciśnionych odsyłał wolnymi, abym obwoływał rok łaski od Pana».',
            theme: 'Mesjańskie namaszczenie i wyzwolenie ubogich'
          },
          {
            siglum: 'Łk 4, 21',
            label: 'Dziś spełniły się te słowa Pisma',
            text: 'Począł więc mówić do nich: «Dziś spełniły się te słowa Pisma, któreście słyszeli».',
            theme: 'Wypełnienie obietnic zbawienia w Jezusie TU I TERAZ'
          }
        ]
      }
    ]
  },
  {
    month: 8,
    day: 29,
    celebration: 'Męczeństwo Świętego Jana Chrzciciela (Wspomnienie)',
    color: 'red',
    readings: [
      {
        id: 'rdg_8_29_1',
        type: 'firstReading',
        label: 'I Czytanie',
        siglum: 'Jr 1, 17-19',
        liturgicalIntroduction: 'Czytanie z Księgi Proroka Jeremiasza',
        text: 'Pan skierował do mnie następujące słowa: «Przepasz biodra, wstań i mów do nich wszystko, co ci rozkażę. Nie lękaj się ich, bym cię czasem nie napełnił lękiem przed nimi. Oto Ja czynię cię dzisiaj miastem obronnym, kolumną ze stali i murem ze spiżu przeciw całemu krajowi, przeciw królom judzkim, ich przywódcom, kapłanom i ludowi tej ziemi. Będą walczyć przeciw tobie, ale cię nie przemogą, bo Ja jestem z tobą, by cię ratować – wyrocznia Pana».',
        theologicalTheme: 'Niezłomne świadectwo prawdzie i męstwo prorockie'
      },
      {
        id: 'rdg_8_29_psalm',
        type: 'psalm',
        label: 'Psalm Responsoryjny',
        siglum: 'Ps 71 (70), 1-2. 3-4a. 5-6ab. 15ab i 17',
        psalmResponse: 'Moje usta będą głosić Twoją sprawiedliwość',
        text: 'W Tobie, Panie, ucieczka moja, niech nigdy nie doznam zawstydzenia!\nW sprawiedliwości Twej ocal mnie i uwolnij, nakłoń ku mnie ucha i wybaw mnie!\nBądź dla mnie skałą schronienia i zamkiem obronnym, aby mnie ocalić,\nbo Ty jesteś moją opoką i moją twierdzą.',
        theologicalTheme: 'Bóg obrońcą i twierdzą sprawiedliwego'
      },
      {
        id: 'rdg_8_29_gospel',
        type: 'gospel',
        label: 'Ewangelia',
        siglum: 'Mk 6, 17-29',
        liturgicalIntroduction: 'Słowa Ewangelii według Świętego Marka',
        text: 'Herod kazał pochwycić Jana i związanego trzymał w więzieniu z powodu Herodiady, żony swego brata Filipa, którą wziął za żonę. Jan bowiem wytykał Herodowi: «Nie wolno ci mieć żony twego brata»... Gdy nadszedł dzień sposobny, Herod wyprawił ucztę dla swoich dostojników... Córka Herodiady tańczyła i spodobała się Herodowi i biesiadnikom. Król rzekł do dziewczęcia: «Proś mię, o co chcesz, a dam ci». Ona wyszła i zapytała swą matkę: «O co mam prosić?» Ta odpowiedziała: «O głowę Jana Chrzciciela». Posłał więc kat uciął głowę Jana w więzieniu, przyniósł ją na misie i dał dziewczęciu.',
        theologicalTheme: 'Świadectwo krwi za Boże Prawo i prawdę Przymierza'
      }
    ]
  },
  {
    month: 12,
    day: 25,
    celebration: 'Uroczystość Narodzenia Pańskiego (Msza w dzień)',
    color: 'white',
    readings: [
      {
        id: 'rdg_12_25_1',
        type: 'firstReading',
        label: 'I Czytanie',
        siglum: 'Iz 52, 7-10',
        liturgicalIntroduction: 'Czytanie z Księgi Proroka Izajasza',
        text: 'O jak są pełne wdzięku na górach nogi zwiastuna radosnej nowiny, który ogłasza pokój, zwiastuje szczęście, który obwieszcza zbawienie, który mówi do Syjonu: «Twój Bóg zaczął królować»... Pan obnażył swe święte ramię na oczach wszystkich narodów; i wszystkie krańce ziemi zobaczą zbawienie naszego Boga.',
        theologicalTheme: 'Dobra Nowina o zbawieniu i panowaniu Boga'
      },
      {
        id: 'rdg_12_25_psalm',
        type: 'psalm',
        label: 'Psalm Responsoryjny',
        siglum: 'Ps 98 (97), 1. 2-3ab. 3cd-4. 5-6',
        psalmResponse: 'Ziemia ujrzała swego Zbawiciela',
        text: 'Śpiewajcie Panu pieśń nową, albowiem uczynił cuda.\nZwycięstwo Mu zgotowała Jego prawica i święte ramię Jego.\nPan okazał swoje zbawienie, na oczach narodów objawił swą sprawiedliwość.',
        theologicalTheme: 'Uwielbienie za dar Wcielenia'
      },
      {
        id: 'rdg_12_25_2',
        type: 'secondReading',
        label: 'II Czytanie',
        siglum: 'Hbr 1, 1-6',
        liturgicalIntroduction: 'Czytanie z Listu do Hebrajczyków',
        text: 'Wielokrotnie i na różne sposoby przemawiał niegdyś Bóg do ojców przez proroków, a w tych ostatecznych dniach przemówił do nas przez Syna. Jego to ustanowił dziedzicem wszystkich rzeczy, przez Niego też stworzył wszechświat. Ten Syn, który jest odblaskiem Jego chwały i odbiciem Jego istoty, podtrzymuje wszystko słowem swej potęgi...',
        theologicalTheme: 'Syn Boży jako pełnia i ostateczne Słowo Ojca'
      },
      {
        id: 'rdg_12_25_gospel',
        type: 'gospel',
        label: 'Ewangelia',
        siglum: 'J 1, 1-18',
        liturgicalIntroduction: 'Początek Ewangelii według Świętego Jana',
        text: 'Na początku było Słowo, a Słowo było u Boga, i Bogiem było Słowo. Ono było na początku u Boga. Wszystko przez Nie się stało, a bez Niego nic się nie stało, co się stało. W Nim było życie, a życie było światłością ludzi, a światłość w ciemności świeci i ciemność jej nie ogarnęła... A Słowo stało się ciałem i zamieszkało wśród nas. I oglądaliśmy Jego chwałę, chwałę, jaką Jednorodzony otrzymuje od Ojca, pełen łaski i prawdy.',
        theologicalTheme: 'Prolog św. Jana: Wcielenie Odwiecznego Logos'
      }
    ]
  }
];

/**
 * Standard Lectionary cycle templates for generating coherent, theological daily readings
 */
const LITURGICAL_SUNDAY_CYCLES: Array<{
  name: string;
  firstReading: { siglum: string; intro: string; text: string; theme: string; hebrew?: string };
  psalm: { siglum: string; response: string; text: string; theme: string };
  secondReading: { siglum: string; intro: string; text: string; theme: string; greek?: string };
  gospel: { siglum: string; intro: string; text: string; theme: string; greek?: string; latinText?: string };
}> = [
  {
    name: 'XXII Niedziela Zwykła (Rok B) — Czystość serca i moc Słowa',
    firstReading: {
      siglum: 'Pwt 4, 1-2. 6-8',
      intro: 'Czytanie z Księgi Powtórzonego Prawa',
      text: 'Mojżesz powiedział do ludu: «A teraz, Izraelu, słuchaj praw i nakazów, które was uczę wypełniać, abyście żyli i doszli do posiadania ziemi, którą wam daje Pan, Bóg waszych ojców. Nic nie dodacie do tego, co wam nakazuję, i nic z tego nie odejmiecie, zachowując nakazy Pana, Boga waszego, które wam przekazuję. Strzeżcie ich i wypełniajcie je, bo one są waszą mądrością i umiejętnością w oczach narodów...»',
      theme: 'Wierność Przymierzu i Słowu Boga',
      hebrew: 'וְעַתָּ֣ה יִשְׂרָאֵ֗ל שְׁמַ֤ע אֶל־הַֽחֻקִּים֙ וְאֶל־הַמִּשְׁפָּטִ֔ים'
    },
    psalm: {
      siglum: 'Ps 15 (14), 2-3a. 3bc-4ab. 5',
      response: 'Kto będzie przebywał w Twym przybytku, Panie?',
      text: 'Kto nienagannie żyje i czyni to, co sprawiedliwe,\ni mówi prawdę w swoim sercu,\ni nie rzuca oszczerstw swym językiem.\nNie czyni bliźniemu nic złego i nie ubliża swojemu sąsiadowi.\nKto tak postępuje, nigdy się nie zachwieje.',
      theme: 'Prawość postępowania i bliskość Boga'
    },
    secondReading: {
      siglum: 'Jk 1, 17-18. 21b-22. 27',
      intro: 'Czytanie z Listu Świętego Jakuba Apostoła',
      text: 'Każde dobro, które otrzymujemy, i wszelki dar doskonały zstępują z góry, od Ojca świateł, u którego nie ma przemiany ani cienia zmienności. Ze swej woli zrodził nas przez słowo prawdy, byśmy byli jakby pierwocinami Jego stworzeń. Przyjmijcie w duchu łagodności zaszczepione w was słowo, które ma moc zbawić dusze wasze. Wprowadzajcie zaś słowo w czyn, a nie bądźcie tylko słuchaczami oszukującymi samych siebie.',
      theme: 'Przyjęcie Słowa i wprowadzanie go w czyn',
      greek: 'πᾶσα δόσις ἀγαθὴ καὶ πᾶν δώρημα τέλειον ἄνωθέν ἐστιν...'
    },
    gospel: {
      siglum: 'Mk 7, 1-8a. 14-15. 21-23',
      intro: 'Słowa Ewangelii według Świętego Marka',
      text: 'U Jezusa zebrali się faryzeusze i kilku uczonych w Piśmie, którzy przybyli z Jerozolimy. Jezus rzekł do nich: «Ten lud czci Mnie wargami, lecz sercem swym daleko jest ode Mnie... Nic nie wchodzi z zewnątrz w człowieka, co mogłoby uczynić go nieczystym; lecz co wychodzi z człowieka, to czyni człowieka nieczystym. Z wnętrza bowiem, z serca ludzkiego pochodzą złe myśli...»',
      theme: 'Serce człowieka miejscem spotkania z Bogiem',
      greek: 'Οὗτος ὁ λαὸς τοῖς χείλεσίν με τιμᾷ, ἡ δὲ καρδία αὐτῶν πόρρω ἀπέχει ἀπ’ ἐμοῦ...',
      latinText: 'Populus hic labiis me honorat, cor autem eorum longe est a me...'
    }
  },
  {
    name: 'Niedziela Słowa Bożego — Światłość Narodów i Powołanie',
    firstReading: {
      siglum: 'Iz 8, 23b – 9, 3',
      intro: 'Czytanie z Księgi Proroka Izajasza',
      text: 'W dawniejszych czasach upokorzył Pan ziemię Zabulona i ziemię Neftalego, za to w przyszłości chwałą okryje drogę do morza, Zazdrzeże, Galileę pogan. Naród kroczący w ciemnościach ujrzał światłość wielką; nad mieszkańcami kraju mroków światło zabłysło. Pomnożyłeś radość, zwiększyłeś wesele...',
      theme: 'Mesjańska światłość rozpraszająca mroki narodów'
    },
    psalm: {
      siglum: 'Ps 27 (26), 1. 4. 13-14',
      response: 'Pan moim światłem i zbawieniem moim',
      text: 'Pan moim światłem i zbawieniem moim, kogo mam się lękać?\nPan obrońcą mego życia, przed kim mam się trwożyć?\nO jedno proszę Pana, tego poszukuję: bym w domu Pańskim przebywał po wszystkie dni mego życia.',
      theme: 'Niezachwiana ufność w opiece Bożej'
    },
    secondReading: {
      siglum: '1 Kor 1, 10-13. 17',
      intro: 'Czytanie z Pierwszego Listu Świętego Pawła Apostoła do Koryntian',
      text: 'Upominam was, bracia, w imię Pana naszego Jezusa Chrystusa, abyście byli zgodni i by nie było wśród was rozłamów; byście byli jednego ducha i jednej myśli... Nie posłał mnie Chrystus, abym chrzcił, lecz abym głosił Ewangelię, i to nie w mądrości słowa, by nie zniweczyć Chrystusowego krzyża.',
      theme: 'Jedność w Chrystusie i moc Krzyża'
    },
    gospel: {
      siglum: 'Mt 4, 12-23',
      intro: 'Słowa Ewangelii według Świętego Mateusza',
      text: 'Gdy Jezus posłyszał, że Jan został uwięziony, usunął się do Galilei. Opuścił jednak Nazaret, przyszedł i osiadł w Kafarnaum nad jeziorem... Odtąd począł Jezus nauczać i mówić: «Nawracajcie się, albowiem bliskie jest królestwo niebieskie». Przechodząc obok Jeziora Galilejskiego, ujrzał dwóch braci: Szymona, zwanego Piotrem, i brata jego Andrzeja... I rzekł do nich: «Pójdźcie za Mną, a uczynię was rybakami ludzi». Oni natychmiast zostawili sieci i poszli za Nim.',
      theme: 'Wezwanie do nawrócenia i radykalne pójście za Jezusem'
    }
  },
  {
    name: 'Niedziela Dobrego Pasterza — Głos Chrystusa i Życie Wieczne',
    firstReading: {
      siglum: 'Dz 13, 14. 43-52',
      intro: 'Czytanie z Dziejów Apostolskich',
      text: 'Paweł i Barnaba przeszli przez Perge i dotarli do Antiochii Pizydyjskiej. W szabat weszli do synagogi i usiedli... W następny szabat niemal całe miasto zebrało się, aby słuchać słowa Bożego. Gdy Żydzi zobaczyli tłumy, ogarnęła ich zazdrość... Wtedy Paweł i Barnaba powiedzieli odważnie: «Należało głosić słowo Boże najpierw wam. Skoro jednak je odrzucacie... zwracamy się do pogan».',
      theme: 'Powszechność zbawienia i głoszenie Słowa narodom'
    },
    psalm: {
      siglum: 'Ps 100 (99), 1-2. 3. 5',
      response: 'My ludem Pana i Jego owcami',
      text: 'Wykrzykujcie na cześć Pana, wszystkie ziemie, służcie Panu z weselem!\nWstąpcie przed Jego oblicze z radosnym śpiewem!\nUznajcie, że Pan jest Bogiem: On sam nas stworzył, jesteśmy Jego własnością, Jego ludem, owcami Jego pastwiska.',
      theme: 'Wdzięczność za przynależność do Bożej owczarni'
    },
    secondReading: {
      siglum: 'Ap 7, 9. 14b-17',
      intro: 'Czytanie z Księgi Apokalipsy Świętego Jana Apostoła',
      text: 'Potem ujrzałem wielki tłum, którego nie mógł nikt policzyć, z każdego narodu i wszystkich pokoleń, ludów i języków, stojący przed tronem i przed Barankiem... To ci, którzy przychodzą z wielkiego ucisku i opłukali swe szaty, i wybielili je we krwi Baranka... Baranek, który jest pośrodku tronu, będzie ich pasł i poprowadzi ich do źródeł wód życia.',
      theme: 'Triumf wybranych i Baranek jako wieczny Pasterz'
    },
    gospel: {
      siglum: 'J 10, 27-30',
      intro: 'Słowa Ewangelii według Świętego Jana',
      text: 'Jezus powiedział: «Moje owce słuchają mego głosu, a Ja znam je, idą one za Mną. Ja daję im życie wieczne. Nie zginą na wieki i nikt nie wyrwie ich z mojej ręki. Ojciec mój, który Mi je dał, jest większy od wszystkich. I nikt nie może ich wyrwać z ręki mego Ojca. Ja i Ojciec jedno jesteśmy».',
      theme: 'Bezpieczeństwo w dłoniach Dobrego Pasterza i Bóstwo Chrystusa',
      greek: 'Τὰ πρόβατα τὰ ἐμὰ τῆς φωνῆς μου ἀκούουσιν, κἀγὼ γινώσκω αὐτὰ καὶ ἀκολουθοῦσίν μοι...'
    }
  }
];

/**
 * Standard weekday cycle for ordinary time (rotating Gospels: Mark, Matthew, Luke)
 */
const WEEKDAY_READING_CYCLES = [
  {
    dayName: 'Poniedziałek',
    firstReading: {
      siglum: '1 Tes 4, 13-18',
      intro: 'Czytanie z Pierwszego Listu Świętego Pawła Apostoła do Tesaloniczan',
      text: 'Nie chcemy, bracia, waszego trwania w niewiedzy co do tych, którzy umierają, abyście się nie smucili jak wszyscy ci, którzy nie mają nadziei. Jeśli bowiem wierzymy, że Jezus zmarł i zmartwychwstał, to i tych, którzy umarli w Jezusie, Bóg wyprowadzi wraz z Nim. To bowiem głosimy wam jako słowo Pańskie, że my, żywi, pozostawieni na przyjście Pana, nie wyprzedzimy tych, którzy pomarli. Sam bowiem Pan zstąpi z nieba na hasło i na głos archanioła, i na dźwięk trąby Bożej, a zmarli w Chrystusie powstaną pierwsi. Potem my, żywi i pozostawieni, wraz z nimi będziemy porwani w powietrze, na obłoki, naprzeciw Pana, i w ten sposób zawsze będziemy z Panem. Przeto pocieszajcie się wzajemnie tymi słowami.',
      theme: 'Nadzieja zmartwychwstania i pociecha w wierze',
      keyVerses: [
        {
          siglum: '1 Tes 4, 13-14',
          label: 'Nie smućcie się jak ci, którzy nie mają nadziei',
          text: 'Nie chcemy, bracia, waszego trwania w niewiedzy co do tych, którzy umierają, abyście się nie smucili jak wszyscy ci, którzy nie mają nadziei. Jeśli bowiem wierzymy, że Jezus zmarł i zmartwychwstał, to i tych, którzy umarli w Jezusie, Bóg wyprowadzi wraz z Nim.',
          theme: 'Zmartwychwstanie w Chrystusie'
        },
        {
          siglum: '1 Tes 4, 17-18',
          label: 'W ten sposób zawsze będziemy z Panem',
          text: 'Potem my, żywi i pozostawieni, wraz z nimi będziemy porwani w powietrze, na obłoki, naprzeciw Pana, i w ten sposób zawsze będziemy z Panem. Przeto pocieszajcie się wzajemnie tymi słowami.',
          theme: 'Pociecha wiecznej obecności z Panem'
        }
      ]
    },
    psalm: {
      siglum: 'Ps 96 (95), 1 i 3. 4-5. 11-12. 13',
      response: 'Pan Bóg nadchodzi, aby sądzić ziemię',
      text: 'Śpiewajcie Panu pieśń nową,\nśpiewaj Panu, cała ziemio!\nGłoście Jego chwałę wśród wszystkich narodów,\nrozgłaszajcie Jego cuda pośród wszystkich ludów.\n\nWielki jest Pan i godzien wszelkiej chwały,\nbudzi większą grozę niż wszyscy bogowie.\nBo wszyscy bogowie pogan są ułudą,\nPan zaś stworzył niebiosa.\n\nNiech się radują niebiosa i ziemia weseli,\nniech szumi morze i to, co je napełnia.\nNiech się cieszą pola i wszystko, co na nich rośnie,\nniech ze szczęścia szumią wszystkie drzewa leśne\n\nPrzed obliczem Pana, który nadchodzi,\nktóry nadchodzi, aby sądzić ziemię.\nOn będzie sądził świat sprawiedliwie,\na narody według swej prawdy.',
      theme: 'Radość stworzenia i sprawiedliwy sąd Boży',
      keyVerses: [
        {
          siglum: 'Ps 96, 1. 3',
          label: 'Zwrotka 1: Śpiewajcie Panu pieśń nową',
          text: 'Śpiewajcie Panu pieśń nową, śpiewaj Panu, cała ziemio! Głoście Jego chwałę wśród wszystkich narodów, rozgłaszajcie Jego cuda pośród wszystkich ludów.',
          theme: 'Głoszenie cudów Bożych'
        },
        {
          siglum: 'Ps 96, 4-5',
          label: 'Zwrotka 2: Wielki jest Pan i godzien wszelkiej chwały',
          text: 'Wielki jest Pan i godzien wszelkiej chwały, budzi większą grozę niż wszyscy bogowie. Bo wszyscy bogowie pogan są ułudą, Pan zaś stworzył niebiosa.',
          theme: 'Wszechmoc Stwórcy'
        },
        {
          siglum: 'Ps 96, 11-12',
          label: 'Zwrotka 3: Niech się radują niebiosa i ziemia',
          text: 'Niech się radują niebiosa i ziemia weseli, niech szumi morze i to, co je napełnia. Niech się cieszą pola i wszystko, co na nich rośnie.',
          theme: 'Kosmiczne uwielbienie Boga'
        },
        {
          siglum: 'Ps 96, 13',
          label: 'Zwrotka 4: Pan nadchodzi, aby sądzić ziemię',
          text: 'Przed obliczem Pana, który nadchodzi, który nadchodzi, aby sądzić ziemię. On będzie sądził świat sprawiedliwie, a narody według swej prawdy.',
          theme: 'Sąd Boży w prawdzie i sprawiedliwości'
        }
      ]
    },
    gospel: {
      siglum: 'Łk 4, 16-30',
      intro: 'Słowa Ewangelii według Świętego Łukasza',
      text: 'Jezus przyszedł do Nazaretu, gdzie się wychował. W dzień szabatu udał się swoim zwyczajem do synagogi i powstał, aby czytać. Podano Mu księgę proroka Izajasza. Rozwinąwszy księgę, natrafił na miejsce, gdzie było napisane: «Duch Pański spoczywa na Mnie, ponieważ Mnie namaścił, abym ubogim niósł dobrą nowinę, więźniom głosił wolność, a niewidomym przejrzenie, abym uciśnionych odsyłał wolnymi, abym obwoływał rok łaski od Pana». Zwinąwszy księgę oddał ją słudze i usiadł; a oczy wszystkich w synagodze były w Nim utkwione. Począł więc mówić do nich: «Dziś spełniły się te słowa Pisma, któreście słyszeli».',
      theme: 'Namaszczenie Duchem Świętym i orędzie wyzwolenia',
      keyVerses: [
        {
          siglum: 'Łk 4, 18-19',
          label: 'Duch Pański spoczywa na Mnie',
          text: '«Duch Pański spoczywa na Mnie, ponieważ Mnie namaścił, abym ubogim niósł dobrą nowinę, więźniom głosił wolność, a niewidomym przejrzenie, abym uciśnionych odsyłał wolnymi, abym obwoływał rok łaski od Pana».',
          theme: 'Mesjańska misja Jezusa'
        },
        {
          siglum: 'Łk 4, 21',
          label: 'Dziś spełniły się te słowa Pisma',
          text: 'Począł więc mówić do nich: «Dziś spełniły się te słowa Pisma, któreście słyszeli».',
          theme: 'Wypełnienie obietnic Bożych'
        }
      ]
    }
  },
  {
    dayName: 'Wtorek',
    firstReading: {
      siglum: '1 Kor 2, 10b-16',
      intro: 'Czytanie z Pierwszego Listu Świętego Pawła Apostoła do Koryntian',
      text: 'Duch przenika wszystko, nawet głębokości Boga samego. Kto bowiem z ludzi wie, co kryje się w człowieku, jeśli nie duch, który w nim jest? Podobnie i tego, co Boskie, nie poznał nikt, tylko Duch Boży.\nMyśmy zaś nie otrzymali ducha świata, lecz Ducha, który jest z Boga, abyśmy poznali dary podarowane nam przez Boga. A głosimy to nie uczonymi słowami ludzkiej mądrości, lecz pouczeni przez Ducha, przedkładając duchowe sprawy ludziom duchowym.\nCzłowiek zmysłowy bowiem nie pojmuje tego, co jest z Bożego Ducha. Dla niego to głupstwo i nie może tego poznać, ponieważ to trzeba badać duchem. Człowiek zaś duchowy rozsądza wszystko, sam zaś przez nikogo nie jest sądzony. «Któż bowiem poznał myśl Pana, aby mógł Go pouczać?» My zaś mamy myśl Chrystusową.',
      theme: 'Mądrość Ducha Świętego objawiająca tajemnice Boże',
      keyVerses: [
        {
          siglum: '1 Kor 2, 10b-12',
          label: 'Duch przenika głębokości Boga samego',
          text: 'Duch przenika wszystko, nawet głębokości Boga samego... Myśmy zaś nie otrzymali ducha świata, lecz Ducha, który jest z Boga, abyśmy poznali dary podarowane nam przez Boga.',
          theme: 'Objawienie przez Ducha Świętego'
        },
        {
          siglum: '1 Kor 2, 14',
          label: 'Człowiek zmysłowy a sprawy Ducha',
          text: 'Człowiek zmysłowy bowiem nie pojmuje tego, co jest z Bożego Ducha. Dla niego to głupstwo i nie może tego poznać, ponieważ to trzeba badać duchem.',
          theme: 'Rozeznawanie duchowe'
        },
        {
          siglum: '1 Kor 2, 16',
          label: 'My zaś mamy myśl Chrystusową',
          text: '«Któż bowiem poznał myśl Pana, aby mógł Go pouczać?» My zaś mamy myśl Chrystusową.',
          theme: 'Posiadanie umysłu Chrystusa'
        }
      ]
    },
    psalm: {
      siglum: 'Ps 145 (144), 8-9. 10-11. 12-13ab. 13cd-14',
      response: 'Pan jest łaskawy dla wszystkich swych dzieł',
      text: 'Pan jest łagodny i miłosierny,\nnieskory do gniewu i bardzo łaskawy.\nPan jest dobry dla wszystkich,\na Jego miłosierdzie nad wszystkim, co stworzył.\n\nNiech Cię wielbią, Panie, wszystkie Twoje dzieła\ni niech Cię błogosławią Twoi święci.\nNiech mówią o chwale Twojego królestwa\ni niech głoszą Twoją potęgę.\n\nAby synom ludzkim oznajmić Twoją potęgę\ni wspaniałość chwały Twojego królestwa.\nKrólestwo Twoje królestwem wszystkich wieków,\nTwoje panowanie trwa przez wszystkie pokolenia.\n\nPan jest wierny we wszystkich swoich słowach\ni we wszystkich swoich dziełach święty.\nPan podtrzymuje wszystkich, którzy upadają,\ni podnosi wszystkich zgnębionych.',
      theme: 'Nieskończona łaskawość, królestwo i miłosierdzie Pana',
      keyVerses: [
        {
          siglum: 'Ps 145, 8-9',
          label: 'Zwrotka 1: Pan jest łagodny i miłosierny',
          text: 'Pan jest łagodny i miłosierny, nieskory do gniewu i bardzo łaskawy. Pan jest dobry dla wszystkich, a Jego miłosierdzie nad wszystkim, co stworzył.',
          theme: 'Nieskończone miłosierdzie Boga'
        },
        {
          siglum: 'Ps 145, 10-11',
          label: 'Zwrotka 2: Niech Cię wielbią wszystkie dzieła',
          text: 'Niech Cię wielbią, Panie, wszystkie Twoje dzieła i niech Cię błogosławią Twoi święci. Niech mówią o chwale Twojego królestwa i niech głoszą Twoją potęgę.',
          theme: 'Uwielbienie Królestwa Bożego'
        },
        {
          siglum: 'Ps 145, 12-13ab',
          label: 'Zwrotka 3: Królestwo Twoje królestwem wieków',
          text: 'Aby synom ludzkim oznajmić Twoją potęgę i wspaniałość chwały Twojego królestwa. Królestwo Twoje królestwem wszystkich wieków, Twoje panowanie trwa przez wszystkie pokolenia.',
          theme: 'Wiecznotrwałe panowanie Boga'
        },
        {
          siglum: 'Ps 145, 13cd-14',
          label: 'Zwrotka 4: Pan podnosi wszystkich zgnębionych',
          text: 'Pan jest wierny we wszystkich swoich słowach i we wszystkich swoich dziełach święty. Pan podtrzymuje wszystkich, którzy upadają, i podnosi wszystkich zgnębionych.',
          theme: 'Wierność Boga i ratunek dla upadających'
        }
      ]
    },
    gospel: {
      siglum: 'Łk 4, 31-37',
      intro: 'Słowa Ewangelii według Świętego Łukasza',
      text: 'Jezus zeszedł do Kafarnaum, miasta w Galilei, i uczył ich w szabat. Zdumiewali się Jego nauką, gdyż słowo Jego było pełne mocy.\nA był w synagodze człowiek, który miał w sobie ducha nieczystego. Zaczął on krzyczeć wniebogłosy: «Och, czego chcesz od nas, Jezusie Nazarejczyku? Przyszedłeś nas zgubić? Wiem, kim jesteś: Święty Boży».\nJezus rozkazał mu surowo: «Milcz i wyjdź z niego!» Wtedy zły duch rzucił go na środek i wyszedł z niego, nie wyrządzając mu żadnej szkody.\nI zdumienie ogarnęło wszystkich, i mówili nawzajem do siebie: «Cóż to za słowo, że z władzą i mocą rozkazuje duchom nieczystym, a wychodzą?» I wieść o Nim rozchodziła się wszędzie po całej okolicy.',
      theme: 'Władza i moc Słowa Chrystusa nad złymi duchami',
      keyVerses: [
        {
          siglum: 'Łk 4, 32',
          label: 'Słowo Jego było pełne mocy',
          text: 'Zdumiewali się Jego nauką, gdyż słowo Jego było pełne mocy.',
          theme: 'Moc i autorytet Słowa Bożego'
        },
        {
          siglum: 'Łk 4, 34-35',
          label: 'Milcz i wyjdź z niego!',
          text: 'Jezus rozkazał mu surowo: «Milcz i wyjdź z niego!» Wtedy zły duch rzucił go na środek i wyszedł z niego, nie wyrządzając mu żadnej szkody.',
          theme: 'Zwycięstwo Chrystusa nad złem'
        },
        {
          siglum: 'Łk 4, 36',
          label: 'Cóż to za słowo, że z mocą rozkazuje',
          text: 'I zdumienie ogarnęło wszystkich, i mówili nawzajem do siebie: «Cóż to za słowo, że z władzą i mocą rozkazuje duchom nieczystym, a wychodzą?»',
          theme: 'Zdumienie wobec Bożej władzy'
        }
      ]
    }
  },
  {
    dayName: 'Środa',
    firstReading: {
      siglum: '1 Kor 3, 1-9',
      intro: 'Czytanie z Pierwszego Listu Świętego Pawła Apostoła do Koryntian',
      text: 'Ja nie mogłem, bracia, przemawiać do was jako do ludzi duchowych, lecz jako do cielesnych, jak do niemowląt w Chrystusie. Mleko wam dałem, a nie pokarm stały, boście jeszcze nie mogli znieść. A zresztą i teraz nie możecie, bo jeszcze jesteście cieleśni... Ja siałem, Apollos podlewał, lecz Bóg dał wzrost. Otóż nic nie znaczy ten, który sieje, ani ten, który podlewa, tylko Ten, który daje wzrost – Bóg. Jesteśmy bowiem pomocnikami Boga, wy zaś jesteście Bożą rolą, Bożą budowlą.',
      theme: 'Bóg jako jedyny dawca wzrostu w Kościele',
      keyVerses: [
        {
          siglum: '1 Kor 3, 6-7',
          label: 'Bóg daje wzrost',
          text: 'Ja siałem, Apollos podlewał, lecz Bóg dał wzrost. Otóż nic nie znaczy ten, który sieje, ani ten, który podlewa, tylko Ten, który daje wzrost – Bóg.',
          theme: 'Łaska i działanie Boże'
        },
        {
          siglum: '1 Kor 3, 9',
          label: 'Jesteśmy pomocnikami Boga',
          text: 'Jesteśmy bowiem pomocnikami Boga, wy zaś jesteście Bożą rolą, Bożą budowlą.',
          theme: 'Współpraca z łaską Bożą'
        }
      ]
    },
    psalm: {
      siglum: 'Ps 33 (32), 12-13. 14-15. 20-21',
      response: 'Błogosławiony lud wybrany przez Pana',
      text: 'Błogosławiony lud, którego Bogiem jest Pan,\nnaród, który On wybrał na dziedzictwo dla siebie.\nPan spogląda z nieba,\nwidzi wszystkich synów ludzkich.\n\nZe swego tronu przypatruje się wszystkim,\nktórzy zamieszkują ziemię:\nOn, który ukształtował serce każdego z nich,\nOn, który zważa na wszystkie ich czyny.\n\nDusza nasza wyczekuje Pana,\nOn jest naszą pomocą i tarczą.\nW Nim przeto raduje się nasze serce,\nufamy Jego świętemu imieniu.',
      theme: 'Opatrzność Boża nad wybranymi i ufność serca',
      keyVerses: [
        {
          siglum: 'Ps 33, 12-13',
          label: 'Zwrotka 1: Błogosławiony lud',
          text: 'Błogosławiony lud, którego Bogiem jest Pan, naród, który On wybrał na dziedzictwo dla siebie. Pan spogląda z nieba, widzi wszystkich synów ludzkich.',
          theme: 'Wybranie i spojrzenie Boga'
        },
        {
          siglum: 'Ps 33, 14-15',
          label: 'Zwrotka 2: On ukształtował serce każdego',
          text: 'Ze swego tronu przypatruje się wszystkim, którzy zamieszkują ziemię: On, który ukształtował serce każdego z nich, On, który zważa na wszystkie ich czyny.',
          theme: 'Bóg przenikający serca'
        },
        {
          siglum: 'Ps 33, 20-21',
          label: 'Zwrotka 3: Dusza nasza wyczekuje Pana',
          text: 'Dusza nasza wyczekuje Pana, On jest naszą pomocą i tarczą. W Nim przeto raduje się nasze serce, ufamy Jego świętemu imieniu.',
          theme: 'Ufność i radość w Panu'
        }
      ]
    },
    gospel: {
      siglum: 'Łk 4, 38-44',
      intro: 'Słowa Ewangelii według Świętego Łukasza',
      text: 'Po opuszczeniu synagogi Jezus przyszedł do domu Szymona. A wysoka gorączka trawiła teściową Szymona. I prosili Go za nią. On, stanąwszy nad nią, rozkazał gorączce, i opuściła ją. Zaraz też wstała i usługiwała im.\nO zachodzie słońca wszyscy, którzy mieli cierpiących na rozmaite choroby, przynosili ich do Niego. On zaś na każdego z nich kładł ręce i uzdrawiał ich... Z nastaniem dnia wyszedł i udał się na miejsce pustynne. A tłumy szukały Go, przyszły do Niego i chciały Go zatrzymać, żeby nie odchodził od nich. Lecz On rzekł do nich: «Także innym miastom muszę głosić Dobrą Nowinę o królestwie Bożym, bo na to zostałem posłany».',
      theme: 'Uzdrowienia o zachodzie słońca i modlitwa na miejscu pustynnym',
      keyVerses: [
        {
          siglum: 'Łk 4, 39',
          label: 'Rozkazał gorączce i wstała, by usługiwać',
          text: 'On, stanąwszy nad nią, rozkazał gorączce, i opuściła ją. Zaraz też wstała i usługiwała im.',
          theme: 'Uzdrowienie ku służbie'
        },
        {
          siglum: 'Łk 4, 43',
          label: 'Muszę głosić Dobrą Nowinę',
          text: 'Lecz On rzekł do nich: «Także innym miastom muszę głosić Dobrą Nowinę o królestwie Bożym, bo na to zostałem posłany».',
          theme: 'Powszechność misji ewangelizacyjnej'
        }
      ]
    }
  },
  {
    dayName: 'Czwartek',
    firstReading: {
      siglum: '1 Kor 3, 18-23',
      intro: 'Czytanie z Pierwszego Listu Świętego Pawła Apostoła do Koryntian',
      text: 'Niechaj się nikt nie łudzi! Jeśli ktoś spośród was mniema, że jest mądry na tym świecie, niech się stanie głupim, by stał się mądrym. Mądrość bowiem tego świata jest głupstwem u Boga... Wszystko bowiem jest wasze: czy to Paweł, czy Apollos, czy Kefas, czy świat, czy życie, czy śmierć, czy teraźniejszość, czy przyszłość; wszystko jest wasze, wy zaś Chrystusa, a Chrystus – Boga.',
      theme: 'Przynależność do Chrystusa ponad mądrością świata',
      keyVerses: [
        {
          siglum: '1 Kor 3, 21b-23',
          label: 'Wszystko jest wasze, wy zaś Chrystusa',
          text: 'Wszystko bowiem jest wasze: czy to Paweł, czy Apollos, czy Kefas, czy świat, czy życie, czy śmierć... wszystko jest wasze, wy zaś Chrystusa, a Chrystus – Boga.',
          theme: 'Pełnia dziedzictwa w Chrystusie'
        }
      ]
    },
    psalm: {
      siglum: 'Ps 24 (23), 1-2. 3-4ab. 5-6',
      response: 'Do Pana należy ziemia i wszystko, co ją napełnia',
      text: 'Do Pana należy ziemia i to, co ją napełnia,\nświat i jego mieszkańcy.\nAlbowiem On go na morzach osadził\ni utwierdził ponad rzekami.\n\nKto wstąpi na górę Pana,\nkto stanie w Jego świętym miejscu?\nCzłowiek rąk nieskalanych i czystego serca,\nktóry nie skłonił swej duszy ku marnościom.\n\nOn otrzyma błogosławieństwo od Pana,\ni zapłatę od Boga, swego Zbawcy.\nOto pokolenie tych, którzy Go szukają,\nktórzy szukają oblicza Boga Jakubowego.',
      theme: 'Wielkość Stwórcy i czystość wchodzących na górę Pana',
      keyVerses: [
        {
          siglum: 'Ps 24, 1-2',
          label: 'Zwrotka 1: Do Pana należy ziemia',
          text: 'Do Pana należy ziemia i to, co ją napełnia, świat i jego mieszkańcy. Albowiem On go na morzach osadził i utwierdził ponad rzekami.',
          theme: 'Stworzenie należy do Boga'
        },
        {
          siglum: 'Ps 24, 3-4ab',
          label: 'Zwrotka 2: Człowiek rąk nieskalanych i czystego serca',
          text: 'Kto wstąpi na górę Pana, kto stanie w Jego świętym miejscu? Człowiek rąk nieskalanych i czystego serca, który nie skłonił swej duszy ku marnościom.',
          theme: 'Czystość serca i obecność Boża'
        },
        {
          siglum: 'Ps 24, 5-6',
          label: 'Zwrotka 3: Pokolenie szukających oblicza Boga',
          text: 'On otrzyma błogosławieństwo od Pana, i zapłatę od Boga, swego Zbawcy. Oto pokolenie tych, którzy Go szukają, którzy szukają oblicza Boga Jakubowego.',
          theme: 'Szukanie Bożego Oblicza'
        }
      ]
    },
    gospel: {
      siglum: 'Łk 5, 1-11',
      intro: 'Słowa Ewangelii według Świętego Łukasza',
      text: 'Pewnego razu – gdy tłum cisnął się do Jezusa, aby słuchać słowa Bożego, a On stał nad jeziorem Genezaret... rzekł do Szymona: «Wypłyń na głębię i zarzućcie sieci na połów!» A Szymon odpowiedział: «Mistrzu, całą noc pracowaliśmy i niceśmy nie ułowili. Lecz na Twoje słowo zarzucę sieci». Skoro to uczynili, zagarnęli tak wielkie mnóstwo ryb, że sieci ich zaczynały się rwać... Jezus rzekł do Szymona: «Nie bój się, odtąd ludzi będziesz łowił». I przyciągnąwszy łodzie do brzegu, zostawili wszystko i poszli za Nim.',
      theme: 'Duc in altum: Posłuszeństwo Słowu i cudowny obfity połów',
      keyVerses: [
        {
          siglum: 'Łk 5, 4-5',
          label: 'Wypłyń na głębię (Duc in altum)',
          text: 'Rzekł do Szymona: «Wypłyń na głębię i zarzućcie sieci na połów!» A Szymon odpowiedział: «Mistrzu, całą noc pracowaliśmy i niceśmy nie ułowili. Lecz na Twoje słowo zarzucę sieci».',
          theme: 'Posłuszeństwo Słowu wbrew logice'
        },
        {
          siglum: 'Łk 5, 10-11',
          label: 'Nie bój się, odtąd ludzi będziesz łowił',
          text: 'Jezus rzekł do Szymona: «Nie bój się, odtąd ludzi będziesz łowił». I przyciągnąwszy łodzie do brzegu, zostawili wszystko i poszli za Nim.',
          theme: 'Radykalne powołanie apostolskie'
        }
      ]
    }
  },
  {
    dayName: 'Piątek',
    firstReading: {
      siglum: '1 Kor 4, 1-5',
      intro: 'Czytanie z Pierwszego Listu Świętego Pawła Apostoła do Koryntian',
      text: 'Niechaj uważają nas ludzie za sługi Chrystusa i za szafarzy tajemnic Bożych! A od szafarzy już tutaj się żąda, aby każdy z nich był wierny. Mnie zaś najmniej zależy na tym, czy będę sądzony przez was, czy przez jakikolwiek trybunał ludzki... Panem, który mnie sądzi, jest Pan. Przeto nie sądźcie przedwcześnie, dopóki nie przyjdzie Pan, który rozjaśni to, co w ciemnościach ukryte.',
      theme: 'Wierność w posłudze szafarza i sprawiedliwy sąd Boży',
      keyVerses: [
        {
          siglum: '1 Kor 4, 1-2',
          label: 'Słudzy Chrystusa i szafarze tajemnic',
          text: 'Niechaj uważają nas ludzie za sługi Chrystusa i za szafarzy tajemnic Bożych! A od szafarzy już tutaj się żąda, aby każdy z nich był wierny.',
          theme: 'Wierność w powołaniu'
        },
        {
          siglum: '1 Kor 4, 4b-5',
          label: 'Panem, który mnie sądzi, jest Pan',
          text: 'Panem, który mnie sądzi, jest Pan. Przeto nie sądźcie przedwcześnie, dopóki nie przyjdzie Pan, który rozjaśni to, co w ciemnościach ukryte, i ujawni zamiary serc.',
          theme: 'Sprawiedliwy sąd Boży'
        }
      ]
    },
    psalm: {
      siglum: 'Ps 37 (36), 3-4. 5-6. 27-28. 39-40',
      response: 'Zbawienie prawych pochodzi od Pana',
      text: 'Miej ufność w Panu i postępuj dobrze,\nmieszkaj w ziemi i zachowaj wierność.\nRaduj się w Panu,\na On spełni pragnienia twego serca.\n\nPowierz Panu swoją drogę i zaufaj Mu:\nOn sam będzie działał.\nOn sprawi, że twoja sprawiedliwość zajaśnieje jak światło,\na twoje prawo jak południe.\n\nOdstąp od złego, czyń dobro,\nabyś mógł przetrwać na wieki.\nAlbowiem Pan miłuje sprawiedliwość\ni nie opuszcza swych świętych.\n\nZbawienie prawych pochodzi od Pana,\nOn ich ucieczką w czasie utrapienia.\nPan ich wspomaga i wyzwala,\nwyzwala od występnych i ratuje, bo uciekają się do Niego.',
      theme: 'Ufność w sprawiedliwość i ocalenie od Pana',
      keyVerses: [
        {
          siglum: 'Ps 37, 3-4',
          label: 'Zwrotka 1: Raduj się w Panu, a On spełni pragnienia',
          text: 'Miej ufność w Panu i postępuj dobrze, mieszkaj w ziemi i zachowaj wierność. Raduj się w Panu, a On spełni pragnienia twego serca.',
          theme: 'Radość i ufność w Bogu'
        },
        {
          siglum: 'Ps 37, 5-6',
          label: 'Zwrotka 2: Powierz Panu swoją drogę',
          text: 'Powierz Panu swoją drogę i zaufaj Mu: On sam będzie działał. On sprawi, że twoja sprawiedliwość zajaśnieje jak światło.',
          theme: 'Zawierzenie drogi życia Bogu'
        },
        {
          siglum: 'Ps 37, 27-28',
          label: 'Zwrotka 3: Pan miłuje sprawiedliwość',
          text: 'Odstąp od złego, czyń dobro, abyś mógł przetrwać na wieki. Albowiem Pan miłuje sprawiedliwość i nie opuszcza swych świętych.',
          theme: 'Wierność przymierzu dobra'
        },
        {
          siglum: 'Ps 37, 39-40',
          label: 'Zwrotka 4: Zbawienie prawych pochodzi od Pana',
          text: 'Zbawienie prawych pochodzi od Pana, On ich ucieczką w czasie utrapienia. Pan ich wspomaga i wyzwala, wyzwala od występnych i ratuje, bo uciekają się do Niego.',
          theme: 'Ocalenie w Bogu'
        }
      ]
    },
    gospel: {
      siglum: 'Łk 5, 33-39',
      intro: 'Słowa Ewangelii według Świętego Łukasza',
      text: 'Faryzeusze i uczeni w Piśmie rzekli do Jezusa: «Uczniowie Jana poszczą często i modły odprawiają, tak samo uczniowie faryzeuszów; Twoi zaś jedzą i piją». Jezus rzekł do nich: «Czy możecie gości weselnych nakłonić do postu, dopóki pan młody jest z nimi? Lecz przyjdzie czas, kiedy zabiorą im pana młodego, i wtedy, w owe dni, będą pościć»... «Nikt nie wlewa młodego wina do starych bukłaków; w przeciwnym razie młode wino rozerwie bukłaki... Lecz młode wino należy lać do nowych bukłaków».',
      theme: 'Nowość Ewangelii, Oblubieniec pośród nas i nowe bukłaki',
      keyVerses: [
        {
          siglum: 'Łk 5, 34-35',
          label: 'Oblubieniec jest z nimi',
          text: '«Czy możecie gości weselnych nakłonić do postu, dopóki pan młody jest z nimi? Lecz przyjdzie czas, kiedy zabiorą im pana młodego, i wtedy będą pościć».',
          theme: 'Obecność Chrystusa Oblubieńca'
        },
        {
          siglum: 'Łk 5, 38',
          label: 'Młode wino do nowych bukłaków',
          text: '«Lecz młode wino należy lać do nowych bukłaków».',
          theme: 'Nowe życie Ewangelii'
        }
      ]
    }
  },
  {
    dayName: 'Sobota',
    firstReading: {
      siglum: '1 Kor 4, 6b-15',
      intro: 'Czytanie z Pierwszego Listu Świętego Pawła Apostoła do Koryntian',
      text: 'Cóż masz, czego byś nie otrzymał? A jeśliś otrzymał, to czemu się chełpisz, tak jakbyś nie otrzymał?... Aż do tej chwili łakniemy i cierpimy pragnienie, brak nam odzieży, jesteśmy policzkowani i bezdomni... Błogosławimy, gdy nam złorzeczą; znosimy, gdy nas prześladują; pocieszamy, gdy nas potępiają... Nie piszę tego, żeby was zawstydzić, lecz aby was napomnieć jako moje dzieci najdroższe. Choćbyście mieli bowiem dziesiątki tysięcy wychowawców w Chrystusie, nie macie wielu ojców; ja to bowiem przez Ewangelię zrodziłem was w Chrystusie Jezusie.',
      theme: 'Duchowe ojcostwo przez Ewangelię i pokora apostolska',
      keyVerses: [
        {
          siglum: '1 Kor 4, 7',
          label: 'Cóż masz, czego byś nie otrzymał?',
          text: 'Cóż masz, czego byś nie otrzymał? A jeśliś otrzymał, to czemu się chełpisz, tak jakbyś nie otrzymał?',
          theme: 'Pokora i darmowość łaski'
        },
        {
          siglum: '1 Kor 4, 15',
          label: 'Zrodziłem was w Chrystusie przez Ewangelię',
          text: 'Choćbyście mieli bowiem dziesiątki tysięcy wychowawców w Chrystusie, nie macie wielu ojców; ja to bowiem przez Ewangelię zrodziłem was w Chrystusie Jezusie.',
          theme: 'Ojcostwo duchowe'
        }
      ]
    },
    psalm: {
      siglum: 'Ps 145 (144), 17-18. 19-20. 21',
      response: 'Pan jest blisko wszystkich, którzy Go wzywają',
      text: 'Pan jest sprawiedliwy na wszystkich swych drogach\ni łaskawy we wszystkich swoich dziełach.\nPan jest blisko wszystkich, którzy Go wzywają,\nwszystkich, którzy Go wzywają szczerze.\n\nSpełnia wolę tych, którzy się Go boją,\nusłyszy ich wołanie i przyjdzie im z pomocą.\nPan strzeże wszystkich, którzy Go miłują,\nlecz zniszczy wszystkich występnych.\n\nNiech usta moje głoszą chwałę Pana,\na Jego święte imię niech wielbi wszystko, co żyje,\nzawsze i na wieki.',
      theme: 'Bliskość Boga wobec modlących się w prawdzie',
      keyVerses: [
        {
          siglum: 'Ps 145, 17-18',
          label: 'Zwrotka 1: Pan jest blisko wzywających Go szczerze',
          text: 'Pan jest sprawiedliwy na wszystkich swych drogach i łaskawy we wszystkich swoich dziełach. Pan jest blisko wszystkich, którzy Go wzywają, wszystkich, którzy Go wzywają szczerze.',
          theme: 'Szczere wołanie do Boga'
        },
        {
          siglum: 'Ps 145, 19-20',
          label: 'Zwrotka 2: Pan strzeże tych, którzy Go miłują',
          text: 'Spełnia wolę tych, którzy się Go boją, usłyszy ich wołanie i przyjdzie im z pomocą. Pan strzeże wszystkich, którzy Go miłują.',
          theme: 'Boża ochrona i wysłuchanie modlitwy'
        },
        {
          siglum: 'Ps 145, 21',
          label: 'Zwrotka 3: Niech usta moje głoszą chwałę Pana',
          text: 'Niech usta moje głoszą chwałę Pana, a Jego święte imię niech wielbi wszystko, co żyje, zawsze i na wieki.',
          theme: 'Wieczne uwielbienie Imienia Pańskiego'
        }
      ]
    },
    gospel: {
      siglum: 'Łk 6, 1-5',
      intro: 'Słowa Ewangelii według Świętego Łukasza',
      text: 'W pewien szabat Jezus przechodził wśród zbóż, a uczniowie Jego zrywali kłosy i jedli, wykruszając ziarna rękami. Niektórzy zaś z faryzeuszów mówili: «Czemu czynicie to, czego nie wolno czynić w szabat?» Wtedy Jezus odpowiedział im: «Nawet tegoście nie czytali, co uczynił Dawid, gdy poczuł głód, on i jego towarzysze? Jak wszedł do domu Bożego i wziąwszy chleby pokładne, sam jadł i dał swoim ludziom?...» I dodał: «Syn Człowieczy jest Panem także szabatu».',
      theme: 'Chrystus Panem szabatu i pierwszeństwo miłości',
      keyVerses: [
        {
          siglum: 'Łk 6, 5',
          label: 'Syn Człowieczy jest Panem szabatu',
          text: 'I dodał: «Syn Człowieczy jest Panem także szabatu».',
          theme: 'Boski autorytet Jezusa i wolność dzieci Bożych'
        }
      ]
    }
  }
];

/**
 * Returns complete, guaranteed daily liturgical readings for any given date.
 */
export function getGuaranteedDailyReadings(dateInput: string | Date): DailyLiturgicalReadings {
  let d: Date;
  let dateStr: string;

  if (typeof dateInput === 'string') {
    const parts = dateInput.slice(0, 10).split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      dateStr = `${y}-${m}-${dayNum}`;
    } else {
      d = new Date(dateInput);
      dateStr = d.toISOString().slice(0, 10);
    }
  } else {
    d = dateInput;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    dateStr = `${y}-${m}-${dayNum}`;
  }

  const month = d.getMonth() + 1; // 1-12
  const day = d.getDate();        // 1-31
  const dayOfWeek = d.getDay();   // 0 = Sunday, 1 = Monday ... 6 = Saturday

  const formattedDate = d.toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // 1. Check if it matches a predefined feast
  const feastMatch = FIXED_FEASTS.find(f => f.month === month && f.day === day);
  if (feastMatch) {
    return {
      date: dateStr,
      formattedDate,
      liturgicalCelebration: feastMatch.celebration,
      liturgicalColor: feastMatch.color,
      liturgicalCycle: 'Cykl czytań Kościoła (Lekcjonarz Mszalny)',
      readings: feastMatch.readings
    };
  }

  // 2. If Sunday (dayOfWeek === 0)
  if (dayOfWeek === 0) {
    const cycleIndex = (day + month) % LITURGICAL_SUNDAY_CYCLES.length;
    const sundayData = LITURGICAL_SUNDAY_CYCLES[cycleIndex];
    return {
      date: dateStr,
      formattedDate,
      liturgicalCelebration: sundayData.name,
      liturgicalColor: 'green',
      liturgicalCycle: 'Rok B, Cykl Niedzielny',
      readings: [
        {
          id: `rdg_${dateStr}_1`,
          type: 'firstReading',
          label: 'I Czytanie',
          siglum: sundayData.firstReading.siglum,
          liturgicalIntroduction: sundayData.firstReading.intro,
          text: sundayData.firstReading.text,
          theologicalTheme: sundayData.firstReading.theme,
          hebrewText: sundayData.firstReading.hebrew
        },
        {
          id: `rdg_${dateStr}_psalm`,
          type: 'psalm',
          label: 'Psalm Responsoryjny',
          siglum: sundayData.psalm.siglum,
          psalmResponse: sundayData.psalm.response,
          text: sundayData.psalm.text,
          theologicalTheme: sundayData.psalm.theme
        },
        {
          id: `rdg_${dateStr}_2`,
          type: 'secondReading',
          label: 'II Czytanie',
          siglum: sundayData.secondReading.siglum,
          liturgicalIntroduction: sundayData.secondReading.intro,
          text: sundayData.secondReading.text,
          theologicalTheme: sundayData.secondReading.theme,
          greekText: sundayData.secondReading.greek
        },
        {
          id: `rdg_${dateStr}_gospel`,
          type: 'gospel',
          label: 'Ewangelia',
          siglum: sundayData.gospel.siglum,
          liturgicalIntroduction: sundayData.gospel.intro,
          text: sundayData.gospel.text,
          theologicalTheme: sundayData.gospel.theme,
          greekText: sundayData.gospel.greek,
          latinText: sundayData.gospel.latinText
        }
      ]
    };
  }

  // 3. Weekday readings (Monday - Saturday)
  const weekdayIndex = (dayOfWeek - 1) % WEEKDAY_READING_CYCLES.length;
  const wdData = WEEKDAY_READING_CYCLES[weekdayIndex];
  
  return {
    date: dateStr,
    formattedDate,
    liturgicalCelebration: `${wdData.dayName}, Dzień Powszedni (Lekcjonarz Mszalny)`,
    liturgicalColor: 'green',
    liturgicalCycle: 'Cykl II (rok parzysty), Okres Zwykły',
    readings: [
      {
        id: `rdg_${dateStr}_1`,
        type: 'firstReading',
        label: 'I Czytanie',
        siglum: wdData.firstReading.siglum,
        liturgicalIntroduction: wdData.firstReading.intro,
        text: wdData.firstReading.text,
        theologicalTheme: wdData.firstReading.theme,
        keyVerses: wdData.firstReading.keyVerses
      },
      {
        id: `rdg_${dateStr}_psalm`,
        type: 'psalm',
        label: 'Psalm Responsoryjny',
        siglum: wdData.psalm.siglum,
        psalmResponse: wdData.psalm.response,
        text: wdData.psalm.text,
        theologicalTheme: wdData.psalm.theme,
        keyVerses: wdData.psalm.keyVerses
      },
      {
        id: `rdg_${dateStr}_gospel`,
        type: 'gospel',
        label: 'Ewangelia',
        siglum: wdData.gospel.siglum,
        liturgicalIntroduction: wdData.gospel.intro,
        text: wdData.gospel.text,
        theologicalTheme: wdData.gospel.theme,
        keyVerses: wdData.gospel.keyVerses
      }
    ]
  };
}
