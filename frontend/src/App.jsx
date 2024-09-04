import { Routes, Route, Link } from "react-router-dom";
import Home from "./Screens/Home";
import Success from "./Screens/Success";
import Signup from "./Screens/Signup";
import Login from "./Screens/Login";
import ProtectedRoutes from "./Components/auth/ProtectedRoutes";
import BlogPage from "./Screens/BlogPage";
import NewBlog from "./Screens/NewBlog";
export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Routes>
        {/* <Route path="/" element={<Home />}></Route> */}
        <Route path="/user/login" element={<Login />}></Route>
        <Route path="/user/signup" element={<Signup />}></Route>
        <Route path="/success" element={<Success />}></Route>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/blogs/:id"
          element={
            <ProtectedRoutes>
              <BlogPage />
            </ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/blogs/new"
          element={
            <ProtectedRoutes>
              <NewBlog />
            </ProtectedRoutes>
          }
        ></Route>
      </Routes>
    </div>
  );
}

// google signup  (done)
// React Query
// Search Bar
// Photo upload
// like, comment ,view, (stat)
// MVC
// Notification

// wen names are edited, all the blogs of that person should be updated
