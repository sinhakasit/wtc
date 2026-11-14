import { cabinLabel, clampInt, inr, nightsBetween, prettyDate, quote, travelersLabel } from "./format.js";

export const AIRPORTS = [
  { code: "DEL", city: "New Delhi", airport: "Indira Gandhi International", region: "IN", zone: "N" },
  { code: "BOM", city: "Mumbai", airport: "Chhatrapati Shivaji Maharaj", region: "IN", zone: "W" },
  { code: "BLR", city: "Bengaluru", airport: "Kempegowda International", region: "IN", zone: "S" },
  { code: "MAA", city: "Chennai", airport: "Chennai International", region: "IN", zone: "S" },
  { code: "CCU", city: "Kolkata", airport: "Netaji Subhas Chandra Bose", region: "IN", zone: "E" },
  { code: "HYD", city: "Hyderabad", airport: "Rajiv Gandhi International", region: "IN", zone: "S" },
  { code: "GOI", city: "Goa", airport: "Manohar International", region: "IN", zone: "W" },
  { code: "JAI", city: "Jaipur", airport: "Jaipur International", region: "IN", zone: "N" },
  { code: "COK", city: "Kochi", airport: "Cochin International", region: "IN", zone: "S" },
  { code: "UDR", city: "Udaipur", airport: "Maharana Pratap", region: "IN", zone: "N" },
  { code: "IXC", city: "Chandigarh", airport: "Shaheed Bhagat Singh", region: "IN", zone: "N" },
  { code: "SXR", city: "Srinagar", airport: "Sheikh ul-Alam", region: "IN", zone: "N" },
  { code: "DXB", city: "Dubai", airport: "Dubai International", region: "INT", zone: "INT" },
  { code: "SIN", city: "Singapore", airport: "Changi", region: "INT", zone: "INT" },
  { code: "BKK", city: "Bangkok", airport: "Suvarnabhumi", region: "INT", zone: "INT" },
];

export const FARES = [
  { id: "saver", label: "Saver", bag: "15 kg check-in", change: "Date changes are chargeable", multiplier: 1 },
  { id: "flexi", label: "Flexi", bag: "15 kg check-in", change: "One free date change", multiplier: 1.18 },
  { id: "comfort", label: "Comfort", bag: "25 kg and a meal", change: "Free date change and a meal", multiplier: 1.34 },
];

export const ROOM_TYPES = [
  { id: "standard", label: "Standard", detail: "A quiet room with the usual view", multiplier: 1 },
  { id: "deluxe", label: "Deluxe", detail: "Higher floor and a better outlook", multiplier: 1.28 },
  { id: "suite", label: "Suite", detail: "A separate sitting room", multiplier: 1.75 },
];

const AIRLINES = [
  { name: "IndiGo", code: "6E" },
  { name: "Air India", code: "AI" },
  { name: "Akasa Air", code: "QP" },
  { name: "SpiceJet", code: "SG" },
];

const TRAINS = [
  ["Vande Bharat Express", "12050"],
  ["Rajdhani Express", "12952"],
  ["Shatabdi Express", "12016"],
  ["Duronto Express", "12260"],
  ["Tejas Express", "82502"],
  ["Garib Rath", "12910"],
];

const BUSES = [
  ["Silver Mile", "Volvo A/C sleeper"],
  ["Coastal Night", "A/C seater"],
  ["Amber Coach", "Non-A/C sleeper"],
  ["Deccan Roadways", "A/C sleeper"],
  ["Plain Country", "A/C seater"],
];

