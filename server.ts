import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy init for Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are the official Smart Campus AI Navigator for SR GROUP OF INSTITUTION, Lucknow (Website: SR GROUP OF INSTITUTION / My Campus Info).
Your identity is "SRGI Saathi" (एसआरजीआई साथी), a warm, polite, highly knowledgeable, and helpful female campus assistant.

CRITICAL LANGUAGE & CONVERSATION RULES:
1. ALWAYS converse in natural, respectful, and friendly Hindi (or natural Hinglish that is effortless to understand for Indian college students and sounds beautiful and clear when spoken aloud by the browser's Text-to-Speech / Web Speech audio engine).
2. Keep spoken sentences clean, melodic, and conversational (e.g., "नमस्ते! मैं आपकी एसआरजीआई साथी हूँ।", "आप सीधे जाएँ...", "ब्लॉक A के ग्राउंड फ्लोर पर स्थित है।"). Avoid excessive stars, hashes, or complex formatting that sounds robotic or broken when read by voice synthesis.
3. Greet users with warm Indian hospitality ("नमस्ते! आप SRGI कैंपस, रास्ते, वीडियो नेविगेशन, फैकल्टी या एडमिन्स के बारे में क्या जानना चाहते हैं?").

CAMPUS VIDEO NAVIGATION ROUTES (कैंपस वीडियो वॉकथ्रू गाइड):
SRGI has 23 official walking route and floor tour videos uploaded for live camera & place navigation:
1. Central Campus Walkthrough (https://res.cloudinary.com/ehqczar2/video/upload/v1789356271/q7cdovbf0i2vejtx39ty.mp4)
2. College Exit to Main Gate (https://res.cloudinary.com/ehqczar2/video/upload/v1789356297/unyd2mbj8legxeimf11f.mp4)
3. Way to Block A Route (https://res.cloudinary.com/ehqczar2/video/upload/v1789356250/bxrh4ck0xjtvmuwyxut7.mp4)
4. Main Campus Entry from Gate 1 (https://res.cloudinary.com/ehqczar2/video/upload/v1789271177/emxylyq1ejstsdxbg2qc.mp4)
5. Main Gate to C Block Main Gate Walk (https://res.cloudinary.com/ehqczar2/video/upload/v1789272307/ozmtpjniqnyidkqqjcok.mp4)
6. C Block Main Entry & Porch (https://res.cloudinary.com/ehqczar2/video/upload/v1789272080/esnvmlcobzajhos26dwf.mp4)
7. C Block Entry from Left Stairs Gate (https://res.cloudinary.com/ehqczar2/video/upload/v1789271146/yq6k49tfe4ykwbvdpmvi.mp4)
8. C-Block Ground Floor to 2nd Floor from Left Stairs (https://res.cloudinary.com/ehqczar2/video/upload/v1789271307/u0vrk0f8ez7ak5xt1vat.mp4)
9. C Block 2nd Floor Corridor & CSE Sections A, B, C & HOD Office (https://res.cloudinary.com/ehqczar2/video/upload/v1789157385/yo47y7evb1aahjqfum5h.mp4)
10. Block C Floor 2 Right Side Wing (https://res.cloudinary.com/ehqczar2/video/upload/v1789272411/xibjgmpde8dqaoubemha.mp4)
11. Second Floor to Ground Floor C-Block Descent (https://res.cloudinary.com/ehqczar2/video/upload/v1789272318/aerqkwomnchrjnzpxcaj.mp4)
12. Block C Floor 2 to Floor 3 Stairway Walk (https://res.cloudinary.com/ehqczar2/video/upload/v1789320471/kneing9qirxyvn7y9lu3.mp4)
13. Block C Floor 1 to Floor 3 via Right Stairs (https://res.cloudinary.com/ehqczar2/video/upload/v1789320456/iamzqnmtatlhtrxwgeh1.mp4)
14. Block C to All Blocks Route Directions - C to B, C to A, C to D, C to E (https://res.cloudinary.com/ehqczar2/video/upload/v1789320441/mvvogthvndpmgan0afdn.mp4)
15. Block C Floor 2 Information & Layout from Right Stair (https://res.cloudinary.com/ehqczar2/video/upload/v1789320313/fggnlkmxk6h1smnja6zz.mp4)
16. Block C Ground Floor Central Corridor Walk (https://res.cloudinary.com/ehqczar2/video/upload/v1789319660/yyonvtsyezduxrqsq1hv.mp4)
17. Block C 2nd Floor Corridor & Labs Tour (https://res.cloudinary.com/ehqczar2/video/upload/v1789319576/fg0ep1brqx3cranqmx06.mp4)
18. Block C CSE Advanced / Smart Classroom Ground Floor (https://res.cloudinary.com/ehqczar2/video/upload/v1789319556/di2xfzspmytrvnbxogxr.mp4)
19. Block C First Floor Corridors & Faculty Cabins (https://res.cloudinary.com/ehqczar2/video/upload/v1789319425/ubxxjgjarwvhnmanskvm.mp4)
20. Block C Third Floor & SRIMT Wing (https://res.cloudinary.com/ehqczar2/video/upload/v1789318308/nsw6ga9br1muloyiathe.mp4)
21. Block C Ground Floor Entrance & Steps Overview (https://res.cloudinary.com/ehqczar2/video/upload/v1789318296/jqpotsuixaoh3gmyt8kb.mp4)
22. Block C Second Floor Panoramic Wing Walk (https://res.cloudinary.com/ehqczar2/video/upload/v1789318280/xtq6yd2y8cc7srjgbp5a.mp4)
23. SRIMT Campus Entrance Gate Walk (https://res.cloudinary.com/ehqczar2/video/upload/v1789315009/xvx1thceficj3tagtvsu.mp4)
When users ask how to reach these places or ask for a video, mention that all 23 video guides are available on the dedicated "Campus Videos" section and in the "Camera Detector & Videos" section!

OFFICIAL ADMINS & STUDENT LEADERSHIP TEAM (all have Er. title, cities instead of phone numbers, editing is locked):
1. Er. SUMAN KUMAR (Leader - B.Tech CSE A) | City: Begusarai, Bihar | Email: suman@srgi.ac.in, imsumanpoddar12@gmail.com | Role: Lead Developer & System Architect.
2. Er. VIVEK SAHANI (Co-Leader - B.Tech CSE A) | City: Kushinagar, Uttar Pradesh | Email: vivek@srgi.ac.in | Role: Co-Leader & Campus Data Head.
3. Er. PRANJAL MAURYA (Core Member) | City: Varanasi, Uttar Pradesh | Email: pranjalmaurya1120@gmail.com | Role: System Specialist & Routing Lead.
4. Er. ROSHAN KUMAR BHARTI (Core Member) | City: Mau, Uttar Pradesh | Email: roshan@srgi.ac.in | Role: Security & Content Lead.
5. Er. RIJAWAN KHAN (Core Member) | City: Maharajganj, Uttar Pradesh | Email: rijawan5657@gmail.com | Role: Network & Media Manager.
6. Er. AVINASH PRAJAPATI (Core Member) | City: Maharajganj, Uttar Pradesh | Email: avinash@srgi.ac.in | Role: Media & Gallery Specialist.
7. Er. VIVEK SAROJ (Core Member) | City: Pratapgarh, Uttar Pradesh | Email: viveksaroj@srgi.ac.in | Role: UI/UX & Operations.

FACULTIES & DESIGNATIONS (CSE Section A & Leadership):
- Prashant Bajpai Sir (HOD CSE): Office in Block C 1st & 2nd Floor
- Rajeev Kumar Mishra Sir: Deputy HOD CSE & Language Lab / PCTW
- Laxmikant Sir: Quardinator & Engineering Mathematics
- Brijesh Singh Sir: Professional Communication & Technical Writing (PCTW)
- Santosh Kumar Mathur Sir: Electronics & Communication (EC)
- Preety Chaudhary Ma'am: Personality Development (PD)
- Manish Kumar Mishra Sir: Engineering Chemistry (CHEM)
- Maneesh Mishra Sir: Mechanical Engineering (ME)

PRIVACY DIRECTIVE: DO NOT output phone numbers of faculties in the chatbox responses. If users ask for phone numbers, inform them respectfully to check the official "Faculties & Schedule" section of the website.

CSE SECTION A TIMINGS:
- Mon-Sat: 09:00 AM to 04:30 PM
- Water Breaks: 11:00-11:10 AM | 02:10-02:20 PM | 03:20-03:30 PM
- Lunch Break: 12:10 PM - 01:00 PM

CAMPUS OVERVIEW & BUILDINGS:
- Location of SR GROUP OF INSTITUTION Lucknow: NH-24, Sitapur Road, Bakshi Ka Talab (BKT), Lucknow, Uttar Pradesh 226201 (Near Sewa Hospital).
- Distance: Approx 25 km from Lucknow Charbagh Railway Station, 35 km from Amausi Airport, 18 km from Engineering College Chauraha.
- Leadership: Chairman Shri Pawan Singh Chauhan, Vice Chairman Shri Piyush Singh Chauhan.
- Campus History: 65-acre lush green campus, founded in 2009 in tribute to Late Subedar Singh & Late Raj Devi.
- 10+ branches: B.Tech (CSE, IT, EC, EN, AIML, DS, Bio-Tech, ME, Agriculture), MBA, Pharmacy, Medical Sciences.
- Seminar Hall (Special Directions): Ground Floor of Block A. From Central Cafeteria: Walk straight 20 metres. Coming from Block B: Walk 20 metres left, then take a right turn and walk 20 metres.
- Block A: Ground Floor has Seminar Hall, Play Area, Labs; 1st Floor has Admission Cell, Registrar, Director & Chairman Offices; 2nd Floor has Central Library (thousands of books & digital reading zone).
- Block B: MBA Students Block (Management classes & seminar rooms).
- Block C: Ground Floor (Computer Labs, Bio-Tech), 1st Floor (HOD Office, EN, IT, EC, DS, AIML), 2nd Floor (HOD Office, CSE Section A, Section B, Section C, Bio-Tech, ME, Agri), 3rd Floor (SRIMT Classes). Washrooms are located near the right staircase on every floor.
- Block D: Girls Hostel (High security). Note: Directly behind Block D is the Campus Store Room & Medical Dispensary with emergency medicines & first-aid!
- Block E: Senior Engineering Classes (2nd, 3rd, 4th Year).
- Boys Hostel: Walk 300 metres straight inside from the Main Gate.
- Gate 2: Popular student cafes and snack food stalls.
- Central Cafeteria: Central hub of campus, 20m from Seminar Hall.
- Suggestion / Message Box: Students can submit feedback or message the team using the "Send Us a Message" tab in the navigation menu.

Always deliver warm, polite, and accurate directions in Hindi!`;

// Helper for model calling with retry and fallback
async function generateGeminiContentWithFallback(
  contents: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<string> {
  const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const ai = getGenAI();
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        const isHighDemandOrTransient =
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand") ||
          msg.includes("429") ||
          msg.includes("RESOURCE_EXHAUSTED");

        if (isHighDemandOrTransient && attempt === 1) {
          // Quick backoff before retry
          await new Promise((res) => setTimeout(res, 800));
          continue;
        }
        // Move to the fallback model
        break;
      }
    }
  }

  throw lastError;
}

// Fallback campus knowledge answer generator when external AI model has high demand
function getCampusOfflineAnswer(queryRaw: string): string {
  const q = queryRaw.toLowerCase().trim();

  // 1. CSE Section A and classrooms
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
    return "💻 **CSE Section A (कंप्यूटर साइंस इंजीनियरिंग - सेक्शन A):**\n• **लोकेशन:** Block C के **2nd Floor (दूसरे तल)** पर स्थित है।\n• **पहुँचने का सटीक रास्ता:** Block C के मुख्य द्वार (या बाएं सीढ़ियों वाले गेट) से प्रवेश करें और बाईं (Left) सीढ़ियों से सीधे 2nd Floor पर जाएँ। सीढ़ियों से निकलते ही दाईं ओर मुड़ें: आगे HOD Office, Bio-Tech, Mechanical, Agriculture, CSE Section C और Section B आते हैं। इनके आगे बढ़ते ही बाईं सीढ़ियों के नजदीक ही आपका **CSE Section A** क्लासरूम मिल जाएगा!\n• **सुविधाएँ:** स्मार्ट डिजिटल बोर्ड, मल्टीमीडिया प्रोजेक्टर और हाई-स्पीड इंटरनेट।\n• **विभागाध्यक्ष:** CSE HOD आदरणीय प्रशांत बाजपेयी सर (Block C 1st व 2nd Floor)।";
  }

  // 2. Schedule, Timetable, Timings, Breaks
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
    q.includes("कब होती है")
  ) {
    return "⏰ **CSE Section A कॉलेज शेड्यूल व टाइमिंग:**\n• **क्लास टाइमिंग:** सुबह 09:00 AM से शाम 04:30 PM (सोमवार से शनिवार)।\n• **वॉटर ब्रेक्स (Water Breaks):**\n  1. पहला ब्रेक: सुबह 11:00 AM से 11:10 AM (10 मिनट)\n  2. दूसरा ब्रेक: दोपहर 02:10 PM से 02:20 PM (10 मिनट)\n  3. तीसरा ब्रेक: शाम 03:20 PM से 03:30 PM (10 मिनट)\n• **लंच ब्रेक (Lunch Break):** दोपहर 12:10 PM से 01:00 PM (50 मिनट का भोजन अवकाश सेंट्रल कैफेटेरिया व गेट 2 कैफे पर)।\n• **पीरियड्स:** रोजाना 6 लेक्चर्स व प्रैक्टिकल लैब्स (Chemistry, Electronics, Mechanics, Language Lab) आयोजित होती हैं।";
  }

  // 3. Admin & Leadership Team (All Er., Cities, Updated Emails)
  if (
    q.includes("team") ||
    q.includes("creator") ||
    q.includes("admin") ||
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
    return "👥 **SRGI एडमिन व क्रिएटर टीम (सभी इंजीनियर्स - Official Records):**\n1. **Er. सुमन कुमार (Leader - B.Tech CSE A)** - बेगूसराय, बिहार (Email: imsumanpoddar12@gmail.com / suman@srgi.ac.in)\n2. **Er. विवेक साहनी (Co-Leader - B.Tech CSE A)** - कुशीनगर, उत्तर प्रदेश (Email: vivek@srgi.ac.in)\n3. **Er. प्रांजल मौर्या (Core Member - B.Tech CSE A)** - वाराणसी, उत्तर प्रदेश (Email: pranjalmaurya1120@gmail.com)\n4. **Er. रोशन कुमार भारती (Core Member - B.Tech CSE A)** - मऊ, उत्तर प्रदेश (Email: roshan@srgi.ac.in)\n5. **Er. रिजवान खान (Core Member - B.Tech CSE A)** - महराजगंज, उत्तर प्रदेश (Email: rijawan5657@gmail.com)\n6. **Er. अविनाश प्रजापति (Core Member - B.Tech CSE A)** - महराजगंज, उत्तर प्रदेश (Email: avinash@srgi.ac.in)\n7. **Er. विवेक सरोज (Core Member - B.Tech CSE A)** - प्रतापगढ़, उत्तर प्रदेश (Email: viveksaroj@srgi.ac.in)\n\n🔒 सभी एडमिन्स की प्रोफाइल आधिकारिक व सुरक्षित है और फोन नंबर की जगह उनके गृह नगर प्रदर्शित हैं।";
  }

  // 4. All 5 Blocks Overview
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
    return "🏛️ **SRGI कैंपस के सभी 5 प्रमुख ब्लॉक्स (Complete 5 Blocks Guide):**\n1. **Block A (प्रशासनिक एवं मुख्य ब्लॉक):** ग्राउंड पर सेमिनार हॉल व लैब्स; 1st Floor पर एडमिशन, रजिस्ट्रार, डायरेक्टर व चेयरमैन ऑफिस; 2nd Floor पर सेंट्रल लाइब्रेरी।\n2. **Block B (मैनेजमेंट ब्लॉक):** एमबीए (MBA) डिपार्टमेंट, मैनेजमेंट सेमिनार हॉल्स व लेक्चर रूम्स।\n3. **Block C (इंजीनियरिंग कोर एकेडमिक ब्लॉक):** Ground Floor (कंप्यूटर व बायोटेक लैब्स), 1st Floor (HOD ऑफिस, EN, IT, EC, DS, AIML), 2nd Floor (CSE Section A, Section B, Section C, Bio-Tech, ME, Agriculture), 3rd Floor (SRIMT क्लासेस)।\n4. **Block D (गर्ल्स हॉस्टल एवं स्वास्थ्य केंद्र):** छात्राओं के लिए सुरक्षित हॉस्टल। इसके ठीक पीछे कैंपस का **Store Room** और **Medical Dispensary (दवाइयाँ व First-Aid)** स्थित है।\n5. **Block E (सीनियर क्लासेस):** 2nd Year, 3rd Year और Final 4th Year सीनियर छात्रों की कक्षाएं।";
  }

  // Block A
  if (q.includes("block a") || q.includes("ब्लॉक ए") || q.includes("ब्लॉक a") || q.includes("main block")) {
    return "🏛️ **Block A (Main Administration Block):**\n• **Ground Floor:** सेमिनार हॉल (Seminar Hall), प्ले एरिया, केमिस्ट्री लैब, मैकेनिक्स लैब, ट्रांसपोर्ट ऑफिस।\n• **1st Floor:** एडमिशन सेल, रजिस्ट्रार ऑफिस, एकाउंट ऑफिस, डायरेक्टर ऑफिस, और चेयरमैन ऑफिस।\n• **2nd Floor:** भव्य सेंट्रल लाइब्रेरी (Central Library) जहाँ शांतिपूर्वक अध्ययन करने की व्यवस्था है।";
  }

  // Block B
  if (q.includes("block b") || q.includes("ब्लॉक बी") || q.includes("ब्लॉक b") || q.includes("mba block")) {
    return "🏢 **Block B (MBA & Management Studies):**\n• यह ब्लॉक पूरी तरह से एमबीए (MBA) के विद्यार्थियों के लिए समर्पित है।\n• यहाँ मैनेजमेंट क्लासरूम्स, कॉन्फ्रेंस रूम्स और बिजनेस सेमिनार रूम्स स्थित हैं।";
  }

  // Block C
  if (q.includes("block c") || q.includes("ब्लॉक सी") || q.includes("ब्लॉक c")) {
    return "🏢 **Block C (इंजीनियरिंग एकेडमिक हब):**\n• **Ground Floor:** सेंट्रल कंप्यूटर लैब्स, बायोटेक सेक्शन, प्रोग्रामिंग लैब।\n• **1st Floor:** CSE HOD ऑफिस, EN (इलेक्ट्रिकल), IT, EC (इलेक्ट्रॉनिक्स), DS (डेटा साइंस), AIML व AI।\n• **2nd Floor:** CSE Section A, CSE Section B, CSE Section C, Bio-Tech, Mechanical, Agriculture।\n• **3rd Floor:** SRIMT डिपार्टमेंट व उच्च स्तरीय लैब्स।\n• **वॉशरूम:** हर फ्लोर पर दाईं (Right) सीढ़ियों के पास स्थित हैं।";
  }

  // Block D
  if (
    q.includes("block d") ||
    q.includes("ब्लॉक डी") ||
    q.includes("ब्लॉक d") ||
    q.includes("girls hostel") ||
    q.includes("girl hostel") ||
    q.includes("लड़कियों का हॉस्टल") ||
    q.includes("गर्ल्स हॉस्टल")
  ) {
    return "🏢 **Block D (Girls Hostel):**\n• **उद्देश्य:** छात्राओं के लिए पूर्ण सुरक्षित आवासीय ब्लॉक (24 घंटे महिला वार्डन, सुरक्षा गार्ड्स, मेस सुविधा)।\n• **जरूरी लोकेशन:** Block D के ठीक पीछे कैंपस का **Store Room** और **Medical Dispensary (दवाइयाँ व प्राथमिक चिकित्सा)** स्थित है। आपातकाल में तुरंत स्वास्थ्य सहायता मिलती है।";
  }

  // Block E
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
    return "🏛️ **Block E (Senior Students Block):**\n• यहाँ बी.टेक सेकंड ईयर (2nd Year), थर्ड ईयर (3rd Year) और फाइनल फोर्थ ईयर (4th Year) के सीनियर छात्रों की कक्षाएं लगती हैं।";
  }

  // Boys Hostel
  if (
    q.includes("boy") ||
    q.includes("boys hostel") ||
    q.includes("boy hostel") ||
    q.includes("लड़कों का हॉस्टल") ||
    q.includes("बॉयज हॉस्टल")
  ) {
    return "🛏️ **Boys Hostel (बॉयज हॉस्टल):**\n• **लोकेशन:** कॉलेज के मुख्य द्वार (Main Gate 1) से अंदर आते ही सीधे लगभग 300 मीटर की दूरी पर कैंपस के अंदर स्थित है।\n• यहाँ वाई-फाई, डाइनिंग हॉल, कॉमन रूम और स्पोर्ट्स की सुविधा उपलब्ध है।";
  }

  // Central Library
  if (
    q.includes("library") ||
    q.includes("central library") ||
    q.includes("books") ||
    q.includes("किताब") ||
    q.includes("लाइब्रेरी") ||
    q.includes("पुस्तकालय")
  ) {
    return "📚 **Central Library (केंद्रीय पुस्तकालय):**\n• **लोकेशन:** Block A के **2nd Floor (दूसरे तल)** पर स्थित है।\n• **सुविधाएँ:** हजारों राष्ट्रीय व अंतरराष्ट्रीय इंजीनियरिंग एवं मैनेजमेंट पुस्तकें, डिजिटल ई-जर्नल्स, प्रोजेक्ट थीसिस और पूर्णतः वातानुकूलित शांत स्टडी हॉल।";
  }

  // Seminar Hall
  if (q.includes("seminar hall") || q.includes("seminar") || q.includes("सेमिनार") || q.includes("auditorium")) {
    return "🎤 **Seminar Hall (सेमिनार हॉल):**\n• **लोकेशन:** Block A के Ground Floor पर स्थित है।\n• **Cafeteria से रास्ता:** कैफेटेरिया से बिलकुल सीधे 20 metre जाने पर मुख्य प्रवेश द्वार है।\n• **Block B से रास्ता:** Block B से 20 metre left जाने पर, फिर 20 metre right मुड़ें।\n• यहाँ कॉलेज के सभी प्रमुख सेमिनार, वर्कशॉप और तकनीकी कार्यक्रम आयोजित होते हैं।";
  }

  // Faculties
  if (
    q.includes("faculty") ||
    q.includes("teacher") ||
    q.includes("sir") ||
    q.includes("ma'am") ||
    q.includes("professor") ||
    q.includes("phone") ||
    q.includes("शिक्षक") ||
    q.includes("फैकल्टी")
  ) {
    return "👨‍🏫 **CSE Section A फैकल्टी लिस्ट एवं विषय:**\n• **श्री प्रशांत बाजपेयी:** हेड ऑफ डिपार्टमेंट (HOD - CSE) | ऑफिस: Block C (1st व 2nd Floor)\n• **श्री राजीव कुमार मिश्रा:** डिप्टी HOD एवं लैंग्वेज लैब / PCTW फैकल्टी\n• **श्री लक्ष्मीकांत:** क्वार्डिनेटर (Coordinator) एवं इंजीनियरिंग मैथ्स फैकल्टी\n• **श्री बृजेश सिंह:** Professional Communication & Tech Writing (PCTW)\n• **श्री संतोष कुमार माथुर:** Electronics & Communication (EC)\n• **सुश्री प्रीति चौधरी:** Personality Development (PD)\n• **डॉ. मनीष कुमार मिश्रा:** Engineering Chemistry (CHEM)\n• **श्री मनीष मिश्रा:** Mechanical Engineering (ME)\n\n📌 *नोट: सभी फैकल्टीज के ऑफिशियल संपर्क नंबर देखने के लिए वेबसाइट के 'Faculties & Schedule' सेक्शन पर जाएँ।*";
  }

  // Videos & Routes
  if (
    q.includes("video") ||
    q.includes("वीडियो") ||
    q.includes("walkthrough") ||
    q.includes("walk") ||
    q.includes("camera") ||
    q.includes("कैमरा") ||
    q.includes("रास्ते का वीडियो")
  ) {
    return "🎥 **SRGI के 23 ऑफिशियल कैंपस वीडियो वॉकथ्रू:**\n1. **सेंट्रल कैंपस ग्राउंड्स (Central Campus Walkthrough)**\n2. **कॉलेज एग्जिट वॉक (College Exit to Main Gate)**\n3. **वे टू ब्लॉक A (Way to Block A Administration)**\n4. **गेट 1 से मेन कैंपस एंट्री:** Gate 1 से कॉलेज का मुख्य मार्ग।\n5. **मेन गेट से ब्लॉक C मुख्य गेट:** Gate 1 से सीधे Block C तक का वॉकथ्रू।\n6. **ब्लॉक C मुख्य प्रवेश द्वार व लॉबी:** फ्रंट पोर्च और ग्राउंड फ्लोर।\n7. **ब्लॉक C बाईं सीढ़ियों वाले गेट से एंट्री:** Side gate से बाईं सीढ़ी का शॉर्टकट।\n8. **ब्लॉक C ग्राउंड फ्लोर से 2nd फ्लोर (बाएं सीढ़ियों से):** CSE कक्षाओं तक जाने का वीडियो।\n9. **ब्लॉक C 2nd फ्लोर कॉरिडोर:** CSE Section A, B, C, Bio-Tech, Mechanical और HOD Office।\n10. **ब्लॉक C 2nd फ्लोर राइट साइड विंग:** क्लासरूम्स और लैब्स का कॉरिडोर।\n11. **ब्लॉक C 2nd फ्लोर से ग्राउंड फ्लोर नीचे जाने का वीडियो।**\n12. **ब्लॉक C फ्लोर 2 से 3 सीढ़ियों का रास्ता।**\n13. **ब्लॉक C फ्लोर 1 से 3 (दाएं सीढ़ियों से)।**\n14. **ब्लॉक C से सभी ब्लॉक्स का दिशा निर्देश (C से B, A, D, E)।**\n15. **ब्लॉक C फ्लोर 2 जानकारी (दाएं सीढ़ियों से)।**\n16. **ब्लॉक C ग्राउंड फ्लोर विस्तृत कॉरिडोर वॉकथ्रू।**\n17. **ब्लॉक C 2nd फ्लोर कॉरिडोर व लैब्स टूर।**\n18. **ब्लॉक C CSE एडवांस्ड / स्मार्ट क्लासरूम (ग्राउंड फ्लोर)।**\n19. **ब्लॉक C 1st फ्लोर कॉरिडोर व फैकल्टी केबिन।**\n20. **ब्लॉक C 3rd फ्लोर व SRIMT विंग।**\n21. **ब्लॉक C ग्राउंड फ्लोर मुख्य प्रवेश व स्टेप्स।**\n22. **ब्लॉक C 2nd फ्लोर पैनोरमिक विंग वॉक।**\n23. **SRIMT मुख्य प्रवेश द्वार व पाथवे।**\n\n👉 यह सभी 23 वीडियो आप मुख्य इंटरफ़ेस के 'Campus Videos' सेक्शन और 'Camera Detector & Videos' में सीधे देख सकते हैं!";
  }

  // Medical, First Aid, Medicines, Store Room
  if (
    q.includes("medicine") ||
    q.includes("first aid") ||
    q.includes("doctor") ||
    q.includes("medical") ||
    q.includes("store") ||
    q.includes("दवा") ||
    q.includes("इलाज")
  ) {
    return "💊 **कैंपस मेडिकल डिस्पेंसरी व स्टोर रूम:**\n• **सटीक लोकेशन:** यह **Block D (Girls Hostel)** के ठीक पीछे स्थित है।\n• यहाँ प्राथमिक चिकित्सा (First Aid), आवश्यक दवाइयाँ, आपातकालीन स्वास्थ्य सहायता और कॉलेज स्टोर रूम का सामान उपलब्ध रहता है।";
  }

  // Cafeteria & Food
  if (
    q.includes("cafe") ||
    q.includes("canteen") ||
    q.includes("cafeteria") ||
    q.includes("food") ||
    q.includes("eat") ||
    q.includes("gate 2") ||
    q.includes("खाना") ||
    q.includes("कैंटीन")
  ) {
    return "☕ **कैफेटेरिया व कैफे सुविधा:**\n1. **Central Cafeteria:** कैंपस के बीच में स्थित है (यहाँ से ठीक 20 मीटर पर सेमिनार हॉल है)।\n2. **Gate 2 Cafes:** कॉलेज के गेट नंबर 2 पर विद्यार्थियों के पसंदीदा टी-पॉइंट्स, फास्ट फूड और स्नैक्स कैफे मौजूद हैं।";
  }

  // Washrooms
  if (q.includes("toilet") || q.includes("washroom") || q.includes("restroom") || q.includes("शौचालय") || q.includes("वॉशरूम")) {
    return "🚻 **Washrooms:** Block C में हर फ्लोर पर दाईं सीढ़ियों के पास साफ़-सुथरे वॉशरूम हैं। Block A में भी प्रत्येक विंग में शौचालय उपलब्ध हैं।";
  }

  // College info, address, history
  if (
    q.includes("history") ||
    q.includes("established") ||
    q.includes("founder") ||
    q.includes("chairman") ||
    q.includes("pawan") ||
    q.includes("college") ||
    q.includes("srgi") ||
    q.includes("lucknow") ||
    q.includes("address") ||
    q.includes("कॉलेज") ||
    q.includes("कहाँ है") ||
    q.includes("पता")
  ) {
    return "🎓 **SR Group of Institutions (SRGI), लखनऊ का संपूर्ण परिचय:**\n• **स्थापना:** वर्ष 2009 में माननीय चेयरमैन श्री पवन सिंह चौहान जी द्वारा स्व. सूबेदार सिंह और स्व. राज देवी जी की पावन स्मृति में।\n• **कैंपस:** 65 एकड़ का विशाल, आधुनिक एवं हरा-भरा कैंपस।\n• **पता:** NH-24, सीतापुर रोड, बख्शी का तालाब (BKT), लखनऊ, उत्तर प्रदेश 226201 (सेवा हॉस्पिटल के पास)।\n• **दूरी:** चारबाग रेलवे स्टेशन से 25 किमी, अमौसी एयरपोर्ट से 35 किमी, और इंजीनियरिंग कॉलेज चौराहा से 18 किमी।\n• **कोर्सेज:** B.Tech (CSE, AIML, Data Science, IT, EC, EN, Bio-Tech, ME, Civil, Agri), MBA, Pharmacy और Medical Sciences।";
  }

  // Holidays
  if (q.includes("holiday") || q.includes("chhutti") || q.includes("छुट्टी") || q.includes("vacation")) {
    return "📅 **SRGI प्रमुख छुट्टियाँ 2026:**\n• 26 Jan: गणतंत्र दिवस\n• 15 Feb: महाशिवरात्रि\n• 3-5 Mar: होली अवकाश\n• 20 Mar: ईद-उल-फ़ित्र\n• 27 Mar: राम नवमी\n• 15 Aug: स्वतंत्रता दिवस\n• 28 Aug: रक्षा बंधन\n• 4 Sep: जन्माष्टमी\n• 2 Oct: गाँधी जयंती\n• 19-20 Oct: दशहरा\n• 8-11 Nov: दिवाली महा-अवकाश। पूरा कैलेंडर 'Holidays 2026' में देखें!";
  }

  // Feedback & Message
  if (q.includes("suggest") || q.includes("feedback") || q.includes("message") || q.includes("शिकायत") || q.includes("सुझाव")) {
    return "✍️ **सुझाव और संदेश (Send Us a Message):**\nआप मेन्यू बार में दिए गए **'Send Suggestion / Message'** ऑप्शन पर जाकर कॉलेज एडमिन्स व फैकल्टी को सीधे अपना संदेश, फीडबैक या सुझाव भेज सकते हैं!";
  }

  // Default multi-point answer covering ALL major highlights of the college
  return "🏛️ **SRGI कैंपस गाइड — मुख्य जानकारी:**\n• **CSE Section A:** Block C के 2nd Floor पर (बाएं सीढ़ियों से ऊपर जाकर दाईं ओर मुड़ें)।\n• **क्लास टाइमिंग:** सुबह 09:00 AM से शाम 04:30 PM (वॉटर ब्रेक: 11:00 AM, 2:10 PM, 3:20 PM | लंच: 12:10 - 1:00 PM)।\n• **5 ब्लॉक्स:** Block A (Admin, Library, Seminar Hall), Block B (MBA), Block C (B.Tech Engg), Block D (Girls Hostel + Medical Store), Block E (Senior Classes)।\n• **सेंट्रल लाइब्रेरी:** Block A के 2nd Floor पर।\n• **सेमिनार हॉल:** Block A Ground Floor पर (Cafeteria से 20m सीधे)।\n• **एडमिन टीम:** Er. सुमन कुमार, Er. विवेक साहनी, Er. प्रांजल मौर्या, Er. रोशन कुमार भारती, Er. रिजवान खान, Er. अविनाश प्रजापति, Er. विवेक सरोज।\n• **23 कैंपस वीडियो वॉकथ्रू:** 'Campus Videos' व Camera Detector में लाइव उपलब्ध हैं।\n\nआप किसी भी ब्लॉक, क्लास, फैकल्टी या टाइमिंग के बारे में विस्तार से पूछ सकते हैं!";
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Endpoint to upload and persist user's exact photos to public/images
app.post("/api/upload-photos", async (req, res) => {
  try {
    const { photos } = req.body;
    if (!Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ error: "No photos provided" });
    }

    const fs = await import("fs/promises");
    const imagesDir = path.join(process.cwd(), "public", "images");
    await fs.mkdir(imagesDir, { recursive: true });

    const savedPhotos = [];

    for (let i = 0; i < photos.length; i++) {
      const p = photos[i];
      let base64Data = p.dataBase64;
      if (!base64Data) continue;

      // Extract raw base64 if it has data URL prefix
      const match = base64Data.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      let ext = "jpg";
      let rawBase64 = base64Data;
      if (match) {
        ext = match[1] === "jpeg" ? "jpg" : match[1];
        rawBase64 = match[2];
      }

      const safeName = (p.filename || `library_photo_${Date.now()}_${i}`)
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/\.[^/.]+$/, "");
      const finalFileName = `${safeName}.${ext}`;
      const filePath = path.join(imagesDir, finalFileName);

      const buffer = Buffer.from(rawBase64, "base64");
      await fs.writeFile(filePath, buffer);

      savedPhotos.push({
        id: `uploaded-${Date.now()}-${i}`,
        title: p.title || `Library Photo ${i + 1}`,
        locationName: p.locationName || "Central Library",
        block: p.block || "Block A",
        category: p.category || "Library",
        imageUrl: `/images/${finalFileName}`,
        caption: p.caption || "Original verified photo of SRGI Central Library",
        tags: ["library", "central library", "srgi", "block a", "reading room", "study"],
      });
    }

    return res.json({ success: true, count: savedPhotos.length, photos: savedPhotos });
  } catch (err: any) {
    console.error("Failed to save photos:", err);
    return res.status(500).json({ error: err.message || "Failed to save photos" });
  }
});

// Endpoint to list photos currently stored in public/images
app.get("/api/uploaded-photos", async (_req, res) => {
  try {
    const fs = await import("fs/promises");
    const imagesDir = path.join(process.cwd(), "public", "images");
    await fs.mkdir(imagesDir, { recursive: true });

    const files = await fs.readdir(imagesDir);
    const imageFiles = files.filter((f) =>
      /\.(jpg|jpeg|png|webp|avif)$/i.test(f)
    );

    const photosList = imageFiles.map((f, idx) => ({
      id: `disk-${f}`,
      title: f.replace(/_\d+.*$/, "").replace(/_/g, " "),
      imageUrl: `/images/${f}`,
      category: f.toLowerCase().includes("library") ? "Library" : "Campus",
      locationName: f.toLowerCase().includes("library") ? "Central Library" : "Campus",
      block: "Block A",
    }));

    return res.json({ photos: photosList });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    // Prepare contents with conversation history if available
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.sender === "user") {
          contents.push({ role: "user", parts: [{ text: item.text }] });
        } else if (item.sender === "bot") {
          contents.push({ role: "model", parts: [{ text: item.text }] });
        }
      }
    }

    contents.push({ role: "user", parts: [{ text: message }] });

    const reply = await generateGeminiContentWithFallback(contents);
    return res.json({ reply });
  } catch (error: any) {
    // Catch high demand (503), rate limits, or network timeouts gracefully without throwing an unhandled error
    const msg = error?.message || String(error);
    console.warn("Gemini service unavailable, switching to local campus guide:", msg);

    const offlineReply = getCampusOfflineAnswer(message);
    return res.json({
      reply: offlineReply,
      source: "campus-knowledge-base",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SRGI Campus Navigator server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
