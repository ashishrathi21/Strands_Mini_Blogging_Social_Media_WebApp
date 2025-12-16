import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import SuggestionBox from "../components/SuggestionBox";
import Post from "../components/Post";
import useGetMyPosts from "../hooks/GetMyPosts";
import useGetOtherUsers from "../hooks/GetOtherUsers";

const MyPostsPage = () => {
  useGetOtherUsers();
  useGetMyPosts();

  const { myPosts = [] } = useSelector((state) => state.posts || {});

  return (
    <div className="flex bg-[#0f1624] text-white w-full h-screen p-5 gap-6 overflow-hidden">
      <Sidebar />

      <div className="flex-1 h-full overflow-y-auto pr-2">
        <h2 className="text-2xl font-bold mb-6">My Posts</h2>

        {myPosts.length === 0 ? (
          <p className="text-gray-400 text-sm">
            You haven’t posted anything yet.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {myPosts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      <SuggestionBox />
    </div>
  );
};

export default MyPostsPage;
