import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </StrictMode>
  </BrowserRouter>
);
