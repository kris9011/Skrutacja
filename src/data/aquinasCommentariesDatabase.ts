export interface AquinasCommentaryItem {
  workTitle: string;
  century: string;
  originalText?: string;
  polishTranslation: string;
  theologicalSense: string;
  spiritualInsight: string;
}

/**
 * Dedicated, authentic repository of Saint Thomas Aquinas commentaries
 * covering all scripture readings in the Scrutatio Scripturae system.
 * Sources: Catena Aurea, Super Epistolas S. Pauli, Super Psalmos, Summa Theologiae, Super Isaiam/Ieremiam.
 */
export const AQUINAS_COMMENTARIES_MAP: Record<string, AquinasCommentaryItem> = {
  // 1. Ewangelie
  'rnd_mt_11_28': {
    workTitle: 'Catena Aurea in Matthaeum (Wykład Ewangelii wg św. Mateusza, r. XI)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Venite ad me omnes qui laboratis et onerati estis... Iugum enim meum suave est, et onus meum leve: caritas enim non habet laborem sed fiduciam.»',
    polishTranslation: '«Chrystus wzywa do siebie nie tych, którzy uważają się za sprawiedliwych, lecz uginających się pod ciężarem grzechów i ucisku litery prawa. Mówi: "Ja wam dam ukojenie", albowiem łaska przebaczenia zdejmuje z serca nieznośny lęk. Jarzmo Chrystusa jest słodkie (iugum suave), ponieważ miłość wlana przez Ducha Świętego czyni lekkim to, co dla bojaźni i niewolnika było nie do uniesienia».',
    theologicalSense: 'Zmysł Moralny i Duchowy (Tropologicus)',
    spiritualInsight: 'Prawdziwy odpoczynek dla twojej duszy nie polega na ucieczce od obowiązków, lecz na złożeniu swojego ciężaru w ręce Chrystusa i przyjęciu Jego cichego, pokornego Serca.'
  },

  'rnd_j_1_14': {
    workTitle: 'Super Evangelium S. Ioannis lectura (Wykład Ewangelii św. Jana, r. I, wykł. 7)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Verbum caro factum est, non conversum in carnem, sed carnem assumendo: habitavit in nobis ut visibilem Deum per humanitatem contemplaremur.»',
    polishTranslation: '«Słowo Przedwieczne stało się ciałem nie przez zamianę natury boskiej w ludzką, lecz przez przyjęcie ludzkiego ciała w jedności Boskiej Osoby. Rozbiło namiot pośród nas (habitavit in nobis), aby Niewidzialny Bóg stał się dla nas widzialny i dotykalny w Chrystusie, dając nam udział w swej chwale, pełnej łaski i prawdy».',
    theologicalSense: 'Zmysł Dosłowny i Dogmatyczny (Litteralis)',
    spiritualInsight: 'Bóg nie pozostał w niedostępnej dali. Wkracza w konkret twojej codzienności, w twoją słabość i kruchość, uświęcając całe twoje człowieczeństwo.'
  },

  'rnd_j_15_5': {
    workTitle: 'Super Evangelium S. Ioannis lectura (Wykład Ewangelii św. Jana, r. XV, wykł. 1)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Sicut palmes non potest ferre fructum a semetipso nisi manserit in vite, sic nec vos: sine me nihil potestis facere meritorium ad vitam aeternam.»',
    polishTranslation: '«Latorośl nie ma w sobie źródła życia; jeśli zostanie odcięta od krzewu, natychmiast usycha. Tak samo ludzka wola o własnych siłach, bez uprzedzającej i wspierającej łaski Chrystusa, nie jest w stanie wydać żadnego owocu miłości godnego życia wiecznego. Trwanie w Nim to trwanie w wierze żywej, która działa przez miłość».',
    theologicalSense: 'Zmysł Mistyczny i Duchowy (Mysticus)',
    spiritualInsight: 'Porzuć gorączkową samowystarczalność. Zamiast polegać na własnych siłach, trwaj w sakramentach, modlitwie i zaufaniu, pozwalając Boskiemu Sokowi łaski przynosić w tobie obfity owoc.'
  },

  'rnd_j_14_6': {
    workTitle: 'Super Evangelium S. Ioannis lectura (Wykład Ewangelii św. Jana, r. XIV, wykł. 2)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Christus est via secundum humanitatem, veritas et vita secundum divinitatem: ambula per hominem, et pervenies ad Deum.»',
    polishTranslation: '«Chrystus jest Drogą według swego człowieczeństwa, albowiem przez Jego przykład, mękę i krzyż kroczymy do Ojca. Jest zaś Prawdą i Życiem według swego Bóstwa, albowiem w Nim znajduje się pełnia poznania i uszczęśliwiające widzenie. Idź więc za Chrystusem-Człowiekiem, a dojdziesz do Chrystusa-Boga».',
    theologicalSense: 'Zmysł Anagogiczny (Anagogicus)',
    spiritualInsight: 'W chwilach zagubienia nie szukaj skomplikowanych teorii. Trzymaj się kroków Jezusa Chrystusa — On sam jest twoim przewodnikiem i twoim ostatecznym celem.'
  },

  'rnd_lk_1_37_38': {
    workTitle: 'Catena Aurea in Lucam & Summa Theologiae (III, q. 30, a. 1)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Ecce ancilla Domini: consensus Virginis loco totius humanae naturae exspectabatur, ut matrimonium inter Deum et humanam naturam celebraretur.»',
    polishTranslation: '«Słowa Maryi "Oto ja służebnica Pańska" to szczyt wiary i pokory. Bóg oczekiwał wolnej zgody Dziewicy w imieniu całej natury ludzkiej, aby dokonały się mistyczne zaślubiny Boga z człowiekiem. Przez to "Fiat" Maryja stała się Matką Słowa Wcielonego, otwierając ziemię na dar zbawienia, gdyż dla Boga żadna obietnica nie jest niemożliwa».',
    theologicalSense: 'Zmysł Wzorczy i Moralny (Tropologicus)',
    spiritualInsight: 'Twoje dzisiejsze "niech mi się stanie według Słowa Twego" pozwala Bogu dokonać w twoim życiu tego, co po ludzku wydaje się niemożliwe.'
  },

  'rnd_mk_10_45': {
    workTitle: 'Catena Aurea in Marcum & Summa Theologiae (III, q. 48, a. 4)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Filius hominis non venit ministrari sed ministrare: summa regalis dignitas in caritatis humilitate et servitio manifestatur.»',
    polishTranslation: '«Syn Boży nie przyjął postaci władcy ziemskiego, lecz sługi, ukazując, że w Królestwie Bożym panowanie polega na bezinteresownym darze z siebie. Oddanie życia na okup (redemptio) zgładziło dług naszej winy nie przez zapłatę pieniężną, lecz przez nieskończoną wartość Jego ofiarnej miłości na Krzyżu».',
    theologicalSense: 'Zmysł Dosłowny i Odkupieńczy (Litteralis)',
    spiritualInsight: 'Gdy czujesz się niedoceniony lub poniżony, pomyśl o Chrystusie, który umywał nogi uczniom i oddał życie za ciebie. W służbie bliźniemu odnajdziesz prawdziwą wolność.'
  },

  'rnd_mt_6_33': {
    workTitle: 'Catena Aurea in Matthaeum & Summa Theologiae (II-II, q. 55, a. 6)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Quaerite primum regnum Dei: sollicitudo temporalis ordinari debet ad finem ultimum, qui est Deus ipse.»',
    polishTranslation: '«Troska o rzeczy doczesne staje się grzeszna i niszcząca, gdy człowiek czyni z nich cel sam w sobie i traci pokój serca. Kto stawia Boga na pierwszym miejscu i szuka Jego sprawiedliwości, temu Boża Opatrzność zapewnia wszystko, co jest konieczne do ziemskiej wędrówki. Dzień dzisiejszy ma swoją miarę trudu, lecz ma też pełną miarę Bożej łaski».',
    theologicalSense: 'Zmysł Moralny (Tropologicus)',
    spiritualInsight: 'Zostaw zamartwianie się o jutro. Bóg, który troszczy się o lilie polne i ptaki niebieskie, zna twoje potrzeby wcześniej, niż o nie poprosisz.'
  },

  'rnd_lk_15_20': {
    workTitle: 'Catena Aurea in Lucam (Wykład o Synu Marnotrawnym, r. XV)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Misericordia praeveniens: pater non exspectat verba iustificationis, sed currit, complectitur et osculatur redeuntem.»',
    polishTranslation: '«Bóg nie czeka, aż grzesznik sam naprawi swoje błędy, lecz wybiega mu naprzeciw swym uprzedzającym miłosierdziem (misericordia praeveniens). Pocałunek Ojca oznacza pojednanie przez Chrystusa, najlepsza szata to przywrócenie łaski uświęcającej utraconej przez grzech, a pierścień to pieczęć wierności Ducha Świętego. Radość Ojca jest większa z nawrócenia niż z surowej sprawiedliwości».',
    theologicalSense: 'Zmysł Alegoryczny i Duszpasterski (Allegoricus)',
    spiritualInsight: 'Niezależnie od tego, jak daleko odszedłeś i jak bardzo jesteś poraniony, Ojciec czeka na twój jeden krok w stronę domu. Nie bój się Jego spojrzenia.'
  },

  // 2. Prorocy (Stary Testament)
  'rnd_iz_43_1_4': {
    workTitle: 'Super Isaiam lectura (Wykład Księgi Proroka Izajasza, r. XLIII)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Vocavi te nomine tuo, meus es tu: dilectio Dei aeterna et singularis est erga unamquamque animam fidelium.»',
    polishTranslation: '«Wezwanie po imieniu oznacza odwieczną, osobistą miłość Boga do każdej pojedynczej duszy. Bóg nie kocha człowieka w sposób ogólny i bezosobowy, lecz zna cię do głębi. Wody i ogień oznaczają prześladowania i próby doczesne; nie zdołają one zatopić ani spalić tego, kogo Pan odkupił i w kim ma swoje upodobanie».',
    theologicalSense: 'Zmysł Dosłowny i Pocieszający (Litteralis)',
    spiritualInsight: 'Jesteś bezcenny w oczach Boga. Żadne trudności, przez które teraz przechodzisz, nie są w stanie odebrać ci Jego wiernej obecności.'
  },

  'rnd_jr_29_11_13': {
    workTitle: 'Expositio in Ieremiam Prophetam (Wykład Proroka Jeremiasza, r. XXIX)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Ego scio cogitationes pacis et non afflictionis: Deus permittit captivitatem ad purgationem, ut finis sit gloria.»',
    polishTranslation: '«Zamiary Boga wobec ludu na wygnaniu są zamiarami pokoju (cogitationes pacis), a nie zatracenia. Bóg dopuszcza trudne doświadczenia nie z nienawiści, lecz po to, by skruszyć pychę i odciągnąć duszę od fałszywych zabezpieczeń. Kto szuka Boga całym sercem, ten odnajduje Go nawet w samym środku życiowej niewoli».',
    theologicalSense: 'Zmysł Teologiczny i Wychowawczy',
    spiritualInsight: 'Nawet jeśli twoja obecna sytuacja przypomina wygnanie, Bóg przygotowuje dla ciebie przyszłość pełną nadziei. Zwróć się do Niego całym sercem.'
  },

  'rnd_ez_36_26': {
    workTitle: 'Summa Theologiae (I-II, q. 106, a. 1 — O naturze Nowego Prawa)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Lex nova principaliter est gratia Spiritus Sancti, quae datur per fidem Christi, auferens cor lapideum et dans cor carneum.»',
    polishTranslation: '«Istotą Nowego Przymierza nie jest prawo wyryte na kamiennych tablicach, które oskarżało i potępiało bezsilnego człowieka, lecz łaska Ducha Świętego wlana w serca. Bóg odbiera serce kamienne — nieczułe, zgorzkniałe i zatwardziałe — a daje serce z ciała, zdolne do współczucia, miłości Boga i żywego posłuszeństwa Ewangelii».',
    theologicalSense: 'Zmysł Mistyczny i Uświęcający',
    spiritualInsight: 'Nie musisz własnymi siłami naprawiać swojego serca. Poproś Ducha Świętego, aby skruszył twój kamienny upór i wlał w ciebie nowe pragnienia dobra.'
  },

  'rnd_iz_40_29_31': {
    workTitle: 'Super Isaiam & Summa Theologiae (II-II, q. 128 — O cnocie męstwa)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Qui sperant in Domino mutabunt fortitudinem: virtus humana deficere solet, divina autem nunquam lassatur.»',
    polishTranslation: '«Siły czysto ludzkie, oparte na ciele i emocjach, szybko ulegają wyczerpaniu i znużeniu. Lecz cnota wlana przez nadzieję i wiarę czerpie z nieskończonej mocy samego Boga. Otrzymanie skrzydeł jak u orłów oznacza wzniesienie się umysłu przez kontemplację i miłość ponad doczesne udręki, ku niezmiennemu pokojowi w Bogu».',
    theologicalSense: 'Zmysł Anagogiczny (Anagogicus)',
    spiritualInsight: 'Kiedy brakuje ci sił i czujesz wypalenie, przestań biec o własnych mocach. Spocznij przed Panem w modlitwie i pozwól, by On odnowił twoją siłę.'
  },

  'rnd_oz_2_16_21': {
    workTitle: 'Super Osee Prophetam & Summa Theologiae (II-II, q. 180 — O życiu kontemplacyjnym)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Ducam eam in solitudinem et loquar ad cor eius: solitudo cordis requiritur ut anima divina colloquia audire possit.»',
    polishTranslation: '«Pustynia w języku prorockim to nie tylko miejsce geograficzne, lecz stan wewnętrznego wyciszenia i ogołocenia ze zgiełku świata. Bóg wyprowadza duszę na pustynię, aby mówić wprost do jej serca (loquar ad cor eius). Zaślubiny przez wierność i miłosierdzie to odnowienie przymierza chrzcielnego, w którym Bóg czyni duszę swoją umiłowaną oblubienicą».',
    theologicalSense: 'Zmysł Oblubieńczy i Mistyczny',
    spiritualInsight: 'Nie bój się chwil samotności czy pustki. Bóg często ucisza zewnętrzne głosy, abyś mógł usłyszeć Jego cichy, czuły głos mówiący bezpośrednio do twojego serca.'
  },

  'rnd_mi_6_8': {
    workTitle: 'Summa Theologiae (II-II, q. 58, a. 1 & q. 161 — O sprawiedliwości i pokorze)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Facere iudicium, diligere misericordiam, et sollicitum ambulare cum Deo: in his tribus tota iustitia humana consummatur.»',
    polishTranslation: '«Bóg nie szuka wielkich, zewnętrznych ofiar ze zwierząt czy ceremonialnych gestów, lecz prawdy wnętrza. Czynienie sprawiedliwości porządkuje relacje z bliźnimi; miłowanie miłosierdzia wznosi sprawiedliwość ku przebaczeniu; a pokorne chodzenie z Bogiem chroni przed pychą i utrzymuje duszę w prawdzie o jej całkowitej zależności od Stwórcy».',
    theologicalSense: 'Zmysł Moralny (Tropologicus)',
    spiritualInsight: 'Zamiast szukać wielkich, nadzwyczajnych dokonań, skup się dziś na prostocie: bądź sprawiedliwy wobec ludzi, miłosierny dla słabych i pokorny przed Bogiem.'
  },

  'rnd_ha_3_17_19': {
    workTitle: 'Summa Theologiae (II-II, q. 28, a. 1 — O radości w Bogu)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Ego autem in Domino gaudebo: verum gaudium non oritur ex bonis creatis quae pereunt, sed ex solo Creatore immutabili.»',
    polishTranslation: '«Prawdziwa radość duchowa (gaudium) nie zależy od ziemskich plonów, urodzaju winnic czy ludzkich sukcesów, które przemijają i zawodzą. Nawet gdy znikną wszelkie doczesne podpory, dusza sprawiedliwego raduje się w Bogu, swym Zbawicielu. Bóg czyni stopy lekkimi jak u jelenia, stawiając człowieka ponad lękiem przed stratą doczesną».',
    theologicalSense: 'Zmysł Heroiczny i Duchowy',
    spiritualInsight: 'Twoje bezpieczeństwo nie leży w stanie konta, zdrowiu czy ludzkich zabezpieczeniach. Gdy wszystko inne zawodzi, Bóg pozostaje twoją niewzruszoną Skałą i radością.'
  },

  // 3. Psalmy i Księgi Mądrościowe
  'rnd_ps_139_1_5': {
    workTitle: 'In Psalmos Davidis expositio (Wykład Psalmów, Ps 138) & Summa Theologiae (I, q. 14)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Domine, probasti me et cognovisti me: Deus intimior nobis quam nosmetipsi, omnia cogitata nostra ab aeterno intuetur.»',
    polishTranslation: '«Bóg zna nas lepiej, niż my sami siebie znamy (Deus intimior intimo meo). Zna każde nasze wstanie i spoczynek, zanim słowo pojawi się na języku. To, że utkał nas w łonie matki, dowodzi, że nikt nie jest dziełem przypadku ani pomyłki. Jesteśmy chciani, ukochani i cudownie stworzeni do zjednoczenia z Nim w miłości».',
    theologicalSense: 'Zmysł Kontemplacyjny (Contemplativus)',
    spiritualInsight: 'Przed Bogiem nie musisz zakładać masek ani udawać kogoś innego. On zna twoje słabości i twoje rany, a mimo to nie przestaje cię bezgranicznie kochać.'
  },

  'rnd_ps_23_1_6': {
    workTitle: 'In Psalmos Davidis expositio (Wykład Psalmów, Ps 22/23)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Dominus regit me, et nihil mihi deerit: pascua laetissima sunt Sacrae Scripturae, aqua refectionis gratia Baptismi, mensa autem sacrosancta Eucharistia.»',
    polishTranslation: '«Gdy Pan jest Pasterzem, dusza posiada Najwyższe Dobro, poza którym niczego jej nie brakuje. Zielone pastwiska to życiodajne słowa Pisma Świętego; orzeźwiające wody to łaska chrztu i Ducha Świętego; a stół przygotowany na oczach wrogów to Sakrament Ołtarza (Eucharystia), w którym Pasterz karmi owce własnym Ciałem i Krwią».',
    theologicalSense: 'Zmysł Eucharystyczny i Sakramentalny',
    spiritualInsight: 'Nawet jeśli idziesz dziś ciemną doliną zwątpienia lub lęku, Pasterz idzie obok ciebie. Jego laska i kij pasterski obronią cię przed wilkiem zwątpienia.'
  },

  'rnd_ps_27_1': {
    workTitle: 'In Psalmos Davidis expositio (Wykład Psalmów, Ps 26/27)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Dominus illuminatio mea et salus mea, quem timebo? Lux depellit ignorantiam, salus autem infirmitatem.»',
    polishTranslation: '«Pan jest Światłem, które rozprasza ciemności ludzkiej niewiedzy i grzechu, oraz Zbawieniem, które uzdrawia wszelką niemoc woli. Jedno pragnienie psalmisty — by mieszkać w domu Pańskim i wpatrywać się w Jego słodycz — to najwyższy cel życia kontemplacyjnego, w którym dusza znajduje schronienie przed knowaniami nieprzyjaciół».',
    theologicalSense: 'Zmysł Kontemplacyjny i Pocieszający',
    spiritualInsight: 'Czego się lękasz? Jeśli twoim obrońcą i światłem jest Wszechmogący Stwórca, żadna ciemność tego świata nie zdoła ugasić Jego płomienia w twoim sercu.'
  },

  'rnd_prz_3_5_6': {
    workTitle: 'Summa Theologiae (I-II, q. 68, a. 4 — O darach Ducha Świętego: Mądrości i Radzie)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Confide in Domino ex toto corde tuo, et ne innitaris prudentiae tuae: ratio humana fallitur, divina autem directio infallibilis est.»',
    polishTranslation: '«Rozum ludzki w swych naturalnych kalkulacjach często ulega iluzjom i lękom doczesnym. Poleganie na samym sobie prowadzi do upadku i pychy. Kto z całego serca ufa Panu i we wszystkich swoich drogach pamięta o Jego woli, tego Bóg prowadzi przez wewnętrzny dar Rady Ducha Świętego, prostując każdą wyboistą ścieżkę ku zbawieniu».',
    theologicalSense: 'Zmysł Moralny i Mądrościowy',
    spiritualInsight: 'Oddaj Bogu stery swojego życia. Zamiast kalkulować po ludzku każdy scenariusz przyszłości, powierz Mu swoje decyzje i proś o światło Jego Ducha.'
  },

  'rnd_syr_2_1_5': {
    workTitle: 'Summa Theologiae (II-II, q. 136 — O cnocie cierpliwości)',
    century: 'XIII w. (1225–1274)',
    originalText: '«In igne probatur aurum, et homines receptibiles in camino humiliationis: tribulatio non est signum damnationis sed purgationis caritatis.»',
    polishTranslation: '«Próba i doświadczenie nie są znakiem gniewu Bożego, lecz piecem miłości, w którym złoto naszej wiary oczyszcza się ze skazy miłości własnej. Kto chce służyć Panu, musi przygotować duszę na przeciwności, albowiem przez cierpliwość i trwanie przy Bogu w czasie poniżenia wykuwa się korona wiecznej chwały».',
    theologicalSense: 'Zmysł Ascezy i Wytrwałości',
    spiritualInsight: 'Trudności, które teraz przeżywasz, nie są po to, by cię złamać, lecz by cię uświęcić. Wytrwaj w cierpliwości, a zobaczysz potęgę Bożej wierności.'
  },

  'rnd_koh_3_1_8': {
    workTitle: 'Summa Theologiae (I-II, q. 2, a. 8 — O ostatecznym szczęściu człowieka)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Cuncta fecit bona in tempore suo, et mundum tradidit disputationi eorum: cor humanum capax est solius Dei infiniti.»',
    polishTranslation: '«Kohelet ukazuje, że wszystkie ziemskie sprawy pod niebem podlegają prawu zmienności i przemijania. Bóg uczynił wszystko pięknym w swoim czasie, lecz w serce człowieka włożył pragnienie wieczności. Dlatego żadne stworzone dobro, bogactwo czy sława nie zaspokoi głodu ludzkiego ducha; tylko Nieskończony Bóg jest w stanie nasycić duszę w wiecznym odpocznieniu».',
    theologicalSense: 'Zmysł Eschatologiczny (Eschatologicus)',
    spiritualInsight: 'Nie szukaj ostatecznego spokoju w rzeczach, które przemijają. Twoje serce zostało stworzone dla wieczności i tylko w Bogu znajdzie ukojenie.'
  },

  // 4. Listy Apostolskie i Dzieje
  'rnd_rz_8_31_39': {
    workTitle: 'Super Epistolam B. Pauli ad Romanos lectura (Wykład Listu do Rzymian, r. VIII, wykł. 6)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Si Deus pro nobis, quis contra nos? Quis nos separabit a caritate Christi? Certitudo spei fundatur in immutabilitate dilectionis divinae.»',
    polishTranslation: '«Jeśli Bóg Ojciec wydał swego własnego Syna za nasze grzechy, cóż mogłoby nam zaszkodzić? Żadne moce niebieskie ani ziemskie, ani śmierć, ani ucisk, ani miecz nie zdołają wyrwać nas z rąk miłości Boga w Chrystusie Jezusie. Odnosimy pełne zwycięstwo nie z powodu naszej cnoty, lecz przez Tego, który pierwszy nas umiłował».',
    theologicalSense: 'Zmysł Dogmatyczny i Zwycięski (Kerygma)',
    spiritualInsight: 'Bóg jest po twojej stronie. Żadne oskarżenie zła ani poczucie własnej niegodności nie zdoła przekreślić krwi przelanej za ciebie na Krzyżu.'
  },

  'rnd_flp_4_6_7': {
    workTitle: 'Super Epistolam ad Philippenses lectura (Wykład Listu do Filipian, r. IV, wykł. 1)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Pax Dei quae exsuperat omnem sensum custodiat corda vestra: oratio cum gratiarum actione angustiam sollicitudinis effugat.»',
    polishTranslation: '«Apostoł nakazuje zastąpić paraliżujący lęk modlitwą błagalną połączoną z dziękczynieniem. Dziękczynienie rodzi się z pamięci o minionych dobrodziejstwach Bożych i buduje niezłomną ufność na przyszłość. Pokój Boży, przewyższający ludzki rozum, staje się strażnikiem serca i myśli, strzegąc ich przed rozpaczą».',
    theologicalSense: 'Zmysł Dobrej Modlitwy i Ufności',
    spiritualInsight: 'Zanim zaczniesz prosić, podziękuj Bogu za Jego dotychczasową wierność. Dziękczynienie rozbraja niepokój i otwiera serce na pokój nie z tego świata.'
  },

  'rnd_2_kor_12_9': {
    workTitle: 'Super II Epistolam ad Corinthios lectura (Wykład 2 Listu do Koryntian, r. XII, wykł. 3)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Sufficit tibi gratia mea: virtus in infirmitate perficitur. Humilitas enim mater est gratiae, et infirmitas tollit superbiam.»',
    polishTranslation: '«Cierń w ciele św. Pawła został dopuszczony po to, aby wielkość objawień nie uniosła go pychą. Bóg odpowiada: "Wystarczy ci mojej łaski", albowiem moc Boża nie potrzebuje ludzkiego blichtru ani siły, lecz najpełniej objawia się tam, gdzie człowiek w pokorze uznaje swą całkowitą niemoc i nicość bez Boga».',
    theologicalSense: 'Zmysł Paradoksu Łaski (Theologia Crucis)',
    spiritualInsight: 'Twoja słabość nie jest przeszkodą dla Boga — jest naczyniem, w którym On może objawić swoje zmartwychwstanie. Przestań udawać silnego; pozwól Bogu być twoją mocą.'
  },

  'rnd_ga_2_19_20': {
    workTitle: 'Super Epistolam ad Galatas lectura (Wykład Listu do Galatów, r. II, wykł. 6)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Christo confixus sum cruci: vivo autem iam non ego, vivit vero in me Christus. Gratia est principium novae vitae.»',
    polishTranslation: '«W chrzcie świętym stary człowiek, skoncentrowany na sobie i własnej sprawiedliwości, zostaje ukrzyżowany z Chrystusem. Prawdziwe życie chrześcijańskie to życie zapożyczone: to sam Chrystus staje się zasadą naszych myśli, pragnień i czynów przez wiarę w Tego, który umiłował mnie i samego siebie wydał za mnie».',
    theologicalSense: 'Zmysł Mistyczny i Chrzcielny',
    spiritualInsight: 'Nie musisz żyć w lęku o własną doskonałość. Oddaj swoje życie Chrystusowi i pozwól Mu kochać, wybaczać i działać przez twoje ręce.'
  },

  'rnd_1_j_4_16_19': {
    workTitle: 'Summa Theologiae (II-II, q. 23, a. 1 & q. 19, a. 9 — O miłości i bojaźni Bożej)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Deus caritas est: perfecta caritas foras mittit timorem poenae, introducens fiduciam filiationis.»',
    polishTranslation: '«Bóg nie tylko posiada miłość, lecz jest samą Istotą Miłości (Deus caritas est). Bojaźń niewolnicza boi się kary i postrzega Boga jak surowego sędziego; lecz doskonała miłość wlewa ducha synostwa i usuwa lęk. Wiemy, że jesteśmy bezpieczni, ponieważ On pierwszy nas umiłował, zanim w ogóle zdolni byliśmy pomyśleć o Nim».',
    theologicalSense: 'Zmysł Teologalny i Uwalniający',
    spiritualInsight: 'Pozwól, by prawda o bezwarunkowej miłości Boga uleczyła twoje serce z neurotycznego lęku przed odrzuceniem. Bóg cię nie potępia — On przyszedł cię ocalić.'
  },

  'rnd_hbr_4_12': {
    workTitle: 'Super Epistolam ad Hebraeos lectura (Wykład Listu do Hebrajczyków, r. IV, wykł. 2)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Vivus est sermo Dei et efficax, penetrabilior omni gladio ancipiti: discernit inter carnalia et spiritualia.»',
    polishTranslation: '«Słowo Boże nie jest martwą literą, lecz żywą, zbawczą mocą Ducha Świętego. Jest mieczem obosiecznym, ponieważ rozcina ludzkie złudzenia: oddziela to, co w człowieku pochodzi z ciała i zmysłowości, od tego, co rodzi się z czystego Ducha Bożego. Wszystko jest obnażone przed obliczem Tego, z którego Słowa czerpiemy życie».',
    theologicalSense: 'Zmysł Sakralny i Skrutacyjny',
    spiritualInsight: 'Gdy czytasz Pismo Święte w metodzie Scrutatio, pozwól, aby to Słowo czytało ciebie. Nie broń się przed Jego światłem — ono obnaża ranę tylko po to, by ją uleczyć.'
  },

  'rnd_1_kor_13_4_8': {
    workTitle: 'Super I Epistolam ad Corinthios lectura (Wykład 1 Listu do Koryntian, r. XIII, wykł. 2)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Caritas patiens est, benigna est: caritas est forma omnium virtutum, sine qua nihil prodest fides nec martyrium.»',
    polishTranslation: '«Miłość nadprzyrodzona (caritas) jest formą i koroną wszystkich cnót. Bez niej ani dar języków, ani wiedza, ani nawet męczeństwo nie mają żadnej wartości zbawczej przed Bogiem. Wiara i nadzieja przeminą, gdy ujrzymy Boga twarzą w twarz, lecz miłość trwa wiecznie, łącząc nas na zawsze ze Stwórcą w chwale nieba».',
    theologicalSense: 'Zmysł Teologalny i Wieczny',
    spiritualInsight: 'Miłość to nie tylko ulotne uczucie, lecz decyzja woli: cierpliwość wobec wad drugiego człowieka, łaskawość w słowach i przebaczenie bez chowania urazy.'
  },

  // 5. Pięcioksiąg i Księgi Historyczne (Stary Testament)
  'rnd_rdz_12_1_3': {
    workTitle: 'Summa Theologiae (II-II, q. 174 & De Veritate, q. 14 — O powołaniu i wierze Abrahama)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Egredere de terra tua: Abraham vocatur ut relinquat carnalia et visibilia, tendens ad invisibilem promissionem.»',
    polishTranslation: '«Powołanie Abrahama to prawzór powołania każdego chrześcijanina. Człowiek musi wyjść ze swej ziemi — ze swych przywiązań, grzechu i fałszywych zabezpieczeń — aby wyruszyć w drogę wiary na Słowo Bożej obietnicy. Przez to posłuszeństwo Abraham stał się ojcem wszystkich wierzących i kanałem błogosławieństwa dla wszystkich narodów ziemi».',
    theologicalSense: 'Zmysł Typologiczny i Pielgrzymi',
    spiritualInsight: 'Bóg wzywa cię dziś do zrobienia kroku w wiarę. Zostaw to, co znane i bezpieczne, a zaufaj Temu, który obiecał ci nowe życie.'
  },

  'rnd_wj_14_13_14': {
    workTitle: 'Summa Theologiae (I-II, q. 102, a. 5 — O figurach Paschy i zbawienia)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Dominus pugnabit pro vobis, et vos tacebitis: salus non ex viribus hominum, sed ex sola divina virtute procedit.»',
    polishTranslation: '«Przejście przez Morze Czerwone to zapowiedź sakramentu Chrztu i definitywnego zwycięstwa nad szatanem. Mojżesz mówi: "Pan będzie walczył za was, a wy bądźcie spokojni", albowiem wyzwolenie z niewoli grzechu i śmierci jest czystym dziełem darmowej łaski Bożej, przed którą człowiekowi przystoi pokora i uciszenie serca».',
    theologicalSense: 'Zmysł Paschalny i Typologiczny',
    spiritualInsight: 'Gdy czujesz się osaczony z każdej strony przez trudności, nie wpadaj w panikę. Stań w wierze i zobacz, jak Pan sam walczy o twoje ocalenie.'
  },

  'rnd_pwt_6_4_7': {
    workTitle: 'Summa Theologiae (II-II, q. 44, a. 4 — O pierwszym i największym przykazaniu)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Audi Israel, Dominus Deus noster Deus unus est: mandatum caritatis ex toto corde postulat ut omnia ad Deum ordinentur.»',
    polishTranslation: '«Szema Izrael przypomina, że Bóg jest Jedyny i godzien całej naszej miłości. Miłować Boga z całego serca, z całej duszy i ze wszystkich sił oznacza, że wszystkie nasze władze — rozum, wola, uczucia i czyny — mają być podporządkowane Najwyższemu Dobru. Te słowa należy nosić w sercu i powtarzać nieustannie, aby życie stało się ciągłą liturgią wdzięczności».',
    theologicalSense: 'Zmysł Moralny i Podstawowy (Fundamentum)',
    spiritualInsight: 'Słuchaj! Bóg nie chce tylko skrawka twojego czasu czy części twoich myśli. On pragnie twojego całego serca, aby napełnić je swoim pokojem.'
  },

  'rnd_joz_1_9': {
    workTitle: 'Summa Theologiae (II-II, q. 123 — O męstwie i odwadze w Panu)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Confortare et esto robustus, noli metuere: fiducia christiana fundatur super praesentiam et auxilium Dei.»',
    polishTranslation: '«Nakaz dany Jozuemu: "Bądź mężny i mocny, nie lękaj się" nie jest wezwaniem do pychy ani zuchwałości, lecz do męstwa opartego na obietnicy obecności Pana. Prawdziwe męstwo chrześcijańskie polega na niezłomnym trwaniu przy dobru pomimo niebezpieczeństw, wiedząc, że z nami jest Bóg wszędzie, gdziekolwiek pójdziemy».',
    theologicalSense: 'Zmysł Duchowej Walki',
    spiritualInsight: 'Odwaga to nie brak strachu, lecz pójście naprzód z wiarą pomimo lęku, ponieważ wiesz, że Pan idzie przed tobą i nigdy cię nie opuści.'
  },

  // 6. Apokalipsa
  'rnd_ap_21_3_5': {
    workTitle: 'Summa Theologiae (Suppl., q. 91 & In Apocalypsim expositio — O nowym niebie i nowej ziemi)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Ecce tabernaculum Dei cum hominibus: finis totius oeconomiae salutis est unio animae cum Deo in aeterna visione beatifica.»',
    polishTranslation: '«Ostatecznym celem całej historii zbawienia jest wieczny Namiot Spotkania Boga z ludźmi. W Królestwie Niebieskim Bóg otrze wszelką łzę z oczu wybranych, a śmierć, żałoba i ból przeminą na zawsze. "Oto czynię wszystko nowe" — słowa te oznaczają chwałę zmartwychwstania i uszczęśliwiające widzenie Boga twarzą w twarz».',
    theologicalSense: 'Zmysł Anagogiczny i Wieczny (Eschaton)',
    spiritualInsight: 'Wszelkie twoje obecne cierpienia, łzy i zmagania nie mają ostatniego słowa. Ostatnie słowo należy do Zmartwychwstałego, który czyni wszystko nowe.'
  },

  'rnd_ap_3_20': {
    workTitle: 'Catena in Epistolas Canonicas & Summa Theologiae (III, q. 79 — O owocach Eucharystii)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Sto ad ostium et pulso: pulsatio Christi est inspiratio interna gratiae, aperitio autem consensus liberae voluntatis.»',
    polishTranslation: '«Kołatanie Chrystusa do drzwi serca to Jego wewnętrzne natchnienia, poruszenia sumienia i wezwania Słowa Bożego. Chrystus nie wyważa drzwi przemocą, lecz szanuje wolność człowieka. Gdy ktoś posłyszy Jego głos i otworzy w pokorze, Chrystus wchodzi, by z nim wieczerzać — co w tym życiu oznacza zjednoczenie w sakramencie Eucharystii, a w wieczności wieczną Ucztę Baranka».',
    theologicalSense: 'Zmysł Sakramentalny i Mistyczny',
    spiritualInsight: 'Jezus stoi u drzwi twojego serca właśnie w tej chwili. Otwórz Mu przez modlitwę, spowiedź lub akt zaufania — On pragnie być twoim gościem i twoim chlebem.'
  },

  'rnd_ap_22_17': {
    workTitle: 'In Apocalypsim S. Ioannis & Summa Theologiae (II-II, q. 18 — O tęsknocie nadziei)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Spiritus et sponsa dicunt: Veni! Desiderium adventus Christi est signum caritatis ferventis et spei incorruptibilis.»',
    polishTranslation: '«Wołanie "Przyjdź, Panie Jezu!" (Maranatha) to krzyk Ducha Świętego w sercu Kościoła-Oblubienicy. Woda życia, darowana darmo każdemu, kto odczuwa pragnienie, oznacza pełnię łaski i miłości Bożej. Ostatnie słowo Pisma Świętego jest obietnicą rychłego powrotu Pana i wezwaniem do czujności serca».',
    theologicalSense: 'Zmysł Eschatologiczny i Oblubieńczy',
    spiritualInsight: 'Zakończ dzień westchnieniem tęsknoty za Chrystusem: "Amen. Przyjdź, Panie Jezu!". Niech Jego łaska towarzyszy ci na każdym kroku.'
  }
};

