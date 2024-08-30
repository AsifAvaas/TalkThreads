import { Routes, Route, Link } from "react-router-dom";
import Home from "./Screens/Home";
export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </div>
  );
}

// google signup
// React Query
// Search Bar
// Photo upload
// like, comment ,view, (stat)
