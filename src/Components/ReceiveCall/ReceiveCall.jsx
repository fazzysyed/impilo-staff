import React from "react";
import { useRef, useEffect, useState } from "react";
import "./ReceiveCall.css";

import { FiVideo, FiVideoOff, FiMic, FiMicOff } from "react-icons/fi";

import SWITCHCAMERA from "../../assets/images/iconsforCall/change-camera.png";
import END from "../../assets/images/iconsforCall/end-call.png";
import MUTE from "../../assets/images/iconsforCall/mute.png";
import UNMUTE from "../../assets/images/iconsforCall/unmute.png";
import SPEAKEROFF from "../../assets/images/iconsforCall/volume-down.png";
import SPEAKER from "../../assets/images/iconsforCall/volume-up.png";
import MainScreenComponent from "./MainScreen/MainScreen.component";

const ReceiveCall = () => {
  const [audiostate, setAudio] = useState(false);
  return (
    <>
      <MainScreenComponent />
    </>
  );
};

export default ReceiveCall;
