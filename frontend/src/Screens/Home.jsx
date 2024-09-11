import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Navbar from "../Components/Navbar";
import Blogs from "../Components/Blogs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Home() {
  const [allBlogs, setAllBlogs] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1); // Initialize page state
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // To check if more blogs are available
  const observer = useRef();
  const [totalBlogs, setTotalBlogs] = useState(0); // Track total number of blogs
  const [pageLoading, setPageLoading] = useState(true);

  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_Backend_Route}/api/blogs/all`,
        {
          params: { page, limit: 5 },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newBlogs = response.data.blogs;

        // Update the total number of blogs
        setTotalBlogs(response.data.totalBlogs);

        // Filter out duplicate blogs and update allBlogs
        setAllBlogs((prevBlogs) => {
          const blogIds = prevBlogs.map((blog) => blog._id);
          const filteredBlogs = newBlogs.filter(
            (blog) => !blogIds.includes(blog._id)
          );
          const updatedBlogs = [...prevBlogs, ...filteredBlogs];

          // Check if there are more blogs to fetch after updating allBlogs
          setHasMore(updatedBlogs.length < response.data.totalBlogs);

          return updatedBlogs;
        });
        if (page === 1) {
          setPageLoading(false);
        }
      } else {
        console.log(response.data.error);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setPageLoading(false);
    }
  };

  // Stop fetching when there are no more blogs
  useEffect(() => {
    if (hasMore) {
      fetchBlogs();
    }
  }, [page]);
  const lastBlogElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); // Increment the page number when the last element is visible
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((blogs) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        blogs.blogBody.toLowerCase().includes(lowerCaseQuery) ||
        blogs.blogName.toLowerCase().includes(lowerCaseQuery) ||
        blogs.authorName.toLowerCase().includes(lowerCaseQuery)
      );
    });
  });

  return pageLoading ? (
    <div className="h-screen w-full bg-slate-900 text-white flex justify-center items-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  ) : (
    <>
      <Navbar setQuery={setQuery} />
      <div className="flex justify-center">
        <div className="container w-full max-w-5xl">
          <div className="p-1 m-2 sm:p-3">
            <div
              onClick={() => navigate("/blogs/new")}
              className="w-full p-3 h-20 bg-slate-700 rounded-xl text-gray-400 hover:cursor-pointer"
              placeholder="Add a new Blog"
              name="newBlog"
            >
              Add a new Blog...
            </div>
          </div>
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blogs, index) => {
              if (filteredBlogs.length === index + 1) {
                return (
                  <div ref={lastBlogElementRef} key={blogs._id}>
                    <Blogs
                      blogId={blogs._id}
                      blogName={blogs.blogName}
                      blogBody={blogs.blogBody}
                      blogPicture={blogs.blogPicture}
                      authorName={blogs.authorName}
                      likes={blogs.likeCount}
                      disLikes={blogs.dislikeCount}
                    />
                  </div>
                );
              } else {
                return (
                  <Blogs
                    key={blogs._id}
                    blogId={blogs._id}
                    blogName={blogs.blogName}
                    blogBody={blogs.blogBody}
                    blogPicture={blogs.blogPicture}
                    authorName={blogs.authorName}
                    likes={blogs.likeCount}
                    disLikes={blogs.dislikeCount}
                  />
                );
              }
            })
          ) : (
            <div>No blogs are present</div>
          )}
          {loading && (
            <div className="flex justify-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
