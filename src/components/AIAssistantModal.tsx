import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Bot,
  User,
  Volume2,
  VolumeX,
  RotateCcw,
  Loader2,
  Volume1,
} from "lucide-react";
import { ChatMessage } from "../types";
import { getComprehensiveCampusAnswer } from "../data/campusKnowledge";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_WELCOME_TEXT =
  "नमस्ते! मैं SRGI कैंपस की स्मार्ट AI असिस्टेंट साथी हूँ। 🎓\n\nआप मुझसे कॉलेज के बारे में कुछ भी पूछ सकते हैं, जैसे:\n• 💻 CSE Section A का रास्ता व फैकल्टी\n• ⏰ क्लास टाइमिंग व वॉटर/लंच ब्रेक शेड्यूल\n• 🏛️ कैंपस के सभी 5 ब्लॉक्स (Block A, B, C, D, E)\n• 👥 एडमिन्स व टीम (सुमन कुमार, विवेक साहनी व अन्य)\n• 🎥 23 कैंपस वीडियो वॉकथ्रू रास्ते\n• 📚 सेंट्रल लाइब्रेरी, सेमिनार हॉल व दवाइयां\n\nआप जो भी सवाल पूछेंगे, मैं तुरंत बोलकर अपने-आप उत्तर दूँगी!";

