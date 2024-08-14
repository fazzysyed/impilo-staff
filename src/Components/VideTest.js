import React, { useRef, useEffect, useState } from "react";
import MeetingFooter from "../MeetingFooter/MeetingFooter.component";
import { io } from "socket.io-client";
import "./MainScreen.css";
import { useDispatch, useSelector } from "react-redux";
import { setCallData } from "../../../Store/Actions/Actions";
import { useNavigate } from "react-router-dom";
import Profile from "../../../assets/images/profile.jpeg";

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    {
      urls: "turn:3.128.78.243:3478?transport=udp",
      username: "zomie",
      credential: "password",
    },
  ],
  iceCandidatePoolSize: 10,
};

const MainScreen = (props) => {
  const dispatch = useDispatch();
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const callIsComing = useSelector((state) => state.callIsComing);

  const [peerConnection, setPeerConnection] = useState(
    new RTCPeerConnection(configuration)
  );
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [dataFor, setDataFor] = useState(null);

  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const handleMicClick = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const handleVideoClick = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  };

  const setupSocketListeners = (socket) => {
    socket.on("connect", async () => {
      console.log("Connected to server", callIsComing?.customData?.isVideo);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: selectedDeviceId
            ? { deviceId: selectedDeviceId }
            : callIsComing?.customData?.isVideo === 1,
          audio: true,
        });

        setLocalStream(stream);

        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));

        peerConnection.ontrack = (event) => {
          const remoteStream = new MediaStream();
          event.streams.forEach((stream) => {
            stream.getTracks().forEach((track) => {
              console.log(`Adding remote track: ${track.kind}`);
              remoteStream.addTrack(track);
            });
          });

          if (
            remoteVideoRef.current &&
            callIsComing?.customData?.isVideo === 1
          ) {
            remoteVideoRef.current.srcObject = remoteStream;
          } else {
            console.log("remoteVideoRef.current is null");
          }

          setRemoteStream(remoteStream);
        };
        const offer = await peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await peerConnection.setLocalDescription(offer);

        socket.emit("make-offer", {
          from: user.id,
          targetUserId: callIsComing?.patient_id,
          offerData: offer.sdp,
        });
      } catch (error) {
        console.error("Error during connection setup:", error);
      }
    });

    socket.on(`offer-${user.id}`, async (dataFromOffer) => {
      const offer = dataFromOffer?.offerData;

      try {
        const remoteDesc = new RTCSessionDescription({
          type: "offer",
          sdp: offer,
        });
        await peerConnection.setRemoteDescription(remoteDesc);

        const answer = await peerConnection.createAnswer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await peerConnection.setLocalDescription(answer);

        socket.emit("offer-acknowledgment", {
          from: user.id,
          targetUserId: callIsComing?.patient_id,
          offerData: answer.sdp,
        });
      } catch (err) {
        console.error(`Error while setting remote description: ${err}`);
      }
    });

    socket.on(`ice-candidate-${user.id}`, async (data) => {
      if (data?.iceCandidateData) {
        for (const candidateData of data.iceCandidateData) {
          const newCandidate = new RTCIceCandidate({
            sdpMLineIndex: candidateData?.label,
            sdpMid: candidateData?.id,
            candidate: candidateData?.candidate,
          });
          try {
            await peerConnection.addIceCandidate(newCandidate);
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        }
      }
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    socket.on("disconnect", () => {
      cleanup();
    });

    socket.on(`call-status-${user.id}`, (data) => {
      if (data?.call_status === "ENDED") {
        cleanup();
        navigate("/");
        window.location.reload();
      }
    });
  };

  const cleanup = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    dispatch(setCallData(null));
  };

  const startScreenSharing = async () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      setLocalStream(screenStream);
      screenStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, screenStream);
      });

      updateStream(screenStream);

      // Optionally, handle the screen share offer response here if needed
    } catch (error) {
      console.error("Error starting screen sharing:", error);
    }
  };
  const handleDeviceChange = async (event) => {
    const newDeviceId = event.target.value;
    setSelectedDeviceId(newDeviceId);

    console.log(newDeviceId, "61148-122f-4a99-9b3c-a14a3ecb9f4b");

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: newDeviceId ? { deviceId: newDeviceId } : true,
        audio: true,
      });

      updateStream(newStream);

      setLocalStream(newStream);
    } catch (error) {
      console.error("Error switching camera:", error);
    }
  };

  const fetchVideoDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      console.log(videoDevices.length);
      setVideoDevices(videoDevices);
    } catch (error) {
      console.error("Error fetching video devices:", error);
    }
  };

  const updateStream = (stream) => {
    const videoSender = peerConnection
      .getSenders()
      .find((s) => s.track && s.track.kind === "video");

    if (videoSender) {
      // Replace the existing video track with the new one
      videoSender.replaceTrack(stream.getVideoTracks()[0]);
    } else {
      console.error("No video sender found");
    }
  };
  useEffect(() => {
    fetchVideoDevices();

    const socket = io("https://brightspace.health:3001/");
    if (callIsComing) {
      setDataFor(callIsComing);
      setupSocketListeners(socket);
    }

    return () => {
      socket.disconnect();
    };
  }, [callIsComing, user.id, dispatch, navigate]);

  return (
    <div className="wrapper">
      <div style={{ display: "flex" }}>
        <div className="main-screen">
          <video
            style={{ height: "100%", width: "100%", background: "#524494" }}
            ref={remoteVideoRef}
            autoPlay
          />
        </div>
      </div>
      <div className="footer">
        <MeetingFooter
          onScreenClick={startScreenSharing}
          onShowWords={() => {
            const socket = io("https://brightspace.health:3001/");
            socket.emit("call-status", {
              from: user.id,
              targetUserId: dataFor?.patient_id,
              call_status: "ENDED",
            });
            cleanup();
            navigate("/");
            window.location.reload();
          }}
          onMicClick={handleMicClick}
          onVideoClick={handleVideoClick}
        />
        <div className="device-selector">
          <label htmlFor="videoDeviceSelect">Select Camera:</label>
          <select
            id="videoDeviceSelect"
            onChange={handleDeviceChange}
            value={selectedDeviceId || ""}
          >
            <option value="">Default Camera</option>
            {videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