export const HOTELS = [
  { id: "palm-court", city: "Goa", name: "Palm Court Candolim", area: "Candolim", stars: 4, rating: 4.6, reviews: 1204, amenities: ["Beach", "Pool", "Breakfast"], price: 8400, blurb: "Lawns that end where the sand starts.", tone: "sea" },
  { id: "fontainhas-house", city: "Goa", name: "Fontainhas House", area: "Panaji", stars: 3, rating: 4.4, reviews: 640, amenities: ["Breakfast", "Heritage", "Walkable"], price: 5200, blurb: "A restored house in the Latin quarter.", tone: "fort" },
  { id: "marigold-haveli", city: "Jaipur", name: "Marigold Haveli", area: "Old City", stars: 4, rating: 4.7, reviews: 980, amenities: ["Courtyard", "Breakfast", "Rooftop"], price: 6900, blurb: "A courtyard hotel inside the pink walls.", tone: "fort" },
  { id: "amber-stepwell", city: "Jaipur", name: "Amber Stepwell Inn", area: "Amer Road", stars: 3, rating: 4.3, reviews: 410, amenities: ["Pool", "Breakfast"], price: 4500, blurb: "A small inn on the road up to the fort.", tone: "dune" },
  { id: "backwater-house", city: "Kerala", name: "Backwater House", area: "Alleppey", stars: 4, rating: 4.8, reviews: 1502, amenities: ["Canoe", "Breakfast", "Full board"], price: 11200, blurb: "Rooms that open onto a private canal.", tone: "backwater" },
  { id: "cardamom-shade", city: "Kerala", name: "Cardamom Shade", area: "Munnar", stars: 4, rating: 4.5, reviews: 860, amenities: ["Tea estate", "Fireplace", "Breakfast"], price: 7800, blurb: "A bungalow above the tea slopes.", tone: "valley" },
  { id: "lantern-lake", city: "Udaipur", name: "Lantern & Lake", area: "Lake Pichola", stars: 5, rating: 4.8, reviews: 2104, amenities: ["Lake view", "Pool", "Breakfast"], price: 15400, blurb: "Evenings on a terrace over the water.", tone: "lake" },
  { id: "chandpol", city: "Udaipur", name: "Chandpol Guesthouse", area: "Old City", stars: 3, rating: 4.4, reviews: 530, amenities: ["Rooftop", "Breakfast", "Walkable"], price: 3900, blurb: "A rooftop breakfast over the lanes.", tone: "fort" },
  { id: "colaba-tide", city: "Mumbai", name: "Colaba Tide", area: "Colaba", stars: 4, rating: 4.2, reviews: 760, amenities: ["Seaface", "Breakfast", "Gym"], price: 9800, blurb: "A seaface block a short walk from the Gateway.", tone: "sea" },
  { id: "bandra-loft", city: "Mumbai", name: "Bandra Loft", area: "Bandra West", stars: 4, rating: 4.5, reviews: 640, amenities: ["Rooftop", "Breakfast"], price: 8700, blurb: "A loft hotel above the bandstand lanes.", tone: "dune" },
  { id: "nizamuddin", city: "New Delhi", name: "Nizamuddin Courtyard", area: "Nizamuddin", stars: 4, rating: 4.6, reviews: 890, amenities: ["Breakfast", "Heritage", "Quiet"], price: 7200, blurb: "A courtyard house a lane away from the dargah.", tone: "fort" },
  { id: "aerocity-halt", city: "New Delhi", name: "Aerocity Halt", area: "Aerocity", stars: 4, rating: 4.1, reviews: 1100, amenities: ["Airport shuttle", "Gym", "Pool"], price: 6400, blurb: "A practical stay for a tight connection.", tone: "lake" },
  { id: "cubbon", city: "Bengaluru", name: "Cubbon Verandah", area: "Ashok Nagar", stars: 4, rating: 4.5, reviews: 540, amenities: ["Breakfast", "Walkable", "Garden"], price: 6900, blurb: "Verandah rooms facing a garden near the park.", tone: "backwater" },
  { id: "indiranagar-rooms", city: "Bengaluru", name: "Indiranagar Rooms", area: "Indiranagar", stars: 3, rating: 4.3, reviews: 420, amenities: ["Breakfast", "Walkable"], price: 4800, blurb: "Simple rooms on a street of cafes.", tone: "dune" },
  { id: "creek-lantern", city: "Dubai", name: "Creek Lantern", area: "Al Fahidi", stars: 4, rating: 4.6, reviews: 1320, amenities: ["Creek view", "Breakfast"], price: 14600, blurb: "Wind-tower lanes on one side, the creek on the other.", tone: "dune" },
  { id: "marina-quiet", city: "Dubai", name: "Marina Quiet", area: "Dubai Marina", stars: 5, rating: 4.4, reviews: 980, amenities: ["Pool", "Beach shuttle", "Breakfast"], price: 18900, blurb: "A high room and a shuttle to the beach.", tone: "sea" },
  { id: "kampong-room", city: "Singapore", name: "Kampong Room", area: "Kampong Glam", stars: 4, rating: 4.7, reviews: 870, amenities: ["Breakfast", "Walkable"], price: 16200, blurb: "A small hotel between the mosque and the cafes.", tone: "lake" },
  { id: "nigeen-houseboat", city: "Srinagar", name: "Nigeen Houseboat", area: "Nigeen Lake", stars: 4, rating: 4.7, reviews: 690, amenities: ["Houseboat", "Breakfast", "Shikara"], price: 9200, blurb: "A carved houseboat with a morning shikara.", tone: "valley" },
];

