import React, { useEffect, useState } from "react";
import emptyState from "../../assets/images/reservation.png";
import User from "../../assets/images/holderpic.jpeg";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { handleAPIRequest } from "../../helper/ApiHandler";
import { setAllReasevation } from "../../Store/Actions/Actions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CommonPrimaryButton from "../CommonPrimaryButton";
import { async } from "@firebase/util";
import ProfessionalCard from "./Patient";
const Patients = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReservations, setFilteredReservations] = useState([]);
  // const reservations = useSelector((state) => state.reservations);
  const [reservations, setReservations] = useState([]);

  const handleGetAppointments = async () => {
    console.log(user);
    setLoading(true);
    try {
      const response = await handleAPIRequest(
        "get",
        `search/user-by-name`,
        null
      );
      // Handle the response

      setReservations(response.data);
      setFilteredReservations(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = reservations.filter(
      ({ name, email, engage_id }) =>
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        engage_id.toString().includes(query)
    );

    setFilteredReservations(filtered);
  };

  useEffect(() => {
    handleGetAppointments();
  }, [location]);
  return (
    <div className="flex main-container overflow-auto w-full">
      <div className="flex w-full flex-col py-[52px]">
        <div className="justify-center items-start text-neutral-700 flex w-full">
          <div className="text-[32px] font-semibold">Patients</div>
        </div>
        <div className="mt-4 mb-8 w-full">
          <input
            value={searchQuery}
            onChange={handleSearch}
            type="text"
            placeholder="Search patients..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {reservations?.length > 0 ? (
          <ProfessionalCard
            data={
              filteredReservations.length ? filteredReservations : reservations
            }
          />
        ) : (
          <div className="flex w-full justify-center center flex-col items-center gap-5 border p-12 bg-fcffE9 rounded-md mt-8">
            <img src={emptyState} className="w-32" />
            <div className="text-xl md:text-3xl">
              Your patients will appear here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
