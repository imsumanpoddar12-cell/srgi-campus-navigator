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
You provide helpful, warm, concise, and accurate directions and information to students, faculty, visitors, and admins. You can converse fluently in both English and Hindi/Hinglish depending on user preference.

Official Campus Information:
- Campus Size: Sprawling 65-acre lush green multi-disciplinary campus.
- Established: Founded in 2009 by Chairman Shri Pawan Singh Chauhan in tribute to Late Subedar Singh & Late Raj Devi.
- Academic Programs: 10+ branches across Engineering (B.Tech in CSE, IT, EC, EN, AIML, DS, Bio-Tech, Mechanical, Agriculture, etc.), Management (MBA), Pharmacy, and Medical Sciences.
- Main Gate & Gates:
  - Boys Hostel: Located within the campus, approximately 300 metres away from the Main Gate.
  - Gate 2 (Second Gate): Multiple lively student cafes and food stalls are located right at the 2nd Gate of the college.
- Buildings & Blocks:
  - Block A:
    - Ground Floor: Seminar Hall, Play Area, Chemistry Lab, Mechanics Lab, Transport Office. Note: The Seminar Hall is also 20 metres straight from the campus cafeteria!
    - First Floor: Admission Cell, Registrar Office, Accounts Office, Meeting Office, Director Office, Provisional Director Office, Stay Room, Chairman Office.
    - Second Floor: Central Library (rich collection of books, research papers, study areas).
  - Block B: MBA Students Block (Management classrooms, faculty rooms, seminar spaces).
  - Block C:
    - Ground Floor: CSE Advanced Class, Bio-Tech Section A, Bio-Tech Section C, Central Computer Lab.
    - First Floor: HOD Office (take left staircase, take right, ~50m away), EN (Electrical & Electronics), IT (Information Technology), EC (Electronics & Communication), DS (Data Science), AIML (Artificial Intelligence & Machine Learning), AI (Artificial Intelligence), Faculty Rooms.
    - Second Floor: HOD Office (~25-30m from left staircase on right), Biotechnology, Mechanical Engineering, Agriculture, CSE Section C, CSE Section B, CSE Section A (located near the left staircase), Faculty Rooms.
    - Third Floor: SRIMT Classes.
    - Restrooms: Toilets are located near the right staircase on every single floor of Block C.
  - Block D: Girls Hostel. (Crucial Note: The campus Store Room and Medical Dispensary / First-Aid Medicines are located just behind Block D).
  - Block E: Senior Classes Block (for 2nd Year, 3rd Year, and 4th Year seniors).
- Cafeteria & Food: Central cafeteria is located centrally; Seminar Hall is 20 metres straight from the cafeteria. More cafes at 2nd Gate.
- Store Room & Medicines: Located immediately behind Block D (Girls Hostel).
- Faculties (CSE Section A):
  - Prashant Bajpai (Head of Department) - Phone: 7617000030
  - Brijesh Singh (Language Lab / PCTW) - Phone: 7617000079
  - Santosh Kumar Mathur (EC) - Phone: 9455500244
  - Preety Chaudhary (PD) - Phone: 7988499219
  - Manish Kumar Mishra (Chemistry) - Phone: 9793000017
  - Laxmikant (Maths) - Phone: 9451910027
  - Maneesh Mishra (ME) - Phone: 9793000055
- CSE Section A Schedule: Runs Monday to Saturday from 09:00 to 16:30. Water breaks at 11:00-11:10, 14:10-14:20, 15:20-15:30. Lunch break at 12:10-13:00.
- Student Admin & App Development Team:
  - Suman Kumar (Leader) - Email: imsumanpoddar12@gmail.com
  - Vivek Sahani (Co-Leader) - Email: sahvds9416@gmal.com
  - Pranjal Maurya (Core Member)
  - Roshan Kumar Bharti (Core Member) - Email: roshankumar11102007@gmail.com
  - Rijawan Khan (Core Member)
  - Avinash Prajapati (Core Member) - Email: avinashprajapati7598@gmail.com
  - Vivek Saroj (Core Member) - Email: viveksaroj7598@gmail.com

