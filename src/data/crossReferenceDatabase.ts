import { CrossReferenceItem } from '../types';

export interface ScripturalNodeFallback {
  siglum: string;
  fullText: string;
  theologicalContext: string;
  crossReferences: CrossReferenceItem[];
}

/**
 * Curated Catholic Cross-Reference Repository according to the apparatus
 * of Jerusalem Bible (Biblia Jerozolimska) and Millennium Bible (Biblia Tysiąclecia).
 */
export const KNOWN_CROSS_REFERENCES: Record<string, ScripturalNodeFallback> = {
  '1 Kor 2, 3': {
    siglum: '1 Kor 2, 1-5',
    fullText: 'I ja też, przyszedłszy do was, bracia, nie przyszedłem, by błyszcząc słowem i mądrością głosić wam świadectwo Boże... Stanąłem przed wami w słabości i w bojaźni, i z wielkim drżeniem.',
    theologicalContext: 'Apostoł Paweł wyjaśnia Koryntianom, że moc Ewangelii nie polega na ludzkiej retoryce ani światowej potędze, lecz na mocy Ducha Świętego i Krzyża Chrystusa.',
    crossReferences: [
      {
        siglum: '2 Kor 12, 9-10',
        text: 'Lecz Pan mi powiedział: «Wystarczy ci mojej łaski. Moc bowiem w słabości się doskonali». Najchętniej więc będę się chlubił z moich słabości, aby zamieszkała we mnie moc Chrystusa.',
        testament: 'NT',
        relation: 'Moc w Słabości (Biblia Jerozolimska)',
        explanation: 'Doświadczenie własnej bezsilności staje się przestrzenią, w której objawia się prawdziwa moc Boga i łaska Zmartwychwstałego.'
      },
      {
        siglum: 'Iz 53, 2-4',
        text: 'Nie miał On wdzięku ani też blasku, aby na Niego popatrzeć... Wzgardzony i odepchnięty przez ludzi, Mąż boleści, oswojony z cierpieniem... Lecz On się obarczył naszym cierpieniem.',
        testament: 'ST',
        relation: 'Proroctwo o Słudze Cierpiącym',
        explanation: 'Bóg objawia zbawienie nie przez ziemski splendor, lecz przez pokorę i uniżenie Sługi Jahwe.'
      },
      {
        siglum: '1 Kor 1, 18.23-25',
        text: 'Nauka bowiem krzyża głupstwem jest dla tych, co idą na zatracenie, mocą Bożą zaś dla nas, którzy dostępujemy zbawienia... Głosimy Chrystusa ukrzyżowanego, który jest zgorszeniem dla Żydów, a głupstwem dla pogan.',
        testament: 'NT',
        relation: 'Mądrość Krzyża i Skandal Wiary',
        explanation: 'Krzyż burzy ludzkie schematy samowystarczalności i objawia mądrość Boga przekraczającą logikę świata.'
      },
      {
        siglum: 'Dz 18, 9-10',
        text: 'W nocy Pan rzekł do Pawła w widzeniu: «Przestań się lękać, a przemawiaj i nie milcz, bo Ja jestem z tobą i nikt nie targnie się na ciebie, aby ci wyrządzić krzywdę, albowiem wiele ludu mam w tym mieście».',
        testament: 'NT',
        relation: 'Kontekst Historyczny Misji w Koryncie',
        explanation: 'Św. Paweł w Koryncie zmagał się z lękiem i osamotnieniem; Chrystus osobiście zapewnia go o swojej obecności.'
      },
      {
        siglum: 'Flp 2, 6-8',
        text: 'On, istniejąc w postaci Bożej... ogołocił samego siebie, przyjąwszy postać sługi... uniżył samego siebie, stając się posłusznym aż do śmierci — i to śmierci krzyżowej.',
        testament: 'NT',
        relation: 'Kenoza Chrystusa',
        explanation: 'Chrystus uniżył samego siebie, dając wzór apostołom, by nie szukali ludzkiego poklasku, lecz drogi uniżenia.'
      }
    ]
  },

  '1 Kor 2, 1': {
    siglum: '1 Kor 2, 1-5',
    fullText: 'I ja też, przyszedłszy do was, bracia, nie przyszedłem, by błyszcząc słowem i mądrością głosić wam świadectwo Boże... Stanąłem przed wami w słabości i w bojaźni, i z wielkim drżeniem.',
    theologicalContext: 'Apostoł Paweł wyjaśnia Koryntianom, że moc Ewangelii nie polega na ludzkiej retoryce ani światowej potędze, lecz na mocy Ducha Świętego i Krzyża Chrystusa.',
    crossReferences: [
      {
        siglum: '2 Kor 12, 9-10',
        text: 'Lecz Pan mi powiedział: «Wystarczy ci mojej łaski. Moc bowiem w słabości się doskonali».',
        testament: 'NT',
        relation: 'Moc w Słabości',
        explanation: 'Paradoks chrześcijański: Bóg posługuje się glinianymi naczyniami, by chwała należała do Niego.'
      },
      {
        siglum: 'Iz 53, 2-4',
        text: 'Nie miał On wdzięku ani też blasku... Wzgardzony i odepchnięty przez ludzi.',
        testament: 'ST',
        relation: 'Proroctwo o Słudze Pańskim',
        explanation: 'Zapowiedź uniżenia Mesjasza, na którym opiera się Paweł głosząc Chrystusa Ukrzyżowanego.'
      },
      {
        siglum: '1 Kor 1, 23-25',
        text: 'Głosimy Chrystusa ukrzyżowanego... To bowiem, co jest głupstwem u Boga, przewyższa mądrością ludzi, a co jest słabe u Boga, przewyższa mocą ludzi.',
        testament: 'NT',
        relation: 'Mądrość Boża a mądrość świata',
        explanation: 'Fundament teologii św. Pawła: siła wiary rodzi się ze spotkania ze Zmartwychwstałym Ukrzyżowanym.'
      }
    ]
  },

  'J 1, 29': {
    siglum: 'J 1, 29',
    fullText: 'Nazajutrz Jan ujrzał Jezusa, podchodzącego ku niemu, i rzekł: «Oto Baranek Boży, który gładzi grzech świata».',
    theologicalContext: 'Świadectwo Jana Chrzciciela otwierające Ewangelię wg św. Jana. Wskazuje na Chrystusa jako prawdziwego Baranka Paschalnego i Cierpiącego Sługę, który bierze na siebie winę ludzkości.',
    crossReferences: [
      {
        siglum: 'Wj 12, 1-14',
        text: 'Baranek będzie bez skazy, samiec, jednoroczny... Krew posłuży wam do oznaczenia domów, w których będziecie.',
        testament: 'ST',
        relation: 'Figura Paschalna',
        explanation: 'Krew baranka paschalnego w Egipcie ratująca lud wybrany od anioła zagłady i otwierająca drogę wyjścia z niewoli.'
      },
      {
        siglum: 'Iz 53, 7.11-12',
        text: 'Dręczono Go, lecz sam się dał gnębić, nawet nie otworzył ust swoich. Jak baranek na rzeź prowadzony... On poniósł grzechy wielu.',
        testament: 'ST',
        relation: 'Proroctwo o Słudze Jahwe',
        explanation: 'Pieśń o Cierpiącym Słudze Pańskim, który dobrowolnie staje się ofiarą przebłagalną za grzechy narodu.'
      },
      {
        siglum: 'Rdz 22, 7-14',
        text: 'Izaak rzekł: «Oto ogień i drwa, a gdzież jest baranek na całopalenie?» Abraham odpowiedział: «Bóg upatrzy sobie baranka».',
        testament: 'ST',
        relation: 'Typologia Przymierza (Akedah)',
        explanation: 'Ofiara na górze Moria: Abraham nie cofnął swego jedynego syna, Bóg złożył w ofierze własnego Syna Jednorodzonego.'
      },
      {
        siglum: '1 Kor 5, 7',
        text: 'Chrystus bowiem został złożony w ofierze jako nasza Pascha.',
        testament: 'NT',
        relation: 'Spełnienie w Kościele',
        explanation: 'Apostoł Paweł ogłasza, że ofiara paschalna dokonała się raz na zawsze na Krzyżu, dając chrześcijanom nowe życie bez kwasu grzechu.'
      },
      {
        siglum: '1 P 1, 18-19',
        text: 'Wiecie bowiem, że z waszego odziedziczonego po przodkach złego postępowania zostaliście wykupieni nie czymś przemijającym... ale drogocenną krwią Chrystusa, jako baranka niepokalanego i bez zmazy.',
        testament: 'NT',
        relation: 'Odkupienie i Wykupienie',
        explanation: 'Cena naszego zbawienia: wolność od lęku i śmierci została opłacona bezgrzesznym życiem Chrystusa.'
      },
      {
        siglum: 'Ap 5, 6.12',
        text: 'I ujrzałem na środku tronu Baranka stojącego jakby zabitego... «Godzien jest Baranek zabity wziąć potęgę i bogactwo, i mądrość, i moc, i cześć, i chwałę, i błogosławieństwo».',
        testament: 'NT',
        relation: 'Eschatologiczny Triumf',
        explanation: 'Zwycięstwo Baranka w liturgii niebiańskiej: to, co w oczach świata było klęską Krzyża, jest wiecznym panowaniem Boga.'
      }
    ]
  },

  'Pwt 4, 1-2': {
    siglum: 'Pwt 4, 1-2. 6-8',
    fullText: 'Mojżesz powiedział do ludu: «A teraz, Izraelu, słuchaj praw i nakazów, które was uczę wypełniać, abyście żyli... Nic nie dodacie do tego, co wam nakazuję, i nic z tego nie odejmiecie».',
    theologicalContext: 'Mojżesz wzywa Izraela do wierności przykazaniom Przymierza. Słowo Boga jest mądrością ludu i źródłem życia.',
    crossReferences: [
      {
        siglum: 'Ps 19, 8-11',
        text: 'Prawo Pańskie doskonałe — pokrzepia duszę; świadectwo Pana niezawodne — poucza prostaczka; nakazy Pana słuszne — radują serce.',
        testament: 'ST',
        relation: 'Zachwyt nad Słowem Bożym',
        explanation: 'Psałterz ukazuje prawo nie jako ciężar, lecz jako najcenniejszy skarb i światłość.'
      },
      {
        siglum: 'Jk 1, 21-25',
        text: 'Wprowadzajcie zaś słowo w czyn, a nie bądźcie tylko słuchaczami oszukującymi samych siebie.',
        testament: 'NT',
        relation: 'Wypełnienie w czynie',
        explanation: 'Św. Jakub podkreśla, że słuchanie Tory/Ewangelii bez wprowadzania w życie miłości jest próżną iluzją.'
      },
      {
        siglum: 'Mt 5, 17-19',
        text: 'Nie sądźcie, że przyszedłem znieść Prawo albo Proroków. Nie przyszedłem znieść, ale wypełnić.',
        testament: 'NT',
        relation: 'Chrystus jako Pełnia Prawa',
        explanation: 'Jezus nie odrzuca przykazań Mojżesza, lecz doprowadza je do doskonałości w przykazaniu miłości Boga i bliźniego.'
      }
    ]
  },

  'Mk 7, 1': {
    siglum: 'Mk 7, 1-8. 14-15. 21-23',
    fullText: 'Ten lud czci Mnie wargami, lecz sercem swym daleko jest ode Mnie... Nic nie wchodzi z zewnątrz w człowieka, co mogłoby uczynić go nieczystym; lecz co wychodzi z człowieka, to czyni człowieka nieczystym.',
    theologicalContext: 'Konfrontacja Jezusa z faryzejską pobożnością rytualną. Jezus przenosi uwagę ze skrupułów zewnętrznych na stan ludzkiego serca, skąd wypływają decyzje moralne.',
    crossReferences: [
      {
        siglum: 'Iz 29, 13',
        text: 'I rzekł Pan: Ponieważ ten lud zbliża się do Mnie tylko w słowach i sławi Mnie tylko wargami, podczas gdy serce jego jest daleko ode Mnie...',
        testament: 'ST',
        relation: 'Źródło cytatu prorockiego',
        explanation: 'Prorok Izajasz demaskuje obłudę i kult czysto zewnętrzny, pozbawiony nawrócenia serca i miłości do ubogich.'
      },
      {
        siglum: 'Ps 51, 12',
        text: 'Stwórz, o Boże, we mnie serce czyste i odnów w mojej piersi ducha niezwyciężonego.',
        testament: 'ST',
        relation: 'Modlitwa o Nowe Serce',
        explanation: 'Człowiek nie jest w stanie sam obmyć swego wnętrza — potrzebuje łaski przebaczenia i daru nowego serca od Stwórcy.'
      },
      {
        siglum: 'Rz 14, 14.17',
        text: 'Wiem i przekonany jestem w Panu Jezusie, że nie ma niczego, co by samo przez się było nieczyste... Bo królestwo Boże to nie sprawa tego, co się je i pije, ale to sprawiedliwość, pokój i radość w Duchu Świętym.',
        testament: 'NT',
        relation: 'Wolność w Duchu',
        explanation: 'Św. Paweł wyjaśnia, że prawdziwa świętość leży w budowaniu wspólnoty i pokoju, a nie w dietetycznych przepisach.'
      }
    ]
  },

  'Ps 23, 1': {
    siglum: 'Ps 23, 1-6',
    fullText: 'Pan jest moim pasterzem, nie brak mi niczego. Pozwala mi leżeć na zielonych pastwiskach. Prowadzi mnie nad wody, gdzie mogę odpocząć: orzeźwia moją duszę.',
    theologicalContext: 'Wyznanie bezgranicznego zaufania Bożej Opatrzności. Bóg Pasterz prowadzi człowieka przez mroczne doliny i przygotowuje stół biesiadny obfitości.',
    crossReferences: [
      {
        siglum: 'J 10, 11-15',
        text: 'Ja jestem dobrym pasterzem. Dobry pasterz daje życie swoje za owce... Znam owce moje, a moje Mnie znają.',
        testament: 'NT',
        relation: 'Chrystus Dobry Pasterz',
        explanation: 'Jezus objawia się jako Pasterz zapowiedziany w Psałterzu, który nie tylko prowadzi, lecz oddaje własne życie za stado.'
      },
      {
        siglum: 'Ez 34, 11-16',
        text: 'Oto Ja sam będę szukał moich owiec i będę miał o nie pieczę. Zagubioną odszukam, zabłąkaną sprowadzę z powrotem, skaleczoną opatrzę, chorą umocnię.',
        testament: 'ST',
        relation: 'Proroctwo o Opiece Bożej',
        explanation: 'Bóg sprzeciwia się złym pasterzom i obiecuje, że sam osobiście zaopiekuje się słabymi i zranionymi owcami.'
      },
      {
        siglum: 'Ap 7, 17',
        text: 'Bo Baranek, który jest na środku tronu, będzie ich pasł i poprowadzi ich do źródeł wód życia: i każdą łzę otrze Bóg z ich oczu.',
        testament: 'NT',
        relation: 'Wieczne pastwiska w Niebie',
        explanation: 'Ostateczne spełnienie obietnicy w wieczności, gdzie Baranek-Pasterz zaspokaja wszelkie pragnienie zbawionych.'
      }
    ]
  },

  'Iz 61, 1': {
    siglum: 'Iz 61, 1-3',
    fullText: 'Duch Pana Boga nade mną, bo Pan mnie namaścił. Posłał mnie, by głosić dobrą nowinę ubogim, by opatrywać rany serc złamanych, by zapowiadać wyzwolenie jeńcom i więźniom swobodę.',
    theologicalContext: 'Manifest mesjański proroka Izajasza: namaszczenie Duchem Świętym w celu przyniesienia wyzwolenia, uzdrowienia i ogłoszenia roku łaski od Pana.',
    crossReferences: [
      {
        siglum: 'Łk 4, 16-21',
        text: 'Rozwinąwszy księgę, natrafił na miejsce, gdzie było napisane: Duch Pański spoczywa na Mnie... «Dziś spełniły się te słowa Pisma, któreście słyszeli».',
        testament: 'NT',
        relation: 'Wypełnienie w Nazarecie',
        explanation: 'Jezus w synagodze w Nazarecie odnosi proroctwo Izajasza do samego siebie, inaugurując swoją publiczną misję.'
      },
      {
        siglum: 'Kpł 25, 8-13',
        text: 'I ogłosicie wyzwolenie w kraju dla wszystkich jego mieszkańców. Będzie to dla was rok jubileuszowy.',
        testament: 'ST',
        relation: 'Rok Jubileuszowy i Łaska',
        explanation: 'Zakorzenienie w Prawie Mojżeszowym o roku jubileuszowym, w którym darowano wszelkie długi i zwracano wolność niewolnikom.'
      },
      {
        siglum: 'Mt 11, 4-5',
        text: 'Idźcie i oznajmijcie Janowi to, co słyszycie i na co patrzycie: niewidomi wzrok odzyskują, chromi chodzą, ubogim głosi się Ewangelię.',
        testament: 'NT',
        relation: 'Znaki Mesjańskie',
        explanation: 'Jezus potwierdza uwięzionemu Janowi Chrzcicielowi swoją tożsamość poprzez spełnianie znaków zapowiedzianych przez Izajasza.'
      }
    ]
  }
};

/**
 * Retrieve curated cross-reference repository entries according to the apparatus
 * of Jerusalem Bible and Millennium Bible.
 * ZERO IMAGINATION: If no curated record exists, returns null. Never invents synthetic cross-references.
 */
export function findCuratedCrossReferences(siglum: string): ScripturalNodeFallback | null {
  const norm = (siglum || '').trim();
  if (!norm) return null;

  for (const [key, val] of Object.entries(KNOWN_CROSS_REFERENCES)) {
    if (norm.toLowerCase().startsWith(key.toLowerCase()) || key.toLowerCase().startsWith(norm.toLowerCase())) {
      return val;
    }
  }
  return null;
}

export function getGuaranteedCrossReferences(siglum: string, inputExcerpt?: string): ScripturalNodeFallback | null {
  return findCuratedCrossReferences(siglum);
}
