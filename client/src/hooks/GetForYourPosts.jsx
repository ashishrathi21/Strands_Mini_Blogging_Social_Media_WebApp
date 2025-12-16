import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setForYouPosts, setPostLoading } from "../redux/postSlice";
import { POST_API_END_POINT } from "../utils/EndPoints";

const useGetForYouPosts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        dispatch(setPostLoading(true));
        const res = await axios.get(`${POST_API_END_POINT}/public-posts`, {
          withCredentials: true,
        });
        dispatch(setForYouPosts(res.data.posts));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setPostLoading(false));
      }
    };

    fetchPosts();
  }, []);
};

export default useGetForYouPosts;