export const HOTEL_CITIES = [...new Set(HOTELS.map((hotel) => hotel.city))];

export const HOLIDAYS = [
  {
    slug: "goa-arabian-sea",
    title: "Four nights on the Arabian Sea",
    place: "Goa",
    from: "New Delhi",
    nights: 4,
    days: 5,
    price: 28499,
    theme: "Beach",
    season: "October to March",
    tone: "sea",
    summary: "Candolim mornings, a Fontainhas walk, and one unhurried day with nowhere to be.",
    includes: ["Return flights", "4-star stay", "Daily breakfast", "Airport transfer"],
    itinerary: [
      "Land in Goa and settle into Candolim before sunset on the beach.",
      "A slow morning and a drive through the Latin quarter of Panaji.",
      "South Goa for the day: caves, a quiet beach, and a long lunch.",
      "Free day. Hire a scooter or stay by the pool.",
      "Breakfast and a flight home.",
    ],
  },
  {
    slug: "jaipur-amber",
    title: "Palaces, markets, and a fort road",
    place: "Jaipur",
    from: "Mumbai",
    nights: 3,
    days: 4,
    price: 21499,
    theme: "Culture",
    season: "October to March",
    tone: "fort",
    summary: "Amber in the morning, the old city after the heat breaks, and a rooftop dinner.",
    includes: ["Return flights", "Haveli stay", "Breakfast", "Fort guide"],
    itinerary: [
      "Arrive and walk the bazaars around Johari Bazaar.",
      "Amber Fort at opening time, then a stepwell on the way down.",
      "City Palace, a block-print workshop, and the markets after dusk.",
      "Breakfast on the roof and a flight home.",
    ],
  },
  {
    slug: "kerala-backwaters",
    title: "Slow water, then the tea hills",
    place: "Kerala",
    from: "Bengaluru",
    nights: 5,
    days: 6,
    price: 32999,
    theme: "Nature",
    season: "September to March",
    tone: "backwater",
    summary: "Two nights on the canals and two in Munnar, with a day that belongs to neither.",
    includes: ["Return flights", "Houseboat and hill stay", "Breakfast", "Transfers"],
    itinerary: [
      "Kochi arrival and a walk through Fort Kochi.",
      "Drive to Alleppey and board a houseboat after lunch.",
      "A full day on the backwaters.",
      "Morning drive into the cardamom hills.",
      "Tea estate walk and an evening by the fireplace.",
      "Return to Kochi for the flight home.",
    ],
  },
  {
    slug: "udaipur-lakes",
    title: "Evenings on Lake Pichola",
    place: "Udaipur",
    from: "New Delhi",
    nights: 3,
    days: 4,
    price: 26800,
    theme: "Lake",
    season: "October to March",
    tone: "lake",
    summary: "A city palace, a boat at dusk, and one day in the lanes with no itinerary.",
    includes: ["Return flights", "Lake-view stay", "Breakfast", "Sunset boat"],
    itinerary: [
      "Arrive and take the sunset boat on Lake Pichola.",
      "City Palace and a textile lane in the old city.",
      "A free day for the monsoon palace or a long lunch.",
      "Morning flight home.",
    ],
  },
  {
    slug: "dubai-weekend",
    title: "A long weekend on the creek",
    place: "Dubai",
    from: "Mumbai",
    nights: 3,
    days: 4,
    price: 42999,
    theme: "City",
    season: "November to March",
    tone: "dune",
    summary: "Al Fahidi, an abra across the creek, and one afternoon that can be a mall or a desert.",
    includes: ["Return flights", "4-star stay", "Breakfast", "Creek cruise"],
    itinerary: [
      "Evening arrival and a walk through Al Fahidi.",
      "Abra to the souks, then the museum district.",
      "Choose a desert afternoon or the marina.",
      "Morning flight back to Mumbai.",
    ],
  },
  {
    slug: "srinagar-lake",
    title: "Houseboat mornings",
    place: "Srinagar",
    from: "New Delhi",
    nights: 4,
    days: 5,
    price: 31200,
    theme: "Mountains",
    season: "April to June, September to October",
    tone: "valley",
    summary: "A houseboat on Nigeen, the floating market, and a day in the Mughal gardens.",
    includes: ["Return flights", "Houseboat stay", "Breakfast", "Shikara rides"],
    itinerary: [
      "Fly into Srinagar and settle on the houseboat.",
      "Dawn shikara and the floating vegetable market.",
      "Nishat and Shalimar gardens, then the old city.",
      "A free day on the lake.",
      "Flight back to Delhi.",
    ],
  },
  {
    slug: "singapore-city",
    title: "Hawker stalls and night gardens",
    place: "Singapore",
    from: "Bengaluru",
    nights: 4,
    days: 5,
    price: 48999,
    theme: "City",
    season: "Year round",
    tone: "sea",
    summary: "Kampong Glam, a hawker centre for every meal, and one evening in the gardens.",
    includes: ["Return flights", "4-star stay", "Breakfast", "Airport train"],
    itinerary: [
      "Land and walk Kampong Glam before dinner.",
      "Museums and a chilli-crab evening.",
      "A neighbourhood day: Tiong Bahru, then the quays.",
      "Gardens by the Bay after dark.",
      "Morning flight home.",
    ],
  },
];

