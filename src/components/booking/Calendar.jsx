import { useState } from "react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = [
  { label: "S", name: "Sunday" },
  { label: "M", name: "Monday" },
  { label: "T", name: "Tuesday" },
  { label: "W", name: "Wednesday" },
  { label: "T", name: "Thursday" },
  { label: "F", name: "Friday" },
  { label: "S", name: "Saturday" },
];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Calendar({ selectedDate, onSelectDate }) {
  const today = startOfToday();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  const goToToday = () => {
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(today);
  };

  return (
    <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* header */}
      <div className="bg-gradient-to-br from-green-600 to-green-500 px-4 sm:px-6 py-4 sm:py-5 text-white">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            disabled={isCurrentMonth}
            aria-label="Previous month"
            className="w-9 h-9 rounded-full hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="text-center">
            <p className="font-display font-bold text-lg sm:text-xl leading-tight">{MONTH_NAMES[month]}</p>
            <p className="text-xs sm:text-sm text-green-100">{year}</p>
          </div>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            aria-label="Next month"
            className="w-9 h-9 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-7 text-center font-semibold mb-3 gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-gray-400 uppercase tracking-wide">
          {WEEKDAYS.map((d, i) => (
            <div key={i} title={d.name}>{d.label}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {cells.map((day, i) => {
            if (day === null) return <div key={`blank-${i}`} />;

            const dateObj = new Date(year, month, day);
            const isPast = dateObj < today;
            const isToday = dateObj.getTime() === today.getTime();
            const isSelected = selectedDate && dateObj.getTime() === selectedDate.getTime();

            let cls = "relative aspect-square text-sm sm:text-base rounded-full transition-all duration-150 flex items-center justify-center ";
            if (isPast) {
              cls += "text-gray-300 cursor-not-allowed";
            } else if (isSelected) {
              cls += "bg-green-600 text-white font-bold shadow-md shadow-green-200 scale-105";
            } else if (isToday) {
              cls += "border-2 border-green-500 text-green-700 font-semibold hover:bg-green-50";
            } else {
              cls += "text-gray-700 hover:bg-yellow-100 hover:text-emerald-800 hover:scale-105";
            }

            return (
              <button key={day} disabled={isPast} className={cls} onClick={() => onSelectDate(dateObj)}>
                {day}
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-green-500" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <div className="min-w-0">
            <p className="text-[11px] sm:text-xs text-gray-400 uppercase tracking-wide">Selected date</p>
            <p className="font-semibold text-green-700 text-sm sm:text-base truncate">
              {selectedDate
                ? selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                : "None yet"}
            </p>
          </div>
          <button
            onClick={goToToday}
            className="shrink-0 text-xs sm:text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
}