import { useEffect, useRef, useState } from "react";
import { onAdminAuthChange, adminSignOut } from "../firebase.js";

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
    </svg>
  );
}

function AccountMenu() {
  const [user, setUser] = useState(undefined); // undefined = still checking, null = logged out
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => onAdminAuthChange(setUser), []);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const onEscape = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const isLoggedIn = !!user;

  const goToAdmin = () => {
    setOpen(false);
    window.location.href = "/admin";
  };

  const handleLogout = async () => {
    setOpen(false);
    await adminSignOut();
    window.location.href = "/";
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-haspopup="true"
        aria-expanded={open}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 transition-colors shrink-0"
      >
        <UserIcon />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 text-gray-700 overflow-hidden">
          {isLoggedIn ? (
            <>
              <button
                onClick={goToAdmin}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-red-600"
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={goToAdmin}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
            >
              Log In
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 sm:px-8 h-16 flex items-stretch shadow-md">
      <div className="flex items-center gap-2 w-1/2 min-w-0">
        <svg className="w-7 h-7 sm:w-8 sm:h-8 shrink-0" viewBox="0 0 24 24">
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
        <span className="font-display text-lg sm:text-2xl font-bold truncate">Pickletch</span>
      </div>

      <div className="flex justify-end items-center gap-3 sm:gap-8 w-1/2">
        <a href="#booking" className="hover:text-yellow-300 transition-colors px-1 sm:px-3 text-sm sm:text-base">
          Courts
        </a>
        <a href="#about" className="hover:text-yellow-300 transition-colors px-1 sm:px-3 text-sm sm:text-base">
          About Us
        </a>
        <AccountMenu />
      </div>
    </nav>
  );
}