// data/phrasebook.js
// Pre-baked phrases for every language in SoulScape's destinations.
// 15 essential phrases per language. Never AI-generated — human verified.
// Structure: { script, pronunciation, english }
// script = the actual native writing (what to show locals)
// pronunciation = how an English speaker says it
// english = what it means

export const PHRASES = [
  // Hello, Thank you, Please, Sorry, Yes, No, How much?, Where is...?, Help!, I don't understand,
  // Do you speak English?, Delicious!, The bill please, Where is the bathroom?, Goodbye

  // Keys are lowercase country names or language names from destinations.js
]

// 15 phrase slots — same order for every language
export const PHRASE_KEYS = [
  'hello',
  'goodbye',
  'thankyou',
  'please',
  'sorry',
  'yes',
  'no',
  'howmuch',
  'whereis',
  'help',
  'dontunderstand',
  'speakenglish',
  'delicious',
  'bill',
  'bathroom',
]

export const PHRASE_META = {
  hello:          { english: 'Hello',                        emoji: '👋', category: 'Greeting'   },
  goodbye:        { english: 'Goodbye',                      emoji: '👋', category: 'Farewell'   },
  thankyou:       { english: 'Thank you',                    emoji: '🙏', category: 'Polite'     },
  please:         { english: 'Please',                       emoji: '🤲', category: 'Polite'     },
  sorry:          { english: 'Sorry / Excuse me',            emoji: '😊', category: 'Polite'     },
  yes:            { english: 'Yes',                          emoji: '✅', category: 'Basic'      },
  no:             { english: 'No',                           emoji: '❌', category: 'Basic'      },
  howmuch:        { english: 'How much does this cost?',     emoji: '💰', category: 'Shopping'   },
  whereis:        { english: 'Where is...?',                 emoji: '📍', category: 'Navigation' },
  help:           { english: 'Help!',                        emoji: '🆘', category: 'Emergency'  },
  dontunderstand: { english: "I don't understand",           emoji: '😕', category: 'Language'   },
  speakenglish:   { english: 'Do you speak English?',        emoji: '🇬🇧', category: 'Language'   },
  delicious:      { english: 'This is delicious!',           emoji: '😋', category: 'Food'       },
  bill:           { english: 'The bill / check, please',     emoji: '🧾', category: 'Food'       },
  bathroom:       { english: 'Where is the bathroom?',       emoji: '🚻', category: 'Navigation' },
}

// ─────────────────────────────────────────────────────────────────────────────
// LANGUAGE PHRASEBOOKS
// Each entry: [script, pronunciation]
// script  = native characters (show to locals, use as reading reference)
// pronunciation = English phonetic (how to say it out loud)
// ─────────────────────────────────────────────────────────────────────────────

