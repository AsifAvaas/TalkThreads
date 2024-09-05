import { Outlet } from "react-router-dom";
import ProtectedRoutes from "./auth/ProtectedRoutes";

const ProtectedLayout = () => (
  <ProtectedRoutes>
    <Outlet />
  </ProtectedRoutes>
);

export default ProtectedLayout;