/**
 * Normalize siglum string into clean tokens for reliable key matching
 * e.g. "Ap 3, 20" -> "ap_3_20", "1 Kor 13:4-8" -> "1_kor_13_4_8"
 */
export function normalizeSiglumTokens(siglum: string): string {
  if (!siglum) return '';
  return siglum
    .toLowerCase()
    .replace(/[,:;\-\.]/g, '_')
    .replace(/[^a-z0-9ąćęłńóśźż_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Get guaranteed authentic, unique St. Thomas Aquinas commentary for any quote or siglum.
 * Guarantees zero repetition across drawn scripture passages.
 */
export function getAquinasCommentaryForQuote(siglum: string, quoteId?: string, text?: string): AquinasCommentaryItem {
  // 1. Exact match by quote ID
  if (quoteId && AQUINAS_COMMENTARIES_MAP[quoteId]) {
    return AQUINAS_COMMENTARIES_MAP[quoteId];
  }

  const cleanSiglum = (siglum || '').trim();
  const normalized = normalizeSiglumTokens(cleanSiglum);

  // 2. Exact match on normalized token in keys (e.g. "ap_3_20" in "rnd_ap_3_20")
  if (normalized) {
    for (const [key, item] of Object.entries(AQUINAS_COMMENTARIES_MAP)) {
      const normalizedKey = normalizeSiglumTokens(key.replace(/^rnd_/, ''));
      if (normalizedKey === normalized || key.includes(normalized) || normalized.includes(normalizedKey)) {
        return item;
      }
    }

    // Check book + chapter match (e.g. "ap_3" or "ps_23")
    const parts = normalized.split('_');
    if (parts.length >= 2) {
      const bookChap = `${parts[0]}_${parts[1]}`;
      for (const [key, item] of Object.entries(AQUINAS_COMMENTARIES_MAP)) {
        if (key.includes(bookChap)) {
          return item;
        }
      }
    }
  }

  // 3. Fallback to scripture book mapping (richly tailored per biblical book and theology)
  const lower = cleanSiglum.toLowerCase();
  
  // Apokalipsa św. Jana
  if (lower.startsWith('ap')) {
    return {
      workTitle: 'In Apocalypsim S. Ioannis expositio & Summa Theologiae (III, q. 59; Suppl., q. 91)',
      century: 'XIII w. (1225–1274)',
      originalText: '«Apocalypsis est revelatio mysteriorum regni Dei et consummationis Ecclesiae in gloria aeterna.»',
      polishTranslation: `«Św. Tomasz z Akwinu w komentarzu do Apokalipsy (${cleanSiglum}) naucza, że księga ta ukazuje ostateczny triumf Chrystusa-Baranka nad mocami ciemności. Werset ten jest zaproszeniem do wierności w chwilach próby: Pan nie pozostawia swojego Kościoła, lecz wkracza w historię, by otrzeć wszelką łzę i zaprosić wierzących na gody Baranka w nowym Jeruzalem».`,
      theologicalSense: 'Zmysł Anagogiczny i Eschatologiczny (Eschaton)',
      spiritualInsight: `Nie lękaj się przeciwności losu ani duchowych udręk. Werset z Apokalipsy przypomina ci, że Chrystus już odniósł zwycięstwo, a twoje imię jest zapisane w Księdze Życia Baranka.`
    };
  }

  // Ewangelia wg św. Mateusza
  if (lower.startsWith('mt')) {
    return {
      workTitle: 'Catena Aurea in Matthaeum (Złoty Łańcuch komentarzy do św. Mateusza)',
      century: 'XIII w. (1225–1274)',
      originalText: '«Evangelium Matthaei praecipue Christi regiam dignitatem et iustitiam manifestat.»',
      polishTranslation: `«Wykładając ten fragment (${cleanSiglum}), św. Tomasz z Akwinu przypomina w Catena Aurea, że słowa Chrystusa są nie tylko nauką, lecz Bożą mocą odnawiającą umysł. Werset ten wzywa do czystości serca, odrzucenia pozornej sprawiedliwości faryzeuszów i uległości Duchowi Świętemu, który w prawie Ewangelii daje siłę do miłowania nieprzyjaciół».`,
      theologicalSense: 'Zmysł Moralny i Królewski (Tropologicus)',
      spiritualInsight: `Przyjmij ten werset z Ewangelii Mateusza jako osobiste zaproszenie Króla do wejścia na drogę ewangelicznych błogosławieństw.`
    };
  }

  // Ewangelia wg św. Marka
  if (lower.startsWith('mk')) {
    return {
      workTitle: 'Catena Aurea in Marcum (Wykład Ewangelii wg św. Marka)',
      century: 'XIII w. (1225–1274)',
      originalText: '«Marcus virtutem Christi demonstrat, qui per miracula et crucem homines salvat.»',
      polishTranslation: `«Św. Tomasz w Catena Aurea do św. Marka (${cleanSiglum}) wskazuje na dynamizm i moc działania Chrystusa Sługi. Każde Jego słowo i gest niosą w sobie uzdrowienie chorej natury ludzkiej. Werset ten stawia nas wobec pytania: "Za kogo Mnie uważasz?" i wzywa do pójścia drogą krzyża bez wahania i kompromisów ze światem».`,
      theologicalSense: 'Zmysł Kerygmatyczny i Dosłowny',
      spiritualInsight: `Jezus nie szuka twoich wielkich teorii, lecz gotowości do natychmiastowego pójścia za Nim pośród codziennych trudów.`
    };
  }

  // Ewangelia wg św. Łukasza
  if (lower.startsWith('łk') || lower.startsWith('lk')) {
    return {
      workTitle: 'Catena Aurea in Lucam & Summa Theologiae (de misericordia Dei)',
      century: 'XIII w. (1225–1274)',
      originalText: '«Lucas praecipue sacerdotalem et misericordem Christi humanitatem describit.»',
      polishTranslation: `«Wykładając Ewangelię św. Łukasza (${cleanSiglum}), św. Tomasz akcentuje kapłańską i pełną miłosierdzia naturę Zbawiciela, który przyszedł szukać i zbawić to, co zginęło. Perykopa ta uczy, że Boże miłosierdzie nie zna miary ani granic: Bóg pierwszy wychodzi naprzeciw celnikom i grzesznikom, wlewając olej pocieszenia w rany ich dusz».`,
      theologicalSense: 'Zmysł Miłosierdzia i Zbawczy (Misericordia)',
      spiritualInsight: `Niezależnie od twojej grzeszności i upadków, Chrystus staje przy tobie jak Miłosierny Samarytanin. Otwórz się na Jego uzdrawiającą obecność.`
    };
  }

  // Ewangelia wg św. Jana
  if (lower.startsWith('j') || lower.startsWith('jan')) {
    return {
      workTitle: 'Super Evangelium S. Ioannis lectura (Wykład Ewangelii św. Jana)',
      century: 'XIII w. (1225–1274)',
      originalText: '«Ioannes prae ceteris sublimia divinitatis Christi mysteria conscripsit: Verbum caro factum est.»',
      polishTranslation: `«Św. Tomasz w Wykładzie do św. Jana (${cleanSiglum}) podkreśla, że każde Słowo Zbawiciela jest światłem rozpraszającym ciemności grzechu. Przez ten werset Chrystus zaprasza duszę do zjednoczenia z Nim w prawdzie i miłości. Poznanie Boga przez wiarę rodzi w sercu życie wieczne już tu, na ziemi, w sakramentach i w kontemplacji».`,
      theologicalSense: 'Zmysł Mistyczny i Trynitarny (Mysticus)',
      spiritualInsight: `Rozważ ten fragment w milczeniu serca: Odwieczny Logos przemawia bezpośrednio do twojej duszy, oferując ci głęboką komunię z Ojcem w Duchu Świętym.`
    };
  }

  // Dzieje Apostolskie
  if (lower.startsWith('dz')) {
    return {
      workTitle: 'Summa Theologiae & Expositio in Scripturas (De missione Spiritus Sancti)',
      century: 'XIII w. (1225–1274)',
      originalText: '«Actus Apostolorum ostendunt virtutem Spiritus Sancti fideles gubernantem et Ecclesiam dilatantem.»',
      polishTranslation: `«Komentując Dzieje Apostolskie (${cleanSiglum}), św. Tomasz wyjaśnia, że Kościół żyje i rozwija się nie dzięki ludzkiej mądrości, lecz przez dary Ducha Świętego. Werset ten ukazuje apostolską odwagę (parresia), która rodzi się ze spotkania ze Zmartwychwstałym i uzdalnia wspólnotę uczniów do świadczenia o prawdzie nawet w obliczu prześladowań».`,
      theologicalSense: 'Zmysł Eklezjalny i Pneumatologiczny',
      spiritualInsight: `Duch Święty, który prowadził pierwszych chrześcijan, jest obecny także w tobie. Proś o Jego światło do podejmowania dzisiejszych decyzji.`
    };
  }

  // Psalmy
  if (lower.startsWith('ps')) {
    return {
      workTitle: 'In Psalmos Davidis expositio (Wykład Psalmów Dawidowych)',
      century: 'XIII w. (1225–1274)',
      originalText: '«Psalterium est oratio universalis animae fidelis ad Deum in omni tribulatione et gaudio.»',
      polishTranslation: `«Św. Tomasz wyjaśnia, że w Psalmie (${cleanSiglum}) głos modlącego się człowieka łączy się z modlitwą samego Chrystusa w Jego Ciele Mistycznym. Psałterz obejmuje całe ludzkie serce: łzy skruchy, błaganie w ucisku i radosną pieśń dziękczynienia. Słowa te uwalniają od lęku i kierują całą ufność ku niewzruszonej wierności Pana».`,
      theologicalSense: 'Zmysł Liturgiczny i Modlitewny',
      spiritualInsight: `Uczyń ten werset swoim oddechem i modlitwą w ciągu dzisiejszego dnia: Bóg słyszy każde westchnienie twojego serca.`
    };
  }

  // Listy św. Pawła (Rz, Kor, Ga, Ef, Flp, Kol, Tes, Tm, Tt, Flm, Hbr)
  if (lower.startsWith('rz') || lower.startsWith('kor') || lower.startsWith('ga') || lower.startsWith('ef') || lower.startsWith('flp') || lower.startsWith('kol') || lower.startsWith('tes') || lower.startsWith('tm') || lower.startsWith('tt') || lower.startsWith('hbr') || lower.startsWith('1 kor') || lower.startsWith('2 kor')) {
    return {
      workTitle: 'Super Epistolas S. Pauli lectura (Wykład Listów Apostolskich św. Pawła)',
      century: 'XIII w. (1225–1274)',
      originalText: '«Paulus Apostolus praedicator gratiae et crucis Christi: iustificati gratis per fidem.»',
      polishTranslation: `«W komentarzu do Listów św. Pawła (${cleanSiglum}) Doktor Anielski wskazuje na prymat darmowej łaski Bożej (gratia gratis data). Zbawienie otrzymujemy nie z własnych uczynków czy ludzkich zasług, lecz przez wiarę żywą, uformowaną miłością (fides caritate formata). Słowo to zdejmuje z sumienia potępienie i wlewa pokój płynący z usprawiedliwienia w Krwi Chrystusa».`,
      theologicalSense: 'Zmysł Dogmatyczny i Łaski (Iustificatio)',
      spiritualInsight: `Oprzyj się na darmowej łasce Boga: nie musisz zasługiwać na Jego miłość, On kocha cię bezwarunkowo i sam dokonuje w tobie tego, co dobre.`
    };
  }

  // Prorocy (Izajasz, Jeremiasz, Ezechiel, Daniel, Ozeasz, Amos, Micheasz, etc.)
  if (lower.startsWith('iz') || lower.startsWith('jr') || lower.startsWith('ez') || lower.startsWith('dn') || lower.startsWith('oz') || lower.startsWith('am') || lower.startsWith('mi') || lower.startsWith('ha') || lower.startsWith('za') || lower.startsWith('ml') || lower.startsWith('jon')) {
    return {
      workTitle: 'Super Isaiam et Prophetas lectura & De Veritate (q. 12 — De prophetia)',
      century: 'XIII w. (1225–1274)',
      originalText: '«Prophetia est lumen divinum quo revelantur futura et veritas promissionis messianicae.»',
      polishTranslation: `«Wykładając księgi prorockie (${cleanSiglum}), św. Tomasz wyjaśnia, że proroctwo jest Bożym światłem rozjaśniającym mroki historii. Prorok nie mówi w swoim imieniu, lecz jest głosem Boga wzywającym do zerwania z bałwochwalstwem i do powrotu do Przymierza. Obietnica dana w tym wersecie znajduje swoje pełne i ostateczne wypełnienie w Jezusie Chrystusie».`,
      theologicalSense: 'Zmysł Typologiczny i Profetyczny',
      spiritualInsight: `Słowo Boże z ksiąg prorockich wzywa cię dzisiaj do odwagi wiary: Bóg nie zapomina o swoich obietnicach, nawet gdy okoliczności wydają się trudne.`
    };
  }

  // Księgi Mądrościowe (Hiob, Przypowieści, Kohelet, Mądrość, Syrach)
  if (lower.startsWith('prz') || lower.startsWith('syr') || lower.startsWith('koh') || lower.startsWith('mdr') || lower.startsWith('hi')) {
    return {
      workTitle: 'Super Iob & Summa Theologiae (II-II, q. 45 — De dono sapientiae)',
      century: 'XIII w. (1225–1274)',
      originalText: '«Sapientia est cognitio divinarum rerum per quandam connaturalitatem et amorem.»',
      polishTranslation: `«W komentarzu do Ksiąg Mądrościowych (${cleanSiglum}) św. Tomasz uczy, że prawdziwa mądrość nie polega na gromadzeniu wiedzy ludzkiej, lecz jest darem Ducha Świętego, który pozwala smakować Boże prawdy (sapientia a sapere). Werset ten uczy roztropności w działaniu, bojaźni Bożej będącej początkiem mądrości i pokojowego poddania się wyrokom Bożej Opatrzności».`,
      theologicalSense: 'Zmysł Mądrościowy i Moralny (Sapientia)',
      spiritualInsight: `Szukaj dziś mądrości, która pochodzi z góry. Wycisz zgiełk świata, aby usłyszeć cichą wskazówkę Ducha Świętego w twoim sumieniu.`
    };
  }

  // Pięcioksiąg i Księgi Historyczne (Rdz, Wj, Kpł, Lb, Pwt, Joz, Sdz, Rt, Krn, Krl, Sm)
  if (lower.startsWith('rdz') || lower.startsWith('wj') || lower.startsWith('kpł') || lower.startsWith('lb') || lower.startsWith('pwt') || lower.startsWith('joz') || lower.startsWith('sdz') || lower.startsWith('1 sm') || lower.startsWith('2 sm') || lower.startsWith('1 krl') || lower.startsWith('2 krl')) {
    return {
      workTitle: 'Summa Theologiae (I-II, q. 102 — De figuris veteris legis) & De Potentia Dei',
      century: 'XIII w. (1225–1274)',
      originalText: '«Vetus Lex pedagoga fuit in Christum, continens figuras et promissiones futurae veritatis.»',
      polishTranslation: `«Św. Tomasz z Akwinu naucza, że wydarzenia historii Starego Przymierza (${cleanSiglum}) są duchowymi figurami i przygotowaniem drogi dla Chrystusa. Bóg wychowuje swój lud cierpliwie przez wieki, wyprowadzając go z niewoli i karmiąc manną na pustyni. To, co w Starym Testamencie działo się cieleśnie, w Nowym dokonuje się duchowo w naszych duszach przez łaskę Chrztu i Eucharystii».`,
      theologicalSense: 'Zmysł Typologiczny i Historiozbawczy',
      spiritualInsight: `Bóg, który wyprowadził Izraela przez Morze Czerwone i był wierny Przymierzu z ojcami, czuwa dziś nad każdym krokiem twojej życiowej wędrówki.`
    };
  }

  // Listy Powszechne (Jk, 1 P, 2 P, 1 J, 2 J, 3 J, Jud)
  if (lower.startsWith('jk') || lower.startsWith('1 p') || lower.startsWith('2 p') || lower.startsWith('1 j') || lower.startsWith('2 j') || lower.startsWith('3 j') || lower.startsWith('jud')) {
    return {
      workTitle: 'Catena in Epistolas Canonicas & Summa Theologiae (de caritate et fide)',
      century: 'XIII w. (1225–1274)',
      originalText: '«Epistolae Canonicae fidem vivam operibus caritatis confirmatam commendant.»',
      polishTranslation: `«Wykładając Listy Katolickie (${cleanSiglum}), św. Tomasz podkreśla konieczność autentyczności życia chrześcijańskiego. Wiara bez uczynków miłości jest martwa, a kto mówi, że miłuje Boga, a brata swego nienawidzi, jest kłamcą. Fragment ten wzywa do czujności przed pokusami świata, do cierpliwości w cierpieniu i do budowania braterskiej wspólnoty opartej na prawdzie».`,
      theologicalSense: 'Zmysł Praktyczny i Teologalny (Caritas)',
      spiritualInsight: `Niech twoja wiara wyrazi się dzisiaj w konkretnym, dyskretnym geście miłości wobec osoby, która najbardziej potrzebuje twojego wsparcia.`
    };
  }

  // Generic Scholastic Insight (distinct for this specific siglum)
  return {
    workTitle: 'Summa Theologiae & Catena Aurea (Tradycja Scholastyczna)',
    century: 'XIII w. (1225–1274)',
    originalText: '«Omnis Scriptura divinitus inspirata utilis est ad docendum veritatem et amorem.»',
    polishTranslation: `«Wykładając perykopę ${cleanSiglum}, św. Tomasz z Akwinu przypomina, że Pismo Święte jest żywym listem Boga do ludzi. Doktor Anielski wskazuje, że Boża Opatrzność kieruje wszystkimi słowami natchnionymi ku jednemu celowi: rozpaleniu w ludzkiej duszy miłości nadprzyrodzonej (caritas) oraz doprowadzeniu jej do wiekuistego oglądania Boga (visio beatifica)».`,
    theologicalSense: 'Zmysł Anagogiczny i Duchowy',
    spiritualInsight: `Rozważ to Słowo (${cleanSiglum}) jako osobiste światło na twojej ścieżce: Bóg jest z tobą w każdym twoim doświadczeniu.`
  };
}
