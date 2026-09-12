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
} from "lucide-react";
import { ChatMessage } from "../types";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistantModal({ isOpen, onClose }: AIAssistantModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "bot",
      text: "Namaste & Welcome! I am the Gemini Smart Campus Assistant for SR Group of Institutions. Ask me directions to any block, classroom, lab, HOD office, faculties, timetable, hostels, or campus amenities!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
        recognition.lang = "en-IN"; // English (India) with natural Hindi/Hinglish understanding

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
            console.warn("Speech parse error:", e);
          }
        };

        recognition.onerror = (event: any) => {
          setIsListening(false);
          const errType = event?.error || "error";
          if (errType === "not-allowed" || errType === "service-not-allowed") {
            setSpeechNotice("Microphone permission was denied. Please allow microphone access.");
          } else if (errType !== "no-speech") {
            setSpeechNotice("Voice recognition encountered an issue. You can still type your question!");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    } catch (e) {
      console.warn("Web Speech API not available:", e);
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

  // Stop listening/speaking if modal closes
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
      setSpeechNotice(null);
    }
  }, [isOpen]);

  const toggleListening = () => {
    setSpeechNotice(null);
    if (!recognitionRef.current) {
      setSpeechNotice("Speech recognition is not supported in this browser or iframe. Please type your query!");
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
        setIsListening(true);
      } catch (err: any) {
        console.warn("Speech start error:", err);
        setIsListening(false);
        setSpeechNotice("Could not start voice recognition. Please verify microphone permissions.");
        setTimeout(() => setSpeechNotice(null), 5000);
      }
    }
  };

  const handleSpeakText = (text: string) => {
    try {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      if (isSpeaking) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
        setIsSpeaking(false);
        return;
      }

      const cleanText = text.replace(/[*_#]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-IN";
      utterance.rate = 1.0;

      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
      setIsSpeaking(false);
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
      const botReply = data.reply || "Sorry, I could not fetch directions at this moment.";

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "I could not connect to the campus server. However, you can find Block A for administration and library, Block C for CSE and tech branches, Block D for Girls Hostel, and Block E for senior classes!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Where is CSE Section A?",
    "Where is the Central Library?",
    "Where is Block D (Girls Hostel)?",
    "Where is Block E (Senior classes)?",
    "Where are medicines & first aid?",
    "How far is the Boys Hostel?",
    "Directions to Seminar Hall from cafeteria",
    "List of faculties and phone numbers",
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
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold flex items-center gap-2">
                <span>Gemini Campus Navigator</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Online
                </span>
              </div>
              <div className="text-xs text-blue-200 font-normal">
                Ask directions, blocks, labs, faculties & hostel info
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setMessages([
                  {
                    id: "msg-reset",
                    sender: "bot",
                    text: "Conversation refreshed. How may I guide you through the SRGI campus today?",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ]);
              }}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white"
              title="Clear chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestions Chips */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-3 py-2 overflow-x-auto flex items-center gap-2 scrollbar-none shrink-0">
          <span className="text-[10px] font-bold uppercase text-slate-500 shrink-0">
            Quick Ask:
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

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
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
                  className={`max-w-[82%] rounded-2xl p-3.5 shadow-xs text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
                      : "bg-[#123f73] text-white rounded-tr-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div
                    className={`mt-1.5 flex items-center justify-between gap-2 text-[10px] ${
                      isBot ? "text-slate-400" : "text-blue-200"
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        className="p-1 hover:text-slate-600 rounded transition-colors"
                        title="Read aloud"
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
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
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Navigating campus map with Gemini...</span>
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
              Dismiss
            </button>
          </div>
        )}

        {/* Listening Indicator Bar if mic is active */}
        {isListening && (
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-xs font-semibold text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              Listening to your voice... Speak now!
            </span>
            <button
              onClick={toggleListening}
              className="text-[11px] underline text-amber-700 font-bold"
            >
              Stop
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
            {/* Upgraded Voice Box Button */}
            <button
              type="button"
              id="speech-recognition-mic-btn"
              onClick={toggleListening}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isListening
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
              title={isListening ? "Stop listening" : "Click to speak voice input"}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              id="ai-chat-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask campus direction, block, lab or faculty..."}
              className="flex-1 px-4 py-3 bg-slate-100 rounded-2xl text-xs sm:text-sm border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
            />

            <button
              type="submit"
              id="ai-send-message-btn"
              disabled={!inputValue.trim() || isLoading}
              className="w-11 h-11 rounded-2xl bg-[#123f73] hover:bg-[#0e315b] disabled:opacity-40 disabled:hover:bg-[#123f73] text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
