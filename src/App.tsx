import { useState } from 'react'
import AppRoutes from './routes/AppRoutes'
import { Toaster } from "sileo";

function App() {


  return (
    <>
      <div className="relative z-[9999]">
        <Toaster position="top-right" 
        options={{
          fill: "#171717",
          roundness: 16,
          styles: {
            title: "text-white!",
            description: "text-white/75!",
            badge: "bg-white/10!",
            button: "bg-white/10! hover:bg-white/15!",
          },
        }}/>
      </div>
      <AppRoutes/>
    </>
  )
}

export default App
