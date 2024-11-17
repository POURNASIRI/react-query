import { useEffect, useState } from "react";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const {data,isError,isLoading} = useQuery({
    queryKey: ["posts",currentPage], 
    queryFn:()=>fetchPosts(currentPage),
    staleTime:2000 //2seconds 

  });


  const queryClint = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn:(postId)=>deletePost(postId)
  })

  const updatePostMutation = useMutation({
    mutationFn:(postId)=>updatePost(postId)
  })

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

  if(isError){
    return <div>Something went wrong</div>
  }



  return (
    <>
      <ul>
        {data?.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() =>{
              deletePostMutation.reset();
              updatePostMutation.reset();
              setSelectedPost(post)
            }  }
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
      {selectedPost && <PostDetail post={selectedPost} 
      updatePostMutation={updatePostMutation}
      deletePostMutation={deletePostMutation} />}
    </>
  );
}
