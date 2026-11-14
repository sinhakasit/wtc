import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SearchPanel from "../components/SearchPanel.jsx";
import { clampInt, inr, prettyDate } from "../format.js";
import { HOTEL_CITIES, ROOM_TYPES, roomPrice, searchHotels } from "../inventory.js";
import { hotelSearch } from "../links.js";
import { useTitle } from "../useTitle.js";

export default function Hotels() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  useTitle("Hotels");
  const hasQuery = params.has("city") && params.has("checkin") && params.has("checkout");
  const rooms = clampInt(params.get("rooms") || 1, 1, 5, 1);
  const guests = clampInt(params.get("guests") || 2, 1, 8, 2);
  const stay = hasQuery
    ? searchHotels({
        city: params.get("city"),
        checkin: params.get("checkin"),
        checkout: params.get("checkout"),
        rooms,
      })
    : null;
  const [stars, setStars] = useState(0);
  const [amenity, setAmenity] = useState("any");
  const [picked, setPicked] = useState({});
  const amenities = useMemo(
    () => [...new Set((stay?.hotels || []).flatMap((hotel) => hotel.amenities))],
    [stay],
  );
  let hotels = stay?.hotels || [];
  if (stars) hotels = hotels.filter((hotel) => hotel.stars >= stars);
  if (amenity !== "any") hotels = hotels.filter((hotel) => hotel.amenities.includes(amenity));

  function choose(hotel, roomId) {
    const next = new URLSearchParams(params);
    next.set("kind", "hotel");
    next.set("id", hotel.id);
    next.set("room", roomId);
    navigate(`/book?${next}`);
  }

  const initial = {
    mode: "hotels",
    hotelCity: params.get("city") || "Goa",
    checkin: params.get("checkin") || undefined,
    checkout: params.get("checkout") || undefined,
    rooms,
    guests,
  };

  return (
    <div className="container page">
      <SearchPanel key={params.toString()} compact initial={initial} />
      {!hasQuery && (
        <div className="empty">
          <h1>Search a city</h1>
          <p>Try Goa, Jaipur, Kerala, Udaipur, Dubai, or Srinagar.</p>
        </div>
      )}
      {hasQuery && stay?.error && (
        <p className="form-error" role="alert">
          {stay.error}
        </p>
      )}
      {hasQuery && stay && !stay.error && (
        <>
          <header className="results-head">
            <div>
              <h1>{stay.city}</h1>
              <p>
                {prettyDate(params.get("checkin"))} – {prettyDate(params.get("checkout"))} · {stay.nights}{" "}
                {stay.nights === 1 ? "night" : "nights"} · {rooms} {rooms === 1 ? "room" : "rooms"} · {guests} guests
              </p>
            </div>
            <p className="sample-tag">Sample stays</p>
          </header>
          <div className="results-layout">
            <aside className="filters">
              <fieldset>
                <legend>Star rating</legend>
                {[0, 3, 4, 5].map((value) => (
                  <label key={value}>
                    <input type="radio" name="stars" checked={stars === value} onChange={() => setStars(value)} />
                    {value === 0 ? "Any" : `${value} star and up`}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>Amenity</legend>
                <label>
                  <input type="radio" name="amenity" checked={amenity === "any"} onChange={() => setAmenity("any")} /> Any
                </label>
                {amenities.map((item) => (
                  <label key={item}>
                    <input type="radio" name="amenity" checked={amenity === item} onChange={() => setAmenity(item)} /> {item}
                  </label>
                ))}
              </fieldset>
            </aside>
            <div className="list">
              {hotels.length === 0 && stay.hotels.length === 0 && (
                <div className="empty">
                  <p>No sample stays in {stay.city}.</p>
                  <div className="chips">
                    {HOTEL_CITIES.slice(0, 6).map((city) => (
                      <Link key={city} to={hotelSearch({ city })} className="chip">
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {hotels.length === 0 && stay.hotels.length > 0 && <div className="empty">No stays match these filters.</div>}
              {hotels.map((hotel, index) => {
                const roomId = picked[hotel.id] || "standard";
                const nightly = roomPrice(hotel.price, roomId);
                return (
                  <article key={hotel.id} className="hotel">
                    <div className={`hotel-art tone-${hotel.tone}`} aria-hidden="true">
                      <span>{hotel.city}</span>
                    </div>
                    <div className="hotel-body">
                      <div className="hotel-copy">
                        <p className="stars" aria-label={`${hotel.stars} star`}>
                          {"★".repeat(hotel.stars)}
                          <span>
                            {hotel.rating} · {hotel.reviews.toLocaleString("en-IN")} reviews
                          </span>
                        </p>
                        <h2>{hotel.name}</h2>
                        <p>
                          {hotel.area}, {hotel.city}. {hotel.blurb}
                        </p>
                        <p className="amenity">{hotel.amenities.join(" · ")}</p>
                      </div>
                      <fieldset className="room-types">
                        <legend className="sr-only">Room type</legend>
                        {ROOM_TYPES.map((room) => (
                          <label key={room.id} className={roomId === room.id ? "fare selected" : "fare"}>
                            <input
                              type="radio"
                              name={`room-${hotel.id}`}
                              checked={roomId === room.id}
                              onChange={() => setPicked((current) => ({ ...current, [hotel.id]: room.id }))}
                            />
                            <span>{room.label}</span>
                            <strong>{inr(roomPrice(hotel.price, room.id))}</strong>
                            <small>a night</small>
                          </label>
                        ))}
                      </fieldset>
                      <div className="hotel-book">
                        <p>
                          <strong>{inr(nightly * stay.nights * rooms)}</strong>
                          <span>
                            {" "}
                            for {stay.nights} nights
                            {rooms > 1 ? `, ${rooms} rooms` : ""}
                          </span>
                        </p>
                        <button
                          type="button"
                          className="select-btn"
                          data-testid={index === 0 ? "select-hotel" : undefined}
                          onClick={() => choose(hotel, roomId)}
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
