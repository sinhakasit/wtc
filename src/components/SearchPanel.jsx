import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cabinLabel, isoPlus, travelersLabel } from "../format.js";
import { HOTEL_CITIES, searchFlights, searchGround, searchHolidays, searchHotels, validateReturn } from "../inventory.js";
import { busSearch, flightSearch, hotelSearch, trainSearch } from "../links.js";
import { pushRecent } from "../storage.js";
import { CityField, DateField, Stepper, SuggestField } from "./Fields.jsx";

const TABS = [
  ["flights", "Flights"],
  ["hotels", "Hotels"],
  ["holidays", "Holidays"],
  ["trains", "Trains"],
  ["buses", "Buses"],
];

const POPULAR = [
  ["GOI", "Goa"],
  ["BOM", "Mumbai"],
  ["JAI", "Jaipur"],
  ["DXB", "Dubai"],
  ["SXR", "Srinagar"],
  ["SIN", "Singapore"],
];

export default function SearchPanel({ initial, compact = false }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initial?.mode || "flights");
  const [trip, setTrip] = useState(initial?.trip || "round");
  const [from, setFrom] = useState(initial?.from || "DEL");
  const [to, setTo] = useState(initial?.to || "GOI");
  const [depart, setDepart] = useState(initial?.depart || isoPlus(21));
  const [ret, setRet] = useState(initial?.ret || isoPlus(25));
  const [adults, setAdults] = useState(initial?.adults || 1);
  const [children, setChildren] = useState(initial?.children || 0);
  const [infants, setInfants] = useState(initial?.infants || 0);
  const [cabin, setCabin] = useState(initial?.cabin || "economy");
  const [hotelCity, setHotelCity] = useState(initial?.hotelCity || "Goa");
  const [checkin, setCheckin] = useState(initial?.checkin || isoPlus(21));
  const [checkout, setCheckout] = useState(initial?.checkout || isoPlus(25));
  const [rooms, setRooms] = useState(initial?.rooms || 1);
  const [guests, setGuests] = useState(initial?.guests || 2);
  const [travelClass, setTravelClass] = useState(initial?.travelClass || "3A");
  const [place, setPlace] = useState(initial?.place || "");
  const [partyOpen, setPartyOpen] = useState(false);
  const [stayOpen, setStayOpen] = useState(false);
  const [error, setError] = useState("");
  const fromRef = useRef(from);
  const toRef = useRef(to);

  function selectFrom(code) {
    fromRef.current = code;
    setFrom(code);
  }

  function selectTo(code) {
    toRef.current = code;
    setTo(code);
  }

  function swapCities() {
    const nextFrom = toRef.current;
    const nextTo = fromRef.current;
    selectFrom(nextFrom);
    selectTo(nextTo);
  }

  function setParty(patch) {
    const next = { adults, children, infants, ...patch };
    if (next.infants > next.adults) next.infants = next.adults;
    setAdults(next.adults);
    setChildren(next.children);
    setInfants(next.infants);
  }

  function onSubmit(event) {
    event.preventDefault();
    setError("");

    if (mode === "flights") {
      if (trip === "round") {
        const dateError = validateReturn(depart, ret);
        if (dateError) {
          setError(dateError);
          return;
        }
      }
      const result = searchFlights({ from: fromRef.current, to: toRef.current, date: depart, cabin });
      if (result.error) {
        setError(result.error);
        return;
      }
      const href = flightSearch({
        from: fromRef.current,
        to: toRef.current,
        trip,
        cabin,
        adults,
        children,
        infants,
        depart,
        ret,
      });
      pushRecent({ label: `${result.origin.city} → ${result.destination.city}`, meta: "Flight", href });
      navigate(href);
      return;
    }

    if (mode === "hotels") {
      const result = searchHotels({ city: hotelCity, checkin, checkout, rooms });
      if (result.error) {
        setError(result.error);
        return;
      }
      const href = hotelSearch({ city: hotelCity.trim(), checkin, checkout, rooms, guests });
      pushRecent({ label: `${hotelCity.trim()} · ${result.nights} nights`, meta: "Hotel", href });
      navigate(href);
      return;
    }

    if (mode === "trains" || mode === "buses") {
      const result = searchGround(mode === "trains" ? "train" : "bus", {
        from: fromRef.current,
        to: toRef.current,
        date: depart,
        travelClass,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      const href =
        mode === "trains"
          ? trainSearch({ from: fromRef.current, to: toRef.current, date: depart, travelClass, adults })
          : busSearch({ from: fromRef.current, to: toRef.current, date: depart, adults });
      pushRecent({
        label: `${result.origin.city} → ${result.destination.city}`,
        meta: mode === "trains" ? "Train" : "Bus",
        href,
      });
      navigate(href);
      return;
    }

    const holidays = searchHolidays(place);
    if (holidays.holidays.length === 0) {
      setError("No sample holiday matches that place. Try Goa, Jaipur, Kerala, or Dubai.");
      return;
    }
    const query = new URLSearchParams({ adults: String(adults) });
    if (place.trim()) query.set("place", place.trim());
    const href = `/holidays?${query}`;
    pushRecent({ label: place.trim() || "All holidays", meta: "Holiday", href });
    navigate(href);
  }

  const submitLabel = {
    flights: "Search flights",
    hotels: "Search hotels",
    holidays: "Find holidays",
    trains: "Search trains",
    buses: "Search buses",
  }[mode];

  return (
    <form id="search-form" className={compact ? "search-card compact" : "search-card"} onSubmit={onSubmit}>
      <div className="tabs" role="tablist" aria-label="What to book">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={mode === id ? "tab active" : "tab"}
            onClick={() => {
              setMode(id);
              setError("");
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "flights" && (
        <div className="segment" role="radiogroup" aria-label="Trip type">
          {[
            ["round", "Round trip"],
            ["oneway", "One way"],
          ].map(([id, label]) => (
            <button key={id} type="button" aria-pressed={trip === id} onClick={() => setTrip(id)}>
              {label}
            </button>
          ))}
        </div>
      )}

      {mode === "flights" && (
        <div className="fields fields-flights">
          <CityField label="From" code={from} onSelect={selectFrom} />
          <button type="button" className="swap" aria-label="Swap cities" onClick={swapCities}>
            ⇄
          </button>
          <CityField label="To" code={to} onSelect={selectTo} />
          <DateField label="Departure" value={depart} min={isoPlus(0)} onChange={setDepart} />
          <DateField label="Return" value={ret} min={depart} disabled={trip === "oneway"} onChange={setRet} />
          <div className="field party">
            <label>Travelers & cabin</label>
            <button type="button" className="picker" aria-expanded={partyOpen} onClick={() => setPartyOpen((open) => !open)}>
              {travelersLabel(adults, children, infants)} · {cabinLabel(cabin)}
            </button>
            {partyOpen && (
              <div className="popover">
                <Stepper label="Adults" hint="12 years and over" value={adults} min={1} max={9} onChange={(value) => setParty({ adults: value })} />
                <Stepper label="Children" hint="2–11 years" value={children} min={0} max={6} onChange={(value) => setParty({ children: value })} />
                <Stepper label="Infants" hint="On a lap" value={infants} min={0} max={adults} onChange={(value) => setParty({ infants: value })} />
                <label className="stack">
                  Cabin
                  <select value={cabin} onChange={(event) => setCabin(event.target.value)}>
                    <option value="economy">Economy</option>
                    <option value="premium">Premium economy</option>
                    <option value="business">Business</option>
                  </select>
                </label>
                <button type="button" className="done" onClick={() => setPartyOpen(false)}>
                  Done
                </button>
              </div>
            )}
          </div>
          <button id="search-submit" className="search-btn" type="submit">
            {submitLabel}
          </button>
        </div>
      )}

      {mode === "hotels" && (
        <div className="fields fields-hotels">
          <SuggestField label="City" value={hotelCity} onChange={setHotelCity} options={HOTEL_CITIES} placeholder="Goa, Jaipur, Dubai…" />
          <DateField label="Check-in" value={checkin} min={isoPlus(0)} onChange={setCheckin} />
          <DateField label="Check-out" value={checkout} min={checkin} onChange={setCheckout} />
          <div className="field party">
            <label>Rooms & guests</label>
            <button type="button" className="picker" aria-expanded={stayOpen} onClick={() => setStayOpen((open) => !open)}>
              {rooms} {rooms === 1 ? "room" : "rooms"} · {guests} {guests === 1 ? "guest" : "guests"}
            </button>
            {stayOpen && (
              <div className="popover">
                <Stepper label="Rooms" value={rooms} min={1} max={5} onChange={setRooms} />
                <Stepper label="Guests" value={guests} min={1} max={8} onChange={setGuests} />
                <button type="button" className="done" onClick={() => setStayOpen(false)}>
                  Done
                </button>
              </div>
            )}
          </div>
          <button id="search-submit" className="search-btn" type="submit">
            {submitLabel}
          </button>
        </div>
      )}

      {(mode === "trains" || mode === "buses") && (
        <div className="fields fields-ground">
          <CityField label="From" code={from} onSelect={selectFrom} />
          <button type="button" className="swap" aria-label="Swap cities" onClick={swapCities}>
            ⇄
          </button>
          <CityField label="To" code={to} onSelect={selectTo} />
          <DateField label="Date" value={depart} min={isoPlus(0)} onChange={setDepart} />
          {mode === "trains" && (
            <div className="field">
              <label htmlFor="train-class">Class</label>
              <select id="train-class" value={travelClass} onChange={(event) => setTravelClass(event.target.value)}>
                <option value="Chair car">Chair car</option>
                <option value="3A">3A</option>
                <option value="2A">2A</option>
                <option value="Sleeper">Sleeper</option>
              </select>
            </div>
          )}
          <div className="field party">
            <label>Travelers</label>
            <button type="button" className="picker" aria-expanded={partyOpen} onClick={() => setPartyOpen((open) => !open)}>
              {travelersLabel(adults)}
            </button>
            {partyOpen && (
              <div className="popover">
                <Stepper label="Travelers" value={adults} min={1} max={6} onChange={setAdults} />
                <button type="button" className="done" onClick={() => setPartyOpen(false)}>
                  Done
                </button>
              </div>
            )}
          </div>
          <button id="search-submit" className="search-btn" type="submit">
            {submitLabel}
          </button>
        </div>
      )}

      {mode === "holidays" && (
        <div className="fields fields-holidays">
          <SuggestField
            label="Destination"
            value={place}
            onChange={setPlace}
            options={[...new Set(HOTEL_CITIES)]}
            placeholder="Anywhere, or Goa, Kerala, Dubai…"
          />
          <div className="field party">
            <label>Travelers</label>
            <button type="button" className="picker" aria-expanded={partyOpen} onClick={() => setPartyOpen((open) => !open)}>
              {travelersLabel(adults)}
            </button>
            {partyOpen && (
              <div className="popover">
                <Stepper label="Travelers" value={adults} min={1} max={6} onChange={setAdults} />
                <button type="button" className="done" onClick={() => setPartyOpen(false)}>
                  Done
                </button>
              </div>
            )}
          </div>
          <button id="search-submit" className="search-btn" type="submit">
            {submitLabel}
          </button>
        </div>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      {!compact && mode === "flights" && (
        <div className="chips">
          {POPULAR.map(([code, label]) => (
            <button key={code} type="button" className="chip" onClick={() => selectTo(code)}>
              {label}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
