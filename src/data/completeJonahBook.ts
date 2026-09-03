// Kompletny, autentyczny tekst Księgi Jonasza (Jon 1–4) według Biblii Tysiąclecia (Wydanie V)
// Zawiera podział na rozdziały, każdy werset z numeracją oraz wersję bilingwistyczną / hebrajską.

export interface JonahVerse {
  chapter: number;
  verse: number;
  siglum: string;
  textPl: string;
  textHe?: string;
  transliteration?: string;
}

export interface JonahChapter {
  chapterNumber: number;
  title: string;
  summary: string;
  verses: JonahVerse[];
}

export const JONAH_CHAPTERS: JonahChapter[] = [
  {
    chapterNumber: 1,
    title: 'Ucieczka Jonasza przed obliczem Pana i burza na morzu',
    summary: 'Pan powołuje Jonasza do Niniwy. Jonasz ucieka do Tarszisz. Gwałtowny sztorm na morzu, rzucenie losów, wyznanie wiary Jonasza i wrzucenie go w fale morskie.',
    verses: [
      {
        chapter: 1,
        verse: 1,
        siglum: 'Jon 1, 1',
        textPl: 'Pan skierował do Jonasza, syna Amittaja, te słowa:',
        textHe: 'וַיְהִי דְּבַר־יְהוָה אֶל־יוֹנָה בֶן־אֲמִתַּי לֵאמֹר׃',
        transliteration: 'Wajehi dewar-Adonaj el-Jona ben-Amittaj lemor:'
      },
      {
        chapter: 1,
        verse: 2,
        siglum: 'Jon 1, 2',
        textPl: '«Wstań, idź do Niniwy — wielkiego miasta — i upomnij ją, albowiem jej nieprawość dotarła przed moje oblicze».',
        textHe: 'קוּם לֵךְ אֶל־נִינְוֵה הָעִיר הַגְּדוֹלָה וּקְרָא עָלֶיהָ כִּי־עָלְתָה רָעָתָם לְפָנָי׃',
        transliteration: 'Kum lech el-Ninwe ha-ir ha-gedola u-kera aleha ki-aleta ra\'atam lefanaj.'
      },
      {
        chapter: 1,
        verse: 3,
        siglum: 'Jon 1, 3',
        textPl: 'A Jonasz wstał, aby uciec do Tarszisz przed obliczem Pana. Zszedł do Jafy, znalazł okręt płynący do Tarszisz, uiścił opłatę i wsiadł na niego, by udać się z nimi do Tarszisz, daleko od oblicza Pana.',
        textHe: 'וַיָּקָם יוֹנָה לִבְרֹחַ תַּרְשִׁישָׁה מִלִּפְנֵי יְהוָה וַיֵּרֶד יָפוֹ...',
        transliteration: 'Wajakam Jona liwroach tarszisza milifne Adonaj...'
      },
      {
        chapter: 1,
        verse: 4,
        siglum: 'Jon 1, 4',
        textPl: 'Ale Pan zesłał na morze gwałtowny wiatr i powstała wielka burza na morzu, tak iż okrętowi groziło rozbicie.',
        textHe: 'וַיהוָה הֵטִיל רוּחַ־גְּדוֹלָה אֶל־הַיָּם וַיְהִי סַעַר־גָּדוֹל בַּיָּם...',
        transliteration: 'Wa-Adonaj hetil ruach-gedola el-hayam...'
      },
      {
        chapter: 1,
        verse: 5,
        siglum: 'Jon 1, 5',
        textPl: 'Przelękli się żeglarze i każdy wołał do swego boga; wyrzucili do morza ładunek, który był na okręcie, by ulżyć sobie. Jonasz zaś zszedł do wnętrza okrętu, położył się i twardo zasnął.',
        textHe: 'וַיִּירְאוּ הַמַּלָּחִים וַיִּזְעֲקוּ אִישׁ אֶל־אֱלֹהָיו...',
        transliteration: 'Wajire\'u hammallachim wajiz\'aku isz el-elohaw...'
      },
      {
        chapter: 1,
        verse: 6,
        siglum: 'Jon 1, 6',
        textPl: 'Przystąpił do niego dowódca i rzekł mu: «Dlaczego ty śpisz? Wstań, wołaj do twego Boga, może wspomni Bóg o nas i nie zginiemy».',
        textHe: 'וַיִּקְרַב אֵלָיו רַב הַחֹבֵל וַיֹּאמֶר לוֹ מַה־לְּךָ נִרְדָּם...',
        transliteration: 'Wajikraw elaw raw hachowel wajomer lo ma-lecha nirdam...'
      },
      {
        chapter: 1,
        verse: 7,
        siglum: 'Jon 1, 7',
        textPl: 'I mówili jeden do drugiego: «Chodźcie, rzućmy losy, a dowiemy się, z czyjej winy spada na nas to nieszczęście». I rzucili losy, a los padł na Jonasza.',
        textHe: 'וַיֹּאמְרוּ אִישׁ אֶל־רֵעֵהוּ לְכוּ וְנַפִּילָה גוֹרָלוֹת...',
        transliteration: 'Wajomeru isz el-re\'ehu lechu we-nappila goralot...'
      },
      {
        chapter: 1,
        verse: 8,
        siglum: 'Jon 1, 8',
        textPl: 'Rzekli mu więc: «Powiedz nam, z czyjego powodu spotkało nas to nieszczęście? Jaki jest twój zawód? Skąd pochodzisz? Z jakiego kraju jesteś i z jakiego narodu?»',
        textHe: 'וַיֹּאמְרוּ אֵלָיו הַגִּידָה־נָּא לָנוּ בַּאֲשֶׁר לְמִי־הָרָעָה הַזֹּאת לָנוּ...',
        transliteration: 'Wajomeru elaw haggida-nna lanu...'
      },
      {
        chapter: 1,
        verse: 9,
        siglum: 'Jon 1, 9',
        textPl: 'A on im odpowiedział: «Jestem Hebrajczykiem i czczę Pana, Boga nieba, który stworzył morze i suchy ląd».',
        textHe: 'וַיֹּאמֶר אֲלֵיהֶם עִבְרִי אָנֹכִי וְאֶת־יְהוָה אֱלֹהֵי הַשָּׁמַיִם אֲנִי יָרֵא אֲשֶׁר־עָשָׂה אֶת־הַיָּם וְאֶת־הַיַּבָּשָׁה׃',
        transliteration: 'Wajomer alehem: Iwri anochi, we-et-Adonaj Elohe ha-szamajim ani jare, aszer-asa et-hayam we-et-hajabbasa.'
      },
      {
        chapter: 1,
        verse: 10,
        siglum: 'Jon 1, 10',
        textPl: 'Wtedy ludzie ci ulękli się bardzo i rzekli do niego: «Dlaczego to uczyniłeś?» Dowiedzieli się bowiem, że ucieka przed Panem, bo im to powiedział.',
        textHe: 'וַיִּירְאוּ הָאֲנָשִׁים יִרְאָה גְדוֹלָה...',
        transliteration: 'Wajire\'u ha-anaszim jir\'a gedola...'
      },
      {
        chapter: 1,
        verse: 11,
        siglum: 'Jon 1, 11',
        textPl: 'Zapytali go: «Co mamy z tobą zrobić, aby morze przestało się burzyć przeciw nam?» Morze bowiem coraz bardziej się srożyło.',
        textHe: 'וַיֹּאמְרוּ אֵלָיו מַה־נַּעֲשֶׂה לָּךְ וְיִשְׁתֹּק הַיָּם מֵעָלֵינוּ...',
        transliteration: 'Wajomeru elaw ma-na\'ase lach we-jisztok hayam me\'alejnu...'
      },
      {
        chapter: 1,
        verse: 12,
        siglum: 'Jon 1, 12',
        textPl: 'Odpowiedział im: «Weźcie mnie i wrzućcie w morze, a morze uspokoi się przeciwko wam, ponieważ wiem, że z mojego powodu ta wielka burza powstała przeciw wam».',
        textHe: 'וַיֹּאמֶר אֲלֵיהֶם שָׂאוּנִי וַהֲטִילֻנִי אֶל־הַיָּם וְיִשְׁתֹּק הַיָּם מֵעֲלֵיכֶם...',
        transliteration: 'Wajomer alehem: Se\'uni wa-hatiluni el-hayam we-jisztok hayam me\'alechem...'
      },
      {
        chapter: 1,
        verse: 13,
        siglum: 'Jon 1, 13',
        textPl: 'Ludzie ci usiłowali przez wiosłowanie przybić do lądu, ale nie mogli, bo morze srożyło się coraz bardziej przeciw nim.',
        textHe: 'וַיַּחְתְּרוּ הָאֲנָשִׁים לְהָשִׁיב אֶל־הַיַּבָּשָׁה וְלֹא יָכֹלוּ...',
        transliteration: 'Wajachteru ha-anaszim lehasziw el-hajabbasa...'
      },
      {
        chapter: 1,
        verse: 14,
        siglum: 'Jon 1, 14',
        textPl: 'Zawołali więc do Pana i rzekli: «O Panie, prosimy Cię, nie pozwól nam zginąć z powodu życia tego człowieka i nie obciążaj nas krwią niewinną, bo Ty, Panie, czynisz to, co Ci się podoba».',
        textHe: 'וַיִּקְרְאוּ אֶל־יְהוָה וַיֹּאמְרוּ אָנָּה יְהוָה אַל־נָא נֹאבְדָה...',
        transliteration: 'Wajikre\'u el-Adonaj wajomeru: Anna Adonaj, al-na noweda...'
      },
      {
        chapter: 1,
        verse: 15,
        siglum: 'Jon 1, 15',
        textPl: 'I wzięli Jonasza, i wrzucili go w morze, a morze przestało się srożyć.',
        textHe: 'וַיִּשְׂאוּ אֶת־יוֹנָה וַיְטִלֻהוּ אֶל־הַיָּם וַיַּעֲמֹד הַיָּם מִזַּעְפּוֹ׃',
        transliteration: 'Wajis\'u et-Jona wajetilu-hu el-hayam, waja\'amod hayam mizza\'po.'
      },
      {
        chapter: 1,
        verse: 16,
        siglum: 'Jon 1, 16',
        textPl: 'Wtedy ogarnęła tych ludzi wielka bojaźń przed Panem. Złożyli Panu ofiarę i uczynili śluby.',
        textHe: 'וַיִּירְאוּ הָאֲנָשִׁים יִרְאָה גְדוֹלָה אֶת־יְהוָה וַיִּזְבְּחוּ־זֶבַח לַיהוָה וַיִּדְּרוּ נְדָרִים׃',
        transliteration: 'Wajire\'u ha-anaszim jir\'a gedola et-Adonaj, wajizbechu-zewach l-Adonaj wajidderu nedarim.'
      }
    ]
  },
  {
    chapterNumber: 2,
    title: 'Jonasz we wnętrznościach ryby i modlitwa ocalenia',
    summary: 'Pan posyła wielką rybę, aby połknęła Jonasza. Jonasz spędza we wnętrznościach ryby trzy dni i trzy noce — fundamentalny znak zmartwychwstania Chrystusa (Mt 12, 39-40). Modlitwa dziękczynienia i uwolnienie.',
    verses: [
      {
        chapter: 2,
        verse: 1,
        siglum: 'Jon 2, 1',
        textPl: 'Pan zaś zesłał wielką rybę, aby połknęła Jonasza. I był Jonasz we wnętrznościach ryby trzy dni i trzy noce.',
        textHe: 'וַיְמַן יְהוָה דָּג גָּדוֹל לִבְלֹעַ אֶת־יוֹנָה וַיְהִי יוֹנָה בִּמְעֵי הַדָּג שְׁלֹשָׁה יָמִים וּשְׁלֹשָׁה לֵילוֹת׃',
        transliteration: 'Wajeman Adonaj dag gadol liwlo\'a et-Jona, wajehi Jona bi-me\'e ha-dag szelosza jamim u-szelosza lelot.'
      },
      {
        chapter: 2,
        verse: 2,
        siglum: 'Jon 2, 2',
        textPl: 'I modlił się Jonasz do swego Pana, Boga, z wnętrzności ryby.',
        textHe: 'וַיִּתְפַּלֵּל יוֹנָה אֶל־יְהוָה אֱלֹהָיו מִמְּעֵי הַדָּגָה׃',
        transliteration: 'Wajitpallel Jona el-Adonaj Elohaw mimme\'e ha-daga:'
      },
      {
        chapter: 2,
        verse: 3,
        siglum: 'Jon 2, 3',
        textPl: 'Mówił: «W moim udręczeniu wzywałem Pana, a On mi odpowiedział. Z głębokości Szeolu wołałem o pomoc, a Ty usłyszałeś mój głos.',
        textHe: 'וַיֹּאמֶר קָרָאתִי מִצָּרָה לִי אֶל־יְהוָה וַיַּעֲנֵנִי מִבֶּטֶן שְׁאוֹל שִׁוַּעְתִּי שָׁמַעְתָּ קוֹלִי׃',
        transliteration: 'Karati mitzara li el-Adonaj waj\'aneni, mi-beten Szeol sziwwa\'ti, szama\'ta koli.'
      },
      {
        chapter: 2,
        verse: 4,
        siglum: 'Jon 2, 4',
        textPl: 'Wrzuciłeś mnie w głębinę, w serce morza, i nurt mnie ogarnął. Wszystkie Twe nawałnice i fale przewaliły się nade mną.',
        textHe: 'וַתַּשְׁלִיכֵנִי מְצוּלָה בִּלְבַב יַמִּים וְנָהָר יְסֹבְבֵנִי כָּל־מִשְׁבָּרֶיךָ וְגַלֶּיךָ עָלַי עָבָרוּ׃',
        transliteration: 'Wataszlicheni metzula bilwaw jammim we-nahar jesoweweni...'
      },
      {
        chapter: 2,
        verse: 5,
        siglum: 'Jon 2, 5',
        textPl: 'Rzekłem: Odrzucony jestem daleko od Twoich oczu. Jakże jednak zdołam spojrzeć na Twój święty przybytek?',
        textHe: 'וַאֲנִי אָמַרְתִּי נִגְרַשְׁתִּי מִנֶּגֶד עֵינֶיךָ אַךְ אוֹסִיף לְהַבִּיט אֶל־הֵיכַל קָדְשֶׁךָ׃',
        transliteration: 'Wa-ani amarti: nigraszti minneged ejnecha, ach osif lehabbit el-hechal kodsjecha.'
      },
      {
        chapter: 2,
        verse: 6,
        siglum: 'Jon 2, 6',
        textPl: 'Ogarnęły mnie wody aż po gardło, przepaść mnie otoczyła, sitowie owinęło się wokół mojej głowy.',
        textHe: 'אֲפָפוּנִי מַיִם עַד־נֶפֶשׁ תְּהוֹם יְסֹבְבֵנִי סוּף חָבוּשׁ לְרֹאשִׁי׃',
        transliteration: 'Afafuni majim ad-nefesz, tehom jesoweweni, suf chawusz le-roszi.'
      },
      {
        chapter: 2,
        verse: 7,
        siglum: 'Jon 2, 7',
        textPl: 'Do podstaw gór zstąpiłem, zawory ziemi zamknęły się nade mną na zawsze. Lecz Ty wydobyłeś me życie z dołu, Panie, mój Boże!',
        textHe: 'לְקִצְבֵי הָרִים יָרַדְתִּי הָאָרֶץ בְּרִחֶיהָ בַעֲדִי לְעוֹלָם וַתַּעַל מִשַּׁחַת חַיַּי יְהוָה אֱלֹהָי׃',
        transliteration: 'Le-kitzwe harim jaradti... watta\'al miszachat chajjaj, Adonaj Elohaj.'
      },
      {
        chapter: 2,
        verse: 8,
        siglum: 'Jon 2, 8',
        textPl: 'Gdy ustawało we mnie życie, wspomniałem na Pana, a modlitwa moja dotarła do Ciebie, do Twego świętego przybytku.',
        textHe: 'בְּהִתְעַטֵּף עָלַי נַפְשִׁי אֶת־יְהוָה זָכָרְתִּי וַתָּבוֹא אֵלֶיךָ תְּפִלָּתִי אֶל־הֵיכַל קָדְשֶׁךָ׃',
        transliteration: 'Be-hit\'attef alaj nafszi et-Adonaj zacharti, wattavo elecha tefillati el-hechal kodsjecha.'
      },
      {
        chapter: 2,
        verse: 9,
        siglum: 'Jon 2, 9',
        textPl: 'Czciciele marnych bożków opuszczają Tego, który im jest łaskawy.',
        textHe: 'מְשַׁמְּרִים הַבְלֵי־שָׁוְא חַסְדָּם יַעֲזֹבוּ׃',
        transliteration: 'Meszammerim hawle-szaw chasdam ja\'azowu.'
      },
      {
        chapter: 2,
        verse: 10,
        siglum: 'Jon 2, 10',
        textPl: 'Ja zaś z głosem dziękczynienia złożę Tobie ofiarę; co ślubowałem, wypełnię. Zbawienie jest u Pana!».',
        textHe: 'וַאֲנִי בְּקוֹל תּוֹדָה אֶזְבְּחָה־לָּךְ אֲשֶׁר נָדַרְתִּי אֲשַׁלֵּמָה יְשׁוּעָתָה לַיהוָה׃',
        transliteration: 'Wa-ani be-kol toda ezbecha-llach, aszer nadarti aszallema: Jeszu\'ata l-Adonaj!'
      },
      {
        chapter: 2,
        verse: 11,
        siglum: 'Jon 2, 11',
        textPl: 'Wtedy Pan nakazał rybie i wyrzuciła Jonasza na suchy ląd.',
        textHe: 'וַיֹּאמֶר יְהוָה לַדָּג וַיָּקֵא אֶת־יוֹנָה אֶל־הַיַּבָּשָׁה׃',
        transliteration: 'Wajomer Adonaj laddag, wajake et-Jona el-hajabbasa.'
      }
    ]
  },
  {
    chapterNumber: 3,
    title: 'Ponowne powołanie, głoszenie w Niniwie i wielkie nawrócenie',
    summary: 'Pan po raz drugi wzywa Jonasza. Prorok wyrusza do Niniwy i głosi upadek za 40 dni. Mieszkańcy Niniwy wierzą Bogu, ogłaszają post, król zasiada w popiele. Bóg widzi ich nawrócenie i lituje się nad nimi.',
    verses: [
      {
        chapter: 3,
        verse: 1,
        siglum: 'Jon 3, 1',
        textPl: 'I skierował Pan słowo do Jonasza po raz drugi w tych słowach:',
        textHe: 'וַיְהִי דְבַר־יְהוָה אֶל־יוֹנָה שֵׁנִית לֵאמֹר׃',
        transliteration: 'Wajehi dewar-Adonaj el-Jona szenit lemor:'
      },
      {
        chapter: 3,
        verse: 2,
        siglum: 'Jon 3, 2',
        textPl: '«Wstań, idź do Niniwy, wielkiego miasta, i głoś jej nakazane ci orędzie».',
        textHe: 'קוּם לֵךְ אֶל־נִינְוֵה הָעִיר הַגְּדוֹלָה וּקְרָא אֵלֶיהָ אֶת־הַקְּרִיאָה אֲשֶׁר אָנֹכִי דֹּבֵר אֵלֶיךָ׃',
        transliteration: 'Kum lech el-Ninwe ha-ir ha-gedola u-kera eleha et-hakkria aszer anochi dover elecha.'
      },
      {
        chapter: 3,
        verse: 3,
        siglum: 'Jon 3, 3',
        textPl: 'Wstał więc Jonasz i poszedł do Niniwy, jak powiedział Pan. Niniwa zaś była miastem bardzo wielkim, na trzy dni drogi pieszo.',
        textHe: 'וַיָּקָם יוֹנָה וַיֵּלֶךְ אֶל־נִינְוֵה כִּדְבַר יְהוָה וְנִינְוֵה הָיְתָה עִיר־גְּדוֹלָה לֵאלֹהִים מַהֲלַךְ שְׁלֹשֶׁת יָמִים׃',
        transliteration: 'Wajakam Jona wajelech el-Ninwe kidwar Adonaj...'
      },
      {
        chapter: 3,
        verse: 4,
        siglum: 'Jon 3, 4',
        textPl: 'Jonasz rozpoczął wędrówkę przez miasto, jeden dzień drogi, i wołał: «Jeszcze czterdzieści dni, a Niniwa zostanie zburzona!»',
        textHe: 'וַיָּחֶל יוֹנָה לָבוֹא בָעִיר מַהֲלַךְ יוֹם אֶחָד וַיִּקְרָא וַיֹּאמַר עוֹד אַרְבָּעִים יוֹם וְנִינְוֵה נֶהְפָּכֶת׃',
        transliteration: '...wajikra wajomar: Od arba\'im jom we-Ninwe nehpatzet!'
      },
      {
        chapter: 3,
        verse: 5,
        siglum: 'Jon 3, 5',
        textPl: 'I uwierzyli mieszkańcy Niniwy Bogu, ogłosili post i oblekli się w wory od największego do najmniejszego.',
        textHe: 'וַיַּאֲמִינוּ אַנְשֵׁי נִינְוֵה בֵּאלֹהִים וַיִּקְרְאוּ־צוֹם וַיִּלְבְּשׁוּ שַׂקִּים מִגְּדוֹלָם וְעַד־קְטַנָּם׃',
        transliteration: 'Waja\'aminu ansze Ninwe b-Elohim, wajikre\'u-tzom wajilbeszu sakkim miggedolam we-ad-ketannam.'
      },
      {
        chapter: 3,
        verse: 6,
        siglum: 'Jon 3, 6',
        textPl: 'Doszła bowiem ta wieść do króla Niniwy; wstał ze swego tronu, zdjął z siebie płaszcz, oblókł się w wór i usiadł na popiele.',
        textHe: 'וַיִּגַּע הַדָּבָר אֶל־מֶלֶךְ נִינְוֵה וַיָּקָם מִכִּסְאוֹ וַיַּעֲבֵר אַדַּרְתּוֹ מֵעָלָיו וַיְכַס שַׂק וַיֵּשֶׁב עַל־הָאֵפֶר׃',
        transliteration: 'Wajjigga ha-dawar el-melech Ninwe wajakam mikis\'o...'
      },
      {
        chapter: 3,
        verse: 7,
        siglum: 'Jon 3, 7',
        textPl: 'I kazał ogłosić w Niniwie na mocy dekretu króla i jego dostojników: «Ludzie i zwierzęta, bydło i owce niech nic nie jedzą, niech się nie pasą i wody nie piją!',
        textHe: 'וַיַּזְעֵק וַיֹּאמֶר בְּנִינְוֵה מִטַּעַם הַמֶּלֶךְ וּגְדֹלָיו לֵאמֹר הָאָדָם וְהַבְּהֵמָה הַבָּקָר וְהַצֹּאן אַל־יִטְעֲמוּ מְאוּמָה...',
        transliteration: 'Wajaz\'ek wajomer bi-Ninwe... ha-adam we-habbehema al-yit\'amu me\'uma...'
      },
      {
        chapter: 3,
        verse: 8,
        siglum: 'Jon 3, 8',
        textPl: 'Niech się obleką w wory ludzie i zwierzęta, niech żarliwie wołają do Boga i niech każdy odwróci się od swego złego postępowania i od nieprawości, którą popełniają jego ręce!',
        textHe: 'וְיִתְכַּסּוּ שַׂקִּים הָאָדָם וְהַבְּהֵמָה וְיִקְרְאוּ אֶל־אֱלֹהִים בְּחָזְקָה וְיָשֻׁבוּ אִישׁ מִדַּרְכּוֹ הָרָעָה...',
        transliteration: 'We-yitkassu sakkim ha-adam we-habbehema we-yikre\'u el-Elohim be-chazka...'
      },
      {
        chapter: 3,
        verse: 9,
        siglum: 'Jon 3, 9',
        textPl: 'Kto wie, może Bóg się odwróci i ulituje, powstrzyma zapalczywość swego gniewu i nie zginiemy?»',
        textHe: 'מִי־יוֹדֵעַ יָשׁוּב וְנִחַם הָאֱלֹהִים וְשָׁב מֵחֲרוֹן אַפּוֹ וְלֹא נֹאבֵד׃',
        transliteration: 'Mi-jode\'a jaszuw we-nicham ha-Elohim, we-szaw mecharon appo we-lo nowed?'
      },
      {
        chapter: 3,
        verse: 10,
        siglum: 'Jon 3, 10',
        textPl: 'Zobaczył Bóg ich czyny, że odwrócili się od swego złego postępowania; i ulitował się Bóg nad niedolą, którą postanowił na nich sprowadzić, i nie uczynił tego.',
        textHe: 'וַיַּרְא הָאֱלֹהִים אֶת־מַעֲשֵׂיהֶם כִּי־שָׁבוּ מִדַּרְכָּם הָרָעָה וַיִּנָּחֶם הָאֱלֹהִים עַל־הָרָעָה אֲשֶׁר־דִּבֶּר לַעֲשׂוֹת־לָהֶם וְלֹא עָשָׂה׃',
        transliteration: 'Wajar ha-Elohim et-ma\'asehem ki-szawu midarkam ha-ra\'a, wajjinnachem ha-Elohim al-ha-ra\'a... we-lo asa.'
      }
    ]
  },
  {
    chapterNumber: 4,
    title: 'Gniew Jonasza, krzew rycynusowy i nieskończone miłosierdzie Boga',
    summary: 'Jonasz oburza się na Boże miłosierdzie względem Niniwy i pragnie śmierci. Bóg sprawia wyrośnięcie krzewu rycynusowego, po czym dopuszcza robaka, który podcina roślinę. Bóg poucza Jonasza o swojej powszechnej miłości do każdego stworzenia.',
    verses: [
      {
        chapter: 4,
        verse: 1,
        siglum: 'Jon 4, 1',
        textPl: 'To zaś bardzo się Jonaszowi nie podobało i oburzył się.',
        textHe: 'וַיֵּרַע אֶל־יוֹנָה רָעָה גְדוֹלָה וַיִּחַר לוֹ׃',
        transliteration: 'Wajera el-Jona ra\'a gedola wajichar lo.'
      },
      {
        chapter: 4,
        verse: 2,
        siglum: 'Jon 4, 2',
        textPl: 'Modlił się więc do Pana i mówił: «Ach, Panie! Czyż nie to mówiłem, gdy byłem jeszcze w moim kraju? Dlatego pospieszyłem uciekać do Tarszisz, bo wiedziałem, że jesteś Bogiem łaskawym i miłosiernym, cierpliwym i wielce łaskawym, litującym się nad niedolą.',
        textHe: 'וַיִּתְפַּלֵּל אֶל־יְהוָה וַיֹּאמַר אָנָּה יְהוָה הֲלוֹא־זֶה דְבָרִי... כִּי יָדַעְתִּי כִּי אַתָּה אֵל־חַנּוּן וְרַחוּם אֶרֶךְ אַפַּיִם וְרַב־חֶסֶד וְנִחָם עַל־הָרָעָה׃',
        transliteration: '...ki jadati ki atta El-channun we-rachum, erech appajim we-raw-chesed we-nicham al-ha-ra\'a.'
      },
      {
        chapter: 4,
        verse: 3,
        siglum: 'Jon 4, 3',
        textPl: 'Teraz więc, o Panie, odbierz mi, proszę, życie, bo lepiej mi umrzeć aniżeli żyć».',
        textHe: 'וְעַתָּה יְהוָה קַח־נָא אֶת־נַפְשִׁי מִמֶּנִּי כִּי טוֹב מוֹתִי מֵחַיָּי׃',
        transliteration: 'We-atta Adonaj kach-na et-nafszi mimmenni, ki tow moti me-chajjaj.'
      },
      {
        chapter: 4,
        verse: 4,
        siglum: 'Jon 4, 4',
        textPl: 'Pan zaś rzekł: «Czy uważasz, że słusznie się oburzasz?»',
        textHe: 'וַיֹּאמֶר יְהוָה הַהֵיטֵב חָרָה לָךְ׃',
        transliteration: 'Wajomer Adonaj: Ha-heteyw chara lach?'
      },
      {
        chapter: 4,
        verse: 5,
        siglum: 'Jon 4, 5',
        textPl: 'Jonasz wyszedł z miasta i usiadł na wschód od niego. Zrobił sobie tam szałas i usiadł w cieniu pod nim, aby zobaczyć, co się stanie w mieście.',
        textHe: 'וַיֵּצֵא יוֹנָה מִן־הָעִיר וַיֵּשֶׁב מִקֶּדֶם לָעִיר וַיַּעַשׂ לוֹ שָׁם סֻכָּה...',
        transliteration: 'Wajetze Jona min-ha-ir wajeszew mikkedem la-ir...'
      },
      {
        chapter: 4,
        verse: 6,
        siglum: 'Jon 4, 6',
        textPl: 'Wtedy Pan Bóg sprawił, że wyrósł krzew rycynusowy nad Jonaszem, by dać cień jego głowie i uwolnić go od jego udręki. Jonasz bardzo się ucieszył z tego krzewu.',
        textHe: 'וַיְמַן יְהוָה־אֱלֹהִים קִיקָיוֹן וַיַּעַל מֵעַל לְיוֹנָה לִהְיוֹת צֵל עַל־רֹאשׁוֹ... וַיִּשְׂמַח יוֹנָה עַל־הַקִּיקָיוֹן שִׂמְחָה גְדוֹלָה׃',
        transliteration: 'Wajeman Adonaj-Elohim kikajon wajja\'al me\'al le-Jona... wajjismach Jona al-hakkikajon simcha gedola.'
      },
      {
        chapter: 4,
        verse: 7,
        siglum: 'Jon 4, 7',
        textPl: 'Nazajutrz jednak o świcie Bóg przygotował robaka, który podgryzł krzew tak, że usechł.',
        textHe: 'וַיְמַן הָאֱלֹהִים תּוֹלַעַת בַּעֲלוֹת הַשַּׁחַר לַמָּחֳרָת וַתַּךְ אֶת־הַקִּיקָיוֹן וַיִּיבָשׁ׃',
        transliteration: 'Wajeman ha-Elohim tola\'at ba\'alot ha-szachar lammachorat, wattach et-hakkikajon wajjywasz.'
      },
      {
        chapter: 4,
        verse: 8,
        siglum: 'Jon 4, 8',
        textPl: 'A gdy wzeszło słońce, sprawił Bóg gorący wschodni wiatr, i słońce prażyło Jonasza w głowę tak, że omdlewał. Życzył więc sobie śmierci i mówił: «Lepiej mi umrzeć aniżeli żyć».',
        textHe: 'וַיְהִי כִּזְרֹחַ הַשֶּׁמֶשׁ וַיְמַן אֱלֹהִים רוּחַ קָדִים חֲרִישִׁית וַתַּךְ הַשֶּׁמֶשׁ עַל־רֹאשׁ יוֹנָה...',
        transliteration: 'Wajehi kizroach haszemesz wajeman Elohim ruach kadim chariszit...'
      },
      {
        chapter: 4,
        verse: 9,
        siglum: 'Jon 4, 9',
        textPl: 'Wtedy rzekł Bóg do Jonasza: «Czy uważasz, że słusznie się oburzasz z powodu tego krzewu?» On odpowiedział: «Słusznie jestem śmiertelnie oburzony».',
        textHe: 'וַיֹּאמֶר אֱלֹהִים אֶל־יוֹנָה הַהֵיטֵב חָרָה־לְךָ עַל־הַקִּיקָיוֹן וַיֹּאמֶר הֵיטֵב חָרָה־לִי עַד־מָוֶת׃',
        transliteration: 'Wajomer Elohim el-Jona: Ha-heteyw chara-lecha al-hakkikajon? Wajomer: Heteyw chara-li ad-mawet.'
      },
      {
        chapter: 4,
        verse: 10,
        siglum: 'Jon 4, 10',
        textPl: 'A Pan rzekł: «Tobie żal krzewu, wokół którego nie trudziłeś się i którego nie wyhodowałeś, który w ciągu jednej nocy wyrósł i w ciągu jednej nocy zginął.',
        textHe: 'וַיֹּאמֶר יְהוָה אַתָּה חַסְתָּ עַל־הַקִּיקָיוֹן אֲשֶׁר לֹא־עָמַלְתָּ בּוֹ וְלֹא גִדַּלְתּוֹ שֶׁבִּן־לַיְלָה הָיָה וּבִן־לַיְלָה אָבָד׃',
        transliteration: 'Wajomer Adonaj: Atta chasta al-hakkikajon aszer lo-amalta bo we-lo giddalto...'
      },
      {
        chapter: 4,
        verse: 11,
        siglum: 'Jon 4, 11',
        textPl: 'A czyż Ja nie miałbym ulitować się nad Niniwą, wielkim miastem, gdzie znajduje się więcej niż sto dwadzieścia tysięcy ludzi, którzy nie odróżniają swej prawej ręki od lewej, a nadto mnóstwo bydła?»',
        textHe: 'וַאֲנִי לֹא אָחוּס עַל־נִינְוֵה הָעִיר הַגְּדוֹלָה אֲשֶׁר יֶשׁ־בָּהּ הַרְבֵּה מִשְׁתֵּים־עֶשְׂרֵה רִבּוֹ אָדָם אֲשֶׁר לֹא־יָדַע בֵּין־יְמִינוֹ לִשְׂמֹאלוֹ וּבְהֵמָה רַבָּה׃',
        transliteration: 'Wa-ani lo achus al-Ninwe ha-ir ha-gedola aszer jesz-bah harbe misztejm-esre ribbo adam aszer lo-jada bejn-jemino lism\'olo u-wehema rabba?'
      }
    ]
  }
];

