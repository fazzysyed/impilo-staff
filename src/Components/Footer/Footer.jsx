import React from "react";

import { BsDot } from "react-icons/bs";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const routePath = location.pathname.split("/")[1];
  const user = useSelector((state) => state.user);

  let hideHeader = ["login", "register"];
  let year = new Date().getFullYear();
  return (
    <>
      {!hideHeader.includes(routePath) && user != null && (
        <div className="bg-[#524494]  w-full bottom-0">
          <div className="main-container flex flex-col md:flex-row text-white md:items-center justify-between py-8 gap-2 md:gap-0 h-fit ">
            <p className="text-white text-xs sm:text-base">
              © {year} Impilo. All rights reserved.
            </p>
            <ul className="flex flex-row md:items-center sm:gap-2 gap-1 text-xs sm:text-base">
              <a
                href="https://google.com/"
                target="_blank"
                className="flex items-center"
                style={{ cursor: "pointer" }}
              >
                {" "}
                <span>
                  {" "}
                  <BsDot className="text-lg md:hidden -ml-1.5 md:-ml-0" />
                </span>{" "}
                Terms of Use
              </a>
              <li>
                <BsDot className="text-lg hidden md:block" />
              </li>
              <a
                href="https://google.com/"
                target="_blank"
                className="flex items-center"
                style={{ cursor: "pointer" }}
              >
                {" "}
                <span>
                  {" "}
                  <BsDot className="text-lg  md:hidden" />
                </span>{" "}
                Privacy Policy
              </a>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
