import React from "react";
import NavBar from "../component/NavBar";

const Home = () => {
  return (
    <>
      <NavBar />
      <div>
        <img
          src="/home1.png"
          onClick={() => (window.location.href = "/main")}
        />
        <img src="/home2.png" />
        <img src="/home3.png" />
        <img src="/home4.png" />
        <img src="/home5.png" />
        <img src="/home6.png" />
      </div>
    </>
  );
};

export default Home;
