
import { useQuery } from '@tanstack/react-query';
import './App.css';
import { fetchPosts } from './api/api';
import PostList from './components/post-lists';
import React,{useState} from 'react';
function App() {

  // const {data, isLoading,isError,status}= useQuery({
  //   queryKey:["posts"],
  //   queryFn: fetchPosts,

  // });

  // console.log(data,isLoading,status);
  const [toggle, setToggle] = useState(true);
  return (
    <div >
      <h1 className='title'>Learning ReactQuery</h1>
      <h2 className="title">My Posts </h2>
      <button onClick={() => setToggle(!toggle)}>Toggle</button>
      {toggle && <PostList />}
    </div>
  );
}

export default App;
