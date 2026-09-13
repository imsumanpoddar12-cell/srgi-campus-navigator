import { useState } from "react";
import {
  MessageSquare,
  Send,
  X,
  CheckCircle2,
  Sparkles,
  User,
  Mail,
  Phone,
  Tag,
  AlertCircle,
} from "lucide-react";

export interface StudentSuggestion {
  id: string;
  name: string;
  contact: string; // Email or Phone
  department?: string;
  category: "facility" | "library" | "campus-feedback" | "academics" | "app-feature" | "general";
  message: string;
  createdAt: string;
  status: "unread" | "reviewed";
}

interface SuggestionBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuggestionBoxModal({ isOpen, onClose }: SuggestionBoxModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState<StudentSuggestion["category"]>("campus-feedback");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("कृपया अपना नाम दर्ज करें (Please enter your name)");
      return;
    }
    if (!contact.trim()) {
      setErrorMsg("कृपया अपना ईमेल या मोबाइल नंबर दर्ज करें (Contact required)");
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setErrorMsg("कृपया अपना संदेश या सुझाव विस्तार से लिखें (At least 5 characters)");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const newSuggestion: StudentSuggestion = {
        id: `sugg-${Date.now()}`,
        name: name.trim(),
        contact: contact.trim(),
        department: department.trim() || "Student / Visitor",
        category,
        message: message.trim(),
        createdAt: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        status: "unread",
      };

      const existingRaw = localStorage.getItem("srgi_suggestions");
      const existingList: StudentSuggestion[] = existingRaw ? JSON.parse(existingRaw) : [];
      existingList.unshift(newSuggestion);
      localStorage.setItem("srgi_suggestions", JSON.stringify(existingList));

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error("Save suggestion error:", err);
      setIsSubmitting(false);
      setErrorMsg("सुझाव सेव करने में त्रुटि हुई। कृपया दोबारा प्रयास करें।");
    }
  };

  const handleReset = () => {
    setName("");
    setContact("");
    setDepartment("");
    setMessage("");
    setSubmitted(false);
    setErrorMsg("");
  };

  return (
    <>
      <div
        id="suggestion-modal-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-opacity"
      />

      <div
        id="suggestion-modal-dialog"
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:max-w-lg sm:mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d2e54] via-[#123f73] to-[#1a5b9b] px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-amber-300 border border-white/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight flex items-center gap-2">
                <span>सुझाव पेटी • Suggestion Box</span>
              </div>
              <p className="text-[11px] text-blue-200 font-medium">
                Send us a message / सुझाव या प्रतिक्रिया भेजें
              </p>
            </div>
          </div>

          <button
            id="close-suggestion-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                सुझाव सफलतापूर्वक प्राप्त हुआ!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you for your valuable feedback. आपका संदेश SRGI एडमिनिस्ट्रेशन और टीम को भेज दिया गया है।
              </p>

              <div className="pt-3 flex gap-3 justify-center">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  एक और संदेश भेजें
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#123f73] hover:bg-[#0e2c52] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  बंद करें (Done)
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  आपका नाम (Full Name) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. अमित शर्मा / छात्र / अभिभावक"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ईमेल / फ़ोन नंबर (Contact) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="email@example.com या Mobile"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    विभाग / कोर्स (Optional)
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="B.Tech CSE / Diploma / MBA etc."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  सुझाव की श्रेणी (Category)
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:bg-white focus:outline-blue-600"
                  >
                    <option value="campus-feedback">Campus Feedback / परिसर प्रतिक्रिया</option>
                    <option value="library">Central Library / पुस्तकालय सुझाव</option>
                    <option value="facility">Campus Facilities & Cafeteria / सुविधाएं</option>
                    <option value="academics">Academics & Timetable / कक्षाएं</option>
                    <option value="app-feature">Website & Navigation App Improvement</option>
                    <option value="general">Other General Message / अन्य संदेश</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  आपका संदेश या सुझाव (Your Message / Suggestion) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="अपना सुझाव, विचार या समस्या यहाँ विस्तार से लिखें..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:outline-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#123f73] hover:bg-[#0e2c52] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "भेजा जा रहा है..." : "संदेश भेजें (Send Message)"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
