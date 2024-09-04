import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function NewBlog() {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    blogName: "",
    blogBody: "",
    authorId: localStorage.getItem("userId"),
  });
  const [image, setImage] = useState(null);
  const onchange = (e) => {
    setBlogData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("blogName", blogData.blogName);
    formData.append("blogBody", blogData.blogBody);
    formData.append("authorId", blogData.authorId);
    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_Route}/api/blogs/create`,
        formData,
        { withCredentials: true }
      );
      if (response.data.success) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <div className="w-full max-w-[1200px]  m-3">
          <h1 className="text-center text-3xl font-bold mb-4">
            Add A New Blog
          </h1>
          <form action="" className="" onSubmit={submitBlog}>
            <label htmlFor="blogName" className="text-lg">
              Name of the blog:
            </label>

            <input
              type="text"
              className="my-2 w-full bg-slate-700 rounded-xl"
              placeholder="Blog Name"
              onChange={onchange}
              name="blogName"
              value={blogData.blogName}
            />
            <label htmlFor="blogBody" className="text-lg">
              Blog Content:
            </label>

            <textarea
              type="text"
              className="my-2 h-72 w-full  bg-slate-700 rounded-xl"
              placeholder="This is the body of the blog"
              onChange={onchange}
              name="blogBody"
              value={blogData.blogBody}
            />
            <div htmlFor="blogBody" className="text-lg mb-2 w-full">
              Add an image to your blog:
            </div>

            <input
              type="file"
              className="file-input file-input-bordered bg-slate-600 border-slate-700 w-full max-w-xs"
              onChange={onImageChange}
            />
            <br />
            <button
              type="submit"
              className="border py-3 px-14 my-5 rounded-2xl hover:bg-slate-500"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
