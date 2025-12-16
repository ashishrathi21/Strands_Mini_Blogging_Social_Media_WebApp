import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import defaultProfileImg from "../assets/default_profile.png";
import defaultBannerImg from "../assets/banner_default.jpg";
import { USER_API_END_POINT } from "../utils/EndPoints";

const MyProfile = ({ profile }) => {
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();

  const isOwnProfile = !id || user?._id === profile?._id;
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(profile);
  const [isEdit, setIsEdit] = useState(false);
  const [isFollow, setIsFollow] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // edit states
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

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    if (coverPicture) {
      formData.append("coverPicture", coverPicture);
    }

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
      {/* PROFILE CARD */}
      <div className="w-full bg-[#131b2d] rounded-2xl overflow-hidden shadow-xl">
        <div className="relative h-40">
          <img
            src={coverImage}
            className="w-full h-full object-cover"
            alt="cover"
          />
          <img
            src={profileImage}
            className="w-32 h-32 rounded-full object-cover border-4 border-[#131b2d]
            absolute -bottom-16 left-8"
            alt="profile"
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
                px-4 py-1.5 rounded-full text-sm hover:bg-purple-500 hover:text-white transition cursor-pointer"
              >
                <FaRegEdit /> Edit profile
              </button>
            ) : (
              <button
                onClick={handleFollow}
                disabled={loadingFollow}
                className={`px-6 py-2 rounded-lg text-sm transition-all cursor-pointer
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

          <div className="flex items-center gap-8 mt-5 text-sm text-gray-400">
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
              <strong className="text-white">
                {profileData?.posts?.length || 0}
              </strong>{" "}
              Posts
            </span>
          </div>
        </div>
      </div>

      {isEdit && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-lg bg-[#131b2d] rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label htmlFor="coverInput" className="relative cursor-pointer">
                <img
                  src={
                    coverPicture
                      ? URL.createObjectURL(coverPicture)
                      : coverImage
                  }
                  className="w-full h-32 object-cover rounded-xl cursor-pointer"
                  alt="cover"
                />
                <div
                  className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 
                          transition flex items-center justify-center text-sm"
                >
                  Change cover
                </div>
              </label>
              <input
                id="coverInput"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setCoverPicture(e.target.files[0])}
              />

              {/* PROFILE IMAGE */}
              <div className="flex justify-center -mt-12">
                <label
                  htmlFor="profileInput"
                  className="cursor-pointer relative"
                >
                  <img
                    src={
                      profilePicture
                        ? URL.createObjectURL(profilePicture)
                        : profileImage
                    }
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#131b2d] cursor-pointer"
                    alt="profile"
                  />
                  <div
                    className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 
                            rounded-full transition flex items-center justify-center text-xs"
                  >
                    Edit
                  </div>
                </label>
              </div>
              <input
                id="profileInput"
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />

              {/* TEXT FIELDS */}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="bg-[#0c1220] px-4 py-2 rounded"
              />

              <input
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Username"
                className="bg-[#0c1220] px-4 py-2 rounded"
              />

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Bio"
                className="bg-[#0c1220] px-4 py-2 rounded resize-none"
              />

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 mt-2 ">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 px-5 py-2 rounded cursor-pointer"
                >
                  Save
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
