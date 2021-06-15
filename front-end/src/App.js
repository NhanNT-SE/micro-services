import "./App.scss";
import PostCreate from "./components/PostCreate";
import PostList from "./components/PostList";

function App() {
  return (
    <div className="App">
      <h1>Create Post:</h1>
      <PostCreate />
      <h1>Post List:</h1>
      <PostList />
    </div>
  );
}

export default App;
