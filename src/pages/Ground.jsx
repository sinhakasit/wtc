import { useNavigate, useSearchParams } from "react-router-dom";
import SearchPanel from "../components/SearchPanel.jsx";
import { clampInt, clock, durationLabel, inr, prettyDate, travelersLabel } from "../format.js";
import { searchGround } from "../inventory.js";
import { useTitle } from "../useTitle.js";

export default function Ground({ mode }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const kind = mode === "bus" ? "bus" : "train";
  useTitle(kind === "bus" ? "Buses" : "Trains");
  const hasQuery = params.has("from") && params.has("to") && params.has("date");
  const adults = clampInt(params.get("adults") || 1, 1, 6, 1);
  const travelClass = params.get("class") || "3A";
  const result = hasQuery
    ? searchGround(kind, { from: params.get("from"), to: params.get("to"), date: params.get("date"), travelClass })
    : null;

  function choose(option) {
    const next = new URLSearchParams(params);
    next.set("kind", kind);
    next.set("id", option.id);
    next.set("adults", String(adults));
    navigate(`/book?${next}`);
  }

  const initial = {
    mode: kind === "bus" ? "buses" : "trains",
    from: params.get("from") || "DEL",
    to: params.get("to") || "JAI",
    depart: params.get("date") || undefined,
    travelClass,
    adults,
  };

  return (
    <div className="container page">
      <SearchPanel key={params.toString()} compact initial={initial} />
      {!hasQuery && (
        <div className="empty">
          <h1>{kind === "bus" ? "Search a bus" : "Search a train"}</h1>
          <p>Indian city pairs only. Delhi to Jaipur is a good first try.</p>
        </div>
      )}
      {hasQuery && result?.error && (
        <p className="form-error" role="alert">
          {result.error}
        </p>
      )}
      {hasQuery && result && !result.error && (
        <>
          <header className="results-head">
            <div>
              <h1>
                {result.origin.city} to {result.destination.city}
              </h1>
              <p>
                {prettyDate(params.get("date"))} · {travelersLabel(adults)}
                {kind === "train" ? ` · ${travelClass}` : ""}
              </p>
            </div>
            <p className="sample-tag">Sample timetable</p>
          </header>
          <div className="list">
            {result.options.map((option, index) => {
              const departClock = clock(option.departMin);
              const arriveClock = clock(option.departMin + option.duration);
              return (
                <article key={option.id} className="ground-card">
                  <div>
                    <strong>{option.name}</strong>
                    <span>
                      {option.number} · {option.detail}
                    </span>
                  </div>
                  <div className="timeline">
                    <div>
                      <strong>{departClock.label}</strong>
                      <span>{option.from.code}</span>
                    </div>
                    <div className="line">
                      <span>{durationLabel(option.duration)}</span>
                      <i />
                    </div>
                    <div>
                      <strong>
                        {arriveClock.label}
                        {arriveClock.plus > 0 && <sup>+{arriveClock.plus}</sup>}
                      </strong>
                      <span>{option.to.code}</span>
                    </div>
                  </div>
                  <div className="hotel-book">
                    <p>
                      <strong>{inr(option.price)}</strong>
                      <span> per traveler</span>
                    </p>
                    <button type="button" className="select-btn" data-testid={index === 0 ? "select-ground" : undefined} onClick={() => choose(option)}>
                      Select
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
