import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetchPosts, fetchTags, addPost} from "../api/api";
import "../App.css";

function PostList() {
  const [page, setPage] = useState(1);


// UseQueryCLient hook 
  const queryClient = useQueryClient();


//   useQuery for POSTS
  const {
    data: postData,
    isError,
    error,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["posts", {page}],
    queryFn: () => fetchPosts(page),
    // 👇 will run query every interval
    // refreshInterval: 1000 * 60, //its will be fetched every 5 secs
    // 👇 Query runs when this is true
    // enabled: true,
    // 👇 while staletime lasts, it wont refetch on remount
    staleTime: 1000 * 60 * 5, // it denotes after what time willl the post become stale
    // 👇 Dont allow caching and will make posts forever stale
    // gcTime: 0,
    // 👇 keeps the last used data
    // placeholderData: (previousData) => previousData,
  });


//   UseQuery for TAGS
  const {data: tagsData, isLoading: isTagsLoading} = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    // 👇 Since this wont change we dont want to refetch it
    staleTime: Infinity,  // we have set the tags as fresh meaning they are neven stale  and won't be fetched again
  });


//===========  MUTATE===================================
  const {
    mutate,
    isPending,
    isError: isPostError,
    reset,
  } = useMutation({
    mutationFn: addPost,
    //👇 num of times it will retry before failing
    retry: 3,

    // onMutate runs before the actual mutation happens
    onMutate: async () => {
      // 👇 Can be used to cancel outgoing queries
      await queryClient.cancelQueries({queryKey: ["posts"], exact: true});
    },

    // onSuccess runs after the mutation has happened
    onSuccess: () => {
      queryClient.invalidateQueries({
        // 👇 Invalidate queries with a key that starts with `posts`
        queryKey: ["posts", {page}], //if only posts is passed - it will invalidated wach and every posts and refecth them all

        // 👇 invalidate exact query
        // exact: true,

        // 👇 invalidate specific query key/s
        // queryKey: ["todos", {page: 10}],

        // 👇 invalidate range of query keys
        // predicate: (query) => query.queryKey[0] === "posts" && query.queryKey[1].page >= 2,

      });

      // 👇 We can manually add to posts to avoid api calls
      //   queryClient.setQueryData(["posts"], (old) => [data, ...old]);
    },

    // onError:(error,variables,context)=>{},
    // onSettled:(error,variables,context)=>{},



  });

  const handleSubmit = (e) => {
    e.preventDefault();  //to prevent page from reloading
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    );

    if (!title || !tags) return;

    mutate({id: postData?.items + 1, title, tags}); //mutate is called here

    e.target.reset(); // reset the form
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>



        {isPostError && <h5 onClick={() => reset()}>Unable to Post</h5>}

        {/* INput to enter a post */}
        <input
          type="text"
          placeholder="Enter your post.."
          className="postbox"
          name="title"
        />

        {/* Imput to tick the suitable tags of the newly written post */}
        <div className="tags">
          {tagsData?.map((tag) => {
            return (
              <div key={tag}>
                <input name={tag} id={tag} type="checkbox" />
                <label htmlFor={tag}>{tag}</label>
              </div>
            );
          })}
        </div>


        {/* Button for posting the newly written post */}
        <button disabled={isPending}>
          {isPending ? "Posting..." : "Post"}
        </button>
      </form>


      {/* Display all the posts - in group of 5 */}
      
      {isLoading && isTagsLoading && <p>Loading...</p>}
      {isError && <p>{error?.message}</p>}
      {postData?.data?.map((post) => {
        return (
          <div key={post.id} className="post">
            <div>{post.title}</div>
            {post.tags.map((tag) => {
              return <span key={tag}>{tag}</span>;
            })}
          </div>
        );
      })}

      {/* Pagination */}
      <div className="pages">
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          disabled={!postData?.prev}
        >
          Previous Page
        </button>
        <span>{page}</span>
        <button
          onClick={() => {
            if (!isPlaceholderData && postData?.next) {
              setPage((old) => old + 1);
            }
          }}
          // Disable the Next Page button until we know a next page is available
          disabled={isPlaceholderData || !postData?.next}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default PostList;