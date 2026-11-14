import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Receipt } from "../components/Receipt.jsx";
import { cancelTrip, loadTrips } from "../storage.js";
import { useTitle } from "../useTitle.js";

function whenBooked(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export function Trips() {
  useTitle("My Trips");
  const [trips, setTrips] = useState(() => loadTrips());

  return (
    <div className="container page">
      <header className="results-head">
        <div>
          <h1>My Trips</h1>
          <p>Sample bookings saved in this browser.</p>
        </div>
      </header>
      {trips.length === 0 && (
        <div className="empty">
          <p>No trips yet. Search a flight and confirm a sample booking.</p>
          <Link to="/">Start at the desk</Link>
        </div>
      )}
      <div className="trip-list" data-testid="trip-list">
        {trips.map((trip) => (
          <Link key={trip.id} to={`/trips/${trip.id}`} className="trip-card">
            <div>
              <span className={trip.status === "cancelled" ? "status cancelled" : "status"}>{trip.status}</span>
              <strong>{trip.title}</strong>
              <p>{trip.when}</p>
            </div>
            <span className="code-lg">{trip.id}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function TripDetail() {
  const { id } = useParams();
  const [trips, setTrips] = useState(() => loadTrips());
  const trip = trips.find((item) => item.id === id);
  useTitle(trip ? trip.id : "Trip");

  if (!trip) {
    return (
      <div className="container page">
        <div className="empty">
          <h1>No trip with that code on this device.</h1>
          <Link to="/trips">Back to My Trips</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <section className={trip.status === "cancelled" ? "banner cancelled" : "banner"}>
        <p className="eyebrow light">{trip.status === "cancelled" ? "Cancelled" : "Booked"}</p>
        <h1 id="booking-code">{trip.id}</h1>
        <p>{trip.status === "cancelled" ? "This sample booking is marked cancelled." : "You’re booked. This confirmation lives in this browser."}</p>
      </section>
      <div className="book-layout">
        <div className="book-form">
          <h2>{trip.title}</h2>
          <p>{trip.when}</p>
          <p>Saved {whenBooked(trip.createdAt)}</p>
          <h3>Contact</h3>
          <p>
            {trip.contact.name}
            <br />
            {trip.contact.email}
            <br />
            {trip.contact.phone}
          </p>
          <h3>Travelers</h3>
          <ul className="includes">
            {trip.travelers.map((name, index) => (
              <li key={`${name}-${index}`}>{name}</li>
            ))}
          </ul>
          {trip.status !== "cancelled" && (
            <button
              type="button"
              className="text-btn danger"
              onClick={() => setTrips(cancelTrip(trip.id))}
            >
              Cancel this booking
            </button>
          )}
          <p>
            <Link to="/trips">All trips</Link>
          </p>
        </div>
        <Receipt title={trip.title} when={trip.when} parts={trip.parts} priced={trip.priced} travelersLabel={trip.travelersLabel} eyebrow="Receipt" />
      </div>
    </div>
  );
}
