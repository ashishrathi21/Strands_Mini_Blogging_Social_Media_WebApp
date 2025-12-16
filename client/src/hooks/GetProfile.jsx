import axios from "axios";
import { USER_API_END_POINT } from "../utils/EndPoints.js";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/userSlice.js";

const useGetProfile = (shouldFetch) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!shouldFetch) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile`, {
          withCredentials: true,
        });
        dispatch(setProfile(res.data.user));
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchProfile();
  }, [shouldFetch]);
};

export default useGetProfile;
