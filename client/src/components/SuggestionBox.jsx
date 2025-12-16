import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import defaultProfileImg from "../assets/default_profile.png";

const SuggestionBox = () => {
  const otherUsers = useSelector((state) => state.user.otherUsers || []);

  return (
    <div className="w-[25%] bg-[#131b2d] h-[calc(100vh-60px)] rounded-2xl p-6 shadow-lg flex flex-col">
      <h2 className="text-xl font-semibold mb-6 text-white">You Might Like</h2>

      <div className="flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
        {otherUsers.length === 0 && (
          <p className="text-gray-400 text-sm">No users found</p>
        )}

        {otherUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between gap-4"
          >
            {/* LEFT: PROFILE PIC + NAME */}
            <div className="flex items-center gap-3">
              {/* PROFILE IMAGE */}
              <img
                src={user.profilePicture || defaultProfileImg}
                alt="profile"
                className="w-15 h-15 rounded-full object-cover border border-[#1f2940]"
              />

              {/* NAME + USERNAME */}
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-white">
                  {user.name}
                </span>
                <span className="text-xs text-gray-400">@{user.username}</span>
              </div>
            </div>

            {/* FOLLOW BUTTON */}
            <Link to={`/profile/${user?._id}`}>
              <button
                className="bg-[#8200DB] text-white text-sm font-medium
              px-6 py-1.5 rounded-md hover:opacity-90 transition"
              >
                Profile
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionBox;
