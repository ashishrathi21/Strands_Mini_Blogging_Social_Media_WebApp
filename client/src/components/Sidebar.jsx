import { NavLink } from "react-router-dom";
import Logo from "../assets/logo.png";
import { IoIosSearch } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { CgProfile, CgFileDocument } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_API_END_POINT } from "../utils/EndPoints";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setProfile, setOtherUser } from "../redux/userSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      // 🔥 CLEAR REDUX STATE
      dispatch(setUser(null));
      dispatch(setProfile(null));
      dispatch(setOtherUser([]));

      if (res.data.success) {
        toast.success(res.data.message);
      }

      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="w-[18%] bg-[#131b2d] h-[calc(100vh-60px)] rounded-2xl p-6 flex flex-col justify-between shadow-lg">
      {/* TOP SECTION */}
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-2 mb-10">
          <img src={Logo} alt="" className="w-12 h-12 rounded-full" />
          <div className="text-2xl font-semibold tracking-wide">Strands</div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full mb-10">
          <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />

          <input
            type="text"
            className="w-full py-2 pl-12 pr-4 rounded-lg bg-[#0c1220] text-sm outline-none placeholder-gray-400 focus:ring-2 focus:ring-purple-500 transition-all"
            placeholder="Search..."
          />
        </div>

        {/* MENU ITEMS */}
        <ul className="flex flex-col gap-6 text-[15px]">
          {/* HOME */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 cursor-pointer transition-all relative 
               ${
                 isActive
                   ? "text-purple-400 font-semibold"
                   : "text-gray-400 hover:text-white"
               }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 -ml-6 h-full w-1 bg-purple-500 rounded-lg"></span>
                )}
                <AiFillHome className="text-xl" />
                Home
              </>
            )}
          </NavLink>

          {/* PROFILE */}
          <NavLink
            to="/profile"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 cursor-pointer transition-all relative 
               ${
                 isActive
                   ? "text-purple-400 font-semibold"
                   : "text-gray-400 hover:text-white"
               }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 -ml-6 h-full w-1 bg-purple-500 rounded-lg"></span>
                )}
                <CgProfile className="text-xl" />
                My Profile
              </>
            )}
          </NavLink>

          {/* MY POSTS */}
          <NavLink
            to="/my-posts"
            className={({ isActive }) =>
              `flex items-center gap-3 cursor-pointer transition-all relative 
               ${
                 isActive
                   ? "text-purple-400 font-semibold"
                   : "text-gray-400 hover:text-white"
               }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 -ml-6 h-full w-1 bg-purple-500 rounded-lg"></span>
                )}
                <CgFileDocument className="text-xl" />
                My Posts
              </>
            )}
          </NavLink>
        </ul>
      </div>

      {/* LOGOUT */}
      <div className="flex items-center gap-3 cursor-pointer text-gray-400 hover:text-white transition-all">
        <CiLogout className="text-xl" />
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
