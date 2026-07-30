import { PRICE_PER_SLOT } from "../../constants.js";

const COURTS = [1, 2, 3];

const PERIODS = [
  { label: "Morning", icon: "sun", hours: [6, 7, 8, 9, 10, 11] },
  { label: "Afternoon", icon: "sunHigh", hours: [12, 13, 14, 15, 16, 17] },
  { label: "Evening", icon: "moon", hours: [18, 19, 20, 21, 22, 23] },
  { label: "Late Night", icon: "star", hours: [0, 1, 2, 3, 4, 5] },
];

function formatSlotLabel(hour) {
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;
  const period = hour < 12 ? "AM" : "PM";
  return `${displayHour}:00 ${period}`;
}

function PeriodIcon({ name }) {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "sun":
      return (<svg {...common}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>);
    case "sunHigh":
      return (<svg {...common}><circle cx="12" cy="12" r="5" /><path d="M12 3v1M12 20v1M20 12h1M3 12h1" /></svg>);
    case "moon":
      return (<svg {...common}><path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z" /></svg>);
    default:
      return (<svg {...common}><path d="m12 2 2.6 6.6L22 10l-5.5 4.6L18 22l-6-4-6 4 1.5-7.4L2 10l7.4-1.4Z" /></svg>);
  }
}

export default function TimeSlots({ selectedSlots, onToggleSlot, bookedKeys }) {
  const picks = Array.from(selectedSlots.entries())
    .map(([key, { hour, courtNum }]) => ({ key, hour, courtNum }))
    .sort((a, b) => a.hour - b.hour || a.courtNum - b.courtNum);

  return (
    <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
      {/* instructions -- this is the whole interaction explained in one line */}
      <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5 flex items-start gap-2.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 shrink-0 mt-0.5">
          <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
        </svg>
        <p className="text-xs sm:text-sm text-green-800">
          Tap <strong>Pick</strong> on any court and time below. Want more than one court, or more than one hour?
          Just keep tapping — everything you pick gets booked together.
        </p>
      </div>

      {/* legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 text-xs sm:text-sm text-gray-600">
        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-green-600 inline-block" />Available</div>
        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-green-900 inline-block" />Picked</div>
        <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-yellow-400 inline-block" />Already booked</div>
      </div>

      {/* court column headers */}
      <div className="flex items-center gap-2 mb-2 pl-[4.5rem] sm:pl-20">
        {COURTS.map((courtNum) => (
          <span key={courtNum} className="flex-1 text-center text-xs sm:text-sm font-semibold text-gray-500">
            Court {courtNum}
          </span>
        ))}
      </div>

      {/* time-of-day groups, all courts shown side by side per hour */}
      <div className="space-y-5">
        {PERIODS.map((period) => (
          <div key={period.label}>
            <div className="flex items-center gap-1.5 mb-2 text-gray-400 text-xs sm:text-sm font-semibold uppercase tracking-wide">
              <PeriodIcon name={period.icon} />
              {period.label}
            </div>
            <div className="space-y-1.5">
              {period.hours.map((hour) => (
                <div key={hour} className="flex items-center gap-2">
                  <span className="w-16 sm:w-20 shrink-0 text-xs sm:text-sm text-gray-500 font-medium">
                    {formatSlotLabel(hour)}
                  </span>
                  <div className="flex gap-1.5 flex-1">
                    {COURTS.map((courtNum) => {
                      const key = `${hour}-${courtNum}`;
                      const isBooked = bookedKeys.has(key);
                      const isSelected = selectedSlots.has(key);

                      let cls = "flex-1 rounded-lg text-[11px] sm:text-sm font-semibold py-2 sm:py-2.5 transition-all duration-150 ";
                      let label = "Pick";
                      if (isBooked) {
                        cls += "bg-yellow-50 text-yellow-600 border border-yellow-200 cursor-not-allowed";
                        label = "Booked";
                      } else if (isSelected) {
                        cls += "bg-green-900 text-white ring-2 ring-green-300 shadow-md";
                        label = "✓ Picked";
                      } else {
                        cls += "bg-green-50 text-green-700 border border-green-100 hover:bg-green-600 hover:text-white hover:shadow-md";
                      }

                      return (
                        <button
                          key={key}
                          disabled={isBooked}
                          title={`Court ${courtNum} at ${formatSlotLabel(hour)}`}
                          onClick={() => onToggleSlot(hour, courtNum)}
                          className={cls}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* running summary of picks across all courts */}
      {picks.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-2">
            You've picked {picks.length} slot{picks.length > 1 ? "s" : ""} so far — tap any to remove it:
          </p>
          <div className="flex flex-wrap gap-2">
            {picks.map(({ key, hour, courtNum }) => (
              <button
                key={key}
                onClick={() => onToggleSlot(hour, courtNum)}
                className="flex items-center gap-1.5 bg-green-50 hover:bg-red-50 text-green-800 hover:text-red-600 text-xs sm:text-sm font-medium pl-3 pr-2 py-1.5 rounded-full border border-green-100 hover:border-red-200 transition-colors group"
              >
                Court {courtNum} &middot; {formatSlotLabel(hour)}
                <span className="text-gray-400 group-hover:text-red-500">&times;</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}