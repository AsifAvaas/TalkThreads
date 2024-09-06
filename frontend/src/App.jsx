import { Routes, Route, Link } from "react-router-dom";
import Success from "./Screens/Success";
import Signup from "./Screens/Signup";
import Login from "./Screens/Login";
import ProtectedAppRoutes from "./Components/ProtectedAppRoutes";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Routes>
        <Route path="/user/login" element={<Login />}></Route>
        <Route path="/user/signup" element={<Signup />}></Route>
        <Route path="/success" element={<Success />}></Route>
        <Route path="/*" element={<ProtectedAppRoutes />} />
      </Routes>
    </div>
  );
}

// google signup                             (done)
// React Query                               (not done)
// Search Bar                                (done)
// Photo upload                              (done)
// like, comment ,view, stat                 (done)
// Notification

// when names are edited, all the blogs of that person should be updated (done)
