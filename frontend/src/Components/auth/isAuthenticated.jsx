import axios from "axios";
const backend = import.meta.env.VITE_Backend_Route;

export default async function isAuthenticated() {
  try {
    // Request the server to verify the token (server will check the HttpOnly cookie)
    const response = await axios.post(
      `${backend}/auth/verify-token`,
      {},
      { withCredentials: true }
    );

    if (response.status === 200) {
      return true; // Token is valid
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        // If token is expired, attempt to refresh it
        await axios.post(
          `${backend}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        return true;
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);

        return false;
      }
    }
    console.error("Error verifying token:", error);
    return false;
  }
}