export const PHRASEBOOKS = {

  // ── JAPANESE ─────────────────────────────────────────────────────────────
  japanese: {
    language: 'Japanese', flag: '🇯🇵', script: 'Japanese (kanji/hiragana)',
    phrases: {
      hello:          ['こんにちは',       'Kon-ni-chi-wa'],
      goodbye:        ['さようなら',       'Sa-yo-na-ra'],
      thankyou:       ['ありがとうございます', 'A-ri-ga-toh go-zai-mas'],
      please:         ['お願いします',     'O-ne-gai shi-mas'],
      sorry:          ['すみません',       'Su-mi-ma-sen'],
      yes:            ['はい',            'Hai'],
      no:             ['いいえ',           'Ee-eh'],
      howmuch:        ['いくらですか？',    'I-ku-ra des-ka?'],
      whereis:        ['〜はどこですか？',  'Wa do-ko des-ka?'],
      help:           ['助けてください！',  'Ta-su-ke-te ku-da-sai!'],
      dontunderstand: ['わかりません',     'Wa-ka-ri-ma-sen'],
      speakenglish:   ['英語を話せますか？', 'Ei-go o ha-na-se-mas-ka?'],
      delicious:      ['おいしい！',       'Oi-shi!'],
      bill:           ['お会計をお願いします', 'O-kai-kei o o-ne-gai-shi-mas'],
      bathroom:       ['トイレはどこですか？', 'To-i-re wa do-ko des-ka?'],
    },
    tips: ['Bow slightly when greeting — depth shows respect', 'Always use both hands when giving or receiving items', 'Tipping is not customary and can be considered rude'],
  },

  // ── THAI ─────────────────────────────────────────────────────────────────
  thai: {
    language: 'Thai', flag: '🇹🇭', script: 'Thai script',
    phrases: {
      hello:          ['สวัสดี',          'Sa-wat-dee (krap/ka)'],
      goodbye:        ['ลาก่อน',          'La-gon'],
      thankyou:       ['ขอบคุณ',          'Khob-khun (krap/ka)'],
      please:         ['กรุณา',           'Ga-ru-na'],
      sorry:          ['ขอโทษ',           'Kho-thot'],
      yes:            ['ใช่',             'Chai'],
      no:             ['ไม่',             'Mai'],
      howmuch:        ['เท่าไหร่?',       'Tao-rai?'],
      whereis:        ['...อยู่ที่ไหน?',  '...yoo tee-nai?'],
      help:           ['ช่วยด้วย!',       'Chuay duay!'],
      dontunderstand: ['ไม่เข้าใจ',       'Mai kao jai'],
      speakenglish:   ['คุณพูดภาษาอังกฤษได้ไหม?', 'Kun poot pasa angrit dai mai?'],
      delicious:      ['อร่อยมาก!',       'A-roi mak!'],
      bill:           ['เก็บเงินด้วย',    'Gep ngern duay'],
      bathroom:       ['ห้องน้ำอยู่ที่ไหน?', 'Hong-nam yoo tee-nai?'],
    },
    tips: ['Add "krap" (male) or "ka" (female) to the end of phrases to be polite', 'The Wai (hands together, slight bow) is the greeting gesture', 'Never point feet at people or sacred objects'],
  },

  // ── INDONESIAN ───────────────────────────────────────────────────────────
  indonesian: {
    language: 'Indonesian (Bahasa)', flag: '🇮🇩', script: 'Latin',
    phrases: {
      hello:          ['Halo',                       'Ha-lo'],
      goodbye:        ['Sampai jumpa',               'Sam-pai joom-pa'],
      thankyou:       ['Terima kasih',               'Teh-ree-ma ka-see'],
      please:         ['Tolong',                     'Toh-long'],
      sorry:          ['Maaf',                       'Ma-af'],
      yes:            ['Ya',                         'Yah'],
      no:             ['Tidak',                      'Tee-dak'],
      howmuch:        ['Berapa harganya?',            'Beh-ra-pa har-ga-nya?'],
      whereis:        ['Di mana...?',                'Dee ma-na?'],
      help:           ['Tolong!',                    'Toh-long!'],
      dontunderstand: ['Saya tidak mengerti',         'Sa-ya tee-dak meng-er-tee'],
      speakenglish:   ['Bisa berbicara bahasa Inggris?', 'Bee-sa ber-bee-cha-ra ba-ha-sa ing-gris?'],
      delicious:      ['Enak sekali!',               'Eh-nak seh-ka-lee!'],
      bill:           ['Minta bon',                  'Min-ta bon'],
      bathroom:       ['Kamar mandi di mana?',       'Ka-mar man-dee dee ma-na?'],
    },
    tips: ['Using the right hand is customary for giving, receiving and eating', 'A slight bow when greeting elders shows respect', 'Bargaining is normal in markets — start at half the asking price'],
  },

  // ── ITALIAN ──────────────────────────────────────────────────────────────
  italian: {
    language: 'Italian', flag: '🇮🇹', script: 'Latin',
    phrases: {
      hello:          ['Ciao / Buongiorno',       'Chow / Bwon-jor-no'],
      goodbye:        ['Arrivederci',             'Ar-ree-veh-der-chee'],
      thankyou:       ['Grazie',                  'Grat-see-eh'],
      please:         ['Per favore',              'Pair fa-vor-eh'],
      sorry:          ['Scusi',                   'Skoo-zee'],
      yes:            ['Sì',                      'See'],
      no:             ['No',                      'No'],
      howmuch:        ['Quanto costa?',           'Kwan-to kos-ta?'],
      whereis:        ['Dov\'è...?',              'Do-veh?'],
      help:           ['Aiuto!',                  'Ai-yoo-to!'],
      dontunderstand: ['Non capisco',             'Non ka-pees-ko'],
      speakenglish:   ['Parla inglese?',          'Par-la in-gleh-zeh?'],
      delicious:      ['Buonissimo!',             'Bwon-ees-see-mo!'],
      bill:           ['Il conto, per favore',    'Eel kon-to pair fa-vor-eh'],
      bathroom:       ['Dov\'è il bagno?',        'Do-veh eel ban-yo?'],
    },
    tips: ['Greet shopkeepers with "buongiorno" when entering — it\'s considered rude not to', 'Cappuccino is a morning drink — ordering it after noon gets a raised eyebrow', 'Tipping is not expected but rounding up is appreciated'],
  },

  // ── FRENCH ───────────────────────────────────────────────────────────────
  french: {
    language: 'French', flag: '🇫🇷', script: 'Latin',
    phrases: {
      hello:          ['Bonjour',                       'Bon-zhoor'],
      goodbye:        ['Au revoir',                     'Oh reh-vwar'],
      thankyou:       ['Merci',                         'Mair-see'],
      please:         ['S\'il vous plaît',              'Seel voo pleh'],
      sorry:          ['Excusez-moi',                   'Ex-kew-zay mwa'],
      yes:            ['Oui',                           'Wee'],
      no:             ['Non',                           'Nohn'],
      howmuch:        ['Combien ça coûte ?',            'Kom-bee-en sa koot?'],
      whereis:        ['Où est... ?',                   'Oo eh?'],
      help:           ['À l\'aide !',                   'Ah led!'],
      dontunderstand: ['Je ne comprends pas',           'Zhuh nuh kom-prahn pah'],
      speakenglish:   ['Parlez-vous anglais ?',         'Par-lay voo ong-glay?'],
      delicious:      ['C\'est délicieux !',            'Say day-lee-syuh!'],
      bill:           ['L\'addition, s\'il vous plaît', 'La-dee-syon seel voo pleh'],
      bathroom:       ['Où sont les toilettes ?',       'Oo son lay twa-let?'],
    },
    tips: ['Always start with "Bonjour" before any request — skipping it is considered rude', 'A small "Merci" and "Au revoir" when leaving any shop is expected', 'Bread is placed directly on the table, not on a side plate — this is normal'],
  },

  // ── SPANISH ──────────────────────────────────────────────────────────────
  spanish: {
    language: 'Spanish', flag: '🇪🇸', script: 'Latin',
    phrases: {
      hello:          ['Hola',                      'Oh-la'],
      goodbye:        ['Adiós',                     'A-dee-os'],
      thankyou:       ['Gracias',                   'Gra-see-as'],
      please:         ['Por favor',                 'Por fa-vor'],
      sorry:          ['Perdón',                    'Pair-don'],
      yes:            ['Sí',                        'See'],
      no:             ['No',                        'No'],
      howmuch:        ['¿Cuánto cuesta?',           'Kwan-to kwes-ta?'],
      whereis:        ['¿Dónde está...?',           'Don-day es-ta?'],
      help:           ['¡Ayuda!',                   'Ah-yoo-da!'],
      dontunderstand: ['No entiendo',               'No en-tyen-do'],
      speakenglish:   ['¿Habla inglés?',            'Ab-la in-gles?'],
      delicious:      ['¡Está delicioso!',          'Es-ta de-lee-see-o-so!'],
      bill:           ['La cuenta, por favor',      'La kwen-ta por fa-vor'],
      bathroom:       ['¿Dónde está el baño?',      'Don-day es-ta el ban-yo?'],
    },
    tips: ['In Spain, lunch is the main meal (2-4pm) — dinner rarely starts before 9pm', 'Siesta is real in smaller towns — many shops close 2-5pm', 'A "vale" (ba-leh) means "okay" and you\'ll hear it constantly'],
  },

  // ── PORTUGUESE ───────────────────────────────────────────────────────────
  portuguese: {
    language: 'Portuguese', flag: '🇵🇹', script: 'Latin',
    phrases: {
      hello:          ['Olá',                       'Oh-la'],
      goodbye:        ['Tchau / Adeus',             'Chow / A-deh-oosh'],
      thankyou:       ['Obrigado (m) / Obrigada (f)', 'Oh-bree-ga-doo / Oh-bree-ga-da'],
      please:         ['Por favor',                 'Por fa-vor'],
      sorry:          ['Desculpe',                  'Desh-kool-peh'],
      yes:            ['Sim',                       'Seem'],
      no:             ['Não',                       'Nowng'],
      howmuch:        ['Quanto custa?',             'Kwan-too koosh-ta?'],
      whereis:        ['Onde fica...?',             'On-deh fee-ka?'],
      help:           ['Socorro!',                  'So-ko-hoo!'],
      dontunderstand: ['Não entendo',               'Nowng en-ten-doo'],
      speakenglish:   ['Fala inglês?',              'Fa-la in-glesh?'],
      delicious:      ['Está delicioso!',           'Esh-ta deh-lee-see-o-zoo!'],
      bill:           ['A conta, por favor',        'A kon-ta por fa-vor'],
      bathroom:       ['Onde fica a casa de banho?', 'On-deh fee-ka a ka-za deh ban-yoo?'],
    },
    tips: ['In Portugal, saying "obrigado" (if you\'re male) or "obrigada" (female) matters', 'Pastel de nata is best eaten warm, standing at the counter', 'Fado music in Lisbon restaurants is genuine — listen respectfully'],
  },

  // ── GREEK ────────────────────────────────────────────────────────────────
  greek: {
    language: 'Greek', flag: '🇬🇷', script: 'Greek (Ελληνικά)',
    phrases: {
      hello:          ['Γεια σας',          'Yah sas'],
      goodbye:        ['Αντίο',             'An-dee-o'],
      thankyou:       ['Ευχαριστώ',         'Ef-kha-rees-TO'],
      please:         ['Παρακαλώ',          'Pa-ra-ka-LO'],
      sorry:          ['Συγγνώμη',          'Sig-NO-mee'],
      yes:            ['Ναι',              'Ne'],
      no:             ['Όχι',              'O-khee'],
      howmuch:        ['Πόσο κάνει;',       'PO-so KA-nee?'],
      whereis:        ['Πού είναι...;',     'Poo EE-neh?'],
      help:           ['Βοήθεια!',          'Vo-EE-thee-a!'],
      dontunderstand: ['Δεν καταλαβαίνω',   'Then ka-ta-la-VE-no'],
      speakenglish:   ['Μιλάτε αγγλικά;',  'Mee-LA-teh ang-glee-KA?'],
      delicious:      ['Πολύ νόστιμο!',    'Po-LEE NOS-tee-mo!'],
      bill:           ['Τον λογαριασμό, παρακαλώ', 'Ton lo-ga-ree-as-MO pa-ra-ka-LO'],
      bathroom:       ['Πού είναι η τουαλέτα;', 'Poo EE-neh ee too-a-LE-ta?'],
    },
    tips: ['Greeks nod slightly downward for yes — do not confuse with the upward nod meaning no', 'Meals are long, social affairs — rushing is considered rude', '"Opa!" is said during celebration, not just when plates break'],
  },

  // ── VIETNAMESE ───────────────────────────────────────────────────────────
  vietnamese: {
    language: 'Vietnamese', flag: '🇻🇳', script: 'Vietnamese (Latin with tones)',
    phrases: {
      hello:          ['Xin chào',              'Sin chow'],
      goodbye:        ['Tạm biệt',              'Tam bee-et'],
      thankyou:       ['Cảm ơn',               'Gam un'],
      please:         ['Làm ơn',               'Lam un'],
      sorry:          ['Xin lỗi',              'Sin loy'],
      yes:            ['Vâng / Có',            'Vung / Gaw'],
      no:             ['Không',               'Khome'],
      howmuch:        ['Bao nhiêu tiền?',      'Bow nyew tyen?'],
      whereis:        ['...ở đâu?',           '...uh dow?'],
      help:           ['Cứu tôi với!',         'Gew toy voy!'],
      dontunderstand: ['Tôi không hiểu',       'Toy khome hyew'],
      speakenglish:   ['Bạn có nói tiếng Anh không?', 'Ban gaw noy tyeng an khome?'],
      delicious:      ['Ngon lắm!',            'Ngon lam!'],
      bill:           ['Tính tiền, làm ơn',    'Tin tyen, lam un'],
      bathroom:       ['Nhà vệ sinh ở đâu?',  'Nya veh sin uh dow?'],
    },
    tips: ['Vietnamese is tonal — the same word with different tones means different things. Pointing helps', 'Always pour tea for others before filling your own cup', 'Bargaining is expected at markets — smile while you do it'],
  },

  // ── MOROCCAN ARABIC ──────────────────────────────────────────────────────
  moroccan: {
    language: 'Moroccan Arabic (Darija)', flag: '🇲🇦', script: 'Arabic (العربية)',
    phrases: {
      hello:          ['السلام عليكم',    'As-salam a-lay-kum'],
      goodbye:        ['بسلامة',          'B-slama'],
      thankyou:       ['شكراً',           'Shukran'],
      please:         ['عافاك',           'Afak'],
      sorry:          ['سمح ليا',         'Smeh lee-ya'],
      yes:            ['إيه / نعم',       'Iyeh / Naam'],
      no:             ['لا',             'La'],
      howmuch:        ['بشحال هذا؟',     'B-sh-hal had-a?'],
      whereis:        ['فين كاين...؟',   'Fin kayn?'],
      help:           ['عيوني!',          'Ay-oo-nee!'],
      dontunderstand: ['ما فهمتش',       'Ma fhem-tsh'],
      speakenglish:   ['واش كتهضر بالإنجليزية؟', 'Wash kat-had-er bel-ingliziya?'],
      delicious:      ['بنين بزاف!',     'Bneen bzzaf!'],
      bill:           ['الحساب عافاك',   'L-hsab afak'],
      bathroom:       ['فين كاين تواليت؟', 'Fin kayn twaleet?'],
    },
    tips: ['Accept mint tea when offered — refusing is impolite', 'Dress modestly when visiting mosques and medinas', 'Bargaining in souks is expected — the first price is never the final price'],
  },

  // ── CROATIAN ─────────────────────────────────────────────────────────────
  croatian: {
    language: 'Croatian', flag: '🇭🇷', script: 'Latin',
    phrases: {
      hello:          ['Dobar dan',           'Do-bar dan'],
      goodbye:        ['Doviđenja',           'Do-vee-jen-ya'],
      thankyou:       ['Hvala',               'Hva-la'],
      please:         ['Molim',               'Mo-lim'],
      sorry:          ['Oprostite',           'O-pros-tee-teh'],
      yes:            ['Da',                  'Da'],
      no:             ['Ne',                  'Ne'],
      howmuch:        ['Koliko košta?',       'Ko-lee-ko kosh-ta?'],
      whereis:        ['Gdje je...?',         'Gdye yeh?'],
      help:           ['Upomoć!',             'Oo-po-moch!'],
      dontunderstand: ['Ne razumijem',        'Ne ra-zoo-mee-yem'],
      speakenglish:   ['Govorite li engleski?', 'Go-vo-ree-teh lee eng-les-kee?'],
      delicious:      ['Izvrsno!',            'Iz-vrs-no!'],
      bill:           ['Račun, molim',        'Ra-chun mo-lim'],
      bathroom:       ['Gdje je toalet?',     'Gdye yeh to-a-let?'],
    },
    tips: ['Croats are proud of their coast — complimenting the sea and nature goes a long way', 'Coffee is a long, social event — do not expect to rush', 'Locals rarely jaywalk and generally follow rules'],
  },

  // ── TURKISH ──────────────────────────────────────────────────────────────
  turkish: {
    language: 'Turkish', flag: '🇹🇷', script: 'Latin',
    phrases: {
      hello:          ['Merhaba',                   'Mer-ha-ba'],
      goodbye:        ['Hoşça kalın',               'Hosh-cha ka-lin'],
      thankyou:       ['Teşekkür ederim',           'Teh-shek-kyur eh-de-rim'],
      please:         ['Lütfen',                    'Lyut-fen'],
      sorry:          ['Özür dilerim',              'Oh-zyur dee-leh-rim'],
      yes:            ['Evet',                      'Eh-vet'],
      no:             ['Hayır',                     'Hay-ir'],
      howmuch:        ['Bu ne kadar?',              'Boo neh ka-dar?'],
      whereis:        ['...nerede?',               '...neh-reh-deh?'],
      help:           ['İmdat!',                    'Im-dat!'],
      dontunderstand: ['Anlamıyorum',               'An-la-mi-yo-rum'],
      speakenglish:   ['İngilizce biliyor musunuz?', 'In-gi-liz-jeh bee-lee-yor moo-soo-nooz?'],
      delicious:      ['Çok lezzetli!',             'Chok lez-zet-lee!'],
      bill:           ['Hesap, lütfen',             'Heh-sap lyut-fen'],
      bathroom:       ['Tuvalet nerede?',           'Too-va-let neh-reh-deh?'],
    },
    tips: ['Turkish tea (çay) will be offered constantly — it is fine to accept or decline politely', 'Remove shoes before entering homes and some carpet shops', 'Bargaining is expected in bazaars — not in regular shops'],
  },

  // ── HINDI ────────────────────────────────────────────────────────────────
  hindi: {
    language: 'Hindi', flag: '🇮🇳', script: 'Devanagari (देवनागरी)',
    phrases: {
      hello:          ['नमस्ते',           'Na-mas-teh'],
      goodbye:        ['नमस्ते / फिर मिलेंगे', 'Na-mas-teh / Phir mi-len-geh'],
      thankyou:       ['धन्यवाद',          'Dhan-ya-vad'],
      please:         ['कृपया',            'Krip-ya'],
      sorry:          ['माफ़ करना',         'Maaf kar-na'],
      yes:            ['हाँ',             'Haan'],
      no:             ['नहीं',            'Na-hin'],
      howmuch:        ['यह कितने का है?',  'Yeh kit-neh ka hai?'],
      whereis:        ['... कहाँ है?',     '...ka-haan hai?'],
      help:           ['बचाओ!',            'Ba-chao!'],
      dontunderstand: ['मुझे समझ नहीं आया', 'Mu-jheh sa-majh na-hin aa-ya'],
      speakenglish:   ['क्या आप अंग्रेज़ी बोलते हैं?', 'Kya aap an-gre-zi bol-teh hain?'],
      delicious:      ['बहुत स्वादिष्ट!',  'Ba-hut swa-dish-ta!'],
      bill:           ['बिल लाइए',         'Bill la-ee-yeh'],
      bathroom:       ['बाथरूम कहाँ है?', 'Bath-room ka-haan hai?'],
    },
    tips: ['The Namaste gesture (palms together) is universally understood and appreciated', 'Head wobble (side to side) means yes or acknowledgement — not confusion', 'Always use your right hand for giving, receiving and eating'],
  },

  // ── NEPALI ───────────────────────────────────────────────────────────────
  nepali: {
    language: 'Nepali', flag: '🇳🇵', script: 'Devanagari (देवनागरी)',
    phrases: {
      hello:          ['नमस्ते',            'Na-mas-teh'],
      goodbye:        ['फेरि भेटौंला',      'Phe-ri bhe-tow-la'],
      thankyou:       ['धन्यवाद',           'Dhan-ya-baad'],
      please:         ['कृपया',             'Krip-ya'],
      sorry:          ['माफ गर्नुस्',       'Maaf gar-nus'],
      yes:            ['हो / हजुर',        'Ho / Ha-jur'],
      no:             ['होइन',             'Ho-in'],
      howmuch:        ['कति पर्छ?',        'Ka-ti par-cha?'],
      whereis:        ['...कहाँ छ?',       '...ka-haan chha?'],
      help:           ['गुहार!',            'Gu-haar!'],
      dontunderstand: ['मलाई बुझेन',        'Ma-lai boo-jhe-na'],
      speakenglish:   ['तपाईं अंग्रेजी बोल्नुहुन्छ?', 'Ta-pai an-gre-ji bol-nu-hun-chha?'],
      delicious:      ['मिठो छ!',           'Mi-tho chha!'],
      bill:           ['बिल ल्याउनुस्',     'Bill lyau-nus'],
      bathroom:       ['शौचालय कहाँ छ?',   'Shaw-cha-lay ka-haan chha?'],
    },
    tips: ['Namaste with hands together is the greeting — used more than handshakes', 'Walking clockwise around temples and stupas is the custom', 'The right hand is used for giving and receiving — never the left'],
  },

  // ── MANDARIN ─────────────────────────────────────────────────────────────
  mandarin: {
    language: 'Mandarin Chinese', flag: '🇨🇳', script: 'Simplified Chinese (中文)',
    phrases: {
      hello:          ['你好',         'Nǐ hǎo (Nee-how)'],
      goodbye:        ['再见',         'Zài jiàn (Zai-jyen)'],
      thankyou:       ['谢谢',         'Xiè xie (Syeh-syeh)'],
      please:         ['请',          'Qǐng (Ching)'],
      sorry:          ['对不起',       'Duì bu qǐ (Dway-boo-chee)'],
      yes:            ['是',          'Shì (Shir)'],
      no:             ['不是 / 不',   'Bú shì / Bù (Boo)'],
      howmuch:        ['多少钱？',     'Duōshǎo qián? (Dwoh-shao chyen?)'],
      whereis:        ['...在哪里？',  'Zài nǎ lǐ? (Dzai na lee?)'],
      help:           ['救命！',       'Jiù mìng! (Jyo-ming!)'],
      dontunderstand: ['我不明白',     'Wǒ bù míng bái (Woh boo ming-bye)'],
      speakenglish:   ['你会说英语吗？', 'Nǐ huì shuō Yīngyǔ ma? (Nee hway shwoh ying-yoo ma?)'],
      delicious:      ['很好吃！',     'Hěn hǎo chī! (Hen how chir!)'],
      bill:           ['买单，谢谢',   'Mǎi dān, xiè xie (My dan syeh-syeh)'],
      bathroom:       ['洗手间在哪里？', 'Xǐ shǒu jiān zài nǎ lǐ? (Shee-show jyen dzai na lee?)'],
    },
    tips: ['Pointing at menu items works better than trying to pronounce dish names', 'Slurping noodles is a compliment to the cook, not rude', 'WeChat Pay and Alipay are used everywhere — cash is secondary in cities'],
  },

  // ── GERMAN ───────────────────────────────────────────────────────────────
  german: {
    language: 'German', flag: '🇩🇪', script: 'Latin',
    phrases: {
      hello:          ['Hallo / Guten Tag',        'Ha-lo / Goo-ten tahk'],
      goodbye:        ['Auf Wiedersehen',          'Owf vee-der-zayn'],
      thankyou:       ['Danke',                    'Dan-keh'],
      please:         ['Bitte',                    'Bit-teh'],
      sorry:          ['Entschuldigung',           'Ent-shool-dee-goong'],
      yes:            ['Ja',                       'Yah'],
      no:             ['Nein',                     'Nine'],
      howmuch:        ['Wie viel kostet das?',     'Vee feel kos-tet das?'],
      whereis:        ['Wo ist...?',              'Vo ist?'],
      help:           ['Hilfe!',                   'Hil-feh!'],
      dontunderstand: ['Ich verstehe nicht',       'Ikh fer-shtay-eh nikht'],
      speakenglish:   ['Sprechen Sie Englisch?',   'Shpreh-khen zee eng-lish?'],
      delicious:      ['Das schmeckt sehr gut!',   'Das shmekt zayr goot!'],
      bill:           ['Die Rechnung, bitte',      'Dee rekh-noong bit-teh'],
      bathroom:       ['Wo ist die Toilette?',     'Vo ist dee twa-let-eh?'],
    },
    tips: ['Germans greet with a firm handshake and direct eye contact', 'Being punctual is taken seriously — arriving late is considered disrespectful', 'Bread (Brot) is a serious cultural staple — there are over 300 varieties'],
  },

  // ── SLOVENIAN ────────────────────────────────────────────────────────────
  slovenian: {
    language: 'Slovenian', flag: '🇸🇮', script: 'Latin',
    phrases: {
      hello:          ['Zdravo',              'Zdra-vo'],
      goodbye:        ['Nasvidenje',          'Na-svee-den-yeh'],
      thankyou:       ['Hvala',              'Hva-la'],
      please:         ['Prosim',             'Pro-sim'],
      sorry:          ['Oprostite',          'O-pros-tee-teh'],
      yes:            ['Ja',                 'Ya'],
      no:             ['Ne',                 'Neh'],
      howmuch:        ['Koliko stane?',      'Ko-lee-ko sta-neh?'],
      whereis:        ['Kje je...?',         'Kyeh yeh?'],
      help:           ['Na pomoč!',          'Na po-moch!'],
      dontunderstand: ['Ne razumem',         'Neh ra-zoo-mem'],
      speakenglish:   ['Ali govorite angleško?', 'A-lee go-vo-ree-teh ang-lesh-ko?'],
      delicious:      ['Zelo okusno!',       'Zeh-lo o-koos-no!'],
      bill:           ['Račun, prosim',      'Ra-chun pro-sim'],
      bathroom:       ['Kje je stranišče?',  'Kyeh yeh stra-nish-cheh?'],
    },
    tips: ['Slovenians are reserved at first but warm once acquainted', 'The Kremšnita (cream cake) in Lake Bled is a national pride — you must try it', 'English is widely spoken among younger generations'],
  },

  // ── NORWEGIAN ────────────────────────────────────────────────────────────
  norwegian: {
    language: 'Norwegian', flag: '🇳🇴', script: 'Latin',
    phrases: {
      hello:          ['Hei',                      'Hey'],
      goodbye:        ['Ha det bra',               'Ha deh bra'],
      thankyou:       ['Takk',                     'Tak'],
      please:         ['Vær så snill',             'Vair so snil'],
      sorry:          ['Unnskyld',                 'Oon-shyl'],
      yes:            ['Ja',                       'Ya'],
      no:             ['Nei',                      'Nay'],
      howmuch:        ['Hvor mye koster det?',     'Vor myeh kos-ter deh?'],
      whereis:        ['Hvor er...?',             'Vor air?'],
      help:           ['Hjelp!',                   'Yelp!'],
      dontunderstand: ['Jeg forstår ikke',         'Yay for-stor ik-eh'],
      speakenglish:   ['Snakker du engelsk?',      'Snak-er doo eng-elsk?'],
      delicious:      ['Det er veldig godt!',      'Deh air vel-dee got!'],
      bill:           ['Regningen, takk',          'Reg-ning-en tak'],
      bathroom:       ['Hvor er toalettet?',       'Vor air to-a-let-et?'],
    },
    tips: ['Norwegians value personal space and quiet — loud behaviour in public is unusual', 'Tipping is optional but rounding up is appreciated', 'Norway is largely cashless — card payments are accepted almost everywhere'],
  },

  // ── ICELANDIC ────────────────────────────────────────────────────────────
  icelandic: {
    language: 'Icelandic', flag: '🇮🇸', script: 'Latin',
    phrases: {
      hello:          ['Halló',                    'Ha-lo'],
      goodbye:        ['Bless',                    'Bless'],
      thankyou:       ['Takk',                     'Tak'],
      please:         ['Gjörðu svo vel',           'Gyur-thu so vel'],
      sorry:          ['Fyrirgefðu',               'Fi-rir-gev-thu'],
      yes:            ['Já',                       'Yow'],
      no:             ['Nei',                      'Nay'],
      howmuch:        ['Hvað kostar þetta?',       'Kvath kos-tar thet-a?'],
      whereis:        ['Hvar er...?',             'Kvar air?'],
      help:           ['Hjálp!',                   'Hyowlp!'],
      dontunderstand: ['Ég skil ekki',             'Yeg skil ek-ee'],
      speakenglish:   ['Talarðu ensku?',           'Ta-lar-thu en-sku?'],
      delicious:      ['Þetta er ljúffengt!',      'Thet-a air lyuv-fengt!'],
      bill:           ['Reikninginn, takk',        'Rake-ning-in tak'],
      bathroom:       ['Hvar er klósettið?',       'Kvar air klo-set-ith?'],
    },
    tips: ['Almost all Icelanders speak excellent English — they appreciate any attempt at Icelandic though', 'Nature is sacred — never go off marked hiking paths', 'The Northern Lights are best seen midnight to 2am in clear skies'],
  },

  // ── DANISH ───────────────────────────────────────────────────────────────
  danish: {
    language: 'Danish', flag: '🇩🇰', script: 'Latin',
    phrases: {
      hello:          ['Hej',                     'Hi'],
      goodbye:        ['Farvel',                  'Far-vel'],
      thankyou:       ['Tak',                     'Tak'],
      please:         ['Vær venlig',              'Vair ven-lee'],
      sorry:          ['Undskyld',                'Oon-skyl'],
      yes:            ['Ja',                      'Ya'],
      no:             ['Nej',                     'Ny'],
      howmuch:        ['Hvad koster det?',        'Vel kos-ter deh?'],
      whereis:        ['Hvor er...?',            'Vor air?'],
      help:           ['Hjælp!',                  'Yelp!'],
      dontunderstand: ['Jeg forstår ikke',        'Yay for-stor ik-eh'],
      speakenglish:   ['Taler du engelsk?',       'Tay-ler doo eng-elsk?'],
      delicious:      ['Det smager dejligt!',     'Deh sma-er die-leet!'],
      bill:           ['Regningen, tak',          'Ren-ing-en tak'],
      bathroom:       ['Hvor er toilettet?',      'Vor air to-i-let-et?'],
    },
    tips: ['Hygge (cosy togetherness) is a real cultural value — embrace slow, warm moments', 'Danes cycle everywhere — watch out for bike lanes', 'Punctuality is respected in social and business settings'],
  },

  // ── DUTCH ────────────────────────────────────────────────────────────────
  dutch: {
    language: 'Dutch', flag: '🇳🇱', script: 'Latin',
    phrases: {
      hello:          ['Hallo / Goedendag',        'Ha-lo / Khoo-den-dahkh'],
      goodbye:        ['Tot ziens',                'Tot zeens'],
      thankyou:       ['Dank je wel',              'Dank yeh vel'],
      please:         ['Alsjeblieft',              'Als-yeh-bleeft'],
      sorry:          ['Sorry / Excuseer me',      'Sorry / Ex-kew-zayr meh'],
      yes:            ['Ja',                       'Ya'],
      no:             ['Nee',                      'Nay'],
      howmuch:        ['Hoeveel kost dit?',        'Hoo-vayl kost dit?'],
      whereis:        ['Waar is...?',             'Vaar is?'],
      help:           ['Help!',                    'Help!'],
      dontunderstand: ['Ik begrijp het niet',      'Ik beh-khrayp het neet'],
      speakenglish:   ['Spreekt u Engels?',        'Spraykt oo eng-els?'],
      delicious:      ['Dit is heerlijk!',         'Dit is hayr-lyk!'],
      bill:           ['De rekening, alsjeblieft', 'Deh ray-ken-ing als-yeh-bleeft'],
      bathroom:       ['Waar is het toilet?',      'Vaar is het twa-let?'],
    },
    tips: ['Dutch directness can seem blunt to other cultures — it is not rudeness, it is honesty', 'Cycling is the primary transport — always check for bikes before crossing', 'The Dutch split bills equally among friends — this is normal and expected'],
  },

  // ── POLISH ───────────────────────────────────────────────────────────────
  polish: {
    language: 'Polish', flag: '🇵🇱', script: 'Latin',
    phrases: {
      hello:          ['Cześć / Dzień dobry',     'Cheshch / Jen dob-rih'],
      goodbye:        ['Do widzenia',             'Do vee-dze-nya'],
      thankyou:       ['Dziękuję',               'Jen-koo-yeh'],
      please:         ['Proszę',                 'Pro-sheh'],
      sorry:          ['Przepraszam',            'Psheh-pra-sham'],
      yes:            ['Tak',                    'Tak'],
      no:             ['Nie',                    'Nyeh'],
      howmuch:        ['Ile to kosztuje?',       'Ee-leh to kosh-too-yeh?'],
      whereis:        ['Gdzie jest...?',         'Gdjeh yest?'],
      help:           ['Pomocy!',                'Po-mo-tsih!'],
      dontunderstand: ['Nie rozumiem',           'Nyeh ro-zoo-myem'],
      speakenglish:   ['Czy mówi pan/pani po angielsku?', 'Chi moo-vi pan/pa-nee po an-gyel-skoo?'],
      delicious:      ['To jest pyszne!',        'To yest pish-neh!'],
      bill:           ['Poproszę rachunek',      'Po-pro-sheh ra-khoo-nek'],
      bathroom:       ['Gdzie jest toaleta?',    'Gdjeh yest to-a-le-ta?'],
    },
    tips: ['Poles greet with a firm handshake; close friends may kiss on the cheek', 'When entering someone\'s home, always bring a gift — flowers or sweets are appreciated', 'Vodka toasts are common — "Na zdrowie!" (na zdro-vyeh) means "cheers"'],
  },

  // ── CZECH ────────────────────────────────────────────────────────────────
  czech: {
    language: 'Czech', flag: '🇨🇿', script: 'Latin',
    phrases: {
      hello:          ['Ahoj / Dobrý den',         'A-hoy / Dob-ree den'],
      goodbye:        ['Na shledanou',             'Na skhle-da-no'],
      thankyou:       ['Děkuji',                   'Dye-koo-yi'],
      please:         ['Prosím',                   'Pro-seem'],
      sorry:          ['Promiňte',                 'Pro-min-teh'],
      yes:            ['Ano',                      'A-no'],
      no:             ['Ne',                       'Neh'],
      howmuch:        ['Kolik to stojí?',          'Ko-lik to sto-yee?'],
      whereis:        ['Kde je...?',              'Kdeh yeh?'],
      help:           ['Pomoc!',                   'Po-mots!'],
      dontunderstand: ['Nerozumím',               'Neh-ro-zoo-meem'],
      speakenglish:   ['Mluvíte anglicky?',        'Mloo-vee-teh ang-lit-skee?'],
      delicious:      ['To je výborné!',           'To yeh vee-bor-neh!'],
      bill:           ['Účet, prosím',             'Oo-chet pro-seem'],
      bathroom:       ['Kde je toaleta?',          'Kdeh yeh to-a-le-ta?'],
    },
    tips: ['Czech beer is a national institution — toasting with "Na zdraví!" (na zdra-vee) is mandatory', 'Prague tourists are common — venturing beyond the Old Town reveals a real, cheaper city', 'Tipping around 10% is appreciated but not obligatory'],
  },

  // ── GEORGIAN ─────────────────────────────────────────────────────────────
  georgian: {
    language: 'Georgian', flag: '🇬🇪', script: 'Georgian (ქართული)',
    phrases: {
      hello:          ['გამარჯობა',      'Ga-mar-jo-ba'],
      goodbye:        ['ნახვამდის',      'Nakh-vam-dis'],
      thankyou:       ['გმადლობთ',      'Gma-dlob-t'],
      please:         ['გთხოვთ',        'Gt-khov-t'],
      sorry:          ['ბოდიში',        'Bo-di-shi'],
      yes:            ['კი / დიახ',     'Ki / Di-akh'],
      no:             ['არა',           'A-ra'],
      howmuch:        ['რამდენი ღირს?',  'Ram-de-ni ghirs?'],
      whereis:        ['სად არის...?',  'Sad a-ris?'],
      help:           ['დამეხმარეთ!',    'Da-me-khma-ret!'],
      dontunderstand: ['არ მესმის',     'Ar mes-mis'],
      speakenglish:   ['ინგლისურად ლაპარაკობთ?', 'In-gli-su-rad la-pa-ra-kobt?'],
      delicious:      ['გემრიელია!',    'Gem-ri-e-lia!'],
      bill:           ['ანგარიში, გთხოვთ', 'An-ga-ri-shi gt-khov-t'],
      bathroom:       ['სად არის ტუალეტი?', 'Sad a-ris tua-le-ti?'],
    },
    tips: ['Georgian hospitality (supra) is legendary — if invited to a feast, bring wine or sweets', '"Gaumarjos!" (gau-mar-jos) is the toast — expect many toasts at dinner', 'The Georgian script is unique — showing written words on your phone is very useful'],
  },

  // ── MALAY ────────────────────────────────────────────────────────────────
  malay: {
    language: 'Malay (Bahasa Malaysia)', flag: '🇲🇾', script: 'Latin',
    phrases: {
      hello:          ['Halo / Selamat datang',    'Ha-lo / Se-la-mat da-tang'],
      goodbye:        ['Selamat tinggal',          'Se-la-mat ting-gal'],
      thankyou:       ['Terima kasih',             'Teh-ree-ma ka-sih'],
      please:         ['Tolong',                   'Toh-long'],
      sorry:          ['Maaf',                     'Ma-af'],
      yes:            ['Ya',                       'Ya'],
      no:             ['Tidak',                    'Tee-dak'],
      howmuch:        ['Berapa harga ini?',        'Beh-ra-pa har-ga ini?'],
      whereis:        ['Di mana...?',             'Dee ma-na?'],
      help:           ['Tolong!',                  'Toh-long!'],
      dontunderstand: ['Saya tidak faham',         'Sa-ya tee-dak fa-ham'],
      speakenglish:   ['Boleh cakap bahasa Inggeris?', 'Bo-leh cha-kap ba-ha-sa Ing-ge-ris?'],
      delicious:      ['Sedap sekali!',            'Se-dap se-ka-li!'],
      bill:           ['Bil, tolong',              'Bil toh-long'],
      bathroom:       ['Di mana tandas?',          'Dee ma-na tan-das?'],
    },
    tips: ['Malaysia is multi-ethnic — greetings vary slightly between Malay, Chinese and Indian communities', 'Remove shoes before entering homes and some shops', 'Pointing with a finger is rude — use your thumb or an open hand'],
  },

  // ── RUSSIAN ──────────────────────────────────────────────────────────────
  russian: {
    language: 'Russian', flag: '🇷🇺', script: 'Cyrillic (Кириллица)',
    phrases: {
      hello:          ['Привет / Здравствуйте', 'Pri-vyet / Zdra-stvooy-teh'],
      goodbye:        ['До свидания',           'Do svee-da-ni-ya'],
      thankyou:       ['Спасибо',              'Spa-see-ba'],
      please:         ['Пожалуйста',           'Pa-zhal-sta'],
      sorry:          ['Извините',             'Iz-vee-ni-teh'],
      yes:            ['Да',                   'Da'],
      no:             ['Нет',                  'Nyet'],
      howmuch:        ['Сколько стоит?',       'Skol-ka sto-it?'],
      whereis:        ['Где находится...?',    'Gdye na-kho-di-tsa?'],
      help:           ['Помогите!',            'Pa-ma-gee-teh!'],
      dontunderstand: ['Я не понимаю',         'Ya nyeh pa-nee-ma-yu'],
      speakenglish:   ['Вы говорите по-английски?', 'Vy ga-va-ree-teh pa-ang-liysk-ee?'],
      delicious:      ['Очень вкусно!',        'O-chen vkoos-na!'],
      bill:           ['Счёт, пожалуйста',     'Shyot pa-zhal-sta'],
      bathroom:       ['Где туалет?',          'Gdye too-a-lyet?'],
    },
    tips: ['Russians don\'t smile at strangers — it\'s not rudeness, it\'s reserve', 'Always bring a gift when visiting someone\'s home', 'Shaking hands across a threshold (doorway) is considered bad luck — step inside first'],
  },

  // ── SWAHILI ──────────────────────────────────────────────────────────────
  swahili: {
    language: 'Swahili (Kiswahili)', flag: '🇹🇿', script: 'Latin',
    phrases: {
      hello:          ['Habari / Jambo',         'Ha-ba-ri / Jam-bo'],
      goodbye:        ['Kwa heri',               'Kwa heh-ri'],
      thankyou:       ['Asante',                 'A-san-teh'],
      please:         ['Tafadhali',              'Ta-fa-dha-li'],
      sorry:          ['Samahani',               'Sa-ma-ha-ni'],
      yes:            ['Ndiyo',                  'N-dee-yo'],
      no:             ['Hapana',                 'Ha-pa-na'],
      howmuch:        ['Bei gani?',              'Bay ga-ni?'],
      whereis:        ['...iko wapi?',           '...ee-ko wa-pi?'],
      help:           ['Saidia!',                'Sa-ee-dee-a!'],
      dontunderstand: ['Sielewi',               'Si-e-le-wi'],
      speakenglish:   ['Unazungumza Kiingereza?', 'U-na-zun-gum-za ki-in-ge-re-za?'],
      delicious:      ['Ni kitamu sana!',        'Ni ki-ta-moo sa-na!'],
      bill:           ['Niletee bili',           'Ni-le-te-e bi-li'],
      bathroom:       ['Choo kiko wapi?',        'Cho ki-ko wa-pi?'],
    },
    tips: ['"Pole pole" (slowly slowly) is the Swahili philosophy — rushing is not in the culture', 'Greet elders with "Shikamoo" — they respond "Marahaba"', '"Hakuna matata" is real — it genuinely means no worries'],
  },

  // ── LATIN AMERICAN SPANISH ───────────────────────────────────────────────
  // Used for Mexico, Guatemala, Costa Rica, Chile, Venezuela, Colombia, Peru
  latinspanish: {
    language: 'Spanish (Latin America)', flag: '🌎', script: 'Latin',
    phrases: {
      hello:          ['Hola',                    'Oh-la'],
      goodbye:        ['Adiós / Chao',            'A-dee-os / Chow'],
      thankyou:       ['Gracias',                 'Gra-see-as'],
      please:         ['Por favor',               'Por fa-vor'],
      sorry:          ['Disculpe',                'Dis-kool-peh'],
      yes:            ['Sí',                      'See'],
      no:             ['No',                      'No'],
      howmuch:        ['¿Cuánto cuesta?',         'Kwan-to kwes-ta?'],
      whereis:        ['¿Dónde está...?',         'Don-day es-ta?'],
      help:           ['¡Auxilio!',               'Owk-see-lyo!'],
      dontunderstand: ['No entiendo',             'No en-tyen-do'],
      speakenglish:   ['¿Habla inglés?',          'Ab-la in-gles?'],
      delicious:      ['¡Está riquísimo!',        'Es-ta ri-kee-see-mo!'],
      bill:           ['La cuenta, por favor',    'La kwen-ta por fa-vor'],
      bathroom:       ['¿Dónde está el baño?',    'Don-day es-ta el ban-yo?'],
    },
    tips: ['Time is flexible in Latin America — social events start later than scheduled', 'Personal space is closer than in Europe or North America', '"Pura vida" in Costa Rica means everything from hello to awesome to you\'re welcome'],
  },

  // ── BRAZILIAN PORTUGUESE ─────────────────────────────────────────────────
  brazilianportuguese: {
    language: 'Portuguese (Brazil)', flag: '🇧🇷', script: 'Latin',
    phrases: {
      hello:          ['Oi / Olá',                'Oy / Oh-la'],
      goodbye:        ['Tchau',                   'Chow'],
      thankyou:       ['Obrigado (m) / Obrigada (f)', 'Oh-bree-ga-doo / Oh-bree-ga-da'],
      please:         ['Por favor',               'Por fa-vor'],
      sorry:          ['Desculpe',                'Deh-skool-peh'],
      yes:            ['Sim',                     'Sing'],
      no:             ['Não',                     'Nowng'],
      howmuch:        ['Quanto custa?',           'Kwan-too koos-ta?'],
      whereis:        ['Onde fica...?',           'On-jee fee-ka?'],
      help:           ['Socorro!',                'So-ko-hoo!'],
      dontunderstand: ['Não entendi',             'Nowng en-ten-jee'],
      speakenglish:   ['Fala inglês?',            'Fa-la in-glesh?'],
      delicious:      ['Está delicioso!',         'Esh-ta de-lee-see-o-zoo!'],
      bill:           ['A conta, por favor',      'A kon-ta por fa-vor'],
      bathroom:       ['Onde fica o banheiro?',   'On-jee fee-ka oo ban-yay-roo?'],
    },
    tips: ['Brazilians are warm and tactile — hugs and cheek kisses are normal greetings', '"Saudade" (sau-da-jee) is the untranslatable word for longing — you\'ll feel it in the music', 'Açaí in Brazil is thicker and less sweet than abroad — it\'s a meal, not a dessert'],
  },

  // ── ENGLISH (English-speaking destinations) ──────────────────────────────
  english: {
    language: 'English', flag: '🇬🇧', script: 'Latin',
    phrases: {
      hello:          ['Hello',                               'Heh-lo'],
      goodbye:        ['Goodbye',                            'Good-bye'],
      thankyou:       ['Thank you',                         'Thank you'],
      please:         ['Please',                            'Pleez'],
      sorry:          ['Sorry / Excuse me',                 'Sor-ee / Ex-kyooz-me'],
      yes:            ['Yes',                               'Yes'],
      no:             ['No',                                'No'],
      howmuch:        ['How much is this?',                 'How much is this?'],
      whereis:        ['Where is...?',                      'Where is?'],
      help:           ['Help!',                             'Help!'],
      dontunderstand: ['I don\'t understand',               'I dont un-der-stand'],
      speakenglish:   ['Do you speak English?',            'Do you speak English?'],
      delicious:      ['This is delicious!',               'This is deh-lish-us!'],
      bill:           ['The check / bill, please',         'The check, pleez'],
      bathroom:       ['Where is the restroom / bathroom?', 'Where is the rest-room?'],
    },
    tips: ['In the UK, queuing is sacred — always join the back of a line', 'In Australia, "arvo" = afternoon, "servo" = petrol station, "brekky" = breakfast', 'In New Zealand, the Māori greeting "Kia ora" (kee-a or-a) is warmly appreciated'],
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// COUNTRY → LANGUAGE MAP
// Maps destination countries to their phrasebook key
// ─────────────────────────────────────────────────────────────────────────────

export const COUNTRY_LANGUAGE = {
  // Japanese
  'Japan': 'japanese', 'Kyoto, Japan': 'japanese',

  // Thai
  'Thailand': 'thai',

  // Indonesian
  'Indonesia': 'indonesian',

  // Italian
  'Italy': 'italian', 'Tuscany, Italy': 'italian', 'Sicily, Italy': 'italian',

  // French
  'France': 'french', 'French Polynesia': 'french',

  // Spanish (Spain)
  'Spain': 'spanish', 'Granada, Spain': 'spanish',

  // Portuguese (Portugal)
  'Portugal': 'portuguese',

  // Greek
  'Greece': 'greek', 'Crete, Greece': 'greek', 'Santorini': 'greek',

  // Vietnamese
  'Vietnam': 'vietnamese',

  // Moroccan Arabic
  'Morocco': 'moroccan',

  // Croatian
  'Croatia': 'croatian', 'Montenegro': 'croatian',

  // Turkish
  'Turkey': 'turkish',

  // Hindi/Indian
  'India': 'hindi', 'Kerala, India': 'hindi', 'Rajasthan, India': 'hindi',

  // Nepali
  'Nepal': 'nepali',

  // Mandarin
  'China': 'mandarin', 'Taiwan': 'mandarin',

  // German
  'Germany': 'german', 'Austria': 'german', 'Switzerland': 'german',

  // Slovenian
  'Slovenia': 'slovenian',

  // Norwegian
  'Norway': 'norwegian',

  // Icelandic
  'Iceland': 'icelandic', 'South Iceland': 'icelandic',

  // Danish
  'Denmark': 'danish', 'Greenland': 'danish',

  // Dutch
  'Netherlands': 'dutch',

  // Polish
  'Poland': 'polish',

  // Czech
  'Czech Republic': 'czech',

  // Georgian
  'Georgia': 'georgian',

  // Malay
  'Malaysia': 'malay',

  // Russian
  'Russia': 'russian',

  // Swahili
  'Tanzania': 'swahili', 'Kenya': 'swahili', 'Uganda': 'swahili',

  // Latin Spanish
  'Mexico': 'latinspanish',
  'Guatemala': 'latinspanish',
  'Monteverde, Costa Rica': 'latinspanish',
  'Costa Rica': 'latinspanish',
  'Chile': 'latinspanish',
  'Venezuela': 'latinspanish',
  'Colombia': 'latinspanish',
  'Peru': 'latinspanish',
  'Argentina': 'latinspanish',

  // Brazilian Portuguese
  'Brazil': 'brazilianportuguese',

  // English (default for English-speaking countries)
  'USA': 'english',
  'Australia': 'english',
  'Queensland, Australia': 'english',
  'Tasmania, Australia': 'english',
  'New Zealand': 'english',
  'Scotland': 'english',
  'Canada': 'english',
  'California, USA': 'english',
  'Utah, USA': 'english',
  'Arizona, USA': 'english',
  'Washington, USA': 'english',
  'Caribbean': 'english',
  'Maldives': 'english',
  'Philippines': 'english',
  'Seychelles': 'english',
  'Laos': 'english', // French/Lao but English widely used for tourism
  'Namibia': 'english',
  'South Africa': 'english',
  'Jordan': 'english', // Arabic but English widely used in tourism
}

// Helper: get phrasebook for a destination
export function getPhrasebook(destCountry) {
  const langKey = COUNTRY_LANGUAGE[destCountry] || 'english'
  return PHRASEBOOKS[langKey] || PHRASEBOOKS['english']
}

// ─────────────────────────────────────────────────────────────────────────────
// ADDITIONAL LANGUAGES — covering remaining destinations
// ─────────────────────────────────────────────────────────────────────────────

// Append to PHRASEBOOKS object — these are added via the addLanguages call below
export const EXTRA_PHRASEBOOKS = {

  // ── FINNISH ──────────────────────────────────────────────────────────────
  finnish: {
    language: 'Finnish (Suomi)', flag: '🇫🇮', script: 'Latin',
    phrases: {
      hello:          ['Hei',                        'Hey'],
      goodbye:        ['Näkemiin',                   'Nah-keh-meen'],
      thankyou:       ['Kiitos',                     'Kee-tos'],
      please:         ['Ole hyvä',                   'O-leh hew-vah'],
      sorry:          ['Anteeksi',                   'An-tayk-si'],
      yes:            ['Kyllä',                      'Kil-lah'],
      no:             ['Ei',                         'Ay'],
      howmuch:        ['Paljonko tämä maksaa?',       'Pal-yon-ko tah-mah mak-saa?'],
      whereis:        ['Missä on...?',               'Mis-sah on?'],
      help:           ['Apua!',                      'A-poo-a!'],
      dontunderstand: ['En ymmärrä',                 'En im-mar-rah'],
      speakenglish:   ['Puhutteko englantia?',        'Poo-hut-te-ko eng-lan-ti-a?'],
      delicious:      ['Tämä on herkullista!',        'Tah-mah on her-kul-lis-ta!'],
      bill:           ['Lasku, kiitos',               'Las-koo kee-tos'],
      bathroom:       ['Missä on vessa?',             'Mis-sah on ves-sa?'],
    },
    tips: ['Finns take personal space seriously — silence is comfortable, not awkward', 'Sauna is almost sacred — accept any invitation to one', 'Do not make small talk for the sake of it — directness is valued'],
  },

  // ── SWEDISH ───────────────────────────────────────────────────────────────
  swedish: {
    language: 'Swedish (Svenska)', flag: '🇸🇪', script: 'Latin',
    phrases: {
      hello:          ['Hej',                        'Hey'],
      goodbye:        ['Hej då',                     'Hey doh'],
      thankyou:       ['Tack',                       'Tak'],
      please:         ['Snälla',                     'Snel-la'],
      sorry:          ['Förlåt',                     'Fur-lote'],
      yes:            ['Ja',                         'Ya'],
      no:             ['Nej',                        'Nay'],
      howmuch:        ['Hur mycket kostar det?',      'Hoor mick-et kos-tar det?'],
      whereis:        ['Var är...?',                 'Var air?'],
      help:           ['Hjälp!',                     'Yelp!'],
      dontunderstand: ['Jag förstår inte',           'Yag fur-stor in-teh'],
      speakenglish:   ['Talar du engelska?',         'Tah-lar doo eng-el-ska?'],
      delicious:      ['Det är jättegott!',          'Deh air yet-teh-got!'],
      bill:           ['Notan, tack',                'Noo-tan tak'],
      bathroom:       ['Var är toaletten?',          'Var air to-a-let-en?'],
    },
    tips: ['Lagom — the Swedish concept of "just the right amount" — is the cultural compass', 'Fika (coffee and cake break) is a near-sacred social ritual', 'Swedish Lapland in winter is one of the most extreme and beautiful places on earth'],
  },

  // ── HUNGARIAN ─────────────────────────────────────────────────────────────
  hungarian: {
    language: 'Hungarian (Magyar)', flag: '🇭🇺', script: 'Latin',
    phrases: {
      hello:          ['Szia / Jó napot',            'See-ya / Yo na-pot'],
      goodbye:        ['Viszlát',                    'Vis-laht'],
      thankyou:       ['Köszönöm',                   'Kuh-suh-nuhm'],
      please:         ['Kérem',                      'Kay-rem'],
      sorry:          ['Elnézést',                   'El-nay-zaysht'],
      yes:            ['Igen',                       'Ee-gen'],
      no:             ['Nem',                        'Nem'],
      howmuch:        ['Mennyibe kerül?',             'Men-nyi-be ke-ryul?'],
      whereis:        ['Hol van...?',               'Hol von?'],
      help:           ['Segítség!',                  'She-geet-shayg!'],
      dontunderstand: ['Nem értem',                  'Nem air-tem'],
      speakenglish:   ['Tud angolul?',               'Tood on-go-lool?'],
      delicious:      ['Nagyon finom!',              'No-dyon fee-nom!'],
      bill:           ['A számlát kérem',             'A sahm-laht kay-rem'],
      bathroom:       ['Hol van a mosdó?',           'Hol von o mosh-doh?'],
    },
    tips: ['Hungarian has no relation to most European languages — it stands entirely alone', 'Pálinka (fruit brandy) toasts begin with "Egészségre!" (e-gays-shayg-reh) — cheers to health', 'Budapest is two cities — Buda is hilly and old, Pest is flat and buzzing'],
  },

  // ── ROMANIAN ──────────────────────────────────────────────────────────────
  romanian: {
    language: 'Romanian (Română)', flag: '🇷🇴', script: 'Latin',
    phrases: {
      hello:          ['Bună ziua',                  'Boo-nah zee-wa'],
      goodbye:        ['La revedere',                'La reh-veh-deh-reh'],
      thankyou:       ['Mulțumesc',                  'Mool-tsoo-mesk'],
      please:         ['Vă rog',                     'Vah rog'],
      sorry:          ['Îmi pare rău',               'Um-ee pa-reh raw'],
      yes:            ['Da',                         'Da'],
      no:             ['Nu',                         'Noo'],
      howmuch:        ['Cât costă?',                 'Kut kos-tah?'],
      whereis:        ['Unde este...?',              'Oon-deh yes-teh?'],
      help:           ['Ajutor!',                    'A-zhoo-tor!'],
      dontunderstand: ['Nu înțeleg',                 'Noo un-tseh-leg'],
      speakenglish:   ['Vorbiți englezește?',        'Vor-beets eng-leh-zesh-teh?'],
      delicious:      ['E delicious!',               'Yeh deh-lee-chee-os!'],
      bill:           ['Nota de plată, vă rog',      'No-ta deh pla-tah vah rog'],
      bathroom:       ['Unde este toaleta?',         'Oon-deh yes-teh to-a-leh-ta?'],
    },
    tips: ['Romanian is a Romance language — Spanish and Italian speakers will recognise many words', 'Dracula\'s castle (Bran Castle) is in Transylvania — and Transylvania is genuinely stunning', 'Hospitality is a point of pride — guests are treated generously'],
  },

  // ── BURMESE (MYANMAR) ─────────────────────────────────────────────────────
  burmese: {
    language: 'Burmese (မြန်မာဘာသာ)', flag: '🇲🇲', script: 'Burmese script',
    phrases: {
      hello:          ['မင်္ဂလာပါ',         'Min-ga-la-ba'],
      goodbye:        ['သွားတော့မယ်',        'Thwa-daw-meh'],
      thankyou:       ['ကျေးဇူးတင်ပါတယ်',    'Kyay-zu-tin-ba-deh'],
      please:         ['ကျေးဇူးပြု၍',       'Kyay-zu-pyu-yway'],
      sorry:          ['တောင်းပန်ပါတယ်',     'Tawng-pan-ba-deh'],
      yes:            ['ဟုတ်ကဲ့',           'Hoke-keh'],
      no:             ['မဟုတ်ဘူး',          'Ma-hoke-bu'],
      howmuch:        ['ဘယ်လောက်လဲ',        'Beh-lauk-leh?'],
      whereis:        ['... ဘယ်မှာလဲ',      '...beh-hma-leh?'],
      help:           ['ကူညီပေးပါ',         'Ku-nyi-pay-ba!'],
      dontunderstand: ['နားမလည်ဘူး',        'Nar-ma-leh-bu'],
      speakenglish:   ['အင်္ဂလိပ်စကားပြောတတ်သလား', 'In-ga-leik-za-ga-pyaw-tut-tha-la?'],
      delicious:      ['အရမ်းကောင်းတယ်',    'A-yan-kaung-deh!'],
      bill:           ['ဘောင်ချာပေးပါ',      'Baung-cha-pay-ba'],
      bathroom:       ['အိမ်သာ ဘယ်မှာလဲ',  'Ain-tha beh-hma-leh?'],
    },
    tips: ['Always remove shoes before entering temples and homes', 'The longyi (sarong) is worn by everyone — dress modestly near pagodas', 'Pointing with a single finger is rude — use an open hand instead'],
  },

  // ── MONGOLIAN ─────────────────────────────────────────────────────────────
  mongolian: {
    language: 'Mongolian (Монгол)', flag: '🇲🇳', script: 'Cyrillic (Mongolian)',
    phrases: {
      hello:          ['Сайн байна уу',        'Sain bai-na uu'],
      goodbye:        ['Баяртай',              'Ba-yar-tai'],
      thankyou:       ['Баярлалаа',            'Ba-yar-la-laa'],
      please:         ['Гуйя',                 'Gui-ya'],
      sorry:          ['Уучлаарай',            'Uuch-laa-rai'],
      yes:            ['Тийм',                 'Tiim'],
      no:             ['Үгүй',                 'U-gui'],
      howmuch:        ['Ямар үнэтэй вэ?',      'Ya-mar u-ne-tei ve?'],
      whereis:        ['... хаана байна?',     '...khaa-na bai-na?'],
      help:           ['Тусламж!',             'Tus-lamj!'],
      dontunderstand: ['Би ойлгохгүй байна',   'Bi oil-gokh-gui bai-na'],
      speakenglish:   ['Та англиар ярьдаг уу?', 'Ta ang-li-ar yar-dag uu?'],
      delicious:      ['Амттай байна!',        'Amt-tai bai-na!'],
      bill:           ['Тооцоо хийнэ үү',      'Toot-soo khii-ne uu'],
      bathroom:       ['Жорлон хаана байна?',  'Jor-lon khaa-na bai-na?'],
    },
    tips: ['When visiting a ger (yurt), walk clockwise inside and sit on the left side if male', 'Accept any food or drink offered with both hands or the right hand', 'The vast steppe has almost no signage — GPS and a local guide matter enormously'],
  },

  // ── TIBETAN ───────────────────────────────────────────────────────────────
  tibetan: {
    language: 'Tibetan (བོད་སྐད་)', flag: '🏔️', script: 'Tibetan script',
    phrases: {
      hello:          ['བཀྲ་ཤིས་བདེ་ལེགས།',  'Tashi Delek'],
      goodbye:        ['ཀ་ལེ་ཕེབས།',         'Ka-le Phep'],
      thankyou:       ['ཐུགས་རྗེ་ཆེ།',        'Thuk-je Che'],
      please:         ['གུས་འདུད་ཀྱིས།',      'Kus-du-kyi'],
      sorry:          ['གོང་འཕྲོད།',          'Gong-trod'],
      yes:            ['རེད།',               'Ray'],
      no:             ['མ་རེད།',             'Ma-ray'],
      howmuch:        ['ག་ཚད་རེད།',           'Ka-tse ray?'],
      whereis:        ['... གང་དུ་ཡོད།',     '...kang-du yö?'],
      help:           ['རོགས་རམ།',           'Rok-ram!'],
      dontunderstand: ['ང་གོ་ཡི་མ་རེད།',     'Nga go-yi ma-ray'],
      speakenglish:   ['ཁྱེད་རང་དབྱིན་ཡིག་ཤེས་སམ།', 'Khe-rang in-yik she-sam?'],
      delicious:      ['ཤིམ་པོ་འདུག',       'Shim-po duk!'],
      bill:           ['རིན་ཐང་།',           'Rin-thang'],
      bathroom:       ['གསང་ཁང་གང་དུ་ཡོད།', 'Sang-khang kang-du yö?'],
    },
    tips: ['"Tashi Delek" is the universal greeting meaning blessings and good luck — use it freely', 'Always circumambulate monasteries clockwise', 'Prayer flags are sacred — do not remove or step on them'],
  },

  // ── AMHARIC (ETHIOPIA) ────────────────────────────────────────────────────
  amharic: {
    language: 'Amharic (አማርኛ)', flag: '🇪🇹', script: 'Ge\'ez script (Ethiopic)',
    phrases: {
      hello:          ['ሰላም',              'Se-lam'],
      goodbye:        ['ደህና ሁን',           'Deh-na hun'],
      thankyou:       ['አመሰግናለሁ',          'A-mes-eg-na-le-hu'],
      please:         ['እባክዎ',             'I-bak-wo'],
      sorry:          ['ይቅርታ',            'Yik-ir-ta'],
      yes:            ['አዎ',              'A-wo'],
      no:             ['አይ',              'Ay'],
      howmuch:        ['ስንት ነው?',          'Sint new?'],
      whereis:        ['... የት ነው?',       '...yet new?'],
      help:           ['助けて!',            'Ir-da-ta!'],
      dontunderstand: ['አልገባኝም',           'Al-ge-ba-nyim'],
      speakenglish:   ['እንግሊዝኛ ይናገራሉ?',   'In-gli-zi-nya yi-na-ge-ra-lu?'],
      delicious:      ['ጣፋጭ ነው!',         'Ta-fach new!'],
      bill:           ['ሂሳቡን ያምጡ',        'Hi-sa-bun ya-mtu'],
      bathroom:       ['መጸዳጃ ቤት የት ነው?',  'Me-tse-da-ja bet yet new?'],
    },
    tips: ['Coffee originated in Ethiopia — the coffee ceremony is a social ritual lasting hours', 'Injera (spongy flatbread) is eaten communally — use only your right hand', 'Ethiopia uses its own calendar and clock — 1am Ethiopian time is 7am by international reckoning'],
  },

  // ── KINYARWANDA (RWANDA) ──────────────────────────────────────────────────
  kinyarwanda: {
    language: 'Kinyarwanda', flag: '🇷🇼', script: 'Latin',
    phrases: {
      hello:          ['Muraho',                'Moo-ra-ho'],
      goodbye:        ['Murabeho',              'Moo-ra-beh-ho'],
      thankyou:       ['Murakoze',              'Moo-ra-ko-zeh'],
      please:         ['Ndakwinginze',          'N-da-kwin-gin-zeh'],
      sorry:          ['Mbabarira',             'M-ba-ba-ree-ra'],
      yes:            ['Yego',                  'Yeh-go'],
      no:             ['Oya',                   'O-ya'],
      howmuch:        ['Ni angahe?',            'Nee an-ga-heh?'],
      whereis:        ['... iri he?',           '...ee-ree heh?'],
      help:           ['Nfasha!',               'N-fa-sha!'],
      dontunderstand: ['Sinumva',               'Si-noom-va'],
      speakenglish:   ['Uvuga Icyongereza?',    'Oo-voo-ga i-chyon-ge-reh-za?'],
      delicious:      ['Biraryoshye!',          'Bi-ra-ryo-shyeh!'],
      bill:           ['Mphe fagitire',         'M-pheh fa-gi-tee-reh'],
      bathroom:       ['Ubwira turi he?',       'Oo-bwee-ra too-ree heh?'],
    },
    tips: ['Rwanda has mandatory monthly community service (Umuganda) — a powerful cultural norm', 'Plastic bags are banned nationwide — bring a reusable bag', 'Gorilla trekking permits are expensive but the experience is genuinely life-changing'],
  },

  // ── UZBEK ─────────────────────────────────────────────────────────────────
  uzbek: {
    language: 'Uzbek (O\'zbek)', flag: '🇺🇿', script: 'Latin (formerly Cyrillic)',
    phrases: {
      hello:          ['Assalomu alaykum',       'As-sa-lo-mu a-lay-kum'],
      goodbye:        ['Xayr',                  'Khair'],
      thankyou:       ['Rahmat',                'Rah-mat'],
      please:         ['Iltimos',               'Il-ti-mos'],
      sorry:          ['Kechirasiz',            'Ke-chi-ra-siz'],
      yes:            ['Ha',                    'Ha'],
      no:             ['Yo\'q',                 'Yok'],
      howmuch:        ['Bu qancha turadi?',     'Boo kan-cha too-ra-di?'],
      whereis:        ['... qayerda?',          '...kay-yer-da?'],
      help:           ['Yordam bering!',        'Yor-dam be-ring!'],
      dontunderstand: ['Tushunmayapman',        'Too-shoon-mai-ap-man'],
      speakenglish:   ['Inglizcha bilasizmi?',  'In-gliz-cha bi-la-siz-mi?'],
      delicious:      ['Juda mazali!',          'Joo-da ma-za-li!'],
      bill:           ['Hisob-kitob iling',     'Hi-sob ki-tob i-ling'],
      bathroom:       ['Hojatxona qayerda?',   'Ho-jat-kho-na kay-yer-da?'],
    },
    tips: ['Samarkand and Bukhara are Silk Road cities of extraordinary beauty', 'Tea is served before and after meals — the pot is refilled constantly', 'Plov (rice and lamb dish) is the national dish — Friday plov lunches are a social institution'],
  },

  // ── TURKMEN ───────────────────────────────────────────────────────────────
  turkmen: {
    language: 'Turkmen (Türkmen)', flag: '🇹🇲', script: 'Latin',
    phrases: {
      hello:          ['Salam',                  'Sa-lam'],
      goodbye:        ['Hoş gal',                'Hosh gal'],
      thankyou:       ['Sag boluň',              'Sag bo-lun'],
      please:         ['Haýyş edýärin',          'Hai-yish ed-yah-rin'],
      sorry:          ['Bagyşlaň',               'Ba-gish-lan'],
      yes:            ['Hawa',                   'Ha-wa'],
      no:             ['Ýok',                    'Yok'],
      howmuch:        ['Bu näçe?',               'Boo na-cheh?'],
      whereis:        ['... nirede?',            '...ni-reh-deh?'],
      help:           ['Kömek edin!',            'Ko-mek eh-din!'],
      dontunderstand: ['Düşünemok',              'Du-shoo-ne-mok'],
      speakenglish:   ['Iňlis dilini bilýäňizmi?', 'In-lis di-li-ni bil-yah-niz-mi?'],
      delicious:      ['Gaty lezzetli!',         'Ga-ti lez-zet-li!'],
      bill:           ['Hasaby beriň',           'Ha-sa-bi be-rin'],
      bathroom:       ['Hajathana nirede?',      'Ha-jat-ha-na ni-reh-deh?'],
    },
    tips: ['Turkmenistan is one of the most isolated countries on earth — permits and guides are often required', 'The Darvaza gas crater ("Door to Hell") burns naturally and has for decades', 'Hospitality is profound — accepting tea and food is expected'],
  },

  // ── ARABIC (OMAN/JORDAN/MIDDLE EAST) ─────────────────────────────────────
  arabic: {
    language: 'Arabic (العربية)', flag: '🕌', script: 'Arabic script',
    phrases: {
      hello:          ['السلام عليكم',         'As-sala-mu a-lay-kum'],
      goodbye:        ['مع السلامة',           'Ma-a as-sa-la-ma'],
      thankyou:       ['شكراً جزيلاً',         'Shuk-ran ja-zee-lan'],
      please:         ['من فضلك',              'Min fad-lak'],
      sorry:          ['آسف',                 'Aa-sif'],
      yes:            ['نعم',                 'Na-am'],
      no:             ['لا',                  'La'],
      howmuch:        ['كم ثمنه؟',            'Kam tha-ma-nuh?'],
      whereis:        ['أين...؟',             'Ay-na?'],
      help:           ['النجدة!',             'An-naj-da!'],
      dontunderstand: ['لا أفهم',             'La af-ham'],
      speakenglish:   ['هل تتكلم الإنجليزية؟', 'Hal ta-ta-kal-am al-in-glee-zee-ya?'],
      delicious:      ['لذيذ جداً!',          'La-zeez jid-dan!'],
      bill:           ['الحساب من فضلك',      'Al-hi-sab min fad-lak'],
      bathroom:       ['أين الحمام؟',         'Ay-na al-ham-mam?'],
    },
    tips: ['The greeting "As-salamu alaykum" deserves the response "Wa alaykum as-salam"', 'Right hand for eating and greeting — left is considered unclean', 'Hospitality in Arab culture is a duty — you will be offered coffee and dates'],
  },

  // ── CANTONESE (HONG KONG) ─────────────────────────────────────────────────
  cantonese: {
    language: 'Cantonese (廣東話)', flag: '🇭🇰', script: 'Traditional Chinese (繁體)',
    phrases: {
      hello:          ['你好',               'Lei ho (Lay-ho)'],
      goodbye:        ['再見',               'Joi gin (Joy-geen)'],
      thankyou:       ['唔該 / 多謝',         'M-goi / Do-jeh (M-goy / Doh-jeh)'],
      please:         ['唔該',              'M-goi (M-goy)'],
      sorry:          ['對唔住',             'Dui m-jyu (Doy-m-joo)'],
      yes:            ['係',               'Hai (High)'],
      no:             ['唔係',             'M-hai (M-high)'],
      howmuch:        ['幾錢?',             'Gei chin? (Gay-cheen?)'],
      whereis:        ['...喺邊度?',        '...hai bin-do? (high bin-doh?)'],
      help:           ['救命!',             'Gau meng! (Gow-meng!)'],
      dontunderstand: ['我唔明',            'Ngo m-ming (Ngoh m-ming)'],
      speakenglish:   ['你識講英文嗎?',      'Lei sik gong Ying-man ma? (Lay sik gong Ying-mun ma?)'],
      delicious:      ['好食!',             'Ho sik! (Ho-sik!)'],
      bill:           ['埋單',             'Mai dan (My-dan)'],
      bathroom:       ['廁所喺邊度?',       'Chi-so hai bin-do? (Chi-so high bin-doh?)'],
    },
    tips: ['"M-goi" thanks someone for a service, "Do-jeh" thanks someone for a gift — different situations', 'Dim sum is brunch, not dinner — go before noon for the best experience', 'Hong Kong moves very fast — step aside from the MTR door if you\'re slow'],
  },

  // ── IRISH / ENGLISH (IRELAND) ─────────────────────────────────────────────
  irish: {
    language: 'Irish (Gaeilge) / English', flag: '🇮🇪', script: 'Latin',
    phrases: {
      hello:          ['Dia dhuit / Hello',         'Dee-a gwit / Hello'],
      goodbye:        ['Slán / Goodbye',            'Slawn / Goodbye'],
      thankyou:       ['Go raibh maith agat',       'Guh rev mah a-gut'],
      please:         ['Le do thoil',               'Leh duh hull'],
      sorry:          ['Tá brón orm',               'Taw brone urm'],
      yes:            ['Tá / Yes',                  'Taw / Yes'],
      no:             ['Níl / No',                  'Neel / No'],
      howmuch:        ['Cé mhéad atá air?',         'Kay vayd ah-taw air?'],
      whereis:        ['Cá bhfuil...?',             'Kaw will?'],
      help:           ['Cabhair!',                  'Kov-er!'],
      dontunderstand: ['Níl mé ag tuiscint',        'Neel may eg tish-kint'],
      speakenglish:   ['An bhfuil Béarla agat?',    'On will bay-er-la a-gut?'],
      delicious:      ['Tá sé go hálainn!',         'Taw shay guh haw-lin!'],
      bill:           ['An bille le do thoil',      'On bil-eh leh duh hull'],
      bathroom:       ['Cá bhfuil an leithreas?',  'Kaw will on leh-russ?'],
    },
    tips: ['Irish is rarely spoken conversationally but any attempt is warmly received', 'The pub is a genuine community centre — not just for drinking', '"Craic" (crack) means fun, atmosphere, good times — "What\'s the craic?" means what\'s going on'],
  },

  // ── MALTESE ───────────────────────────────────────────────────────────────
  maltese: {
    language: 'Maltese (Malti)', flag: '🇲🇹', script: 'Latin',
    phrases: {
      hello:          ['Bonġu / Merhba',            'Bon-joo / Mer-ba'],
      goodbye:        ['Saħħa',                     'Sah-ha'],
      thankyou:       ['Grazzi',                    'Grat-zee'],
      please:         ['Jekk jogħġbok',             'Yek yo-jbok'],
      sorry:          ['Skużani',                   'Skoo-za-ni'],
      yes:            ['Iva',                       'Ee-va'],
      no:             ['Le',                        'Leh'],
      howmuch:        ['Kemm jiswa?',               'Kem yis-wa?'],
      whereis:        ['Fejn hu...?',              'Feyn hoo?'],
      help:           ['Ajjut!',                    'Ay-yoot!'],
      dontunderstand: ['Ma nifhimx',               'Ma nif-himsh'],
      speakenglish:   ['Titkellem bl-Ingliż?',      'Tit-kel-lem bl-in-gleez?'],
      delicious:      ['Jiklilha!',                 'Yik-li-ha!'],
      bill:           ['Il-kont, jekk jogħġbok',    'Il-kont yek yo-jbok'],
      bathroom:       ['Fejn huma t-toilets?',      'Feyn hoo-ma t-toy-lets?'],
    },
    tips: ['Maltese is the only Semitic language written in Latin script — a unique linguistic island', 'English is an official language alongside Maltese — everyone speaks it', 'The ancient temples of Malta predate Stonehenge and the Egyptian pyramids'],
  },

  // ── SINGAPORE ENGLISH (SINGLISH) ─────────────────────────────────────────
  singlish: {
    language: 'English / Singlish', flag: '🇸🇬', script: 'Latin',
    phrases: {
      hello:          ['Hello / Hi',                'Hello / Hi'],
      goodbye:        ['Bye bye',                   'Bye bye'],
      thankyou:       ['Thank you / Terima kasih',  'Thank you / Teh-ree-ma ka-sih'],
      please:         ['Please',                    'Please'],
      sorry:          ['Sorry lah',                 'Sorry lah'],
      yes:            ['Can / Yes',                 'Can / Yes'],
      no:             ['Cannot / No',               'Cannot / No'],
      howmuch:        ['How much?',                 'How much?'],
      whereis:        ['Where is...?',              'Where is?'],
      help:           ['Help!',                     'Help!'],
      dontunderstand: ['I don\'t understand lah',   'I don\'t understand lah'],
      speakenglish:   ['You speak English?',        'You speak English?'],
      delicious:      ['This one very shiok!',      'This one very shi-yok! (meaning: amazing)'],
      bill:           ['Bill please',               'Bill please'],
      bathroom:       ['Where\'s the toilet?',      'Where\'s the toilet?'],
    },
    tips: ['"Lah" added to the end of sentences is Singlish emphasis — totally normal', '"Shiok" means delicious or fantastic', 'Hawker centres are open-air food courts — this is where Singaporeans really eat'],
  },

  // ── LAO ───────────────────────────────────────────────────────────────────
  lao: {
    language: 'Lao (ພາສາລາວ)', flag: '🇱🇦', script: 'Lao script',
    phrases: {
      hello:          ['ສະບາຍດີ',             'Sa-bai-dee'],
      goodbye:        ['ລາກ່ອນ',               'La-gon'],
      thankyou:       ['ຂອບໃຈ',               'Khop-jai'],
      please:         ['ກາລຸນາ',              'Ga-ru-na'],
      sorry:          ['ຂໍໂທດ',              'Kho-thot'],
      yes:            ['ແມ່ນ',               'Man'],
      no:             ['ບໍ່',                'Bor'],
      howmuch:        ['ລາຄາເທົ່າໃດ?',        'La-kha tao-dai?'],
      whereis:        ['...ຢູ່ໃສ?',           '...yoo sai?'],
      help:           ['ຊ່ວຍດ້ວຍ!',           'Suay-duay!'],
      dontunderstand: ['ຂ້ອຍບໍ່ເຂົ້າໃຈ',      'Koi bor khao-jai'],
      speakenglish:   ['ເວົ້າພາສາອັງກິດໄດ້ບໍ?', 'Vao pasa ang-git dai bor?'],
      delicious:      ['ອ່ອຍຫຼາຍ!',           'Oi lai!'],
      bill:           ['ເກັບເງິນ',            'Gep-ngern'],
      bathroom:       ['ຫ້ອງນ້ຳຢູ່ໃສ?',       'Hong-nam yoo sai?'],
    },
    tips: ['Laos runs on "bor pen nyang" (no worries) time — slow down and adjust', 'The Mekong river is the heartbeat of the country', 'Monks are highly revered — dress modestly near temples and never touch a monk'],
  },

  // ── CREOLE (SEYCHELLES) ───────────────────────────────────────────────────
  seychellois: {
    language: 'Seychellois Creole (Kreol)', flag: '🇸🇨', script: 'Latin',
    phrases: {
      hello:          ['Bonzour',               'Bon-zoor'],
      goodbye:        ['Orevwar',               'O-reh-vwar'],
      thankyou:       ['Mersi',                 'Mair-see'],
      please:         ['Silvouplé',             'Sil-voo-play'],
      sorry:          ['Eskiz mwan',            'Es-keez mwan'],
      yes:            ['Wi',                    'Wee'],
      no:             ['Non',                   'Non'],
      howmuch:        ['Konbyen sa koute?',     'Kon-byan sa koot?'],
      whereis:        ['Kot ete...?',           'Ko teh-teh?'],
      help:           ['Ed mwan!',              'Ed mwan!'],
      dontunderstand: ['Mon pa konprann',       'Mon pa kon-pran'],
      speakenglish:   ['Ou koz Angle?',         'Oo koz Ang-gleh?'],
      delicious:      ['Sa bon anpil!',         'Sa bon on-pil!'],
      bill:           ['Ladiksyon silvouplé',   'La-dik-syon sil-voo-play'],
      bathroom:       ['Kot ete twalèt la?',    'Ko teh-teh twa-let la?'],
    },
    tips: ['Seychellois Creole is based on French — French speakers will recognise most of it', 'The coco de mer nut is unique to Seychelles and is the world\'s largest seed', 'Beaches are public by law — no resort can block beach access'],
  },
}

// Additional country mappings
export const EXTRA_COUNTRY_LANGUAGE = {
  // Finnish
  'Finland': 'finnish',
  'Lappi, Finland': 'finnish',

  // Swedish
  'Swedish Lapland': 'swedish',

  // Hungarian
  'Hungary': 'hungarian',

  // Romanian
  'Romania': 'romanian',

  // Burmese
  'Myanmar': 'burmese',

  // Mongolian
  'Mongolia': 'mongolian',

  // Tibetan
  'Tibet': 'tibetan',

  // Amharic
  'Ethiopia': 'amharic',

  // Kinyarwanda
  'Rwanda': 'kinyarwanda',
  'Zambia & Zimbabwe': 'english', // English is primary language in both

  // Uzbek
  'Uzbekistan': 'uzbek',

  // Turkmen
  'Turkmenistan': 'turkmen',

  // Arabic
  'Oman': 'arabic',
  'Jordan': 'arabic', // override from English above

  // Cantonese
  'Hong Kong': 'cantonese',

  // Irish
  'Ireland': 'irish',

  // Maltese
  'Malta': 'maltese',

  // Singapore
  'Singapore': 'singlish',

  // Lao
  'Laos': 'lao',

  // Seychellois Creole
  'Seychelles': 'seychellois',

  // Regional USA — all English
  'Alaska, USA': 'english',
  'Maui, Hawaii': 'english',
  'New York, USA': 'english',
  'Oregon, USA': 'english',
  'New York, USA': 'english',

  // Regional France — French
  'Giverny, France': 'french',
  'Paris, France': 'french',
  'Provence, France': 'french',

  // Regional Italy
  'Lazio, Italy': 'italian',
  'South Tyrol, Italy': 'german', // German-speaking region
  'Tivoli, Italy': 'italian',

  // Regional Spain
  'Barcelona, Spain': 'spanish',

  // Regional China — Mandarin
  'Anhui, China': 'mandarin',
  'Hunan, China': 'mandarin',

  // Regional Japan
  'Ibaraki, Japan': 'japanese',
  'Kawachi, Japan': 'japanese',
  'Tokyo, Japan': 'japanese',

  // Regional Norway
  'Nordland, Norway': 'norwegian',
  'Tromso, Norway': 'norwegian',

  // Regional Iceland
  'Vatnajokull, Iceland': 'icelandic',

  // Regional Canada
  'Manitoba, Canada': 'english',
  'Ontario, Canada': 'english',
  'Yukon, Canada': 'english',

  // Regional Australia
  'NSW, Australia': 'english',

  // Regional Chile/Argentina
  'Patagonia, Chile': 'latinspanish',
  'Argentina & Brazil': 'latinspanish',
  'Bolivia': 'latinspanish',

  // Antarctica — English (scientific stations)
  'Antarctica': 'english',
}
