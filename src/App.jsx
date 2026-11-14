import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Shell from "./components/Shell.jsx";
import Book from "./pages/Book.jsx";
import Flights from "./pages/Flights.jsx";
import Ground from "./pages/Ground.jsx";
import Home from "./pages/Home.jsx";
import Hotels from "./pages/Hotels.jsx";
import { HolidayDetail, Holidays } from "./pages/Holidays.jsx";
import { TripDetail, Trips } from "./pages/Trips.jsx";
import { useTitle } from "./useTitle.js";

function NotFound() {
  useTitle("Not found");
  return (
    <div className="container page">
      <div className="empty">
        <h1>That page has left the airport.</h1>
        <p>The link doesn’t match a search, a stay, or a trip.</p>
        <Link to="/">Back to the desk</Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="flights" element={<Flights />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="trains" element={<Ground mode="train" />} />
          <Route path="buses" element={<Ground mode="bus" />} />
          <Route path="holidays" element={<Holidays />} />
          <Route path="holidays/:slug" element={<HolidayDetail />} />
          <Route path="book" element={<Book />} />
          <Route path="trips" element={<Trips />} />
          <Route path="trips/:id" element={<TripDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
