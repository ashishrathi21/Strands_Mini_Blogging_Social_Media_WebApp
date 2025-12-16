import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import MyPostsPage from "./pages/MyPostsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import useAuthCheck from "./hooks/AuthCheck";

const App = () => {
  useAuthCheck();
  return (
    <div className="bg-[#0f1624] text-white flex w-full h-screen gap-6 px-5 py-4 overflow-hidden">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/my-posts" element={<MyPostsPage />} />
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
