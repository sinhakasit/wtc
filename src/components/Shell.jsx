import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { busSearch, flightSearch, hotelSearch, trainSearch } from "../links.js";
import { loadProfile, saveProfile } from "../storage.js";

const LINKS = [
  ["Flights", "/flights", flightSearch()],
  ["Hotels", "/hotels", hotelSearch()],
  ["Holidays", "/holidays", "/holidays"],
  ["Trains", "/trains", trainSearch()],
  ["Buses", "/buses", busSearch()],
];

function linkActive(pathname, path) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function Shell() {
  const location = useLocation();
  const [profile, setProfile] = useState(() => loadProfile());
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(profile.name);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function onSave(event) {
    event.preventDefault();
    const next = { name: draft.trim() };
    saveProfile(next);
    setProfile(next);
    setOpen(false);
  }

  return (
    <div className="shell">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="topbar">
        <div className="container topbar-inner">
          <Link to="/" className="brand">
            <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 5.5 L18.4 16 L16 14.2 L13.6 16 Z" fill="currentColor" />
              <path d="M16 26.5 L13.6 16 L16 17.8 L18.4 16 Z" fill="currentColor" opacity="0.45" />
            </svg>
            <span className="brand-text">
              <strong>WTC</strong>
              <small>Where to, next</small>
            </span>
          </Link>
          <nav className="nav" aria-label="Primary">
            {LINKS.map(([label, path, href]) => (
              <Link key={path} to={href} className={linkActive(location.pathname, path) ? "nav-link active" : "nav-link"}>
                {label}
              </Link>
            ))}
            <Link to="/trips" className={linkActive(location.pathname, "/trips") ? "nav-link active" : "nav-link"}>
              My Trips
            </Link>
          </nav>
          <button
            type="button"
            className="sign-btn"
            onClick={() => {
              setDraft(profile.name);
              setOpen(true);
            }}
          >
            {profile.name ? profile.name : "Sign in"}
          </button>
        </div>
      </header>
      <main id="content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <strong>WTC</strong>
            <p>A sample travel desk for flights, stays, trains, buses, and holidays. Nothing here is a live fare.</p>
          </div>
          <div>
            <p className="eyebrow">Plan</p>
            <Link to={flightSearch()}>Flights</Link>
            <Link to={hotelSearch()}>Hotels</Link>
            <Link to="/holidays">Holidays</Link>
          </div>
          <div>
            <p className="eyebrow">On this device</p>
            <Link to="/trips">My Trips</Link>
            <p>Bookings stay in this browser. No payment is taken.</p>
          </div>
        </div>
        <div className="container legal">© {new Date().getFullYear()} WTC. Sample itineraries for planning.</div>
      </footer>
      {open && (
        <div className="modal-back" onMouseDown={() => setOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="signin-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="signin-title">Sign in</h2>
            <p>Keep a name on this browser. Trips you confirm stay on this device.</p>
            <form onSubmit={onSave}>
              <label htmlFor="profile-name">Name</label>
              <input
                id="profile-name"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                minLength={2}
                required
                autoFocus
              />
              <div className="modal-actions">
                <button type="submit" className="search-btn">
                  Continue
                </button>
                {profile.name && (
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => {
                      saveProfile({ name: "" });
                      setProfile({ name: "" });
                      setDraft("");
                      setOpen(false);
                    }}
                  >
                    Sign out
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
