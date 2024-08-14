import React, { useState } from "react";
import { MdEmojiPeople, MdLogout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import User from "../../assets/images/holderpic.jpeg";
import Logo from "../../assets/images/logo.png";
import { updateUser } from "../../Store/Actions/Actions";
import HamburgerSideBar from "../HamburgerSideBar/HamburgerSideBar";

export default function Header() {
  const user = useSelector((state) => state.user);

  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const dispatch = useDispatch();

  const [showBar, setShowBar] = useState(false);

  const location = useLocation();
  const routePath = location.pathname.split("/")[1];
  let hideHeader = ["login", "register"];

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);
  return (
    <>
      {!hideHeader.includes(routePath) && user != null && (
        <div className="bg-[#FFFFFF] w-full border-b-2 border-gray-500">
          <div className="main-container w-full py-4 2xl:py-[26px] px-3 items-start  flex justify-between">
            <Link to={"/"}>
              <img
                className="2xl:w-[230px] absolute md:relative xl:w-[150] w-[150px] cursor-pointer h-[50px]"
                src={Logo}
                alt="Logo"
              />
            </Link>

            <>
              <div
                className="ms-auto md:flex justify-between gap-4 lg:gap-7 hidden"
                // defaultActiveKey="#Home"
              >
                <div className="flex items-center">
                  <Link
                    className={`cursor-pointer flex ${
                      location.pathname == "/"
                        ? "text-[#524494]"
                        : "text-neutral-600"
                    } items-center gap-2 transition-all ease-in-out duration-300 text-sm xl:text-base`}
                    as={Link}
                    to="/"
                    onClick={() => updateExpanded(false)}
                  >
                    <MdEmojiPeople size={20} />
                    Pending Appointments
                  </Link>
                </div>

                <div className="flex items-center">
                  <Link
                    className={`cursor-pointer flex ${
                      location.pathname == "patients"
                        ? "text-[#524494]"
                        : "text-neutral-600"
                    } items-center gap-2 transition-all ease-in-out duration-300 text-sm xl:text-base`}
                    as={Link}
                    to="/patients"
                    onClick={() => updateExpanded(false)}
                  >
                    <MdEmojiPeople size={20} />
                    Patients
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <div className=" !rounded-full overflow-hidden md:h-8 md:w-8 xl:w-10 xl:h-10">
                    {user?.photo_url != null ? (
                      <img src={user?.photo_url} />
                    ) : (
                      <img src={User} />
                    )}
                    {/* <GoPrimitiveDot className='online-icon'/> */}
                  </div>
                  {/* <h4 className="text-lg leading-3 text-center w-full h-full rounded-full bg-neutral-400 animate-pulse"></h4> */}
                  <div className="text-sm lg:text-sm 2xl:text-lg mt-2 text-neutral-800">
                    <div className="text-[8px] xl:text-xs leading-none">
                      Welcome
                    </div>
                    <span className="text-sm lg:text-xs 2xl:text-lg leading-none text-neutral-800">
                      {user?.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    className={`cursor-pointer flex ${
                      location.pathname == "patients"
                        ? "text-[#524494]"
                        : "text-neutral-600"
                    } items-center gap-2 transition-all ease-in-out duration-300 text-sm xl:text-base`}
                    onClick={() => {
                      localStorage.clear("User");
                      dispatch(updateUser(null));
                    }}
                  >
                    <MdLogout size={20} />
                    Logout
                  </div>
                </div>
              </div>

              <div
                className="md:hidden cursor-pointer"
                onClick={() => setShowBar(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </div>
              {showBar && <HamburgerSideBar setShowBar={setShowBar} />}
            </>
          </div>
        </div>
      )}
    </>
  );
}
