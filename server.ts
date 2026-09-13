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

const SYSTEM_INSTRUCTION = `You are the official Smart Campus AI Navigator for SR Group of Institutions (SRGI), Lucknow (Website: SR Group of Institutes / My Campus Info).
Your identity is "SRGI Saathi" (एसआरजीआई साथी), a warm, polite, highly knowledgeable, and helpful female campus assistant.

CRITICAL LANGUAGE & CONVERSATION RULES:
1. ALWAYS converse in natural, respectful, and friendly Hindi (or natural Hinglish that is effortless to understand for Indian college students and sounds beautiful and clear when spoken aloud by the browser's Text-to-Speech / Web Speech audio engine).
2. Keep spoken sentences clean, melodic, and conversational (e.g., "नमस्ते! मैं आपकी एसआरजीआई साथी हूँ।", "आप सीधे जाएँ...", "ब्लॉक A के ग्राउंड फ्लोर पर स्थित है।"). Avoid excessive stars, hashes, or complex formatting that sounds robotic or broken when read by voice synthesis.
3. Greet users with warm Indian hospitality ("नमस्ते! आप SRGI कैंपस, रास्ते, वीडियो नेविगेशन, फैकल्टी या एडमिन्स के बारे में क्या जानना चाहते हैं?").

CAMPUS VIDEO NAVIGATION ROUTES (कैंपस वीडियो वॉकथ्रू गाइड):
SRGI has 8 official walking route videos uploaded for live camera & place navigation:
1. Main Campus Entry from Gate 1:
   - Route: College Gate 1 security checkpoint into the 65-acre central campus grounds.
   - Video URL: https://res.cloudinary.com/ehqczar2/video/upload/v1789271177/emxylyq1ejstsdxbg2qc.mp4
2. Main Gate to C Block Main Gate:
   - Route: Direct walk along the main campus roadway connecting Gate 1 to Block C Main Entrance.
   - Video URL: https://res.cloudinary.com/ehqczar2/video/upload/v1789272307/ozmtpjniqnyidkqqjcok.mp4
3. C Block Main Entry & Porch:
   - Route: Entering through Block C front gate into the ground floor lobby.
   - Video URL: https://res.cloudinary.com/ehqczar2/video/upload/v1789272080/esnvmlcobzajhos26dwf.mp4
4. C Block Entry from Left Stairs Gate:
   - Route: Side entry from the left gate giving direct access to the left staircase (fastest route to 2nd floor CSE).
   - Video URL: https://res.cloudinary.com/ehqczar2/video/upload/v1789271146/yq6k49tfe4ykwbvdpmvi.mp4
5. C-Block Ground Floor to 2nd Floor (from Left Stairs):
   - Route: Walking up the left stairs from ground floor up to the 2nd floor academic corridor.
   - Video URL: https://res.cloudinary.com/ehqczar2/video/upload/v1789271307/u0vrk0f8ez7ak5xt1vat.mp4
6. C Block 2nd Floor Corridor & CSE Sections:
   - Route: Walkthrough along the 2nd floor corridor showing CSE Section A, Section B, Section C, Bio-Tech, Mechanical, Agriculture, and HOD Office.
   - Video URL: https://res.cloudinary.com/ehqczar2/video/upload/v1789157385/yo47y7evb1aahjqfum5h.mp4
7. Block C Floor 2 Right Side Wing:
   - Route: Walkthrough of Block C 2nd floor right wing classrooms, labs, and washrooms.
   - Video URL: https://res.cloudinary.com/ehqczar2/video/upload/v1789272411/xibjgmpde8dqaoubemha.mp4
8. Second Floor to Ground Floor C-Block Descent:
   - Route: Descending from 2nd floor back down to the ground floor exit.
   - Video URL: https://res.cloudinary.com/ehqczar2/video/upload/v1789272318/aerqkwomnchrjnzpxcaj.mp4
When users ask how to reach these places or ask for a video, mention that video guides are available in the "Camera Place Detector & Route" section!

OFFICIAL ADMINS & STUDENT LEADERSHIP TEAM (all have Er. title, cities instead of phone numbers, editing is locked):
1. Er. SUMAN KUMAR (Leader - B.Tech CSE A) | City: Begusarai, Bihar | Email: suman@srgi.ac.in, imsumanpoddar12@gmail.com | Role: Lead Developer & System Architect.
2. Er. VIVEK SAHANI (Co-Leader - B.Tech CSE A) | City: Kushinagar, Uttar Pradesh | Email: vivek@srgi.ac.in | Role: Co-Leader & Campus Data Head.
3. Er. PRANJAL MAURYA (Core Member) | City: Varanasi, Uttar Pradesh | Email: pranjalmaurya1120@gmail.com | Role: System Specialist & Routing Lead.
4. Er. ROSHAN KUMAR BHARTI (Core Member) | City: Mau, Uttar Pradesh | Email: roshan@srgi.ac.in | Role: Security & Content Lead.
5. Er. RIJAWAN KHAN (Core Member) | City: Maharajganj, Uttar Pradesh | Email: rijawan5657@gmail.com | Role: Network & Media Manager.
6. Er. AVINASH PRAJAPATI (Core Member) | City: Maharajganj, Uttar Pradesh | Email: avinash@srgi.ac.in | Role: Media & Gallery Specialist.
7. Er. VIVEK SAROJ (Core Member) | City: Pratapganj, Uttar Pradesh | Email: viveksaroj@srgi.ac.in | Role: UI/UX & Operations.

FACULTIES & CONTACTS (CSE Section A):
- Prashant Bajpai Sir (HOD CSE): 7617000030 | Office in Block C 1st & 2nd Floor
- Brijesh Singh Sir (Language Lab / PCTW): 7617000079
- Santosh Kumar Mathur Sir (Electronics / EC): 9455500244
- Preety Chaudhary Ma'am (Personality Development / PD): 7988499219
- Manish Kumar Mishra Sir (Engineering Chemistry): 9793000017
- Laxmikant Sir (Engineering Mathematics): 9451910027
- Maneesh Mishra Sir (Mechanical Engineering / ME): 9793000055

CSE SECTION A TIMINGS:
- Mon-Sat: 09:00 AM to 04:30 PM
- Water Breaks: 11:00-11:10 AM | 02:10-02:20 PM | 03:20-03:30 PM
- Lunch Break: 12:10 PM - 01:00 PM

CAMPUS OVERVIEW & BUILDINGS:
- Location of SRGI Lucknow: NH-24, Sitapur Road, Bakshi Ka Talab (BKT), Lucknow, Uttar Pradesh 226201 (Near Sewa Hospital).
- Distance: Approx 25 km from Lucknow Charbagh Railway Station, 35 km from Amausi Airport, 18 km from Engineering College Chauraha.
- Campus History: 65-acre lush green campus, founded in 2009 by Chairman Shri Pawan Singh Chauhan in tribute to Late Subedar Singh & Late Raj Devi.
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

  if (q.includes("seminar hall") || q.includes("seminar") || q.includes("सेमिनार") || q.includes("hall") || q.includes("auditorium")) {
    return "🎤 **Seminar Hall (सेमिनार हॉल) की जानकारी:**\n- **लोकेशन:** Block A के Ground Floor पर स्थित है।\n- **Cafeteria से रास्ता:** Cafeteria से बिलकुल सीधे 20 metre की दूरी पर है (it is 20m straight to cafeteria)।\n- **Block B से रास्ता:** Block B से 20 metre left जाने पर, फिर 20 metre right मुड़ें (Block B se 20m left jaane par 20m right)।";
  }

  if (q.includes("cse a") || q.includes("cse section a") || q.includes("section a")) {
    return "📍 **CSE Section A का रास्ता:**\n- **ब्लॉक:** Block C\n- **फ्लोर:** 2nd Floor\n- **कैसे पहुँचे:** Block C के मुख्य द्वार से प्रवेश करें और बाईं (left) सीढ़ियों से सीधे 2nd Floor पर जाएँ। सीढ़ियों से निकलते ही दाईं ओर मुड़ें: HOD ऑफिस, Bio-Tech, Mechanical, Agriculture, CSE Section C और B के आगे बढ़ते ही CSE Section A कॉरिडोर में बाईं सीढ़ियों के पास ही मिल जाएगा!";
  }

  if (q.includes("cse b") || q.includes("cse section b")) {
    return "📍 **CSE Section B का रास्ता:** Block C के 2nd Floor पर, CSE Section C और Section A के पास स्थित है।";
  }

  if (q.includes("cse c") || q.includes("cse section c")) {
    return "📍 **CSE Section C का रास्ता:** Block C के 2nd Floor पर Mechanical और Bio-Tech डिपार्टमेंट के नजदीक स्थित है।";
  }

  if (q.includes("library") || q.includes("central library") || q.includes("books") || q.includes("किताब")) {
    return "📚 **Central Library (केंद्रीय पुस्तकालय):**\n- **ब्लॉक:** Block A\n- **फ्लोर:** 2nd Floor\n- **विवरण:** यहाँ हजारों इंजीनियरिंग, मैनेजमेंट और रिसर्च बुक्स, शांत स्टडी रूम और डिजिटल जर्नल्स उपलब्ध हैं। Block A की मुख्य सीढ़ियों या लिफ्ट से पहुँच सकते हैं।";
  }

  if (q.includes("hod") || q.includes("head of department") || q.includes("prashant")) {
    return "👔 **Head of Department (CSE):**\n- **HOD:** आदरणीय प्रशांत बाजपेयी सर (Phone: 7617000030)\n- **ऑफिस लोकेशन:** Block C के 1st और 2nd Floor पर। 1st Floor पर बाईं सीढ़ी से दाईं तरफ लगभग 50 मीटर, और 2nd Floor पर बाईं सीढ़ी से दाईं तरफ 25-30 मीटर पर।";
  }

  if (q.includes("block d") || q.includes("girls hostel") || q.includes("girl hostel") || q.includes("female hostel")) {
    return "🏢 **Block D (Girls Hostel):**\n- **उद्देश्य:** छात्राओं के लिए सुरक्षित हॉस्टल।\n- **ज़रूरी जानकारी:** Block D के ठीक पीछे कैंपस का **Store Room** और **Medical Dispensary (दवाइयाँ व First-Aid)** स्थित है!";
  }

  if (q.includes("block e") || q.includes("senior") || q.includes("2nd year") || q.includes("3rd year") || q.includes("4th year")) {
    return "🏛️ **Block E (Senior Classes):**\n- **उद्देश्य:** 2nd Year, 3rd Year और Final 4th Year सीनियर इंजीनियरिंग छात्रों की क्लास का ब्लॉक।";
  }

  if (q.includes("boy") || q.includes("boys hostel") || q.includes("hostel")) {
    return "🛏️ **Boys Hostel:**\n- **लोकेशन:** कॉलेज के मेन गेट से अंदर आते ही लगभग 300 मीटर की दूरी पर कैंपस के अंदर स्थित है।";
  }

  if (q.includes("medicine") || q.includes("first aid") || q.includes("doctor") || q.includes("medical") || q.includes("store") || q.includes("दवा")) {
    return "💊 **दवाइयाँ (Medicines), First-Aid और Store Room:**\n- **लोकेशन:** यह **Block D (Girls Hostel)** के ठीक पीछे स्थित है। यहाँ प्राथमिक चिकित्सा व ज़रूरत का सामान उपलब्ध है।";
  }

  if (q.includes("cafe") || q.includes("canteen") || q.includes("cafeteria") || q.includes("food") || q.includes("eat") || q.includes("gate 2")) {
    return "☕ **कैफेटेरिया और कैफे:**\n1. **सेंट्रल कैफेटेरिया:** कैंपस के बीच में स्थित है (यहाँ से सीधे 20 मीटर जाने पर सेमिनार हॉल है)।\n2. **Gate 2 कैफे:** कॉलेज के दूसरे गेट पर चाय, कॉफी और स्नैक्स के कई लोकप्रिय कैफे मौजूद हैं!";
  }

  if (q.includes("toilet") || q.includes("washroom") || q.includes("restroom") || q.includes("शौचालय")) {
    return "🚻 **Washrooms:** Block C में हर फ्लोर पर दाईं सीढ़ियों के पास साफ़-सुथरे वॉशरूम हैं। Block A में भी प्रत्येक विंग में शौचालय उपलब्ध हैं।";
  }

  if (q.includes("faculty") || q.includes("teacher") || q.includes("sir") || q.includes("ma'am") || q.includes("phone")) {
    return "👨‍🏫 **CSE Section A फैकल्टी व कांटेक्ट नंबर:**\n- प्रशांत बाजपेयी (HOD): 7617000030\n- बृजेश सिंह (Language Lab / PCTW): 7617000079\n- संतोष कुमार माथुर (EC): 9455500244\n- प्रीति चौधरी (PD): 7988499219\n- मनीष कुमार मिश्रा (Chemistry): 9793000017\n- लक्ष्मीकांत (Maths): 9451910027\n- मनीष मिश्रा (ME): 9793000055";
  }

  if (q.includes("schedule") || q.includes("timetable") || q.includes("time") || q.includes("class time") || q.includes("break")) {
    return "⏰ **CSE Section A क्लास टाइमिंग:**\n- **समय:** सुबह 09:00 AM से शाम 04:30 PM (सोमवार से शनिवार)\n- **वॉटर ब्रेक:** 11:00-11:10 AM | 02:10-02:20 PM | 03:20-03:30 PM\n- **लंच ब्रेक:** 12:10 PM से 01:00 PM";
  }

  if (q.includes("video") || q.includes("वीडियो") || q.includes("walkthrough") || q.includes("walk") || q.includes("camera") || q.includes("कैमरा")) {
    return "🎥 **SRGI कैंपस वीडियो नेविगेशन वॉकथ्रू गाइड (8 ऑफिशियल वीडियो):**\n1. **मेन गेट 1 से कैंपस एंट्री:** Gate 1 से कॉलेज के मुख्य मार्ग का वॉकथ्रू।\n2. **मेन गेट से ब्लॉक C मुख्य गेट:** Gate 1 से सीधे Block C तक का पूरा रास्ता।\n3. **ब्लॉक C मुख्य प्रवेश द्वार:** Block C का फ्रंट गेट और ग्राउंड फ्लोर लॉबी।\n4. **ब्लॉक C बाएं सीढ़ियों वाले गेट से एंट्री:** Side gate से बाएं सीढ़ियों का सीधा रास्ता।\n5. **ब्लॉक C ग्राउंड फ्लोर से 2nd फ्लोर (बाएं सीढ़ियों से):** CSE Section A, B, C तक पहुँचने का वीडियो।\n6. **ब्लॉक C सेकंड फ्लोर कॉरिडोर:** CSE Sections A, B, C, Bio-Tech, Mechanical और HOD Office।\n7. **ब्लॉक C सेकंड फ्लोर राइट साइड:** क्लासरूम्स और लैब्स का कॉरिडोर।\n8. **ब्लॉक C सेकंड फ्लोर से ग्राउंड फ्लोर नीचे जाने का रास्ता।**\n\n👉 यह सभी वीडियो आप मेन्यू या बॉटम बार के **'Camera Vision / Camera Place Detector'** में लाइव देख सकते हैं और रास्ता नेविगेट कर सकते हैं!";
  }

  if (q.includes("team") || q.includes("creator") || q.includes("admin") || q.includes("suman") || q.includes("vivek") || q.includes("pranjal") || q.includes("roshan") || q.includes("rijawan") || q.includes("avinash") || q.includes("saroj")) {
    return "👥 **SRGI एडमिन व क्रिएटर टीम (सभी इंजीनियर्स - Official Records):**\n- **Er. सुमन कुमार** (Leader - B.Tech CSE A) - बेगूसराय, बिहार (suman@srgi.ac.in)\n- **Er. विवेक साहनी** (Co-Leader - B.Tech CSE A) - कुशीनगर, उत्तर प्रदेश (vivek@srgi.ac.in)\n- **Er. प्रांजल मौर्या** (Core Member) - वाराणसी, उत्तर प्रदेश (pranjalmaurya1120@gmail.com)\n- **Er. रोशन कुमार भारती** (Core Member) - मऊ, उत्तर प्रदेश (roshan@srgi.ac.in)\n- **Er. रिजवान खान** (Core Member) - महराजगंज, उत्तर प्रदेश (rijawan5657@gmail.com)\n- **Er. अविनाश प्रजापति** (Core Member) - महराजगंज, उत्तर प्रदेश (avinash@srgi.ac.in)\n- **Er. विवेक सरोज** (Core Member) - प्रतापगंज, उत्तर प्रदेश (viveksaroj@srgi.ac.in)\n\nसभी एडमिन्स की जानकारी सुरक्षित और आधिकारिक है।";
  }

  if (q.includes("where is") || q.includes("location") || q.includes("kahan") || q.includes("lucknow") || q.includes("address") || q.includes("पता") || q.includes("रास्ता")) {
    return "📍 **SRGI लखनऊ का पता और लोकेशन:**\n- **पता:** NH-24, सीतापुर रोड, बख्शी का तालाब (BKT), लखनऊ, उत्तर प्रदेश 226201 (सेवा हॉस्पिटल के पास)।\n- **दूरी:** चारबाग रेलवे स्टेशन से लगभग 25 किमी, अमौसी एयरपोर्ट से 35 किमी, और इंजीनियरिंग कॉलेज चौराहे से 18 किमी।\n- **परिवहन:** लखनऊ के सभी प्रमुख इलाकों से कॉलेज बसें चलती हैं; इंजीनियरिंग कॉलेज और बीकेटी से ऑटो व ई-रिक्शा भी उपलब्ध रहते हैं।";
  }

  if (q.includes("holiday") || q.includes("chhutti") || q.includes("छुट्टी") || q.includes("vacation")) {
    return "📅 **SRGI प्रमुख छुट्टियाँ 2026 (Academic Holidays):**\n- 26 Jan: गणतंत्र दिवस\n- 15 Feb: महाशिवरात्रि\n- 3-5 Mar: होली अवकाश\n- 20 Mar: ईद-उल-फ़ित्र\n- 27 Mar: राम नवमी\n- 14 Apr: डॉ. आंबेडकर जयंती\n- 15 Aug: स्वतंत्रता दिवस\n- 28 Aug: रक्षा बंधन\n- 4 Sep: जन्माष्टमी\n- 2 Oct: गाँधी जयंती\n- 19-20 Oct: दशहरा\n- 8-11 Nov: दिवाली महा-अवकाश\n- 25 Dec: क्रिसमस। पूरा हॉलिडे कैलेंडर आप मेन्यू के 'Holidays 2026' में भी देख सकते हैं!";
  }

  if (q.includes("suggest") || q.includes("feedback") || q.includes("message") || q.includes("शिकायत") || q.includes("सुझाव")) {
    return "✍️ **सुझाव और मैसेज (Suggestion Box):**\nआप मेन्यू में दिए गए **'Send Suggestion / Message'** ऑप्शन पर क्लिक करके कॉलेज टीम और एडमिन्स को सीधे अपना सुझाव, फीडबैक या समस्या भेज सकते हैं!";
  }

  if (q.includes("chairman") || q.includes("pawan") || q.includes("director") || q.includes("founder")) {
    return "🌟 **चेयरमैन:** माननीय श्री पवन सिंह चौहान जी ने 2009 में स्व. सूबेदार सिंह और स्व. राज देवी जी की पावन स्मृति में SRGI की स्थापना की थी। यह 65 एकड़ का हरा-भरा विशाल कैंपस है।";
  }

  return "🏛️ **SRGI कैंपस मुख्य स्थान:**\n- **सेमिनार हॉल:** Block A Ground Floor पर (Cafeteria से 20m सीधे, और Block B से 20m left जाने पर 20m right)।\n- **Block A:** एडमिनिस्ट्रेशन, सेंट्रल लाइब्रेरी (2nd Floor), सेमिनार हॉल (Ground Floor)।\n- **Block B:** MBA स्टूडेंट्स ब्लॉक।\n- **Block C:** CSE (Section A 2nd Floor), IT, EC, EN, Bio-Tech, HOD ऑफिस।\n- **Block D:** Girls Hostel (पीछे Store Room व दवाइयाँ)।\n- **Block E:** सीनियर क्लासेस (2nd, 3rd, 4th Year)।\n- **Boys Hostel:** मेन गेट से 300 मीटर।";
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
