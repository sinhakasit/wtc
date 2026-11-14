import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchPanel from "../components/SearchPanel.jsx";
import { cabinLabel, clampInt, clock, durationLabel, inr, prettyDate, travelersLabel } from "../format.js";
import { FARES, farePrice, searchFlights, stopsLabel } from "../inventory.js";
import { useTitle } from "../useTitle.js";

function bucketOf(minutes) {
  const hour = Math.floor((minutes % 1440) / 60);
  if (hour < 8) return "early";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export default function Flights() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  useTitle("Flights");
  const hasQuery = params.has("from") && params.has("to") && params.has("depart");
  const trip = params.get("trip") === "oneway" ? "oneway" : "round";
  const cabin = params.get("cabin") || "economy";
  const adults = clampInt(params.get("adults") || 1, 1, 9, 1);
  const children = clampInt(params.get("children") || 0, 0, 6, 0);
  const infants = clampInt(params.get("infants") || 0, 0, adults, 0);
  const pickingReturn = Boolean(hasQuery && trip === "round" && params.get("out"));
  const [stops, setStops] = useState("any");
  const [bucket, setBucket] = useState("any");
  const [airlines, setAirlines] = useState([]);
  const [sort, setSort] = useState("price");
  const [picked, setPicked] = useState({});

  const legKey = `${params.get("from")}-${params.get("to")}-${params.get("depart")}-${params.get("return")}-${params.get("out")}`;
  useEffect(() => {
    setStops("any");
    setBucket("any");
    setAirlines([]);
    setSort("price");
  }, [legKey]);

  const outboundSearch = hasQuery
    ? searchFlights({ from: params.get("from"), to: params.get("to"), date: params.get("depart"), cabin })
    : null;
  const outbound = outboundSearch?.flights?.find((flight) => flight.id === params.get("out"));
  const search = hasQuery
    ? searchFlights({
        from: pickingReturn ? params.get("to") : params.get("from"),
        to: pickingReturn ? params.get("from") : params.get("to"),
        date: pickingReturn ? params.get("return") : params.get("depart"),
        cabin,
      })
    : null;

  const airlineNames = useMemo(() => [...new Set((search?.flights || []).map((flight) => flight.airline))], [search]);

  let flights = search?.flights || [];
  if (stops !== "any") flights = flights.filter((flight) => (stops === "2" ? flight.stops >= 2 : flight.stops === Number(stops)));
  if (bucket !== "any") flights = flights.filter((flight) => bucketOf(flight.departMin) === bucket);
  if (airlines.length) flights = flights.filter((flight) => airlines.includes(flight.airline));
  flights = [...flights].sort((left, right) => {
    if (sort === "depart") return left.departMin - right.departMin;
    if (sort === "duration") return left.duration - right.duration;
    return left.price - right.price;
  });

  function toggleAirline(name) {
    setAirlines((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  }

  function choose(flight, fareId) {
    const next = new URLSearchParams(params);
    if (trip === "round" && !params.get("out")) {
      next.set("out", flight.id);
      next.set("outFare", fareId);
      setParams(next);
      return;
    }
    if (trip === "round") {
      next.set("in", flight.id);
      next.set("inFare", fareId);
    } else {
      next.set("out", flight.id);
      next.set("outFare", fareId);
    }
    next.set("kind", "flight");
    navigate(`/book?${next}`);
  }

  function clearOutbound() {
    const next = new URLSearchParams(params);
    next.delete("out");
    next.delete("outFare");
    next.delete("in");
    next.delete("inFare");
    setParams(next);
  }

  const initial = {
    mode: "flights",
    from: params.get("from") || "DEL",
    to: params.get("to") || "GOI",
    depart: params.get("depart") || undefined,
    ret: params.get("return") || undefined,
    trip,
    adults,
    children,
    infants,
    cabin,
  };

  return (
    <div className="container page">
      <SearchPanel key={params.toString()} compact initial={initial} />
      {!hasQuery && (
        <div className="empty">
          <h1>Search a route</h1>
          <p>Choose two cities to see the sample timetable.</p>
        </div>
      )}
      {hasQuery && search?.error && (
        <p className="form-error" role="alert">
          {search.error}
        </p>
      )}
      {hasQuery && search && !search.error && (
        <>
          <header className="results-head">
            <div>
              <h1>{pickingReturn ? `Return to ${search.destination.city}` : `${search.origin.city} to ${search.destination.city}`}</h1>
              <p>
                {pickingReturn ? prettyDate(params.get("return")) : prettyDate(params.get("depart"))}
                {trip === "round" && !pickingReturn ? ` – ${prettyDate(params.get("return"))}` : ""} · {travelersLabel(adults, children, infants)} · {cabinLabel(cabin)}
              </p>
            </div>
            <p className="sample-tag">Sample timetable</p>
          </header>
          {pickingReturn && outbound && (
            <div className="locked">
              <span>
                Departure locked · {outbound.number} · {clock(outbound.departMin).label} {outbound.from.code} · {inr(farePrice(outbound.price, params.get("outFare")))}
              </span>
              <button type="button" onClick={clearOutbound}>
                Change
              </button>
            </div>
          )}
          <div className="results-layout">
            <aside className="filters">
              <fieldset>
                <legend>Stops</legend>
                {[
                  ["any", "Any"],
                  ["0", "Nonstop"],
                  ["1", "1 stop"],
                  ["2", "2 stops"],
                ].map(([value, label]) => (
                  <label key={value}>
                    <input type="radio" name="stops" checked={stops === value} onChange={() => setStops(value)} /> {label}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Departure</legend>
                {[
                  ["any", "Any time"],
                  ["early", "Before 8:00"],
                  ["morning", "8:00 – 12:00"],
                  ["afternoon", "12:00 – 18:00"],
                  ["evening", "After 18:00"],
                ].map(([value, label]) => (
                  <label key={value}>
                    <input type="radio" name="bucket" checked={bucket === value} onChange={() => setBucket(value)} /> {label}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Airline</legend>
                {airlineNames.map((name) => (
                  <label key={name}>
                    <input type="checkbox" checked={airlines.includes(name)} onChange={() => toggleAirline(name)} /> {name}
                  </label>
                ))}
              </fieldset>
            </aside>
            <div>
              <div className="count-row">
                <div>
                  <h2>{pickingReturn ? "Choose a return" : "Choose a departure"}</h2>
                  <p>
                    {flights.length} {flights.length === 1 ? "flight" : "flights"} · prices per adult
                  </p>
                </div>
                <label>
                  Sort
                  <select value={sort} onChange={(event) => setSort(event.target.value)}>
                    <option value="price">Price</option>
                    <option value="depart">Departure</option>
                    <option value="duration">Duration</option>
                  </select>
                </label>
              </div>
              <div className="list">
                {flights.length === 0 && <div className="empty">No flights match these filters.</div>}
                {flights.map((flight, index) => {
                  const fareId = picked[flight.id] || "saver";
                  const departClock = clock(flight.departMin);
                  const arriveClock = clock(flight.departMin + flight.duration);
                  return (
                    <article key={flight.id} className="flight">
                      <div className="flight-top">
                        <div className="airline">
                          <span className={`dot airline-${flight.code}`} />
                          <div>
                            <strong>{flight.airline}</strong>
                            <span>{flight.number}</span>
                          </div>
                        </div>
                        <div className="timeline">
                          <div>
                            <strong>{departClock.label}</strong>
                            <span>{flight.from.code}</span>
                          </div>
                          <div className="line">
                            <span>{durationLabel(flight.duration)}</span>
                            <i />
                            <span>{flight.stops === 1 && flight.via ? `via ${flight.via}` : stopsLabel(flight.stops)}</span>
                          </div>
                          <div>
                            <strong>
                              {arriveClock.label}
                              {arriveClock.plus > 0 && <sup>+{arriveClock.plus}</sup>}
                            </strong>
                            <span>{flight.to.code}</span>
                          </div>
                        </div>
                      </div>
                      <fieldset className="fares">
                        <legend className="sr-only">Fare for {flight.number}</legend>
                        {FARES.map((fare) => (
                          <label key={fare.id} className={fareId === fare.id ? "fare selected" : "fare"}>
                            <input
                              type="radio"
                              name={`fare-${flight.id}`}
                              value={fare.id}
                              checked={fareId === fare.id}
                              onChange={() => setPicked((current) => ({ ...current, [flight.id]: fare.id }))}
                            />
                            <span>{fare.label}</span>
                            <strong>{inr(farePrice(flight.price, fare.id))}</strong>
                            <small>{fare.bag}</small>
                          </label>
                        ))}
                      </fieldset>
                      <button
                        type="button"
                        className="select-btn"
                        data-testid={index === 0 ? "select-flight" : undefined}
                        onClick={() => choose(flight, fareId)}
                      >
                        Select
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
