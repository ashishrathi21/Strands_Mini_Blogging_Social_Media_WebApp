import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { USER_API_END_POINT } from "../utils/EndPoints";
import toast from "react-hot-toast";

const useAuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/me`, {
          withCredentials: true,
        });

        dispatch(setUser(res.data.user));
      } catch (error) {
        dispatch(setUser(null));
        toast.error(error.response.data.message);
      }
    };

    checkAuth();
  }, []);
};

export default useAuthCheck;
