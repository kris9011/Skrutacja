export interface ChurchFatherBio {
  id: string;
  name: string;
  latinName?: string;
  greekName?: string;
  dates: string;
  title: string;
  tradition: 'Łacińska (Zachodnia)' | 'Grecka (Wschodnia)' | 'Syriacka / Orientalna';
  category: 'Ojcowie Apostolscy' | 'Wielcy Doktorzy Kościoła' | 'Szkoła Aleksandryjska' | 'Szkoła Antiocheńska' | 'Ojcowie Pustyni / Złoty Wiek' | 'Średniowieczni Kompilatorzy Patrystyczni';
  shortDescription: string;
  keyWorks: string[];
  spiritualCharisma: string;
}

export const CHURCH_FATHERS_DIRECTORY: ChurchFatherBio[] = [
  // Ojcowie Apostolscy
  {
    id: 'ignatius_antioch',
    name: 'Św. Ignacy Antiocheński',
    dates: 'ok. 35–108',
    title: 'Biskup Antiochii, Męczennik, Ojciec Apostolski',
    tradition: 'Grecka (Wschodnia)',
    category: 'Ojcowie Apostolscy',
    shortDescription: 'Uczeń św. Jana Ewangelisty. W listach do gmin chrześcijańskich uczył jedności z Chrystusem w Eucharystii i mistycznego pragnienia męczeństwa («Jestem Bożą pszenicą»).',
    keyWorks: ['Listy do Efezjan, Rzymian, Smyrneńczyków, Polikarpa'],
    spiritualCharisma: 'Eucharystocentryzm, wierność Tradycji apostolskiej i zjednoczenie w Kościele.'
  },
  {
    id: 'polycarp_smyrna',
    name: 'Św. Polikarp ze Smyrny',
    dates: 'ok. 69–155',
    title: 'Biskup Smyrny, Męczennik, Uczeń Apostołów',
    tradition: 'Grecka (Wschodnia)',
    category: 'Ojcowie Apostolscy',
    shortDescription: 'Bezpośredni uczeń apostołów, strażnik ortodoksji. Znany z niezłomnego wyznania wiary przed stosem («Osiemdziesiąt sześć lat służę Chrystusowi i nigdy mi nic złego nie uczynił»).',
    keyWorks: ['List do Filipian', 'Męczeństwo św. Polikarpa'],
    spiritualCharisma: 'Niezłomna wierność Ewangelii i naśladowanie Męki Pańskiej.'
  },
  {
    id: 'justin_martyr',
    name: 'Św. Justyn Męczennik (Filozof)',
    dates: 'ok. 100–165',
    title: 'Apologeta, Filozof Chrześcijański',
    tradition: 'Grecka (Wschodnia)',
    category: 'Ojcowie Apostolscy',
    shortDescription: 'Pierwszy wielki chrześcijański filozof. Ukazał, że ziarna Słowa (Logos Spermatikos) były obecne w historii, a pełnia Prawdy zajaśniała we Wcielonym Chrystusie.',
    keyWorks: ['I Apologia', 'II Apologia', 'Dialog z Żydem Tryfonem'],
    spiritualCharisma: 'Harmonia wiary i rozumu, wczesne opisy rytu Mszy Świętej i Chrztu.'
  },
  {
    id: 'irenaeus_lyon',
    name: 'Św. Ireneusz z Lyonu',
    dates: 'ok. 130–202',
    title: 'Biskup Lyonu, Doktor Jedności (Doctor Unitatis), Męczennik',
    tradition: 'Grecka (Wschodnia)',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Twórca teologii rekapitulacji (anakefalaiosis): Chrystus odnowił i naprawił w sobie całą ludzkość od Adama. Obrońca jedności Starego i Nowego Testamentu.',
    keyWorks: ['Adversus Haereses (Przeciw heretykom)', 'Wykład nauki apostolskiej'],
    spiritualCharisma: '«Chwałą Boga jest żyjący człowiek, a życiem człowieka jest oglądanie Boga».'
  },

  // Szkoła Aleksandryjska
  {
    id: 'clement_alexandria',
    name: 'Klemens Aleksandryjski',
    dates: 'ok. 150–215',
    title: 'Kierownik Szkoły Katechetycznej w Aleksandrii',
    tradition: 'Grecka (Wschodnia)',
    category: 'Szkoła Aleksandryjska',
    shortDescription: 'Pionier chrześcijańskiej pedagogii i alegorycznej interpretacji Pisma Świętego. Ukazywał Chrystusa jako Boskiego Wychowawcę (Paidagogos).',
    keyWorks: ['Protreptikos (Zachęta)', 'Paidagogos (Wychowawca)', 'Stromata (Kobierce)'],
    spiritualCharisma: 'Duchowy rozwój człowieka przez poznanie Słowa Bożego.'
  },
  {
    id: 'origen_alexandria',
    name: 'Orygenes z Aleksandrii',
    dates: '185–253',
    title: 'Biblista, Teolog, Twórca Heksapli',
    tradition: 'Grecka (Wschodnia)',
    category: 'Szkoła Aleksandryjska',
    shortDescription: 'Najpłodniejszy biblista starożytności. Opracował potrójny sens Pisma (cielesny/dosłowny, psychiczny/moralny, duchowy/alegoryczny). Nauczał, że całe Pismo jest jednym Ciałem Chrystusa.',
    keyWorks: ['Heksapla', 'Komentarze i homilie do prawie wszystkich ksiąg Biblii', 'De Principiis'],
    spiritualCharisma: 'Mistyczne poszukiwanie Chrystusa w każdym wersecie Starego i Nowego Przymierza.'
  },
  {
    id: 'athanasius_alexandria',
    name: 'Św. Atanazy Wielki',
    dates: '295–373',
    title: 'Patriarcha Aleksandrii, Filar Soboru Nicejskiego, Doktor Kościoła',
    tradition: 'Grecka (Wschodnia)',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Niezłomny obrońca Bóstwa Chrystusa przeciw arianizmowi («Bóg stał się człowiekiem, aby człowiek mógł stać się bogiem»). Autor żywota św. Antoniego.',
    keyWorks: ['O Wcieleniu Słowa (De Incarnatione)', 'Mowy przeciw arianom', 'Żywot św. Antoniego'],
    spiritualCharisma: 'Tajemnica przebóstwienia (theosis) i niezłomna obrona prawdy o Trójcy Świętej.'
  },
  {
    id: 'cyril_alexandria',
    name: 'Św. Cyryl Aleksandryjski',
    dates: '376–444',
    title: 'Patriarcha Aleksandrii, Filar Soboru w Efezie, Doktor Wcielenia',
    tradition: 'Grecka (Wschodnia)',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Obrońca tytułu Theotokos (Boża Rodzicielka) dla Maryi oraz jedności Osoby Chrystusa Boga-Człowieka. Wybitny komentator Ewangelii Jana i Łukasza.',
    keyWorks: ['Komentarz do Ewangelii św. Jana', 'Komentarz do św. Łukasza', 'Komentarz do Izajasza', 'Listy chrystologiczne'],
    spiritualCharisma: 'Głęboka adoracja tajemnicy Wcielenia i eucharystycznego zjednoczenia.'
  },

  // Ojcowie Kapadoccy i Szkoła Antiocheńska
  {
    id: 'basil_caesarea',
    name: 'Św. Bazyli Wielki z Cezarei',
    dates: '329–379',
    title: 'Ojciec Monastycyzmu Wschodniego, Arcybiskup Cezarei, Doktor Kościoła',
    tradition: 'Grecka (Wschodnia)',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Autor reguł zakonnych, genialny liturgista i teolog Ducha Świętego. Twórca hospicjów dla ubogich i chorych (Bazyliada).',
    keyWorks: ['O Duchu Świętym (De Spiritu Sancto)', 'Homilie na Hexaemeron (Sześć Dni Stworzenia)', 'Reguły zakonne'],
    spiritualCharisma: 'Równowaga kontemplacji i czynnego miłosierdzia, modlitwa liturgiczna.'
  },
  {
    id: 'gregory_nazianzus',
    name: 'Św. Grzegorz z Nazjanzu (Teolog)',
    dates: '329–390',
    title: 'Patriarcha Konstantynopola, Poeta, Doktor Kościoła',
    tradition: 'Grecka (Wschodnia)',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Jeden z trzech wielkich Kapadoków. Nazwany "Teologiem" za swe mistyczne i poetyckie Mowy Teologiczne o Trójcy Przenajświętszej («To, co nie zostało przyjęte przez Chrystusa, nie zostało zbawione»).',
    keyWorks: ['Pięć Mów Teologicznych', 'Listy chrystologiczne', 'Poezje duchowe'],
    spiritualCharisma: 'Mistyczna teologia trynitarna i poezja jako modlitwa.'
  },
  {
    id: 'gregory_nyssa',
    name: 'Św. Grzegorz z Nyssy',
    dates: '335–394',
    title: 'Biskup Nyssy, Mistyk, Brat św. Bazylego',
    tradition: 'Grecka (Wschodnia)',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Geniusz teologii mistycznej. Opracował naukę o nieustannym postępie duszy w Bogu (Epektasis) oraz interpretację drogi Mojżesza w ciemności Bożej obecności.',
    keyWorks: ['Życie Mojżesza', 'Homilie do Pieśni nad Pieśniami', 'Wielka Katecheza', 'O modlitwie Pańskiej'],
    spiritualCharisma: 'Doświadczenie nieskończoności Boga i wewnętrzne oczyszczenie serca.'
  },
  {
    id: 'john_chrysostom',
    name: 'Św. Jan Chryzostom (Złotousty)',
    dates: '349–407',
    title: 'Patriarcha Konstantynopola, Książę Kaznodziejów, Doktor Kościoła',
    tradition: 'Grecka (Wschodnia)',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Najwybitniejszy kaznodzieja starożytności. Jego homilie do niemal wszystkich ksiąg biblijnych (zwłaszcza Listów św. Pawła i Ewangelii) łączą precyzję tekstu z płomienną troską o ubogich.',
    keyWorks: ['Homilie do Ewangelii św. Mateusza i Jana', 'Homilie do Listów św. Pawła', 'O kapłaństwie'],
    spiritualCharisma: 'Złote usta głoszące Słowo Boże i odnajdywanie Chrystusa w sakramencie ołtarza i sakramencie brata ubogiego.'
  },

  // Wielcy Ojcowie Łacińscy (Zachodni)
  {
    id: 'ambrose_milan',
    name: 'Św. Ambroży z Mediolanu',
    dates: '340–397',
    title: 'Biskup Mediolanu, Ojciec i Doktor Kościoła',
    tradition: 'Łacińska (Zachodnia)',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Duchowy ojciec nawrócenia św. Augustyna. Mistrz alegorycznej i typologicznej lektury Starego Testamentu. Wprowadził śpiew hymnów do liturgii zachodniej.',
    keyWorks: ['Wykład Ewangelii według św. Łukasza', 'O tajemnicach (De Mysteriis)', 'Hexaemeron', 'O sakramentach'],
    spiritualCharisma: 'Odkrywanie Chrystusa ukrytego w postaciach Starego Przymierza i duszpasterska odwaga.'
  },
  {
    id: 'jerome_stridon',
    name: 'Św. Hieronim ze Strydonu',
    dates: '347–420',
    title: 'Tłumacz Wulgaty, Patron Biblistów, Doktor Kościoła',
    tradition: 'Łacińska (Zachodnia)',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Dokonał monumentalnego przekładu Pisma Świętego z języków oryginalnych (hebrajskiego i greckiego) na łacinę (Wulgata). Autor zasady: «Nieznajomość Pisma Świętego jest nieznajomością Chrystusa».',
    keyWorks: ['Wulgata (Biblia Łacińska)', 'Komentarze do Ksiąg Prorockich (Izajasz, Jeremiasz, Daniel)', 'Komentarze do św. Mateusza i Listów'],
    spiritualCharisma: 'Pasja do prawdy tekstu hebrajskiego (Hebraica veritas) i asceza biblijna.'
  },
  {
    id: 'augustine_hippo',
    name: 'Św. Augustyn z Hippony',
    dates: '354–430',
    title: 'Biskup Hippony, Doktor Łaski (Doctor Gratiae), Filozof',
    tradition: 'Łacińska (Zachodnia)',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Jeden z największych umysłów ludzkości. Jego nauka o łasce, Trójcy Świętej i interpretacji Pisma ukształtowała całą cywilizację chrześcijańską («Niespokojne jest serce nasze, dopóki nie spocznie w Tobie»).',
    keyWorks: ['Wyznania (Confessiones)', 'O Państwie Bożym (De Civitate Dei)', 'Objaśnienia Psalmów (Enarrationes in Psalmos)', 'Traktaty o Ewangelii św. Jana'],
    spiritualCharisma: 'Miłość jako klucz do rozumienia całego Pisma i absolutny prymat Bożej łaski.'
  },
  {
    id: 'gregory_great',
    name: 'Św. Grzegorz I Wielki',
    dates: '540–604',
    title: 'Papież, Sługa Sług Bożych, Doktor Kościoła',
    tradition: 'Łacińska (Zachodnia)',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Mnich na stolicy Piotrowej, reformator liturgii i chorału gregoriańskiego. Twórca teologii lectio divina: «Pismo Święte rośnie wraz z tym, kto je czyta».',
    keyWorks: ['Moralia in Iob (Komentarz do Hioba)', 'Homilie na Ewangelie', 'Reguła Pasterza (Regula Pastoralis)', 'Dialogi'],
    spiritualCharisma: 'Głęboki zmysł moralny i duszpasterski Pisma Świętego, rozeznawanie duchowe.'
  },

  // Tradycja Wczesnochrześcijańska, Syriacka i Średniowieczna
  {
    id: 'ephrem_syrian',
    name: 'Św. Efrem Syryjczyk',
    dates: '306–373',
    title: 'Diakon, Harfa Ducha Świętego, Doktor Kościoła',
    tradition: 'Syriacka / Orientalna',
    category: 'Wielcy Doktorzy Kościoła',
    shortDescription: 'Największy teolog i poeta tradycji semicko-syriackiej. Wyrażał głębokie tajemnice wiary w hymnach i poezji teologicznej, czytając Pismo z perspektywy symboli i medytacji.',
    keyWorks: ['Hymny o Narodzeniu i Objawieniu', 'Komentarz do Diatessaronu', 'Hymny o Raju'],
    spiritualCharisma: 'Poetycka i symboliczna medytacja Słowa Bożego w duchu pokory i łez skruchy.'
  },
  {
    id: 'bede_venerable',
    name: 'Św. Beda Czcigodny',
    dates: '672–735',
    title: 'Mnich benedyktyński, Historyk, Doktor Kościoła',
    tradition: 'Łacińska (Zachodnia)',
    category: 'Średniowieczni Kompilatorzy Patrystyczni',
    shortDescription: 'Anglosaski uczony i mnich, który z miłością przekazywał spuściznę Ojców Kościoła nowym narodom Europy. Jego komentarze biblijne wyróżniają się klarownością i wiernością Tradycji.',
    keyWorks: ['Komentarz do Ewangelii św. Marka i Łukasza', 'Historia kościelna narodu angielskiego'],
    spiritualCharisma: 'Pokorna praca naukowa połączona z nieustanną modlitwą psalmami (Ora et labora).'
  },
  {
    id: 'bernard_clairvaux',
    name: 'Św. Bernard z Clairvaux',
    dates: '1090–1153',
    title: 'Opat z Clairvaux, Ostatni z Ojców Kościoła, Doktor Miodopłynny',
    tradition: 'Łacińska (Zachodnia)',
    category: 'Średniowieczni Kompilatorzy Patrystyczni',
    shortDescription: 'Cysterski mistyk i reformator monastycyzmu, nazywany "ostatnim Ojcem Kościoła". Jego kazania o Pieśni nad Pieśniami to arcydzieło chrześcijańskiej mistyki oblubieńczej.',
    keyWorks: ['Kazania o Pieśni nad Pieśniami', 'O miłowaniu Boga', 'O rozważaniu (De Consideratione)'],
    spiritualCharisma: 'Mistyka miłości oblubieńczej do Chrystusa i dziecięce zaufanie Maryi.'
  },
  {
    id: 'thomas_aquinas_catena',
    name: 'Św. Tomasz z Akwinu (Kompilator Catena Aurea)',
    dates: '1225–1274',
    title: 'Doktor Anielski, Twórca Catena Aurea',
    tradition: 'Łacińska (Zachodnia)',
    category: 'Średniowieczni Kompilatorzy Patrystyczni',
    shortDescription: 'Na prośbę papieża Urbana IV zebrał i uporządkował komentarze ponad 80 Ojców Kościoła (greckich i łacińskich) werset po wersecie do 4 Ewangelii, tworząc słynny "Złoty Łańcuch" (Catena Aurea).',
    keyWorks: ['Catena Aurea (Złoty Łańcuch Komentarzy Ojców)', 'Summa Theologiae', 'Komentarze do św. Jana i Listów św. Pawła'],
    spiritualCharisma: 'Syntetyczna harmonia mądrości patrystycznej z systematyczną teologią wiary.'
  }
];
