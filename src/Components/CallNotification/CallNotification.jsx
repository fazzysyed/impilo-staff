import React from "react";
// import avatar from './avatar.jpg'; // Replace with your avatar image path
import { useLocation, useNavigate } from "react-router-dom";
const CallNotification = ({ onDecline, onAccept, callData }) => {
  console.log(callData, "callDataCallData");
  return (
    <div className="fixed top-4 right-4">
      <div className="text-center bg-black bg-opacity-80 rounded-2xl p-8 w-72 shadow-lg">
        {/* <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-6" /> */}
        <h1 className="text-white text-2xl mb-2">{callData?.patienr?.name}</h1>
        <p className="text-white text-lg mb-6">
          {callData?.customData?.isVideo === 1 ? "Video Call" : "Audio Call"}
        </p>
        <div className="flex justify-around">
          <div
            onClick={onDecline}
            className="flex items-center justify-center w-16 h-16 bg-red-600 rounded-full text-white text-2xl cursor-pointer"
          >
            &#128148;
          </div>
          <div
            onClick={onAccept}
            className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full text-white text-2xl cursor-pointer"
          >
            &#128222;
          </div>
        </div>
      </div>
    </div>
  );
};
export default CallNotification;
