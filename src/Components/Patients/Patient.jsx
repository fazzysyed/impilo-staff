import React, { useState } from "react";
import emptyState from "../../assets/images/reservation.png";

import "./Patient.css";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import User from "../../assets/images/holderpic.jpeg";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function ProfessionalCard({ data, setFilteredData }) {
  const [show, setShow] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const user = useSelector((state) => state.user);
  let [currentPage, setCurrentPage] = useState(1);
  const handleClose = () => setShow(null);
  const handleShow = (item) => {
    setShow(item.uuid);
    setProfileData(item);
  };

  const handlePageChange = (page) => {
    // Handle page change event
    setCurrentPage(page);
  };

  return (
    <>
      <div>
        {data?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2  2xl:grid-cols-3  gap-6 2xl:gap-8 mt-6 md:mt-16">
            {" "}
            {data
              .slice((currentPage - 1) * 9, currentPage * 9)
              .map((item, index) => {
                return (
                  <div
                    key={index}
                    className="shadow-class hover:scale-105 transition-all ease-in-out duration-500 rounded-xl w-full border-1 border-gray-300"
                  >
                    <div className="flex flex-col p-6 lg:p-6 2xl:p-10">
                      <div className="flex items-center">
                        <img
                          src={item.profile_pic ? item.profile_pic : User}
                          width={55}
                          height={32}
                          className="rounded-full border object-cover w-10 md:w-8 md:h-8 h-10 2xl:w-16 2xl:h-16 xl:w-14 xl:h-14"
                          alt="User Image"
                        />
                        <div className="username-details">
                          <p className="text-neutral-700 font-bold md:text-md lg:text-base xl:text-md 2xl:text-xl capitalize">
                            {item.name} {item.surename}
                          </p>
                          <p className="card-designation">{item.designation}</p>
                        </div>
                      </div>

                      <div className="flex flex-col py-4 xl:py-6 gap-3">
                        <div>
                          <span className="text-base text-blue-600">
                            Engage ID:
                          </span>{" "}
                          <span className="text-neutral-700 text-sm  2xl:text-lg font-medium">
                            {item?.engage_id}
                          </span>
                        </div>
                        <div>
                          <span className="text-base text-blue-600">
                            Email:
                          </span>{" "}
                          <span className="text-neutral-700 text-sm  2xl:text-lg font-medium">
                            {item?.email}
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/patient-details?${item?.id}`}
                        className="w-full"
                      >
                        <button className="py-2 xl:py-3 border-neutral-500 border text-sm xl:text-md text-black hover:text-white hover:border-neutral-700 transition-all ease-in-out duration-700 rounded-md hover:bg-[#524494] w-full">
                          View Details
                        </button>
                      </Link>
                    </div>
                    {/* here is the model for the user detail  */}
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="flex w-full justify-center center flex-col items-center gap-5 border p-12 bg-fcffE9 rounded-md mt-8">
            <img src={emptyState} className="w-32" />
            <div className="text-xl md:text-3xl ">
              Your patients will appear here
            </div>
          </div>
        )}
      </div>
      {/* here is pagination  */}

      <div className=" w-full flex justify-end">
        {data?.length > 0 && (
          <Pagination
            currentPage={currentPage}
            pageCount={Math.ceil(data.length / 9)}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>

    // Invoke when user click to request another page.
  );
}
