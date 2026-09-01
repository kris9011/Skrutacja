import { RandomScriptureQuote } from '../types';

export const RANDOM_SCRIPTURE_QUOTES: RandomScriptureQuote[] = [
  // 1. Ewangelie
  {
    id: 'rnd_mt_11_28',
    siglum: 'Mt 11, 28-30',
    bookName: 'Ewangelia wg św. Mateusza',
    testament: 'NT',
    category: 'Ewangelia' as any,
    title: 'Przyjdźcie do Mnie wszyscy, którzy utrudzeni jesteście',
    text: '«Przyjdźcie do Mnie wszyscy, którzy utrudzeni i obciążeni jesteście, a Ja wam dam ukojenie. Weźcie moje jarzmo na siebie i uczcie się ode Mnie, bo jestem cichy i pokorny sercem, a znajdziecie ukojenie dla dusz waszych. Albowiem jarzmo moje jest słodkie, a moje brzemię lekkie».',
    theologicalContext: 'Chrystus objawia się jako źródło prawdziwego odpoczynku i pokoju. Jego jarzmo to miłość i posłuszeństwo Ojcu.',
    crossReferencesPreview: [
      { siglum: 'Jr 6, 16', relation: 'Zapowiedź ukojenia u Proroka', text: 'Stańcie na drogach i patrzcie... a znajdziecie odpoczynek dla dusz waszych.', testament: 'ST' },
      { siglum: 'J 14, 27', relation: 'Pokój Chrystusowy', text: 'Pokój zostawiam wam, pokój mój wam daję. Nie tak jak daje świat, Ja wam daję.', testament: 'NT' },
      { siglum: 'Syr 51, 23-27', relation: 'Mądrość dająca wytchnienie', text: 'Przybądźcie do mnie, wy, którym brak wykształcenia... znajdziecie dla siebie wielki odpoczynek.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_j_1_14',
    siglum: 'J 1, 14',
    bookName: 'Ewangelia wg św. Jana',
    testament: 'NT',
    category: 'Ewangelia' as any,
    title: 'Słowo stało się Ciałem i zamieszkało wśród nas',
    text: 'A Słowo stało się ciałem i zamieszkało wśród nas. I oglądaliśmy Jego chwałę, chwałę, jaką Jednorodzony otrzymuje od Ojca, pełen łaski i prawdy.',
    theologicalContext: 'Tajemnica Wcielenia: Niewidzialny Bóg wkracza w historię człowieka, stając się Namiotem Spotkania (Szekina) pełnym łaski.',
    crossReferencesPreview: [
      { siglum: 'Wj 40, 34-35', relation: 'Obłok chwały w Namiocie Spotkania', text: 'Wtedy to obłok okrył Namiot Spotkania, a chwała Pana napełniła przybytek.', testament: 'ST' },
      { siglum: '1 J 1, 1-3', relation: 'Naoczne świadectwo o Słowie Życia', text: 'To wam oznajmiamy, cośmy usłyszeli, o czym na własne oczy się przekonaliśmy...', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_j_15_5',
    siglum: 'J 15, 5',
    bookName: 'Ewangelia wg św. Jana',
    testament: 'NT',
    category: 'Ewangelia' as any,
    title: 'Krzew Winny i Latorośle',
    text: '«Ja jestem krzewem winnym, wy – latoroślami. Kto trwa we Mnie, a Ja w nim, ten przynosi owoc obfity, ponieważ beze Mnie nic nie możecie uczynić».',
    theologicalContext: 'Mistyczna jedność ucznia z Chrystusem: tylko trwanie w Jego miłości i Słowie przynosi trwały owoc zbawienia.',
    crossReferencesPreview: [
      { siglum: 'Ps 80, 9-16', relation: 'Winnica przeniesiona z Egiptu', text: 'Przeniosłeś winorośl z Egiptu... znowu wejrzyj z nieba, zobacz i nawiedź tę latorośl.', testament: 'ST' },
      { siglum: 'Ga 2, 20', relation: 'Życie w Chrystusie', text: 'Teraz zaś już nie ja żyję, lecz żyje we mnie Chrystus.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_j_14_6',
    siglum: 'J 14, 6',
    bookName: 'Ewangelia wg św. Jana',
    testament: 'NT',
    category: 'Ewangelia' as any,
    title: 'Ja jestem Drogą, Prawdą i Życiem',
    text: 'Odpowiedział mu Jezus: «Ja jestem drogą i prawdą, i życiem. Nikt nie przychodzi do Ojca inaczej jak tylko przeze Mnie».',
    theologicalContext: 'Jezus jest jedynym Pośrednikiem, Prawdą która wyzwala, i Życiem wiecznym otwierającym przystęp do Boga Ojca.',
    crossReferencesPreview: [
      { siglum: 'Hbr 10, 19-20', relation: 'Droga nowa i żywa przez zasłonę', text: 'Mamy pewność, iż wejdziemy do Miejsca Świętego przez krew Jezusa drogą nową i żywą...', testament: 'NT' },
      { siglum: 'Ps 27, 11', relation: 'Naucz mnie Twej drogi', text: 'Naucz mnie, Panie, Twej drogi i prowadź mnie ścieżką prostą.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_lk_1_37_38',
    siglum: 'Łk 1, 37-38',
    bookName: 'Ewangelia wg św. Łukasza',
    testament: 'NT',
    category: 'Ewangelia' as any,
    title: 'Dla Boga nie ma nic niemożliwego – Fiat Maryi',
    text: '«Dla Boga bowiem nie ma nic niemożliwego». Na to rzekła Maryja: «Oto ja służebnica Pańska, niech mi się stanie według słowa twego». Wtedy odszedł od Niej anioł.',
    theologicalContext: 'Pełne zaufanie Opatrzności i posłuszeństwo wiary, które otwiera bramę dla Wcielenia Słowa.',
    crossReferencesPreview: [
      { siglum: 'Rdz 18, 14', relation: 'Czy jest coś niemożliwego dla Pana?', text: 'Czy jest coś, co byłoby zbyt trudne dla Pana? Za rok w tym samym czasie wrócę do ciebie i Sara będzie miała syna.', testament: 'ST' },
      { siglum: 'Rz 4, 20-21', relation: 'Wiara Abrahama', text: 'Nie okazał powątpiewania... mając pewność, że mocen jest On również wypełnić, co obiecał.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_mk_10_45',
    siglum: 'Mk 10, 45',
    bookName: 'Ewangelia wg św. Marka',
    testament: 'NT',
    category: 'Ewangelia' as any,
    title: 'Syn Człowieczy nie przyszedł, aby Mu służono',
    text: '«Bo i Syn Człowieczy nie przyszedł, aby Mu służono, lecz żeby służyć i dać swoje życie na okup za wielu».',
    theologicalContext: 'Królewska diakonia i ofiara ekspiacyjna Chrystusa, Sługi Pańskiego.',
    crossReferencesPreview: [
      { siglum: 'Iz 53, 10-12', relation: 'Cierpiący Sługa oddający życie', text: 'Jeśli wyda swe życie na ofiarę za grzechy, ujrzy potomstwo... On poniósł grzechy wielu.', testament: 'ST' },
      { siglum: 'Flp 2, 7-8', relation: 'Kenoza i uniżenie', text: 'Przyjął postać sługi... uniżył samego siebie, stając się posłusznym aż do śmierci krzyżowej.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_mt_6_33',
    siglum: 'Mt 6, 33-34',
    bookName: 'Ewangelia wg św. Mateusza',
    testament: 'NT',
    category: 'Ewangelia' as any,
    title: 'Szukajcie wpierw Królestwa Bożego',
    text: '«Starajcie się naprzód o królestwo Boga i o Jego sprawiedliwość, a to wszystko będzie wam dodane. Nie troszczcie się więc zbytnio o jutro, bo jutrzejszy dzień sam o siebie troszczyć się będzie. Dosyć ma dzień każdy swojej biedy».',
    theologicalContext: 'Uwolnienie od lęku egzystencjalnego i oddanie życia w ręce troskliwego Ojca niebieskiego.',
    crossReferencesPreview: [
      { siglum: '1 P 5, 7', relation: 'Złożenie trosk na Pana', text: 'Wszystkie troski wasze przerzućcie na Niego, gdyż On ma o was staranie.', testament: 'NT' },
      { siglum: 'Ps 37, 4-5', relation: 'Powierz Panu swoją drogę', text: 'Raduj się w Panu, a On spełni pragnienia twego serca. Powierz Panu swoją drogę i zaufaj Mu: On sam będzie działał.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_lk_15_20',
    siglum: 'Łk 15, 20-24',
    bookName: 'Ewangelia wg św. Łukasza',
    testament: 'NT',
    category: 'Ewangelia' as any,
    title: 'Miłosierny Ojciec wybiega naprzeciw marnotrawnemu synowi',
    text: '«A gdy był jeszcze daleko, ujrzał go jego ojciec i wzruszył się głęboko; wybiegł naprzeciw niego, rzucił mu się na szyję i ucałował go... Przyprowadźcie utuczone cielę i zabijcie: będziemy ucztować i bawić się, ponieważ ten mój syn był umarły, a znów ożył; zaginął, a odnalazł się».',
    theologicalContext: 'Niewyczerpane miłosierdzie Boga Ojca, który nie czeka na usprawiedliwienia, lecz przywraca godność synostwa.',
    crossReferencesPreview: [
      { siglum: 'Oz 11, 8-9', relation: 'Wzruszenie miłosierdzia Bożego', text: 'Moje serce na to się wzdryga i rozpalają się moje wnętrzności. Nie wykonam zapalczywości mego gniewu, bo Bogiem jestem, nie człowiekiem.', testament: 'ST' },
      { siglum: 'Ef 2, 4-5', relation: 'Bogaty w miłosierdzie', text: 'A Bóg, będąc bogaty w miłosierdzie, przez wielką swą miłość... umarłych na skutek występków ożywił nas z Chrystusem.', testament: 'NT' }
    ]
  },

  // 2. Prorocy (Stary Testament)
  {
    id: 'rnd_iz_43_1_4',
    siglum: 'Iz 43, 1-4',
    bookName: 'Księga Izajasza',
    testament: 'ST',
    category: 'Prorocy',
    title: 'Nie lękaj się, bo cię wykupiłem, wezwałem cię po imieniu: tyś moim!',
    text: '«Ale teraz tak mówi Pan, Stworzyciel twój, Jakubie, i Twórca twój, o Izraelu: Nie lękaj się, bo cię wykupiłem, wezwałem cię po imieniu; tyś moim! Gdy pójdziesz przez wody, Ja będę z tobą, i gdy przez rzeki, nie zatopią ciebie. Gdy pójdziesz przez ogień, nie spalisz się, i nie strawi cię płomień... Ponieważ drogi jesteś w moich oczach, nabrałeś wartości i Ja cię umiłowałem».',
    theologicalContext: 'Osobista, bezwarunkowa miłość Jahwe do człowieka, gwarancja Jego wiernej obecności w próbach i ciemnościach.',
    crossReferencesPreview: [
      { siglum: 'Rz 8, 38-39', relation: 'Żadne stworzenie nie odłączy nas od miłości', text: 'I jestem pewien, że ani śmierć, ani życie... nie zdoła nas odłączyć od miłości Boga w Chrystusie.', testament: 'NT' },
      { siglum: 'Ps 23, 4', relation: 'Chociażbym chodził ciemną doliną', text: 'Chociażbym chodził ciemną doliną, zła się nie ulęknę, bo Ty jesteś ze mną.', testament: 'ST' },
      { siglum: 'J 10, 3', relation: 'Woła owce po imieniu', text: 'Woła swoje owce po imieniu i wyprowadza je.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_jr_29_11_13',
    siglum: 'Jr 29, 11-13',
    bookName: 'Księga Jeremiasza',
    testament: 'ST',
    category: 'Prorocy',
    title: 'Zamiary pełne pokoju, a nie zguby',
    text: '«Jestem bowiem świadomy zamiarów, jakie mam wobec was – wyrocznia Pana – zamiarów pełnych pokoju, a nie zguby, by zapewnić wam przyszłość, jakiej oczekujecie. Będziecie Mnie wzywać, dążąc do Mnie, i dacie Mi się słyszeć. Będziecie Mnie szukać i znajdziecie Mnie, albowiem będziecie Mnie szukać całym swym sercem».',
    theologicalContext: 'Boży plan zbawienia przewyższa ludzkie wygnanie i kryzysy; obietnica spotkania z Bogiem dla szukających Go całym sercem.',
    crossReferencesPreview: [
      { siglum: 'Rz 8, 28', relation: 'Wszystko służy dobru miłujących Boga', text: 'Wiemy też, że Bóg z tymi, którzy Go miłują, współdziała we wszystkim dla ich dobra.', testament: 'NT' },
      { siglum: 'Pwt 4, 29', relation: 'Szukanie Boga całym sercem', text: 'Będziecie szukać Pana, Boga waszego, i znajdziecie Go, jeżeli będziecie Go szukali z całego serca.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_ez_36_26',
    siglum: 'Ez 36, 26-27',
    bookName: 'Księga Ezechiela',
    testament: 'ST',
    category: 'Prorocy',
    title: 'Nowe serce i Duch w waszym wnętrzu',
    text: '«I dam wam serce nowe i ducha nowego tchnę do waszego wnętrza, odbiorę wam serce kamienne, a dam wam serce z ciała. Ducha mojego chcę tchnąć w was i sprawić, byście żyli według mych nakazów i przestrzegali moich praw, i według nich postępowali».',
    theologicalContext: 'Nowe Stworzenie: dar Ducha Świętego, który przemienia zatwardziałe wnętrze człowieka w serce wrażliwe na Boga.',
    crossReferencesPreview: [
      { siglum: '2 Kor 3, 3', relation: 'List wypisany Duchem na tablicach serc', text: 'Ukazaliście się jako list Chrystusowy... napisany nie atramentem, lecz Duchem Boga żywego, nie na kamiennych tablicach, lecz na żywych tablicach serc.', testament: 'NT' },
      { siglum: 'Jr 31, 33', relation: 'Prawo wpisane w serce', text: 'Umieszczę swe prawo w głębi ich jestestwa i wypiszę na ich sercu.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_iz_40_29_31',
    siglum: 'Iz 40, 29-31',
    bookName: 'Księga Izajasza',
    testament: 'ST',
    category: 'Prorocy',
    title: 'Ci, co zaufali Panu, odzyskują siły i biegną bez zmęczenia',
    text: '«On daje siłę zmęczonemu i pomnaża moc bezsilnego. Chłopcy się męczą i nużą, młodzieńcy ustają i upadają, lecz ci, co zaufali Panu, odzyskują siły, otrzymują skrzydła jak orły: biegną bez zmęczenia, idą bez znużenia».',
    theologicalContext: 'Źródło nadprzyrodzonej siły w wierze i cierpliwym oczekiwaniu na działanie Bożej łaski.',
    crossReferencesPreview: [
      { siglum: '2 Kor 12, 9', relation: 'Moc doskonali się w słabości', text: '«Wystarczy ci mojej łaski. Moc bowiem w słabości się doskonali».', testament: 'NT' },
      { siglum: 'Ps 103, 5', relation: 'Młodość odnawia się jak u orła', text: 'On twoje dni nasyca dobrami: odmładza się jak orzeł twoja młodość.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_oz_2_16_21',
    siglum: 'Oz 2, 16. 21-22',
    bookName: 'Księga Ozeasza',
    testament: 'ST',
    category: 'Prorocy',
    title: 'Wyprowadzę ją na pustynię i będę mówił do jej serca',
    text: '«Dlatego chcę ją przynęcić, na pustynię ją wyprowadzić i mówić do jej serca... I poślubię cię sobie [znowu] na wieki, poślubię cię sobie przez sprawiedliwość i prawo, przez miłość i miłosierdzie. Poślubię cię sobie przez wierność, a poznasz Pana».',
    theologicalContext: 'Mistyczne zaślubiny Boga z człowiekiem: pustynia jako miejsce intymnego spotkania i odnowienia pierwszej miłości.',
    crossReferencesPreview: [
      { siglum: 'Ap 19, 7-9', relation: 'Gody Baranka i Jego Oblubienicy', text: 'Cieszmy się i radujmy... bo nadeszły Gody Baranka, a Jego Małżonka się przystroiła.', testament: 'NT' },
      { siglum: 'Pnp 8, 6-7', relation: 'Miłość potężna jak śmierć', text: 'Połóż mię jak pieczęć na twoim sercu... Żary jej to żary ognia, płomień Pański.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_mi_6_8',
    siglum: 'Mi 6, 8',
    bookName: 'Księga Micheasza',
    testament: 'ST',
    category: 'Prorocy',
    title: 'Czego żąda Pan od ciebie: czynić sprawiedliwość i miłować miłosierdzie',
    text: '«Oznajmiono ci, człowiecze, co jest dobre. I czegoż żąda Pan od ciebie, jeśli nie pełnienia sprawiedliwości, umiłowania życzliwości i pokornego obcowania z Bogiem twoim?»',
    theologicalContext: 'Istota prawdziwej religijności: nie zewnętrzne rytuały, lecz serce pełne sprawiedliwości, miłości bliźniego i pokory przed Bogiem.',
    crossReferencesPreview: [
      { siglum: 'Mt 23, 23', relation: 'To, co najważniejsze w Prawie', text: 'Zaniedbaliście to, co ważniejsze jest w Prawie: sprawiedliwość, miłosierdzie i wiarę.', testament: 'NT' },
      { siglum: 'Pwt 10, 12-13', relation: 'Wymagania Przymierza', text: 'A teraz, Izraelu, czego żąda od ciebie Pan, Bóg twój? Tylko tego, byś się bał Pana...', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_ha_3_17_19',
    siglum: 'Ha 3, 17-19',
    bookName: 'Księga Habakuka',
    testament: 'ST',
    category: 'Prorocy',
    title: 'Choćby drzewo figowe nie wydało pąków, ja będę się radował w Panu',
    text: '«Drzewo figowe wprawdzie nie rozwija pąków, nie dają plonu winnice, zawiódł owoc oliwek, a pola nie przynoszą żywności... Ja mimo to w Panu będę się radować, weselić się będę w Bogu, moim Zbawicielu. Pan Bóg – moją siłą, uczyni moje nogi jak u jeleni i na wyżyny mnie wyprowadzi».',
    theologicalContext: 'Wiara heroiczna: niezachwiane zaufanie Bogu pomimo całkowitego braku ludzkich zabezpieczeń i owoców.',
    crossReferencesPreview: [
      { siglum: 'Rz 4, 18', relation: 'Wiara wbrew nadziei', text: 'On to wbrew nadziei uwierzył nadziei, że stanie się ojcem wielu narodów.', testament: 'NT' },
      { siglum: 'Ps 18, 33-34', relation: 'Bóg czyni nogi jak u łani', text: 'Bóg, co mocą mnie opasuje... czyni moje stopy jak stopy łani i stawia mnie na wyżynach.', testament: 'ST' }
    ]
  },

  // 3. Psalmy i Księgi Mądrościowe
  {
    id: 'rnd_ps_139_1_5',
    siglum: 'Ps 139 (138), 1-5. 13-14',
    bookName: 'Księga Psalmów',
    testament: 'ST',
    category: 'Mądrość i Psalmy' as any,
    title: 'Panie, przenikasz mnie i znasz – cudownie mnie stworzyłeś',
    text: '«Panie, przenikasz mnie i znasz. Ty wiesz, kiedy siadam i wstaję, z daleka przenikasz moje myśli. Widzisz moje chodzenie i spoczynek, i wszystkie moje drogi są Ci znane... Ty bowiem utworzyłeś moje nerki, utkałeś mnie w łonie mej matki. Dziękuję Ci, że mnie stworzyłeś tak cudownie, godne podziwu są Twoje dzieła».',
    theologicalContext: 'Misterium stworzenia każdego człowieka: Bóg zna najskrytsze tajniki naszego serca i kocha nas od łona matki.',
    crossReferencesPreview: [
      { siglum: 'Jr 1, 5', relation: 'Zanim ukształtowałem cię w łonie', text: 'Zanim ukształtowałem cię w łonie matki, znałem cię, nim przyszedłeś na świat, poświęciłem cię.', testament: 'ST' },
      { siglum: 'Łk 12, 7', relation: 'Policzone włosy na głowie', text: 'U was zaś nawet włosy na głowie wszystkie są policzone. Nie bójcie się: jesteście ważniejsi niż wiele wróbli.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_ps_23_1_6',
    siglum: 'Ps 23 (22), 1-6',
    bookName: 'Księga Psalmów',
    testament: 'ST',
    category: 'Mądrość i Psalmy' as any,
    title: 'Pan jest moim pasterzem, nie brak mi niczego',
    text: '«Pan jest moim pasterzem, nie brak mi niczego. Pozwala mi leżeć na zielonych pastwiskach. Prowadzi mnie nad wody, gdzie mogę odpocząć: orzeźwia moją duszę. Wiedzie mnie po właściwych ścieżkach przez wzgląd na swoje imię. Chociażbym chodził ciemną doliną, zła się nie ulęknę, bo Ty jesteś ze mną».',
    theologicalContext: 'Ostateczne wyznanie ufności: Pasterz, który nie opuszcza owcy nawet w dolinie cienia śmierci i przygotowuje stół w Domu Pańskim.',
    crossReferencesPreview: [
      { siglum: 'J 10, 11-14', relation: 'Dobry Pasterz daje życie', text: 'Ja jestem dobrym pasterzem. Dobry pasterz daje życie swoje za owce... Znam owce moje, a moje Mnie znają.', testament: 'NT' },
      { siglum: 'Ez 34, 11-16', relation: 'Sam Bóg zatroszczy się o swe owce', text: 'Oto Ja sam będę szukał moich owiec i będę miał o nie pieczę... zagubioną odszukam, skaleczoną opatrzę.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_ps_27_1',
    siglum: 'Ps 27 (26), 1. 4',
    bookName: 'Księga Psalmów',
    testament: 'ST',
    category: 'Mądrość i Psalmy' as any,
    title: 'Pan moim światłem i zbawieniem moim: kogóż mam się lękać?',
    text: '«Pan moim światłem i zbawieniem moim: kogóż mam się lękać? Pan obroną mojego życia: przed kim mam się trwożyć?... O jedno proszę Pana, tego poszukuję: bym w domu Pańskim mieszkał po wszystkie dni mego życia, abym zażywał słodyczy Pana i napawał się widokiem Jego przybytku».',
    theologicalContext: 'Zwycięstwo nad lękiem dzięki obecności Bożej; pragnienie stałego przebywania w bliskości Najwyższego.',
    crossReferencesPreview: [
      { siglum: 'J 8, 12', relation: 'Światłość świata', text: '«Ja jestem światłością świata. Kto idzie za Mną, nie będzie chodził w ciemności, lecz będzie miał światło życia».', testament: 'NT' },
      { siglum: 'Ps 84, 11', relation: 'Jeden dzień w Twoich przedsionkach', text: 'Zaiste, jeden dzień w przybytkach Twoich lepszy jest niż innych tysiące.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_prz_3_5_6',
    siglum: 'Prz 3, 5-6',
    bookName: 'Księga Przysłów',
    testament: 'ST',
    category: 'Mądrość i Psalmy' as any,
    title: 'Zaufaj Panu z całego serca, nie polegaj na własnym rozumie',
    text: '«Z całego serca Bogu zaufaj, nie polegaj na własnym rozumie, pamiętaj o Nim na wszystkich swych drogach, a On twe ścieżki wyrówna».',
    theologicalContext: 'Mądrość biblijna wzywa do wyrzeczenia się pychy samowystarczalności na rzecz całkowitego zawierzenia Panu.',
    crossReferencesPreview: [
      { siglum: 'Jr 17, 7-8', relation: 'Błogosławiony człowiek, który ufa Panu', text: 'Błogosławiony mąż, który pokłada ufność w Panu... jest jak drzewo zasadzone nad wodą.', testament: 'ST' },
      { siglum: 'Jk 1, 5-6', relation: 'Prośba o mądrość z wiarą', text: 'Jeśli komuś z was brakuje mądrości, niech prosi Boga... niech zaś prosi z wiarą, bez cienia wątpliwości.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_syr_2_1_5',
    siglum: 'Syr 2, 1-5',
    bookName: 'Mądrość Syracha',
    testament: 'ST',
    category: 'Mądrość i Psalmy' as any,
    title: 'Synu, jeśli masz zamiar służyć Panu, przygotuj swą duszę na doświadczenie',
    text: '«Synu, jeżeli masz zamiar służyć Panu, przygotuj swą duszę na doświadczenie! Zachowaj spokój serca i bądź cierpliwy, a nie trać równowagi w czasie utrapienia! Przylgnij do Niego, a nie odstępuj, abyś był wywyższony w twoim dniu ostatnim. Przyjmij wszystko, co przyjdzie na ciebie, a w zmiennych losach poniżenia bądź cierpliwy! Bo w ogniu doświadcza się złoto, a ludzi miłych Bogu – w piecu utrapienia».',
    theologicalContext: 'Duchowa próba jako oczyszczenie wiary i droga do prawdziwej chwały w Bogu.',
    crossReferencesPreview: [
      { siglum: '1 P 1, 6-7', relation: 'Wypróbowana wierność cenniejsza niż złoto', text: 'Przez to radujcie się, choć teraz musicie doznać trochę smutku... aby wartość waszej wiary okazała się cenniejsza od zniszczalnego złota.', testament: 'NT' },
      { siglum: 'Jk 1, 2-3', relation: 'Radość z doświadczeń', text: 'Za pełną radość poczytujcie to sobie, bracia moi, ilekroć spadają na was różne doświadczenia.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_koh_3_1_8',
    siglum: 'Koh 3, 1. 11',
    bookName: 'Księga Koheleta',
    testament: 'ST',
    category: 'Mądrość i Psalmy' as any,
    title: 'Wszystko ma swój czas i jest wyznaczona godzina na każdą sprawę',
    text: '«Wszystko ma swój czas i jest wyznaczona godzina na wszystkie sprawy pod niebem... Wszystko uczynił pięknym w swoim czasie, dał im nawet wieczność w ich serca, by jednakże człowiek nie pojął dzieła, którego Bóg dokonuje od początku aż do końca».',
    theologicalContext: 'Bóg jest Panem czasu i historii; w serce człowieka włożył pragnienie wieczności, które tylko On może nasycić.',
    crossReferencesPreview: [
      { siglum: 'Ga 4, 4-5', relation: 'Pełnia czasów', text: 'Gdy jednak nadeszła pełnia czasu, zesłał Bóg Syna swego, zrodzonego z niewiasty...', testament: 'NT' },
      { siglum: 'Ef 1, 9-10', relation: 'Plan na pełnię czasów', text: 'Oznajmił nam tajemnicę swej woli... aby wszystko na nowo zjednoczyć w Chrystusie jako Głowie.', testament: 'NT' }
    ]
  },

  // 4. Listy Apostolskie i Dzieje
  {
    id: 'rnd_rz_8_31_39',
    siglum: 'Rz 8, 31. 37-39',
    bookName: 'List do Rzymian',
    testament: 'NT',
    category: 'Dzieje i Listy Apostolskie' as any,
    title: 'Jeśli Bóg z nami, któż przeciwko nam? Zwyciężamy przez Tego, który nas umiłował',
    text: '«Cóż więc na to powiemy? Jeżeli Bóg z nami, któż przeciwko nam?... Ale we wszystkim tym odnosimy pełne zwycięstwo dzięki Temu, który nas umiłował. I jestem pewien, że ani śmierć, ani życie, ani aniołowie, ani Zwierzchności, ani rzeczy teraźniejsze, ani przyszłe, ani Moce, ani co wysokie, ani co głębokie, ani jakiekolwiek inne stworzenie nie zdoła nas odłączyć od miłości Boga, która jest w Chrystusie Jezusie, Panu naszym».',
    theologicalContext: 'Kulminacja teologii łaski: wieczne bezpieczeństwo chrześcijanina zakorzenione w nieodwołalnej miłości Chrystusa.',
    crossReferencesPreview: [
      { siglum: 'Iz 54, 10', relation: 'Góry mogą ustąpić, lecz miłość nie odstąpi', text: 'Bo góry mogą ustąpić i pagórki się zachwiać, ale miłość moja nie odstąpi od ciebie.', testament: 'ST' },
      { siglum: 'J 10, 28-29', relation: 'Nikt ich nie wyrwie z mojej ręki', text: 'Ja daję im życie wieczne... i nikt nie wyrwie ich z ręki mego Ojca.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_flp_4_6_7',
    siglum: 'Flp 4, 6-7',
    bookName: 'List do Filipian',
    testament: 'NT',
    category: 'Dzieje i Listy Apostolskie' as any,
    title: 'O nic się zbytnio nie troskajcie – Pokój Boży strzec będzie waszych serc',
    text: '«O nic się już zbytnio nie troskajcie, ale w każdej sprawie wasze prośby przedstawiajcie Bogu w modlitwie i błaganiu z dziękczynieniem! A pokój Boży, który przewyższa wszelki umysł, będzie strzegł waszych serc i myśli w Chrystusie Jezusie».',
    theologicalContext: 'Modlitwa pełna dziękczynienia uwalnia od lęku i przynosi nadprzyrodzony pokój przewyższający ludzkie kalkulacje.',
    crossReferencesPreview: [
      { siglum: 'Kol 3, 15', relation: 'Pokój Chrystusowy niech rządzi w sercach', text: 'A w sercach waszych niech rządzi pokój Chrystusowy, do którego też zostaliście wezwani.', testament: 'NT' },
      { siglum: 'Iz 26, 3', relation: 'Niezłomny umysł w pokoju', text: 'Umysłowi stałemu zapewniasz pokój, pokój, bo w Tobie pokłada nadzieję.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_2_kor_12_9',
    siglum: '2 Kor 12, 9-10',
    bookName: '2 List do Koryntian',
    testament: 'NT',
    category: 'Dzieje i Listy Apostolskie' as any,
    title: 'Wystarczy ci mojej łaski – Moc w słabości się doskonali',
    text: '«Lecz [Pan] mi powiedział: "Wystarczy ci mojej łaski. Moc bowiem w słabości się doskonali". Najchętniej więc będę się chlubił z moich słabości, aby zamieszkała we mnie moc Chrystusa... Ilekroć bowiem jestem słaby, wtedy jestem mocny».',
    theologicalContext: 'Paradoks Ewangelii: ludzka kruchość staje się naczyniem dla objawienia potęgi i zmartwychwstania Chrystusa.',
    crossReferencesPreview: [
      { siglum: '1 Kor 1, 27-29', relation: 'Bóg wybrał to, co niemocne', text: 'Bóg wybrał właśnie to, co niemocne w oczach świata, aby poniżyć to, co mocne.', testament: 'NT' },
      { siglum: 'Sdz 7, 2', relation: 'Zbyt liczny lud dla Gedeona', text: 'Pan rzekł do Gedeona: Zbyt liczny jest lud przy tobie, abym w jego ręce wydał Madianitów...', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_ga_2_19_20',
    siglum: 'Ga 2, 19-20',
    bookName: 'List do Galatów',
    testament: 'NT',
    category: 'Dzieje i Listy Apostolskie' as any,
    title: 'Razem z Chrystusem zostałem przybity do krzyża – żyje we mnie Chrystus',
    text: '«Razem z Chrystusem zostałem przybity do krzyża. Teraz zaś już nie ja żyję, lecz żyje we mnie Chrystus. Choć nadal prowadzę życie w ciele, jednak obecne moje życie jest życiem wiary w Syna Bożego, który umiłował mnie i samego siebie wydał za mnie».',
    theologicalContext: 'Chrzcielna śmierć dla starego człowieka i zmartwychwstanie do nowego życia z Chrystusem.',
    crossReferencesPreview: [
      { siglum: 'Rz 6, 4-6', relation: 'Pogrzebani z Nim przez chrzest w śmierć', text: 'Przez chrzest zanurzający nas w śmierć zostaliśmy razem z Nim pogrzebani...', testament: 'NT' },
      { siglum: 'Kol 3, 3-4', relation: 'Życie ukryte z Chrystusem w Bogu', text: 'Umarliście bowiem i wasze życie jest ukryte z Chrystusem w Bogu.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_1_j_4_16_19',
    siglum: '1 J 4, 16. 18-19',
    bookName: '1 List św. Jana',
    testament: 'NT',
    category: 'Dzieje i Listy Apostolskie' as any,
    title: 'Bóg jest miłością – w miłości nie ma lęku',
    text: '«Bóg jest miłością: kto trwa w miłości, trwa w Bogu, a Bóg trwa w nim... W miłości nie ma lęku, lecz doskonała miłość usuwa lęk, ponieważ lęk kojarzy się z karą. Ten zaś, kto się lęka, nie wydoskonalił się w miłości. My miłujemy [Boga], ponieważ On sam pierwszy nas umiłował».',
    theologicalContext: 'Bóg jest samą istotą Miłości (Agape). Doświadczenie Jego uprzedzającej miłości ulecza serce ze wszelkiego lęku.',
    crossReferencesPreview: [
      { siglum: 'J 3, 16', relation: 'Tak Bóg umiłował świat', text: 'Tak bowiem Bóg umiłował świat, że Syna swego Jednorodzonego dał, aby każdy, kto w Niego wierzy, nie zginął...', testament: 'NT' },
      { siglum: 'Pnp 8, 6', relation: 'Miłość potężniejsza niż grób', text: 'Żary jej to żary ognia, płomień Pański.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_hbr_4_12',
    siglum: 'Hbr 4, 12-13',
    bookName: 'List do Hebrajczyków',
    testament: 'NT',
    category: 'Dzieje i Listy Apostolskie' as any,
    title: 'Żywe jest Słowo Boże i skuteczne, ostrzejsze niż miecz obosieczny',
    text: '«Żywe bowiem jest słowo Boże, skuteczne i ostrzejsze niż wszelki miecz obosieczny, przenikające aż do rozdzielenia duszy i ducha, stawów i szpiku, zdolne osądzić pragnienia i myśli serca. Nie ma stworzenia, które by było przed Nim niewidzialne, przeciwnie, wszystko odkryte i odsłonięte jest przed oczami Tego, któremu musimy zdać sprawę».',
    theologicalContext: 'Moc Słowa Bożego w Skrutacji Pisma: Słowo bada sumienie, uzdrawia motywacje i odkrywa prawdę o kondycji człowieka.',
    crossReferencesPreview: [
      { siglum: 'Iz 55, 10-11', relation: 'Słowo nie wraca bezowocne', text: 'Słowo, które wychodzi z ust moich: nie wraca do Mnie bezowocne, zanim wpierw nie dokona tego, co chciałem.', testament: 'ST' },
      { siglum: 'Ef 6, 17', relation: 'Miecz Ducha, to jest Słowo Boże', text: 'Weźcie też hełm zbawienia i miecz Ducha, to jest słowo Boże.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_1_kor_13_4_8',
    siglum: '1 Kor 13, 4-8a',
    bookName: '1 List do Koryntian',
    testament: 'NT',
    category: 'Dzieje i Listy Apostolskie' as any,
    title: 'Hymn o Miłości: Miłość cierpliwa jest, łaskawa jest... Miłość nigdy nie ustaje',
    text: '«Miłość cierpliwa jest, łaskawa jest. Miłość nie zazdrości, nie szuka poklasku, nie unosi się pychą; nie dopuszcza się bezwstydu, nie szuka swego, nie unosi się gniewem, nie pamięta złego; nie cieszy się z niesprawiedliwości, lecz współweseli się z prawdą. Wszystko znosi, wszystkiemu wierzy, we wszystkim pokłada nadzieję, wszystko przetrzyma. Miłość nigdy nie ustaje».',
    theologicalContext: 'Najdoskonalszy portret Miłości Chrystusa i najwyższy charyzmat Ducha Świętego.',
    crossReferencesPreview: [
      { siglum: 'Kol 3, 14', relation: 'Więź doskonałości', text: 'Na to zaś wszystko przyobleczcie miłość, która jest więzią doskonałości.', testament: 'NT' },
      { siglum: 'Rz 5, 5', relation: 'Miłość Boża rozlana w sercach', text: 'A nadzieja zawieść nie może, ponieważ miłość Boża rozlana jest w sercach naszych przez Ducha Świętego.', testament: 'NT' }
    ]
  },

  // 5. Pięcioksiąg i Księgi Historyczne (Stary Testament)
  {
    id: 'rnd_rdz_12_1_3',
    siglum: 'Rdz 12, 1-3',
    bookName: 'Księga Rodzaju',
    testament: 'ST',
    category: 'Pięcioksiąg i Historia' as any,
    title: 'Powołanie Abrahama: Wyjdź z twojej ziemi, a będziesz błogosławieństwem',
    text: '«Pan rzekł do Abrama: "Wyjdź z twojej ziemi rodzinnej i z domu twego ojca do kraju, który ci ukażę. Uczynię bowiem z ciebie wielki naród, będę ci błogosławił i twoje imię rozsławię: staniesz się błogosławieństwem... przez ciebie będą otrzymywały błogosławieństwo ludy całej ziemi"».',
    theologicalContext: 'Początek historii zbawienia: wyjście w wierze w nieznane na Słowo Bożej obietnicy.',
    crossReferencesPreview: [
      { siglum: 'Hbr 11, 8', relation: 'Wiara Abrahama w wyjściu', text: 'Przez wiarę ten, którego nazwano Abrahamem, usłuchał wezwania, by wyruszyć... i wyszedł, nie wiedząc, dokąd idzie.', testament: 'NT' },
      { siglum: 'Ga 3, 8-9', relation: 'Błogosławieństwo narodów w Chrystusie', text: 'I stąd ci, którzy należą do wiary, otrzymują błogosławieństwo wraz z wierzącym Abrahamem.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_wj_14_13_14',
    siglum: 'Wj 14, 13-14',
    bookName: 'Księga Wyjścia',
    testament: 'ST',
    category: 'Pięcioksiąg i Historia' as any,
    title: 'Nie bójcie się! Pozostańcie na swoim miejscu, a zobaczycie zbawienie od Pana',
    text: '«Mojżesz odpowiedział ludowi: "Nie bójcie się! Pozostańcie na swoim miejscu, a zobaczycie zbawienie od Pana, jakie zgotuje wam dzisiaj. Egipcjan bowiem, których dzisiaj widzicie, nie zobaczycie już nigdy. Pan będzie walczył za was, a wy bądźcie spokojni!"».',
    theologicalContext: 'Wielka Pascha: zbawienie jest dziełem samego Boga; człowiek wezwany jest do spokoju i zaufania Jego potędze.',
    crossReferencesPreview: [
      { siglum: '1 Kor 10, 1-2', relation: 'Chrzest w Morzu Czerwonym', text: 'Ojcowie nasi wszyscy byli pod obłokiem, wszyscy przeszli przez morze i wszyscy byli ochrzczeni w Mojżesza...', testament: 'NT' },
      { siglum: '2 Krn 20, 17', relation: 'Nie wasza to wojna, lecz Boża', text: 'Nie wy tam będziecie walczyć: ustawcie się, stójcie i patrzcie na ocalenie Pana.', testament: 'ST' }
    ]
  },
  {
    id: 'rnd_pwt_6_4_7',
    siglum: 'Pwt 6, 4-7',
    bookName: 'Księga Powtórzonego Prawa',
    testament: 'ST',
    category: 'Pięcioksiąg i Historia' as any,
    title: 'Szema Izrael: Słuchaj, Izraelu, będziesz miłował Pana Boga twego z całego serca',
    text: '«Słuchaj, Izraelu, Pan jest naszym Bogiem – Panem jedynym. Będziesz miłował Pana, Boga twojego, z całego swego serca, z całej duszy swojej, ze wszystkich swych sił. Niech pozostaną w twym sercu te słowa, które ja ci dziś nakazuję. Wpoisz je twoim synom, będziesz o nich mówił przebywając w domu, w czasie podróży, kładąc się spać i wstając ze snu».',
    theologicalContext: 'Serce Przymierza: Szema – wezwanie do słuchania i całkowitej, niepodzielnej miłości jedynego Boga.',
    crossReferencesPreview: [
      { siglum: 'Mk 12, 29-30', relation: 'Pierwsze i największe przykazanie', text: 'Jezus odpowiedział: «Pierwsze jest: Słuchaj, Izraelu, Pan Bóg nasz jest jedynym Panem. Będziesz miłował Pana...»', testament: 'NT' },
      { siglum: '1 J 5, 3', relation: 'Wypełnienie miłości w posłuszeństwie', text: 'Albowiem miłość względem Boga polega na spełnianiu Jego przykazań, a przykazania Jego nie są ciężkie.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_joz_1_9',
    siglum: 'Joz 1, 9',
    bookName: 'Księga Jozuego',
    testament: 'ST',
    category: 'Pięcioksiąg i Historia' as any,
    title: 'Bądź mężny i mocny! Nie lękaj się, bo z tobą jest Pan, Bóg twój',
    text: '«Czyż ci nie rozkazałem: Bądź mężny i mocny? Nie bój się i nie lękaj, ponieważ z tobą jest Pan, Bóg twój, wszędzie, gdziekolwiek pójdziesz».',
    theologicalContext: 'Nakaz odwagi i męstwa oparty na obietnicy nieustannej obecności Boga we wszystkich walkach życia.',
    crossReferencesPreview: [
      { siglum: 'Mt 28, 20', relation: 'Jestem z wami po wszystkie dni', text: '«A oto Ja jestem z wami przez wszystkie dni, aż do skończenia świata».', testament: 'NT' },
      { siglum: 'Ef 6, 10', relation: 'Bądźcie mocni w Panu', text: 'W końcu, bądźcie mocni w Panu – siłą Jego potęgi.', testament: 'NT' }
    ]
  },

  // 6. Apokalipsa
  {
    id: 'rnd_ap_21_3_5',
    siglum: 'Ap 21, 3-5',
    bookName: 'Apokalipsa św. Jana',
    testament: 'NT',
    category: 'Apokalipsa',
    title: 'Oto przybytek Boga z ludźmi – Oto czynię wszystko nowe',
    text: '«I usłyszałem donośny głos mówiący od tronu: "Oto przybytek Boga z ludźmi: i zamieszka wraz z nimi, i będą oni Jego ludem, a On będzie «Bogiem z nimi». I otrze z ich oczu wszelką łzę, a śmierci już odtąd nie będzie. Ani żałoby, ni krzyku, ni trudu już [odtąd] nie będzie, bo pierwsze rzeczy przeminęły". I rzekł Zasiadający na tronie: "Oto czynię wszystko nowe"».',
    theologicalContext: 'Ostateczna nadzieja eschatologiczna: nowe niebo i nowa ziemia, wieczne pocieszenie i triumf Miłości Boga.',
    crossReferencesPreview: [
      { siglum: 'Iz 25, 8', relation: 'Otarte łzy ze wszystkich twarzy', text: 'Raz na zawsze zniszczy śmierć. Wtedy Pan Bóg otrze łzy z każdego oblicza.', testament: 'ST' },
      { siglum: 'Iz 65, 17', relation: 'Nowe niebiosa i nowa ziemia', text: 'Oto bowiem Ja stwarzam nowe niebiosa i nową ziemię; nie będzie się wspominać rzeczy dawnych.', testament: 'ST' },
      { siglum: '2 Kor 5, 17', relation: 'Nowe stworzenie w Chrystusie', text: 'Jeżeli więc ktoś pozostaje w Chrystusie, jest nowym stworzeniem. To, co dawne, minęło, oto wszystko stało się nowe.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_ap_3_20',
    siglum: 'Ap 3, 20',
    bookName: 'Apokalipsa św. Jana',
    testament: 'NT',
    category: 'Apokalipsa',
    title: 'Oto stoję u drzwi i kołaczę – Wejdę i będę z nim wieczerzał',
    text: '«Oto stoję u drzwi i kołaczę: jeśli kto posłyszy mój głos i drzwi otworzy, wejdę do niego i będę z nim wieczerzał, a on ze Mną».',
    theologicalContext: 'Czuła cierpliwość Zmartwychwstałego, który nie forsuje serca, lecz czeka na wolną odpowiedź wiary i wspólnotę eucharystyczną.',
    crossReferencesPreview: [
      { siglum: 'Pnp 5, 2', relation: 'Głos miłego kołaczącego', text: 'Głos mego miłego! Puka! "Otwórz mi, siostro moja, przyjaciółko moja..."', testament: 'ST' },
      { siglum: 'J 14, 23', relation: 'Przyjdziemy do niego i mieszkanie uczynimy', text: 'Jeśli Mnie kto miłuje, będzie zachowywał moją naukę... przyjdziemy do niego i będziemy u niego przebywać.', testament: 'NT' }
    ]
  },
  {
    id: 'rnd_ap_22_17',
    siglum: 'Ap 22, 17. 20',
    bookName: 'Apokalipsa św. Jana',
    testament: 'NT',
    category: 'Apokalipsa',
    title: 'Duch i Oblubienica mówią: Przyjdź! – Amen. Przyjdź, Panie Jezu!',
    text: '«A Duch i Oblubienica mówią: "Przyjdź!" A kto słyszy, niech powie: "Przyjdź!" I kto odczuwa pragnienie, niech przyjdzie, kto chce, niech darmo weźmie wodę życia... Mówi Ten, który o tym świadczy: "Zaiste, przyjdę niebawem". Amen. Przyjdź, Panie Jezu!»',
    theologicalContext: 'Maranatha: tęsknota Kościoła za powtórnym przyjściem Oblubieńca i dar darmo danej wody życia.',
    crossReferencesPreview: [
      { siglum: 'Iz 55, 1', relation: 'Wszyscy spragnieni, przyjdźcie do wody', text: 'Wszyscy spragnieni, przyjdźcie do wody, przyjdźcie, choć nie macie pieniędzy!', testament: 'ST' },
      { siglum: '1 Kor 16, 22', relation: 'Maranatha', text: 'Maran atha. Łaska Pana Jezusa niech będzie z wami!', testament: 'NT' }
    ]
  }
];

export function getRandomScriptureQuote(filterCategory?: string, filterTestament?: 'ST' | 'NT'): RandomScriptureQuote {
  let pool = RANDOM_SCRIPTURE_QUOTES;
  
  if (filterTestament) {
    pool = pool.filter(q => q.testament === filterTestament);
  }
  
  if (filterCategory && filterCategory !== 'Wszystkie' && filterCategory !== 'Całe Pismo Święte') {
    pool = pool.filter(q => q.category === filterCategory || (q.bookName && q.bookName.includes(filterCategory)));
  }

  if (pool.length === 0) {
    pool = RANDOM_SCRIPTURE_QUOTES;
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
