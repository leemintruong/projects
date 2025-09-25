import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PropertyListings from "./pages/property-listings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/property-listings" element={<PropertyListings />} />
      </Routes>
    </Router>
  );
}

export default App;
