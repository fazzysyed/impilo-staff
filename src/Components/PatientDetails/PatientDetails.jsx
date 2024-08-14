import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import User from "../../assets/images/holderpic.jpeg";
import emptyState from "../../assets/images/reservation.png";
import { handleAPIRequest } from "../../helper/ApiHandler";
import Toast from "../AppLoader";
import CommonPrimaryButton from "../CommonPrimaryButton";
import axios from "axios";
const PatientDetails = () => {
  const location = useLocation();

  const [showModel, setShowModel] = useState(false);

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [price, setPrice] = useState("");
  const [doc, setDoc] = useState(null);
  const [slot, setSlot] = useState("");
  const [type, setType] = useState("");

  const [description, setDescription] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [gaps, setGaps] = useState([]);

  const professionals = useSelector((state) => state.pros);

  const [counterLocation, setLocation] = useState("");
  const [payDuration, setPayDuration] = useState("Hourly");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [showToast, setShowToast] = useState({
    toggle: false,
    lable: "",
    message: "",
    status: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const convertUTCToLocalTime = (dateString) => {
    console.log(dateString);
    let date = new Date(dateString);

    const milliseconds = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    );
    const localTime = new Date(milliseconds);
    localTime.getDate(); // local date
    localTime.getHours(); // local hour

    const utcDate = new Date(localTime);
    // Check if utcDate is a valid Date object
    if (isNaN(utcDate.getTime())) {
      console.error("Invalid Date");
    } else {
      const localDateString = utcDate.toLocaleDateString();

      let parts = localDateString.split("/");

      // Create a new Date object with the parts (month is 0-indexed in JavaScript Date)
      let formattedDate = new Date(parts[2], parts[0] - 1, parts[1]);

      // Format the date into 'YYYY-MM-DD' format
      let formattedDateString = formattedDate.toISOString().slice(0, 10);

      console.log(formattedDateString); // Output: "2024-07-24"
      const localTimeSting = utcDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${localTimeSting}`;
    }
  };

  const handleMakeAppointment = (data) => {
    setButtonLoading(true);
    const config = {
      method: "post",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      url: "https://brightspace.health/api/add-appointment",

      data: data,
    };

    axios(config)
      .then((response) => {
        console.log(response.data);

        setSlot("");
        setStartDate(null);
        setType("");
        setDescription("");
        setGaps([]);

        setShowToast({
          ...showToast,
          toggle: true,
          status: "success",
          message: "Appointment booked successfully",
          lable: "Appointment",
        });

        setTimeout(() => {
          setShowToast({
            ...showToast,
            toggle: false,
          });
        }, 2000);

        setButtonLoading(false);
      })
      .catch((e) => {
        console.log(e.response);
        setButtonLoading(false);
        setShowToast({
          ...showToast,
          toggle: true,
          status: "error",
          message: "Error",
          lable: e.response?.data?.message,
        });
        setTimeout(() => {
          setShowToast({
            ...showToast,
            toggle: false,
          });
        }, 2000);
      });
  };

  const handlegetDockAvailability = (data) => {
    const config = {
      method: "post",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      url: "https://brightspace.health/api/check-doct-avalibity",

      data: data,
    };

    axios(config)
      .then((response) => {
        setGaps(response?.data?.data?.gaps);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e.response);
        setLoading(false);
        setShowToast({
          ...showToast,
          toggle: true,
          status: "error",
          message: "Error",
          lable: e.response?.data?.message,
        });
        setTimeout(() => {
          setShowToast({
            ...showToast,
            toggle: false,
          });
        }, 2000);
      });
  };

  useEffect(() => {
    let route_uuid = location.search.split("?")[1];

    handleAPIRequest("get", `get-appointment-by-patient/${route_uuid}`, null)
      .then(async (response) => {
        console.log(response.data, "Farazzzzzz");
        setUserDetails(response?.data[0]?.patient_detail);
        setDoc(response?.data[0]?.doctor_id);
        setReservations(response?.data);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [professionals]);

  const handleStartDateChange = (date) => {
    setStartDate(dayjs(date).format("YYYY-MM-DD"));

    handlegetDockAvailability({
      date: dayjs(date).format("YYYY-MM-DD"),
      doc_id: doc,
    });
  };

  function DateIcon(props) {
    return (
      <div className="px-2 py-1.5 rounded-md bg-[#524494]  text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-calendar-days"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
        </svg>
      </div>
    );
  }
  const Rating = ({ rating, onRatingPress }) => {
    const stars = [];
    const maxRating = 5; // Change this to set the maximum rating

    for (let i = 1; i <= maxRating; i++) {
      const iconColor = i <= rating ? "gold" : "#9E9E9E";
      // Use 'gold' for selected stars and 'gray' for unselected stars

      // Use 'star' for filled and 'star-o' for empty stars
      stars.push(
        <div key={i}>
          <FaStar color={iconColor} />
        </div>
      );
    }

    return (
      <div
        className="text-2xl gap-2.5"
        style={{ display: "flex", flexDirection: "row", marginVertical: 5 }}
      >
        {stars}
      </div>
    );
  };
  return (
    <>
      {!loading && (
        <div>
          <div className="flex flex-col xl:flex-row border-b">
            <div className="basis-2/5 pt-12 col-span-2">
              <div className=" flex w-full gap-6 pl-6 md:pl-20 items-center ">
                {userDetails.profile_pic != null ? (
                  <img
                    className="w-28 h-28 flex justify-center capitalize rounded-xl shadow-class items-center bg-slate-700 text-xl font-thin object-cover text-white"
                    src={userDetails.profile_pic}
                  />
                ) : (
                  <img
                    className="w-28 h-28 flex justify-center capitalize rounded-xl shadow-class items-center bg-slate-700 text-xl font-thin object-cover text-white"
                    src={User}
                  />
                )}
                <div className=" mt-4">
                  <p className="profile-user-name capitalize text-2xl text-blue-900">
                    {userDetails?.name} {userDetails?.surename}
                  </p>
                  <p className="profile-designation text-sm text-gray-300 mt-1">
                    {userDetails?.licenses?.length ? (
                      <div className="flex gap-1">
                        {userDetails?.licenses?.map((item, index) => (
                          <p key={index} className="license-areas">
                            {item?.abbrev},
                          </p>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </div>

              <div className="border-b border-blue-300 w-full mt-12"></div>

              <div className="">
                <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row gap-4 2xl:gap-0 pl-5 md:pl-20 mt-10 mb-10">
                  <div className="border-right"></div>

                  <div className="profile-column2">
                    <div className="rating-section">
                      <div className="rating-text">
                        <p className="rating-heading">Engage ID</p>
                        <p className="license-areas">
                          {userDetails?.engage_id}
                        </p>
                      </div>
                    </div>

                    <div
                      className="rating-section"
                      style={{ marginTop: "1.5rem" }}
                    >
                      <div className="rating-text">
                        <p className="rating-heading">Email</p>
                        <p className="license-areas">
                          {userDetails?.email}
                          {/* {user?.addresses[0]?.zip} */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" border-l"></div>

            <div className=" flex flex-col items-center justify-start  border-l">
              <div className="w-auto flex justify-center items-end mt-4">
                <div className="flex flex-col items-center py-5 mb-28">
                  <h3 className=" text-neutral-800 text-3xl ">
                    Book Appointment
                  </h3>
                  <div className="md:w-[60vw] bg-white px-10  rounded-md mx-auto mt-10 flex flex-col gap-5  ">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-12 lg:gap-24">
                      <div className="w-full flex flex-col gap-2">
                        <p className="font-semibold text-base/none lg:text-xl/none pb-2 text-neutral-800">
                          Date
                        </p>
                        <div className="relative w-full">
                          <LocalizationProvider
                            className="w-full"
                            dateAdapter={AdapterDayjs}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                position: "relative",
                              }}
                            >
                              <DatePicker
                                sx={{
                                  width: "100%",
                                  "& .MuiInputBase-input": {
                                    padding: "12px",
                                    // Your other styles for the Paper component
                                  },
                                }}
                                onChange={handleStartDateChange}
                                defaultValue={startDate}
                                slotProps={{
                                  field: {
                                    clearable: true,
                                  },
                                }}
                                slots={{
                                  openPickerIcon: DateIcon,
                                }}
                              />
                            </Box>
                          </LocalizationProvider>
                        </div>
                      </div>
                    </div>
                    {gaps.length ? (
                      <div className="flex flex-wrap gap-2">
                        {gaps.map((item, index) => (
                          <span
                            onClick={() => {
                              setSlot(item.start);
                            }}
                            key={index}
                            className={`cursor-pointer px-4 py-2 rounded-full text-white ${
                              slot === item.start
                                ? "bg-[#524494]" // Selected slot color
                                : "bg-[#CBC3E3]" // Default slot color
                            }`}
                          >
                            {convertUTCToLocalTime(
                              `${startDate}T${item.start}`
                            )}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mb-4">
                      <label className="block mb-2">Appointment Type</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">Select Type</option>
                        {["Physical", "Audio Call", "Video Call"].map(
                          (option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <div>
                        <p className="font-semibold text-base/none lg:text-xl/none pb-2 text-neutral-800">
                          Description
                        </p>
                        <div className="relative w-full">
                          <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder="Enter details"
                            className="text-lg placeholder-[#B8C0CB] text-neutral-800 py-3 px-4 border border-[#C2C9D4] rounded w-full"
                          />
                        </div>
                      </div>
                      <div className="w-auto flex justify-center items-end mt-4">
                        <CommonPrimaryButton
                          onClick={() => {
                            if (!slot || !startDate || !type) {
                              // Show error message for missing fields
                              setShowToast({
                                ...showToast,
                                toggle: true,
                                status: "error",
                                message: "Please fill in all required fields",
                                lable: "Validation Error",
                              });
                              setButtonLoading(false);
                              return;
                            }

                            handleMakeAppointment({
                              doctor_id: doc,
                              patient_id: userDetails.id,
                              date: startDate,
                              time: slot,
                              description: description,
                              call_type: type,
                            });
                          }}
                          loading={buttonLoading}
                          text={"Make Appointment"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="review-section-container">
            <div className="slides-container">
              {userDetails?.reviewer?.map((item, index) => (
                <div key={index} className="slide1 flex">
                  <div style={{ display: "flex" }}>
                    <div className="slide-image-container"></div>
                    <div style={{ marginLeft: "1.2rem", marginTop: "0.2rem" }}>
                      <p className="user-review">
                        {" "}
                        {item?.reviewer?.firstname} {item?.reviewer?.lastname}
                      </p>
                      <Rating
                        // maxScale={5}
                        // style={{marginVertical: 20}}
                        rating={item?.rating}
                      />
                    </div>
                  </div>
                  <div className=" w-full whitespace-normal py-2 text-neutral-600">
                    {item.feedback}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {userDetails ? (
        <div className="flex main-container overflow-auto w-full">
          <div className="flex w-full flex-col    py-[52px]">
            <div className=" justify-center items-start text-neutral-700 flex w-full">
              <div className="text-[32px] font-semibold">Appointments</div>
            </div>
            {reservations?.length > 0 ? (
              <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full my-10 gap-8">
                {reservations?.map((item, index) => (
                  <div
                    key={index}
                    className=" h-full w-full  shadow-class rounded-lg overflow-hidden p-6 "
                  >
                    {" "}
                    <div className="flex flex-col w-full justify-start ">
                      <div className="flex flex-col items-center gap-4 w-full">
                        <div className="flex items-center text-neutral-700 bg-[#EFF4F8] rounded-sm px-4 flex-row gap-3 py-4 w-full">
                          <div className="p-2 flex justify-center items-center h-fit rounded-full bg-blue-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#524494"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-calendar-days"
                            >
                              <rect
                                width="18"
                                height="18"
                                x="3"
                                y="4"
                                rx="2"
                                ry="2"
                              />
                              <line x1="16" x2="16" y1="2" y2="6" />
                              <line x1="8" x2="8" y1="2" y2="6" />
                              <line x1="3" x2="21" y1="10" y2="10" />
                              <path d="M8 14h.01" />
                              <path d="M12 14h.01" />
                              <path d="M16 14h.01" />
                              <path d="M8 18h.01" />
                              <path d="M12 18h.01" />
                              <path d="M16 18h.01" />
                            </svg>
                          </div>
                          <div className=" flex flex-col">
                            <span className=" text-neutral-500 font-normal text-sm">
                              Date
                            </span>
                            <div className="flex">
                              <p className="font-normal text-base text-[#10274F]">
                                {dayjs(item.date, {
                                  format: "DD/MM/YYYY",
                                }).format("MMM. DD, YYYY")}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-start w-full flex-col gap-1">
                          <div className="font-semibold flex items-center gap-1">
                            <span className="font-normal text-sm text-[#828487]">
                              Status:
                            </span>
                            <p className="whitespace-pre-wrap pl-1 font-normal text-base text-[#524494] capitalize">
                              {item?.status}
                            </p>
                          </div>
                          <div className="font-semibold flex items-center gap-1">
                            <span className="font-normal text-sm text-[#828487]">
                              Type:
                            </span>
                            <p className="whitespace-pre-wrap pl-1 font-normal text-base text-[#524494] capitalize">
                              {item?.type}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start w-full gap-4 flex-col pt-5">
                        <div className=" capitalize font-semibold text-xl text-[#10274F]">
                          Appointment to:
                          {/* <GoPrimitiveDot className='online-icon'/> */}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className=" !rounded-full border overflow-hidden w-10 h-10">
                            {item.doctor_detail?.profile != null ? (
                              <img src={item.doctor_detail?.profile} />
                            ) : (
                              <img src={User} />
                            )}
                            {/* <GoPrimitiveDot className='online-icon'/> */}
                          </div>
                          <div className=" flex flex-col items-start">
                            <p className="font-medium text-base text-[#696F7A] capitalize">
                              {item?.doctor_detail?.name}
                              {item?.doctor_detail?.surename}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between border-t items-end pt-5 mt-5 w-full">
                        <div className="w-full">
                          <div className=" capitalize font-semibold text-lg text-[#10274F]">
                            Appointment by:
                            {/* <GoPrimitiveDot className='online-icon'/> */}
                          </div>
                          <div className="flex items-center w-fit gap-2 justify-between pt-3 ">
                            <div className=" !rounded-full border overflow-hidden w-10 h-10">
                              {item.patient_detail?.profile_pic != null ? (
                                <img src={item.patient_detail?.profile_pic} />
                              ) : (
                                <img src={User} />
                              )}
                              {/* <GoPrimitiveDot className='online-icon'/> */}
                            </div>
                            <p className="font-medium text-base text-[#696F7A] capitalize">
                              {item?.patient_detail?.name}{" "}
                              {item?.patient_detail?.surename}
                            </p>
                          </div>
                        </div>
                        <div className="w-full flex justify-end">
                          <CommonPrimaryButton
                            loading={false}
                            text={"Call"}
                            onClick={() => {
                              navigate(`/make-call`, {
                                state: { appointment: item },
                              });
                            }}
                          />
                        </div>
                        <div style={{ width: 20 }} />

                        <div className="w-full flex justify-end">
                          <CommonPrimaryButton
                            loading={false}
                            text={"Details"}
                            onClick={() => {
                              navigate(`/reservation-detail`, {
                                state: { appointment: item },
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex w-full justify-center center flex-col items-center gap-5 border p-12 bg-fcffE9 rounded-md mt-8">
                <img src={emptyState} className="w-32" />
                <div className="text-xl md:text-3xl ">
                  Your details will appear here
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <Toast setShowToast={setShowToast} showToast={showToast} />
    </>
  );
};
export default PatientDetails;
