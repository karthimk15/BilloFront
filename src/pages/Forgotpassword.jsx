import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!phone.trim()) {
      setError("Phone number cannot be empty");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/send-otp", null, { params: { phone } });
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setError("OTP cannot be empty");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.post("/verify-otp", null, { params: { phone, otp } });
      navigate(`/rsp?role=${role}&phone=${phone}`);
    } catch (err) {
      setError(err.response?.data || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-brand-light rounded-2xl shadow-lg p-8 mt-10">
        <h2 className="text-3xl font-bold text-center text-brand-primary mb-6">
          Forgot Password
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-medium">
            {error}
          </div>
        )}

        {step === 1 ? (
          <div className="flex flex-col gap-5">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="customer">User</option>
              <option value="shopowner">ShopOwner</option>
            </select>

            <input
              type="text"
              placeholder="Phone Number"
              className="input input-bordered w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="btn btn-primary w-full rounded-lg py-3 mt-2 hover:brightness-105 transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Enter OTP"
              className="input input-bordered w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="btn btn-primary w-full rounded-lg py-3 mt-2 hover:brightness-105 transition"
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
