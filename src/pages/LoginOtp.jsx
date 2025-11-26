import React, { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function LoginOtp() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(null); // keep as is

  const sendOtp = async () => {
    setError("");
    if (!phone.trim()) {
      setError("Phone number cannot be empty");
      return;
    }
    try {
      await api.post("/send-otp", null, { params: { phone } });
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Something went wrong!");
    }
  };

  const handleLogin = async () => {
    try {
      if (role === "shopowner") return navigate("/Shopadmin/shopdashboard");
      if (role === "customer") return navigate("/customer/Profile");
      if (role === "masteradmin") return navigate("/master/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }
  };

  const verifyOtpLogin = async () => {
    setError("");
    if (!otp.trim()) {
      setError("OTP cannot be empty");
      return;
    }

    try {
      // First verify OTP
      await api.post("/verify-otp", null, { params: { phone, otp } });

      // Mark verified (state updates next render)
      setVerified(true);
    } catch (err) {
      setError(err.response?.data || "Invalid OTP!");
    }
  };

  // Runs immediately after verified becomes TRUE
  useEffect(() => {
    const loginAfterVerify = async () => {
      if (verified === true) {
        try {
          const res = await api.post("/loginwith-otp", null, {
            params: { phone, role, verified } // send verified as it is
          });
          localStorage.setItem("token", res.data.access_token);
          handleLogin();
        } catch (err) {
          setError(err.response?.data || "Login failed!");
        }
      }
    };
    loginAfterVerify();
  }, [verified]); // runs only when verified updates

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-brand-light rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-brand-primary mb-6 text-center">
          Login with OTP
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="customer">User</option>
              <option value="shopowner">ShopOwner</option>
            </select>

            <input
              type="text"
              placeholder="Phone Number"
              className="input input-bordered w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button
              onClick={sendOtp}
              className="btn btn-primary w-full py-3 rounded-md mt-2 hover:scale-105 transition-transform"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="input input-bordered w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              onClick={verifyOtpLogin}
              className="btn btn-primary w-full py-3 rounded-md mt-2 hover:scale-105 transition-transform"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
