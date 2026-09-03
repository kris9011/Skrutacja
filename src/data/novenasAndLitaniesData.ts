// Baza danych najpowszechniejszych Nowenn i Litanii Kościoła Katolickiego
// Zawiera pełne teksty na poszczególne dni nowenn (1–9) oraz autentyczne teksty litanii.

export interface NovenaDayItem {
  dayNumber: number;
  title: string;
  intention: string;
  scriptureVerse?: string;
  reflection: string;
  prayer: string;
}

export interface CatholicNovena {
  id: string;
  title: string;
  subtitle: string;
  patron: string;
  feastDay?: string;
  category: 'Maryjne' | 'Pańskie' | 'Do Świętych' | 'Do Ducha Świętego';
  totalDays: number;
  description: string;
  openingPrayer: string;
  closingPrayer: string;
  days: NovenaDayItem[];
}

export interface LitanyInvocation {
  invocation: string;
  response: string; // np. "zmiłuj się nad nami", "módl się za nami", "wysłuchaj nas, Panie"
}

export interface CatholicLitany {
  id: string;
  title: string;
  subtitle: string;
  category: 'Maryjne' | 'Pańskie' | 'Do Świętych' | 'Do Ducha Świętego';
  latinTitle?: string;
  description: string;
  openingPrayers: string[];
  sections: {
    sectionTitle?: string;
    invocations: LitanyInvocation[];
  }[];
  concludingPrayers: string[];
}

