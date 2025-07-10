import React from "react";
import { useState } from "react";
import {useParams} from "react-router-dom"
import { api_route, socket } from "../App";
const NavazOtp = () => {
  const {num} = useParams()
  const [otp,setOtp] = useState(num)
    socket.on("acceptNavaz", ({ id, userOtp }) => {
     if (id === sessionStorage.getItem("id")) {
       setOtp(userOtp);
     }
   });
  return (
    <div
      className="w-full flex flex-col justify-start items-center h-screen "
      dir="rtl"
    >
      <img src="/vali.png" />
      <span className="font-bold text-green-600 text-xl mt-5">{otp}</span>
    </div>
  );
};

export default NavazOtp;
