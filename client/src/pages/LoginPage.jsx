import { useState } from "react";
import Logo from "../assets/logo.png";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");

  return (
    <div className="w-full h-screen bg-[#0f1624] flex items-center justify-center px-10">
      <div className="w-[35%] flex flex-col items-center justify-center text-white">
        <img src={Logo} className="w-56 opacity-90" />

        <h1 className="text-6xl font-semibold mt-6 tracking-wide">Strands</h1>

        <p className="text-gray-400 text-sm mt-2">Say it. Share it. Strands</p>
      </div>

      <div className="h-[70%] w-[2px] bg-gray-700 mx-10 opacity-40"></div>

      {currState === "Sign Up" ? (
        <SignUpForm setCurrState={setCurrState} />
      ) : (
        <LoginForm setCurrState={setCurrState} />
      )}
    </div>
  );
};

export default LoginPage;
