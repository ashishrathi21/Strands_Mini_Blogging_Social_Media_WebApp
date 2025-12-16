import { useState } from "react";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RiImageAddLine } from "react-icons/ri";
import defaultProfileImg from "../assets/default_profile.png";
import axios from "axios";
import toast from "react-hot-toast";
import { POST_API_END_POINT } from "../utils/EndPoints";
import { useSelector } from "react-redux";

const CreatePost = () => {
  const { user } = useSelector((state) => state.user);

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    if (!content.trim() && !image) {
      return toast.error("Post must have text or image");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      await axios.post(`${POST_API_END_POINT}/create-post`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully");
      setContent("");
      setImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#131b2d] rounded-2xl p-5 shadow-lg">
      <div className="flex items-start gap-4">
        <img
          src={user?.profilePicture || defaultProfileImg}
          className="w-12 h-12 rounded-full object-cover"
          alt="profile"
        />

        <div className="flex-1 bg-[#0c1220] border border-gray-700 rounded-lg px-4 py-2">
          <textarea
            rows={2}
            placeholder="What's happening?"
            className="w-full bg-transparent outline-none placeholder-gray-400 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />

          {image && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="max-h-40 rounded-lg object-cover"
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4 text-gray-400 text-xl">
              <label className="cursor-pointer">
                <RiImageAddLine />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>

              <MdOutlineEmojiEmotions />
            </div>

            <button
              onClick={handleCreatePost}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
