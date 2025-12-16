import axios from "axios";
import { USER_API_END_POINT } from "../utils/EndPoints";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/userSlice";
import toast from "react-hot-toast";

const useGetUserById = (id) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/${id}`, {
          withCredentials: true,
        });

        dispatch(setProfile(res.data.user));
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchUser();
  }, [id]);
};

export default useGetUserById;