export default function AIAssistantModal({ isOpen, onClose }: AIAssistantModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "bot",
      text: INITIAL_WELCOME_TEXT,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechIntervalRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Pre-load and track speech synthesis voices reliably
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        try {
          const list = window.speechSynthesis.getVoices();
          if (list && list.length > 0) {
            setAvailableVoices(list);
          }
        } catch {}
      };

      loadVoices();
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }
  }, []);

  // Setup Web Speech Recognition safely
  useEffect(() => {
    try {
      if (
        typeof window !== "undefined" &&
        ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
      ) {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        // Support Hindi recognition natively (with Hinglish)
        recognition.lang = "hi-IN";

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechNotice(null);
        };

        recognition.onresult = (event: any) => {
          try {
            const transcript = Array.from(event.results)
              .map((result: any) => result[0].transcript)
              .join("");
            setInputValue(transcript);
          } catch (e) {
            console.warn("Speech recognition parse error:", e);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          const errType = event?.error || "error";
          if (errType === "not-allowed" || errType === "service-not-allowed") {
            setSpeechNotice("माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र में mic allow करें या टाइप करें।");
          } else if (errType !== "no-speech") {
            setSpeechNotice("आवाज़ पहचानने में समस्या आई। आप लिखकर भी पूछ सकते हैं!");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    } catch (e) {
      console.warn("Web Speech Recognition API not available:", e);
    }

    return () => {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      } catch {}
      try {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      } catch {}
      if (speechIntervalRef.current) {
        clearInterval(speechIntervalRef.current);
        speechIntervalRef.current = null;
      }
      activeUtteranceRef.current = null;
    };
  }, []);

  // Stop listening & speaking if modal closes
  useEffect(() => {
    if (!isOpen) {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      } catch {}
      try {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      } catch {}
      if (speechIntervalRef.current) {
        clearInterval(speechIntervalRef.current);
        speechIntervalRef.current = null;
      }
      activeUtteranceRef.current = null;
      setIsListening(false);
      setIsSpeaking(false);
      setSpeakingMsgId(null);
      setSpeechNotice(null);
    }
  }, [isOpen]);

  const toggleListening = () => {
    setSpeechNotice(null);
    if (!recognitionRef.current) {
      setSpeechNotice("इस ब्राउज़र में वॉयस रिकॉग्निशन समर्थित नहीं है। आप नीचे टाइप करके पूछ सकते हैं!");
      setTimeout(() => setSpeechNotice(null), 5000);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      try {
        // Stop speech if speaking
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          if (speechIntervalRef.current) {
            clearInterval(speechIntervalRef.current);
            speechIntervalRef.current = null;
          }
          activeUtteranceRef.current = null;
          setIsSpeaking(false);
          setSpeakingMsgId(null);
        }
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        console.warn("Speech start error:", err);
        setIsListening(false);
        setSpeechNotice("माइक्रोफ़ोन शुरू नहीं हो पाया। कृपया माइक की परमिशन चेक करें।");
        setTimeout(() => setSpeechNotice(null), 5000);
      }
    }
  };

  // Clean formatted text into fluent, human-sounding speech with Hindi phonetics
  const cleanForSpeech = (raw: string): string => {
    return raw
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[*_#`~>]/g, " ")
      .replace(/[•–—]/g, ", ")
      .replace(/\s*\|\s*/g, ", ")
      .replace(/CSE Section A/gi, "सी एस ई सेक्शन ए")
      .replace(/CSE Section B/gi, "सी एस ई सेक्शन बी")
      .replace(/CSE Section C/gi, "सी एस ई सेक्शन सी")
      .replace(/CSE/gi, "सी एस ई")
      .replace(/B\.Tech/gi, "बी टेक")
      .replace(/HOD/gi, "एच ओ डी")
      .replace(/Ground Floor/gi, "ग्राउंड फ्लोर")
      .replace(/1st Floor/gi, "फर्स्ट फ्लोर")
      .replace(/2nd Floor/gi, "सेकंड फ्लोर")
      .replace(/3rd Floor/gi, "थर्ड फ्लोर")
      .replace(/4th Floor/gi, "फोर्थ फ्लोर")
      .replace(/Block A/gi, "ब्लॉक ए")
      .replace(/Block B/gi, "ब्लॉक बी")
      .replace(/Block C/gi, "ब्लॉक सी")
      .replace(/Block D/gi, "ब्लॉक डी")
      .replace(/Block E/gi, "ब्लॉक ई")
      .replace(/Er\./g, "इंजीनियर")
      .replace(/Gate 1/gi, "गेट एक")
      .replace(/Gate 2/gi, "गेट दो")
      .replace(/20m/gi, "20 मीटर")
      .replace(/300m/gi, "300 मीटर")
      .replace(/09:00 AM/gi, "सुबह 9 बजे")
      .replace(/04:30 PM/gi, "शाम साढ़े 4 बजे")
      .replace(/11:00 AM/gi, "सुबह 11 बजे")
      .replace(/12:10 PM/gi, "दोपहर 12 बजकर 10 मिनट")
      .replace(/01:00 PM/gi, "दोपहर 1 बजे")
      .replace(/02:10 PM/gi, "दोपहर 2 बजकर 10 मिनट")
      .replace(/03:20 PM/gi, "दोपहर 3 बजकर 20 मिनट")
      .replace(/AM/gi, "सुबह")
      .replace(/PM/gi, "शाम")
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, "") // strip emojis
      .replace(/\s+/g, " ")
      .trim();
  };

  // Speaks text aloud directly in natural Hindi
  const handleSpeakText = (text: string, msgId?: string) => {
    try {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setSpeechNotice("इस ब्राउज़र में आवाज़ (Text-to-Speech) उपलब्ध नहीं है।");
        return;
      }

      // If already speaking this exact message, toggle to stop
      if (isSpeaking && speakingMsgId === msgId) {
        window.speechSynthesis.cancel();
        if (speechIntervalRef.current) {
          clearInterval(speechIntervalRef.current);
          speechIntervalRef.current = null;
        }
        activeUtteranceRef.current = null;
        setIsSpeaking(false);
        setSpeakingMsgId(null);
        return;
      }

      // Cancel previous speech first
      window.speechSynthesis.cancel();
      if (speechIntervalRef.current) {
        clearInterval(speechIntervalRef.current);
        speechIntervalRef.current = null;
      }
      activeUtteranceRef.current = null;

      const speechText = cleanForSpeech(text);
      if (!speechText) return;

      // Small async timeout ensures Chrome processes cancel() before queuing new utterance
      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const utterance = new SpeechSynthesisUtterance(speechText);

          // CRITICAL: Anchor utterance reference so Chrome V8 Garbage Collector doesn't abort speech
          activeUtteranceRef.current = utterance;
          (window as any).__srgiActiveUtterance = utterance;

          // Pick best available voice
          const voices = window.speechSynthesis.getVoices().length > 0
            ? window.speechSynthesis.getVoices()
            : availableVoices;

          const hindiVoice = voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith("hi") ||
              v.name.toLowerCase().includes("hindi") ||
              v.name.toLowerCase().includes("lekha") ||
              v.name.toLowerCase().includes("kalpana") ||
              v.name.toLowerCase().includes("swara") ||
              v.name.toLowerCase().includes("madhur")
          );

          const indianVoice = voices.find(
            (v) =>
              v.lang.toLowerCase().includes("en-in") ||
              v.lang.toLowerCase().includes("en_in") ||
              v.name.toLowerCase().includes("india") ||
              v.name.toLowerCase().includes("ravi") ||
              v.name.toLowerCase().includes("heera") ||
              v.name.toLowerCase().includes("sangeeta")
          );

          if (hindiVoice) {
            utterance.voice = hindiVoice;
            utterance.lang = hindiVoice.lang;
          } else if (indianVoice) {
            utterance.voice = indianVoice;
            utterance.lang = indianVoice.lang;
          } else if (voices.length > 0) {
            const defaultVoice = voices.find((v) => v.default) || voices[0];
            utterance.voice = defaultVoice;
            utterance.lang = defaultVoice.lang;
          } else {
            utterance.lang = "hi-IN";
          }

          utterance.rate = 0.96; // Fluent, natural pacing
          utterance.pitch = 1.05; // Friendly warm tone

          utterance.onstart = () => {
            setIsSpeaking(true);
            setSpeakingMsgId(msgId || null);

            // Chrome bug workaround: keep-alive resume heartbeat during playback
            if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
            speechIntervalRef.current = setInterval(() => {
              if (typeof window !== "undefined" && "speechSynthesis" in window) {
                if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
                  window.speechSynthesis.resume();
                }
              }
            }, 1500);
          };

          utterance.onend = () => {
            setIsSpeaking(false);
            setSpeakingMsgId(null);
            activeUtteranceRef.current = null;
            if (speechIntervalRef.current) {
              clearInterval(speechIntervalRef.current);
              speechIntervalRef.current = null;
            }
          };

          utterance.onerror = (e) => {
            console.warn("Speech synthesis error:", e);
            setIsSpeaking(false);
            setSpeakingMsgId(null);
            activeUtteranceRef.current = null;
            if (speechIntervalRef.current) {
              clearInterval(speechIntervalRef.current);
              speechIntervalRef.current = null;
            }
          };

          window.speechSynthesis.speak(utterance);
        } catch (innerErr) {
          console.warn("Speech dispatch error:", innerErr);
          setIsSpeaking(false);
          setSpeakingMsgId(null);
        }
      }, 70);
    } catch (err) {
      console.warn("Speech synthesis trigger error:", err);
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    // Direct synchronous user-gesture audio unlock so browser won't block speech synthesis after async fetch
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.resume();
        const unlock = new SpeechSynthesisUtterance(" ");
        unlock.volume = 0.01;
        unlock.rate = 10;
        window.speechSynthesis.speak(unlock);
      } catch (e) {
        console.warn("Audio unlock error:", e);
      }
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      let botReply = "";
      if (response.ok) {
        const data = await response.json();
        botReply = data?.reply || "";
      }

      // If server returned empty or failed, use rich client-side knowledge engine
      if (!botReply || botReply.trim().length === 0) {
        botReply = getComprehensiveCampusAnswer(query);
      }

      // Privacy: Ensure no faculty phone numbers are output in chatbox responses
      botReply = botReply
        .replace(/(?:\+?91[\s-]?)?[6-9]\d{9}/g, "[फैकल्टी नंबर के लिए मुख्य पेज पर 'Faculties & Schedule' देखें]")
        .replace(/\b0522[- ]?\d{7}\b/g, "[नंबर के लिए 'Faculties & Schedule' देखें]");

      const botMessageId = `bot-${Date.now()}`;
      const botMessage: ChatMessage = {
        id: botMessageId,
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Direct Auto-Speech: AI immediately speaks the reply aloud without touching!
      if (autoSpeak) {
        setTimeout(() => {
          handleSpeakText(botReply, botMessageId);
        }, 100);
      }
    } catch (err) {
      console.warn("Chat error, using comprehensive campus knowledge engine:", err);
      let fallbackReply = getComprehensiveCampusAnswer(query);
      fallbackReply = fallbackReply
        .replace(/(?:\+?91[\s-]?)?[6-9]\d{9}/g, "[फैकल्टी नंबर के लिए मुख्य पेज पर 'Faculties & Schedule' देखें]")
        .replace(/\b0522[- ]?\d{7}\b/g, "[नंबर के लिए 'Faculties & Schedule' देखें]");
      const botMessageId = `bot-${Date.now()}`;
      const fallbackMessage: ChatMessage = {
        id: botMessageId,
        sender: "bot",
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);

      // Direct Auto-Speech for fallback response too
      if (autoSpeak) {
        setTimeout(() => {
          handleSpeakText(fallbackReply, botMessageId);
        }, 100);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "💻 CSE Section A का रास्ता व क्लास",
    "⏰ क्लास टाइमिंग व ब्रेक शेड्यूल बताओ",
    "👥 कॉलेज एडमिन्स व इंजीनियर्स टीम",
    "🏛️ कैंपस के 5 ब्लॉक्स के बारे में बताओ",
    "👨‍🏫 CSE फैकल्टी लिस्ट व फोन नंबर",
    "🎥 कैंपस के 8 वीडियो रास्ते दिखाओ",
    "📚 Central Library (लाइब्रेरी) कहाँ है?",
    "💊 दवाइयाँ, First-Aid व Store Room",
    "🎤 सेमिनार हॉल (Seminar Hall) का रास्ता",
    "☕ Central Cafeteria व Gate 2 कैफे",
    "🎓 कॉलेज का इतिहास व चेयरमैन",
  ];

  if (!isOpen) return null;

  return (
    <div
      id="ai-assistant-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
    >
      <div
        id="ai-assistant-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-xl h-[85vh] max-h-[680px] shadow-2xl flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d2e54] via-[#123f73] to-[#1261a0] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs text-amber-300 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold flex items-center gap-2">
                <span>SRGI Smart AI Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  हिंदी वॉयस
                </span>
              </div>
              <div className="text-xs text-blue-200 font-normal">
                कैंपस नेविगेटर • बोलती हुई AI गाइड
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Voice Tester Button */}
            <button
              onClick={() =>
                handleSpeakText(
                  "नमस्ते! मैं एसआरजीआई कैंपस साथी हूँ। मेरी आवाज़ अब बिल्कुल चालू है!",
                  "test-voice-header"
                )
              }
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-300/30 transition-all cursor-pointer"
              title="क्लिक करके आवाज़ टेस्ट करें"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">आवाज़ टेस्ट</span>
            </button>

            {/* Auto-Speak Direct Voice Toggle */}
            <button
              onClick={() => {
                const nextState = !autoSpeak;
                setAutoSpeak(nextState);
                if (!nextState && isSpeaking) {
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeaking(false);
                  setSpeakingMsgId(null);
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shadow-2xs ${
                autoSpeak
                  ? "bg-emerald-500 text-white shadow-emerald-500/30"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
              title={autoSpeak ? "Auto-Voice चालू है (AI बोलकर बताएगी)" : "Auto-Voice बंद है"}
            >
              <Volume1 className="w-3.5 h-3.5" />
              <span>{autoSpeak ? "बोलती है (ON)" : "आवाज़ (OFF)"}</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeaking(false);
                setSpeakingMsgId(null);
                setMessages([
                  {
                    id: "msg-reset",
                    sender: "bot",
                    text: INITIAL_WELCOME_TEXT,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ]);
              }}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              title="रीसेट करें (Clear chat)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestions Chips in Hindi */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-3 py-2 overflow-x-auto flex items-center gap-2 scrollbar-none shrink-0">
          <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0">
            जल्दी पूछें:
          </span>
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 text-[11px] font-medium bg-white text-slate-700 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-full shrink-0 transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Live Speaking Banner with Soundwave */}
        {isSpeaking && (
          <div className="px-4 py-2 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white text-xs font-medium flex items-center justify-between shadow-sm shrink-0 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-0.5 h-4">
                <span className="w-1 bg-white rounded-full animate-pulse h-2" />
                <span className="w-1 bg-white rounded-full animate-pulse h-4 delay-75" />
                <span className="w-1 bg-white rounded-full animate-pulse h-3 delay-150" />
                <span className="w-1 bg-white rounded-full animate-pulse h-4 delay-200" />
                <span className="w-1 bg-white rounded-full animate-pulse h-2 delay-300" />
              </div>
              <span className="font-semibold text-white tracking-wide">
                AI असिस्टेंट बोल रही है... (Speaking aloud)
              </span>
            </div>
            <button
              onClick={() => {
                if (typeof window !== "undefined" && "speechSynthesis" in window) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeaking(false);
                setSpeakingMsgId(null);
              }}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-[11px] font-bold text-white transition-colors"
            >
              बोलना रोकें (Stop)
            </button>
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            const isThisSpeaking = isSpeaking && speakingMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-[#123f73] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                      : "bg-[#123f73] text-white rounded-tr-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div
                    className={`mt-2 flex items-center justify-between gap-2 text-[10px] ${
                      isBot ? "text-slate-400" : "text-blue-200"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => handleSpeakText(msg.text, msg.id)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-all font-semibold ${
                          isThisSpeaking
                            ? "bg-blue-100 text-blue-800 animate-pulse"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                        title={isThisSpeaking ? "बोलना रोकें (Stop voice)" : "बोलकर सुनाओ (Read aloud)"}
                      >
                        {isThisSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-blue-700" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>सुनें (Listen)</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#123f73] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex items-center gap-2 text-xs text-slate-600">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>कैंपस का रास्ता खोज रही हूँ...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Notice if voice recognition issues or info */}
        {speechNotice && (
          <div className="px-4 py-2 bg-blue-50 border-t border-blue-200 text-xs text-blue-900 flex items-center justify-between">
            <span>{speechNotice}</span>
            <button
              onClick={() => setSpeechNotice(null)}
              className="text-[11px] font-bold text-blue-700 ml-2"
            >
              हटाएँ
            </button>
          </div>
        )}

        {/* Listening Indicator Bar if mic is active */}
        {isListening && (
          <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-200 text-xs font-semibold text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              आपकी आवाज़ सुन रही हूँ... बोलिए! (Listening...)
            </span>
            <button
              onClick={toggleListening}
              className="text-[11px] underline text-amber-700 font-bold"
            >
              रोकें (Stop)
            </button>
          </div>
        )}

        {/* Input Controls */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Box Mic Button */}
            <button
              type="button"
              id="speech-recognition-mic-btn"
              onClick={toggleListening}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isListening
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
              title={isListening ? "सुनना बंद करें" : "बोलकर पूछें (Voice Input)"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              id="ai-chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isListening
                  ? "सुन रही हूँ... बोलिए"
                  : "यहाँ कॉलेज के बारे में कुछ भी पूछें... (जैसे: CSE Section A, शेड्यूल, ब्लॉक्स)"
              }
              className="flex-1 px-4 py-3 bg-slate-100 rounded-2xl text-xs sm:text-sm border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />

            <button
              type="submit"
              id="ai-send-message-btn"
              disabled={!inputValue.trim() || isLoading}
              className="w-11 h-11 rounded-2xl bg-[#123f73] hover:bg-[#0e315b] disabled:opacity-40 disabled:hover:bg-[#123f73] text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
              title="भेजें"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
