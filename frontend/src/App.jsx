import { Routes, Route, Link } from "react-router-dom";
import Home from "./Screens/Home";
import Success from "./Screens/Success";
import Login from "./Screens/Login";
import Signup from "./Screens/Signup";
export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/user/login" element={<Login />}></Route>
        <Route path="/user/signup" element={<Signup />}></Route>
        <Route path="/auth/:id/verify/:token" element={<Success />}></Route>
      </Routes>
    </div>
  );
}

// google signup
// React Query
// Search Bar
// Photo upload
// like, comment ,view, (stat)
// MVC
