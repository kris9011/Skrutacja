import { BreviaryDayOffice, BreviaryHourData, BreviaryHourType, BreviaryAudience } from '../types';

/**
 * Liturgia Godzin (Brewiarz Rzymski) - Oficjum dla Duchownych oraz Brewiarz dla Świeckich
 * Zgodny z Psałterzem Rzymskim, tradycją Kościoła katolickiego i Pismem Świętym.
 */

export const BREVIARY_OFFICE_SAMPLE: BreviaryDayOffice = {
  date: '2026-09-02',
  formattedDate: 'Środa, 2 września 2026',
  liturgicalCelebration: 'XXII Tydzień Zwykły (Środa) • Psałterz: Tydzień II',
  liturgicalRank: 'Dzień powszedni',
  psalterWeek: 2,
  liturgicalColor: 'green',
  hours: {
    // 1. WEZWANIE (INVITATORIUM)
    invitatorium: {
      id: 'hour_invitatorium',
      hourType: 'invitatorium',
      name: 'Wezwanie',
      latinName: 'Invitatorium',
      recommendedTime: 'Przed pierwszą modlitwą dnia (ok. 05:30 - 06:30)',
      description: 'Uroczyste otwarcie dnia modlitwy i wsłuchanie się w głos Pana.',
      invocations: {
        verse: 'K. Panie, otwórz wargi moje.',
        response: 'W. A usta moje będą głosić Twoją chwałę.'
      },
      hymn: {
        title: 'Antyfona na wezwanie',
        latinTitle: 'Venite, adoremus Dominum',
        strophes: [
          'Antyfona: Wielbijmy Pana, Boga naszego, * Albowiem wielkie jest Jego miłosierdzie nad nami.'
        ]
      },
      psalmody: [
        {
          id: 'inv_ps_95',
          siglum: 'Ps 95 (94)',
          title: 'Wezwanie do chwalenia Boga',
          latinTitle: 'Venite, exsultemus Domino',
          antiphon: 'Wielbijmy Pana, Boga naszego, albowiem wielkie jest Jego miłosierdzie.',
          commentary: 'Psalm 95 jest tradycyjnym zaproszeniem do wejścia w Bożą obecność i do niez zatwardzania serca na Jego głos.',
          christologicalKey: 'Chrystus jest Dobrym Pasterzem, który wzywa swój lud, by wsłuchał się w Jego głos i wszedł do wiecznego odpoczynku Ojca (por. Hbr 3, 7-15).',
          gregorianTone: 'Ton IV',
          text: `Przyjdźcie, radośnie śpiewajmy Panu, *
wznośmy okrzyki ku chwale Skały naszego zbawienia.
Stańmy przed obliczem Jego z dziękczynieniem, *
z weselem śpiewajmy Mu pieśni.

Bo Pan jest Bogiem wielkim, *
wielkim Królem nad wszystkimi bogami.
W Jego ręku są głębokości ziemi, *
Jego są szczyty gór.
Jego jest morze, bo On sam je stworzył, *
i ziemia, którą ulepiły Jego ręce.

Przyjdźcie, padnijmy na twarz i uwielbiajmy, *
zegnijmy kolana przed Panem, który nas stworzył.
Albowiem On jest naszym Bogiem, *
a my ludem Jego pastwiska i owcami w Jego ręku.

Obyście dzisiaj usłyszeli głos Jego: *
«Niech nie twardnieją wasze serca jak w Meriba,
jak w dniu Massa na pustyni, *
gdzie Mnie kusili wasi ojcowie,
doświadczali Mnie, choć widzieli moje dzieła.

Przez lat czterdzieści to pokolenie wstręt we Mnie budziło *
i powiedziałem: Jest to lud o sercu zbłąkanym
i nie poznali moich dróg. *
Przeto przysiągłem w moim gniewie:
Nie wejdą do mojego odpoczynku».`,
          gloryBe: true
        }
      ],
      scriptureReading: {
        siglum: 'Ps 95, 7-8',
        intro: 'Słowo wezwania',
        text: 'Obyście dzisiaj usłyszeli głos Jego: Nie zatwardzajcie serc waszych.',
        response: {
          verse: 'K. Słuchajmy głosu Pana.',
          response: 'W. I idźmy Jego ścieżkami.'
        }
      },
      ourFather: false,
      closingPrayer: 'Boże, który wzywasz nas o świcie, abyśmy rozpoczęli ten dzień w Twojej obecności, spraw, aby nasze serca nie zatwardziały na Twoje Słowo, lecz przyniosły owoc świętości. Przez Chrystusa, Pana naszego. Amen.',
      rubrics: [
        'Wezwanie odmawia się jako pierwszą modlitwę dnia przed Jutrznią lub Godziną Czytań.',
        'Wypowiada się czyniąc znak krzyża na wargach.'
      ]
    },

    // 2. GODZINA CZYTAŃ (OFFICIUM LECTIONIS)
    lectionis: {
      id: 'hour_lectionis',
      hourType: 'lectionis',
      name: 'Godzina Czytań',
      latinName: 'Officium Lectionis',
      recommendedTime: 'Noc lub wczesny poranek (dowolna pora skupienia)',
      description: 'Głęboka medytacja Słowa Bożego połączona z lekturą pism Ojców Kościoła i Tradycji.',
      invocations: {
        verse: 'K. Boże, wejrzyj ku wspomożeniu memu.',
        response: 'W. Panie, pośpiesz ku ratunkowi memu. Chwała Ojcu i Synowi, i Duchowi Świętemu, jak była na początku, teraz i zawsze, i na wieki wieków. Amen. Alleluja.'
      },
      hymn: {
        title: 'Światłości wieczna, Chryste Panie',
        latinTitle: 'Aeterne rerum Conditor',
        strophes: [
          'Światłości wieczna, Chryste Panie, * Przedwieczny Stwórco wszystkich rzeczy, * Ty rozkazujesz nocy mrokom * Ustąpić blaskom dnia jasnego.',
          'Gdy dzień rozświetla mroki ziemi, * Spraw, byśmy wolni od ciemności, * Chwalili Ciebie czystym sercem * I pełnili Twą wolę świętą.',
          'Niech chwała będzie Bogu Ojcu, * Synowi, który zmartwychpowstał, * I Duchowi Pocieszycielowi * Po wszystkie wieki wieków. Amen.'
        ]
      },
      psalmody: [
        {
          id: 'lec_ps_39',
          siglum: 'Ps 39 (38), 2-7. 13-14',
          title: 'Modlitwa człowieka cierpiącego i znikomego',
          latinTitle: 'Dixi: Custodiam vias meas',
          antiphon: 'Wysłuchaj, Panie, modlitwy mojej i nie bądź obojętny na moje łzy.',
          text: `Rzekłem: «Będę pilnował dróg moich, *
abym nie zgrzeszył językiem;
nałożę na usta wędzidło, *
dopóki bezbożny jest przy mnie».

Milczałem w zupełnym uciszeniu, *
nie zaznałem dobra, a boleść moja się wzmogła.
Rozpaliło się serce we mnie, *
w mym rozmyślaniu zapłonął ogień,
i zacząłem mówić językiem: *
«Panie, daj mi poznać mój kres
i jaka jest miara dni moich, *
abym wiedział, jak jestem znikomy».

Oto wymierzyłeś dni moje tylko na kilka piędzi, *
a życie moje jak nicość przed Tobą;
zaiste, każdy człowiek jest tylko tchnieniem! *
Człowiek przemija jak cień znikomy,
na próżno się miota i gromadzi skarby, *
a nie wie, kto je zbierze.

Wysłuchaj, Panie, mojej modlitwy, *
nakłoń ucha na moje wołanie,
nie bądź obojętny na moje łzy, *
bo jestem gościem u Ciebie, przechodniem jak wszyscy moi przodkowie.`,
          gloryBe: true
        }
      ],
      scriptureReading: {
        siglum: 'Hbr 12, 1-11',
        intro: 'Z Listu do Hebrajczyków: Bieg w zawodach wiary i ojcowska karność Boga',
        text: 'Mając dokoła siebie tak wielką chmurę świadków, odłożywszy wszelki ciężar, a przede wszystkim grzech, który nas tak łatwo zwodzi, biegnijmy wytrwale w wyznaczonych nam zawodach. Patrzmy na Jezusa, który nam w wierze przewodzi i ją wydoskonala. On to zamiast radości, którą Mu obiecywano, przecierpiał krzyż, nie bacząc na jego hańbę, i zasiadł po prawicy tronu Boga. Zważcie więc na Tego, który ze strony grzeszników tak wielki opór przeciw sobie zniósł, abyście nie ustawali, zwątpiwszy w duchu.',
        response: {
          verse: 'K. Patrzmy na Jezusa, Dawcę i Doskonaliciela naszej wiary.',
          response: 'W. On zamiast radości przecierpiał krzyż i zasiadł po prawicy Ojca.'
        }
      },
      patristicReading: {
        author: 'Św. Jan Chryzostom, Biskup i Doktor Kościoła',
        source: 'Homilia do Listu do Hebrajczyków (Hom. 28, 1-2)',
        title: 'Chrystus nagrodą i celem naszych zawodów',
        text: '«Biegnijmy wytrwale w wyznaczonych nam zawodach». Kiedy biegacz wkracza na stadion, nie patrzy na widzów, nie rozgląda się za oklaskami, ani nie zważa na zmęczenie, lecz wpatruje się wyłącznie w sędziego zawodów i w nagrodę, która na niego czeka. Tak i my – mówi Apostoł – nie patrzmy na to, co trudne na tym świecie, ale skierujmy nasz wzrok na Jezusa. On sam przeszedł przed nami tę drogę i zwyciężył śmierć, abyśmy wiedzieli, że żaden nasz trud nie jest daremny w Panu. Gdy dopada cię pokusa zniecierpliwienia, pomyśl o tym, ile Chrystus wycierpiał z miłości do ciebie.',
        response: {
          verse: 'K. Nie lękajcie się, Jam zwyciężył świat.',
          response: 'W. Bądź wierny aż do śmierci, a dam ci wieniec życia.'
        }
      },
      ourFather: false,
      closingPrayer: 'Wszechmogący Boże, Ty przez cierpienie i zmartwychwstanie Twojego Syna otworzyłeś nam bramy wieczności; daj nam tak wpatrywać się w Jego chwalebne Oblicze, abyśmy nigdy nie ustali w biegu wiary. Przez Chrystusa, Pana naszego. Amen.',
      rubrics: [
        'Po II czytaniu i responsorium, w niedziele i uroczystości poza Wielkim Postem, odmawia się uroczyście hymn Te Deum (Ciebie, Boga, wysławiamy).'
      ]
    },

    // 3. JUTRZNIA (LAUDES) - Modlitwa Poranna
    laudes: {
      id: 'hour_laudes',
      hourType: 'laudes',
      name: 'Jutrznia',
      latinName: 'Laudes',
      recommendedTime: 'Poranek (ok. 06:00 - 08:30)',
      description: 'Główna modlitwa poranna Kościoła, uświęcająca początek dnia i zmartwychwstanie Chrystusa.',
      invocations: {
        verse: 'K. Boże, wejrzyj ku wspomożeniu memu.',
        response: 'W. Panie, pośpiesz ku ratunkowi memu. Chwała Ojcu i Synowi, i Duchowi Świętemu, jak była na początku, teraz i zawsze, i na wieki wieków. Amen. Alleluja.'
      },
      hymn: {
        title: 'Oto dzień wstaje jasny i wspaniały',
        latinTitle: 'Splendor paternae gloriae',
        strophes: [
          'Oto dzień wstaje jasny i wspaniały, * Ustępują cienie nocy, * Niechaj serca nasze pieśnią dziękczynienia * Boga Ojca sławią.',
          'Chryste, Tyś jest Światłem z niestworzonej światłości, * Słońcem prawdy i sprawiedliwości, * Rozprosz mroki grzechu w naszych duszach, * Napełnij nas Duchem Świętym.',
          'Bogu Ojcu i Synowi Jednorosłemu, * Wraz z Duchem Pocieszycielem, * Niechaj będzie wieczna cześć i uwielbienie * Teraz i na wieki. Amen.'
        ]
      },
      psalmody: [
        {
          id: 'lau_ps_63',
          siglum: 'Ps 63 (62), 2-9',
          title: 'Dusza spragniona Boga o świcie',
          latinTitle: 'Deus, Deus meus, ad te de luce vigilo',
          antiphon: 'Boże mój, Ciebie szukam od świtu, * Ciebie pragnie moja dusza.',
          commentary: 'Psalm mistycznej miłości i tęsknoty za Bogiem o brzasku dnia.',
          christologicalKey: 'Chrystus o świcie w zmartwychwstaniu gasi pragnienie ludzkości i otwiera źródła wody żywej Ducha Świętego (J 7, 37-39).',
          gregorianTone: 'Ton II',
          text: `Boże, mój Boże, szukam Ciebie od świtu, *
Ciebie pragnie moja dusza,
za Tobą tęskni moje ciało, *
jak ziemia zeschła, spragniona, bez wody.

Oto wpatruję się w Ciebie w świątyni, *
by ujrzeć Twą potęgę i chwałę.
Twoja łaska jest cenniejsza od życia, *
więc sławić Cię będą moje usta.

Będę Cię błogosławił przez całe me życie *
i wzniosę ręce w imię Twoje.
Moja dusza nasyci się jak tłuszczem i obfitością, *
a usta moje będą Cię chwalić radosnymi wargami,

gdy wspomnę na Ciebie na moim posłaniu *
i o Tobie rozmyślać będę w czasie straży nocnych.
Bo stałeś się dla mnie pomocą *
i w cieniu Twych skrzydeł wołam radośnie.
Moja dusza przylgnęła do Ciebie, *
a Twoja prawica mnie podtrzymuje.`,
          gloryBe: true
        },
        {
          id: 'lau_cant_dan',
          siglum: 'Dn 3, 57-88. 56',
          title: 'Pieśń Trzech Młodzieńców: Uwielbienie stworzenia',
          latinTitle: 'Benedicite, omnia opera Domini, Domino',
          antiphon: 'Błogosławcie Pana, wszystkie dzieła Pańskie, * Chwalcie Go i wywyższajcie na wieki.',
          category: 'canticle_st',
          christologicalKey: 'Młodzieńcy w piecu ognistym są figurą Chrystusa schodzącego do piekieł i uwalniającego całe stworzenie z więzów zepsucia.',
          gregorianTone: 'Ton VIII G',
          text: `Błogosławcie Pana, wszystkie dzieła Pańskie, *
chwalcie Go i wywyższajcie na wieki!
Błogosławcie Pana, aniołowie Pańscy, *
błogosławcie Pana, niebiosa!

Błogosławcie Pana, wszelkie wody pod niebiosami, *
błogosławcie Pana, wszystkie potęgi!
Błogosławcie Pana, słońce i księżycu, *
błogosławcie Pana, gwiazdy na niebie!

Błogosławcie Pana, deszcze i rosy, *
błogosławcie Pana, wszystkie wichry!
Błogosławcie Pana, ogniu i żarze, *
błogosławcie Pana, chłodzie i upale!

Błogosławcie Pana, góry i pagórki, *
błogosławcie Pana, wszystkie rośliny rosnące na ziemi!
Błogosławcie Pana, kapłani Pańscy, *
błogosławcie Pana, słudzy Pańscy!
Błogosławcie Ojca i Syna z Duchem Świętym, *
chwalmy Go i wywyższajmy na wieki!`,
          gloryBe: false
        },
        {
          id: 'lau_ps_149',
          siglum: 'Ps 149, 1-6a. 9b',
          title: 'Śpiewajcie Panu pieśń nową',
          latinTitle: 'Cantate Domino canticum novum',
          antiphon: 'Niech święci cieszą się w chwale, * Niechaj weselą się na swych łożach.',
          christologicalKey: 'Pieśń nowa to pieśń odkupionych krwią Baranka, świętujących ostateczne zwycięstwo nad grzechem i śmiercią (Ap 14, 3).',
          gregorianTone: 'Ton VII',
          text: `Śpiewajcie Panu pieśń nową, *
głoście Jego chwałę w zgromadzeniu świętych!
Niech Izrael się cieszy swoim Stwórcą, *
a synowie Syjonu radują swoim Królem!

Niech chwalą Jego imię tańcem, *
niech grają Mu na bębnie i cytrze!
Bo Pan upodobał sobie swój lud, *
pokornych ozdabia zbawieniem.

Niech święci radują się w chwale, *
niech się weselą na swych łożach!
Chwała Boża niech będzie na ich ustach, *
taka jest chwała wszystkich Jego świętych!`,
          gloryBe: true
        }
      ],
      scriptureReading: {
        siglum: 'Rz 13, 11-13',
        intro: 'Słowo Boże z Listu św. Pawła do Rzymian',
        text: 'Rozumiejcie chwilę obecną: teraz nadeszła dla was godzina powstania ze snu. Teraz bowiem zbawienie jest bliżej nas, niż wtedy, gdyśmy uwierzyli. Noc się posunęła, a przybliżył się dzień. Odrzućmy więc uczynki ciemności, a przywdziejmy zbroję światła.',
        response: {
          verse: 'K. O świcie napełnij nas swoim miłosierdziem, Panie.',
          response: 'W. Abyśmy się radowali i cieszyli przez wszystkie dni nasze.'
        }
      },
      evangelicalCanticle: {
        name: 'Pieśń Zachariasza (Benedictus)',
        siglum: 'Łk 1, 68-79',
        latinIncipit: 'Benedictus Dominus Deus Israel',
        antiphon: 'Dzięki serdecznej litości naszego Boga nawiedzi nas Wschodzące Słońce z wysoka.',
        text: `Błogosławiony Pan, Bóg Izraela, *
bo lud swój nawiedził i wyzwolił.
I wzbudził dla nas moc zbawczą *
w domu swego sługi Dawida,

jak zapowiedział od dawna *
przez usta swych świętych proroków:
że nas wybawi od naszych nieprzyjaciół *
i z ręki wszystkich, którzy nas nienawidzą;

że okaże miłosierdzie naszym ojcom *
i wspomni na swoje święte przymierze,
na przysięgę, którą złożył *
ojcu naszemu Abrahamowi.

Da nam, że z mocy nieprzyjaciół wyrwani, *
służyć Mu będziemy bez trwogi,
w pobożności i sprawiedliwości przed Nim *
po wszystkie dni nasze.

A ty, dziecię, prorokiem Najwyższego zwać się będziesz, *
bo pójdziesz przed Panem torować Mu drogi;
Jego ludowi dasz poznać zbawienie *
przez odpuszczenie grzechów,

dzięki serdecznej litości Boga naszego, *
z jaką nawiedzi nas z wysoka Wschodzące Słońce,
by oświecić tych, co w mroku i cieniu śmierci mieszkają, *
aby nasze kroki skierować na drogę pokoju.`
      },
      intercessions: {
        call: 'Z wiarą i ufnością zanośmy nasze błagania do Chrystusa, który o świcie zmartwychwstał i oświeca każdy nasz krok:',
        intentions: [
          {
            intention: 'Chryste, Światłości ze Światłości, oświeć dzisiaj nasze serca i myśli,',
            response: 'W. Abyśmy postępowali jak dzieci światłości.'
          },
          {
            intention: 'Uświęć naszą pracę, nasze rodziny i relacje z bliźnimi,',
            response: 'W. Niech wszystko, co czynimy, przynosi chwałę Twojemu imieniu.'
          },
          {
            intention: 'Wejrzyj na ubogich, samotnych, chorych i udręczonych wątpliwościami,',
            response: 'W. Bądź dla nich pocieszeniem i źródłem żywej nadziei.'
          },
          {
            intention: 'Obdarz Twój Kościół i cały świat pokojem oraz jednością w Duchu Świętym,',
            response: 'W. Zachowaj nas w miłości i wierności Twojemu Słowu.'
          }
        ]
      },
      ourFather: true,
      closingPrayer: 'Boże, Ojcze wszechmogący, Ty sprawiłeś, że dotarliśmy do początku tego dnia; zachowaj nas dzisiaj swoją potęgą, abyśmy nie ulegli żadnemu grzechowi, lecz by wszystkie nasze myśli, słowa i czyny zmierzały ku wypełnieniu Twojej świętej woli. Przez naszego Pana Jezusa Chrystusa, Twojego Syna, który z Tobą żyje i króluje w jedności Ducha Świętego, Bóg, przez wszystkie wieki wieków. Amen.',
      rubrics: [
        'Jutrznię odprawia się stojąc.',
        'Przed rozpoczęciem pieśni Benedictus czyni się na sobie znak krzyża.'
      ]
    },

    // 4. MODLITWA W CIĄGU DNIA (DAYTIME / TERCJA / SEKSTA / NONA)
    daytime: {
      id: 'hour_daytime',
      hourType: 'daytime',
      name: 'Modlitwa w ciągu dnia',
      latinName: 'Media Dies (Tertia / Sexta / Nona)',
      recommendedTime: 'W południe lub w przerwie pracy (ok. 12:00 - 15:00)',
      description: 'Chwila zatrzymania w zgiełku codziennych obowiązków, powierzenie owoców pracy Bogu.',
      invocations: {
        verse: 'K. Boże, wejrzyj ku wspomożeniu memu.',
        response: 'W. Panie, pośpiesz ku ratunkowi memu. Chwała Ojcu i Synowi, i Duchowi Świętemu. Amen. Alleluja.'
      },
      hymn: {
        title: 'Potężny Władco, wierny Boże',
        latinTitle: 'Rector potens, verax Deus',
        strophes: [
          'Potężny Władco, wierny Boże, * Ty rządzisz zmiennym biegiem świata, * Dajesz porankom blask promieni, * A południowi żar płomienny.',
          'Ugaś zarzewie waśni złośliwych, * Zgaś ogień zgubnych namiętności, * Ciałom daruj zdrowie i siłę, * A serca napełnij pokojem.',
          'Spraw to, litościwy Ojcze, * Wraz z Synem, Twoim Zbawicielem, * W jedności z Duchem Pocieszycielem, * Królującym po wszystkie wieki. Amen.'
        ]
      },
      psalmody: [
        {
          id: 'day_ps_121',
          siglum: 'Ps 121 (120)',
          title: 'Pan stróżem swego ludu',
          latinTitle: 'Levavi oculos meos in montes',
          antiphon: 'Pan cię strzeże od wszelkiego zła, * Pan czuwa nad twoją duszą.',
          commentary: 'Psalm pielgrzymi wyrażający całkowite zaufanie Bożej Opatrzności pośród trudów dnia.',
          text: `Wznoszę swe oczy ku górom: *
skąd nadejść ma dla mnie pomoc?
Pomoc moja od Pana, *
który stworzył niebo i ziemię.

Nie pozwoli, by potknęła się twa noga, *
ani się nie zdrzemnie Ten, który cię strzeże.
Oto nie zdrzemnie się ani nie zaśnie *
Ten, który czuwa nad Izraelem.

Pan cię strzeże, Pan jest twoim cieniem *
przy twoim prawym boku.
Za dnia nie porazi cię słońce, *
ani księżyc wśród nocy.

Pan cię ustrzeże od wszelkiego zła, *
On ustrzeże twoją duszę.
Pan będzie strzegł twego wyjścia i przyjścia *
teraz i po wszystkie wieki.`,
          gloryBe: true
        },
        {
          id: 'day_ps_126',
          siglum: 'Ps 126 (125)',
          title: 'Radość i nadzieja wygnańców',
          latinTitle: 'In convertendo Dominus captivitatem Sion',
          antiphon: 'Kto we łzach sieje, * Zbierać będzie w radości.',
          text: `Gdy Pan odmienił los Syjonu, *
byliśmy jak we śnie.
Wtedy usta nasze napełniły się śmiechem, *
a język nasz wołaniem radości.

Wtedy mówiono wśród narodów: *
«Wielkie rzeczy Pan uczynił dla nich!»
Wielkie rzeczy uczynił nam Pan, *
staliśmy się radośni.

Odmień znowu nasz los, o Panie, *
jak odmieniasz strumienie na Południu.
Ci, którzy we łzach sieją, *
żąć będą z radością.

Idą i płaczą, niosąc ziarno na zasiew, *
lecz powrócą z weselem, niosąc swoje snopy.`,
          gloryBe: true
        }
      ],
      scriptureReading: {
        siglum: 'Ga 6, 2',
        intro: 'Krótkie czytanie',
        text: 'Jeden drugiego brzemiona noście i tak wypełniajcie prawo Chrystusowe.',
        response: {
          verse: 'K. Pan jest moim pasterzem, niczego mi nie braknie.',
          response: 'W. Pozwala mi leżeć na zielonych pastwiskach.'
        }
      },
      ourFather: false,
      closingPrayer: 'Panie Jezu Chryste, Ty w południe wstąpiłeś na krzyż, aby przez swoją śmierć wyrwać świat z niewoli grzechu; udziel nam łaski, abyśmy w naszej codziennej pracy i obowiązkach wiernie naśladowali Twoją ofiarną miłość. Który żyjesz i królujesz na wieki wieków. Amen.',
      rubrics: [
        'Modlitwę w ciągu dnia można odmówić w dowolnym momencie pomiędzy godz. 11:00 a 16:00.'
      ]
    },

    // 5. TERCJA (Dla duchownych - Przedpołudniowa)
    tercia: {
      id: 'hour_tercia',
      hourType: 'tercia',
      name: 'Tercja (Przedpołudniowa)',
      latinName: 'Tertia (Hora Tertia - 9:00)',
      recommendedTime: 'Ok. godz. 09:00',
      description: 'Pamiątka zstąpienia Ducha Świętego na Apostołów.',
      invocations: {
        verse: 'K. Boże, wejrzyj ku wspomożeniu memu.',
        response: 'W. Panie, pośpiesz ku ratunkowi memu.'
      },
      hymn: {
        title: 'Duchu Święty, Boże litościwy',
        latinTitle: 'Nunc, Sancte, nobis, Spiritus',
        strophes: [
          'Duchu Święty, Boże litościwy, * Zstąp w nasze serca z darem łaski, * Rozpal w nas ogień miłości Bożej, * I prowadź drogą prawdy.',
          'Niech usta, serce i całe życie * Głosi chwałę Twojej świętości, * Niech miłość nasza nigdy nie gaśnie, * Lecz rośnie każdego dnia. Amen.'
        ]
      },
      psalmody: [
        {
          id: 'ter_ps_119',
          siglum: 'Ps 119 (118), 33-40',
          title: 'Umiłowanie Prawa Bożego',
          antiphon: 'Prowadź mnie ścieżką Twoich przykazań, * Bo w nich mam upodobanie.',
          text: `Naucz mnie, Panie, drogi Twoich ustaw, *
bym ich strzegł aż do końca.
Ucz mnie, bym przestrzegał Twojego Prawa *
i całym sercem go zachowywał.

Prowadź mnie ścieżką Twoich przykazań, *
bo w nich mam upodobanie.
Nakłoń me serce do Twoich upomnień, *
a nie do zysku niegodziwego!

Odwróć me oczy, niech na próżność nie patrzą, *
przez drogę Twoją daj mi życie!
Wypełnij dla sługi Twego swą obietnicę, *
daną tym, co się Ciebie boją.`,
          gloryBe: true
        }
      ],
      scriptureReading: {
        siglum: '1 J 4, 16',
        intro: 'Słowo Boże',
        text: 'Bóg jest miłością: kto trwa w miłości, trwa w Bogu, a Bóg trwa w nim.',
        response: {
          verse: 'K. Bóg jest moją opoką i zbawieniem.',
          response: 'W. Moim schronieniem, nie zachwieję się.'
        }
      },
      ourFather: false,
      closingPrayer: 'Boże, który zesłałeś Ducha Świętego na Apostołów zgromadzonych na modlitwie, udziel i nam tego samego Ducha, abyśmy w świecie dawali odważne świadectwo Twojej prawdzie. Przez Chrystusa, Pana naszego. Amen.',
      rubrics: ['Oficjum chórowe dla kapłanów i zakonów.']
    },

    // 6. SEKSTA (Dla duchownych - Południowa)
    sexta: {
      id: 'hour_sexta',
      hourType: 'sexta',
      name: 'Seksta (Południowa)',
      latinName: 'Sexta (Hora Sexta - 12:00)',
      recommendedTime: 'Godz. 12:00',
      description: 'Pamiątka ukrzyżowania Pana Jezusa i Jego modlitwy za świat.',
      invocations: {
        verse: 'K. Boże, wejrzyj ku wspomożeniu memu.',
        response: 'W. Panie, pośpiesz ku ratunkowi memu.'
      },
      hymn: {
        title: 'O Władco wielki, wierny Boże',
        latinTitle: 'Rector potens, verax Deus',
        strophes: [
          'Ty w południe dałeś światu słońce, * A na krzyżu rozpiąłeś ramiona, * Aby przygarnąć do swego Serca * Wszystkich ludzi spragnionych zbawienia. Amen.'
        ]
      },
      psalmody: [
        {
          id: 'sex_ps_123',
          siglum: 'Ps 123 (122)',
          title: 'Oczy sług zwrócone na Pana',
          antiphon: 'Zmiłuj się nad nami, Panie, * Zmiłuj się nad nami.',
          text: `Do Ciebie wznoszę me oczy, *
który mieszkasz w niebiosach.
Oto jak oczy sług są zwrócone na ręce ich panów, *
jak oczy służącej na ręce jej pani,

tak oczy nasze są zwrócone na Pana, Boga naszego, *
dopóki nie zmiłuje się nad nami.
Zmiłuj się nad nami, Panie, zmiłuj się nad nami, *
bo mamy już dosyć pogardy!`,
          gloryBe: true
        }
      ],
      scriptureReading: {
        siglum: '1 P 2, 24',
        intro: 'Słowo Boże',
        text: 'On sam w swoim ciele poniósł nasze grzechy na drzewo, abyśmy przestali być niewolnikami grzechu, a żyli dla sprawiedliwości; Krwią Jego ran zostaliście uzdrowieni.',
        response: {
          verse: 'K. Wielbimy Cię, Chryste, i błogosławimy Ciebie.',
          response: 'W. Bo przez krzyż swój święty odkupiłeś świat.'
        }
      },
      ourFather: false,
      closingPrayer: 'Panie, który przez krzyż i zmartwychwstanie odkupiłeś ludzkość, spraw, abyśmy każdego dnia nosili w sobie umieranie Jezusa, by i Jego życie objawiało się w nas. Przez Chrystusa, Pana naszego. Amen.',
      rubrics: ['Oficjum chórowe dla duchowieństwa.']
    },

    // 7. NONA (Dla duchownych - Popołudniowa)
    nona: {
      id: 'hour_nona',
      hourType: 'nona',
      name: 'Nona (Popołudniowa)',
      latinName: 'Nona (Hora Nona - 15:00)',
      recommendedTime: 'Godz. 15:00 (Godzina Miłosierdzia)',
      description: 'Pamiątka konania i śmierci Chrystusa na Golgocie.',
      invocations: {
        verse: 'K. Boże, wejrzyj ku wspomożeniu memu.',
        response: 'W. Panie, pośpiesz ku ratunkowi memu.'
      },
      hymn: {
        title: 'Niezmienny Boże, trwały Fundamencie',
        latinTitle: 'Rerum, Deus, tenax vigor',
        strophes: [
          'Niezmienny Boże, Twórco czasu, * Dzień chyli się ku zachodowi, * Udziel nam łaski wiecznego światła, * Gdy nasze ziemskie życie dobiegnie kresu. Amen.'
        ]
      },
      psalmody: [
        {
          id: 'non_ps_125',
          siglum: 'Ps 125 (124)',
          title: 'Niezachwiana opieka Boga',
          antiphon: 'Pan otacza swój lud opieką * Teraz i na wieki.',
          text: `Ci, którzy Panu ufają, są jak góra Syjon, *
co się nie chwieje, lecz trwa na wieki.
Jak góry otaczają Jeruzalem, *
tak Pan otacza swój lud, teraz i na wieki.

Nie spocznie berło bezbożnych *
nad losem sprawiedliwych,
aby sprawiedliwi nie wyciągali *
rąk swoich do nieprawości.
Uczyń dobrze, Panie, dobrym *
i ludziom prawego serca!`,
          gloryBe: true
        }
      ],
      scriptureReading: {
        siglum: '1 Kor 6, 20',
        intro: 'Słowo Boże',
        text: 'Zostaliście bowiem za wielką cenę wykupieni. Chwalcie więc Boga w waszym ciele!',
        response: {
          verse: 'K. Odkupiłeś nas, Panie, krwią swoją.',
          response: 'W. Z każdego pokolenia, języka, ludu i narodu.'
        }
      },
      ourFather: false,
      closingPrayer: 'Boże, którego Syn o godzinie dziewiątej skłonił głowę i oddał ducha w ręce Ojca, wejrzyj łaskawie na naszą ułomność i spraw, abyśmy zjednoczeni z Jego śmiercią mieli udział w chwale zmartwychwstania. Przez Chrystusa, Pana naszego. Amen.',
      rubrics: ['Oficjum chórowe dla duchowieństwa.']
    },

    // 8. NIESZPORY (VESPERAE) - Modlitwa Wieczorna
    vesperae: {
      id: 'hour_vesperae',
      hourType: 'vesperae',
      name: 'Nieszpory',
      latinName: 'Vesperae',
      recommendedTime: 'Wieczór (ok. 17:30 - 20:00)',
      description: 'Uroczysta modlitwa dziękczynna na zakończenie dnia, pamiątka Ostatniej Wieczerzy i Ofiary Krzyża.',
      invocations: {
        verse: 'K. Boże, wejrzyj ku wspomożeniu memu.',
        response: 'W. Panie, pośpiesz ku ratunkowi memu. Chwała Ojcu i Synowi, i Duchowi Świętemu, jak była na początku, teraz i zawsze, i na wieki wieków. Amen. Alleluja.'
      },
      hymn: {
        title: 'O Światło radosne chwały Ojca',
        latinTitle: 'Lucis Creator optime / Phos Hilaron',
        strophes: [
          'O Światłości przedwieczna Boga Ojca, * Chryste Jezu, Zbawicielu świata! * Gdy słońce chyli się ku zachodowi, * Śpiewamy pieśń wdzięcznego dziękczynienia.',
          'Wielbimy Cię, Ojcze wszechmogący, * Synu Boży i Duchu Święty, * Godzien jesteś o każdej porze, * By czyste głosy głosiły Twoją chwałę.',
          'Ty dajesz życie całemu światu, * Przeto cała ziemia Cię wysławia, * Niech nasza wieczorna modlitwa * Wzniesie się przed Tobą jak woń kadzidła. Amen.'
        ]
      },
      psalmody: [
        {
          id: 'ves_ps_130',
          siglum: 'Ps 130 (129)',
          title: 'De profundis: Z głębokości wołam do Ciebie',
          latinTitle: 'De profundis clamavi ad te, Domine',
          antiphon: 'U Pana jest zmiłowanie * I obfite u Niego odkupienie.',
          commentary: 'Jeden z najgłębszych psalmów pokutnych, prośba o przebaczenie win i zaufanie Bożej litości.',
          christologicalKey: 'Chrystus na krzyżu woła z otchłani opuszczenia w imieniu całej grzesznej ludzkości, wyjednując odkupienie Krwią Przymierza.',
          gregorianTone: 'Ton II',
          text: `Z głębokości wołam do Ciebie, Panie, *
Panie, wysłuchaj głosu mego!
Nakłoń swoje uszy *
na głos mojego błagania!

Jeśli zachowasz pamięć o grzechach, Panie, *
Panie, któż się ostoi?
Ale u Ciebie jest odpuszczenie, *
aby Ci ze czcią służono.

Pokładam nadzieję w Panu, †
dusza moja ufa Jego słowu, *
dusza moja oczekuje Pana
bardziej niż strażnicy poranka. *
Bardziej niż strażnicy poranka niech Izrael wygląda Pana!

Bo u Pana jest miłosierdzie *
i obfite u Niego odkupienie.
On odkupi Izraela *
ze wszystkich jego grzechów.`,
          gloryBe: true
        },
        {
          id: 'ves_ps_138',
          siglum: 'Ps 138 (137)',
          title: 'Hymn dziękczynienia za ocalenie',
          latinTitle: 'Confitebor tibi, Domine, in toto corde meo',
          antiphon: 'Będę Cię sławił z całego serca, Panie, * Bo usłyszałeś słowa ust moich.',
          christologicalKey: 'Dziękczynienie Chrystusa i Kościoła za zwycięstwo nad wrogami zbawienia i wysłuchanie modlitwy w Wieczerniku.',
          gregorianTone: 'Ton V',
          text: `Będę Cię sławił z całego serca, Panie, *
bo usłyszałeś słowa ust moich.
Będę śpiewał Ci wobec aniołów, *
pokłon oddam Twojemu świętemu przybytkowi.

I będę sławił Twe imię †
za Twoją łaskę i wierność, *
bo ponad wszystko wywyższyłeś Twoje imię i obietnicę.
W dniu, w którym wołałem, wysłuchałeś mnie, *
pomnożyłeś siłę mej duszy.

Będą Cię sławić, Panie, wszyscy królowie ziemi, *
gdy usłyszą słowa Twoich ust;
i będą opiewać drogi Pańskie: *
«Zaiste, wielka jest chwała Pana!»
Praworządny jest Pan, a na pokornego spogląda, *
wyniosłego zaś z daleka poznaje.`,
          gloryBe: true
        },
        {
          id: 'ves_cant_flp',
          siglum: 'Flp 2, 6-11',
          title: 'Kantyk Nowego Testamentu: Kenoza i wywyższenie Chrystusa',
          latinTitle: 'Christus Iesus, cum in forma Dei esset',
          antiphon: 'Bóg wywyższył Chrystusa i dał Mu Imię, * Które jest ponad wszelkie imię.',
          category: 'canticle_nt',
          christologicalKey: 'Szczyt chrystologii Pawłowej: posłuszeństwo aż do śmierci na krzyżu staje się źródłem kosmicznego panowania Zmartwychwstałego Pana.',
          gregorianTone: 'Ton III',
          text: `Chrystus Jezus, istniejąc w postaci Bożej, *
nie skorzystał ze sposobności, aby na równi być z Bogiem,
lecz ogołocił samego siebie, †
przyjąwszy postać sługi, *
stając się podobnym do ludzi.

A w zewnętrznej postaci uznany za człowieka, *
uniżył samego siebie,
stając się posłusznym aż do śmierci, *
i to śmierci krzyżowej.

Dlatego też Bóg Go nad wszystko wywyższył *
i darował Mu imię ponad wszelkie imię,
aby na imię Jezusa zgięło się każde kolano *
istot niebieskich i ziemskich, i podziemnych,
i aby wszelki język wyznał, *
że Jezus Chrystus jest PANEM ku chwale Boga Ojca.`,
          gloryBe: true
        }
      ],
      scriptureReading: {
        siglum: 'Kol 3, 16',
        intro: 'Słowo Boże z Listu św. Pawła do Kolosan',
        text: 'Słowo Chrystusa niech w was przebywa z całym swym bogactwem: z wszelką mądrością nauczajcie i napominajcie samych siebie przez psalmy, hymny, pieśni pełne ducha, pod wpływem łaski śpiewając Bogu w waszych sercach.',
        response: {
          verse: 'K. Niech moja modlitwa wzniesie się ku Tobie, Panie.',
          response: 'W. Jak woń kadzidła, a wzniesienie moich rąk jak ofiara wieczorna.'
        }
      },
      evangelicalCanticle: {
        name: 'Pieśń Maryi (Magnificat)',
        siglum: 'Łk 1, 46-55',
        latinIncipit: 'Magnificat anima mea Dominum',
        antiphon: 'Wielbi dusza moja Pana, * Bo wejrzał na uniżenie swojej służebnicy.',
        text: `Wielbi dusza moja Pana *
i raduje się duch mój w Bogu, Zbawicielu moim.
Bo wejrzał na uniżenie swojej służebnicy; *
oto bowiem odtąd błogosławić mnie będą wszystkie pokolenia,

gdyż wielkie rzeczy uczynił mi Wszechmocny, *
święte jest Jego imię.
A Jego miłosierdzie z pokolenia na pokolenie *
nad tymi, którzy się Go boją.

Okazał moc swego ramienia, *
rozproszył pyszniących się zamysłami serc swoich.
Strącił władców z tronów, *
a wywyższył pokornych.

Głodnych nasycił dobrami, *
a bogatych z niczym odprawił.
Ujął się za sługą swoim, Izraelem, *
pomny na swoje miłosierdzie,

jak obiecał naszym ojcom, *
Abrahamowi i jego potomstwu na wieki.`
      },
      intercessions: {
        call: 'Wysławiajmy Boga, który gromadzi nas na wieczornej modlitwie, i zanośmy z ufnością nasze prośby:',
        intentions: [
          {
            intention: 'Chryste, Zbawicielu świata, podtrzymaj wiarę Twojego świętego Kościoła,',
            response: 'W. Bądź światłem dla wszystkich szukających prawdy.'
          },
          {
            intention: 'Pobłogosław nasze domy, rodziny i wspólnoty, obdarz je przebaczeniem i miłością,',
            response: 'W. Niech w naszych sercach nie zachodzi słońce nad gniewem.'
          },
          {
            intention: 'Pociesz strapionych, uzdrów chorych i otocz opieką tych, którzy przeżywają kryzysy wiary,',
            response: 'W. Okaż im swoje nieskończone miłosierdzie.'
          },
          {
            intention: 'Przyjmij do wiecznej światłości naszych zmarłych braci i siostry,',
            response: 'W. Daj im oglądać Twoje Oblicze twarzą w twarz.'
          }
        ]
      },
      ourFather: true,
      closingPrayer: 'Panie, nasz Boże, niech nasze wieczorne dziękczynienie wzniesie się ku Tobie; jak zajaśniałeś nad światem we wcieleniu Twojego Syna, tak niech Twoja łaska opromieni nasz wieczór i zachowa nas w pokoju. Przez Chrystusa, Pana naszego. Amen.',
      rubrics: [
        'Nieszpory odprawia się na stojąco.',
        'Przed rozpoczęciem pieśni Magnificat czyni się na sobie znak krzyża.'
      ]
    },

    // 9. KOMPLETA (COMPLETORIUM) - Modlitwa na zakończenie dnia
    completorium: {
      id: 'hour_completorium',
      hourType: 'completorium',
      name: 'Kompleta',
      latinName: 'Completorium',
      recommendedTime: 'Przed snem (ok. 21:00 - 23:30)',
      description: 'Cicha, kojąca modlitwa na zakończenie dnia z rachunkiem sumienia i powierzeniem się w ręce Boga.',
      invocations: {
        verse: 'K. Nawróć nas, Boże, nasz Zbawicielu.',
        response: 'W. I odwróć swój gniew od nas. Boże, wejrzyj ku wspomożeniu memu. Panie, pośpiesz ku ratunkowi memu. Chwała Ojcu... Amen. Alleluja.'
      },
      examinationOfConscience: {
        invitation: 'W ciszy serca stańmy przed Bogiem i uczyńmy rachunek sumienia z minionego dnia – podziękujmy za otrzymane dobro i przeprośmy za grzechy i zaniedbania.',
        confiteor: 'Spowiadam się Bogu wszechmogącemu i wam, bracia i siostry, że bardzo zgrzeszyłem myślą, mową, uczynkiem i zaniedbaniem: moja wina, moja wina, moja bardzo wielka wina. Przeto błagam Najświętszą Maryję, zawsze Dziewicę, wszystkich Aniołów i Świętych, i was, bracia i siostry, o modlitwę za mnie do Pana Boga naszego.',
        absolution: 'Niech się zmiłuje nad nami Bóg wszechmogący i odpuściwszy nam grzechy, doprowadzi nas do życia wiecznego. Amen.'
      },
      hymn: {
        title: 'Nim zgaśnie dzienne światło',
        latinTitle: 'Te lucis ante terminum',
        strophes: [
          'Nim zgaśnie dzienne światło, * Ciebie, o Stwórco wszechrzeczy, * Błagamy z kornym sercem, * Byś był nam strażą i obroną.',
          'Oddal od nas senne koszmary, * I nocne widziadła złego ducha, * Zachowaj nasze ciała w czystości, * A dusze w niewinności łaski.',
          'Wysłuchaj nas, miłosierny Ojcze, * I Ty, Współistotny Synu, * Wraz z Duchem Pocieszycielem, * Królujący po wszystkie wieki. Amen.'
        ]
      },
      psalmody: [
        {
          id: 'comp_ps_91',
          siglum: 'Ps 91 (90), 1-16',
          title: 'Bezpieczeństwo w cieniu Wszechmocnego',
          latinTitle: 'Qui habitat in adiutorio Altissimi',
          antiphon: 'Okryje cię swymi piórami * I schronisz się pod Jego skrzydła.',
          commentary: 'Jeden z najpiękniejszych psalmów opieki Bożej – uwalnia od lęku nocy i ciemności.',
          christologicalKey: 'Psalm kuszenia Chrystusa na pustyni i Jego ostatecznego zwycięstwa nad szatanem, wężem i bazyliszkiem (Łk 4, 10-11).',
          gregorianTone: 'Ton VIII',
          text: `Kto przebywa w pieczy Najwyższego *
i w cieniu Wszechmocnego mieszka,
mówi do Pana: «Ucieczko moja i Twierdzo, *
mój Boże, któremu zaufałem».

Bo On sam cię wyzwoli z sideł myśliwego *
i od zgubnego słowa.
Okryje cię swymi piórami †
i schronisz się pod Jego skrzydła: *
wierność Jego jest tarczą i pancerzem.

Nie ulękniesz się strachu nocnego *
ani strzały za dnia lecącej,
ani zarazy, co idzie w mroku, *
ani moru, co niszczy w południe.

Choćby u boku twego padło tysiąc, †
a dziesięć tysięcy po twojej prawicy: *
ciebie to nie dosięgnie.
Owszem, na własne oczy ujrzysz *
i zapłatę bezbożnych zobaczysz.

Niedola nie przystąpi do ciebie, *
a cios nie spotka twojego namiotu,
bo swoim aniołom dał rozkaz o tobie, *
aby cię strzegli na wszystkich twych drogach.
Na rękach będą cię nosili, *
abyś nie uraził swej stopy o kamień.

«Ja go wybawię, bo przylgnął do Mnie; *
osłonię go, bo poznał moje imię.
Będzie Mnie wzywał, a Ja go wysłucham †
i będę z nim w utrapieniu, *
wyzwolę go i sławą obdarzę.
Nasycę go długim życiem *
i ukażę mu moje zbawienie».`,
          gloryBe: true
        },
        {
          id: 'comp_ps_134',
          siglum: 'Ps 134 (133)',
          title: 'Nocna modlitwa w świątyni',
          latinTitle: 'Ecce nunc benedicite Dominum',
          antiphon: 'Błogosławcie Pana w czasie nocy.',
          christologicalKey: 'Chrystus czuwający na modlitwie nocnej w Ogrójcu i nieustannie wstawiający się za nami w niebieskim sanktuarium.',
          gregorianTone: 'Ton II',
          text: `Oto błogosławcie Pana, *
wszyscy słudzy Pańscy,
którzy stoicie w domu Pańskim *
w czasie nocy.

Wznoście wasze ręce ku Miejscu Świętemu *
i błogosławcie Pana!
Niechaj cię Pan błogosławi z Syjonu, *
Ten, który stworzył niebo i ziemię.`,
          gloryBe: true
        }
      ],
      scriptureReading: {
        siglum: 'Ap 22, 4-5',
        intro: 'Słowo Boże z Księgi Apokalipsy',
        text: 'I będą oglądać Jego oblicze, a imię Jego na ich czołach. I nocy już nie będzie. A nie potrzeba im światła lampy i światła słońca, bo Pan Bóg będzie świecił nad nimi i będą królować na wieki wieków.',
        response: {
          verse: 'K. W ręce Twoje, Panie, powierzam ducha mojego.',
          response: 'W. Odkupiłeś nas, Panie, Boże wierny.'
        }
      },
      evangelicalCanticle: {
        name: 'Pieśń Symeona (Nunc Dimittis)',
        siglum: 'Łk 2, 29-32',
        latinIncipit: 'Nunc dimittis servum tuum, Domine',
        antiphon: 'Strzeż nas, Panie, gdy czuwamy, * Podczas snu nas osłaniaj, abyśmy czuwali z Chrystusem i odpoczywali w pokoju.',
        text: `Teraz, o Władco, pozwól odejść słudze swemu *
w pokoju, według Twojego słowa.
Bo moje oczy ujrzały Twoje zbawienie, *
któreś przygotował wobec wszystkich narodów:

światło na oświecenie pogan *
i chwałę ludu Twego, Izraela.`
      },
      ourFather: false,
      closingPrayer: 'Nawiedź, Panie, ten dom i naszą rodzinę, i oddal od nas wszelkie zasadzki nieprzyjaciela; niech Twoi święci aniołowie zamieszkają w nim i strzegą nas w pokoju, a Twoje błogosławieństwo niech spoczywa nad nami zawsze. Przez Chrystusa, Pana naszego. Amen.',
      marianAntiphon: {
        title: 'Pod Twoją obronę',
        latinTitle: 'Sub Tuum Praesidium',
        text: `Pod Twoją obronę uciekamy się, święta Boża Rodzicielko,
naszymi prośbami racz nie gardzić w potrzebach naszych,
ale od wszelakich złych przygód racz nas zawsze wybawiać,
Panno chwalebna i błogosławiona.
O Pani nasza, Orędowniczko nasza,
Pośredniczko nasza, Pocieszycielko nasza!
Z Synem swoim nas pojednaj,
Synowi swojemu nas polecaj,
swojemu Synowi nas oddawaj. Amen.`
      },
      rubrics: [
        'Kompletę odprawia się jako ostatnią modlitwę przed spoczynkiem nocnym.',
        'Zaleca się zachowanie głębokiej ciszy serca po skończonej Komplecie aż do rana (silentium sacrum).'
      ]
    }
  }
};

