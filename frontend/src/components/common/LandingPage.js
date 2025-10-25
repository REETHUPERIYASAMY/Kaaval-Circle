// src/components/common/LandingPage.js
import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <div className="logo-container">
          <img
            src="https://z-cdn-media.chatglm.cn/files/078ef91d-52ae-43bc-a753-a941ed7c2238_pasted_image_1761370408270.jpg?auth_key=1792906820-70ae636279e545faa07dc1ce115bb151-0-1c855ed0700c7e5c6d516ee559be94f2"
            alt="KaavalCircle Logo"
            className="landing-logo"
          />
        </div>
        <h1 className="landing-title">KaavalCircle</h1>
        <p className="landing-subtitle">From Citizen For Citizen With Police</p>
        <div className="landing-buttons">
          <Link
            to="/citizen-register"
            className="landing-button citizen-button"
          >
            Citizen
          </Link>
          <Link to="/police-register" className="landing-button police-button">
            Police
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
