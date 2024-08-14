import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { handleAPIRequest } from "../helper/ApiHandler";
import { setIsLoggedIn, setUser } from "../Store/Actions/Actions";

import Toast from "./AppLoader";
const DeleteAccount = ({ deleteUser, setDeleteUser }) => {
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState({
    toggle: false,
    lable: "",
    message: "",
    status: "",
  });

  const deleteHandler = () => {
    handleAPIRequest("post", "delete-account", null)
      .then((response) => {
        localStorage.removeItem("token");

        dispatch(setUser(null));
        dispatch(setIsLoggedIn(false));

        setShowToast({
          ...showToast,
          toggle: true,
          status: "success",
          message: "Account deletion successful. We're sad to see you go. 😔",
          lable: "Account Deleted",
        });

        document.getElementById("logout-form").submit();
      })
      .catch((e) => {
        setShowToast({
          ...showToast,
          toggle: true,
          status: "error",
          message: "Oh no! Something unexpected happened.",
          lable: "Something went wrong",
        });
      });
  };

  return (
    <div>
      {deleteUser && (
        <div>
          <div className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm z-[999999]"></div>
          <div className="w-full flex flex-col gap-6 sm:max-w-[380px] md:max-w-[521px] z-[9999999] h-fit bg-white dark:bg-neutral-800 dark:border-none border-t box-border border-neutral-200 p-6 md:p-8 fixed sm:inset-0 sm:m-auto rounded bottom-0 left-0">
            <div className="flex flex-col gap-2">
              <div className="flex items-center w-full justify-between">
                <p className="font-semibold text-2xl leading-8 text-neutral-800 dark:text-neutral-200">
                  Delete Account
                </p>
                <div
                  onClick={() => setDeleteUser(false)}
                  className="absolute top-4 right-4 md:top-6 md:right-6"
                >
                  <svg
                    width="20"
                    className="text-neutral-800 dark:text-white cursor-pointer"
                    height="20"
                    id="closeModal"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 15L15 5M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="font-normal text-base leading-normal text-neutral-600 dark:text-neutral-400 whitespace-break-spaces">
                Once your account and personal information is deleted, it cannot
                be retrieved. Please note that records that contain existing
                users will not be deleted. This may include such data as
                contracts and reviews.
              </p>

              <p className="font-semibold text-base leading-normal text-neutral-600 dark:text-neutral-400 whitespace-break-spaces">
                If you are sure you would like to delete your account, please
                click the 'delete' button to proceed
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-2">
              <button
                onClick={() => setDeleteUser(false)}
                className=" border text-[#524494] border-[#524494] px-5 py-2 rounded-md "
              >
                Cancel
              </button>
              <button
                onClick={() => deleteHandler()}
                className="  bg-red-600 text-white  px-5 py-2 rounded-md "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Toast setShowToast={setShowToast} showToast={showToast} />
    </div>
  );
};

export default DeleteAccount;
