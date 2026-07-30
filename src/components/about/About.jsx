import MapView, { COURT_LAT, COURT_LNG } from "./MapView.jsx";

const iconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

function PhoneIcon() {
  return (<svg className="w-5 h-5" {...iconProps}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>);
}
function ClockIcon() {
  return (<svg className="w-5 h-5" {...iconProps}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
}
function EmailIcon() {
  return (<svg className="w-5 h-5" {...iconProps}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>);
}
function LocationIcon() {
  return (<svg className="w-5 h-5" {...iconProps}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
}
function FacebookIcon() {
  return (<svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" /></svg>);
}
function InstagramIcon() {
  return (<svg className="w-5 h-5 text-white" {...iconProps}><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" /></svg>);
}

export default function About() {
  return (
    <section id="about" className="bg-gray-50 py-10 md:py-16 px-4 sm:px-8 lg:px-16">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-green-600 font-semibold uppercase tracking-widest text-xs sm:text-sm mb-2">Get in touch</p>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-800">About Us</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start max-w-5xl mx-auto">

        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="font-display text-xl font-bold mb-6 text-gray-800">Contact Information</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0"><PhoneIcon /></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Phone Number</h4>
                  <p className="text-gray-600 text-sm">(0912) 345-6789</p>
                  <p className="text-gray-600 text-sm">(0998) 765-4321</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0"><ClockIcon /></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Operating Hours</h4>
                  <p className="text-gray-600 text-sm">Monday - Sunday</p>
                  <p className="text-gray-600 text-sm">Open 24 Hours</p>
                  <p className="text-xs text-red-500 mt-1">Advance booking required. No walk-ins.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0"><EmailIcon /></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Email Address</h4>
                  <p className="text-gray-600 text-sm break-all">email123@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0"><LocationIcon /></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Location</h4>
                  <p className="text-gray-600 text-sm font-medium">Pickletch</p>
                  <p className="text-gray-600 text-sm">Sindangan, Zamboanga del Norte</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 sm:p-8 rounded-2xl shadow-lg">
            <h3 className="font-display text-white text-xl font-bold mb-3">Follow Us</h3>
            <p className="text-yellow-50 text-sm mb-6">Stay updated with our latest announcements, promos, and events.</p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="w-11 h-11 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"><FacebookIcon /></a>
              <a href="#" aria-label="Instagram" className="w-11 h-11 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"><InstagramIcon /></a>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h3 className="font-display text-xl font-bold text-gray-800">Find Us</h3>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${COURT_LAT},${COURT_LNG}`}
              target="_blank"
              rel="noopener"
              className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              Get Directions →
            </a>
          </div>
          <MapView />
        </div>

      </div>
    </section>
  );
}
