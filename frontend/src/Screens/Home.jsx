import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Blogs from "../Components/Blogs";

function Home() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <div className="container w-full max-w-5xl">
          <Blogs />
          <Blogs />
          <Blogs />
        </div>
      </div>
    </>
  );
}

export default Home;
