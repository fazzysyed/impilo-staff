import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LogIn from "./Components/LogIn/LogIn";
import Reservations from "./Components/Reservations/Reservations";
import { io } from "socket.io-client";
import { getFirebaseToken, onForegroundMessage } from "./firebase";
import {
  setCallData,
  setFirebaseToken,
  setUser,
} from "./Store/Actions/Actions";
import CallNotification from "./Components/CallNotification/CallNotification";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import Notifcation from "./assets/images/notificationicon.png";
import uuid from "react-uuid";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useSelector((state) => state.isLoggedIn);
  const [incomingCall, setIncomingCall] = useState(null);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const navigate = useNavigate();

  const handleGetFirebaseToken = async () => {
    try {
      const firebaseToken = await getFirebaseToken();
      if (firebaseToken) {
        dispatch(setFirebaseToken(firebaseToken));
      }
    } catch (error) {
      console.error(
        "An error occurred while retrieving the Firebase token: ",
        error
      );
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        handleGetFirebaseToken();
        setShowPermissionPrompt(false);
      } else {
        setShowPermissionPrompt(true);
      }
    } catch (error) {
      console.error(
        "An error occurred while requesting notification permission: ",
        error
      );
    }
  };

  useEffect(() => {
    let device_uuid = localStorage.getItem("device_uuid");

    console.log(device_uuid, "Faraz");
    if (device_uuid === null) {
      let newDev = uuid().replace(/-/g, "");
      localStorage.setItem("device_uuid", newDev);
    }
  }, []);
  useEffect(() => {
    const checkPermissionAndGetToken = async () => {
      requestNotificationPermission();
      const permission = Notification.permission;

      if (permission === "granted") {
        handleGetFirebaseToken();
      } else if (permission === "default") {
        setShowPermissionPrompt(true);
      } else {
        setShowPermissionPrompt(true);
      }
    };

    checkPermissionAndGetToken();
  }, []);

  useEffect(() => {
    const socket = io("https://brightspace.health:3001/");

    if (typeof window !== "undefined" && window) {
      const element = document.getElementById("topScroll");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    return () => {
      // socket.disconnect();
    };
  }, []);

  useEffect(() => {
    onForegroundMessage()
      .then((payload) => {
        console.log(payload.data);
        // Correcting JSON parsing
        payload.data.customData = JSON.parse(payload.data.customData);
        payload.data.patienr = JSON.parse(payload.data.patienr);

        dispatch(setCallData(payload.data));
        setIncomingCall(payload.data);
      })
      .catch((err) =>
        console.log(
          "An error occurred while retrieving foreground message: ",
          err
        )
      );
  }, [incomingCall]);

  if (showPermissionPrompt) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <img
            src={Notifcation}
            alt="Notification Icon"
            className="mx-auto mb-4 w-40 h-40 object-cover"
          />
          <Alert severity="warning" className="mb-4">
            To receive important notifications, please enable notifications in
            your browser settings.
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <div>
          {incomingCall && (
            <CallNotification
              callData={incomingCall}
              onAccept={() => {
                navigate("/callscreen");
                setIncomingCall(null);
              }}
              onDecline={() => {
                console.log(incomingCall?.patient_id);
                const socket = io("https://brightspace.health:3001/");

                socket.on("connect", () => {
                  console.log("Socket connected:", socket.id);
                  socket.emit("call-status", {
                    from: `${user.id}`,
                    targetUserId: `${incomingCall?.patient_id.toString()}`,
                    call_status: "ENDED",
                  });
                });

                socket.on("connect_error", (err) => {
                  console.error("Socket connection error:", err);
                });

                socket.disconnect();

                // Ensure the socket is cleaned up
                // socket.on("disconnect", () => {
                //   console.log("Socket disconnected");
                // });

                dispatch(setCallData(null));
                setIncomingCall(null);
              }}
            />
          )}
          <Reservations />
        </div>
      ) : (
        <LogIn />
      )}
    </>
  );
}

export default App;
