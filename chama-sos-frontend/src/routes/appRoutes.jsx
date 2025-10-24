import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "src/pages/Login";
import Home from "src/pages/Home";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}
