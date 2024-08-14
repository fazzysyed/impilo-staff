import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import logo from "../../assets/images/logo-image.png";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { CgGitFork } from "react-icons/cg";
import { ImBlog } from "react-icons/im";

import { IoMdHome } from "react-icons/io";

import { MdPrivacyTip } from "react-icons/md";
import "./Navbar.css";

import {
  AiFillStar,
  AiOutlineHome,
  AiOutlineFundProjectionScreen,
  AiOutlineUser,
  AiOutlineVideoCamera,
} from "react-icons/ai";

import { CgFileDocument } from "react-icons/cg";
import { IoMdHelp } from "react-icons/io";

function NavBar() {
  const [expand, updateExpanded] = React.useState(false);
  const [navColour, updateNavbar] = React.useState(false);

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  return (
    <div className={navColour ? "" : "navbar"}>
      <div className="flex justify-between">
        <Link to="/" className="d-flex">
          <img src={logo} className="img-fluid logo" alt="brand" />
        </Link>
        <div
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div id="responsive-navbar-nav" className="flex">
          <div
            className="ms-auto flex justify-between gap-10"
            defaultActiveKey="#home"
          >
            <div>
              <div as={Link} to="/" onClick={() => updateExpanded(false)}>
                <IoMdHome />
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#5c5c5c"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg> */}
                Home2
              </div>
            </div>

            <div>
              <div
                as={Link}
                to="/tutorials"
                onClick={() => updateExpanded(false)}
              >
                <AiOutlineFundProjectionScreen
                  style={{ marginBottom: "2px" }}
                />{" "}
                Favorites
              </div>
            </div>

            <div>
              <div as={Link} to="/about" onClick={() => updateExpanded(false)}>
                <CgFileDocument style={{ marginBottom: "2px" }} /> Offers
              </div>
            </div>

            <div>
              <div
                as={Link}
                to="/privacy-policy"
                onClick={() => updateExpanded(false)}
              >
                <MdPrivacyTip style={{ marginBottom: "2px" }} /> Contracts
              </div>
            </div>
            {/* <div>
              <div as={Link} to="/terms" onClick={() => updateExpanded(false)}>
                <ImBlog style={{ marginBottom: "2px" }} /> Chats
              </div>
            </div> */}
            {/* <div className="fork-btn">
              <Button
                href="https://github.com/soumyajit4419/Portfolio"
                target="_blank"
                className="fork-btn-inner"
              >
                <CgGitFork style={{ fontSize: "1.2em" }} />{" "}
                <AiFillStar style={{ fontSize: "1.1em" }} />
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
