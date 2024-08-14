import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsLoggedIn,
  setUser,
  updateUser,
} from "../../Store/Actions/Actions";
import DeleteAccount from "../DeleteAccount";

const HamburgerSideBar = ({ setShowBar }) => {
  const user = useSelector((state) => state.user);
  const [deleteUser, setDeleteUser] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setIsLoggedIn(false));
    dispatch(setUser(null));
    navigate("/login");
  };
  return (
    <>
      <div className="md:hidden">
        <div
          className="fixed w-full h-full inset-0 bg-black/60 z-[9999]"
          onClick={() => setShowBar(false)}
        ></div>
        <div className="fixed w-full h-full max-w-[300px] inset-0 ml-auto bg-white z-[99999] py-4 px-4 flex flex-col gap-5">
          <div
            onClick={() => setShowBar(false)}
            className="flex cursor-pointer  w-full justify-end"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 hover:rotate-90 transition-all ease-in-out duration-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div className="flex gap-2 flex-col">
            <Link
              className={`${
                true && "bg-neutral-200"
              } cursor-pointer flex items-center gap-2 text-base hover:bg-neutral-200 rounded-lg w-full px-3 py-2 transition-all ease-in-out duration-300`}
              as={Link}
              to="/"
              onClick={() => setShowBar(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              Pending appointments
            </Link>

            <Link
              className="cursor-pointer flex items-center gap-2 text-base hover:bg-neutral-200 rounded-lg w-full px-3 py-2 transition-all ease-in-out duration-300"
              as={Link}
              to="/patients"
              onClick={() => setShowBar(false)}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 384 512"
                height="20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8V72zm0 64c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8v-16zm192.81 248H304c8.84 0 16 7.16 16 16s-7.16 16-16 16h-47.19c-16.45 0-31.27-9.14-38.64-23.86-2.95-5.92-8.09-6.52-10.17-6.52s-7.22.59-10.02 6.19l-7.67 15.34a15.986 15.986 0 0 1-14.31 8.84c-.38 0-.75-.02-1.14-.05-6.45-.45-12-4.75-14.03-10.89L144 354.59l-10.61 31.88c-5.89 17.66-22.38 29.53-41 29.53H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h12.39c4.83 0 9.11-3.08 10.64-7.66l18.19-54.64c3.3-9.81 12.44-16.41 22.78-16.41s19.48 6.59 22.77 16.41l13.88 41.64c19.77-16.19 54.05-9.7 66 14.16 2.02 4.06 5.96 6.5 10.16 6.5zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"></path>
              </svg>
              Patients
            </Link>
          </div>
          <div className="flex w-full absolute -left-[0.45rem] bottom-6 justify-between gap-3  flex-col px-6">
            <button
              onClick={() => {
                localStorage.clear("User");
                dispatch(updateUser(null));
                navigate("/");
              }}
              className=" border text-[#524494] border-[#524494] px-5 py-2 rounded-md "
            >
              Logout
            </button>
            {/* <button
              onClick={() => setDeleteUser(true)}
              className="  text-red-600 hover:bg-red-50 transition-all ease-in-out duration-300 border-[#524494] whitespace-nowrap px-5 py-2 rounded-md "
            >
              Delete Account
            </button> */}
          </div>
        </div>
      </div>
      <DeleteAccount deleteUser={deleteUser} setDeleteUser={setDeleteUser} />
    </>
  );
};

export default HamburgerSideBar;
