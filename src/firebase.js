import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqCob6myF2kSpTr2R5iOpT43QfaP6HO2M",
  authDomain: "travelling-app-b0719.firebaseapp.com",
  databaseURL: "https://travelling-app-b0719-default-rtdb.firebaseio.com",
  projectId: "travelling-app-b0719",
  storageBucket: "travelling-app-b0719.appspot.com",
  messagingSenderId: "1098185094546",
  appId: "1:1098185094546:web:9f6e1a350e0e90673abd4b",
  measurementId: "G-61CXK7JJTM",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// Register service worker
export const getOrRegisterServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    return navigator.serviceWorker
      .getRegistration("/firebase-push-notification-scope")
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return navigator.serviceWorker.register("/firebase-messaging-sw.js", {
          scope: "/firebase-push-notification-scope",
        });
      });
  }
  throw new Error("The browser doesn't support service workers.");
};

// Get Firebase token
export const getFirebaseToken = async () => {
  try {
    const serviceWorkerRegistration = await getOrRegisterServiceWorker();
    console.log("Service Worker Registration:", serviceWorkerRegistration);

    const token = await getToken(messaging, {
      vapidKey:
        "BAcqgWmV0Tt_iz_5msOhogRP1qZN5DUSqlJUDY_5kZ5XKblyF8Y5NfPQpwAyTo-3LGuMS65O8o7I33SqsdVRLg8",
      serviceWorkerRegistration,
    });

    if (token) {
      console.log("Firebase Token:", token);
      return token;
    } else {
      console.warn(
        "No registration token available. Request permission to generate one."
      );
      return null;
    }
  } catch (error) {
    console.error("Error getting Firebase token:", error);
    throw error;
  }
};

// Handle foreground messages
export const onForegroundMessage = () =>
  new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));
