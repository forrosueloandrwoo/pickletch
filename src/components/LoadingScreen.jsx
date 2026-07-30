export default function LoadingScreen({ fadingOut }) {
  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-b from-yellow-50 to-white transition-opacity duration-500 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="court-lines absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="relative flex flex-col items-center">
        <div className="loader-bounce w-16 h-16">
          <div className="loader-squash w-full h-full">
            <div className="loader-spin w-full h-full">
              <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                <circle cx="12" cy="12" r="11" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
                <ellipse cx="8.5" cy="8" rx="4.5" ry="3" fill="#fff7c2" opacity="0.55" />
                <circle cx="12" cy="12" r="1.1" fill="#ca8a04" opacity="0.75" />
                <circle cx="8" cy="7.5" r="1" fill="#ca8a04" opacity="0.7" />
                <circle cx="16" cy="7.5" r="1" fill="#ca8a04" opacity="0.7" />
                <circle cx="6" cy="13" r="1" fill="#ca8a04" opacity="0.7" />
                <circle cx="18" cy="13" r="1" fill="#ca8a04" opacity="0.7" />
                <circle cx="9" cy="17.5" r="1" fill="#ca8a04" opacity="0.7" />
                <circle cx="15" cy="17.5" r="1" fill="#ca8a04" opacity="0.7" />
                <circle cx="12" cy="5.5" r="0.9" fill="#ca8a04" opacity="0.65" />
                <circle cx="12" cy="18.5" r="0.9" fill="#ca8a04" opacity="0.65" />
              </svg>
            </div>
          </div>
        </div>

        {/* ground shadow + a faint net line, so it reads as bouncing on a court rather than just floating */}
        <div className="relative w-24 mt-1 flex flex-col items-center">
          <div className="loader-shadow w-12 h-3 rounded-full bg-black/40 blur-[2px]" />
          <div className="w-24 h-px bg-green-700/30 mt-1" />
        </div>

        <p className="font-display text-2xl sm:text-3xl font-extrabold text-gray-800 mt-7">Pickletch</p>
        <p className="text-sm text-gray-500 mt-1 mb-5">Warming up the court…</p>

        <div className="w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="loader-progress h-full bg-green-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}