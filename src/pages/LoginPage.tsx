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
  : "md:mt-[250px] mt-10";
  
  return (
    <div className="bg-primary min-h-screen py-5 px-3 relative">
      <img src={bgStyle} alt="bg-style" className="absolute top-0 left-0 w-full h-full z-0 md:w-1/2" />
      <div className='wrapper'>
        <div className='flex flex-col items-center z-1 relative md:flex-row md:justify-evenly ' >
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className='flex flex-col  items-center text-center mt-[5%] md:flex-row md:mt-[18%]'>
              <img src={logo} alt="Logo" className="w-24 h-20 inline" />
              <h2 className='text-white text-4xl font-bold inline lg:text-6xl md:text-5xl md:center'>Circles Chat</h2>
            </div>
            <div className='mt-2 py-2 pl-5 pr-2 md:mt-15'> 
            <h2 className='text-white hidden text-4xl lg:text-6xl md:text-5xl md:block'>Login into 
              <span className='block text-white mt-4'>your account</span></h2>
            <p className='mt-1 text-gray-500 text-xl md:mt-10 sm:text-2xl'>Let us make the circle bigger!</p>
          </div> 
          </div>
             
          <div className={`w-full pr-0 ${containerClass} md:w-1/2 md:pr-5 sm:w-3/4`} > 
            <div className="w-full max-w-full bg-white px-6 pt-10 pb-10 rounded-3xl block mx-auto md:max-w-150 md:px-12 sm:px-8">
              {renderForm()}
              <p className="text-left text-s text-gray-500 mt-4 xl:text-center xl:mt-[-32px] md:mt-4">
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
