import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";
import store from "../src/Store/Store";
import App from "./App";
import Chat from "./Components/Chat/Chat";

import Layout from "./Components/Layout";
import ResetPassword from "./Components/PasswordReset/ResetPassword";

import ReceiveCall from "./Components/ReceiveCall/MainScreen/MainScreen";
import ReservationDetails from "./Components/Reservations/ReservationDetails";
import Reservations from "./Components/Reservations/Reservations";
import SignUp from "./Components/SignUp/SignUp";
import Vitals from "./Components/Vitals/Vitals";
import Prescription from "./Components/Prescription/Prescription";
import "./fonts/Gilroy/Gilroy-Bold.ttf";
import "./fonts/Gilroy/Gilroy-Medium.ttf";
import "./fonts/Gilroy/Gilroy-Semibold.ttf";
import "./fonts/Nunito/NunitoSans-Bold.ttf";
import "./fonts/Nunito/NunitoSans-BoldItalic.ttf";
import "./fonts/Nunito/NunitoSans-Regular.ttf";
import "./fonts/Nunito/NunitoSans-SemiBold.ttf";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Patients from "./Components/Patients/Patients";
import PatientDetails from "./Components/PatientDetails/PatientDetails";

const root = createRoot(document.getElementById("root"));

export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    return new Promise((resolve, reject) => {
      navigator.serviceWorker
        .register(process.env.PUBLIC_URL + "/firebase-messaging-sw.js")
        .then(function (registration) {
          console.log("[registration]", registration);

          // messaging.useServiceWorker(registration)

          resolve(registration);
        })
        .catch(function (err) {
          console.log("[ERROR registration]: ", err);
          reject(null);
        });
    });
  } else {
    console.log("SERVICE WORKER NOT IN THE BROWSER");
  }
};

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<App />} />

            <Route path="/register" element={<SignUp />} />

            <Route path="/make-call" element={<ReceiveCall />} />

            <Route path="/chats" element={<Chat />} />

            <Route path="prescription" element={<Prescription />} />

            <Route path="patients" element={<Patients />} />
            <Route path="patient-details" element={<PatientDetails />} />

            <Route path="/vitals" element={<Vitals />} />
            <Route
              path="/reservation-detail"
              element={<ReservationDetails />}
            />

            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<App />} />
          </Routes>
        </Layout>
      </HashRouter>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