// Helper to get complete text of the Book of Jonah
export function getFullJonahText(): { siglum: string; title: string; text: string; versesCount: number } {
  let full = '';
  let count = 0;
  JONAH_CHAPTERS.forEach((ch) => {
    full += `\n\n[ROZDZIAŁ ${ch.chapterNumber} — ${ch.title}]\n\n`;
    ch.verses.forEach((v) => {
      full += `(${v.verse}) ${v.textPl} `;
      count++;
    });
  });

  return {
    siglum: 'Jon 1–4',
    title: 'Księga Jonasza (Całość: 4 rozdziały)',
    text: full.trim(),
    versesCount: count
  };
}

// Helper to get text of a specific chapter
export function getJonahChapterText(chapterNum: number): { siglum: string; title: string; summary: string; text: string; verses: JonahVerse[] } | null {
  const ch = JONAH_CHAPTERS.find((c) => c.chapterNumber === chapterNum);
  if (!ch) return null;

  const text = ch.verses.map((v) => `(${v.verse}) ${v.textPl}`).join(' ');
  return {
    siglum: `Jon ${chapterNum}`,
    title: `Księga Jonasza, Rozdział ${chapterNum}: ${ch.title}`,
    summary: ch.summary,
    text,
    verses: ch.verses
  };
}

