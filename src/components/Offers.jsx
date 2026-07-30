  const OFFERS = [
  { title: "24/7 Open", desc: "Book anytime, day or night", color: "green", icon: "clock" },
  { title: "Parking", desc: "Plenty of space to park", color: "yellow", icon: "car" },
  { title: "Bathrooms", desc: "Changing rooms to freshen up", color: "green", icon: "shower" },
  { title: "Drinks & Food", desc: "Stay fueled between games", color: "yellow", icon: "cup" },
  { title: "Rentals", desc: "Forgot your gear? We've got you", color: "green", icon: "smile" },
];

function Icon({ name }) {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "clock":
      return (<svg {...common}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
    case "car":
      return (<svg {...common}><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h3l3 3v5h-6z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>);
    case "shower":
      return (<svg {...common}><path d="M4 12h16" /><path d="M5 12v7a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2h8v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-7" /><path d="M6 12V6a2 2 0 0 1 2-2h1" /><circle cx="7.5" cy="6.5" r="1.5" /></svg>);
    case "cup":
      return (<svg {...common}><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>);
    default:
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9 15c1-3 5-3 6-6" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /></svg>);
  }
}

export default function Offers() {
  return (
    <section id="offers" className="bg-gradient-to-b from-green-50 to-white py-16 px-4 sm:px-8 lg:px-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-green-600 font-semibold uppercase tracking-widest text-xs sm:text-sm mb-2">Why play with us</p>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-800">Everything you need, courtside</h2>
      </div>

      <div className="marquee-viewport max-w-6xl mx-auto">
  <div className="marquee-track flex w-max gap-5 sm:gap-6">
    {[...OFFERS, ...OFFERS].map((o, i) => (
      <div
        key={`${o.title}-${i}`}
        className="group bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 sm:p-6 flex flex-col items-center text-center w-56 sm:w-64 shrink-0"
      >
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform ${
            o.color === "green" ? "from-green-500 to-green-600 shadow-green-200" : "from-yellow-400 to-yellow-600 shadow-yellow-200"
          }`}
        >
          <Icon name={o.icon} />
        </div>
        <p className="font-semibold text-gray-800 text-sm sm:text-base mb-1">{o.title}</p>
        <p className="text-gray-500 text-xs sm:text-sm">{o.desc}</p>
      </div>
    ))}
  </div>
</div>
    </section>
  );
}
