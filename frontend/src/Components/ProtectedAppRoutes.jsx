import { Routes, Route } from "react-router-dom";
import Home from "../Screens/Home";
import BlogPage from "../Screens/BlogPage";
import NewBlog from "../Screens/NewBlog";
import Profile from "../Screens/Profile";
import MyBlogs from "../Screens/MyBlogs";
import ProtectedLayout from "./ProtectedLayout";

const ProtectedAppRoutes = () => (
  <Routes>
    <Route element={<ProtectedLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/blogs/:id" element={<BlogPage />} />
      <Route path="/blogs/new" element={<NewBlog />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/blogs/myblog" element={<MyBlogs />} />
    </Route>
  </Routes>
);

export default ProtectedAppRoutes;
