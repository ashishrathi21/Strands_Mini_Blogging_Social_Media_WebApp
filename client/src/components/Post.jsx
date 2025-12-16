import { useState } from "react";
import { FaRegHeart, FaHeart, FaRegComment, FaTrash } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import defaultProfileImg from "../assets/default_profile.png";
import { POST_API_END_POINT } from "../utils/EndPoints";
import { removeMyPost } from "../redux/postSlice";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [likes, setLikes] = useState(post?.likes || []);
  const [isLiking, setIsLiking] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const isLiked = likes.includes(user?._id);
  const isOwner = post?.user?._id === user?._id;

  /* ================= LIKE ================= */
  const handleLike = async () => {
    if (!user) return;

    try {
      setIsLiking(true);

      await axios.put(
        `${POST_API_END_POINT}/like-post/${post._id}`,
        {},
        { withCredentials: true }
      );

      setLikes((prev) =>
        isLiked ? prev.filter((id) => id !== user._id) : [...prev, user._id]
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLiking(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${POST_API_END_POINT}/delete-post/${post._id}`, {
        withCredentials: true,
      });

      dispatch(removeMyPost(post._id)); // 🔥 remove from redux
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= CONTENT ================= */
  const MAX_LENGTH = 180;
  const isLongText = post?.content?.length > MAX_LENGTH;

  const displayedText = showMore
    ? post?.content
    : post?.content?.slice(0, MAX_LENGTH);

  return (
    <div className="w-full bg-[#131b2d] rounded-2xl p-6 shadow-lg">
      {/* USER INFO */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={post?.user?.profilePicture || defaultProfileImg}
            className="w-12 h-12 rounded-full object-cover"
            alt="user"
          />
          <div>
            <h3 className="font-semibold text-lg">{post?.user?.name}</h3>
            <p className="text-gray-400 text-sm">@{post?.user?.username}</p>
          </div>
        </div>

        {/* DELETE BUTTON (ONLY OWNER) */}
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-600 transition"
          >
            <FaTrash />
          </button>
        )}
      </div>

      {/* POST CONTENT */}
      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
        {displayedText}
        {isLongText && !showMore && "..."}

        {isLongText && (
          <span
            onClick={() => setShowMore(!showMore)}
            className="text-purple-400 cursor-pointer text-sm ml-2"
          >
            {showMore ? "Show Less" : "Read More"}
          </span>
        )}
      </p>

      {/* POST IMAGE */}
      {post?.image && (
        <div className="mt-4 flex justify-center bg-[#0f1624] rounded-xl">
          <img
            src={post.image}
            className="max-h-[450px] w-auto object-contain"
            alt="post"
          />
        </div>
      )}

      <div className="border-b border-gray-700 my-4"></div>

      {/* ACTIONS */}
      <div className="flex gap-10 text-gray-400">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className="flex items-center gap-2 hover:text-white transition"
        >
          <span className={isLiked ? "text-red-500" : ""}>
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </span>

          <span>{likes.length}</span>
        </button>

        <button className="flex items-center gap-2 hover:text-white">
          <FaRegComment /> Comments
        </button>
      </div>
    </div>
  );
};

export default Post;
