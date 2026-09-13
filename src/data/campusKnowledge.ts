import { initialCampusVideos } from "./campusVideos";
import { initialCollegeInfo, initialAdmins, initialTeamMembers, facultiesList, cseSchedule } from "./campusData";

// Normalizes query for robust Hindi/Hinglish/English search
function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[।.,?!;:'"()\[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getComprehensiveCampusAnswer(queryRaw: string): string {
  const q = normalizeQuery(queryRaw);

  // 1. CSE Section A & Classes
  if (
    q.includes("cse a") ||
    q.includes("section a") ||
    q.includes("cse section a") ||
    q.includes("cse section-a") ||
    q.includes("सी एस ई") ||
    q.includes("सेक्शन ए") ||
    q.includes("सेक्शन a") ||
    (q.includes("cse") && (q.includes("class") || q.includes("room") || q.includes("floor") || q.includes("kahan") || q.includes("rasta") || q.includes("jaana")))
  ) {
    return `💻 **CSE Section A (कंप्यूटर साइंस इंजीनियरिंग - सेक्शन A):**
• **लोकेशन:** Block C के **2nd Floor (दूसरे तल)** पर स्थित है।
• **पहुँचने का सटीक रास्ता:** 
  1. Block C के मुख्य द्वार (या बाएं सीढ़ियों वाले गेट) से प्रवेश करें।
  2. बाईं (Left) सीढ़ियों से सीधे 2nd Floor पर जाएँ।
  3. सीढ़ियों से ऊपर पहुँचकर दाईं ओर मुड़ें — आगे HOD Office, Bio-Tech, Mechanical, Agriculture, CSE Section C और Section B आते हैं।
  4. इनके आगे बढ़ते ही बाईं सीढ़ियों के नजदीक ही आपका **CSE Section A** क्लासरूम मिल जाएगा!
• **सुविधाएँ:** स्मार्ट डिजिटल बोर्ड, मल्टीमीडिया प्रोजेक्टर, और हाई-स्पीड वाई-फाई की सुविधा।
• **फैकल्टी:** CSE HOD आदरणीय प्रशांत बाजपेयी सर (Block C 1st व 2nd Floor)।`;
  }

  // 2. Schedule, Timetable, Timing, Breaks
  if (
    q.includes("schedule") ||
    q.includes("timetable") ||
    q.includes("time table") ||
    q.includes("timing") ||
    q.includes("time") ||
    q.includes("break") ||
    q.includes("lunch") ||
    q.includes("water") ||
    q.includes("क्लास का समय") ||
    q.includes("शेड्यूल") ||
    q.includes("टाइम टेबल") ||
    q.includes("लंच") ||
    q.includes("वॉटर ब्रेक") ||
    q.includes("कब होती है") ||
    q.includes("छुट्टी का समय")
  ) {
    return `⏰ **CSE Section A कॉलेज शेड्यूल व टाइमिंग:**
• **क्लास का समय:** सुबह 09:00 AM से शाम 04:30 PM (सोमवार से शनिवार)।
• **वॉटर ब्रेक्स (Water Breaks):**
  1. पहला ब्रेक: सुबह 11:00 AM से 11:10 AM (10 मिनट)
  2. दूसरा ब्रेक: दोपहर 02:10 PM से 02:20 PM (10 मिनट)
  3. तीसरा ब्रेक: शाम 03:20 PM से 03:30 PM (10 मिनट)
• **लंच ब्रेक (Lunch Break):** दोपहर 12:10 PM से 01:00 PM (50 मिनट का भोजन अवकाश सेंट्रल कैफेटेरिया व गेट 2 कैफे पर)।
• **पीरियड्स:** रोजाना 6 पीरियड्स और प्रैक्टिकल लैब्स (Chemistry, Electronics, Mechanics, Language Lab) आयोजित होती हैं।`;
  }

  // 3. Admin & Team Members (all Er., Cities, updated emails, read-only)
  if (
    q.includes("admin") ||
    q.includes("team") ||
    q.includes("creator") ||
    q.includes("developer") ||
    q.includes("leader") ||
    q.includes("suman") ||
    q.includes("vivek") ||
    q.includes("pranjal") ||
    q.includes("roshan") ||
    q.includes("rijawan") ||
    q.includes("avinash") ||
    q.includes("saroj") ||
    q.includes("एडमिन") ||
    q.includes("टीम") ||
    q.includes("किसने बनाया") ||
    q.includes("इंजीनियर")
  ) {
    return `👥 **SRGI एडमिन व क्रिएटर टीम (सभी इंजीनियर्स - Official Records):**
1. **Er. सुमन कुमार (Leader - B.Tech CSE A)**
   • शहर: बेगूसराय, बिहार | ईमेल: imsumanpoddar12@gmail.com / suman@srgi.ac.in
2. **Er. विवेक साहनी (Co-Leader - B.Tech CSE A)**
   • शहर: कुशीनगर, उत्तर प्रदेश | ईमेल: vivek@srgi.ac.in
3. **Er. प्रांजल मौर्या (Core Member - B.Tech CSE A)**
   • शहर: वाराणसी, उत्तर प्रदेश | ईमेल: pranjalmaurya1120@gmail.com
4. **Er. रोशन कुमार भारती (Core Member - B.Tech CSE A)**
   • शहर: मऊ, उत्तर प्रदेश | ईमेल: roshan@srgi.ac.in
5. **Er. रिजवान खान (Core Member - B.Tech CSE A)**
   • शहर: महराजगंज, उत्तर प्रदेश | ईमेल: rijawan5657@gmail.com
6. **Er. अविनाश प्रजापति (Core Member - B.Tech CSE A)**
   • शहर: महराजगंज, उत्तर प्रदेश | ईमेल: avinash@srgi.ac.in
7. **Er. विवेक सरोज (Core Member - B.Tech CSE A)**
   • शहर: प्रतापगंज, उत्तर प्रदेश | ईमेल: viveksaroj@srgi.ac.in

🔒 सभी एडमिन्स की प्रोफाइल आधिकारिक व सुरक्षित है और फोन नंबर की जगह उनके गृह नगर प्रदर्शित हैं।`;
  }

  // 4. All 5 Blocks overview (Block A, B, C, D, E)
  if (
    q.includes("5 block") ||
    q.includes("five block") ||
    q.includes("all block") ||
    q.includes("paanch block") ||
    q.includes("5 ब्लॉक") ||
    q.includes("पांच ब्लॉक") ||
    q.includes("sab block") ||
    q.includes("blocks") ||
    (q.includes("block") && (q.includes("kitne") || q.includes("kya hai") || q.includes("batao") || q.includes("kahan")))
  ) {
    return `🏛️ **SRGI कैंपस के सभी 5 प्रमुख ब्लॉक्स (Complete 5 Blocks Guide):**
1. **Block A (प्रशासनिक एवं केंद्रीय ब्लॉक):**
   • ग्राउंड फ्लोर: सेमिनार हॉल, प्ले एरिया, बेसिक साइंस लैब्स।
   • फर्स्ट फ्लोर: एडमिशन सेल, रजिस्ट्रार, एकाउंट्स, डायरेक्टर व चेयरमैन ऑफिस।
   • सेकंड फ्लोर: सेंट्रल लाइब्रेरी (हजारों किताबों व शांत रीडिंग हॉल के साथ)।
2. **Block B (मैनेजमेंट ब्लॉक):**
   • एमबीए (MBA) डिपार्टमेंट, मैनेजमेंट सेमिनार हॉल्स व लेक्चर रूम्स।
3. **Block C (इंजीनियरिंग का मुख्य एकेडमिक ब्लॉक):**
   • ग्राउंड फ्लोर: कंप्यूटर लैब्स व बायोटेक विंग।
   • 1st फ्लोर: HOD ऑफिस, EN, IT, EC, Data Science, AIML क्लासेस।
   • 2nd फ्लोर: CSE Section A, Section B, Section C, Bio-Tech, ME, Agriculture क्लासेस।
   • 3rd फ्लोर: SRIMT क्लासेस व एडवांस्ड लैब्स।
   • वॉशरूम: हर फ्लोर पर दाईं सीढ़ियों के पास।
4. **Block D (गर्ल्स हॉस्टल एवं स्वास्थ्य केंद्र):**
   • छात्राओं के लिए सुरक्षित हॉस्टल (24x7 गार्ड व वार्डन)।
   • विशेष: Block D के ठीक पीछे कैंपस का **Store Room** और **Medical Dispensary (दवाइयाँ व फर्स्ट एड)** स्थित है!
5. **Block E (सीनियर क्लासेस):**
   • 2nd Year, 3rd Year और Final 4th Year सीनियर इंजीनियरिंग छात्रों की कक्षाएं।`;
  }

  // Specific Block A
  if (q.includes("block a") || q.includes("ब्लॉक ए") || q.includes("ब्लॉक a") || q.includes("main block")) {
    return `🏛️ **Block A (Main Administration Block):**
• **Ground Floor:** सेमिनार हॉल (Seminar Hall), प्ले एरिया, केमिस्ट्री लैब, मैकेनिक्स लैब, ट्रांसपोर्ट ऑफिस।
• **1st Floor:** एडमिशन सेल, रजिस्ट्रार ऑफिस, एकाउंट ऑफिस, डायरेक्टर ऑफिस, और चेयरमैन ऑफिस।
• **2nd Floor:** भव्य सेंट्रल लाइब्रेरी (Central Library) जहाँ शांतिपूर्वक अध्ययन करने की व्यवस्था है।`;
  }

  // Specific Block B
  if (q.includes("block b") || q.includes("ब्लॉक बी") || q.includes("ब्लॉक b") || q.includes("mba block")) {
    return `🏢 **Block B (MBA & Management Studies):**
• यह ब्लॉक पूरी तरह से एमबीए (MBA) के विद्यार्थियों के लिए समर्पित है।
• यहाँ मैनेजमेंट क्लासरूम्स, कॉन्फ्रेंस रूम्स और बिजनेस सेमिनार रूम्स स्थित हैं।`;
  }

  // Specific Block C
  if (q.includes("block c") || q.includes("ब्लॉक सी") || q.includes("ब्लॉक c")) {
    return `🏢 **Block C (इंजीनियरिंग एकेडमिक हब):**
• **Ground Floor:** सेंट्रल कंप्यूटर लैब्स, बायोटेक सेक्शन, प्रोग्रामिंग लैब।
• **1st Floor:** CSE HOD ऑफिस, EN (इलेक्ट्रिकल), IT, EC (इलेक्ट्रॉनिक्स), DS (डेटा साइंस), AIML व AI।
• **2nd Floor:** CSE Section A, CSE Section B, CSE Section C, Bio-Tech, Mechanical, Agriculture।
• **3rd Floor:** SRIMT डिपार्टमेंट व उच्च स्तरीय लैब्स।
• **वॉशरूम:** हर फ्लोर पर दाईं (Right) सीढ़ियों के पास स्थित हैं।`;
  }

  // Specific Block D (Girls Hostel & Medical)
  if (
    q.includes("block d") ||
    q.includes("ब्लॉक डी") ||
    q.includes("ब्लॉक d") ||
    q.includes("girls hostel") ||
    q.includes("girl hostel") ||
    q.includes("लड़कियों का हॉस्टल") ||
    q.includes("गर्ल्स हॉस्टल")
  ) {
    return `🏢 **Block D (Girls Hostel):**
• **उद्देश्य:** छात्राओं के लिए पूर्ण सुरक्षित आवासीय ब्लॉक (24 घंटे महिला वार्डन, सुरक्षा गार्ड्स, मेस)।
• **जरूरी लोकेशन:** Block D के ठीक पीछे कैंपस का **Store Room** और **Medical Dispensary (दवाइयाँ व प्राथमिक चिकित्सा)** स्थित है। आपातकाल में तुरंत सहायता मिलती है।`;
  }

  // Specific Block E (Seniors)
  if (
    q.includes("block e") ||
    q.includes("ब्लॉक ई") ||
    q.includes("ब्लॉक e") ||
    q.includes("senior") ||
    q.includes("सीनियर") ||
    q.includes("2nd year") ||
    q.includes("3rd year") ||
    q.includes("4th year")
  ) {
    return `🏛️ **Block E (Senior Students Block):**
• यहाँ बी.टेक सेकंड ईयर (2nd Year), थर्ड ईयर (3rd Year) और फाइनल फोर्थ ईयर (4th Year) के सीनियर छात्रों की कक्षाएं लगती हैं।`;
  }

  // 5. Boys Hostel
  if (
    q.includes("boys hostel") ||
    q.includes("boy hostel") ||
    q.includes("लड़कों का हॉस्टल") ||
    q.includes("बॉयज हॉस्टल")
  ) {
    return `🛏️ **Boys Hostel (बॉयज हॉस्टल):**
• **लोकेशन:** कॉलेज के मुख्य द्वार (Main Gate 1) से अंदर आते ही सीधे लगभग 300 मीटर की दूरी पर कैंपस के अंदर स्थित है।
• यहाँ वाई-फाई, डाइनिंग हॉल, कॉमन रूम और स्पोर्ट्स फैसिलिटी उपलब्ध है।`;
  }

  // 6. Medical Dispensary, Medicines, First Aid, Store Room
  if (
    q.includes("medicine") ||
    q.includes("medical") ||
    q.includes("doctor") ||
    q.includes("first aid") ||
    q.includes("dispensary") ||
    q.includes("store room") ||
    q.includes("store") ||
    q.includes("दवा") ||
    q.includes("डॉक्टर") ||
    q.includes("इलाज") ||
    q.includes("स्टोर")
  ) {
    return `💊 **कैंपस मेडिकल डिस्पेंसरी व स्टोर रूम:**
• **सटीक लोकेशन:** यह **Block D (Girls Hostel)** के ठीक पीछे स्थित है।
• यहाँ प्राथमिक चिकित्सा (First Aid), आवश्यक जीवनरक्षक दवाइयाँ, नर्स/डॉक्टर सुविधा और कॉलेज स्टोर रूम का सामान उपलब्ध रहता है।`;
  }

  // 7. Central Library
  if (
    q.includes("library") ||
    q.includes("central library") ||
    q.includes("book") ||
    q.includes("किताब") ||
    q.includes("लाइब्रेरी") ||
    q.includes("पुस्तकालय") ||
    q.includes("पढ़ने की जगह")
  ) {
    return `📚 **SRGI Central Library (केंद्रीय पुस्तकालय):**
• **लोकेशन:** Block A के **2nd Floor (दूसरे तल)** पर स्थित है।
• **सुविधाएँ:** हजारों राष्ट्रीय व अंतरराष्ट्रीय इंजीनियरिंग एवं मैनेजमेंट पुस्तकें, डिजिटल ई-जर्नल्स, प्रोजेक्ट थीसिस और पूर्णतः वातानुकूलित शांत स्टडी हॉल।
• **समय:** कॉलेज समय में सभी विद्यार्थियों के लिए खुला रहता है।`;
  }

  // 8. Seminar Hall
  if (
    q.includes("seminar hall") ||
    q.includes("seminar") ||
    q.includes("auditorium") ||
    q.includes("सेमिनार") ||
    q.includes("ऑडिटोरियम") ||
    q.includes("hall")
  ) {
    return `🎤 **Seminar Hall (सेमिनार हॉल):**
• **लोकेशन:** Block A के Ground Floor पर स्थित है।
• **कैफेटेरिया से रास्ता:** सेंट्रल कैफेटेरिया से बिलकुल सीधे 20 मीटर जाने पर मुख्य प्रवेश द्वार है।
• **Block B से रास्ता:** Block B से 20 मीटर बाएं (left) जाने के बाद 20 मीटर दाएं (right) मुड़ें।
• यहाँ कॉलेज के सभी सेमिनार, वर्कशॉप, गेस्ट लेक्चर्स और तकनीकी कार्यक्रम आयोजित होते हैं।`;
  }

  // 9. Cafeteria and Gate 2 Cafes
  if (
    q.includes("cafe") ||
    q.includes("canteen") ||
    q.includes("cafeteria") ||
    q.includes("food") ||
    q.includes("eat") ||
    q.includes("khana") ||
    q.includes("gate 2") ||
    q.includes("कैंटीन") ||
    q.includes("कैफे") ||
    q.includes("चाय") ||
    q.includes("खाना")
  ) {
    return `☕ **कैफेटेरिया व कैफे सुविधा:**
1. **Central Cafeteria:** कैंपस के बीचों-बीच स्थित है जहाँ लंच ब्रेक (12:10 - 01:00 PM) में गरमा-गरम खाना व स्नैक्स मिलते हैं। (यहाँ से ठीक 20 मीटर पर सेमिनार हॉल है)।
2. **Gate 2 Cafes:** कॉलेज के गेट नंबर 2 पर विद्यार्थियों के पसंदीदा टी-पॉइंट्स, फास्ट फूड और स्नैक्स कैफे मौजूद हैं।`;
  }

  // 10. Faculties & Teachers (with contact numbers)
  if (
    q.includes("faculty") ||
    q.includes("teacher") ||
    q.includes("sir") ||
    q.includes("ma'am") ||
    q.includes("professor") ||
    q.includes("hod") ||
    q.includes("prashant") ||
    q.includes("brijesh") ||
    q.includes("santosh") ||
    q.includes("preety") ||
    q.includes("manish") ||
    q.includes("laxmikant") ||
    q.includes("maneesh") ||
    q.includes("फोन नंबर") ||
    q.includes("शिक्षक") ||
    q.includes("फैकल्टी")
  ) {
    return `👨‍🏫 **CSE Section A फैकल्टी लिस्ट व आधिकारिक फोन नंबर:**
• **प्रशांत बाजपेयी सर (HOD - CSE):** 7617000030 (Office: Block C, 1st व 2nd Floor)
• **बृजेश सिंह सर (Language Lab / PCTW):** 7617000079
• **संतोष कुमार माथुर सर (Electronics / EC):** 9455500244
• **प्रीति चौधरी मैम (Personality Development / PD):** 7988499219
• **मनीष कुमार मिश्रा सर (Engineering Chemistry):** 9793000017
• **लक्ष्मीकांत सर (Engineering Mathematics):** 9451910027
• **मनीष मिश्रा सर (Mechanical Engineering / ME):** 9793000055`;
  }

  // 11. Campus Videos & Walkthroughs
  if (
    q.includes("video") ||
    q.includes("walkthrough") ||
    q.includes("route video") ||
    q.includes("कैमरा") ||
    q.includes("वीडियो") ||
    q.includes("रास्ते का वीडियो") ||
    q.includes("देखना है")
  ) {
    return `🎥 **SRGI के 20 ऑफिशियल कैंपस वीडियो वॉकथ्रू:**
1. **गेट 1 से मेन कैंपस प्रवेश**
2. **मेन गेट से ब्लॉक C मेन गेट तक रास्ता**
3. **ब्लॉक C मुख्य प्रवेश द्वार व पोर्च**
4. **ब्लॉक C बाईं सीढ़ियों से डायरेक्ट एंट्री**
5. **ब्लॉक C ग्राउंड से 2nd फ्लोर (बाएं सीढ़ियों से)**
6. **ब्लॉक C 2nd फ्लोर (CSE Section A, B, C व HOD ऑफिस)**
7. **ब्लॉक C 2nd फ्लोर राइट साइड विंग**
8. **ब्लॉक C 2nd फ्लोर से ग्राउंड फ्लोर नीचे उतरना**
9. **ब्लॉक C फ्लोर 2 से फ्लोर 3 (3rd Floor) सीढ़ियों का रास्ता**
10. **ब्लॉक C फ्लोर 1 से फ्लोर 3 (दाएं सीढ़ियों से)**
11. **ब्लॉक C से सभी ब्लॉक्स का दिशा निर्देश (C से B, A, D, E)**
12. **ब्लॉक C फ्लोर 2 जानकारी (दाएं सीढ़ियों से)**
13. **ब्लॉक C ग्राउंड फ्लोर विस्तृत कॉरिडोर वॉकथ्रू**
14. **ब्लॉक C 2nd फ्लोर कॉरिडोर व लैब्स टूर**
15. **ब्लॉक C CSE एडवांस्ड / स्मार्ट क्लासरूम (ग्राउंड फ्लोर)**
16. **ब्लॉक C 1st फ्लोर कॉरिडोर व फैकल्टी केबिन**
17. **ब्लॉक C 3rd फ्लोर व SRIMT विंग**
18. **ब्लॉक C ग्राउंड फ्लोर मुख्य प्रवेश व स्टेप्स**
19. **ब्लॉक C 2nd फ्लोर पैनोरमिक विंग वॉक**
20. **SRIMT मुख्य प्रवेश द्वार व पाथवे**

👉 यह सभी 20 वीडियो आप होम स्क्रीन के 'Campus Route Videos' प्लेयर और 'Camera Detector & Videos' में सीधे प्ले कर सकते हैं!`;
  }

  // 12. College History, Chairman, Location, Address
  if (
    q.includes("history") ||
    q.includes("established") ||
    q.includes("founder") ||
    q.includes("chairman") ||
    q.includes("pawan") ||
    q.includes("college") ||
    q.includes("srgi") ||
    q.includes("lucknow") ||
    q.includes("area") ||
    q.includes("address") ||
    q.includes("कॉलेज") ||
    q.includes("इतिहास") ||
    q.includes("चेयरमैन") ||
    q.includes("कहाँ है") ||
    q.includes("स्थापना")
  ) {
    return `🎓 **SR Group of Institutions (SRGI), लखनऊ का संपूर्ण परिचय:**
• **स्थापना:** वर्ष 2009 में माननीय चेयरमैन श्री पवन सिंह चौहान जी द्वारा स्व. सूबेदार सिंह और स्व. राज देवी जी की स्मृति में।
• **कैंपस विस्तार:** 65 एकड़ का विशाल एवं हरा-भरा आधुनिक कैंपस।
• **पता:** NH-24, सीतापुर रोड, बख्शी का तालाब (BKT), लखनऊ, उत्तर प्रदेश 226201 (सेवा हॉस्पिटल के पास)।
• **दूरी:** चारबाग रेलवे स्टेशन से 25 किमी, अमौसी एयरपोर्ट से 35 किमी, इंजीनियरिंग कॉलेज चौराहा से 18 किमी।
• **कोर्सेज:** B.Tech (10+ ब्रांचेज: CSE, AIML, Data Science, IT, EC, EN, Bio-Tech, ME, Civil, Agri), MBA, Pharmacy और Medical Sciences।`;
  }

  // 13. Washrooms / Toilets
  if (q.includes("washroom") || q.includes("toilet") || q.includes("restroom") || q.includes("वॉशरूम") || q.includes("टॉयलेट") || q.includes("शौचालय")) {
    return `🚻 **वॉशरूम एवं शौचालय सुविधा:**
• **Block C:** प्रत्येक फ्लोर पर दाईं (Right) सीढ़ियों के ठीक सामने स्वच्छ वॉशरूम स्थित हैं।
• **Block A:** ग्राउंड व फर्स्ट फ्लोर के दोनों विंग्स में शौचालय उपलब्ध हैं।`;
  }

  // 14. Suggestion Box & Feedback
  if (q.includes("suggestion") || q.includes("feedback") || q.includes("message") || q.includes("complaint") || q.includes("शिकायत") || q.includes("सुझाव") || q.includes("मैसेज")) {
    return `✍️ **सुझाव एवं संदेश (Send Us a Message):**
• आप मेन्यू बार में दिए गए **'Send Suggestion / Message'** ऑप्शन पर जाकर कॉलेज एडमिन्स व फैकल्टी को सीधे अपना संदेश, फीडबैक या सुझाव भेज सकते हैं!`;
  }

  // 15. Holidays
  if (q.includes("holiday") || q.includes("chhutti") || q.includes("छुट्टी") || q.includes("अवकाश")) {
    return `📅 **SRGI प्रमुख अकादमिक छुट्टियाँ 2026:**
• 26 Jan: गणतंत्र दिवस
• 15 Feb: महाशिवरात्रि
• 3-5 Mar: होली अवकाश
• 20 Mar: ईद-उल-फ़ित्र
• 27 Mar: राम नवमी
• 15 Aug: स्वतंत्रता दिवस
• 28 Aug: रक्षा बंधन
• 4 Sep: जन्माष्टमी
• 2 Oct: गाँधी जयंती
• 19-20 Oct: दशहरा
• 8-11 Nov: दिवाली अवकाश। पूरा कैलेंडर मेन्यू के 'Holidays' में देखें!`;
  }

  // 16. Comprehensive fallback covering EVERYTHING instead of just Seminar Hall!
  return `🏛️ **SRGI कैंपस गाइड — मुख्य जानकारी:**
• **CSE Section A:** Block C के 2nd Floor पर (बाएं सीढ़ियों से ऊपर जाकर दाईं ओर मुड़ें)।
• **क्लास टाइमिंग:** सुबह 09:00 AM से शाम 04:30 PM (वॉटर ब्रेक: 11:00 AM, 2:10 PM, 3:20 PM | लंच: 12:10 - 1:00 PM)।
• **5 ब्लॉक्स:** Block A (Admin, Library, Seminar Hall), Block B (MBA), Block C (B.Tech Engg, Labs), Block D (Girls Hostel + Medical Store), Block E (Senior Classes)।
• **सेंट्रल लाइब्रेरी:** Block A के 2nd Floor पर।
• **सेमिनार हॉल:** Block A Ground Floor पर (Cafeteria से 20m सीधे)।
• **एडमिन टीम:** Er. सुमन कुमार (बिहार), Er. विवेक साहनी (कुशीनगर), Er. प्रांजल मौर्या (वाराणसी), Er. रोशन कुमार भारती (मऊ), Er. रिजवान खान (महराजगंज), Er. अविनाश प्रजापति (महराजगंज), Er. विवेक सरोज (प्रतापगंज)।
• **8 कैंपस वीडियो वॉकथ्रू:** होमपेज व Camera Detector में लाइव उपलब्ध हैं।

आप मुझसे किसी भी विशेष जगह, फैकल्टी, या टाइम टेबल के बारे में बेझिझक पूछ सकते हैं!`;
}
