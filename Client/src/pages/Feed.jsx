import React, { useEffect, useState, useRef, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { updateTitle } from "../app/redux-reducers/contextProvider";
import { useDispatch } from "react-redux";

import apiService from "../logic/apiService";
import Post from "../components/posts/Post";

function Feed() {
    const { handleModal } = useOutletContext();

    const [posts, setPosts] = useState(undefined);
    const [postIncrement, setPostIncrement] = useState(1);
    const [hasMore, setHasMore] = useState(true); // Track if there are more posts to load

    const dispatch = useDispatch();

    const observer = useRef(); // Ref to hold the observer instance

    // Fetch initial posts on component mount
    useEffect(() => {
        dispatch(updateTitle("Feed"));
        fetchPosts(1);
    }, []);

    // Fetch more posts when postIncrement changes
    useEffect(() => {
        if (postIncrement === 1 || !hasMore) return; // Skip the initial page load

        fetchPosts(postIncrement);
    }, [postIncrement]);

    // Intersection observer callback to detect when the last post is visible
    const lastPostObserver = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect(); // Disconnect previous observer

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPostIncrement((prevIncrement) => prevIncrement + 1); // Increment page number to load more posts
                }
            });

            if (node) observer.current.observe(node); // Observe the last post element
        },
        [hasMore],
    );

    // Function to fetch posts
    const fetchPosts = (increment) => {
        apiService.get(`/feed/posts/${increment}`, {}).then((res) => {
            setPosts((prevPosts) => [...(prevPosts || []), ...res.result]); // Append new posts directly
            // If fewer than 15 posts are returned, assume there are no more posts to load
            if (res.result.length < 15) {
                setHasMore(false);
            }
        });
    };

    return (
        <div className="no-scrollbar flex w-full flex-col sm:overflow-auto">
            {!posts ? (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    <svg
                        aria-hidden="true"
                        className="fill-dark-primary h-8 w-8 animate-spin text-gray-200 dark:text-gray-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                </div>
            ) : posts.length === 0 ? (
                <div className="absolute left-1/2 top-1/2 w-auto -translate-x-1/2 -translate-y-1/2 transform">
                    <h3 className="text-m m-0 w-full text-start font-bold">
                        No posts found
                    </h3>
                    <h3 className="m-0 w-full whitespace-nowrap text-start text-xl font-bold">
                        Post something and be the first!
                    </h3>
                </div>
            ) : (
                posts.map((post, index) => {
                    if (index === posts.length - 1) {
                        // Attach observer to the last post
                        return (
                            <div ref={lastPostObserver} key={post.postID}>
                                 <Post
                                key={post.postID}
                                data={post}
                                handleModal={handleModal}
                                />
                            </div>
                        );
                    }
                    return (
                        <Post
                            key={post.postID}
                            data={post}
                            handleModal={handleModal}
                        />
                    );
                })
            )}
        </div>
    );
}

export default Feed;
