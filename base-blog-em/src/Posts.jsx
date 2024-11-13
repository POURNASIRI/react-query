import { useEffect, useState } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
import { useQuery,useQueryClient } from "@tanstack/react-query";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  //* Pagination steps : 
  //* 1. Track current page in component state (currentPage)
  //* 2. Use qury key that includes the page number
  //* 3. User click "next page" or "previous page" button 
      //* update page state and fire off a new query.

  //* useQuery returns an object with a lot of properties. use query takes an object of options 
  const {data,isError,isLoading} = useQuery({
    //* The query key is what defines this data within the query cache. the query key always an array 
    queryKey: ["posts",currentPage], 
    // * this is the function that's going to run to fetch data.
    queryFn:()=>fetchPosts(currentPage),
    staleTime:2000 //2seconds 
    //* the data is now fresh for to seconds and then it turns stale.
  });

  //*pre-fetching data
 //* adds data to cache.
 //* automatically stale
 //* show while re-fetching
  const queryClint = useQueryClient();

  useEffect(()=>{
    if(currentPage < maxPostPage){
      const nextPage = currentPage + 1;
      queryClint.prefetchQuery({
        queryKey:["posts",nextPage],
        queryFn:()=>fetchPosts(nextPage)
      })
    }

  },[currentPage,queryClint]);

  if(isLoading){
    return <div>Loading...</div>
  }
  //* isFetching :Means that the asynchronous query it hasn't resolved
  //* isLoading: Means we are in a fatching state. Our query function hasn't rasolved yet, but we also have no catched data.

  if(isError){
    return <div>Something went wrong</div>
  }

  //* isError: Means that the query has failed. if we have actually failed got an error from our query function


  //! What is stale data? Data that is expired and is ready to be refetched.
  //! the data is still in the catch, and it dosen't mean it's removed from the cache. itt just means that the data need to be revalidated.

  //! data preftetch only triggers if the data is stale.

  //! staleTime: How long will we let the data live before we go back to the server to fetch the freshset version of the data.
  //! gcTime: is how long to keep data that might be re-used later. default gcTime is 5 minutes.





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
        <button disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button disabled={currentPage >= maxPostPage } onClick={() => setCurrentPage(currentPage + 1)}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
