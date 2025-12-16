import { useEffect } from "react";
import axios from "axios";
import { POST_API_END_POINT } from "../utils/EndPoints";
import { useState } from "react";

const useGetUserPosts = (userId) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `${POST_API_END_POINT}/user-posts/${userId}`,
          { withCredentials: true }
        );
        setPosts(res.data.posts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  return { posts, loading };
};

export default useGetUserPosts;
