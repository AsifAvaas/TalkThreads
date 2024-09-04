import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Blogs from "../Components/Blogs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [allBlogs, setAllBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_Backend_Route}/api/blogs/all`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const shuffledBlogs = response.data.blogs.sort(
          () => Math.random() - 0.5
        );
        console.log(response.data.blogs);
        setAllBlogs(shuffledBlogs);
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchBlogs();
  }, []);
  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <div className="container w-full max-w-5xl">
          <div className="p-1 m-2 sm:p-3">
            <div
              onClick={() => navigate("/blogs/new")}
              className="w-full p-3 h-20 bg-slate-700 rounded-xl text-gray-400"
              placeholder="Add a new Blog"
              name="newBlog"
            >
              Add a new Blog...
            </div>
          </div>
          {allBlogs.length > 0 ? (
            allBlogs.map((blogs) => (
              <Blogs
                blogId={blogs._id}
                blogName={blogs.blogName}
                blogBody={blogs.blogBody}
                blogPicture={blogs.blogPicture}
                authorName={blogs.authorName}
                likes={blogs.likeCount}
                disLikes={blogs.dislikeCount}
              />
            ))
          ) : (
            <div>No blogs are present</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
