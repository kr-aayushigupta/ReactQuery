import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRef, useEffect } from 'react';
import "../App.css";

const fetchPosts = async ({ pageParam = 1 }) => {
  const res = await axios.get(`https://jsonplaceholder.typicode.com/posts?_limit=2&_page=${pageParam}`);
  return res.data;
};

export default function MyComponent() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 2) return undefined;
      return allPages.length + 1;
    },
  });

  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    const refElement = loadMoreRef.current;
    if (refElement) observer.observe(refElement);

    return () => {
      if (refElement) observer.unobserve(refElement);
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts: {(error ).message}</p>;
  if (!data) return <p>No data available.</p>;

  return (
    <div>
      {data.pages.map((page, pageIndex) => (
        <div key={pageIndex} style={{display:'flex-col', gap:'4px',alignItems:'normal'}}>
          {page.map((post) => (
            <div key={post.id} style={{ padding: '10px', border: '1px solid rgb(216, 65, 91)' ,backgroundColor: 'rgb(228, 134, 150)'}}>
              <h4>{post.title}</h4>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      ))}
      <div ref={loadMoreRef} style={{ height: '40px' }} />
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
}
