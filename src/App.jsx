import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Offers from "./components/Offers.jsx";
import BookingSection from "./components/booking/BookingSection.jsx";
import About from "./components/about/About.jsx";
import Footer from "./components/Footer.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import AdminPage from "./components/admin/AdminPage.jsx";

// how long the loading screen stays up at minimum, in ms (matches the
// progress-bar animation duration in index.css -- keep these two in sync)
const MIN_LOADING_TIME = 1600;
const FADE_DURATION = 500; // matches the transition-duration-500 class on LoadingScreen

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const doneTimer = setTimeout(() => setLoading(false), MIN_LOADING_TIME);
    return () => clearTimeout(doneTimer);
  }, []);

  useEffect(() => {
    if (!loading) {
      const removeTimer = setTimeout(() => setShowLoader(false), FADE_DURATION);
      return () => clearTimeout(removeTimer);
    }
  }, [loading]);

  // simple path check -- visiting yoursite.com/admin shows the admin page.
  // Not using a router library since this is the only extra "page" the site needs.
  if (window.location.pathname === "/admin") {
    return <AdminPage />;
  }

  return (
    <div className="font-body">
      {showLoader && <LoadingScreen fadingOut={!loading} />}
      <Navbar />
      <Hero />
      <Offers />
      <BookingSection />
      <About />
      <Footer />
    </div>
  );
}