export const DESTINATIONS = [
  { city: "Goa", kicker: "Arabian Sea", text: "Beach mornings and a Latin quarter.", tone: "sea", price: 5200 },
  { city: "Jaipur", kicker: "Pink city", text: "Forts first, bazaars after the heat.", tone: "fort", price: 4500 },
  { city: "Kerala", kicker: "Backwaters", text: "Canals, then cardamom hills.", tone: "backwater", price: 7800 },
  { city: "Udaipur", kicker: "Lakes", text: "A terrace over Pichola at dusk.", tone: "lake", price: 3900 },
  { city: "Dubai", kicker: "The creek", text: "Wind towers, abras, and a long weekend.", tone: "dune", price: 14600 },
  { city: "Srinagar", kicker: "The valley", text: "Houseboats and a dawn market.", tone: "valley", price: 9200 },
];

export const NOTES = [
  { title: "Window seat, westbound", text: "The evening departure into Goa is the one people talk about later. The coast shows up just as the cabin lights dim." },
  { title: "Book the haveli, not the highway", text: "In Jaipur the better stays are inside the old city. The fort can wait until morning, when the road is still cool." },
  { title: "One suitcase, two climates", text: "Kerala in December asks for a linen shirt and a light sweater. The coast is warm. Munnar is not." },
];

export function airportLabel(code) {
  const airport = AIRPORTS.find((item) => item.code === code);
  return airport ? `${airport.city} (${airport.code})` : "";
}

export function findAirport(query) {
  if (!query) return null;
  const needle = String(query).trim().toLowerCase();
  if (!needle) return null;
  return (
    AIRPORTS.find((airport) => airport.code.toLowerCase() === needle) ||
    AIRPORTS.find((airport) => airport.city.toLowerCase() === needle) ||
    AIRPORTS.find((airport) => `${airport.city} (${airport.code})`.toLowerCase() === needle) ||
    AIRPORTS.find((airport) => airport.city.toLowerCase().startsWith(needle)) ||
    (needle.length >= 3 ? AIRPORTS.find((airport) => airport.city.toLowerCase().includes(needle)) : null) ||
    null
  );
}

export function suggestAirports(query) {
  const needle = String(query || "").trim().toLowerCase();
  const list = !needle
    ? AIRPORTS
    : AIRPORTS.filter(
        (airport) =>
          airport.city.toLowerCase().includes(needle) ||
          airport.code.toLowerCase().includes(needle) ||
          airport.airport.toLowerCase().includes(needle),
      );
  return needle ? list.slice(0, 8) : list;
}

function rng(seed) {
  let hash = 2166136261;
  const text = String(seed);
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    hash ^= hash >>> 16;
    return (hash >>> 0) / 4294967296;
  };
}

export function farePrice(amount, fareId) {
  const fare = FARES.find((item) => item.id === fareId) || FARES[0];
  return Math.round(amount * fare.multiplier);
}

export function roomPrice(amount, roomId) {
  const room = ROOM_TYPES.find((item) => item.id === roomId) || ROOM_TYPES[0];
  return Math.round(amount * room.multiplier);
}

export function validateReturn(depart, ret) {
  if (!ret) return "Choose a return date.";
  if (ret < depart) return "Choose a return date on or after departure.";
  return "";
}

