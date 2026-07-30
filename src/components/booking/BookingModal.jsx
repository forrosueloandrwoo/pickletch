import { useEffect, useState } from "react";

function formatSlotLabel(hour) {
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;
  const period = hour < 12 ? "AM" : "PM";
  return `${displayHour}:00 ${period}`;
}

function generateReference() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  return `PT-${stamp}`;
}

// Accepts 09XXXXXXXXX or +639XXXXXXXXX, ignoring spaces/dashes the user might type
function isValidPhPhone(value) {
  const digitsOnly = value.replace(/[\s-]/g, "");
  return /^(\+63|0)9\d{9}$/.test(digitsOnly);
}

function isValidGmail(value) {
  return /^[^\s@]+@gmail\.com$/i.test(value.trim());
}

export default function BookingModal({ isOpen, draft, onClose, onConfirm }) {
  const [step, setStep] = useState("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep("details");
      setName(""); setPhone(""); setEmail("");
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen || !draft) return null;

  const handleSubmitDetails = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!isValidPhPhone(phone)) {
      setError("Please enter a valid Philippine mobile number, e.g. 0912 345 6789.");
      return;
    }
    if (!isValidGmail(email)) {
      setError("Please enter a valid Gmail address, e.g. juandelacruz@gmail.com.");
      return;
    }
    setError("");
    setReference(generateReference());
    setStep("receipt");
  };

  const handleConfirmPayment = () => {
    onConfirm({ name, phone, email, reference });
  };

  const slotList = draft.entries
    .map(({ hour, courtNum }) => `Court ${courtNum}, ${formatSlotLabel(hour)}`)
    .join(", ");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

        {step === "details" && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display text-xl font-bold text-gray-800">Almost there</h3>
              <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-5">
              {draft.entries.length} slot{draft.entries.length > 1 ? "s" : ""} on {draft.dateLabel} — ₱{draft.total}
            </p>

            <form className="space-y-4" onSubmit={handleSubmitDetails}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  required type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="0912 345 6789"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">Philippine mobile number, e.g. 0912 345 6789</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">Must be a Gmail address, e.g. you@gmail.com</p>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Continue to Payment
              </button>
            </form>
          </div>
        )}

        {step === "receipt" && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-gray-800">Scan to Pay</h3>
              <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 text-sm">
              <div className="flex justify-between py-1"><span className="text-gray-500">Reference No.</span><span className="font-semibold text-gray-800">{reference}</span></div>
              <div className="flex justify-between py-1"><span className="text-gray-500">Name</span><span className="font-semibold text-gray-800">{name}</span></div>
              <div className="flex justify-between py-1"><span className="text-gray-500">Date</span><span className="font-semibold text-gray-800">{draft.dateLabel}</span></div>
              <div className="flex justify-between py-1 items-start"><span className="text-gray-500">Slots</span><span className="font-semibold text-gray-800 text-right">{slotList}</span></div>
              <div className="flex justify-between py-2 mt-1 border-t border-gray-200"><span className="text-gray-700 font-semibold">Total</span><span className="font-bold text-green-700 text-base">₱{draft.total}</span></div>
            </div>

            {/*
              Drop your real GCash / bank QR screenshot at public/images/payment-qr.png
              (see public/images/README.txt). Until that file exists, the browser
              will just show a broken-image icon here -- that's expected and fine,
              it's a placeholder until you have the real QR to swap in.
            */}
            <div className="flex flex-col items-center mb-5">
              <img
                src="/images/payment-qr.png"
                alt="Scan to pay via GCash"
                className="w-48 h-48 mx-auto rounded-lg border border-gray-200 object-contain bg-white"
              />
              <p className="text-xs text-gray-400 mt-2 text-center max-w-[220px]">
                Scan with your GCash app to pay.
              </p>
            </div>

            <p className="text-xs text-gray-500 mb-5 text-center">
              Please pay the total above via GCash, then tap the button below.
              Your slot is held for 15 minutes while we confirm payment.
            </p>

            <button onClick={handleConfirmPayment} className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              I've Sent the Payment
            </button>
          </div>
        )}

      </div>
    </div>
  );
}