export const MARIAN_ANTIPHONS_COLLECTION = [
  {
    id: 'ant_sub_tuum',
    title: 'Pod Twoją obronę',
    latinTitle: 'Sub Tuum Praesidium',
    period: 'Przez cały rok (najstarsza znana modlitwa maryjna z III w.)',
    polishText: `Pod Twoją obronę uciekamy się, święta Boża Rodzicielko,
naszymi prośbami racz nie gardzić w potrzebach naszych,
ale od wszelakich złych przygód racz nas zawsze wybawiać,
Panno chwalebna i błogosławiona.
O Pani nasza, Orędowniczko nasza,
Pośredniczko nasza, Pocieszycielko nasza!
Z Synem swoim nas pojednaj,
Synowi swojemu nas polecaj,
swojemu Synowi nas oddawaj. Amen.`,
    latinText: `Sub tuum praesidium confugimus, Sancta Dei Genetrix:
nostras deprecationes ne despicias in necessitatibus,
sed a periculis cunctis libera nos semper,
Virgo gloriosa et benedicta.`
  },
  {
    id: 'ant_salve_regina',
    title: 'Witaj Królowo, Matko Miłosierdzia',
    latinTitle: 'Salve Regina',
    period: 'W okresie zwykłym',
    polishText: `Witaj, Królowo, Matko miłosierdzia,
życie, słodyczy i nadziejo nasza, witaj!
Do Ciebie wołamy, wygnańcy, synowie Ewy;
do Ciebie wzdychamy, jęcząc i płacząc w tym łez padole.
Przeto, Orędowniczko nasza,
one miłosierne oczy Twoje na nas zwróć,
a Jezusa, błogosławiony owoc żywota Twojego,
po tym wygnaniu nam okaż.
O łaskawa, o litościwa, o słodka Panno Maryjo!`,
    latinText: `Salve, Regina, Mater misericordiae,
vita, dulcedo, et spes nostra, salve.
Ad te clamamus, exsules filii Hevae,
ad te suspiramus, gementes et flentes in hac lacrimarum valle.
Eia, ergo, advocata nostra, illos tuos misericordes oculos ad nos converte;
et Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende.
O clemens, o pia, o dulcis Virgo Maria.`
  },
  {
    id: 'ant_regina_caeli',
    title: 'Królowo Niebios, wesel się',
    latinTitle: 'Regina Caeli',
    period: 'W okresie Wielkanocnym',
    polishText: `Królowo nieba, wesel się, alleluja,
bo Ten, któregoś nosiła, alleluja,
zmartwychwstał, jak powiedział, alleluja.
Módl się za nami do Boga, alleluja.`,
    latinText: `Regina caeli, laetare, alleluia;
quia quem meruisti portare, alleluia,
resurrexit, sicut dixit, alleluia:
ora pro nobis Deum, alleluia.`
  }
];

export const LATIN_HYMNS_COLLECTION = [
  {
    id: 'hymn_te_deum',
    title: 'Ciebie, Boga, wysławiamy (Te Deum)',
    latinTitle: 'Te Deum laudamus',
    usage: 'Niedziele, Uroczystości i Święta w Godzinie Czytań',
    polishText: `Ciebie, Boga, wysławiamy,
Tobie, Panu, hołd składamy.
Ciebie, Ojca niebios wiecznego,
Czcimy z ziemią ze wszystkiego.
Tobie wszyscy Aniołowie,
Tobie nieba i mocy Cherubowie,
Serafini niespożyci
Nieustannie głoszą w zachwycie:
Święty, Święty, Święty, Pan Bóg Zastępów!
Pełne są niebiosa i ziemia majestatu chwały Twojej.`,
    latinText: `Te Deum laudamus: te Dominum confitemur.
Te aeternum Patrem omnis terra veneratur.
Tibi omnes Angeli; tibi caeli et universae Potestates;
Tibi Cherubim et Seraphim incessabili voce proclamant:
Sanctus, Sanctus, Sanctus, Dominus Deus Sabaoth.
Pleni sunt caeli et terra maiestatis gloriae tuae.`
  }
];
