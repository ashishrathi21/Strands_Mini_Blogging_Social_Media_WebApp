import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMyPosts } from "../redux/postSlice";
import { POST_API_END_POINT } from "../utils/EndPoints";

const useGetMyPosts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await axios.get(`${POST_API_END_POINT}/my-posts`, {
          withCredentials: true,
        });

        dispatch(setMyPosts(res.data.posts || []));
      } catch (error) {
        console.log(error);
      }
    };

    fetchMyPosts();
  }, []);
};

export default useGetMyPosts;
