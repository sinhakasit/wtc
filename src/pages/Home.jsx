import { useState } from "react";
import { Link } from "react-router-dom";
import SearchPanel from "../components/SearchPanel.jsx";
import { inr } from "../format.js";
import { DESTINATIONS, HOLIDAYS, NOTES } from "../inventory.js";
import { flightSearch, hotelSearch } from "../links.js";
import { loadRecent } from "../storage.js";
import { useTitle } from "../useTitle.js";

const OFFERS = [
  {
    kicker: "Flights",
    title: "Delhi to Goa",
    text: "Nonstop mornings and late departures, side by side.",
    href: flightSearch({ from: "DEL", to: "GOI", trip: "round" }),
  },
  {
    kicker: "Hotels",
    title: "Jaipur havelis",
    text: "Courtyards inside the old city, priced per night.",
    href: hotelSearch({ city: "Jaipur" }),
  },
  {
    kicker: "Holidays",
    title: "Kerala, unhurried",
    text: "Backwaters first, then the tea hills.",
    href: "/holidays/kerala-backwaters",
  },
  {
    kicker: "Flights",
    title: "Mumbai to Dubai",
    text: "A creek-side long weekend starts with this sector.",
    href: flightSearch({ from: "BOM", to: "DXB", trip: "round" }),
  },
];

export default function Home() {
  useTitle("");
  const [recent] = useState(() => loadRecent());

  return (
    <>
      <section className="hero">
        <div className="container hero-top">
          <div>
            <p className="eyebrow light">Travel desk</p>
            <h1>
              Where to, <em>next?</em>
            </h1>
            <p className="lede">
              Flights, hotels, trains, buses, and full holidays. Search a route, pick a fare, and keep the confirmation under My Trips.
            </p>
          </div>
          <svg className="route-art" viewBox="0 0 560 360" aria-hidden="true">
            <path d="M40 250 C 140 80, 250 80, 300 170 S 430 300, 520 90" fill="none" stroke="#e7b089" strokeWidth="1.4" />
            <circle cx="40" cy="250" r="5" fill="#f6f1e7" />
            <circle cx="300" cy="170" r="5" fill="#f6f1e7" />
            <circle cx="520" cy="90" r="6" fill="#e7b089" />
            <text x="52" y="246" fill="#f6f1e7" fontSize="13">
              Delhi
            </text>
            <text x="314" y="166" fill="#f6f1e7" fontSize="13">
              Jaipur
            </text>
            <text x="430" y="78" fill="#e7b089" fontSize="13">
              Goa
            </text>
          </svg>
        </div>
      </section>
      <div className="container search-wrap">
        <SearchPanel />
      </div>
      <div className="container home-body">
        {recent.length > 0 && (
          <section className="section">
            <div className="section-head">
              <h2>Recent searches</h2>
            </div>
            <div className="recent">
              {recent.map((item) => (
                <Link key={item.href} to={item.href}>
                  <span>{item.meta}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        )}
        <section className="section">
          <div className="section-head">
            <h2>On the desk this week</h2>
            <p>Four ways to start. Each one opens a real search.</p>
          </div>
          <div className="offer-grid">
            {OFFERS.map((offer) => (
              <Link key={offer.title} to={offer.href} className="offer">
                <span className="eyebrow">{offer.kicker}</span>
                <strong>{offer.title}</strong>
                <p>{offer.text}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="section">
          <div className="section-head">
            <h2>Cities people keep booking</h2>
            <p>Stays from the sample list. Prices are per night, before taxes.</p>
          </div>
          <div className="dest-grid">
            {DESTINATIONS.map((destination) => (
              <Link key={destination.city} to={hotelSearch({ city: destination.city })} className="dest" data-tone={destination.tone}>
                <span>{destination.kicker}</span>
                <strong>{destination.city}</strong>
                <p>{destination.text}</p>
                <em>From {inr(destination.price)}</em>
              </Link>
            ))}
          </div>
        </section>
        <section className="section">
          <div className="section-head">
            <h2>Handpicked holidays</h2>
          </div>
          <div className="holiday-grid">
            {HOLIDAYS.slice(0, 3).map((holiday) => (
              <Link key={holiday.slug} to={`/holidays/${holiday.slug}`} className="holiday-card">
                <span className={`swatch tone-${holiday.tone}`} />
                <div>
                  <span className="eyebrow">{holiday.theme}</span>
                  <strong>{holiday.title}</strong>
                  <p>
                    {holiday.nights} nights · {holiday.place} · from {inr(holiday.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="section">
          <div className="section-head">
            <h2>Field notes</h2>
          </div>
          <div className="notes">
            {NOTES.map((note) => (
              <article key={note.title} className="note">
                <h3>{note.title}</h3>
                <p>{note.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
