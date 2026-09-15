import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Bot,
  User,
  Loader2,
  HelpCircle,
  Film,
  RotateCcw,
} from "lucide-react";
import { ChatMessage } from "../types";
import { getComprehensiveCampusAnswer } from "../data/campusKnowledge";

interface AIPopupChatboxProps {
  onOpenFullModal: () => void;
  isFullModalOpen: boolean;
}

const INITIAL_POPUP_WELCOME =
  "नमस्ते! मैं SRGI की AI साथी हूँ। 🎓\n\nआप मुझसे क्लास, फैकल्टी, 23 वीडियो रास्ते, लाइब्रेरी या टाइमिंग के बारे में कुछ भी पूछ सकते हैं — **मैं तुरंत बोलकर उत्तर दूँगी!**";

export default function AIPopupChatbox({
  onOpenFullModal,
  isFullModalOpen,
}: AIPopupChatboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "popup-msg-init",
      sender: "bot",
      text: INITIAL_POPUP_WELCOME,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechIntervalRef = useRef<any>(null);

  // Auto-scroll inside chat feed
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Web Speech Recognition
  useEffect(() => {
    try {
      if (
        typeof window !== "undefined" &&
        ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
      ) {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = "hi-IN";

        rec.onstart = () => {
          setIsListening(true);
          setSpeechNotice(null);
        };

        rec.onresult = (event: any) => {
          try {
            const transcript = Array.from(event.results)
              .map((r: any) => r[0].transcript)
              .join("");
            setInputValue(transcript);
          } catch {}
        };

        rec.onerror = (e: any) => {
          setIsListening(false);
          if (e?.error !== "no-speech") {
            setSpeechNotice("माइक आवाज़ सुनने में रुकावट। आप टाइप कर सकते हैं!");
            setTimeout(() => setSpeechNotice(null), 4000);
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    } catch {}

    return () => {
      stopSpeech();
    };
  }, []);

  // When full modal opens, close popup to avoid overlapping
  useEffect(() => {
    if (isFullModalOpen) {
      setIsOpen(false);
      stopSpeech();
    }
  }, [isFullModalOpen]);

  // Clean formatted text for natural Hindi speech
  const cleanForSpeech = (raw: string): string => {
    return raw
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[*_#`~>]/g, " ")
      .replace(/[•–—]/g, ", ")
      .replace(/\s*\|\s*/g, ", ")
      .replace(/CSE Section A/gi, "सी एस ई सेक्शन ए")
      .replace(/CSE/gi, "सी एस ई")
      .replace(/B\.Tech/gi, "बी टेक")
      .replace(/HOD/gi, "एच ओ डी")
      .replace(/Ground Floor/gi, "ग्राउंड फ्लोर")
      .replace(/1st Floor/gi, "फर्स्ट फ्लोर")
      .replace(/2nd Floor/gi, "सेकंड फ्लोर")
      .replace(/Block A/gi, "ब्लॉक ए")
      .replace(/Block B/gi, "ब्लॉक बी")
      .replace(/Block C/gi, "ब्लॉक सी")
      .replace(/Block D/gi, "ब्लॉक डी")
      .replace(/Block E/gi, "ब्लॉक ई")
      .replace(/Gate 1/gi, "गेट एक")
      .replace(/Gate 2/gi, "गेट दो")
      .replace(/09:00 AM/gi, "सुबह 9 बजे")
      .replace(/04:30 PM/gi, "शाम साढ़े 4 बजे")
      .replace(/12:10 PM/gi, "दोपहर 12 बजकर 10 मिनट")
      .replace(/01:00 PM/gi, "दोपहर 1 बजे")
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const stopSpeech = () => {
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
    setIsSpeaking(false);
  };

  const speakText = (text: string) => {
    stopSpeech();
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const cleaned = cleanForSpeech(text);
    if (!cleaned) return;

    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(cleaned);
        activeUtteranceRef.current = utterance;
        (window as any).__srgiPopupUtterance = utterance;

        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith("hi") ||
            v.name.toLowerCase().includes("hindi") ||
            v.name.toLowerCase().includes("kalpana") ||
            v.name.toLowerCase().includes("lekha")
        );
        const indianVoice = voices.find((v) => v.lang.toLowerCase().includes("en-in") || v.name.toLowerCase().includes("india"));

        if (hindiVoice) {
          utterance.voice = hindiVoice;
          utterance.lang = hindiVoice.lang;
        } else if (indianVoice) {
          utterance.voice = indianVoice;
          utterance.lang = indianVoice.lang;
        } else {
          utterance.lang = "hi-IN";
        }

        utterance.rate = 0.96;
        utterance.pitch = 1.05;

        utterance.onstart = () => {
          setIsSpeaking(true);
          // Chrome keepalive
          if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
          speechIntervalRef.current = setInterval(() => {
            if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
          }, 1500);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          activeUtteranceRef.current = null;
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
          activeUtteranceRef.current = null;
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn("Speech synthesis trigger issue:", err);
        setIsSpeaking(false);
      }
    }, 60);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechNotice("इस ब्राउज़र में माइक उपलब्ध नहीं है। कृपया टाइप करें।");
      setTimeout(() => setSpeechNotice(null), 3000);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      stopSpeech();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputValue).trim();
    if (!q || isLoading) return;

    // Gesture unlock audio context
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.resume();
        const unlock = new SpeechSynthesisUtterance(" ");
        unlock.volume = 0.01;
        window.speechSynthesis.speak(unlock);
      } catch {}
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      let reply = "";
      if (res.ok) {
        const data = await res.json();
        reply = data?.reply || "";
      }

      if (!reply || reply.trim().length === 0) {
        reply = getComprehensiveCampusAnswer(q);
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Direct auto speech: "khud bolne lage sawaaall puchhne par"
      if (autoSpeak) {
        setTimeout(() => {
          speakText(reply);
        }, 100);
      }
    } catch {
      const fallback = getComprehensiveCampusAnswer(q);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);

      if (autoSpeak) {
        setTimeout(() => {
          speakText(fallback);
        }, 100);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickChips = [
    "💻 CSE Section A रास्ता",
    "⏰ क्लास टाइमिंग व शेड्यूल",
    "👥 कॉलेज एडमिन्स व इंजीनियर्स",
    "🎥 23 कैंपस वीडियो रास्ते",
    "📚 सेंट्रल लाइब्रेरी कहाँ है?",
    "💊 दवाइयाँ व First-Aid",
  ];

  return (
    <div
      id="ai-popup-chatbox-container"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40"
    >
      {/* Pop-up Chat Window */}
      {isOpen ? (
        <div className="w-[calc(100vw-32px)] sm:w-[390px] h-[520px] max-h-[80vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-blue-600/30 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0d2e54] via-[#123f73] to-[#1261a0] text-white p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-300/40 flex items-center justify-center text-amber-300">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wide">SRGI AI साथी</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-blue-200/90 font-medium">
                  {isSpeaking ? "🔊 बोल रही हूँ..." : "बोलकर उत्तर देने वाली स्मार्ट गाइड"}
                </div>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1">
              {/* Voice auto-speak toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeech();
                  setAutoSpeak(!autoSpeak);
                }}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  autoSpeak ? "bg-amber-400/20 text-amber-300" : "text-slate-300 hover:bg-white/10"
                }`}
                title={autoSpeak ? "Auto-Speak ON (उत्तर खुद बोलेगी)" : "Auto-Speak OFF"}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Expand to full modal */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenFullModal();
                }}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Open Full Screen Modal"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Minimize/Close */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  stopSpeech();
                }}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Minimize Chatbox"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Speaking Wave Banner if Speaking */}
          {isSpeaking && (
            <div className="bg-amber-500 text-slate-950 px-3 py-1.5 text-[11px] font-bold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="flex gap-0.5">
                  <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-slate-950 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-2 bg-slate-950 rounded-full animate-bounce [animation-delay:0.3s]" />
                </span>
                <span>AI बोल रही है (Audio Active)...</span>
              </div>
              <button
                onClick={stopSpeech}
                className="px-2 py-0.5 bg-slate-950 text-amber-400 rounded-md text-[10px] font-black cursor-pointer"
              >
                Stop ⏹
              </button>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-2xl shadow-xs whitespace-pre-line leading-relaxed ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none"
                  }`}
                >
                  <p>{m.text}</p>
                  {m.sender === "bot" && (
                    <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-400">
                      <span>{m.timestamp}</span>
                      <button
                        onClick={() => speakText(m.text)}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen Again</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-slate-500 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>उत्तर तैयार कर रही हूँ और बोलने वाली हूँ...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 bg-white dark:bg-slate-700 hover:bg-blue-50 text-slate-700 dark:text-slate-200 hover:text-blue-700 text-[11px] font-medium rounded-lg whitespace-nowrap border border-slate-200 dark:border-slate-600 transition-colors shrink-0 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            {speechNotice && (
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mb-1">
                {speechNotice}
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="सफ़र या क्लास का सवाल पूछें..."
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={toggleListening}
                className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
                title="Voice input (बोलकर पूछें)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isLoading}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Minimized Floating Launcher Bubble */
        <div className="flex items-center gap-2">
          {/* Teaser pill on first load */}
          {showTeaser && (
            <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3 py-2 rounded-2xl shadow-xl border border-blue-500/20 text-xs font-medium animate-in fade-in slide-in-from-right duration-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>सफ़र पूछें • <b>मैं बोलकर बताऊँगी!</b></span>
              <button
                onClick={() => setShowTeaser(false)}
                className="text-slate-400 hover:text-slate-600 text-xs ml-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Floating Trigger Button */}
          <button
            id="floating-ai-popup-btn"
            onClick={() => {
              setIsOpen(true);
              setShowTeaser(false);
            }}
            className="group px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0d2e54] via-[#123f73] to-[#1261a0] hover:from-[#0b2442] hover:to-[#0f4d80] text-white shadow-xl shadow-blue-900/30 flex items-center gap-2 border border-blue-300/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs font-black tracking-wide flex items-center gap-1">
                <span>SRGI AI साथी</span>
                <Volume2 className="w-3 h-3 text-amber-300" />
              </div>
              <div className="text-[10px] text-blue-200">बोलकर उत्तर देगी</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
