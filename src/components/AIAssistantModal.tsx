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

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_WELCOME_TEXT =
  "नमस्ते! मैं SRGI की स्मार्ट कैंपस AI असिस्टेंट हूँ।\n\nआप मुझसे किसी भी ब्लॉक, क्लासरूम, सेमिनार हॉल, लाइब्रेरी या फैकल्टी का रास्ता पूछ सकते हैं। मैं बोलकर भी बताऊँगी!\n\n📍 सेमिनार हॉल (Seminar Hall): Block A के Ground Floor पर स्थित है — Cafeteria से बिलकुल सीधे 20 metre, और Block B से 20 metre left जाने पर 20 metre right मुड़ें!";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Pre-load speech synthesis voices (fixes Chrome voice list delay)
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
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

  // Clean formatted text into fluent, human-sounding speech
  const cleanForSpeech = (raw: string): string => {
    return raw
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[*_#`~>]/g, "")
      .replace(/•/g, " ")
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, "") // strip emojis
      .replace(/\s+/g, " ")
      .trim();
  };

  // Speaks text aloud directly in Hindi
  const handleSpeakText = (text: string, msgId?: string) => {
    try {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setSpeechNotice("इस ब्राउज़र में आवाज़ (Text-to-Speech) उपलब्ध नहीं है।");
        return;
      }

      // If already speaking this exact message, toggle to stop
      if (isSpeaking && speakingMsgId === msgId) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setSpeakingMsgId(null);
        return;
      }

      window.speechSynthesis.cancel();

      const speechText = cleanForSpeech(text);
      if (!speechText) return;

      const utterance = new SpeechSynthesisUtterance(speechText);

      // Look for the best Hindi or Indian voice
      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith("hi") ||
          v.name.toLowerCase().includes("hindi") ||
          v.name.toLowerCase().includes("lekha") ||
          v.name.toLowerCase().includes("kalpana")
      );
      const indianVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().includes("in") ||
          v.name.toLowerCase().includes("india")
      );

      if (hindiVoice) {
        utterance.voice = hindiVoice;
        utterance.lang = hindiVoice.lang;
      } else if (indianVoice) {
        utterance.voice = indianVoice;
        utterance.lang = indianVoice.lang;
      } else {
        utterance.lang = "hi-IN";
      }

      utterance.rate = 0.96; // Smooth, natural pacing
      utterance.pitch = 1.05; // Friendly warm tone

      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeakingMsgId(msgId || null);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingMsgId(null);
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis playback error:", e);
        setIsSpeaking(false);
        setSpeakingMsgId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis trigger error:", err);
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

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

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botReply =
        data.reply ||
        "नमस्ते! मैं आपका प्रश्न समझ गई हूँ। कृपया बताएं कि आप SRGI कैंपस में किस ब्लॉक या कमरे में जाना चाहते हैं?";

      const botMessageId = `bot-${Date.now()}`;
      const botMessage: ChatMessage = {
        id: botMessageId,
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Direct Speech: If Auto-Speak is enabled, speak out loud immediately!
      if (autoSpeak) {
        setTimeout(() => {
          handleSpeakText(botReply, botMessageId);
        }, 150);
      }
    } catch (err) {
      console.warn("Chat error:", err);
      const fallbackReply =
        "नमस्ते! सेमिनार हॉल (Seminar Hall) Block A के Ground Floor पर स्थित है — Cafeteria से 20 metre सीधे, और Block B से 20m left जाने पर 20m right मुड़ें। Central Library Block A के 2nd Floor पर है, और CSE Section A Block C के 2nd Floor पर है!";
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
        }, 150);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "📍 सेमिनार हॉल (Seminar Hall) का रास्ता",
    "📍 Block B से सेमिनार हॉल कैसे जाएँ?",
    "📍 CSE Section A कहाँ है?",
    "📚 Central Library कहाँ है?",
    "🏢 Block D (Girls Hostel) & दवाइयाँ",
    "🛏️ Boys Hostel कितनी दूर है?",
    "👨‍🏫 CSE फैकल्टी लिस्ट व फोन नंबर",
    "☕ Cafeteria और Gate 2 कैफे",
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
                  : "यहाँ हिंदी में पूछें... (जैसे: सेमिनार हॉल कैसे जाएँ?)"
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
