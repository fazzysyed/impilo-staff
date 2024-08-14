importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);

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

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  payload.data.customData = JSON.parse(payload.data.customData);
  payload.data.patient = JSON.parse(payload.data.patienr);

  self.registration.showNotification("Call", "{");
});
