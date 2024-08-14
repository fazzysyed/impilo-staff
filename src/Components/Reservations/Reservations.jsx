import React, { useEffect, useState } from "react";
import emptyState from "../../assets/images/reservation.png";
import User from "../../assets/images/holderpic.jpeg";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { handleAPIRequest } from "../../helper/ApiHandler";
import { setAllReasevation } from "../../Store/Actions/Actions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CommonPrimaryButton from "../CommonPrimaryButton";
import Toast from "../AppLoader";
import { async } from "@firebase/util";
import axios from "axios";
const Reservations = () => {
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [noteVisible, setNoteVisible] = useState(false);
  const [terms, setTerms] = useState("");
  // const reservations = useSelector((state) => state.reservations);
  const [reservations, setReservations] = useState([]);
  const [showToast, setShowToast] = useState({
    toggle: false,
    lable: "",
    message: "",
    status: "",
  });

  const handleGetAppointments = async () => {
    setLoading(true);
    try {
      const response = await handleAPIRequest(
        "get",
        `get-appointment-pending/${user.id}`,
        null
      );
      // Handle the response

      setReservations(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAppointment = () => {
    setButtonLoading(true);
    const config = {
      method: "post",
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      url: `https://brightspace.health/api/add-appointment-approved/${selected.id}`,

      data: {
        appointmentId: selected.id,
        status: "approved",
        note: terms,
      },
    };

    axios(config)
      .then((response) => {
        console.log(response.data);

        setShowToast({
          ...showToast,
          toggle: true,
          status: "success",
          message: "Appointment approved successfully",
          lable: "Appointment",
        });

        setTimeout(() => {
          setShowToast({
            ...showToast,
            toggle: false,
          });
        }, 2000);

        setButtonLoading(false);
        window.location.reload();
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

  useEffect(() => {
    handleGetAppointments();
  }, [location]);
  return (
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
                      <Link className=" !rounded-full border overflow-hidden w-10 h-10">
                        {item.doctordetail?.profile != null ? (
                          <img src={item.doctordetail?.profile} />
                        ) : (
                          <img src={User} />
                        )}
                        {/* <GoPrimitiveDot className='online-icon'/> */}
                      </Link>
                      <div className=" flex flex-col items-start">
                        <p className="font-medium text-base text-[#696F7A] capitalize">
                          {item?.doctordetail?.name}
                          {item?.doctordetail?.surename}
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
                        <Link className=" !rounded-full border overflow-hidden w-10 h-10">
                          {item.patientdetail?.profile_pic != null ? (
                            <img src={item.patientdetail?.profile_pic} />
                          ) : (
                            <img src={User} />
                          )}
                          {/* <GoPrimitiveDot className='online-icon'/> */}
                        </Link>
                        <p className="font-medium text-base text-[#696F7A] capitalize">
                          {item?.patientdetail?.name}{" "}
                          {item?.patientdetail?.surename}
                        </p>
                      </div>
                    </div>

                    <div className="w-full flex justify-end">
                      <CommonPrimaryButton
                        loading={false}
                        text={"Approve"}
                        onClick={() => {
                          setSelected(item);
                          setNoteVisible(true);
                          // navigate(`/reservation-detail`, {
                          //   state: { appointment: item },
                          // });
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
              Your pending appointments will appear here
            </div>
          </div>
        )}

        {noteVisible && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>

            <div className="h-screen inset-0 flex justify-center items-center w-full fixed z-50  m-auto">
              <div className="w-full max-w-[600px] flex flex-col fixed justify-start items-start p-8 z-20 transition-all ease-in-out duration-300 bg-white  shadow-xl content-scroll overflow-auto">
                <div className="text-xl pb-4">{"Additional Notes"}</div>
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-2">
                    {/* <p className="text-base mt-2 text-neutral-600">
                  Additional Terms
                </p> */}
                    <input
                      className="text-md placeholder-[#B8C0CB] text-neutral-800 h-32 rounded w-full" // Fixed height
                      value={terms.termsText}
                      onChange={(e) =>
                        setTerms({ ...terms, termsText: e.target.value })
                      }
                      placeholder="Write Something"
                      variant="outlined"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full justify-end mt-8">
                  {" "}
                  <button
                    onClick={() => {
                      setNoteVisible(false);
                    }}
                    className="px-6 py-3 text-[#524494] hover:bg-[#524494]/20 transition-all ease-in-out duration-500 rounded-md"
                  >
                    Cancel
                  </button>
                  <CommonPrimaryButton
                    onClick={handleApproveAppointment}
                    loading={buttonLoading}
                    text={"Approve Now"}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Toast setShowToast={setShowToast} showToast={showToast} />
    </div>
  );
};

export default Reservations;
