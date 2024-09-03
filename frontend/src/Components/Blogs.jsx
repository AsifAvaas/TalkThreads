import React from "react";
import image from "../assets/1.jpg";
import Like from "./Icons/Like";
import Dislike from "./Icons/Dislike";
import Comment from "./Icons/Comment";
import { useNavigate } from "react-router-dom";
function Blogs(props) {
  const navigate = useNavigate();
  const text = props.blogBody;

  const words = text.split(" ");
  const truncatedText =
    words.length > 50 ? words.slice(0, 50).join(" ") + "..." : text;
  const blogDetails = (id) => {
    navigate(`/blogs/${id}`);
  };
  return (
    <div className="p-1 m-2 sm:p-3">
      <div className="w-full border border-gray-500 rounded-lg sm:rounded-lg p-1 bg-slate-800">
        <img
          onClick={() => {
            blogDetails(props.blogId);
          }}
          src={image}
          alt="Image 1"
          className="w-full h-auto p-2 rounded-"
        ></img>
        <div className="p-2 ">
          <h1 className="font-bold text-lg">{props.blogName}</h1>
          <h3 className="text-gray-400 ">{props.authorName}</h3>
          <p className="text-gray-200">{truncatedText}</p>
          <div className="flex">
            <span
              onClick={() => {
                blogDetails(props.blogId);
              }}
              className="flex border w-min p-2 my-3 rounded-3xl hover:cursor-pointer"
            >
              <div className="flex border-r-2">
                <div className="ml-1">2</div>
                <Like />
              </div>
              <div className="flex">
                <Dislike />
                <div className="mr-1">4</div>
              </div>
            </span>
            <span
              onClick={() => {
                blogDetails(props.blogId);
              }}
              className="flex border w-min p-2 mx-5 my-3 rounded-3xl hover:cursor-pointer"
            >
              <Comment />
              <div className="mr-2">Comments</div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blogs;