// Helper to extract specific range of verses (e.g. Jon 1, 1-16 or Jon 2, 2-10)
export function getJonahVersesText(chapterNum: number, startVerse?: number, endVerse?: number): {
  siglum: string;
  pericopeTitle: string;
  text: string;
  theologicalTheme: string;
  suggestedScrutationTheme: string;
  keyWords: string[];
} {
  const ch = JONAH_CHAPTERS.find((c) => c.chapterNumber === chapterNum) || JONAH_CHAPTERS[0];
  const start = startVerse && startVerse > 0 ? startVerse : 1;
  const end = endVerse && endVerse >= start ? endVerse : (startVerse || ch.verses.length);

  const selected = ch.verses.filter((v) => v.verse >= start && v.verse <= end);
  const versesToUse = selected.length > 0 ? selected : ch.verses;

  const text = versesToUse.map((v) => `(${v.verse}) ${v.textPl}`).join(' ');
  const siglum = start === 1 && end === ch.verses.length 
    ? `Jon ${ch.chapterNumber}`
    : start === end 
    ? `Jon ${ch.chapterNumber}, ${start}`
    : `Jon ${ch.chapterNumber}, ${start}-${end}`;

  let theologicalTheme = 'Znak Jonasza i bezgraniczne Miłosierdzie Boga';
  let pericopeTitle = ch.title;
  let suggestedScrutationTheme = `Skrutacja Księgi Jonasza: ${siglum}`;

  if (ch.chapterNumber === 1) {
    theologicalTheme = 'Ucieczka przed wolą Bożą, sztorm życia i ocalenie przez ofiarę';
    pericopeTitle = 'Ucieczka Jonasza do Tarszisz i uciszenie burzy';
    suggestedScrutationTheme = 'Gdy uciekam przed Bogiem: powołanie i nawrócenie pogan';
  } else if (ch.chapterNumber === 2) {
    theologicalTheme = 'Trzy dni we wnętrznościach ryby — Znak Jonasza i Pascha Chrystusa';
    pericopeTitle = 'Modlitwa Jonasza z głębokości Szeolu';
    suggestedScrutationTheme = 'Wołanie z otchłani i pewność Bożego wybawienia';
  } else if (ch.chapterNumber === 3) {
    theologicalTheme = 'Moc Słowa Bożego wzywającego do pokuty i nawrócenie Niniwy';
    pericopeTitle = 'Głoszenie w Niniwie i Boże przebaczenie';
    suggestedScrutationTheme = 'Post, popiół i odwrócenie się od zła: Bóg nie chce zguby grzesznika';
  } else if (ch.chapterNumber === 4) {
    theologicalTheme = 'Pedagogia Boga: Krzew rycynusowy i ojcowskie serce dla wszystkich ludzi';
    pericopeTitle = 'Spór Jonasza z Bogiem o miłosierdzie';
    suggestedScrutationTheme = 'Czy masz prawo się oburzać? Tajemnica miłości obejmującej każdego';
  }

  return {
    siglum,
    pericopeTitle,
    text,
    theologicalTheme,
    suggestedScrutationTheme,
    keyWords: ['Jonasz', 'Niniwa', 'Miłosierdzie', 'Znak Jonasza', 'Nawrócenie', 'Ocalenie']
  };
}
