import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import SearchPanel from "../components/SearchPanel.jsx";
import { clampInt, inr } from "../format.js";
import { getHoliday, searchHolidays } from "../inventory.js";
import { useTitle } from "../useTitle.js";

export function Holidays() {
  const [params] = useSearchParams();
  useTitle("Holidays");
  const place = params.get("place") || "";
  const adults = clampInt(params.get("adults") || 2, 1, 6, 2);
  const { holidays } = searchHolidays(place);

  return (
    <div className="container page">
      <SearchPanel compact initial={{ mode: "holidays", place, adults }} />
      <header className="results-head">
        <div>
          <h1>{place ? place : "Holiday packages"}</h1>
          <p>Flights, a stay, and a short plan. Prices are per person.</p>
        </div>
        <p className="sample-tag">{holidays.length} packages</p>
      </header>
      {holidays.length === 0 && <div className="empty">No package matches that search.</div>}
      <div className="package-list">
        {holidays.map((holiday) => (
          <Link key={holiday.slug} to={`/holidays/${holiday.slug}?adults=${adults}`} className="package">
            <span className={`swatch large tone-${holiday.tone}`} />
            <div>
              <span className="eyebrow">
                {holiday.theme} · {holiday.days} days
              </span>
              <h2>{holiday.title}</h2>
              <p>{holiday.summary}</p>
              <p className="amenity">
                {holiday.place} · from {holiday.from} · {holiday.season}
              </p>
            </div>
            <p className="package-price">
              <strong>{inr(holiday.price)}</strong>
              <span>per person</span>
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function HolidayDetail() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const holiday = getHoliday(slug);
  useTitle(holiday ? holiday.title : "Holiday");
  const [adults, setAdults] = useState(clampInt(params.get("adults") || 2, 1, 6, 2));

  if (!holiday) {
    return (
      <div className="container page">
        <div className="empty">
          <h1>That package is not on the list.</h1>
          <Link to="/holidays">Browse holidays</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <article className="holiday-detail">
        <div className={`holiday-banner tone-${holiday.tone}`}>
          <p className="eyebrow light">{holiday.theme}</p>
          <h1>{holiday.title}</h1>
          <p>
            {holiday.nights} nights in {holiday.place} · departing {holiday.from}
          </p>
        </div>
        <div className="holiday-layout">
          <div>
            <p className="lede dark">{holiday.summary}</p>
            <h2>Day by day</h2>
            <ol className="itinerary">
              {holiday.itinerary.map((day, index) => (
                <li key={day}>
                  <span>Day {index + 1}</span>
                  {day}
                </li>
              ))}
            </ol>
            <h2>Included</h2>
            <ul className="includes">
              {holiday.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <aside className="summary">
            <p className="eyebrow">Per person</p>
            <h2>{inr(holiday.price)}</h2>
            <p className="when">{holiday.season}</p>
            <label className="stack" htmlFor="holiday-adults">
              Travelers
              <input
                id="holiday-adults"
                type="number"
                min="1"
                max="6"
                value={adults}
                onChange={(event) => setAdults(clampInt(event.target.value, 1, 6, 1))}
              />
            </label>
            <p className="when">Total {inr(holiday.price * adults)} before you confirm.</p>
            <button
              type="button"
              className="search-btn"
              onClick={() => navigate(`/book?kind=holiday&slug=${holiday.slug}&adults=${adults}`)}
            >
              Book this holiday
            </button>
          </aside>
        </div>
      </article>
    </div>
  );
}
