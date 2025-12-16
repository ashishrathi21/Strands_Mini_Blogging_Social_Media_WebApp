import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFollowingPosts, setPostLoading } from "../redux/postSlice";
import { POST_API_END_POINT } from "../utils/EndPoints";

const useGetFollowingPosts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch(setPostLoading(true));
        const res = await axios.get(`${POST_API_END_POINT}/all-posts`, {
          withCredentials: true,
        });
        dispatch(setFollowingPosts(res.data.allPosts));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setPostLoading(false));
      }
    };

    fetchPosts();
  }, []);
};

export default useGetFollowingPosts;
