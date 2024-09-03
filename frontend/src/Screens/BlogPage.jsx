import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import image from "../assets/1.jpg";
import axios from "axios";
import Like from "../Components/Icons/Like";
import Dislike from "../Components/Icons/Dislike";
import Edit from "../Components/Icons/Edit";
import Delete from "../Components/Icons/Delete";
function BlogPage() {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [editModes, setEditModes] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [blog, setBlog] = useState([]);
  const userId = localStorage.getItem("userId");
  const fetchBlog = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_Backend_Route}/api/blogs/${id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const blog = response.data.blog;
        // Sort comments by createdAt in descending order
        blog.comments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        // console.log(blog);
        setBlog(blog);
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchBlog();
  }, []);
  const submitComment = async () => {
    if (!comment) {
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_Backend_Route}/api/blogs/comment`,
        {
          commenterId: userId,
          commenter: blog.authorName,
          comment,
          blogId: id,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        setComment("");
        fetchBlog();
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const toggleEditMode = (index) => {
    setEditModes((prevModes) => ({
      ...prevModes,
      [index]: !prevModes[index],
    }));
  };
  const editComment = async (commentId, index) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_Backend_Route}/api/blogs/comment/update`,
        {
          newComment: inputValues[index],
          userId,
          commentId,
          blogId: blog._id,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        setInputValues((prevValues) => ({
          ...prevValues,
          [index]: "",
        }));

        // Turn off edit mode for this specific comment
        setEditModes((prevModes) => ({
          ...prevModes,
          [index]: false,
        }));

        fetchBlog();
      } else {
        console.log(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex   justify-center">
        <div className="max-w-[1200px] w-ful ">
          <img
            src={image}
            alt="blog image"
            className="rounded-xl py-4 w-full h-auto"
          />

          <div className="pt-4 p-4 mb-4 rounded-2xl  bg-slate-800">
            <h1 className="text-3xl pb-2">{blog.blogName}</h1>
            <h3 className="text-xl text-gray-400">{blog.authorName}</h3>
            <p className="text-lg leading-snug">{blog.blogBody}</p>
            <div className="flex">
              <span className="flex border w-min p-2 my-3 rounded-3xl hover:cursor-pointer">
                <div className="flex border-r-2">
                  <div className="ml-1">{blog.likeCount}</div>
                  <Like />
                </div>
                <div className="flex">
                  <Dislike />
                  <div className="mr-1">{blog.dislikeCount}</div>
                </div>
              </span>
            </div>
            <h2 className="text-2xl ">Comments</h2>
            <textarea
              value={comment}
              className="w-full bg-slate-700 my-2 rounded"
              placeholder="Write your comment..."
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={submitComment}
              className="py-2 px-6 rounded-xl bg-blue-700 border-none text-white hover:bg-blue-900"
            >
              Share
            </button>
            {blog.comments && blog.comments.length > 0 ? ( // Ensure blog.comments exists
              blog.comments.map((comment, index) => (
                <div
                  key={index}
                  className="mt-4 border border-gray-400 p-2 rounded-xl"
                >
                  <div className="flex w-full justify-between items-center">
                    <div className="font-bold">{comment.commenterName}</div>
                    {comment.commenterId === userId && (
                      <div className="ml-auto flex space-x-2">
                        <div
                          onClick={() => toggleEditMode(index)}
                          className="hover:cursor-pointer"
                        >
                          <Edit />
                        </div>
                        <div className="hover:cursor-pointer">
                          <Delete />
                        </div>
                      </div>
                    )}
                  </div>
                  {editModes[index] ? (
                    <>
                      <input
                        type="text"
                        className="bg-inherit p-1 rounded-xl "
                        value={inputValues[index] || comment.commentText}
                        onChange={(e) =>
                          setInputValues((prevValues) => ({
                            ...prevValues,
                            [index]: e.target.value,
                          }))
                        }
                      />
                      <button
                        onClick={() => editComment(comment._id, index)}
                        className="ml-2 p-1 rounded-xl hover:bg-green-800 bg-green-600"
                      >
                        Update
                      </button>
                    </>
                  ) : (
                    <div className="text-gray-400">{comment.commentText}</div>
                  )}
                </div>
              ))
            ) : (
              <div className="mt-4 text-gray-500">No comments</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogPage;