// -------------------------------------------------------------
// NOWENNY
// -------------------------------------------------------------
export const NOVENAS_LIST: CatholicNovena[] = [
  {
    id: 'wezly',
    title: 'Nowenna do Matki Bożej Rozwiązującej Węzły',
    subtitle: 'Umiłowana modlitwa papieża Franciszka w sytuacjach po ludzku nierozwiązywalnych',
    patron: 'Najświętsza Maryja Panna',
    category: 'Maryjne',
    totalDays: 9,
    description: 'Modlitwa do Maryi, która rozwiązuje węzły grzechu, nieprzebaczenia, lęku, małżeńskich kryzysów i cierpień, które wydają się niemożliwe do rozplątania po ludzku.',
    openingPrayer: 'W imię Ojca i Syna, i Ducha Świętego. Amen. Akt żalu: Panie mój i Boże, żałuję z całego serca za wszystkie grzechy moje, ponieważ obraziłem Ciebie, Dobro najwyższe i godne wszelkiej miłości. Postanawiam mocno przy pomocy łaski Twojej już więcej nie grzeszyć.',
    closingPrayer: 'Maryjo, Matko pięknej miłości, Matko, która nigdy nie opuszczasz dziecka wołającego o pomoc, Matko, której ręce nieustannie pracują dla dobra Twoich umiłowanych dzieci, albowiem porusza je Boska miłość i nieskończone miłosierdzie, zwróć ku mnie swoje współczujące spojrzenie. Spójrz na kłębowisko «węzłów» w moim życiu. Ty znasz moją rozpacz i ból. Ty wiesz, jak te węzły mnie paraliżują. Maryjo, Matko, której Bóg powierzył rozwiązywanie węzłów w życiu Jego dzieci, w Twoje ręce składam wstęgę mojego życia. Nikt, nawet Zły, nie może odebrać Twojej miłosiernej pomocy. W Twoich dłoniach nie ma takiego węzła, którego nie dałoby się rozwiązać. Matko potężna, przez Twoją łaskę i moc Twojego wstawiennictwa u Twojego Syna Jezusa, mojego Wybawiciela, weź dzisiaj pod swoją opiekę ten węzeł... (wymień go). Proszę Cię, rozwiąż go na wieki ku chwale Bożej. Ty jesteś moją nadzieją. Ty jesteś jedyną pocieszycielką daną mi przez Boga, umocnieniem moich wątłych sił, bogactwem w mojej nędzy, oswobodzeniem z więzów wraz z Chrystusem. Wysłuchaj mojego wołania. Strzeż mnie, prowadź i chroń. Ty jesteś moim bezpiecznym schronieniem. Maryjo, Rozwiązująca Węzły, módl się za mną. Amen.',
    days: [
      {
        dayNumber: 1,
        title: 'Dzień 1: Węzeł braku wiary i zaufania Bogu',
        intention: 'Za węzły pychy, powątpiewania w miłość Boga i zranionego zaufania',
        scriptureVerse: '«Oto ja służebnica Pańska, niech mi się stanie według twego słowa!» (Łk 1, 38)',
        reflection: 'Święta Matko, Maryjo, Ty z wiarą przyjęłaś zapowiedź anioła, nie wątpiąc, że dla Boga nie ma nic niemożliwego. Wiele razy w naszym życiu pojawia się zniechęcenie i pokusa myślenia, że Bóg o nas zapomniał. Dzisiaj przynoszę Ci węzeł mojego zwątpienia.',
        prayer: 'Matko Najświętsza, Rozwiązująca Węzły, proszę Cię, weź w swoje dłonie wstęgę mojego życia i rozwiąż węzeł niewiary i lęku o przyszłość. Spraw, bym jak Ty powierzył się bez reszty woli Ojca. Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 2,
        title: 'Dzień 2: Węzeł nieprzebaczenia i dawnych urazów',
        intention: 'Za węzły złości, żalu do bliskich i ran z przeszłości',
        scriptureVerse: '«Przebaczajcie, a będzie wam przebaczone» (Łk 6, 37)',
        reflection: 'Nieprzebaczenie to ciasny węzeł, który dusi serce i odbiera radość życia. Maryjo, stojąca pod Krzyżem Syna, gdzie przebaczył On swoim oprawcom, pomóż mi otworzyć dłonie i wybaczyć tym, którzy mnie zranili.',
        prayer: 'Maryjo, Matko Miłosierdzia, oddaję Ci węzeł zranień, złości i żalu, który noszę w sercu. Wyproś mi u Jezusa łaskę przebaczenia każdemu człowiekowi z całego serca. Rozwiąż ten węzeł, aby moje serce mogło znowu kochać czystą miłością. Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 3,
        title: 'Dzień 3: Węzeł lęku i paraliżującego niepokoju',
        intention: 'Za osoby zmagające się z depresją, nerwicami i panicznym strachem',
        scriptureVerse: '«Wszystkie troski wasze przerzućcie na Niego, gdyż Jemu zależy na was» (1 P 5, 7)',
        reflection: 'Lęk potrafi zawiązać węzeł, przez który człowiek nie potrafi zrobić kroku naprzód. Maryjo, która uciekałaś z Dzieciątkiem do Egiptu pośród nocy, Ty znasz ludzki lęk, ale ufałaś Bogu.',
        prayer: 'Królowo Pokoju, w Twoje ręce składam węzeł mojego ciągłego zamartwiania się i lęków. Uproś mi u Ducha Świętego pokój serca, którego świat dać nie może. Niech ustąpi wszelka ciemność przed światłością Twego Syna. Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 4,
        title: 'Dzień 4: Węzeł nałogów i niewoli grzechu',
        intention: 'Za uwikłanych w uzależnienia od alkoholu, nieczystości, hazardu, internetu i pychy',
        scriptureVerse: '«Ku wolności wyswobodził nas Chrystus» (Ga 5, 1)',
        reflection: 'Każdy powtarzany grzech zaciska się w pętlę nałogu, z której człowiek o własnych siłach nie zdoła się wyswobodzić. Jednak krew Chrystusa ma moc skruszyć każde kajdany.',
        prayer: 'Rozwiązująca Węzły, spojrzyj na węzły nałogu i słabości, które mnie zniewalają. Zmiażdż głowę węża kusiciela, który wmawia mi, że nie mam już szans na wolność. Przez łaskę Twego Syna wyrwij mnie z tej niewoli. Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 5,
        title: 'Dzień 5: Węzeł konfliktów w rodzinie i małżeństwie',
        intention: 'Za małżeństwa przeżywające kryzys, rozstanie, obojętność i brak dialogu',
        scriptureVerse: '«Co więc Bóg złączył, niech człowiek nie rozdziela» (Mt 19, 6)',
        reflection: 'Szatan szczególnie nienawidzi rodziny i małżeństwa, zawiązując węzły nieporozumień, oschłości, egoizmu i milczenia. Maryjo, obecna na weselu w Kanie Galilejskiej, wstaw się za nami!',
        prayer: 'Matko z Kany Galilejskiej, powiedz swojemu Synowi: «Nie mają już wina». Przemień wodę naszych kłótni i zniechęcenia w wino nowej, dojrzałej miłości i pojednania. Rozwiąż węzły pychy w naszej rodzinie. Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 6,
        title: 'Dzień 6: Węzeł samotności i odrzucenia',
        intention: 'Za osoby samotne, opuszczone, starców i tych, którzy czują się nikomu niepotrzebni',
        scriptureVerse: '«Nie zostawię was sierotami: Przyjdę do was» (J 14, 18)',
        reflection: 'Poczucie odrzucenia przez ludzi jest jednym z najboleśniejszych węzłów ludzkiej egzystencji. Maryjo, Ty przyjęłaś św. Jana pod krzyżem jako swego syna, stając się Matką każdego z nas.',
        prayer: 'Czuła Matko, przytul mnie do swego Niepokalanego Serca. Rozwiąż węzeł izolacji, samotności i poczucia bycia gorszym. Daj mi odczuć, że jestem nieskończenie ukochanym dzieckiem Boga Ojca. Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 7,
        title: 'Dzień 7: Węzeł trudności materialnych i pracy',
        intention: 'Za osoby bezrobotne, zadłużone i trapione brakiem środków do życia',
        scriptureVerse: '«Przypatrzcie się liliom polnym, jak rosną... jeśli ziele polne Bóg tak przyodziewa, o ileż bardziej was, ludzie małej wiary!» (Mt 6, 28-30)',
        reflection: 'Troski materialne potrafią przygnieść człowieka i zacisnąć pętlę beznadziei. Święta Rodzina w Nazarecie żyła z prostej pracy rąk św. Józefa, ufając Bożej Opatrzności każdego dnia.',
        prayer: 'Wspomożycielko Wiernych, oddaję Ci węzeł moich problemów finansowych, pracy i utrzymania rodziny. Uproś mi mądrość, pracowitość, uczciwość oraz potrzebne środki materialne, abym mógł godnie żyć i dzielić się z potrzebującymi. Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 8,
        title: 'Dzień 8: Węzeł choroby ciała i duszy',
        intention: 'Za cierpiących fizycznie, chorych onkologicznie, terminalnie i zmagających się z bólem',
        scriptureVerse: '«On wziął na siebie nasze słabości i nosił nasze choroby» (Mt 8, 17)',
        reflection: 'Choroba potrafi związać całe ciało i wystawić na próbę wiarę w Bożą miłość. Maryjo, Uzdrowienie Chorych, Ty znasz wartość cierpienia złączonego z Krzyżem Chrystusa.',
        prayer: 'Uzdrowienie Chorych, zanieś moje modlitwy przed tron Najwyższego Lekarza. Jeśli taka jest Jego wola, wyproś mi łaskę uzdrowienia z tej choroby. A jeśli mam nieść ten krzyż, daj mi cierpliwość, pokój i siłę do wytrwania. Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 9,
        title: 'Dzień 9: Dziękczynienie i całkowite oddanie się Maryi',
        intention: 'Z dziękczynieniem za rozwiązane węzły i z prośbą o wytrwanie w łasce uświęcającej',
        scriptureVerse: '«Wielbi dusza moja Pana i raduje się duch mój w Bogu, moim Zbawcy!» (Łk 1, 46-47)',
        reflection: 'W ostatnim dniu nowenny stajemy przed Maryją nie tylko z prośbą, ale z głębokim dziękczynieniem. Wierzymy, że w rękach Matki żaden węzeł nie pozostaje nierozwiązany.',
        prayer: 'Najsłodsza Panno Maryjo, dziękuję Ci za Twoją nieustanną obecność w moim życiu. W Twoje dłonie składam na zawsze całą wstęgę moich dni. Prowadź mnie drogą przykazań do wiecznej radości w Królestwie Niebieskim. Zdrowaś Maryjo... Chwała Ojcu...'
      }
    ]
  },
  {
    id: 'milosierdzie',
    title: 'Nowenna do Miłosierdzia Bożego',
    subtitle: 'Nowenna podyktowana św. Faustynie przez Pana Jezusa przed Świętem Miłosierdzia',
    patron: 'Jezus Miłosierny / św. Faustyna Kowalska',
    feastDay: 'Niedziela Miłosierdzia Bożego (II Niedziela Wielkanocna)',
    category: 'Pańskie',
    totalDays: 9,
    description: 'Nowenna, o której Pan Jezus powiedział: «W tej nowennie udzielę duszom wszelkich łask» (Dz. 796). Każdego dnia przyprowadzamy do Serca Jezusa inną grupę dusz, zanurzając je w oceanie Jego miłosierdzia.',
    openingPrayer: 'W imię Ojca i Syna, i Ducha Świętego. Amen. Koronka do Miłosierdzia Bożego odmawiana po modlitwach każdego dnia.',
    closingPrayer: 'Ojcze Przedwieczny, ofiaruję Ci Ciało i Krew, Duszę i Bóstwo Najmilszego Syna Twojego, a Pana naszego Jezusa Chrystusa, na przebłaganie za grzechy nasze i całego świata. Dla Jego bolesnej męki miej miłosierdzie dla nas i całego świata. Święty Boże, Święty Mocny, Święty Nieśmiertelny, zmiłuj się nad nami i nad całym światem (3x). Jezu, ufam Tobie!',
    days: [
      {
        dayNumber: 1,
        title: 'Dzień 1: Cała ludzkość, a szczególnie wszyscy grzesznicy',
        intention: '«Dziś sprowadź Mi ludzkość całą, a szczególnie wszystkich grzeszników, i zanurzaj ich w morzu miłosierdzia Mojego».',
        reflection: 'Jezus pragnie ocalić każdego człowieka, nawet największego grzesznika. Im większa nędza, tym większe ma prawo do Jego miłosierdzia.',
        prayer: 'Jezu Najmiłosierniejszy, którego właściwością jest litość mieć nad nami i przebaczać nam, nie patrz na grzechy nasze, ale na ufność naszą, jaką mamy w nieskończoną dobroć Twoją, i przyjmij nas do mieszkania najlitościwszego Serca swego i nie wypuszczaj nas z niego na wieki. Błagamy Cię przez miłość Twoją, która Cię łączy z Ojcem i Duchem Świętym. Ojcze Przedwieczny, spójrz okiem miłosierdzia na ludzkość całą, a szczególnie na biednych grzeszników...'
      },
      {
        dayNumber: 2,
        title: 'Dzień 2: Dusze kapłańskie i dusze zakonne',
        intention: '«Dziś sprowadź Mi dusze kapłańskie i dusze zakonne, i zanurz je w niezgłębionym miłosierdziu Moim».',
        reflection: 'Kapłani i zakonnicy to ręce i usta Chrystusa na ziemi. Od ich świętości zależy zbawienie milionów dusz.',
        prayer: 'Jezu Najmiłosierniejszy, od którego wszystko dobre pochodzi, pomnóż w nas łaskę, abyśmy spełniali godne uczynki miłosierdzia, by ci, co na nas patrzą, chwalili Ojca miłosierdzia, który jest w niebie. Ojcze Przedwieczny, spójrz okiem miłosierdzia na grono wybrane w winnicy swojej, na dusze kapłańskie i dusze zakonne, i obdarz ich mocą błogosławieństwa swego...'
      },
      {
        dayNumber: 3,
        title: 'Dzień 3: Dusze pobożne i wierne',
        intention: '«Dziś sprowadź Mi wszystkie dusze pobożne i wierne, i zanurz je w morzu miłosierdzia Mojego».',
        reflection: 'Dusze te były pociechą Jezusa na Drodze Krzyżowej — kroplą ochłody w morzu goryczy.',
        prayer: 'Jezu Najmiłosierniejszy, który wszystkim hojnie skarbów swego miłosierdzia udzielasz, przyjmij nas do mieszkania najlitościwszego Serca swego. Ojcze Przedwieczny, spójrz okiem miłosierdzia na dusze wierne jako na dziedzictwo Syna swego...'
      },
      {
        dayNumber: 4,
        title: 'Dzień 4: Poganie i ci, którzy jeszcze nie znają Jezusa',
        intention: '«Dziś sprowadź Mi pogan i tych, którzy Mnie jeszcze nie znają; i o nich myślałem w gorzkiej swej męce».',
        reflection: 'Serce Jezusa bije dla każdego człowieka na ziemi, pragnąc, aby wszyscy doszli do poznania Prawdy.',
        prayer: 'Jezu Najlitościwszy, który jesteś światłością świata całego, przyjmij do mieszkania najlitościwszego Serca swego dusze pogan, które Cię jeszcze nie znają; niechaj promienie Twej łaski oświecą ich, aby i oni wraz z nami wysławiali dziwy miłosierdzia Twego na wieki...'
      },
      {
        dayNumber: 5,
        title: 'Dzień 5: Dusze braci odłączonych i błądzących',
        intention: '«Dziś sprowadź Mi dusze braci odłączonych i zanurz je w morzu miłosierdzia Mojego».',
        reflection: 'Rany rozłamu w Kościele ranią Ciało Mistyczne Chrystusa. Modlimy się o jedność owczarni.',
        prayer: 'Jezu Najmiłosierniejszy, który jesteś dobrocią samą, Ty nie odmawiasz światła proszącym Cię, przyjmij do mieszkania najlitościwszego Serca swego dusze braci naszych odłączonych i pociągnij ich swym światłem do jedności z Kościołem...'
      },
      {
        dayNumber: 6,
        title: 'Dzień 6: Dusze ciche i pokorne oraz małe dzieci',
        intention: '«Dziś sprowadź Mi dusze ciche i pokorne, i dusze małych dzieci, i zanurz je w miłosierdziu Moim».',
        reflection: 'Dusze te są najbardziej podobne do Boskiego Serca Zbawiciela i wznoszą woń miłą przed tron Boży.',
        prayer: 'Jezu Najmiłosierniejszy, któryś sam powiedział: Uczcie się ode Mnie, żem jest cichy i pokornego serca — przyjmij do mieszkania najlitościwszego Serca swego dusze ciche i pokorne, i dusze małych dzieci. Dusze te wprawiają w zachwyt całe niebo...'
      },
      {
        dayNumber: 7,
        title: 'Dzień 7: Dusze czczące i wysławiające miłosierdzie Boże',
        intention: '«Dziś sprowadź Mi dusze, które szczególnie czczą i wysławiają miłosierdzie Moje, i zanurz je w Moim miłosierdziu».',
        reflection: 'Dusze te najwięcej boleją nad męką Jezusa i najgłębiej wnikają w tajemnicę Jego miłości.',
        prayer: 'Jezu Najmiłosierniejszy, którego Serce jest miłością samą, przyjmij do mieszkania najlitościwszego Serca swego dusze, które szczególnie czczą i wysławiają wielkość miłosierdzia Twego. Dusze te są mocarne siłą samego Boga; w pośród wszelkich udręczeń idą naprzód, ufne w miłosierdzie Twoje...'
      },
      {
        dayNumber: 8,
        title: 'Dzień 8: Dusze w czyśćcu zatrzymane',
        intention: '«Dziś sprowadź Mi dusze, które są w więzieniu czyśćcowym, i zanurz je w przepaści miłosierdzia Mojego; niechaj strumienie krwi Mojej ochłodzą ich upalenie».',
        reflection: 'Dusze czyśćcowe same sobie pomóc nie mogą, ale my możemy przynieść im ulgę przez modlitwę, odpusty i ofiarę Mszy Świętej.',
        prayer: 'Jezu Najmiłosierniejszy, któryś sam powiedział, że miłosierdzia chcesz, oto wprowadzam do mieszkania Twego najlitościwszego Serca dusze czyśćcowe — dusze, które Ci są bardzo drogie, a które jednak muszą wypłacać się Twej sprawiedliwości; niechaj strumienie Krwi i Wody, które wypłynęły z Serca Twego, ugaszą płomienie ognia czyśćcowego...'
      },
      {
        dayNumber: 9,
        title: 'Dzień 9: Dusze oziębłe, które ranią Serce Jezusa',
        intention: '«Dziś sprowadź Mi dusze oziębłe i zanurz je w przepaści miłosierdzia Mojego. Dusze te najboleśniej ranią Serce Moje».',
        reflection: 'Oziębłość duchowa była przyczyną krwawego potu Jezusa w Ogrójcu. Jedynym ratunkiem dla nich jest wołanie o cud Bożego Miłosierdzia.',
        prayer: 'Jezu Najmiłosierniejszy, któryś jest litością samą, wprowadzam do mieszkania najlitościwszego Serca Twego dusze oziębłe. Niechaj w tym ogniu Twej czystej miłości rozgrzeją się te zlodowaciałe dusze, które podobne są do trupów i takim wstrętem Cię napełniają. O Jezu Najlitościwszy, użyj wszechmocy miłosierdzia swego i pociągnij je w sam żar miłości swojej, i obdarz je miłością świętą, bo Ty wszystko możesz...'
      }
    ]
  },
  {
    id: 'juda_tadeusz',
    title: 'Nowenna do św. Judy Tadeusza',
    subtitle: 'Patron spraw beznadziejnych, po ludzku niemożliwych i w najcięższym udręczeniu',
    patron: 'Święty Juda Tadeusz, Apostoł i Męczennik',
    feastDay: '28 października',
    category: 'Do Świętych',
    totalDays: 9,
    description: 'Święty Juda Tadeusz, krewny Pana Jezusa, czczony jest na całym świecie jako orędownik w sprawach, w których zawiodła wszelka ludzka pomoc i nadzieja.',
    openingPrayer: 'W imię Ojca i Syna, i Ducha Świętego. Amen. Święty Judo Tadeuszu, chwalebny Apostole i potężny Orędowniku przed Bogiem, przychodzę do Ciebie z wiarą i ufnością.',
    closingPrayer: 'O chwalebny Apostole, święty Judo Tadeuszu, wierny sługo i przyjacielu Jezusa! Kościół na całym świecie czci Cię i wzywa jako patrona spraw beznadziejnych. Módl się za mną, abym otrzymał pociechę i pomoc Nieba we wszystkich moich potrzebach, próbach i cierpieniach, a szczególnie w tej sprawie... (wymień ją), i abym mógł chwalić Boga wraz z Tobą i wszystkimi wybranymi przez całą wieczność. Obiecuję Ci, o święty Judo, pamiętać zawsze o tej wielkiej łasce i szerzyć Twoją cześć. Amen.',
    days: [
      {
        dayNumber: 1,
        title: 'Dzień 1: Wiara i wierność Ewangelii',
        intention: 'O łaskę głębokiej wiary i posłuszeństwa Słowu Bożemu',
        reflection: 'Święty Juda Tadeusz głosił Ewangelię z niezłomną odwagą, nie lękając się prześladowań ani śmierci męczeńskiej.',
        prayer: 'Święty Judo Tadeuszu, Apostole pełen wiary, wyproś mi u Pana Jezusa łaskę, by moja wiara nigdy nie zachwiała się pośród burz życiowych. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 2,
        title: 'Dzień 2: Nadzieja wbrew nadziei',
        intention: 'Za zniechęconych, zrozpaczonych i bliskich załamania nerwowego',
        reflection: 'Gdy gasną wszelkie ludzkie rachuby, nadzieja chrześcijańska zakotwiczona jest w zmartwychwstaniu Chrystusa.',
        prayer: 'Patronie spraw po ludzku beznadziejnych, odnów we mnie nadzieję. Nie pozwól, by zwątpienie zamknęło moje serce na Bożą pomoc. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 3,
        title: 'Dzień 3: Prawdziwa miłość Boga i bliźniego',
        intention: 'O przezwyciężenie egoizmu i umiejętność bezinteresownej służby',
        reflection: 'W swoim Liście św. Juda zachęca nas: «Wy zaś, umiłowani, budując samych siebie na fundamencie waszej najświętszej wiary, módlcie się w Duchu Świętym i ustrzeżcie samych siebie w miłości Bożej» (Jud 20-21).',
        prayer: 'Święty Apostole, uproś mi serce czyste i płonące miłością do Chrystusa i braci. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 4,
        title: 'Dzień 4: Cierpliwość w znoszeniu cierpienia',
        intention: 'Za dźwigających krzyż samotności, choroby i niezrozumienia',
        reflection: 'Cierpienie przyjęte w jedności z Ukrzyżowanym rodzi owoce zbawienia dla świata.',
        prayer: 'Święty Judo, który znosiłeś trudy apostolskie dla imienia Jezusa, wyjednaj mi dar cierpliwości i męstwa. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 5,
        title: 'Dzień 5: Ochrona przed złem i pokusami szatana',
        intention: 'O uwolnienie od grzechów, lęków i zasadzek złego ducha',
        reflection: 'Święty Juda stoczył walkę duchową z przewrotnością i błędami, wskazując na zwycięstwo Chrystusa.',
        prayer: 'Potężny obrońco, broń mojej duszy i moich bliskich przed wpływem złego ducha. Okryj nas płaszczem orędownictwa. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 6,
        title: 'Dzień 6: Jedność i pokój w rodzinie',
        intention: 'O uzdrowienie relacji rodzinnych, zgodę małżeńską i powrót dzieci do Boga',
        reflection: 'Święty Juda jako krewny Pana Jezusa otaczał troską więzi rodzinne oparte na woli Bożej.',
        prayer: 'Święty Judo Tadeuszu, wprowadź pokój i wzajemne zrozumienie do naszych domów. Rozwiąż zatwardziałość serc. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 7,
        title: 'Dzień 7: Pomoc w sprawach materialnych i pracy',
        intention: 'O wyjście z długów, znalezienie uczciwej pracy i bezpieczeństwo bliskich',
        reflection: 'Apostołowie dzielili chleb z rąk Mistrza, ufając, że Ojciec Niebieski troszczy się o ich codzienne potrzeby.',
        prayer: 'Wspomożycielu w potrzebie, przedstaw Panu Bogu moje doczesne kłopoty i wyproś błogosławieństwo w pracy. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 8,
        title: 'Dzień 8: Gorliwość apostolska i świadectwo życia',
        intention: 'O odwagę do wyznawania wiary w pracy, szkole i społeczeństwie',
        reflection: 'Jesteśmy powołani, by być solą ziemi i światłością świata, niosąc Dobrą Nowinę zagubionym.',
        prayer: 'Natchniony zwiastunie prawdy, spraw, abym nigdy nie wstydził się Krzyża i słów Ewangelii. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 9,
        title: 'Dzień 9: Wdzięczność i łaska dobrej śmierci',
        intention: 'O wierność aż do końca, stan łaski uświęcającej i spotkanie z Bogiem w niebie',
        reflection: 'Święty Juda oddał życie za Jezusa, wchodząc do chwały przygotowanej dla wiernych sług.',
        prayer: 'Święty Judo Tadeuszu, dziękuję Ci za Twoje orędownictwo. Czuwaj nade mną w godzinie mojej śmierci i przyprowadź mnie przed oblicze Miłosiernego Zbawiciela. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      }
    ]
  },
  {
    id: 'duch_swiety',
    title: 'Nowenna do Ducha Świętego',
    subtitle: 'Najstarsza nowenna Kościoła — 9 dni modlitwy apostołów i Maryi w Wieczerniku',
    patron: 'Duch Święty Pocieszyciel (Paraklet)',
    category: 'Do Ducha Świętego',
    totalDays: 9,
    description: 'Wzór wszystkich chrześcijańskich nowenn. Trwanie na modlitwie w Wieczerniku w oczekiwaniu na obietnicę Ojca — wylanie Ducha Świętego i Jego 7 darów.',
    openingPrayer: 'Przybądź, Duchu Święty, napełnij serca swoich wiernych i zapal w nich ogień swojej miłości! Ześlij Ducha swego, a powstanie życie, i odnowisz oblicze ziemi.',
    closingPrayer: 'Boże, któryś pouczył serca wiernych światłem Ducha Świętego, daj nam w tymże Duchu poznać to, co jest prawe, i Jego pociechą zawsze się radować. Przez Chrystusa, Pana naszego. Amen.',
    days: [
      {
        dayNumber: 1,
        title: 'Dzień 1: O Dar Bojaźni Bożej',
        intention: 'O ustrzeżenie się przed grzechem i głęboki szacunek dla Majestatu Boga',
        reflection: 'Bojaźń Boża nie jest lękiem niewolnika, lecz dziecięcą miłością, która boi się zasmucić ukochanego Ojca.',
        prayer: 'Duchu Święty, udziel mi daru świętej bojaźni Bożej, abym zawsze pamiętał o Twojej świętości i unikał wszystkiego, co mogłoby oddalić mnie od Ciebie. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 2,
        title: 'Dzień 2: O Dar Pobożności',
        intention: 'O synowską relację z Ojcem Niebieskim i miłość do modlitwy',
        reflection: 'Dar Pobożności napełnia serce czułością ku Bogu i sprawia, że wołamy w głębi ducha: «Abba, Ojcze!»',
        prayer: 'Duchu Święty, rozpal we mnie pragnienie modlitwy i adoracji. Spraw, bym z radością spotykał się z Tobą w Sakramentach. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 3,
        title: 'Dzień 3: O Dar Męstwa',
        intention: 'O odwagę w pokonywaniu trudności, pokus i ludzkich opinii',
        reflection: 'Dar Męstwa uzdalnia do męczeństwa i codziennego wiernego trwania przy przykazaniach Bożych.',
        prayer: 'Duchu Święty, umocnij moją słabą wolę. Daj mi siłę przeciwstawiać się duchowi tego świata i odważnie stawać w obronie prawdy. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 4,
        title: 'Dzień 4: O Dar Rady',
        intention: 'O światło w podejmowaniu ważnych decyzji życiowych i rozeznawanie duchowe',
        reflection: 'Dar Rady pozwala odkryć drogę, którą Bóg dla nas przygotował, i unikać fałszywych ścieżek.',
        prayer: 'Duchu Święty, bądź moim Przewodnikiem. Oświecaj moje myśli, abym zawsze wybierał to, co bardziej podoba się Bogu. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 5,
        title: 'Dzień 5: O Dar Umiejętności (Wiedzy)',
        intention: 'O patrzenie na stworzenie i wydarzenia oczami wiary',
        reflection: 'Dar Umiejętności uczy właściwego korzystania ze stworzeń i widzenia przemijalności doczesnego świata.',
        prayer: 'Duchu Święty, naucz mnie doceniać dary stworzenia, nie stawiając ich nigdy ponad Stwórcę. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 6,
        title: 'Dzień 6: O Dar Rozumu',
        intention: 'O głębokie wnikanie w prawdy wiary i tajemnice Pisma Świętego',
        reflection: 'Dar Rozumu otwiera serce na zrozumienie Słowa Bożego i tajemnic Królestwa Bożego.',
        prayer: 'Duchu Święty, rozświetl mój umysł, abym zgłębiał i kochał prawdy Ewangelii, karmiąc się nimi na co dzień. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 7,
        title: 'Dzień 7: O Dar Mądrości',
        intention: 'O smakowanie rzeczy Bożych i zjednoczenie z Bogiem w miłości',
        reflection: 'Dar Mądrości jest koroną wszystkich darów — pozwala kosztować słodyczy Boga i patrzeć na świat Jego miłością.',
        prayer: 'Duchu Święty, Boski Ogniu Miłości, napełnij mnie mądrością Krzyża, bym we wszystkim szukał jedynie chwały Bożej. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 8,
        title: 'Dzień 8: O Owoce Ducha Świętego',
        intention: 'O miłość, radość, pokój, cierpliwość, uprzejmość, dobroć, wspaniałomyślność, łaskawość, wierność, skromność, wstrzemięźliwość i czystość',
        reflection: 'Drzewo poznaje się po owocach. Obecność Ducha Świętego objawia się w przemianie ludzkiego charakteru.',
        prayer: 'Duchu Święty, uczyń moje serce urodzajną glebą, która wyda obfite owoce Twojej obecności. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 9,
        title: 'Dzień 9: O Nowe Zesłanie Ducha Świętego',
        intention: 'O odnowę Kościoła, rodzin, parafii i każdego z nas',
        reflection: 'Razem z Maryją i Apostołami otwieramy serca na nową Pięćdziesiątnicę w Kościele.',
        prayer: 'Przybądź, Duchu Święty, i napełnij cały Kościół swoją potęgą. Odnów naszą gorliwość i poślij nas jako świadków Zmartwychwstałego! Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      }
    ]
  },
  {
    id: 'charbel',
    title: 'Nowenna do św. Charbela Makhloufa',
    subtitle: 'Wielki Cudotwórca z Annaya, orędownik w chorobach ciała i duszy oraz sprawach po ludzku beznadziejnych',
    patron: 'Święty Charbel Makhlouf (1828–1898), mnich i pustelnik maronicki',
    feastDay: '28 lipca (wspomnienie liturgiczne 24 lipca / 24. dzień każdego miesiąca)',
    category: 'Do Świętych',
    totalDays: 9,
    description: 'Święty Charbel Makhlouf z Libanu spędził życie w skrajnym ubóstwie, milczeniu i adoracji Najświętszego Sakramentu w pustelni św. Piotra i Pawła w Annaya. Bóg rozsławił go niezliczonymi cudami uzdrowień, nawróceń i darem wydzielania cudownego oleju z jego nienaruszonego ciała.',
    openingPrayer: 'W imię Ojca i Syna, i Ducha Świętego. Amen. Boże Ojcze, któryś świętego Charbela, mnicha i pustelnika, powołał do szczególnego zjednoczenia z Tobą na modlitwie i w ascezie, i obdarzyłeś go niezwykłą łaską cudotwórczą dla chorych i cierpiących na całym świecie — spraw, prosimy Cię pokornie, abyśmy za jego wstawiennictwem otrzymali łaskę, o którą z wiarą prosimy w tej nowennie. Przez Chrystusa, Pana naszego. Amen.',
    closingPrayer: 'O Boże, nieskończenie uwielbiony w Twoich Świętych! Ty natchnąłeś świętego Charbela, pustelnika z Annaya, do życia w doskonałej samotności, ascezie i nieustannej adoracji Najświętszego Sakramentu. Za jego życia i po śmierci sprawiłeś przez niego niezliczone cuda i uzdrowienia, dając ludziom znak Twojego miłosierdzia. Wejrzyj z miłością na nas, którzy z ufnością uciekamy się pod jego potężne orędownictwo. Udziel nam za jego przyczyną łaski, o którą tak gorąco prosimy... (wymień swoją prośbę). Spraw także, abyśmy naśladując jego cnoty: czystość serca, umiłowanie milczenia i wierność Ewangelii, doszli do chwały życia wiecznego w Twoim Królestwie. Przez Chrystusa, Pana naszego. Amen. Święty Charbelu, potężny orędowniku i lekarzu dusz i ciał — módl się za nami!',
    days: [
      {
        dayNumber: 1,
        title: 'Dzień 1: Woń świętości i prośba o ratunek w potrzebie',
        intention: 'O łaskę nawrócenia serca, uwolnienie z grzechu oraz w intencji osobistej... (przedstawić Bogu swoją prośbę)',
        scriptureVerse: '«Bądźcie świętymi, bo Ja jestem święty, Pan, Bóg wasz!» (Kpł 19, 2)',
        reflection: 'Święty Charbelu, z Twojego czystego ciała, które pokonało zepsucie grobu, unosi się woń niebiańskiej świętości. Pustelniku z Annaya, któryś całe życie spędził w ukryciu przed światem, a zajaśniałeś przed obliczem Boga, przybądź mi z pomocą. Wyproś mi u Boga łaskę, o którą z głębi serca błagam w tej nowennie.',
        prayer: 'O cudowny św. Charbelu, Ty w cichości pustelni osiągnąłeś szczyty zjednoczenia z Chrystusem. Wejrzyj na moją nędzę i słabość. Wstaw się za mną u Miłosiernego Ojca, abym otrzymał potrzebną pomoc, a nade wszystko łaskę odwrócenia się od grzechu i trwania w łasce uświęcającej. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 2,
        title: 'Dzień 2: Wierność w ascezie i modlitwie ukrytej',
        intention: 'Za zmagających się z pokusami zmysłów, lenistwem duchowym i brakiem wytrwałości w modlitwie',
        scriptureVerse: '«Kto chce iść za Mną, niech się zaprze samego siebie, niech co dnia bierze krzyż swój i niech Mnie naśladuje» (Łk 9, 23)',
        reflection: 'Święty Charbelu, męczenniku życia zakonnego i samotności eremu. Ty znosiłeś surowość libańskich zim, post o chlebie i wodzie oraz ciężką pracę fizyczną w winnicy, z cichym uśmiechem i nieustanną modlitwą na ustach. Ucz nas, jak umartwiać swoje egoistyczne pragnienia.',
        prayer: 'Święty Pustelniku, wyjednaj mi u Pana cnotę męstwa i wierności w chwilach oschłości duchowej. Spraw, bym nie uciekał przed codziennym krzyżem, lecz łączył swoje trudy z Męką Zbawiciela. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 3,
        title: 'Dzień 3: Miłość do Najświętszego Sakramentu i Eucharystii',
        intention: 'O gorącą miłość i szacunek do Mszy Świętej oraz o głębokie przygotowanie serca do Komunii Świętej',
        scriptureVerse: '«Ja jestem chlebem żywym, który zstąpił z nieba. Jeśli kto spożywa ten chleb, będzie żył na wieki» (J 6, 51)',
        reflection: 'Dla św. Charbela Eucharystia była sercem każdego dnia. Spędzał całe godziny na adoracji przed tabernakulum na kolanach, zatoniony w kontemplacji Nieskończonego. Podczas sprawowania Najświętszej Ofiary płakał ze wzruszenia nad niewypowiedzianą miłością Boga.',
        prayer: 'O św. Charbelu, rozpal w moim oziębłym sercu choć iskierkę tej miłości, którą płonąłeś przed Jezusem Eucharystycznym. Wyproś mi łaskę, abym nigdy nie przyjmował Ciała Pańskiego w sposób rutynowy lub niegodny, lecz z czcią, wiarą i drżeniem serca. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 4,
        title: 'Dzień 4: Dziecięce oddanie Matce Bożej',
        intention: 'Za nasze rodziny i małżeństwa, o opiekę Królowej Pokoju i zachowanie czystości obyczajów',
        scriptureVerse: '«Oto Matka twoja. I od tej godziny uczeń wziął Ją do siebie» (J 19, 27)',
        reflection: 'Święty Charbel od najmłodszych lat czcił Maryję jako Matkę Światła. Pustelnia św. Piotra i Pawła rozbrzmiewała jego szeptem różańcowych «Zdrowaś Maryjo». Ufał Jej bezgranicznie i Jej niepokalanym dłoniom powierzał każdy krok.',
        prayer: 'Święty Charbelu, czuły synu Najświętszej Dziewicy, naucz mnie kochać Maryję tak, jak Ty Ją kochałeś. Przyprowadź mnie i moich najbliższych pod Jej macierzyński płaszcz, abyśmy byli bezpieczni przed nawałnicami świata i pokusami złego ducha. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 5,
        title: 'Dzień 5: Posłuszeństwo i głęboka pokora',
        intention: 'O wykorzenienie pychy, buntu przeciw woli Bożej oraz żądzy dominacji nad bliźnimi',
        scriptureVerse: '«Bóg pysznym się sprzeciwia, a pokornym łaskę daje» (1 P 5, 5)',
        reflection: 'Choć św. Charbel był obdarowany niezwykłymi darami i widzeniami, uważał się za najmniejszego ze wszystkich braci. Bez słowa szemrania słuchał nawet najmłodszych przełożonych, widząc w posłuszeństwie najpewniejszą drogę do nieba.',
        prayer: 'Święty Ojcze Charbelu, wzorze cichości i pokory, wyproś mi u Jezusa serce ciche i pokorne. Uwolnij mnie od pożądania ludzkich pochwał, zranionej ambicji i lęku przed odrzuceniem. Niech szukam jedynie upodobania w oczach Boga. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 6,
        title: 'Dzień 6: Dar uzdrawiania chorych i cierpiących',
        intention: 'Za chorych fizycznie, psychicznie, cierpiących na nowotwory, udręczonych bólem i lękiem przed śmiercią',
        scriptureVerse: '«Uzdrawiajcie chorych, wskrzeszajcie umarłych, oczyszczajcie trędowatych, wypędzajcie złe duchy! Darmo otrzymaliście, darmo dawajcie!» (Mt 10, 8)',
        reflection: 'Bóg uczynił ze św. Charbela żywe źródło cudownych uzdrowień. Miliony chorych na całym świecie doświadczają przez jego orędownictwo i namaszczenie olejem św. Charbela odzyskania zdrowia, ulgi w cierpieniu i wewnętrznego pokoju.',
        prayer: 'Święty Charbelu, lekarzu ciał i dusz, wejrzyj ze współczuciem na wszystkich cierpiących, a w szczególności na... (wymień chorych lub siebie). Połóż swoje uświęcone dłonie na obolałych miejscach i wyproś u Boskiego Lekarza dar uzdrowienia lub siłę do chrześcijańskiego znoszenia cierpienia. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 7,
        title: 'Dzień 7: Milczenie serca i zasłuchanie w Słowo Boże',
        intention: 'O umiejętność uciszenia zgiełku świata, pokój wewnętrzny i wrażliwość na natchnienia Ducha Świętego',
        scriptureVerse: '«Po trzęsieniu ziemi powstał ogień, lecz w ogniu nie było Pana. A po ogniu — szmer łagodnego powiewu...» (1 Krl 19, 12)',
        reflection: 'Święty Charbel przez dziesięciolecia zachowywał niemal całkowite milczenie, rozmawiając jedynie z Bogiem w modlitwie lub wtedy, gdy wymagało tego posłuszeństwo. W ciszy libańskich gór jego serce wsłuchiwało się w najcichszy szept Stwórcy.',
        prayer: 'Pustelniku z Annaya, pomóż mi odnaleźć przestrzeń ciszy w moim zabieganym życiu. Naucz mnie panować nad językiem, a otwierać serce na Słowo Boże. Ucisz we mnie burzę lęków i niepokojów, by zapanował Boży pokój. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 8,
        title: 'Dzień 8: Walka duchowa i zwycięstwo nad szatanem',
        intention: 'O uwolnienie od zniewoleń duchowych, nałogów, lęków i zasadzek złego ducha',
        scriptureVerse: '«Bądźcie trzeźwi! Czuwajcie! Przeciwnik wasz, diabeł, jak lew ryczący krąży szukając kogo pożreć. Mocni w wierze przeciwstawcie się jemu!» (1 P 5, 8-9)',
        reflection: 'W eremie św. Charbel doświadczał gwałtownych ataków złego ducha, który próbował zasiać w nim wątpliwość i strach. Święty odpowiadał na te ataki znakiem krzyża, imieniem Maryi i jeszcze żarliwszą modlitwą, odnosząc pełne zwycięstwo.',
        prayer: 'Mocarzu Boży, św. Charbelu, broń mnie w walce duchowej. Gdy zły duch podsuwa mi zniechęcenie, zwątpienie i nieczyste myśli, stań przy mnie i osłoń mnie swoim potężnym orędownictwem. Niech moc Krzyża Chrystusowego zwycięża w każdym momencie mojego życia. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      },
      {
        dayNumber: 9,
        title: 'Dzień 9: Dziękczynienie i zawierzenie wieczności',
        intention: 'Z dziękczynieniem za wysłuchane modlitwy, za otrzymane łaski oraz o dar dobrej i świętej śmierci',
        scriptureVerse: '«W dobrych zawodach wystąpiłem, bieg ukończyłem, wiarę ustrzegłem. Na ostatek odłożono dla mnie wieniec sprawiedliwości...» (2 Tm 4, 7-8)',
        reflection: 'Święty Charbel odszedł do Domu Ojca w wigilię Bożego Narodzenia, doznając udaru podczas sprawowania Mszy Świętej, wpatrzony w Hostię. Jego śmierć była spokojnym przejściem z ziemskiej adoracji do wiekuistego oglądania Boga twarzą w twarz.',
        prayer: 'Święty Charbelu, kończę tę nowennę z sercem pełnym ufności i głębokiej wdzięczności. Wierzę, że Twoje modlitwy za mną nie ustaną przed tronem Najwyższego. Bądź moim orędownikiem i przewodnikiem na ścieżkach życia, a w godzinie śmierci uproś mi łaskę pojednania z Bogiem i wejścia do wiecznej radości. Ojcze nasz... Zdrowaś Maryjo... Chwała Ojcu...'
      }
    ]
  }
];

// -------------------------------------------------------------
// LITANIE
// -------------------------------------------------------------
export const LITANIES_LIST: CatholicLitany[] = [
  {
    id: 'loretanska',
    title: 'Litania Loretańska do Najświętszej Maryi Panny',
    subtitle: 'Oficjalna litania maryjna Kościoła z zatwierdzonymi wezwaniami',
    latinTitle: 'Litaniae Lauretanae',
    category: 'Maryjne',
    description: 'Jedna z najstarszych i najbardziej czcigodnych modlitw błagalnych ku czci Bogurodzicy, zawierająca perły dogmatyczne i biblijne tytuły Maryi.',
    openingPrayers: [
      'Kyrie eleison, Chryste eleison, Kyrie eleison.',
      'Chryste, usłysz nas. Chryste, wysłuchaj nas.',
      'Ojcze z nieba, Boże — zmiłuj się nad nami.',
      'Synu, Odkupicielu świata, Boże — zmiłuj się nad nami.',
      'Duchu Święty, Boże — zmiłuj się nad nami.',
      'Święta Trójco, Jedyny Boże — zmiłuj się nad nami.'
    ],
    sections: [
      {
        sectionTitle: 'Tytuły Świętości i Macierzyństwa',
        invocations: [
          { invocation: 'Święta Maryjo', response: 'módl się za nami' },
          { invocation: 'Święta Boża Rodzicielko', response: 'módl się za nami' },
          { invocation: 'Święta Panno nad pannami', response: 'módl się za nami' },
          { invocation: 'Matko Chrystusowa', response: 'módl się za nami' },
          { invocation: 'Matko Kościoła', response: 'módl się za nami' },
          { invocation: 'Matko miłosierdzia', response: 'módl się za nami' },
          { invocation: 'Matko łaski Bożej', response: 'módl się za nami' },
          { invocation: 'Matko nadziei', response: 'módl się za nami' },
          { invocation: 'Matko nieskalana', response: 'módl się za nami' },
          { invocation: 'Matko najczystsza', response: 'módl się za nami' },
          { invocation: 'Matko dziewicza', response: 'módl się za nami' },
          { invocation: 'Matko nienaruszona', response: 'módl się za nami' },
          { invocation: 'Matko najmilsza', response: 'módl się za nami' },
          { invocation: 'Matko przedziwna', response: 'módl się za nami' },
          { invocation: 'Matko dobrej rady', response: 'módl się za nami' },
          { invocation: 'Matko Stworzyciela', response: 'módl się za nami' },
          { invocation: 'Matko Zbawiciela', response: 'módl się za nami' }
        ]
      },
      {
        sectionTitle: 'Tytuły Cnót i Przywilejów',
        invocations: [
          { invocation: 'Panno roztropna', response: 'módl się za nami' },
          { invocation: 'Panno czcigodna', response: 'módl się za nami' },
          { invocation: 'Panno wsławiona', response: 'módl się za nami' },
          { invocation: 'Panno można', response: 'módl się za nami' },
          { invocation: 'Panno łaskawa', response: 'módl się za nami' },
          { invocation: 'Panno wierna', response: 'módl się za nami' },
          { invocation: 'Zwierciadło sprawiedliwości', response: 'módl się za nami' },
          { invocation: 'Stolico mądrości', response: 'módl się za nami' },
          { invocation: 'Przyczyno naszej radości', response: 'módl się za nami' },
          { invocation: 'Przybytku Ducha Świętego', response: 'módl się za nami' },
          { invocation: 'Przybytku chwalebny', response: 'módl się za nami' },
          { invocation: 'Przybytku sławny pobożności', response: 'módl się za nami' },
          { invocation: 'Różo duchowna', response: 'módl się za nami' },
          { invocation: 'Wieżo Dawidowa', response: 'módl się za nami' },
          { invocation: 'Wieżo z kości słoniowej', response: 'módl się za nami' },
          { invocation: 'Domie złoty', response: 'módl się za nami' },
          { invocation: 'Arko przymierza', response: 'módl się za nami' },
          { invocation: 'Bramo niebieska', response: 'módl się za nami' },
          { invocation: 'Gwiazdo zaranna', response: 'módl się za nami' }
        ]
      },
      {
        sectionTitle: 'Tytuły Pomocy i Wstawiennictwa',
        invocations: [
          { invocation: 'Uzdrowienie chorych', response: 'módl się za nami' },
          { invocation: 'Ucieczko grzesznych', response: 'módl się za nami' },
          { invocation: 'Pociecho migrantów', response: 'módl się za nami' },
          { invocation: 'Pocieszycielko strapionych', response: 'módl się za nami' },
          { invocation: 'Wspomożenie wiernych', response: 'módl się za nami' }
        ]
      },
      {
        sectionTitle: 'Tytuły Królewskie',
        invocations: [
          { invocation: 'Królowo Aniołów', response: 'módl się za nami' },
          { invocation: 'Królowo Patriarchów', response: 'módl się za nami' },
          { invocation: 'Królowo Proroków', response: 'módl się za nami' },
          { invocation: 'Królowo Apostołów', response: 'módl się za nami' },
          { invocation: 'Królowo Męczenników', response: 'módl się za nami' },
          { invocation: 'Królowo Wyznawców', response: 'módl się za nami' },
          { invocation: 'Królowo Dziewic', response: 'módl się za nami' },
          { invocation: 'Królowo Wszystkich Świętych', response: 'módl się za nami' },
          { invocation: 'Królowo bez zmazy pierworodnej poczęta', response: 'módl się za nami' },
          { invocation: 'Królowo wniebowzięta', response: 'módl się za nami' },
          { invocation: 'Królowo Różańca świętego', response: 'módl się za nami' },
          { invocation: 'Królowo rodziny', response: 'módl się za nami' },
          { invocation: 'Królowo pokoju', response: 'módl się za nami' },
          { invocation: 'Królowo Polski', response: 'módl się za nami' }
        ]
      }
    ],
    concludingPrayers: [
      'Baranku Boży, który gładzisz grzechy świata — przepuść nam, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — wysłuchaj nas, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — zmiłuj się nad nami.',
      'Módl się za nami, Święta Boża Rodzicielko, abyśmy się stali godnymi obietnic Chrystusowych.',
      'Módlmy się: Panie, nasz Boże, daj nam, sługom swoim, cieszyć się trwałym zdrowiem duszy i ciała, i za wstawiennictwem Najświętszej Maryi, zawsze Dziewicy, uwolnij nas od doczesnych utrapień i obdarz wieczną radością. Przez Chrystusa, Pana naszego. Amen.'
    ]
  },
  {
    id: 'serce_jezusa',
    title: 'Litania do Najświętszego Serca Pana Jezusa',
    subtitle: '33 wezwania uwielbienia i przebłagania Bożego Serca',
    latinTitle: 'Litaniae de Sacratissimo Corde Iesu',
    category: 'Pańskie',
    description: 'Jedna z najbardziej poruszających litanii Kościoła, odsłaniająca ogień miłości gorejącej w zranionym Sercu Odkupiciela.',
    openingPrayers: [
      'Kyrie eleison, Chryste eleison, Kyrie eleison.',
      'Chryste, usłysz nas. Chryste, wysłuchaj nas.',
      'Ojcze z nieba, Boże — zmiłuj się nad nami.',
      'Synu, Odkupicielu świata, Boże — zmiłuj się nad nami.',
      'Duchu Święty, Boże — zmiłuj się nad nami.',
      'Święta Trójco, Jedyny Boże — zmiłuj się nad nami.'
    ],
    sections: [
      {
        sectionTitle: '33 Wezwania do Boskiego Serca',
        invocations: [
          { invocation: 'Serce Jezusa, Syna Ojca Przedwiecznego', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, w łonie Matki Dziewicy przez Ducha Świętego utworzone', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, ze Słowem Bożym istotowo zjednoczone', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, nieskończonego majestatu', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, świątynio Boga potężna', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, przybytku Najwyższego', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, domie Boży i bramo niebios', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, gorejące ognisko miłości', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, sprawiedliwości i miłości skarbnico', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, dobroci i miłości pełne', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, cnót wszelkich bezdenna głębino', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, wszelkiej chwały najgodniejsze', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, królu i zjednoczenie serc wszystkich', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, w którym są wszystkie skarby mądrości i umiejętności', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, w którym mieszka cała pełnia Bóstwa', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, w którym sobie Ojciec bardzo upodobał', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, z którego pełni wszyscyśmy otrzymali', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, odwieczne upragnienie świata', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, cierpliwe i wielkiego miłosierdzia', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, hojne dla wszystkich, którzy Cię wzywają', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, źródło życia i świętości', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, przebłaganie za grzechy nasze', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, zniewagami nasycone', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, dla nieprawości naszych starte', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, aż do śmierci posłuszne', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, włócznią przebite', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, źródło wszelkiej pociechy', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, życie i zmartwychwstanie nasze', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, pokoju i pojednanie nasze', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, krwawa ofiaro grzeszników', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, zbawienie ufających Tobie', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, nadziejo w Tobie umierających', response: 'zmiłuj się nad nami' },
          { invocation: 'Serce Jezusa, rozkoszy Wszystkich Świętych', response: 'zmiłuj się nad nami' }
        ]
      }
    ],
    concludingPrayers: [
      'Baranku Boży, który gładzisz grzechy świata — przepuść nam, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — wysłuchaj nas, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — zmiłuj się nad nami.',
      'Jezu cichy i pokornego serca, uczyń serca nasze według Serca Twego.',
      'Módlmy się: Wszechmogący, wieczny Boże, wejrzyj na Serce najmilszego Syna swego i na chwałę, i zadośćuczynienie, jakie w imieniu grzeszników Ci składa; daj się przebłagać tym, którzy żebrzą Twojego miłosierdzia, i racz im udzielić przebaczenia w imię tegoż Syna swego, Jezusa Chrystusa, który z Tobą żyje i króluje na wieki wieków. Amen.'
    ]
  },
  {
    id: 'milosierdzie_boze',
    title: 'Litania do Miłosierdzia Bożego',
    subtitle: 'Napisana przez św. Siostrę Faustynę Kowalską w Dzienniczku',
    category: 'Pańskie',
    description: 'Litania oparta na mistycznych zapiskach św. Faustyny (Dz. 949), wysławiająca niezgłębione przymioty miłosierdzia Trójcy Przenajświętszej.',
    openingPrayers: [
      'Kyrie eleison, Chryste eleison, Kyrie eleison.',
      'Chryste, usłysz nas. Chryste, wysłuchaj nas.',
      'Ojcze z nieba, Boże — zmiłuj się nad nami.',
      'Synu, Odkupicielu świata, Boże — zmiłuj się nad nami.',
      'Duchu Święty, Boże — zmiłuj się nad nami.',
      'Święta Trójco, Jedyny Boże — zmiłuj się nad nami.'
    ],
    sections: [
      {
        sectionTitle: 'Wezwania Ufności',
        invocations: [
          { invocation: 'Miłosierdzie Boże, wypływające z łona Ojca', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, największy przymiocie Bóstwa', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, tajemnico niepojęta', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, źródło tryskające z tajemnicy Trójcy Przenajświętszej', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, niezgłębione przez żaden umysł ludzki ani anielski', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, z którego tryska wszelkie życie i szczęście', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, ponad niebiosa', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, źródło cudów i dziwów', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, ogarniające wszechświat cały', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, zstępujące na świat w Osobie Słowa Wcielonego', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, które wypłynęło z otwartej rany Serca Jezusowego', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, zawarte w Sercu Jezusa dla nas, a szczególnie dla grzeszników', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, niezgłębione w ustanowieniu świętej Hostii', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, w ufundowaniu Kościoła świętego', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, w sakramencie chrztu świętego', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, w usprawiedliwieniu nas przez Jezusa Chrystusa', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, towarzyszące nam przez całe życie', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, ogarniające nas szczególnie w godzinie śmierci', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, darzące nas życiem nieśmiertelnym', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, towarzyszące nam w każdym momencie bytu', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, chroniące nas od ognia piekielnego', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, w nawróceniu grzeszników zatwardziałych', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, zdumienie dla aniołów, niepojęte dla świętych', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, niezgłębione we wszystkich tajemnicach Bożych', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, dźwigające nas z wszelkiej nędzy', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, źródło naszego szczęścia i wesela', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, w powołaniu nas z nicości do bytu', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, ogarniające wszystkie dzieła rąk Jego', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, korono wszystkich dzieł Bożych', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, w którym wszyscy jesteśmy zanurzeni', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, słodkie ukojenie dla serc udręczonych', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, jedyna nadziejo dusz zrozpaczonych', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, odpocznienie serc, pokoju wśród trwogi', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, rozkoszy i zachwycie dusz świętych', response: 'ufam Tobie' },
          { invocation: 'Miłosierdzie Boże, budzące ufność wbrew nadziei', response: 'ufam Tobie' }
        ]
      }
    ],
    concludingPrayers: [
      'Baranku Boży, który gładzisz grzechy świata — przepuść nam, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — wysłuchaj nas, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — zmiłuj się nad nami.',
      'Miłosierdzie Boże ponad wszystkie dzieła Jego. Przeto miłosierdzie Pańskie na wieki wychwalać będę.',
      'Módlmy się: Boże, którego miłosierdzie jest niezgłębione, a skarby litości nieprzebrane, wejrzyj na nas łaskawie i pomnóż w nas miłosierdzie swoje, abyśmy w chwilach ciężkich nie rozpaczali ani nie upadali na duchu, lecz z wielką ufnością poddali się woli Twojej świętej, która jest miłością i miłosierdziem samym. Przez Pana naszego Jezusa Chrystusa, Króla miłosierdzia, który z Tobą i Duchem Świętym okazuje nam miłosierdzie na wieki wieków. Amen.'
    ]
  },
  {
    id: 'sw_jozef',
    title: 'Litania do św. Józefa',
    subtitle: 'Z wezwaniami dodanymi przez papieża Franciszka na Rok św. Józefa',
    category: 'Do Świętych',
    description: 'Litania ku czci Opiekuna Zbawiciela i Patrona Kościoła powszechnego, postrachu duchów piekielnych.',
    openingPrayers: [
      'Kyrie eleison, Chryste eleison, Kyrie eleison.',
      'Chryste, usłysz nas. Chryste, wysłuchaj nas.',
      'Ojcze z nieba, Boże — zmiłuj się nad nami.',
      'Synu, Odkupicielu świata, Boże — zmiłuj się nad nami.',
      'Duchu Święty, Boże — zmiłuj się nad nami.',
      'Święta Trójco, Jedyny Boże — zmiłuj się nad nami.'
    ],
    sections: [
      {
        sectionTitle: 'Wezwania do św. Józefa',
        invocations: [
          { invocation: 'Święta Maryjo', response: 'módl się za nami' },
          { invocation: 'Święty Józefie', response: 'módl się za nami' },
          { invocation: 'Przesławny Potomku Dawida', response: 'módl się za nami' },
          { invocation: 'Światło Patriarchów', response: 'módl się za nami' },
          { invocation: 'Oblubieńcze Bogarodzicy', response: 'módl się za nami' },
          { invocation: 'Stróżu Odkupiciela', response: 'módl się za nami' },
          { invocation: 'Przeczysty Stróżu Dziewicy', response: 'módl się za nami' },
          { invocation: 'Żywicielu Syna Bożego', response: 'módl się za nami' },
          { invocation: 'Troskliwy Obrońco Chrystusa', response: 'módl się za nami' },
          { invocation: 'Sługo Chrystusa', response: 'módl się za nami' },
          { invocation: 'Sługo zbawienia', response: 'módl się za nami' },
          { invocation: 'Głowo Najświętszej Rodziny', response: 'módl się za nami' },
          { invocation: 'Józefie najsprawiedliwszy', response: 'módl się za nami' },
          { invocation: 'Józefie najczystszy', response: 'módl się za nami' },
          { invocation: 'Józefie najroztropniejszy', response: 'módl się za nami' },
          { invocation: 'Józefie najmężniejszy', response: 'módl się za nami' },
          { invocation: 'Józefie najposłuszniejszy', response: 'módl się za nami' },
          { invocation: 'Józefie najwierniejszy', response: 'módl się za nami' },
          { invocation: 'Zwierciadło cierpliwości', response: 'módl się za nami' },
          { invocation: 'Miłośniku ubóstwa', response: 'módl się za nami' },
          { invocation: 'Wzorze pracujących', response: 'módl się za nami' },
          { invocation: 'Ozdobo życia rodzinnego', response: 'módl się za nami' },
          { invocation: 'Opiekunie dziewic', response: 'módl się za nami' },
          { invocation: 'Podporo rodzin', response: 'módl się za nami' },
          { invocation: 'Podporo w trudnościach', response: 'módl się za nami' },
          { invocation: 'Pociecho nieszczęśliwych', response: 'módl się za nami' },
          { invocation: 'Nadziejo chorych', response: 'módl się za nami' },
          { invocation: 'Patronie wygnańców', response: 'módl się za nami' },
          { invocation: 'Patronie cierpiących', response: 'módl się za nami' },
          { invocation: 'Patronie ubogich', response: 'módl się za nami' },
          { invocation: 'Patronie umierających', response: 'módl się za nami' },
          { invocation: 'Postrachu duchów piekielnych', response: 'módl się za nami' },
          { invocation: 'Opiekunie Kościoła świętego', response: 'módl się za nami' }
        ]
      }
    ],
    concludingPrayers: [
      'Baranku Boży, który gładzisz grzechy świata — przepuść nam, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — wysłuchaj nas, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — zmiłuj się nad nami.',
      'Ustanowił go panem domu swego. I zarządcą wszystkich posiadłości swoich.',
      'Módlmy się: Boże, Ty w niewysłowionej Opatrzności wybrałeś świętego Józefa na Oblubieńca Najświętszej Rodzicielki Twojego Syna, spraw, abyśmy oddając mu cześć na ziemi jako Opiekunowi, zasłużyli na jego orędownictwo w niebie. Przez Chrystusa, Pana naszego. Amen.'
    ]
  },
  {
    id: 'duch_swiety_litania',
    title: 'Litania do Ducha Świętego',
    subtitle: 'Modlitwa o dary, owoce i uświęcające działanie Ducha Pocieszyciela',
    category: 'Do Ducha Świętego',
    description: 'Błagalna litania wzywająca Trzecią Osobę Trójcy Przenajświętszej o uświęcenie duszy i napełnienie darami nieba.',
    openingPrayers: [
      'Kyrie eleison, Chryste eleison, Kyrie eleison.',
      'Chryste, usłysz nas. Chryste, wysłuchaj nas.',
      'Ojcze z nieba, Boże — zmiłuj się nad nami.',
      'Synu, Odkupicielu świata, Boże — zmiłuj się nad nami.',
      'Duchu Święty, Boże — zmiłuj się nad nami.',
      'Święta Trójco, Jedyny Boże — zmiłuj się nad nami.'
    ],
    sections: [
      {
        sectionTitle: 'Tytuły i Dary Ducha Świętego',
        invocations: [
          { invocation: 'Duchu Święty, który od Ojca i Syna pochodzisz', response: 'zmiłuj się nad nami' },
          { invocation: 'Duchu Święty, współistotny Ojcu i Synowi', response: 'zmiłuj się nad nami' },
          { invocation: 'Obietnico Ojca chwalebna', response: 'zmiłuj się nad nami' },
          { invocation: 'Dawco łask wszelkich', response: 'zmiłuj się nad nami' },
          { invocation: 'Światłości Niebieska', response: 'zmiłuj się nad nami' },
          { invocation: 'Duchu mądrości i rozumu', response: 'zmiłuj się nad nami' },
          { invocation: 'Duchu rady i męstwa', response: 'zmiłuj się nad nami' },
          { invocation: 'Duchu umiejętności i pobożności', response: 'zmiłuj się nad nami' },
          { invocation: 'Duchu bojaźni Bożej', response: 'zmiłuj się nad nami' },
          { invocation: 'Duchu wiary, nadziei i miłości', response: 'zmiłuj się nad nami' },
          { invocation: 'Duchu pokory i czystości', response: 'zmiłuj się nad nami' },
          { invocation: 'Duchu prawdy i pokoju', response: 'zmiłuj się nad nami' },
          { invocation: 'Duchu uświęcający serca', response: 'zmiłuj się nad nami' },
          { invocation: 'Pocieszycielu w utrapieniach', response: 'zmiłuj się nad nami' },
          { invocation: 'Ogniu gorejący miłością Bożą', response: 'zmiłuj się nad nami' }
        ]
      }
    ],
    concludingPrayers: [
      'Baranku Boży, który gładzisz grzechy świata — przepuść nam, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — wysłuchaj nas, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — zmiłuj się nad nami.',
      'Stwórz, o Boże, we mnie serce czyste. I odnów w mojej piersi ducha niezwyciężonego.',
      'Módlmy się: Boże, któryś serca wiernych światłem Ducha Świętego oświecił, daj nam w tymże Duchu poznać to, co jest prawe, i Jego pociechą zawsze się radować. Przez Chrystusa, Pana naszego. Amen.'
    ]
  },
  {
    id: 'charbel_litania',
    title: 'Litania do św. Charbela Makhloufa',
    subtitle: 'Modlitwa błagalna do wielkiego Pustelnika i Cudotwórcy z Annaya',
    category: 'Do Świętych',
    description: 'Błagalne wezwania do św. Charbela o uzdrowienie chorych, ocalenie przed pokusami, łaskę czystości i głębokiej modlitwy.',
    openingPrayers: [
      'Kyrie eleison, Chryste eleison, Kyrie eleison.',
      'Chryste, usłysz nas. Chryste, wysłuchaj nas.',
      'Ojcze z nieba, Boże — zmiłuj się nad nami.',
      'Synu, Odkupicielu świata, Boże — zmiłuj się nad nami.',
      'Duchu Święty, Boże — zmiłuj się nad nami.',
      'Święta Trójco, Jedyny Boże — zmiłuj się nad nami.'
    ],
    sections: [
      {
        sectionTitle: 'Wezwania do św. Charbela',
        invocations: [
          { invocation: 'Święty Charbelu, pustelniku z Annaya', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, chlubo Kościoła maronickiego', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, niestrudzony czcicielu Eucharystii', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, trwający na nieustannej adoracji', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, wonności cnót ewangelicznych', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, wzorze posłuszeństwa i pokory', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, miłośniku surowego ubóstwa', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, mistrzu milczenia i ascezy', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, czuły czcicielu Matki Bożej', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, aniele w ludzkim ciele', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, lekarzu chorych i cierpiących', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, nadziejo w chorobach nieuleczalnych', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, pocieszycielu udręczonych i strapionych', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, zwiastunie pokoju i przebaczenia', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, potężny pogromco złych duchów', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, orędowniku nawrócenia zatwardziałych grzeszników', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, którego ciało oparło się zepsuciu grobu', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, promieniujący cudownym światłem', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, źródło uzdrawiającego oleju łaski', response: 'módl się za nami' },
          { invocation: 'Święty Charbelu, opiekunie i obrońco naszych rodzin', response: 'módl się za nami' }
        ]
      }
    ],
    concludingPrayers: [
      'Baranku Boży, który gładzisz grzechy świata — przepuść nam, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — wysłuchaj nas, Panie.',
      'Baranku Boży, który gładzisz grzechy świata — zmiłuj się nad nami.',
      'Módl się za nami, święty Charbelu. Abyśmy się stali godnymi obietnic Chrystusowych.',
      'Módlmy się: Boże, Ty powołałeś świętego Charbela, mnicha i pustelnika, do samotności pustelni, aby w nieustannej modlitwie i pokucie zjednoczył się z Twoim Synem, Jezusem Chrystusem, a po śmierci uczyniłeś go potężnym orędownikiem chorych i cierpiących; spraw za jego wstawiennictwem, abyśmy otrzymali potrzebne nam łaski i naśladując jego cnoty, doszli do wiecznej radości w niebie. Przez Chrystusa, Pana naszego. Amen.'
    ]
  }
];
