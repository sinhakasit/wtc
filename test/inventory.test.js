import assert from "node:assert/strict";
import test from "node:test";
import { nightsBetween, quote } from "../src/format.js";
import {
  bookingCode,
  farePrice,
  resolveSelection,
  searchFlights,
  searchGround,
  searchHolidays,
  searchHotels,
} from "../src/inventory.js";

test("flight search is deterministic and priced", () => {
  const first = searchFlights({ from: "DEL", to: "GOI", date: "2026-12-05", cabin: "economy" });
  const second = searchFlights({ from: "Delhi", to: "Goa (GOI)", date: "2026-12-05", cabin: "economy" });
  assert.equal(first.error, null);
  assert.equal(first.flights.length, 7);
  assert.deepEqual(
    first.flights.map((flight) => flight.id),
    second.flights.map((flight) => flight.id),
  );
  assert.ok(first.flights.some((flight) => flight.stops === 0));
  assert.ok(first.flights.every((flight) => flight.price >= 2490));
});

test("flight search rejects the same city", () => {
  const result = searchFlights({ from: "DEL", to: "DEL", date: "2026-12-05" });
  assert.match(result.error, /different cities/);
});

test("one-way fare resolves for two adults", () => {
  const found = searchFlights({ from: "DEL", to: "GOI", date: "2026-12-05", cabin: "economy" });
  const flight = found.flights[0];
  const selection = resolveSelection(
    new URLSearchParams({
      kind: "flight",
      from: "DEL",
      to: "GOI",
      depart: "2026-12-05",
      trip: "oneway",
      adults: "2",
      children: "0",
      infants: "0",
      cabin: "economy",
      out: flight.id,
      outFare: "flexi",
    }),
  );
  assert.equal(selection.error, null);
  assert.equal(selection.priced.base, farePrice(flight.price, "flexi") * 2);
  assert.equal(selection.priced.total, quote(selection.priced.base).total);
  assert.equal(selection.travelerSlots, 2);
});

test("hotel stay counts nights and rooms", () => {
  const stay = searchHotels({ city: "Goa", checkin: "2026-12-05", checkout: "2026-12-09", rooms: 2 });
  assert.equal(stay.nights, 4);
  assert.equal(stay.hotels.length, 2);
  assert.equal(nightsBetween("2026-12-09", "2026-12-05"), 0);
  const selection = resolveSelection(
    new URLSearchParams({
      kind: "hotel",
      city: "Goa",
      checkin: "2026-12-05",
      checkout: "2026-12-09",
      rooms: "2",
      guests: "3",
      id: stay.hotels[0].id,
      room: "standard",
    }),
  );
  assert.equal(selection.priced.base, stay.hotels[0].price * 4 * 2);
});

test("trains stay inside India and buses price per traveler", () => {
  const trains = searchGround("train", { from: "DEL", to: "JAI", date: "2026-12-05", travelClass: "3A" });
  assert.equal(trains.error, null);
  assert.equal(trains.options.length, 5);
  assert.ok(trains.options.every((option) => option.duration < 8 * 60));
  const abroad = searchGround("bus", { from: "DEL", to: "DXB", date: "2026-12-05" });
  assert.match(abroad.error, /Indian cities/);
  const selection = resolveSelection(
    new URLSearchParams({
      kind: "train",
      from: "DEL",
      to: "JAI",
      date: "2026-12-05",
      class: "3A",
      adults: "2",
      id: trains.options[0].id,
    }),
  );
  assert.equal(selection.priced.base, trains.options[0].price * 2);
});

test("holiday search and booking codes", () => {
  const found = searchHolidays("lake");
  assert.ok(found.holidays.some((holiday) => holiday.slug === "udaipur-lakes"));
  const selection = resolveSelection(new URLSearchParams({ kind: "holiday", slug: "goa-arabian-sea", adults: "2" }));
  assert.equal(selection.priced.base, 28499 * 2);
  assert.equal(bookingCode(() => 0), "WTCAAAAA");
});