Always answer clearly, with specific step-by-step directions if navigating, and highlight landmarks like staircases, blocks, or floors when guiding someone. Keep responses engaging and structured.`;

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

  if (q.includes("cse a") || q.includes("cse section a") || q.includes("section a")) {
    return "📍 **CSE Section A Directions:**\n- **Block:** Block C\n- **Floor:** 2nd Floor\n- **How to Reach:** Enter Block C from the main entrance, take the left staircase directly up to the 2nd Floor. As you exit the stairs, turn right: walk past the HOD Office, Bio-Tech, Mechanical, Agriculture, CSE Section C, and CSE Section B. CSE Section A will be right there near the left staircase corridor!";
  }

  if (q.includes("cse b") || q.includes("cse section b")) {
    return "📍 **CSE Section B Directions:** Located on the 2nd Floor of Block C, adjacent to CSE Section C and Section A.";
  }

  if (q.includes("cse c") || q.includes("cse section c")) {
    return "📍 **CSE Section C Directions:** Located on the 2nd Floor of Block C, right near the Mechanical & Bio-Tech departments.";
  }

  if (q.includes("library") || q.includes("central library") || q.includes("books")) {
    return "📚 **Central Library:**\n- **Block:** Block A\n- **Floor:** 2nd Floor\n- **Details:** The Central Library houses thousands of engineering, management, and research volumes, quiet reading zones, and digital journals. Access via the main staircase or elevator in Block A.";
  }

  if (q.includes("hod") || q.includes("head of department") || q.includes("prashant")) {
    return "👔 **Head of Department (CSE):**\n- **HOD:** Respected Prashant Bajpai Sir (Phone: 7617000030)\n- **Office Location:** Block C, 1st & 2nd Floor. (On 1st Floor: take left staircase, turn right, approx. 50m away. On 2nd Floor: approx. 25-30m from left staircase on right).";
  }

  if (q.includes("block d") || q.includes("girls hostel") || q.includes("girl hostel") || q.includes("female hostel")) {
    return "🏢 **Block D (Girls Hostel):**\n- **Purpose:** Secure on-campus residence for female students.\n- **Important Landmark:** The campus **Store Room** and **Medical Dispensary / First-Aid Medicines** are situated right behind Block D!";
  }

  if (q.includes("block e") || q.includes("senior") || q.includes("2nd year") || q.includes("3rd year") || q.includes("4th year")) {
    return "🏛️ **Block E (Senior Classes):**\n- **Purpose:** Dedicated academic block for 2nd Year, 3rd Year, and Final 4th Year engineering students.";
  }

  if (q.includes("boy") || q.includes("boys hostel") || q.includes("hostel")) {
    return "🛏️ **Boys Hostel:**\n- **Location:** Inside the main campus, approximately 300 metres walking distance straight from the college Main Gate.";
  }

  if (q.includes("medicine") || q.includes("first aid") || q.includes("doctor") || q.includes("medical") || q.includes("store")) {
    return "💊 **Medicines, First-Aid & Store Room:**\n- **Location:** Located immediately behind **Block D (Girls Hostel)**. Immediate first-aid supplies and student essentials are readily available here.";
  }

  if (q.includes("seminar hall") || q.includes("seminar")) {
    return "🎤 **Seminar Hall:**\n- **Location:** Block A, Ground Floor.\n- **Direct Shortcut:** It is also located exactly 20 metres straight from the campus Central Cafeteria!";
  }

  if (q.includes("cafe") || q.includes("canteen") || q.includes("cafeteria") || q.includes("food") || q.includes("eat") || q.includes("gate 2")) {
    return "☕ **Cafeteria & Food Hubs:**\n1. **Central Cafeteria:** Centrally located in the campus (Seminar Hall is just 20m straight ahead).\n2. **Gate 2 Cafes:** Multiple popular food points, snacks, tea/coffee cafes, and eateries are stationed right at the 2nd Gate of the college!";
  }

  if (q.includes("toilet") || q.includes("washroom") || q.includes("restroom")) {
    return "🚻 **Washrooms & Restrooms:** In Block C, clean student restrooms are situated near the right-side staircase on every single floor (Ground, 1st, 2nd, and 3rd floors). In Block A, restrooms are on each corridor wing.";
  }

  if (q.includes("faculty") || q.includes("teacher") || q.includes("sir") || q.includes("ma'am") || q.includes("phone")) {
    return "👨‍🏫 **Core CSE Section A Faculties & Contacts:**\n- **Prashant Bajpai (HOD):** 7617000030\n- **Brijesh Singh (Language Lab / PCTW):** 7617000079\n- **Santosh Kumar Mathur (EC):** 9455500244\n- **Preety Chaudhary (PD):** 7988499219\n- **Manish Kumar Mishra (Chemistry):** 9793000017\n- **Laxmikant (Maths):** 9451910027\n- **Maneesh Mishra (ME):** 9793000055";
  }

  if (q.includes("schedule") || q.includes("timetable") || q.includes("time") || q.includes("class time") || q.includes("break")) {
    return "⏰ **CSE Section A Class Timing:**\n- **Timing:** 09:00 AM – 04:30 PM (Mon - Sat)\n- **Water Breaks:** 11:00 - 11:10 AM | 02:10 - 02:20 PM | 03:20 - 03:30 PM\n- **Lunch Break:** 12:10 PM - 01:00 PM";
  }

  if (q.includes("team") || q.includes("creator") || q.includes("admin") || q.includes("suman") || q.includes("vivek")) {
    return "👥 **Campus Navigator Student Team:**\n- **Suman Kumar** (Leader - B.Tech CSE A) - `imsumanpoddar12@gmail.com`\n- **Vivek Sahani** (Co-Leader - B.Tech CSE A) - `sahvds9416@gmal.com`\n- **Pranjal Maurya, Roshan Kumar Bharti, Rijawan Khan, Avinash Prajapati, Vivek Saroj** (Core Members).";
  }

  if (q.includes("chairman") || q.includes("pawan") || q.includes("director") || q.includes("founder")) {
    return "🌟 **Leadership:**\n- **Chairman:** Honorable Shri Pawan Singh Chauhan (founded SRGI in 2009 in memory of Late Subedar Singh & Late Raj Devi).\n- **Campus Size:** 65-acre sprawling green campus with 10+ disciplines.";
  }

  return "🏛️ **SR Group of Institutions (SRGI) Campus:**\n- **Block A:** Administration, Director Office, Registrar, Central Library (2nd Flr), Seminar Hall (Gr Flr, 20m from cafeteria).\n- **Block B:** MBA Students Block.\n- **Block C:** CSE (Section A on 2nd Flr), IT, EC, EN, AIML, DS, Bio-Tech, Labs, HOD Office.\n- **Block D:** Girls Hostel (Store Room & Medicines located directly behind).\n- **Block E:** Senior Classes Block (2nd, 3rd & 4th Year).\n- **Boys Hostel:** 300m from Main Gate.\n- **Gate 2:** Cafes & food spots.";
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
