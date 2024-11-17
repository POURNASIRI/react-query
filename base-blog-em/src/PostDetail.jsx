import { fetchComments } from "./api";
import "./PostDetail.css";
import { useQuery } from "@tanstack/react-query";

export function PostDetail({ post,deletePostMutation,updatePostMutation }) {
  // replace with useQuery
  const {data,isLoading,isError} = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
    staleTime: 1000
  })

  if (isLoading) {
    return <p className="loading">Loading...</p>;
  }

  if (isError) {
    return <p className="error">Something went wrong</p>;
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
      <button onClick={() => deletePostMutation.mutate(post.id)}>Delete</button> 
      {
        deletePostMutation.isPending && <p className="loading">Deleting...</p>
      }
      {
        deletePostMutation.isError && <p className="error">{deletePostMutation.error.toString()}</p>
      }
      {
        deletePostMutation.isSuccess && <p className="success">Deleted</p>
      }
      </div>
      <div>
        <button onClick={() => updatePostMutation.mutate(post.id)}>Update title</button>
        {
          updatePostMutation.isPending && <p className="loading">Updating...</p>
        }
        {
          updatePostMutation.isError && <p className="error">{updatePostMutation.error.toString()}</p>
        }
        {
          updatePostMutation.isSuccess && <p className="success">Updated</p>
        }

      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
