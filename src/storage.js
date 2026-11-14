const RECENT = "wtc.recent";
const TRIPS = "wtc.trips";
const PROFILE = "wtc.profile";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function loadRecent() {
  const recent = readJson(RECENT, []);
  return Array.isArray(recent) ? recent : [];
}

export function pushRecent(item) {
  const next = [item, ...loadRecent().filter((entry) => entry.href !== item.href)].slice(0, 4);
  localStorage.setItem(RECENT, JSON.stringify(next));
  return next;
}

export function loadTrips() {
  const trips = readJson(TRIPS, []);
  return Array.isArray(trips) ? trips : [];
}

export function saveTrip(trip) {
  const next = [trip, ...loadTrips().filter((item) => item.id !== trip.id)];
  localStorage.setItem(TRIPS, JSON.stringify(next));
  return next;
}

export function cancelTrip(id) {
  const next = loadTrips().map((trip) => (trip.id === id ? { ...trip, status: "cancelled" } : trip));
  localStorage.setItem(TRIPS, JSON.stringify(next));
  return next;
}

export function loadProfile() {
  const profile = readJson(PROFILE, { name: "" });
  return profile && typeof profile.name === "string" ? profile : { name: "" };
}

export function saveProfile(profile) {
  localStorage.setItem(PROFILE, JSON.stringify({ name: profile.name || "" }));
}
