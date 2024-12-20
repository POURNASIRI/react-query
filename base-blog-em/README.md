# React Query

## Getting Started

### App component

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='App'>
        <h1>Blog &apos;em Ipsum</h1>
        <Posts />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
```

- This is where we would put our options for query client,
- we have a query client, and we need to add that as props to query client provider.

```jsx
const queryClient = new QueryClient();
```

- So sny of these descendants are now going to have access to this query client, which contains the cache and all the other tools for react query.

```jsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='App'>
        <h1>Blog &apos;em Ipsum</h1>
        {/*//*Now we can call use Query in post component*/}
        <Posts />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
```

### Post component

```jsx
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000, //2seconds
  });

  const queryClint = useQueryClient();

  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;
      queryClint.prefetchQuery({
        queryKey: ['posts', nextPage],
        queryFn: () => fetchPosts(nextPage),
      });
    }
  }, [currentPage, queryClint]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <ul>
        {data?.map((post) => (
          <li
            key={post.id}
            className='post-title'
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className='pages'>
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
```

### using useQuery Hook

```jsx
const { data, isError, isLoading } = useQuery({
  queryKey: ['posts', currentPage],
  queryFn: () => fetchPosts(currentPage),
  staleTime: 2000, //2seconds
});
```

- useQuery returns an object with a lot of properties. use query takes an object of options
- The query key is what defines this data within the query cache. the query key always an array
- this is the function that's going to run to fetch data.
- the data is now fresh for to seconds and then it turns stale.

### isLoading, isFetching and isError

```jsx
if (isLoading) {
  return <div>Loading...</div>;
}

if (isError) {
  return <div>Something went wrong</div>;
}
```

- `isFetching` :Means that the asynchronous query it hasn't resolved
- `isLoading`: Means we are in a fatching state. Our query function hasn't rasolved yet, but we also have no catched data.
- difference between isLoading and isFetching: If we didn't have anything to show , if there was nothing in the cache and we were getting the data from the server in thism time we must uding is Loading Because isFetching doesn't pay attention to the existence of data in the cache and only pays attention to the execution of the query function.
- `isError`: Means that the query has failed. if we have actually failed got an error from our query function

### staleTime and gcTime

- What is stale data? Data that is expired and is ready to be refetched.
  the data is still in the catch, and it dosen't mean it's removed from the cache. itt just means that the data need to be revalidated.

**data preftetch only triggers if the data is stale.**

- `staleTime`: How long will we let the data live before we go back to the server to fetch the freshset version of the data.
- `gcTime`: is how long to keep data that might be re-used later. default gcTime is 5 minutes.

### prefetching data

```jsx
const queryClint = useQueryClient();

useEffect(() => {
  if (currentPage < maxPostPage) {
    const nextPage = currentPage + 1;
    queryClint.prefetchQuery({
      queryKey: ['posts', nextPage],
      queryFn: () => fetchPosts(nextPage),
    });
  }
}, [currentPage, queryClint]);
```

- Pagination steps :

1. Track current page in component state (currentPage)
2. Use qury key that includes the page number
3. User click "next page" or "previous page" button

- update page state and fire off a new query.
- pre-fetching data
- adds data to cache.
- automatically stale
- show while re-fetching

## Mutaion

- making a network call thst changes data on the server in this case adds a new blog post or delete post.**Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects.**

- For mutaion post in our project first we call `useMutation` hookk in Post component

```jsx
const deletePostMutation = useMutation({
  // delete post is a mutation that writes to the server
  mutationFn: (postId) => deletePost(postId),
});
```

then pas the `deletePostMutation` to the Post detail component.

```jsx
{
  selectedPost && (
    <PostDetail post={selectedPost} deletePostMutation={deletePostMutation} />
  );
}
```

In the PostDetail component we use `deletePostMutation` function `mutate` property to call the delete post mutation.

```jsx
export function PostDetail({ post, deletePostMutation }) {
  // replace with useQuery
  const { data, isLoading, isError } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchComments(post.id),
    staleTime: 1000,
  });

  if (isLoading) {
    return <p className='loading'>Loading...</p>;
  }

  if (isError) {
    return <p className='error'>Something went wrong</p>;
  }

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button onClick={() => deletePostMutation.mutate(post.id)}>
        Delete
      </button>
      <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </div>
  );
}
```

Note: when we use `useMutation` we don't have isLoading and isFetching properties because we don't have any data to catch.

- Using Mutation other properties to show the status of the mutation

```jsx
<div>
  <button onClick={() => deletePostMutation.mutate(post.id)}>Delete</button>
  {deletePostMutation.isPending && <p className='loading'>Deleting...</p>}
  {deletePostMutation.isError && (
    <p className='error'>{deletePostMutation.error.toString()}</p>
  )}
  {deletePostMutation.isSuccess && <p className='success'>Deleted</p>}
</div>
```

Note: we using `useMutation` hook in PostDetail component insted of Post component,this is because we want to using `reset` method when other post is clicked.

```jsx
<li
  key={post.id}
  className='post-title'
  onClick={() => {
    // reset the mutation state
    deletePostMutation.reset();
    setSelectedPost(post);
  }}
>
  {post.title}
</li>
```

- _To update each post, we do the exact steps, such as deleting the post_


## Summary
1. Install React Query and then create a query client and add it to a query client provider, to make sure that the cache  and the hooks were available to all of the children.
2. Implemented `useQuery` hook to fetch data from the server.
3. The return object included `isLoading`, `isError`, `isFetching` and we used those to help inform the use of the status of the our particular query.
4. we looked at the `staleTime` , which determines whether or not the query data needs to be re-fetched on a certain trigger, like refocusing the window, and how old the data needs to be before it is considered stale.
5. The `gcTime` or garbage collection time is how long you want to hold on to the data after
inactivity.The cache data  can be used when that query gets called again to show the user as a placeholder.
6. quey key is what defines this data within the query cache. the query key always an array.
7. Pagination and pre-fetching data 
8. `useMutation` hook is used to make a network call that changes data on the server in this case adds a new blog post or delete post.