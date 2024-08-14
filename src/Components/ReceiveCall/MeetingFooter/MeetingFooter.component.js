import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideo,
  faDesktop,
  faVideoSlash,
  faMicrophoneSlash,
  faStopCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./MeetingFooter.css";

const MeetingFooter = (props) => {
  const [streamState, setStreamState] = useState({
    mic: true,
    video: true,
    screen: false,
    wordScreen: false,
    selectedDeviceId:
      props.videoDevices.length > 0 ? props.videoDevices[0].deviceId : "",
    selectedAudioDeviceId:
      props.audioDevices.length > 0 ? props.audioDevices[0].deviceId : "",
  });

  const micClick = () => {
    setStreamState((currentState) => ({
      ...currentState,
      mic: !currentState.mic,
    }));
    props.onMicClick(streamState.mic);
  };

  const onVideoClick = () => {
    setStreamState((currentState) => ({
      ...currentState,
      video: !currentState.video,
    }));
    props.onVideoClick(streamState.video);
  };

  const onScreenClick = () => {
    setStreamState((currentState) => ({
      ...currentState,
      screen: !currentState.screen,
    }));
    props.onScreenClick(setScreenState);
  };

  const onShowWords = () => {
    props.onShowWords();
  };

  const setScreenState = (isEnabled) => {
    setStreamState((currentState) => ({
      ...currentState,
      screen: isEnabled,
    }));
  };

  const handleDeviceChange = (event) => {
    const deviceId = event.target.value;
    setStreamState((currentState) => ({
      ...currentState,
      selectedDeviceId: deviceId,
    }));
    props.onCameraDeviceChange(deviceId);
  };

  const handleAudioDeviceChange = (event) => {
    const deviceId = event.target.value;
    setStreamState((currentState) => ({
      ...currentState,
      selectedAudioDeviceId: deviceId,
    }));
    props.onAudioDeviceChange(deviceId);
  };

  return (
    <div className="meeting-footer">
      <div className="device-selectors">
        <div className="device-selector">
          <label htmlFor="videoDeviceSelect">Select Camera:</label>
          <select
            className="select-call"
            id="videoDeviceSelect"
            onChange={handleDeviceChange}
            value={streamState.selectedDeviceId || ""}
          >
            <option value="">Default Camera</option>
            {props.videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label ||
                  `Camera ${props.videoDevices.indexOf(device) + 1}`}
              </option>
            ))}
          </select>
        </div>
        {/* <div className="device-selector">
          <label htmlFor="audioDeviceSelect">Select Microphone:</label>
          <select
            id="audioDeviceSelect"
            onChange={handleAudioDeviceChange}
            value={streamState.selectedAudioDeviceId || ""}
          >
            <option value="">Default Microphone</option>
            {props.audioDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label ||
                  `Audio ${props.audioDevices.indexOf(device) + 1}`}
              </option>
            ))}
          </select>
        </div> */}
      </div>
      <div className="icons-container">
        <div
          className={"meeting-icons " + (!streamState.mic ? "active" : "")}
          data-tip={streamState.mic ? "Mute Audio" : "Unmute Audio"}
          onClick={micClick}
        >
          <FontAwesomeIcon
            icon={!streamState.mic ? faMicrophoneSlash : faMicrophone}
            title="Mute"
          />
        </div>
        <div
          className={"meeting-icons " + (!streamState.video ? "active" : "")}
          data-tip={streamState.video ? "Hide Video" : "Show Video"}
          onClick={onVideoClick}
        >
          <FontAwesomeIcon icon={!streamState.video ? faVideoSlash : faVideo} />
        </div>
        {/* <div
          className="meeting-icons"
          data-tip="Share Screen"
          onClick={onScreenClick}
          disabled={streamState.screen}
        >
          <FontAwesomeIcon icon={faDesktop} />
        </div> */}
        <div
          className="meeting-icons"
          data-tip="End Meeting"
          onClick={onShowWords}
          disabled={streamState.screen}
        >
          <FontAwesomeIcon icon={faStopCircle} />
        </div>
      </div>
    </div>
  );
};

export default MeetingFooter;
