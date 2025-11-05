import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ResumeDetail from "./pages/ResumeDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume/:id" element={<ResumeDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
