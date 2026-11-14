import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Receipt } from "../components/Receipt.jsx";
import { bookingCode, resolveSelection } from "../inventory.js";
import { loadProfile, saveTrip } from "../storage.js";
import { useTitle } from "../useTitle.js";

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export default function Book() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const selection = resolveSelection(params);
  useTitle(selection.title || "Booking");
  const profile = loadProfile();
  const slots = selection.travelerSlots || 1;
  const [contact, setContact] = useState({ name: profile.name || "", email: "", phone: "" });
  const [names, setNames] = useState(() => Array.from({ length: slots }, (_, index) => (index === 0 ? profile.name || "" : "")));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (selection.error) {
    return (
      <div className="container page">
        <div className="empty">
          <h1>This booking needs a selection.</h1>
          <p>{selection.error}</p>
          <Link to="/">Start a search</Link>
        </div>
      </div>
    );
  }

  function setName(index, value) {
    setNames((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function onSubmit(event) {
    event.preventDefault();
    if (saving) return;
    const nextErrors = {};
    if (contact.name.trim().length < 2) nextErrors.name = "Enter the contact name.";
    if (!validEmail(contact.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!validPhone(contact.phone)) nextErrors.phone = "Enter a phone number with 8 to 15 digits.";
    names.forEach((name, index) => {
      if (name.trim().length < 2) nextErrors[`traveler-${index}`] = "Enter this traveler’s name.";
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    const trip = {
      id: bookingCode(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
      kind: selection.kind,
      title: selection.title,
      when: selection.when,
      parts: selection.parts,
      travelersLabel: selection.travelersLabel,
      travelers: names.map((name) => name.trim()),
      contact: {
        name: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
      },
      priced: selection.priced,
    };
    saveTrip(trip);
    navigate(`/trips/${trip.id}`);
  }

  return (
    <div className="container page">
      <header className="results-head">
        <div>
          <h1>Confirm the booking</h1>
          <p>Sample checkout. No payment is taken and no ticket is issued.</p>
        </div>
        <Link to={selection.back}>Back to results</Link>
      </header>
      <form className="book-layout" onSubmit={onSubmit} noValidate>
        <div className="book-form">
          <fieldset>
            <legend>Contact</legend>
            <label htmlFor="contact-name">
              Name
              <input
                id="contact-name"
                value={contact.name}
                onChange={(event) => setContact({ ...contact, name: event.target.value })}
                autoComplete="name"
              />
            </label>
            {errors.name && <p className="form-error">{errors.name}</p>}
            <label htmlFor="contact-email">
              Email
              <input
                id="contact-email"
                type="email"
                value={contact.email}
                onChange={(event) => setContact({ ...contact, email: event.target.value })}
                autoComplete="email"
              />
            </label>
            {errors.email && <p className="form-error">{errors.email}</p>}
            <label htmlFor="contact-phone">
              Phone
              <input
                id="contact-phone"
                type="tel"
                inputMode="tel"
                value={contact.phone}
                onChange={(event) => setContact({ ...contact, phone: event.target.value })}
                autoComplete="tel"
              />
            </label>
            {errors.phone && <p className="form-error">{errors.phone}</p>}
          </fieldset>
          <fieldset>
            <legend>Travelers</legend>
            {names.map((name, index) => (
              <label key={index} htmlFor={`traveler-${index}`}>
                Traveler {index + 1}
                <input id={`traveler-${index}`} value={name} onChange={(event) => setName(index, event.target.value)} />
                {errors[`traveler-${index}`] && <span className="form-error">{errors[`traveler-${index}`]}</span>}
              </label>
            ))}
          </fieldset>
          <button id="confirm-booking" className="search-btn" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Confirm booking"}
          </button>
        </div>
        <Receipt
          title={selection.title}
          when={selection.when}
          parts={selection.parts}
          priced={selection.priced}
          travelersLabel={selection.travelersLabel}
        />
      </form>
    </div>
  );
}
