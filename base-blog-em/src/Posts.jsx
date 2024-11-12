import { useState } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
import { useQuery } from "@tanstack/react-query";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  //* useQuery returns an object with a lot of properties. use query takes an object of options 
  const {data,isError,isLoading} = useQuery({
    //* The query key is what defines this data within the query cache. the query key always an array 
    queryKey: ["posts"], 
    // * this is the function that's going to run to fetch data.
    queryFn:fetchPosts,
  });
  if(isLoading){
    return <div>Loading...</div>
  }
  //* isFetching :Means that the asynchronous query it hasn't resolved
  //* isLoading: Means we are in a fatching state. Our query function hasn't rasolved yet, but we also have no catched data.

  if(isError){
    return <div>Something went wrong</div>
  }

  //* isError: Means that the query has failed. if we have actually failed got an error from our query function
  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
