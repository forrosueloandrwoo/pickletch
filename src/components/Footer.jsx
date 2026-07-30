export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-emerald-800 to-emerald-950 text-white">
      <div className="px-4 sm:px-8 lg:px-16 py-12">
        <div className="flex flex-col md:flex-row md:justify-between gap-10 max-w-6xl mx-auto">

          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <img src="/images/logo.png" className="h-8" alt="Pickletch Logo" />
              <span className="font-display text-2xl font-bold">Pickletch</span>
            </div>
            <p className="text-emerald-200 text-sm">
              Book a pickleball court in Sindangan in under a minute. Pick a date, pick a court, show up and play.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" /></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-yellow-400">Quick Links</h4>
            <ul className="space-y-2 text-sm text-emerald-100">
              <li><a href="#landing" className="hover:text-yellow-300 transition-colors">Home</a></li>
              <li><a href="#offers" className="hover:text-yellow-300 transition-colors">Offers</a></li>
              <li><a href="#booking" className="hover:text-yellow-300 transition-colors">Courts</a></li>
              <li><a href="#about" className="hover:text-yellow-300 transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-yellow-400">Contact</h4>
            <ul className="space-y-2 text-sm text-emerald-100">
              <li>(0912) 345-6789</li>
              <li>email123@gmail.com</li>
              <li>Sindangan, Zamboanga del Norte</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-white/10 px-4 sm:px-8 lg:px-16 py-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-emerald-200">
          <p>&copy; {new Date().getFullYear()} Pickletch. All rights reserved.</p>
          <p>Created by <span className="text-yellow-400 font-semibold">Andrw0o0</span></p>
        </div>
      </div>
    </footer>
  );
}
