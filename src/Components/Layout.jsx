import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { async } from "regenerator-runtime";
import Header from "../Components/Header/Header";
import { getFirebaseToken } from "../firebase";
import { handleAPIRequest } from "../helper/ApiHandler";
import { setUser } from "../Store/Actions/Actions";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/Animations/loading.json";

// Create a Footer component

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);

  const location = useLocation();
  const routePath = location.pathname.split("/")[1];
  const [loading, setLoading] = useState(true);

  const getUserDataAsync = async () => {
    const permission = Notification.permission;

    if (permission === "granted") {
      let device_uuid = localStorage.getItem("device_uuid");

      console.log(device_uuid, "device_uuiddevice_uuiddevice_uuid");
      if (device_uuid) {
        getFirebaseToken().then(async (firebaseToken) => {
          console.log("Firebase token: ", firebaseToken);
          setLoading(true);

          let newUserData = await localStorage.getItem("User");

          if (newUserData) {
            const parsedData = JSON.parse(newUserData);
            console.log(JSON.stringify(parsedData), "fasklfajslfj");

            let data = {
              email: parsedData.email,
              password: parsedData.password,
              tokenFCM: firebaseToken,
              activeid: device_uuid,
            };

            try {
              const response = await handleAPIRequest(
                "post",
                "staff-login",
                data
              );

              let newUser = response.data.user;
              newUser.token = response.data.token;
              newUser.password = parsedData.password;

              dispatch(setUser(newUser));
              localStorage.setItem("User", JSON.stringify(newUser));

              console.log(newUser, "fafaksjf");

              let data22 = JSON.stringify({
                user_id: newUser?.id,
                first_name: newUser?.name,
                last_name: newUser.surename,

                email: newUser.email,
                token: firebaseToken,
              });

              let config = {
                method: "post",

                url: "https://brightspace.health:3001/api/profile",
                headers: {
                  "Content-Type": "application/json",
                },
                data: data22,
              };

              axios
                .request(config)
                .then((response) => {
                  console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                  console.log(error);
                });

              setLoading(false);
            } catch (error) {
              console.log(error);
              setLoading(false);
            }
          } else {
            setTimeout(() => {
              setLoading(false);
            }, 3000);
          }
        });
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserDataAsync();
    // this is checking if the user is not logged in then push back to the home page except public pages
    // if (!isAuthenticated && !unStrictPages.includes(routePath) && !loading) {
    //   navigate("/");
    // }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      window.scrollTo(0, 0);
    };

    handleScroll(); // Scroll to top when the component mountsconsole
  }, [location.pathname]);

  return (
    <>
      {loading ? (
        <div className="flex transition-all ease-in-out duration-500 justify-center items-center my-auto w-full h-[100vh] bg-[#FCFFE9] ">
          {/* <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div> */}
          <Lottie animationData={loadingAnimation} loop={true} />
        </div>
      ) : (
        <div className="f-f-g-s flex flex-col ">
          {isAuthenticated && <Header />}

          {/* <CallNotification /> */}
          <main
            className={`min-h-[calc(100vh-162px)] sm:min-h-[calc(100vh-192px)] md:min-h-[calc(100vh-172px)] md:overflow-auto  xl:min-h-[calc(100vh-180px)] 2xl:min-h-[calc(100vh-192px)] ${
              routePath == "chats" && "bg-neutral-100"
            }`}
          >
            {children}
          </main>
        </div>
      )}
    </>
  );
};

export default Layout;