export function stopsLabel(stops) {
  if (stops === 0) return "Nonstop";
  if (stops === 1) return "1 stop";
  return `${stops} stops`;
}

export function searchFlights({ from, to, date, cabin = "economy" }) {
  const origin = findAirport(from);
  const destination = findAirport(to);
  if (!origin || !destination) return { error: "Choose a departure and a destination from the city list.", flights: [] };
  if (origin.code === destination.code) return { error: "Choose two different cities.", flights: [] };
  if (!date) return { error: "Choose a departure date.", flights: [] };
  const random = rng(`${origin.code}-${destination.code}-${date}-${cabin}`);
  const international = origin.region === "INT" || destination.region === "INT";
  const cabinMultiplier = cabin === "business" ? 3.4 : cabin === "premium" ? 1.7 : 1;
  const hubs = AIRPORTS.filter((airport) => airport.code !== origin.code && airport.code !== destination.code);
  const flights = Array.from({ length: 7 }, (_, index) => {
    const airline = AIRLINES[Math.floor(random() * AIRLINES.length)];
    const stops = index === 0 ? 0 : random() < 0.55 ? 0 : random() < 0.82 ? 1 : 2;
    const departMin = 5 * 60 + Math.floor(random() * (17 * 12)) * 5;
    const baseHours = international ? 3.6 + random() * 4.2 : 1.4 + random() * 2.1;
    const duration = Math.max(75, Math.round((baseHours + stops * (1.15 + random())) * 60));
    const raw = (international ? 9800 : 3200) + random() * (international ? 14000 : 4600) + index * 280 - stops * 520;
    const price = Math.max(international ? 7490 : 2490, Math.round((raw * cabinMultiplier) / 10) * 10);
    const number = 100 + Math.floor(random() * 800);
    const via = stops === 1 ? hubs[Math.floor(random() * hubs.length)].city : "";
    return {
      id: `${airline.code}-${number}-${origin.code}-${destination.code}-${departMin}-${index}`,
      airline: airline.name,
      code: airline.code,
      number: `${airline.code} ${number}`,
      from: origin,
      to: destination,
      date,
      departMin,
      duration,
      stops,
      via,
      price,
      cabin,
    };
  }).sort((left, right) => left.price - right.price);
  return { error: null, origin, destination, flights };
}

export function searchHotels({ city, checkin, checkout, rooms = 1 }) {
  const name = String(city || "").trim();
  if (!name) return { error: "Enter a city.", hotels: [] };
  if (!checkin || !checkout) return { error: "Choose check-in and check-out dates.", hotels: [] };
  const nights = nightsBetween(checkin, checkout);
  if (nights <= 0) return { error: "Choose a check-out date after check-in.", hotels: [] };
  const needle = name.toLowerCase();
  const hotels = HOTELS.filter(
    (hotel) => hotel.city.toLowerCase().includes(needle) || needle.includes(hotel.city.toLowerCase()),
  );
  return {
    error: null,
    city: name,
    nights,
    rooms: clampInt(rooms, 1, 5, 1),
    hotels,
  };
}

export function searchGround(mode, { from, to, date, travelClass = "any" }) {
  const origin = findAirport(from);
  const destination = findAirport(to);
  if (!origin || !destination) return { error: "Choose both cities from the list.", options: [] };
  if (origin.code === destination.code) return { error: "Choose two different cities.", options: [] };
  if (origin.region !== "IN" || destination.region !== "IN") {
    return { error: "This timetable covers Indian cities. International routes are under Flights.", options: [] };
  }
  if (!date) return { error: "Choose a travel date.", options: [] };
  const random = rng(`${mode}-${origin.code}-${destination.code}-${date}-${travelClass}`);
  const sameZone = origin.zone === destination.zone;
  const classes = travelClass && travelClass !== "any" ? [travelClass] : ["Chair car", "3A", "2A", "Sleeper"];
  const options = Array.from({ length: 5 }, (_, index) => {
    const departMin = 5 * 60 + Math.floor(random() * (16 * 12)) * 5;
    const hours = (sameZone ? 3.5 + random() * 3 : 10 + random() * 10) + (mode === "bus" ? 1.5 : 0);
    const duration = Math.max(120, Math.round(hours * 60));
    if (mode === "bus") {
      const [name, detail] = BUSES[index % BUSES.length];
      const price = Math.max(690, Math.round((700 + random() * 1700 + index * 80) / 10) * 10);
      return {
        id: `bus-${origin.code}-${destination.code}-${departMin}-${index}`,
        name,
        number: `SM ${200 + index * 17}`,
        detail,
        from: origin,
        to: destination,
        date,
        departMin,
        duration,
        price,
      };
    }
    const [name, number] = TRAINS[Math.floor(random() * TRAINS.length)];
    const detail = classes[Math.floor(random() * classes.length)];
    const classBoost = detail === "2A" ? 900 : detail === "3A" ? 350 : detail === "Chair car" ? 150 : 0;
    const price = Math.max(490, Math.round((800 + random() * 2200 + classBoost) / 10) * 10);
    return {
      id: `train-${origin.code}-${destination.code}-${departMin}-${index}`,
      name,
      number,
      detail,
      from: origin,
      to: destination,
      date,
      departMin,
      duration,
      price,
    };
  }).sort((left, right) => left.departMin - right.departMin);
  return { error: null, origin, destination, options };
}

