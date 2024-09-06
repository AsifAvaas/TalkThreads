import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import icon from "../assets/profile.jpg";

function Profile() {
  const [profile, setProfile] = useState({});
  const [edit, setEdit] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: "",
    oldPassword: "",
    newPassword: "",
  });
  const [image, setImage] = useState(null);
  const userId = localStorage.getItem("userId");
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_Backend_Route}/api/profile`,
        {
          params: { userId: userId },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setProfile(response.data.user);
        setForm({
          name: response.data.user.name,
          profilePic: response.data.user.profilePic,
        });
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const onchange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitEdit = async () => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", form.name);
    if (form.oldPassword) {
      formData.append("oldPassword", form.oldPassword);
      formData.append("newPassword", form.newPassword);
    }
    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_Backend_Route}/api/profile/update`,
        formData,
        { withCredentials: true }
      );
      if (response.data.errorMessage) {
        setErr(response.data.errorMessage[0].msg);
        console.log(response.data.errorMessage[0].msg);
      } else if (response.data.error) {
        setErr(response.data.error);
        console.log(response.data.error);
      } else {
        setErr("");
        fetchProfile();
        localStorage.setItem("profilePic", profile.profilePic);
        setEdit(!edit);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <div className=" w-full m-3 max-w-[1200px]">
          <h1 className="text-3xl mb-4 max-w-[300px]">Your Profile</h1>

          {edit ? (
            <>
              <h2 className="my-4 text-2xl">Add a new photo</h2>
              <input
                type="file"
                className="mb-2 file-input file-input-bordered bg-slate-600 border-slate-700 w-full max-w-xs"
                onChange={onImageChange}
              />
            </>
          ) : (
            <>
              {" "}
              {profile.profilePic ? (
                <img
                  src={profile.profilePic}
                  className="w-[150px] h-auto my-3"
                  alt="Profile Image"
                />
              ) : (
                <img
                  className="w-full max-w-[300px] h-auto rounded-full"
                  src={icon}
                  alt="Profile icon"
                />
              )}
            </>
          )}
          <h3 className="text-xl mx-1">Name:</h3>
          {edit ? (
            <input
              type="text"
              className="w-full max-w-[800px] bg-slate-700 my-2 py-2 px-4 rounded-2xl text-lg"
              name="name"
              value={form.name}
              onChange={onchange}
            />
          ) : (
            <p className="w-full max-w-[800px] bg-slate-700 my-2 py-2 px-4  rounded-2xl text-lg">
              {profile.name}
            </p>
          )}
          <h3 className="text-xl mx-1">Email:</h3>
          <p className="w-full max-w-[800px] bg-slate-700 my-2 py-2 px-4  rounded-2xl text-lg">
            {profile.email}
          </p>
          <h3 className="text-xl mx-1">Password:</h3>
          {edit ? (
            <>
              <input
                type="password"
                className="w-full max-w-[800px] bg-slate-700 my-2 py-2 px-4 rounded-2xl text-lg"
                name="oldPassword"
                onChange={onchange}
                placeholder="Old Password"
              />
              <input
                type="password"
                className="w-full max-w-[800px] bg-slate-700 my-2 py-2 px-4 rounded-2xl text-lg"
                name="newPassword"
                onChange={onchange}
                placeholder="New Password"
              />
              <br />
            </>
          ) : (
            <p className="w-full max-w-[800px] bg-slate-700 my-2 py-2 px-4 rounded-2xl text-lg">
              ***********
            </p>
          )}
          {err && (
            <div className="p-2 bg-red-600 w-full max-w-[800px] my-3 rounded-2xl">
              {err}
            </div>
          )}
          {!edit ? (
            <button
              className="m-3 p-3 w-[140px] text-lg border rounded-2xl bg-slate-700 hover:bg-slate-800"
              onClick={() => setEdit(!edit)}
            >
              Edit Profile
            </button>
          ) : (
            <button
              className="m-3 p-3 w-[140px] text-lg border rounded-2xl bg-slate-700 hover:bg-slate-800"
              onClick={() => submitEdit()}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
