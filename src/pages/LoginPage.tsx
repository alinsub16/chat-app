import React, { useState } from "react";
import logo from "@/assets/logo.png";
import bgStyle from "@/assets/bg-style.png";
import Register from '@/features/auth/pages/Register';
import Login from '@/features/auth/pages/Login';


const LoginPage = () => {
  // state to switch between login/register
  const [mode, setMode] = useState<"login" | "register">("login");

  // handler to toggle modes
  const handleToggle = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  const renderForm = () => {
    switch (mode) {
      case "login":
        return <Login />;
      case "register":
        return <Register />;
      default:
        return null;
    }
  };
  const containerClass = mode === "register"
  ? "mt-[25px]"
  : "mt-[250px]";
  
  return (
    <div className='bg-primary min-h-screen py-5 before' style={{ "--icon-url": `url(${bgStyle})` } as React.CSSProperties}>
      <div className='wrapper'>
        <div className='flex flex-start justify-evenly' >
          <div className="w-1/2">
            <div className='flex w-120 items-center text-center mt-[18%]'>
              <img src={logo} alt="Logo" className="w-24 h-20 inline" />
              <h2 className='text-white text-6xl font-bold inline'>Circles Chat</h2>
            </div>
            <div className='mt-15 py-2 pl-5 pr-2'>
            <h2 className='text-white text-6xl'>Login into 
              <span className='block text-white text-6xl mt-4'>your account</span></h2>
            <p className='mt-10 text-gray-500 text-2xl'>Let us make the circle bigger!</p>
          </div> 
          </div>
             
          <div className={`w-1/2 pr-5 ${containerClass}`} > 
            <div className="w-full max-w-150 bg-white px-12 pt-10 pb-15 rounded-3xl block mx-auto">
              {renderForm()}
              <p className="text-center text-m text-gray-500 mt-[-32px]">
                {mode === "login" ? (
                  <>
                    Don’t have an account?{" "}
                    <button onClick={handleToggle} className="text-blue-600 font-semibold">
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button onClick={handleToggle} className="text-blue-600 font-semibold">
                      Log in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
