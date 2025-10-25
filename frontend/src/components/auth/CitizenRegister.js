// src/components/auth/CitizenRegister.js
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./CitizenRegister.css";

const CitizenRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    age: "",
    aadharNo: "",
    gender: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    name,
    phone,
    address,
    age,
    aadharNo,
    gender,
    password,
    confirmPassword,
    photo,
  } = formData;

  const onChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
      
      // Preview the image
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          document.getElementById("photo-preview").src = reader.result;
          document.getElementById("photo-preview").style.display = "block";
          document.getElementById("photo-placeholder").style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return name && phone && address;
      case 2:
        return age && aadharNo && gender;
      case 3:
        return password && confirmPassword && password === confirmPassword;
      case 4:
        return true; // Photo is optional
      default:
        return false;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const formDataObj = new FormData();
    formDataObj.append("name", name);
    formDataObj.append("phone", phone);
    formDataObj.append("address", address);
    formDataObj.append("age", parseInt(age));
    formDataObj.append("aadharNo", aadharNo);
    formDataObj.append("gender", gender);
    formDataObj.append("password", password);
    formDataObj.append("userType", "citizen");
    
    if (photo) {
      formDataObj.append("photo", photo);
    }

    const result = await register(formDataObj);

    if (result.success) {
      navigate("/citizen-dashboard");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form compact">
        <h2 className="register-title">Citizen Registration</h2>
        
        {/* Step Indicators */}
        <div className="step-indicators">
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>1</div>
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>2</div>
          <div className={`step ${currentStep >= 3 ? "active" : ""}`}>3</div>
          <div className={`step ${currentStep >= 4 ? "active" : ""}`}>4</div>
        </div>
        
        <form onSubmit={onSubmit}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="step-content">
              <h3 className="step-title">Personal Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={address}
                  onChange={onChange}
                  required
                ></textarea>
              </div>
              
              <div className="step-buttons">
                <button type="button" className="next-button" onClick={nextStep} disabled={!validateStep(1)}>
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Additional Details */}
          {currentStep === 2 && (
            <div className="step-content">
              <h3 className="step-title">Additional Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={age}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="aadharNo">Aadhar</label>
                <input
                  type="text"
                  id="aadharNo"
                  name="aadharNo"
                  value={aadharNo}
                  onChange={onChange}
                  required
                />
              </div>
              
              <div className="step-buttons">
                <button type="button" className="prev-button" onClick={prevStep}>
                  Previous
                </button>
                <button type="button" className="next-button" onClick={nextStep} disabled={!validateStep(2)}>
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Security */}
          {currentStep === 3 && (
            <div className="step-content">
              <h3 className="step-title">Security</h3>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={onChange}
                  required
                />
                {password && confirmPassword && password !== confirmPassword && (
                  <div className="error-message">Passwords do not match</div>
                )}
              </div>
              
              <div className="step-buttons">
                <button type="button" className="prev-button" onClick={prevStep}>
                  Previous
                </button>
                <button type="button" className="next-button" onClick={nextStep} disabled={!validateStep(3)}>
                  Next
                </button>
              </div>
            </div>
          )}
          
          {/* Step 4: Profile Photo */}
          {currentStep === 4 && (
            <div className="step-content">
              <h3 className="step-title">Profile Photo</h3>
              
              <div className="photo-upload">
                <label className="photo-upload-label">Profile Photo (Optional)</label>
                <div className="photo-upload-container">
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    className="photo-upload-input"
                    onChange={onChange}
                    accept="image/*"
                  />
                  <img
                    id="photo-preview"
                    className="photo-preview"
                    alt="Profile preview"
                  />
                  <div id="photo-placeholder" className="photo-placeholder">
                    <div className="photo-placeholder-icon">📷</div>
                    <div className="photo-placeholder-text">Upload</div>
                  </div>
                </div>
              </div>
              
              <div className="step-buttons">
                <button type="button" className="prev-button" onClick={prevStep}>
                  Previous
                </button>
                <button type="submit" className="register-button">
                  Register
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="register-login">
          <p>
            Have an account? <Link to="/citizen-login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CitizenRegister;