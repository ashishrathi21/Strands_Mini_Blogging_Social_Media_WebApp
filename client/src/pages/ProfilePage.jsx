import React from "react";
import MyProfile from "../components/MyProfile";
import Sidebar from "../components/Sidebar";
import SuggestionBox from "../components/SuggestionBox";
import useGetProfile from "../hooks/GetProfile.jsx";
import { useSelector } from "react-redux";
import useGetOtherUsers from "../hooks/GetOtherUsers.jsx";
import { useParams } from "react-router-dom";
import useGetUserById from "../hooks/GetUserById";

const ProfilePage = () => {
  const { id } = useParams();
  const { profile } = useSelector((store) => store.user);
  useGetOtherUsers();
  useGetProfile(!id);
  useGetUserById(id);
  return (
    <div className="flex bg-[#0f1624] text-white w-full min-h-screen p-5 gap-6">
      <Sidebar />

      <div className="flex-1 h-full overflow-y-auto no-scrollbar">
        <MyProfile profile={profile} />
      </div>

      <SuggestionBox />
    </div>
  );
};

export default ProfilePage;