export function searchHolidays(place) {
  const needle = String(place || "").trim().toLowerCase();
  const holidays = !needle
    ? HOLIDAYS
    : HOLIDAYS.filter(
        (holiday) =>
          holiday.place.toLowerCase().includes(needle) ||
          holiday.title.toLowerCase().includes(needle) ||
          holiday.theme.toLowerCase().includes(needle),
      );
  return { holidays };
}

export function getHoliday(slug) {
  return HOLIDAYS.find((holiday) => holiday.slug === slug) || null;
}

function read(query, key) {
  if (!query) return "";
  if (typeof query.get === "function") return query.get(key) || "";
  return query[key] || "";
}

function party(query) {
  const adults = clampInt(read(query, "adults") || 1, 1, 9, 1);
  const children = clampInt(read(query, "children") || 0, 0, 6, 0);
  const infants = clampInt(read(query, "infants") || 0, 0, adults, 0);
  return { adults, children, infants };
}

function flightLeg(flight, fareId) {
  const fare = FARES.find((item) => item.id === fareId) || FARES[0];
  const price = farePrice(flight.price, fare.id);
  return {
    fare,
    price,
    part: {
      label: `${flight.from.city} → ${flight.to.city} · ${flight.airline} ${flight.number}`,
      detail: `${prettyDate(flight.date)} · ${fare.label} · ${stopsLabel(flight.stops)}`,
    },
  };
}

