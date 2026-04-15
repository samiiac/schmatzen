import React ,{useState} from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

function RootLayout() {
 
  return (
    <div className="main-wrapper min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 ">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default RootLayout;
