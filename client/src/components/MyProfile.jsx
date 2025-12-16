import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import { USER_API_END_POINT, POST_API_END_POINT } from "../utils/EndPoints";
import { setUser } from "../redux/userSlice";

import Post from "./Post";
import defaultProfileImg from "../assets/default_profile.png";
import defaultBannerImg from "../assets/banner_default.jpg";

const MyProfile = ({ profile }) => {
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useDispatch();

  const isOwnProfile = !id || user?._id === profile?._id;

  const [profileData, setProfileData] = useState(profile);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [isEdit, setIsEdit] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // edit fields
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);

  /* ---------------- SYNC PROFILE ---------------- */
  useEffect(() => {
    setProfileData(profile);
  }, [profile]);

  /* ---------------- FOLLOW STATE ---------------- */
  useEffect(() => {
    if (!profileData || !user) return;
    setIsFollow(profileData.followers?.includes(user._id));
  }, [profileData, user]);

  /* ---------------- FETCH USER POSTS ---------------- */
  useEffect(() => {
    if (!profileData?._id) return;

    const fetchPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await axios.get(
          `${POST_API_END_POINT}/user-posts/${profileData._id}`,
          { withCredentials: true }
        );
        setPosts(res.data.posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [profileData?._id]);

  /* ---------------- FOLLOW / UNFOLLOW ---------------- */
  const handleFollow = async () => {
    try {
      setLoadingFollow(true);

      const url = isFollow
        ? `${USER_API_END_POINT}/unfollow/${profileData._id}`
        : `${USER_API_END_POINT}/follow/${profileData._id}`;

      await axios.put(url, {}, { withCredentials: true });

      setProfileData((prev) => ({
        ...prev,
        followers: isFollow
          ? prev.followers.filter((id) => id !== user._id)
          : [...prev.followers, user._id],
      }));

      setIsFollow(!isFollow);
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setLoadingFollow(false);
    }
  };

  /* ---------------- EDIT PROFILE ---------------- */
  const openEditModal = () => {
    setIsEdit(true);
    setName(profileData?.name || "");
    setUserName(profileData?.username || "");
    setBio(profileData?.bio || "");
    setProfilePicture(null);
    setCoverPicture(null);
  };

  const closeEditModal = () => setIsEdit(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("bio", bio);
    if (profilePicture) formData.append("profilePicture", profilePicture);
    if (coverPicture) formData.append("coverPicture", coverPicture);

    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/update-profile`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data.message);
      setProfileData(res.data.user);
      dispatch(setUser(res.data.user));
      closeEditModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const coverImage = profileData?.coverPicture || defaultBannerImg;
  const profileImage = profileData?.profilePicture || defaultProfileImg;

  return (
    <>
      {/* ================= PROFILE CARD ================= */}
      <div className="w-full bg-[#131b2d] rounded-2xl overflow-hidden shadow-xl">
        <div className="relative h-40">
          <img src={coverImage} className="w-full h-full object-cover" />
          <img
            src={profileImage}
            className="w-32 h-32 rounded-full object-cover border-4 border-[#131b2d]
            absolute -bottom-16 left-8"
          />
        </div>

        <div className="pt-20 px-8 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{profileData?.name}</h2>
              <p className="text-gray-400 text-sm">@{profileData?.username}</p>
            </div>

            {isOwnProfile ? (
              <button
                onClick={openEditModal}
                className="flex items-center gap-2 border border-purple-500 text-purple-400
                px-4 py-1.5 rounded-full text-sm hover:bg-purple-500 hover:text-white"
              >
                <FaRegEdit /> Edit profile
              </button>
            ) : (
              <button
                onClick={handleFollow}
                disabled={loadingFollow}
                className={`px-6 py-2 rounded-lg text-sm
                  ${
                    isFollow
                      ? "bg-transparent border border-[#8200DB] text-[#8200DB]"
                      : "bg-[#8200DB] text-white"
                  }`}
              >
                {isFollow ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          <p className="text-gray-300 text-sm mt-4 max-w-xl">
            {profileData?.bio || "Hey! What's happening..."}
          </p>

          <div className="flex gap-8 mt-5 text-sm text-gray-400">
            <span>
              <strong className="text-white">
                {profileData?.followers?.length || 0}
              </strong>{" "}
              Followers
            </span>
            <span>
              <strong className="text-white">
                {profileData?.following?.length || 0}
              </strong>{" "}
              Following
            </span>
            <span>
              <strong className="text-white">{posts.length}</strong> Posts
            </span>
          </div>
        </div>
      </div>

      {/* ================= USER POSTS ================= */}
      <div className="mt-6 w-full bg-[#131b2d] rounded-2xl shadow-lg">
        <h3 className="px-6 py-4 border-b border-[#1f2940] text-lg font-semibold">
          Posts
        </h3>

        <div className="max-h-[520px] overflow-y-auto no-scrollbar p-6 flex flex-col gap-6">
          {loadingPosts ? (
            <p className="text-gray-400 text-sm">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-400 text-sm">No posts yet.</p>
          ) : (
            posts.map((post) => <Post key={post._id} post={post} />)
          )}
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {isEdit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-lg bg-[#131b2d] rounded-2xl p-6 shadow-xl">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Edit Profile</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* COVER IMAGE */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Cover Image
                </label>
                <div className="relative">
                  <img
                    src={
                      coverPicture
                        ? URL.createObjectURL(coverPicture)
                        : coverImage
                    }
                    className="w-full h-32 object-cover rounded-lg"
                    alt="cover"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverPicture(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* PROFILE IMAGE */}
              <div className="flex justify-center -mt-12">
                <div className="relative">
                  <img
                    src={
                      profilePicture
                        ? URL.createObjectURL(profilePicture)
                        : profileImage
                    }
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#131b2d]"
                    alt="profile"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
                  />
                </div>
              </div>

              {/* NAME */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0c1220] px-4 py-2 rounded-lg outline-none"
                  placeholder="Your name"
                />
              </div>

              {/* USERNAME */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[#0c1220] px-4 py-2 rounded-lg outline-none"
                  placeholder="@username"
                />
              </div>

              {/* BIO */}
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Bio</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#0c1220] px-4 py-2 rounded-lg outline-none resize-none"
                  placeholder="Tell something about yourself..."
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600
            px-6 py-2 rounded-full text-sm font-medium hover:opacity-90"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MyProfile;
