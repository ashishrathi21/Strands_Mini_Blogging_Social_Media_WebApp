import axios from "axios";
import { USER_API_END_POINT } from "../utils/EndPoints";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOtherUser } from "../redux/userSlice";
import toast from "react-hot-toast";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/all-users`, {
          withCredentials: true,
        });
        dispatch(setOtherUser(res.data.users));
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchUsers();
  }, []);
};

export default useGetOtherUsers;
