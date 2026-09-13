import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, MessageSquare, Mail, Phone, User, Tag, HelpCircle, Sparkles } from "lucide-react";
import { UserMessage, TeamMember } from "../types";

interface SendMessageSectionProps {
  team: TeamMember[];
  onBackToHome?: () => void;
}

export default function SendMessageSection({ team, onBackToHome }: SendMessageSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("General Inquiry");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastMessageId, setLastMessageId] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    const newMessageId = `msg-${Date.now()}`;
    const newMsg: UserMessage = {
      id: newMessageId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      subject,
      message: message.trim(),
      timestamp: new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
      status: "unread",
    };

    try {
      const existing = localStorage.getItem("srgi_messages");
      const list: UserMessage[] = existing ? JSON.parse(existing) : [];
      list.unshift(newMsg);
      localStorage.setItem("srgi_messages", JSON.stringify(list));
    } catch {}

    setLastMessageId(newMessageId);
    setSubmitted(true);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <section id="send-message-section" className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold tracking-wider uppercase mb-2">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>हमसे संपर्क करें / संदेश भेजें</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#102e59] tracking-tight">
          SEND US A MESSAGE
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto mt-1">
          Have questions regarding campus locations, feedback, suggestions, or technical support? Send a direct message to the student developer team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  संदेश सफलतापूर्वक भेज दिया गया!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Thank you! Your message has been safely recorded with reference ID:
                  <span className="font-mono font-bold text-slate-800 ml-1">#{lastMessageId.slice(-6)}</span>.
                  Our team members will get back to you soon.
                </p>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Full Name (आपका नाम) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Phone Number (Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Subject / Topic (विषय)</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  <option value="General Inquiry">General Campus Inquiry</option>
                  <option value="Navigation & Routes">Campus Navigation & Route Help</option>
                  <option value="Hostel & Facilities">Hostel (Boys/Girls) or Facilities</option>
                  <option value="Timetable & Classes">Classrooms & Timetable</option>
                  <option value="Feedback & Improvement">Feedback & Improvement Suggestion</option>
                  <option value="Bug Report">Technical Bug or Issue</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Your Message (संदेश लिखें) *</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message, query, or suggestions here..."
                  className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send Message / संदेश भेजें</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Quick Connect & Official Channels */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-[#102e59] to-[#1a4a8a] text-white rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-base">Direct Developer Contacts</h3>
            </div>
            <p className="text-xs text-blue-100/90 leading-relaxed">
              Prefer direct email? You can reach out directly to the leadership team:
            </p>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold">Er. SUMAN KUMAR</div>
                  <div className="text-[11px] text-blue-200">Team Leader • Begusarai, Bihar</div>
                </div>
                <a
                  href="mailto:imsumanpoddar12@gmail.com"
                  className="px-2.5 py-1 bg-white text-[#102e59] rounded-lg font-bold text-[11px] hover:bg-blue-50 transition-colors"
                >
                  Email
                </a>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold">Er. PRANJAL MAURYA</div>
                  <div className="text-[11px] text-blue-200">Core Member • Varanasi, UP</div>
                </div>
                <a
                  href="mailto:pranjalmaurya1120@gmail.com"
                  className="px-2.5 py-1 bg-white text-[#102e59] rounded-lg font-bold text-[11px] hover:bg-blue-50 transition-colors"
                >
                  Email
                </a>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold">Er. RIJAWAN KHAN</div>
                  <div className="text-[11px] text-blue-200">Core Member • Maharajganj, UP</div>
                </div>
                <a
                  href="mailto:rijawan5657@gmail.com"
                  className="px-2.5 py-1 bg-white text-[#102e59] rounded-lg font-bold text-[11px] hover:bg-blue-50 transition-colors"
                >
                  Email
                </a>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Response Time & Support</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Messages submitted through this form are instantly synced with the Admin Dashboard inbox. Queries are reviewed regularly during campus working hours (9:00 AM - 5:00 PM).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
