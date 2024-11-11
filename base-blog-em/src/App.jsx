import { Posts } from "./Posts";
import "./App.css";
import { QueryClient,QueryClientProvider } from "@tanstack/react-query";


//* This is where we would put our options for query client,
const queryClient = new QueryClient();
//* we have a query client, and we need to add that as props to query client provider.

function App() {
  return (
    // * So sny of these descendants are now going to have access to this query client, which contains the cache and all the other tools for react query.
    <QueryClientProvider client={queryClient}>
    <div className="App">
      <h1>Blog &apos;em Ipsum</h1>
      {/*//*Now we can call use Query in post component*/}
      <Posts />
    </div>
    </QueryClientProvider>
  );
}

export default App;
