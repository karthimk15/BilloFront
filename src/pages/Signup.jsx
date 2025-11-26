// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { sendOTP, verifyOTP } from "../api/auth";
import axiosInstance from "/src/api/axios";
import { HiEye, HiEyeOff } from "react-icons/hi";

import Billo from "../assets/icon/Blogo.jpeg"
const Signup = () => {
  const [role, setRole] = useState("user"); // user or shopowner
  const [step, setStep] = useState("phone"); // phone / otp / form
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  // ShopOwner fields
  const [username, setUsername] = useState("");
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  
  const [passwordShop1, setPasswordShop1] = useState("");
  const [passwordShop2, setPasswordShop2] = useState("");
  const [phone_verified, setVerify] = useState(false);
  const [showPasswordShop, setShowPasswordShop] = useState(false);
  const [industryType, setIndustryType] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [logo, setLogo] = useState(Billo);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSendOTP = async () => {
    if (!phone) return setError("Please enter phone number");
    try {
      const res = await sendOTP(phone, role);
      if (res.error) setError(res.error);
      else setStep("otp");
    } catch {
      setError("Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return setError("Please enter OTP");
    try {
      const res = await verifyOTP(phone, otp);
      if (res.error) setError(res.error);
      else setStep("form")
      setVerify(true);
    } catch {
      setError("OTP verification failed");
    }
  };

  const handleUserSignup = async () => {
    try {
      await axiosInstance.post("/users/create", {
        phone,
        phone_verified,
        name,
        email,
        password,
        address,
        pincode,
      });
      setSuccess("User created successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "User signup failed");
    }
  };

  const handleShopSignup = async () => {
    try {
      if (passwordShop1 !== passwordShop2) {
      return setError("Passwords do not match");
    }

      const finalPassword = passwordShop1; // SAFE
      const formData = new FormData();
      formData.append("username", username);
      formData.append("shop_name", shopName);
      formData.append("owner_name", ownerName);
      formData.append("phone", phone);
      formData.append("phone_verified", phone_verified);
      formData.append("password_shopOwner", finalPassword);
   
      formData.append("email", email);
      formData.append("industry_type", industryType);
      formData.append("gst_number", gstNumber);
      formData.append("address", address);
      formData.append("pincode", pincode);
      formData.append("upi_id", upiId);
      if (logo) formData.append("logo", logo);

      await axiosInstance.post("/shops/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("ShopOwner created successfully!");
    } catch (err) {
      setError(err.response?.data?.detail || "Shop signup failed");
    }
  };

  return (
  <div className="flex min-h-screen bg-brand-light">
    
    <div className="flex-1 flex flex-col">
     

      <div className="flex justify-center items-center flex-1 p-6">
        <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border">

          {/* Title */}
          <h2 className="text-3xl font-semibold mb-6 text-center text-brand-primary">
            Create Your Account
          </h2>

          {/* Error / Success Messages */}
          {error && (
            <p className="w-full p-3 mb-4 rounded bg-red-100 text-red-600 text-center text-sm">
              {error}
            </p>
          )}
          {success && (
            <p className="w-full p-3 mb-4 rounded bg-green-100 text-green-700 text-center text-sm">
              {success}
            </p>
          )}

          {/* Step 1 — Role Selector */}
          {step === "phone" && (
            <div className="mb-5">
              <label className="block mb-2 font-medium">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border rounded shadow-sm focus:ring-2 focus:ring-brand-primary"
              >
                <option value="user">User</option>
                <option value="shopowner">ShopOwner</option>
              </select>
            </div>
          )}

          {/* Step 1 — Phone Number */}
          {step === "phone" && (
            <>
              <label className="block mb-2 font-medium">Phone Number *</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 mb-4 border rounded shadow-sm focus:ring-2 focus:ring-brand-primary"
              />

              <button
                onClick={handleSendOTP}
                className="w-full bg-brand-primary text-white py-3 rounded-lg shadow hover:bg-brand-primary/90"
              >
                Send OTP
              </button>
            </>
          )}

          {/* Step 2 — OTP */}
          {step === "otp" && (
            <>
              <p className="text-green-600 mb-3 text-sm">
                OTP sent successfully! Please enter the OTP below.
              </p>

              <label className="block mb-2 font-medium">Enter OTP *</label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 mb-4 border rounded shadow-sm focus:ring-2 focus:ring-green-600"
              />

              <button
                onClick={handleVerifyOTP}
                className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Step 3 — USER SIGNUP FORM */}
          {step === "form" && role === "user" && (
            <>
              <label className="block mb-2 font-medium">Name *</label>
              <input
                type="text"
                value={name}
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm focus:ring-2"
              />

              <label className="block mb-2 font-medium">Email *</label>
              <input
                type="email"
                value={email}
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm focus:ring-2"
              />

              <label className="block mb-2 font-medium">Password *</label>
              <div className="relative mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded shadow-sm focus:ring-2"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiEye className="w-5 h-5 text-gray-500" />
                  ) : (
                    <HiEyeOff className="w-5 h-5 text-gray-500" />
                  )}
                </span>
              </div>

              <label className="block mb-2 font-medium">Address *</label>
              <input
                type="text"
                value={address}
                placeholder="Enter address"
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm"
              />

              <label className="block mb-2 font-medium">Pincode *</label>
              <input
                type="text"
                value={pincode}
                placeholder="Enter pincode"
                onChange={(e) => setPincode(e.target.value)}
                className="w-full p-3 mb-4 border rounded shadow-sm"
              />

              <button
                onClick={handleUserSignup}
                className="w-full bg-brand-primary text-white py-3 rounded-lg shadow hover:bg-brand-primary/90"
              >
                Create Account
              </button>
            </>
          )}

          {/* Step 3 — SHOPOWNER SIGNUP FORM */}
          {step === "form" && role === "shopowner" && (
            <>
              <label className="block mb-2 font-medium">Username *</label>
              <input
                type="text"
                value={username}
                placeholder="Unique username"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm"
              />

              <label className="block mb-2 font-medium">Shop Name *</label>
              <input
                type="text"
                value={shopName}
                placeholder="Shop name"
                onChange={(e) => setShopName(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm"
              />

              <label className="block mb-2 font-medium">Owner Name *</label>
              <input
                type="text"
                value={ownerName}
                placeholder="Owner name"
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm"
              />

              {/* Password */}
              <label className="block mb-2 font-medium">Password *</label>
              <div className="relative mb-3">
                <input
                  type={showPasswordShop ? "text" : "password"}
                  value={passwordShop1}
                  placeholder="Password"
                  onChange={(e) => setPasswordShop1(e.target.value)}
                  className="w-full p-3 border rounded shadow-sm"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPasswordShop(!showPasswordShop)}
                >
                  {showPasswordShop ? (
                    <HiEye className="w-5 h-5 text-gray-500" />
                  ) : (
                    <HiEyeOff className="w-5 h-5 text-gray-500" />
                  )}
                </span>
              </div>

              {/* Confirm Password */}
              <label className="block mb-2 font-medium">
                Confirm Password *
              </label>
              <div className="relative mb-3">
                <input
                  type={showPasswordShop ? "text" : "password"}
                  value={passwordShop2}
                  placeholder="Re-enter password"
                  onChange={(e) => setPasswordShop2(e.target.value)}
                  className="w-full p-3 border rounded shadow-sm"
                />
              </div>

              <label className="block mb-2 font-medium">Email *</label>
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm"
              />

              <label className="block mb-2 font-medium">Industry Type</label>
              <input
                type="text"
                value={industryType}
                placeholder="Industry Type"
                onChange={(e) => setIndustryType(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm"
              />

              <label className="block mb-2 font-medium">GST Number</label>
              <input
                type="text"
                value={gstNumber}
                placeholder="GST Number"
                onChange={(e) => setGstNumber(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm"
              />

              <label className="block mb-2 font-medium">Address</label>
              <input
                type="text"
                value={address}
                placeholder="Enter address"
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm"
              />

              <label className="block mb-2 font-medium">Pincode</label>
              <input
                type="text"
                value={pincode}
                placeholder="Enter pincode"
                onChange={(e) => setPincode(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm"
              />

              <label className="block mb-2 font-medium">UPI ID</label>
              <input
                type="text"
                value={upiId}
                placeholder="UPI ID"
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-3 mb-3 border rounded shadow-sm"
              />

              <label className="block mb-2 font-medium">Upload Logo</label>
              <input
                type="file"
                onChange={(e) => setLogo(e.target.files[0])}
                className="w-full mb-4"
              />

              <button
                onClick={handleShopSignup}
                className="w-full bg-brand-primary text-white py-3 rounded-lg shadow hover:bg-brand-primary/90"
              >
                Create Shop
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);

};

export default Signup;
