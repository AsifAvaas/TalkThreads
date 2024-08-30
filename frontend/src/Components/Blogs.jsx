import React from "react";
import image from "../assets/1.jpg";
function Blogs() {
  const text = `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Perspiciatis, modi quos dolores rerum commodi eligendi earum
            asperiores ipsum laboriosam voluptatem alias ratione tenetur est
            quae aut nam omnis! Fugiat, esse. Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Perspiciatis, modi quos dolores rerum
            commodi eligendi earum asperiores ipsum laboriosam voluptatem alias
            ratione tenetur est quae aut nam omnis! Fugiat, esse.`;

  const words = text.split(" ");
  const truncatedText =
    words.length > 50 ? words.slice(0, 50).join(" ") + "..." : text;
  return (
    <div className="p-1 m-2 sm:p-3">
      <div className="w-full border border-gray-500 rounded-lg sm:rounded-lg p-1 bg-slate-800">
        <img
          src={image}
          alt="Image 1"
          className="w-full h-auto p-2 rounded-"
        ></img>
        <div className="p-2 ">
          <h1 className="font-bold text-lg">A Miraculous Blog</h1>
          <h3 className="text-gray-400 ">Asif A Khuda</h3>
          <p className="text-gray-200">{truncatedText}</p>
        </div>
      </div>
    </div>
  );
}

export default Blogs;
