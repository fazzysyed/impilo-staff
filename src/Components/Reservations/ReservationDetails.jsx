import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import User from "../../assets/images/holderpic.jpeg";
import emptyState from "../../assets/images/reservation.png";
import CommonPrimaryButton from "../CommonPrimaryButton";

const ReservationDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [reservationDetails, setReservationDetails] = useState(null);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    setReservationDetails(location?.state?.appointment);
    console.log(location.state?.appointment.patient_detail);
  }, [location, user]);

  return (
    <div className="flex main-container overflow-auto w-full">
      <div className="flex w-full flex-col  py-14">
        <div className=" justify-center items-start text-neutral-700 flex w-full">
          <div className="text-3xl font-semibold text-neutral-800">
            Appointment Details
          </div>
        </div>

        {!loading ? (
          <div className="grid grid-cols-1 justify-between w-full py-10 gap-9 flex-wrap">
            <div className="border-neutral-900  h-fit w-full flex  flex-col  hover:shadow-sm  rounded-xl">
              <div className="flex justify-start relative shadow-class rounded-xl p-6  mt-6 flex-col ">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full">
                  <div className="flex flex-col items-start gap-4 w-full md:w-[50%] ">
                    {/* Date here  */}
                    <div className="flex items-center text-neutral-700 bg-[#EFF4F8] p-2 md:p-4 rounded-sm flex-row gap-2 md:gap-3 w-full">
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
                      <div className=" flex flex-col w-full md:w-fit">
                        <span className=" text-neutral-600">Date</span>
                        <div className="flex w-full justify-between md:w-fit md:justify-start">
                          <p className="font-semibold text-sm md:text-base">
                            {dayjs(reservationDetails?.date, {
                              format: "DD/MM/YYYY",
                            }).format("MMM. DD, YYYY")}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* location here  */}
                    <div className="flex justify-start w-full flex-col gap-1">
                      <div className="font-semibold flex items-center gap-1">
                        <span className="font-normal text-sm md:text-base text-neutral-500">
                          Status:
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap pl-1 font-semibold text-blue-700 capitalize">
                        {reservationDetails?.status}
                      </p>
                    </div>
                  </div>

                  <div className="w-[60%]">
                    <div className="flex items-start gap-4 flex-col w-full">
                      <div className="flex items-center gap-4">
                        <div className=" !rounded-full border overflow-hidden w-10 h-10">
                          {reservationDetails?.patient_detail?.profile_pic !=
                          null ? (
                            <img
                              src={
                                reservationDetails?.patient_detail?.profile_pic
                              }
                            />
                          ) : (
                            <img src={User} />
                          )}
                        </div>
                        <div className="">
                          <p className="font-semibold text-base text-[#828487] capitalize">
                            {reservationDetails?.patient_detail?.name}
                            {"  "}
                            {reservationDetails?.patient_detail?.surename}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-3 pt-8">
                      <div className="font-semibold text-[#828487]">Type:</div>
                      <p className="text-neutral-500">
                        {reservationDetails?.type}d
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full justify-end pt-6 mt-6 border-t">
                  <div className="flex gap-3">
                    <CommonPrimaryButton
                      loading={false}
                      text={"Vitals"}
                      onClick={() => {
                        navigate(`/vitals`, {
                          state: { appointment: reservationDetails },
                        });
                      }}
                    />
                    <CommonPrimaryButton
                      loading={false}
                      text={"Medical Records"}
                    />
                    <CommonPrimaryButton
                      loading={false}
                      onClick={() => {
                        navigate(`/prescription`, {
                          state: { appointment: reservationDetails },
                        });
                      }}
                      text={"Prescription"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-center center flex-col items-center gap-5 border p-12 bg-slate-50 rounded-md mt-8">
            <img src={emptyState} className="w-32" />
            <div className="text-3xl ">Your reservations will appear here</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationDetails;
