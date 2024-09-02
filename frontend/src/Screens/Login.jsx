import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import image from "../assets/login.jpg";
import icon from "../assets/Icon-white.png";
import { GoogleLogin } from "@react-oauth/google";
function Login() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [form, setFrom] = useState({
    email: "",
    password: "",
  });
  axios.defaults.withCredentials = true;
  const onchange = (e) => {
    setFrom((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    // console.log(form);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_Route}/auth/user/login`,
        {
          email: form.email,
          password: form.password,
        }
      );
      if (response.data.success) {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("email", form.email);
        navigate("/");
      }
      if (response.data.error) {
        setErr(response.data.error);
        setMsg("");
      } else {
        setMsg(response.data.message);
        setErr("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const resend = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_Route}/auth/user/resend`,
        {
          email: form.email,
          password: form.password,
        }
      );
      if (response.data.success) {
        alert("Verification email send");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const googleData = async (e) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_Route}/auth/google/login`,
        {
          name: e.name,
          email: e.email,
          profilePic: e.picture,
        }
      );
      if (response.data.success) {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("email", e.email);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-gray-800 h-screen">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src={image}
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <Link className="block text-white" to="/">
              <span className="sr-only">Home</span>
              <img src={icon} alt="Home Icon" className="h-12 sm:h-20" />
            </Link>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to Talk Threads
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              THREADS OF INSIGHT, WOVEN TOGETHER
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <Link
                className="inline-flex size-16 items-center justify-center rounded-full  text-blue-600 sm:size-20 bg-gray-900"
                to="/"
              >
                <span className="sr-only">Home</span>
                <img src={icon} alt="Home Icon" className="h-8 sm:h-12" />
              </Link>

              <h1 className="mt-2 text-2xl font-bold  sm:text-3xl md:text-4xltext-white">
                Welcome to Talk Threads
              </h1>

              <p className="mt-4 leading-relaxed text-gray-400">
                THREADS OF INSIGHT, WOVEN TOGETHER
              </p>
            </div>
            <div className="hidden lg:block text-4xl font-bold ">Login</div>
            <form
              action="#"
              onSubmit={submit}
              className="mt-8 grid grid-cols-6 gap-6"
            >
              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-200"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="Email"
                  name="email"
                  value={form.email}
                  onChange={onchange}
                  className="mt-1 w-full rounded-md  shadow-sm border-gray-700 bg-gray-800 text-gray-200"
                />
              </div>
              <div className="col-span-6">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="Password"
                  name="password"
                  value={form.password}
                  onChange={onchange}
                  className="mt-1 w-full rounded-md  shadow-sm border-gray-700 bg-gray-800 text-gray-200"
                />
              </div>
              {msg && (
                <div className="col-span-6 bg-green-800 rounded-xl">
                  <div className="p-2 w-full ">{msg}</div>
                  <button onClick={resend} className="p-2 underline ">
                    Resend mail
                  </button>
                </div>
              )}
              {err && (
                <div className="col-span-6 ">
                  <div className="p-2 w-full bg-red-700 rounded-xl">{err}</div>
                </div>
              )}

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent  focus:outline-none focus:ring active:text-blue-500 hover:bg-blue-700 hover:text-white"
                >
                  Log in
                </button>

                <p className="mt-4 text-sm  sm:mt-0 text-gray-400">
                  Don't have an account?
                  <Link to="/user/signup" className=" underline text-gray-200">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
            <div className="mt-4">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  let userData = jwtDecode(credentialResponse.credential);

                  googleData(userData);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}

export default Login;
