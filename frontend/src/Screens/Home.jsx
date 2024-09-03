import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Blogs from "../Components/Blogs";
import axios from "axios";

function Home() {
  const [allBlogs, setAllBlogs] = useState([]);
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
          {allBlogs.length > 0 ? (
            allBlogs.map((blogs) => (
              <Blogs
                blogId={blogs._id}
                blogName={blogs.blogName}
                blogBody={blogs.blogBody}
                authorName={blogs.authorName}
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
