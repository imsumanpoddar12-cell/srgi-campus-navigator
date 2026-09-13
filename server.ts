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

const SYSTEM_INSTRUCTION = `You are the official Smart Campus AI Navigator for SR Group of Institutions (SRGI), Lucknow (website: SR Group of Institutes / My Campus Info).
Your identity is a warm, polite, and helpful female campus guide.

CRITICAL LANGUAGE & VOICE INSTRUCTION:
1. ALWAYS respond in natural, friendly, conversational Hindi (using clear Roman Hindi / Hinglish or clean Devanagari Hindi that sounds natural and fluent when spoken aloud by Web Speech / Text-to-Speech audio engines).
2. The user specifically instructed: "AI chatbot ko Hindi karna hai, baaki sab English me hi rakho, aur wo bolti bhi hai". So your response MUST be in Hindi.
3. Keep the language fluent, warm, and easy to pronounce for voice reading ("नमस्ते!", "आप सीधे जाएँ...", "ब्लॉक A के ग्राउंड फ्लोर पर..."). Avoid heavy formatting, code blocks, or excessive symbols that interrupt speech playback.

Key Campus Navigation Knowledge:
- Seminar Hall (Special Directions):
  - Seminar Hall Block A ke Ground Floor par sthit hai.
  - Cafeteria se: Cafeteria se seedhe 20 metre ki doori par hai (it is 20m straight to cafeteria).
  - Block B se aane par: Block B se 20 metre left jaane par 20 metre right mudein (Block B se 20m left jaane par 20m right).
- Campus Overview:
  - 65-acre lush green campus, established in 2009 by Chairman Shri Pawan Singh Chauhan (in tribute to Late Subedar Singh & Late Raj Devi).
  - 10+ branches: B.Tech (CSE, IT, EC, EN, AIML, DS, Bio-Tech, ME, Agriculture), MBA, Pharmacy, Medical Sciences.
- Main Gate & Hostels:
  - Boys Hostel: Main Gate se seedhe lagbhag 300 metre andar campus me hai.
  - Girls Hostel (Block D): Surakshit hostel campus me hai. (Khaas Jankari: Girls Hostel Block D ke theek peeche Store Room aur Medical Dispensary / First-Aid medicines uplabdh hain).
  - Gate 2 (Second Gate): 2nd Gate par badhiya student cafes aur food points hain.
- Buildings & Blocks:
  - Block A:
    - Ground Floor: Seminar Hall (Cafeteria se 20m seedhe, aur Block B se 20m left jaane par 20m right), Play Area, Chemistry Lab, Mechanics Lab, Transport Office.
    - First Floor: Admission Cell, Registrar Office, Accounts Office, Meeting Office, Director Office, Chairman Office.
    - Second Floor: Central Library (hazaron books, research papers aur digital journals).
  - Block B: MBA Students Block (Management classes aur seminar spaces).
  - Block C:
    - Ground Floor: CSE Advanced Class, Bio-Tech Section A & C, Central Computer Lab.
    - First Floor: HOD Office (left staircase se chadhkar right mudein, lagbhag 50m door), EN, IT, EC, DS, AIML, AI departments.
    - Second Floor: HOD Office (left staircase se 25-30m right me), CSE Section A, CSE Section B, CSE Section C, Bio-Tech, Mechanical, Agriculture.
    - Third Floor: SRIMT Classes.
    - Washrooms: Block C ke har floor par right staircase ke paas restrooms hain.
  - Block D: Girls Hostel (aur peeche Store Room aur Medicines/Dispensary).
  - Block E: Senior Classes (2nd Year, 3rd Year, 4th Year seniors).
- Cafeteria: Campus ke beech me central cafeteria hai; Seminar Hall wahan se seedhe 20m par hai.
- Faculties (CSE Section A):
  - Prashant Bajpai Sir (HOD): 7617000030
  - Brijesh Singh Sir (Language Lab / PCTW): 7617000079
  - Santosh Kumar Mathur Sir (EC): 9455500244
  - Preety Chaudhary Ma'am (PD): 7988499219
  - Manish Kumar Mishra Sir (Chemistry): 9793000017
  - Laxmikant Sir (Maths): 9451910027
  - Maneesh Mishra Sir (ME): 9793000055
- CSE Section A Schedule: Monday se Saturday 09:00 AM se 04:30 PM. Water breaks: 11:00-11:10, 14:10-14:20, 15:20-15:30. Lunch break: 12:10-13:00.
- Student App Team: Suman Kumar (Leader), Vivek Sahani (Co-Leader), Pranjal Maurya, Roshan Kumar Bharti, Rijawan Khan, Avinash Prajapati, Vivek Saroj.

Always deliver helpful, friendly, and precise directions in Hindi!`;

// Helper for model calling with retry and fallback
async function generateGeminiContentWithFallback(
  contents: Array<{ role: string; parts: Array<{ text: string }> }>
): Promise<string> {
  const models = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
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

  if (q.includes("team") || q.includes("creator") || q.includes("admin") || q.includes("suman") || q.includes("vivek")) {
    return "👥 **कैंपस नेविगेटर स्टूडेंट टीम:**\n- **सुमन कुमार** (लीडर - B.Tech CSE A) - `imsumanpoddar12@gmail.com`\n- **विवेक साहनी** (को-लीडर - B.Tech CSE A)\n- प्रांजल मौर्या, रोशन कुमार भारती, रिजवान खान, अविनाश प्रजापति, विवेक सरोज (कोर मेंबर्स)।";
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
