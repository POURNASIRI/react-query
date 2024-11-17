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
