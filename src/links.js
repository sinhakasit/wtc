import { isoPlus } from "./format.js";

export function flightSearch({
  from = "DEL",
  to = "GOI",
  trip = "round",
  cabin = "economy",
  adults = 1,
  children = 0,
  infants = 0,
  depart = isoPlus(21),
  ret = isoPlus(25),
} = {}) {
  const query = new URLSearchParams({
    from,
    to,
    depart,
    trip,
    adults: String(adults),
    children: String(children),
    infants: String(infants),
    cabin,
  });
  if (trip === "round") query.set("return", ret);
  return `/flights?${query}`;
}

export function hotelSearch({
  city = "Goa",
  checkin = isoPlus(21),
  checkout = isoPlus(25),
  rooms = 1,
  guests = 2,
} = {}) {
  const query = new URLSearchParams({
    city,
    checkin,
    checkout,
    rooms: String(rooms),
    guests: String(guests),
  });
  return `/hotels?${query}`;
}

export function trainSearch({
  from = "DEL",
  to = "JAI",
  date = isoPlus(21),
  travelClass = "3A",
  adults = 1,
} = {}) {
  const query = new URLSearchParams({
    from,
    to,
    date,
    class: travelClass,
    adults: String(adults),
  });
  return `/trains?${query}`;
}

export function busSearch({ from = "DEL", to = "JAI", date = isoPlus(21), adults = 1 } = {}) {
  const query = new URLSearchParams({
    from,
    to,
    date,
    adults: String(adults),
  });
  return `/buses?${query}`;
}
