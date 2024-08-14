import React, { useRef, useEffect, useState } from "react";
import MeetingFooter from "../MeetingFooter/MeetingFooter.component";
import { io } from "socket.io-client";
import "./MainScreen.css";
import { useDispatch, useSelector } from "react-redux";
import { setCallData } from "../../../Store/Actions/Actions";
import { useLocation, useNavigate } from "react-router-dom";
import Profile from "../../../assets/images/profile.jpeg";
import { handleAPIRequest } from "../../../helper/ApiHandler";

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
  const location = useLocation();
  const user = useSelector((state) => state.user);

  const [peerConnection, setPeerConnection] = useState(
    new RTCPeerConnection(configuration)
  );
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [dataFor, setDataFor] = useState(null);

  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState(null);

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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: selectedDeviceId ? { deviceId: selectedDeviceId } : 1,
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

        if (remoteVideoRef.current && 1 === 1) {
          console.log("remoteVideoRef.current is null");
          remoteVideoRef.current.srcObject = remoteStream;
        } else {
          console.log("remoteVideoRef.current is null");
        }

        setRemoteStream(remoteStream);
      };
      socket.on(`make-offer-${user.id}`, async (dataFromOffer) => {
        console.log("Received offer from server:", dataFromOffer);

        try {
          const offer = await peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          await peerConnection.setLocalDescription(offer);
          socket.emit("offer", {
            from: `${user?.id}`,
            targetUserId: `${location.state.appointment?.doctor_id}`,
            offerData: offer.sdp.toString(),
          });
        } catch (error) {
          console.error("Error creating or setting offer:", error);
        }
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            from: `${user?.id}`,
            targetUserId: `${location.state.appointment?.doctor_id}`,
            iceCandidateData: [
              {
                typeCandidate: "candidate",
                label: event?.candidate?.sdpMLineIndex,
                id: event?.candidate?.sdpMid,
                candidate: event?.candidate?.candidate,
              },
            ],
          });
        }
      };

      socket.on(`offer-acknowledgment-${user?.id}`, async (data) => {
        console.log("Offer acknowledgment received:", data);

        try {
          const remoteDesc = new RTCSessionDescription({
            type: "answer",
            sdp: data?.offer,
          });
          await peerConnection.setRemoteDescription(remoteDesc);
        } catch (error) {
          console.error("Error setting remote description:", error);
        }
      });

      socket.on(`ice-candidate-${user.id}`, async (data) => {
        console.log("Received ICE candidate:", data);

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

      socket.on("error", (error) => console.error("WebSocket error:", error));
      socket.on("disconnect", () => {
        setLocalStream(null);
        setRemoteStream(null);
        if (peerConnection) {
          peerConnection.close();
          setPeerConnection(null);
        }
      });

      socket.on(`call-status-${user.id}`, (data) => {
        if (data?.call_status === "ENDED") {
          setLocalStream(null);
          setRemoteStream(null);
          if (peerConnection) {
            peerConnection.close();
            setPeerConnection(null);
          }
        }
      });
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
    const newDeviceId = event;
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

  const handleAudioDeviceChange = async (newAudioDeviceId) => {
    console.log(newAudioDeviceId);
    // Stop existing audio tracks if any
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => track.stop());
    }

    try {
      // Get user media with the new audio device
      const constraints = {
        video: selectedDeviceId ? { deviceId: selectedDeviceId } : true,
        audio: newAudioDeviceId ? { deviceId: newAudioDeviceId } : true,
      };

      // Obtain the new stream
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      updateStream(newStream);

      setLocalStream(newStream);
    } catch (error) {
      console.error("Error switching audio device:", error);
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

  const fetchAudioDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );
      console.log(audioDevices, ":Testing");

      setAudioDevices(audioDevices);
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
    fetchAudioDevices();

    console.log(location.state.appointment);

    const socket = io("https://brightspace.health:3001/");
    if (location?.state?.appointment) {
      const callData = {
        doc_id: location?.state?.appointment?.doctor_id?.toString(),
        patient_id: user.id.toString(),
        customData: {
          DocReference: "",
          RoomID: "RoomID",
          fromUser: user.id.toString(),
          toUser: location?.state?.appointment?.doctor_id?.toString(),
          // isVideo: data?.type === 'Audio call' ? 0 : 1,
          isVideo: 1,
        },
        ACTION: "Call",
      };

      handleAPIRequest(
        "post",
        "pushAvCall",
        callData,
        null,

        `https://brightspace.health/api/pushAvCall`
      )
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
      setDataFor("callIsComing");
      setupSocketListeners(socket);
    }

    return () => {
      socket.disconnect();
    };
  }, [user.id, dispatch, navigate]);

  return (
    <div className="wrapper">
      <div style={{ display: "flex", backgroundColor: "red" }}>
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
          onCameraDeviceChange={(id) => handleDeviceChange(id)}
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
          videoDevices={videoDevices}
          audioDevices={audioDevices}
          onAudioDeviceChange={handleAudioDeviceChange}
        />
      </div>
    </div>
  );
};

export default MainScreen;
