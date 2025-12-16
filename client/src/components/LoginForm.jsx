import React, { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/EndPoints.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice.js";

const LoginForm = ({ setCurrState }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      navigate("/");
      dispatch(setUser(res?.data?.user));
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className="w-[30%] p-8 ">
      <h2 className="text-5xl font-semibold text-white mb-8 px-2">Login Now</h2>

      <div className="flex flex-col gap-5">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          name="email"
          autoComplete="off"
          className="w-full rounded-full bg-[#0c1220] px-4 py-3 outline-none text-gray-200
                     placeholder-gray-400 border border-transparent
                     focus:border-purple-500 transition"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          name="password"
          autoComplete="new-password"
          className="w-full rounded-full bg-[#0c1220] px-4 py-3 outline-none text-gray-200
                     placeholder-gray-400 border border-transparent
                     focus:border-purple-500 transition"
        />
      </div>

      <button
        type="submit"
        className="px-10 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full
                   font-semibold text-[17px] mt-8 transition"
      >
        Login
      </button>

      <p className="text-gray-400 text-sm text-start px-2 mt-4">
        Don't Have an Account?{" "}
        <span
          onClick={() => setCurrState("Sign Up")}
          className="text-purple-400 cursor-pointer hover:underline"
        >
          Sign Up
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
