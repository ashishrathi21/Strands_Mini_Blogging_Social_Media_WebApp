import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import SuggestionBox from "../components/SuggestionBox";
import useGetOtherUsers from "../hooks/GetOtherUsers";
import useGetForYouPosts from "../hooks/GetForYourPosts";
import useGetFollowingPosts from "../hooks/GetFollowingPosts";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("forYou");

  useGetOtherUsers();
  useGetForYouPosts();
  useGetFollowingPosts();

  const { forYou, following } = useSelector((state) => state.posts);

  return (
    <div className="text-white flex w-full h-screen gap-6 px-5 py-4 overflow-hidden">
      <Sidebar />

      {/* CENTER */}
      <div className="flex-1 h-full overflow-y-scroll no-scrollbar flex flex-col gap-6">
        <CreatePost />

        {/* TABS */}
        <div className="flex gap-8 border-b border-[#1f2940] pb-2">
          <button
            onClick={() => setActiveTab("forYou")}
            className={`pb-2 text-sm font-medium ${
              activeTab === "forYou"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400"
            }`}
          >
            For You
          </button>

          <button
            onClick={() => setActiveTab("following")}
            className={`pb-2 text-sm font-medium ${
              activeTab === "following"
                ? "text-white border-b-2 border-purple-500"
                : "text-gray-400"
            }`}
          >
            Following
          </button>
        </div>

        {/* POSTS */}
        {/* POSTS */}
        {activeTab === "forYou" && (
          <>
            {forYou.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <p className="text-lg font-medium">No posts yet</p>
                <p className="text-sm mt-1">
                  Be the first one to share something ✨
                </p>
              </div>
            ) : (
              forYou.map((post) => <Post key={post._id} post={post} />)
            )}
          </>
        )}

        {activeTab === "following" && (
          <>
            {following.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <p className="text-lg font-medium">No posts from following</p>
                <p className="text-sm mt-1">
                  Follow people to see their posts here 👥
                </p>
              </div>
            ) : (
              following.map((post) => <Post key={post._id} post={post} />)
            )}
          </>
        )}
      </div>

      <SuggestionBox />
    </div>
  );
};

export default HomePage;
