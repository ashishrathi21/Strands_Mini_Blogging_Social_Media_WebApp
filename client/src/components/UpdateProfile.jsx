import { MdOutlineEmojiEmotions } from "react-icons/md";
import { RiImageAddLine } from "react-icons/ri";
import defaultProfileImg from "../assets/default_profile.png";

const CreatePost = () => {
  return (
    <div className="w-full bg-[#131b2d] rounded-2xl p-5 shadow-lg">
      <div className="flex items-center gap-4">
        <img src={defaultProfileImg} className="w-12 h-12 rounded-full" />

        <div className="flex-1 bg-[#0c1220] border border-gray-700 rounded-lg px-4 py-2 flex items-center gap-4">
          <textarea
            rows={2}
            type="text"
            placeholder="What's Happening ?"
            className="flex-1 bg-transparent outline-none placeholder-gray-400 resize-none"
          />

          <div className="flex items-center gap-4 text-gray-400 text-xl">
            <RiImageAddLine />

            <MdOutlineEmojiEmotions />
          </div>
        </div>

        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold">
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
