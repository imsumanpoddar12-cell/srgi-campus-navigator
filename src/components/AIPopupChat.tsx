import { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Maximize2,
  Minimize2,
  RotateCcw,
  Compass,
  MessageSquare,
  HelpCircle,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { getComprehensiveCampusAnswer } from "../data/campusKnowledge";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface AIPopupChatProps {
  onOpenFullModal?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const INITIAL_POPUP_WELCOME = `नमस्ते! मैं **SRGI साथी** हूँ — आपकी ऑफिशियल स्मार्ट कैंपस AI गाइड।
आप मुझसे कोई भी सवाल पूछ सकते हैं जैसे:
• **CSE Section A** कहाँ है और रास्ता?
• **क्लास का समय, लंच व वाटर ब्रेक**
• **Block A, B, C, D, E** के सभी फ्लोर्स
• **23 ऑफिशियल वीडियो वॉकथ्रू**

👉 आप नीचे लिखकर पूछें या माइक दबाकर बोलें — **मैं खुद बोलकर उत्तर दूंगी!**`;

const QUICK_PROMPTS = [
  { label: "💻 CSE Section A रास्ता", query: "CSE Section A kahan hai aur kaise jayein?" },
  { label: "🏛️ Block C 2nd Floor", query: "Block C second floor layout and departments" },
  { label: "⏰ क्लास व ब्रेक टाइमिंग", query: "Class timetable lunch aur water break timing" },
  { label: "🎤 सेमिनार हॉल कहाँ है?", query: "Seminar Hall kahan hai aur kaise jayein?" },
  { label: "👥 कॉलेज एडमिन्स व टीम", query: "College admins aur developer team members" },
  { label: "🎥 कैंपस वीडियोज", query: "Campus ke walking route videos kahan hain?" },
];

export default function AIPopupChat({
  onOpenFullModal,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
}: AIPopupChatProps) {
  // Can be controlled or internal state
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleOpen = () => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "bot-welcome",
      sender: "bot",
      text: INITIAL_POPUP_WELCOME,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true); // "khud bolne lage sawaaall puchhne par"
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechIntervalRef = useRef<any>(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Load voices on mount
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

  // Speech recognition setup
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
            setSpeechNotice("माइक्रोफ़ोन अनुमति नहीं मिली। कृपया mic allow करें या टाइप करें।");
          } else if (errType !== "no-speech") {
            setSpeechNotice("आवाज़ पहचानने में समस्या आई। आप लिखकर पूछ सकते हैं!");
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
        if (recognitionRef.current) recognitionRef.current.stop();
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
        setSpeechNotice("इस ब्राउज़र में Text-to-Speech उपलब्ध नहीं है।");
        return;
      }

      // If already speaking this message, toggle stop
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

      window.speechSynthesis.cancel();
      if (speechIntervalRef.current) {
        clearInterval(speechIntervalRef.current);
        speechIntervalRef.current = null;
      }
      activeUtteranceRef.current = null;

      const speechText = cleanForSpeech(text);
      if (!speechText) return;

      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const utterance = new SpeechSynthesisUtterance(speechText);
          activeUtteranceRef.current = utterance;
          (window as any).__srgiPopupUtterance = utterance;

          const voices =
            window.speechSynthesis.getVoices().length > 0
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
              v.name.toLowerCase().includes("ravi")
          );

          if (hindiVoice) {
            utterance.voice = hindiVoice;
            utterance.lang = hindiVoice.lang;
          } else if (indianVoice) {
            utterance.voice = indianVoice;
            utterance.lang = indianVoice.lang;
          } else if (voices.length > 0) {
            utterance.voice = voices.find((v) => v.default) || voices[0];
          } else {
            utterance.lang = "hi-IN";
          }

          utterance.rate = 0.96;
          utterance.pitch = 1.05;

          utterance.onstart = () => {
            setIsSpeaking(true);
            setSpeakingMsgId(msgId || null);

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

          utterance.onerror = () => {
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
          console.warn("Popup speech dispatch error:", innerErr);
          setIsSpeaking(false);
          setSpeakingMsgId(null);
        }
      }, 70);
    } catch (err) {
      console.warn("Popup speech synthesis trigger error:", err);
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    }
  };

  const handleStopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (speechIntervalRef.current) {
      clearInterval(speechIntervalRef.current);
      speechIntervalRef.current = null;
    }
    activeUtteranceRef.current = null;
    setIsSpeaking(false);
    setSpeakingMsgId(null);
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
      } catch {}
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

      // Direct Auto-Speech: AI immediately speaks the reply aloud ("khud bolne lage sawaaall puchhne par")!
      if (autoSpeak) {
        setTimeout(() => {
          handleSpeakText(botReply, botMessageId);
        }, 120);
      }
    } catch (err) {
      console.warn("Popup chat error, using comprehensive campus knowledge engine:", err);
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

      if (autoSpeak) {
        setTimeout(() => {
          handleSpeakText(fallbackReply, botMessageId);
        }, 120);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    setSpeechNotice(null);
    if (!recognitionRef.current) {
      setSpeechNotice("इस ब्राउज़र में वॉयस रिकॉग्निशन समर्थित नहीं है। आप नीचे टाइप कर सकते हैं!");
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
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Speech recognition start failed:", e);
        setSpeechNotice("माइक्रोफ़ोन चालू नहीं हो सका। कृपया mic allow करें।");
      }
    }
  };

  const handleClearChat = () => {
    handleStopSpeech();
    setMessages([
      {
        id: "bot-welcome-reset",
        sender: "bot",
        text: INITIAL_POPUP_WELCOME,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Trigger (When Pop-up is closed) */}
      {!isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-40">
          <button
            id="open-ai-popup-chat-btn"
            onClick={toggleOpen}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#0d2e54] via-[#123f73] to-[#1261a0] hover:from-[#0a2342] hover:to-[#0f548a] text-white rounded-full shadow-2xl shadow-blue-900/40 border-2 border-blue-400/40 cursor-pointer transition-all transform hover:scale-105 active:scale-95"
            aria-label="Open AI Assistant Pop-up Chat"
          >
            {/* Animated Ping Glow */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white"></span>
            </span>

            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/40 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>

            <div className="text-left">
              <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
                <span>SRGI साथी AI</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold uppercase">
                  POP-UP
                </span>
              </div>
              <div className="text-[10px] text-blue-200 font-medium">
                सवाल पूछें • खुद बोलेगी 🔊
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Floating Pop-up Chat Window */}
      {isOpen && (
        <aside
          id="ai-popup-chat-window"
          aria-label="AI Assistant Popup Chat"
          className="fixed bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[390px] h-[540px] max-h-[calc(100vh-100px)] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-blue-950/40 border border-blue-500/30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Pop-up Header */}
          <div className="bg-gradient-to-r from-[#0d2e54] via-[#123f73] to-[#1261a0] p-3.5 text-white flex items-center justify-between border-b border-blue-400/20 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/40 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                {isSpeaking && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#123f73] rounded-full animate-ping" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-wide truncate">
                    SRGI साथी AI
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-bold border border-emerald-400/30">
                    Live
                  </span>
                </div>
                <div className="text-[10px] text-blue-200 font-medium truncate flex items-center gap-1">
                  <span>{isSpeaking ? "🔊 बोल रही है..." : "ऑनलाइन • सवाल पूछें"}</span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Voice On/Off Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) handleStopSpeech();
                  setAutoSpeak((prev) => !prev);
                }}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  autoSpeak
                    ? "bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/30"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
                title={autoSpeak ? "Auto Voice ON (खुद बोलती है) - क्लिक करके म्यूट करें" : "Auto Voice OFF - क्लिक करके ऑन करें"}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Expand to Full Modal */}
              {onOpenFullModal && (
                <button
                  onClick={() => {
                    handleStopSpeech();
                    onOpenFullModal();
                  }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Expand to Full Screen View"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}

              {/* Clear chat */}
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Reset / Clear Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Minimize / Close */}
              <button
                onClick={toggleOpen}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Minimize Pop-up"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Auto Voice Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 border-b border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>
                <b>Auto Voice:</b> सवाल पूछने पर AI खुद बोलेगी!
              </span>
            </div>
            {isSpeaking && (
              <button
                onClick={handleStopSpeech}
                className="text-[10px] font-bold text-rose-700 dark:text-rose-400 hover:underline cursor-pointer"
              >
                Stop Voice (बंद करें)
              </button>
            )}
          </div>

          {/* Speech Notice Toast */}
          {speechNotice && (
            <div className="bg-blue-100 dark:bg-blue-950/60 px-3 py-1 text-[11px] text-blue-900 dark:text-blue-200 text-center border-b border-blue-200">
              {speechNotice}
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/60 dark:bg-slate-900/60 text-xs">
            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              const isCurrentSpeaking = isSpeaking && speakingMsgId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isBot ? "justify-start" : "justify-end"}`}
                >
                  {isBot && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[84%] rounded-2xl p-3 shadow-xs ${
                      isBot
                        ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700"
                        : "bg-gradient-to-r from-[#123f73] to-[#1261a0] text-white"
                    } ${isCurrentSpeaking ? "ring-2 ring-amber-400" : ""}`}
                  >
                    {/* Render Text / Markdown */}
                    <div className="whitespace-pre-line leading-relaxed break-words font-normal">
                      {msg.text}
                    </div>

                    {/* Footer bar with time and voice controls */}
                    <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>

                      {isBot && (
                        <button
                          onClick={() => handleSpeakText(msg.text, msg.id)}
                          className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                            isCurrentSpeaking
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-blue-100 hover:text-blue-800"
                          }`}
                        >
                          {isCurrentSpeaking ? (
                            <>
                              <VolumeX className="w-3 h-3 text-rose-600 animate-spin" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3 text-blue-600" />
                              <span>Sunen (बोलें)</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5 shadow-xs font-bold text-[10px]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2 items-center text-slate-500 dark:text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce delay-200" />
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 ml-1">
                    उत्तर तैयार हो रहा है...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Prompt Chips */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.query)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 hover:text-blue-900 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors border border-slate-200/60 dark:border-slate-700 shrink-0 cursor-pointer"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Form Bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5"
            >
              {/* Mic Voice Input */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isListening
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-800"
                }`}
                title={isListening ? "Listening... click to stop" : "Speak Hindi/English"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isListening ? "सुन रहे हैं... बोलिए..." : "सवाल पूछें... (e.g. CSE A rasta)"}
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 dark:border-slate-700"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl disabled:opacity-40 transition-all cursor-pointer shrink-0 shadow-xs"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </aside>
      )}
    </>
  );
}
