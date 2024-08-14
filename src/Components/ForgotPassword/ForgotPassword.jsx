import React, { useState } from "react";
import "./ForgotPassword.css";
import LogoImage from "../../assets/images/logo-image.png";
import TextField from "@mui/material/TextField";
import { MdAlternateEmail } from "react-icons/md";
import Slide3 from "../../assets/images/slide3.png";

export default function ForgotPassowrd() {
  const [forgotPassword, setForgotPassword] = useState("");

  return (
    <div className="login-container">
      <div className="forgot-image-section">
        <img src={Slide3} />
      </div>

      <div className="login-credentials-section">
        <div className="logo-container">
          <img src={LogoImage} alt="implio logo image" />
        </div>

        <div className="login-hello-text">
          <h1>Forgot Password</h1>
          <p>Send a link to your email to reset your password </p>
        </div>

        <div>
          <div style={{ marginTop: "4rem", position: "relative" }}>
            <TextField
              className="email-text-field"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={forgotPassword}
              onChange={(e) => setForgotPassword(e.target.value)}
            />
            <MdAlternateEmail className="email-icon" />
          </div>
        </div>

        <div className="login-btns">
          <button className="login-btn">Send Reset Link</button>
        </div>

        <div className="footer-text">
          <span className="signup-text">Back to Login</span>
        </div>
      </div>
    </div>
  );
}
