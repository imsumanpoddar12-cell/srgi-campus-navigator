import { X, Heart, Award, Sparkles } from "lucide-react";
import SRGILogo from "./SRGILogo";

interface AcknowledgementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AcknowledgementModal({ isOpen, onClose }: AcknowledgementModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="ack-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        id="ack-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-4 flex justify-center">
          <SRGILogo size={56} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
          <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
          Gratitude & Acknowledgement
        </div>

        <h3 className="text-xl font-black text-[#102e59]">
          SRGI Campus Navigator
        </h3>

        <div className="text-xs sm:text-sm text-slate-600 space-y-3 mt-4 text-left leading-relaxed">
          <p>
            We express heartfelt gratitude to our honorable Chairman, <b>Shri Pawan Singh Chauhan</b>, our Director, respected Head of Department <b>Prashant Bajpai Sir</b>, and all distinguished faculty mentors for their constant guidance and encouragement.
          </p>
          <p>
            This Smart Campus Navigator was conceived and engineered by our student development team:
          </p>
          <ul className="list-disc pl-5 space-y-1 font-medium text-slate-800 text-xs">
            <li><b>Suman Kumar</b> — Leader (B.Tech CSE A)</li>
            <li><b>Vivek Sahani</b> — Co-Leader (B.Tech CSE A)</li>
            <li><b>Pranjal Maurya</b> — Core Member</li>
            <li><b>Roshan Kumar Bharti</b> — Core Member</li>
            <li><b>Rijawan Khan</b> — Core Member</li>
            <li><b>Avinash Prajapati</b> — Core Member</li>
            <li><b>Vivek Saroj</b> — Core Member</li>
          </ul>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Dedicated to easing navigation, accessibility, and communication for all students, faculties, parents, and campus visitors across SRGI Lucknow.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-6 py-2.5 bg-[#123f73] hover:bg-[#0e315b] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
        >
          Close Acknowledgement
        </button>
      </div>
    </div>
  );
}
