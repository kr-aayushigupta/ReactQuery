import { useQuery, useMutation } from "@tanstack/react-query";
import "./App.css";

import { fetchPosts } from "./api/api";
import PostList from './components/post-lists';
import React, { useState } from "react";

// const POSTS = [
//   { id: 1, title: "Post 1" },
//   { id: 2, title: "Post 2" },
// ];



function App() {
  // const {data, isLoading,isError,status}= useQuery({
  //   queryKey:["posts"],
  //   queryFn: fetchPosts,

  // });
  // console.log(data,isLoading,status);

  // =============================================================
  const [toggle, setToggle] = useState(true);
  return (
    <div >
      <h1 className='title'>Learning ReactQuery</h1>
      <h2 className="title">My Posts </h2>
      <button onClick={() => setToggle(!toggle)}>Show Posts</button>
      {toggle && <PostList />}
    </div>
  );

  // ====================================================================

  // const postQuery = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: () => wait(1000).then(() => [...POSTS]),
  // })
  // if (postQuery.isLoading) return <h1>Loading...</h1>;

  // return (
  //   <div>
  //     <h1>ReactQuery</h1>
  //     <div>
  //     {postQuery.data.map(post=>{
  //       <div key={post.id}>{post.title}</div>
  //     })}
  //     </div>
      

  //   </div>
  // );
}

// function wait(duration) {
//   return new Promise(resolve => setTimeout(resolve, duration));
// }

export default App;
