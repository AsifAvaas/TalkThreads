import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import icon from "../assets/Icon-white.png";
import fullTitle from "../assets/full_title.png";
import halfTitle from "../assets/titleWhite.png";
function Navbar() {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_Route}/auth/logout`
      );
      if (response.data.success) {
        localStorage.clear();
        navigate("/user/login");
      } else {
        alert("failed to log out");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const signedIn = localStorage.getItem("userId");
  const userMail = localStorage.getItem("email");
  return (
    <div className="navbar bg-slate-800 sticky top-0 z-50 ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-slate-700 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {userMail && (
              <li className="hover:bg-slate-900 rounded-lg">
                <div>{userMail}</div>
              </li>
            )}

            <li className="hover:bg-slate-900 rounded-lg">
              <div>Profile</div>
            </li>
            <li className="hover:bg-slate-900 rounded-lg">
              <a>About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost text-xl">
          <img
            src={fullTitle}
            className="h-12 w-auto hidden md:block  top-[-20]"
            alt="Talk Threads"
          />
          <img
            src={halfTitle}
            className="h-14 w-[150px] hidden mobile-view:block md:hidden"
            alt="Talk Threads"
          />
          <img
            src={icon}
            className="h-14 w-auto  mobile-view:hidden"
            alt="Talk Threads"
          />
        </Link>
      </div>
      <div className="navbar-end">
        <div className="form-control ">
          <input
            type="text"
            placeholder="Search"
            className="input p-2 input-bordered w-24 bg-slate-600 text-white sm:w-auto md:p-4"
          />
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-slate-700 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {signedIn ? (
              <>
                {" "}
                <li className="hover:bg-slate-900 rounded-lg">
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li className="hover:bg-slate-900 rounded-lg">
                  <a>Settings</a>
                </li>
                <li className="hover:bg-slate-900 rounded-lg">
                  <div onClick={logout}>Logout</div>
                </li>
              </>
            ) : (
              <>
                {" "}
                <li className="hover:bg-slate-900 rounded-lg">
                  <Link to="/user/signup">Sign up</Link>
                </li>
                <li className="hover:bg-slate-900 rounded-lg">
                  <Link to="/user/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
