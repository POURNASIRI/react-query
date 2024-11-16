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
- making a network call thst changes data on the server in this case adds a new blog post or delete post.


### Mutaion steps
