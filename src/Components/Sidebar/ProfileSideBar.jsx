import React from "react";
import { HiUserCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import Address from "../Address/Address";
import License from "../License/License";
import Preferences from "../Preferences/Preferences";
import { MdBusinessCenter } from "react-icons/md";

const ProfileSideBar = () => {
  const user = useSelector((state) => state.user);
  return (
    <div className="flex main-container gap-8 overflow-auto w-full">
      <div className="py-12 h-full">
        <div className="profile-sidebar-card">
          <div className="flex flex-col items-center">
            <img src={User} alt="user profile image" className="w-20 h-20" />
            <p className="text-xl font-semibold">
              {user?.firstName}
              {user?.lastName}
            </p>
          </div>

          <div>
            <ul className="side-nav">
              <li
                onClick={() => setNav("profile")}
                className="side-nav-item side-nav-item-active"
              >
                <div className="side-nav-link">
                  <HiUserCircle className="pen-icon" />
                  <span>My Profile</span>
                </div>
              </li>

              <li
                onClick={() => setNav("profile")}
                className="side-nav-item side-nav-item-active"
              >
                <div className="side-nav-link">
                  <HiUserCircle className="pen-icon" />
                  <span>Business Profile</span>
                </div>
              </li>

              <li onClick={() => setNav("address")} className="side-nav-item">
                <div className="side-nav-link">
                  <FaAddressBook className="pen-icon" />
                  <span>Address</span>
                </div>
              </li>

              <li onClick={() => setNav("licenses")} className="side-nav-item">
                <div className="side-nav-link">
                  <TbLicense className="pen-icon" />
                  <span>Licenses</span>
                </div>
              </li>

              <li
                onClick={() => setNav("preferences")}
                className="side-nav-item"
              >
                <div className="side-nav-link">
                  <MdRoomPreferences className="pen-icon" />
                  <span>Preferences</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* <Availability/> */}
      {/* <License/> */}
      {/* <BusinessProfile/> */}
      {/* <Preferences/> */}
      {/* <Notification/> */}
      {nav === "profile" && <ProfileData />}

      {nav === "address" && <Address />}
      {nav === "licenses" && <License />}
      {nav === "preferences" && <Preferences />}
    </div>
  );
};

export default ProfileSideBar;
