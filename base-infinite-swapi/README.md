# React Query (infinite scroll)

## Getting Started

- Add query client, query client provider and react query devtools to app component

```jsx
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='App'>
        <h1>Infinite SWAPI</h1>
        <InfinitePeople />
        <InfiniteSpecies />
      </div>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
```

## `useInfiniteQuery`

1. Shape of data different than `useQuery`

- the data property that's returned in the return object is a different shape

2. Object with to properties:

- With `useQuery`, the data was simply the data that was returned from the query function, But with `useInfiniteQuery`, the object actually has tow properties:
- `pages`: An array of pages of objects for each page of data. So exch elements in the pages array would correspond to what you would get for data from a single `useQuery`
- `pageParams`: Then there's page params and that's recording what your param is for every page.

3. Every query has its own element in the pages array and that element represents the data for that query.
4. `pageParams` track the keys of queries that have been retrieved.

### `useInfiniteQuery` syntax:

The `useInfiniteQuery` syntax also differs from `useQuery` syntax.

- How does that work ?
- `pageParams` is a parameter passed to the query function.

```jsx
useInfiniteQuery({
  queryKey: ['sw-people'],
  queryFn: ({ pageParam = initialPage }) => fetchUrl(pageParam),
});
```

- Current value of `pageParam` is maintained by React Query.
- `useInfiniteQuery` options
- `getNextPageParam`:(lastPage, allPages)
- There's a get next page param option, which is a function that will tells it how to get the next page
  either data dfrom the last page , or data from the all pages.

### `useInfiniteQuery` Return Object Properties

- `fetchNextPage`: function to call when the user needs more data
- So when the user click the button that askes for more data, or when the user hit to the point the screen, where the user about to run out of data.
- `haseNextPage`: Based on return value of `getNextPageParam` function
- That property that we pass to `useInfiniteQuery` to tell it: How to use the data from the last query to get whatever our next query is going to be.
- is `undefined` if there's no more data to fetch and `hasNextPage` will be `false`.
- `isFetchingNextPage`: a boolean that tells us if the query is fetching data for the next page or not.