export function resolveSelection(query) {
  const kind = read(query, "kind");
  const { adults, children, infants } = party(query);

  if (kind === "flight") {
    const cabin = read(query, "cabin") || "economy";
    const trip = read(query, "trip") === "round" ? "round" : "oneway";
    const outboundSearch = searchFlights({
      from: read(query, "from"),
      to: read(query, "to"),
      date: read(query, "depart"),
      cabin,
    });
    if (outboundSearch.error) return { error: outboundSearch.error };
    const outbound = outboundSearch.flights.find((flight) => flight.id === read(query, "out"));
    if (!outbound) return { error: "That flight is no longer on the sample timetable." };
    const outLeg = flightLeg(outbound, read(query, "outFare"));
    const parts = [outLeg.part];
    let adultFare = outLeg.price;
    let base = outLeg.price * (adults + children);
    if (trip === "round") {
      const returnDate = read(query, "return");
      const dateError = validateReturn(read(query, "depart"), returnDate);
      if (dateError) return { error: dateError };
      const inboundSearch = searchFlights({
        from: read(query, "to"),
        to: read(query, "from"),
        date: returnDate,
        cabin,
      });
      if (inboundSearch.error) return { error: inboundSearch.error };
      const inbound = inboundSearch.flights.find((flight) => flight.id === read(query, "in"));
      if (!inbound) return { error: "Choose a return flight to continue." };
      const inLeg = flightLeg(inbound, read(query, "inFare"));
      parts.push(inLeg.part);
      adultFare += inLeg.price;
      base += inLeg.price * (adults + children);
    }
    if (infants > 0) {
      const infantFare = Math.round(adultFare * 0.15);
      base += infantFare * infants;
      parts.push({
        label: `${infants} ${infants === 1 ? "infant" : "infants"} on lap`,
        detail: `${inr(infantFare)} each`,
      });
    }
    const params = new URLSearchParams({
      from: read(query, "from"),
      to: read(query, "to"),
      depart: read(query, "depart"),
      trip,
      adults: String(adults),
      children: String(children),
      infants: String(infants),
      cabin,
    });
    if (trip === "round") params.set("return", read(query, "return"));
    return {
      error: null,
      kind,
      title: trip === "round"
        ? `${outbound.from.city} and back`
        : `${outbound.from.city} to ${outbound.to.city}`,
      when: trip === "round"
        ? `${prettyDate(read(query, "depart"))} – ${prettyDate(read(query, "return"))} · ${cabinLabel(cabin)}`
        : `${prettyDate(outbound.date)} · ${cabinLabel(cabin)}`,
      parts,
      travelersLabel: travelersLabel(adults, children, infants),
      travelerSlots: adults + children,
      priced: quote(base),
      back: `/flights?${params}`,
    };
  }

  if (kind === "hotel") {
    const stay = searchHotels({
      city: read(query, "city"),
      checkin: read(query, "checkin"),
      checkout: read(query, "checkout"),
      rooms: read(query, "rooms") || 1,
    });
    if (stay.error) return { error: stay.error };
    const hotel = stay.hotels.find((item) => item.id === read(query, "id"));
    if (!hotel) return { error: "That stay is not in the sample list." };
    const room = ROOM_TYPES.find((item) => item.id === read(query, "room")) || ROOM_TYPES[0];
    const nightly = roomPrice(hotel.price, room.id);
    const base = nightly * stay.nights * stay.rooms;
    const params = new URLSearchParams({
      city: hotel.city,
      checkin: read(query, "checkin"),
      checkout: read(query, "checkout"),
      rooms: String(stay.rooms),
      guests: String(clampInt(read(query, "guests") || 2, 1, 8, 2)),
    });
    return {
      error: null,
      kind,
      title: hotel.name,
      when: `${hotel.area}, ${hotel.city} · ${stay.nights} ${stay.nights === 1 ? "night" : "nights"} · ${stay.rooms} ${stay.rooms === 1 ? "room" : "rooms"}`,
      parts: [
        { label: `${room.label} room`, detail: hotel.blurb },
        { label: `${prettyDate(read(query, "checkin"))} – ${prettyDate(read(query, "checkout"))}`, detail: `${inr(nightly)} a night` },
      ],
      travelersLabel: `${clampInt(read(query, "guests") || 2, 1, 8, 2)} guests`,
      travelerSlots: clampInt(read(query, "guests") || 2, 1, 6, 2),
      priced: quote(base),
      back: `/hotels?${params}`,
    };
  }

  if (kind === "train" || kind === "bus") {
    const found = searchGround(kind, {
      from: read(query, "from"),
      to: read(query, "to"),
      date: read(query, "date"),
      travelClass: read(query, "class") || "any",
    });
    if (found.error) return { error: found.error };
    const option = found.options.find((item) => item.id === read(query, "id"));
    if (!option) return { error: "That departure is not on the sample timetable." };
    const params = new URLSearchParams({
      from: read(query, "from"),
      to: read(query, "to"),
      date: read(query, "date"),
      adults: String(adults),
    });
    if (kind === "train") params.set("class", read(query, "class") || "3A");
    return {
      error: null,
      kind,
      title: option.name,
      when: `${prettyDate(option.date)} · ${option.detail} · ${option.from.city} to ${option.to.city}`,
      parts: [{ label: option.number, detail: option.detail }],
      travelersLabel: travelersLabel(adults),
      travelerSlots: adults,
      priced: quote(option.price * adults),
      back: kind === "train" ? `/trains?${params}` : `/buses?${params}`,
    };
  }

  if (kind === "holiday") {
    const holiday = getHoliday(read(query, "slug"));
    if (!holiday) return { error: "That holiday is not in the sample catalogue." };
    return {
      error: null,
      kind,
      title: holiday.title,
      when: `${holiday.days} days · ${holiday.place} · from ${holiday.from}`,
      parts: holiday.includes.map((item) => ({ label: item, detail: holiday.season })),
      travelersLabel: travelersLabel(adults),
      travelerSlots: adults,
      priced: quote(holiday.price * adults),
      back: `/holidays/${holiday.slug}`,
    };
  }

  return { error: "Choose a flight, stay, or holiday to book." };
}

export function bookingCode(rand = Math.random) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "WTC";
  for (let index = 0; index < 5; index += 1) {
    code += alphabet[Math.floor(rand() * alphabet.length)];
  }
  return code;
}
