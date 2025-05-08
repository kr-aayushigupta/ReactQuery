
// For Fetching the data
const fetchPosts = async (page) => {
    const response = await fetch(
      `http://localhost:3000/posts?_sort=-id&${
        page ? `_page=${page}&_per_page=5` : ""
      }`
    );
  
    if (!response.ok) {
      throw new Error(`Failed to fetch posts. Status: ${response.status}`);
    }
  
    const postData = await response.json();
    return postData;
  };
  

//   Fetching the tags of each post
  const fetchTags = async () => {
    const response = await fetch("http://localhost:3000/tags");
    const tagsData = await response.json();
    return tagsData;
  };


//   for adding a post
  
  const addPost = async (post) => {
    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
  
    return response.json();
  };
  
  export {fetchPosts, fetchTags, addPost};