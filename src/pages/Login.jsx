// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { loginUser, sendOTP, verifyOTP, resetPassword } from "../api/auth";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = async () => {
    try {
      const res = await loginUser(phone, password, role);

      if (res.error) {
        setError(res.error);
        return;
      }

      localStorage.setItem("token", res.access_token);

      if (role === "shopowner") return navigate("/Shopadmin/shopdashboard");
      if (role === "customer") return navigate("/customer/Profile");
      if (role === "masteradmin") return navigate("/master/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong!");
    }
  };

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      setError("Phone number cannot be empty");
      return;
    }

    const data = await sendOTP(phone, role);
    if (data.error) setError(data.error);
    else setStep("otp");
  };

  const handleWhatsapp = () => {
    alert("This feature is coming soon!");
  };

  const handleVerifyOTP = async () => {
    const data = await verifyOTP(phone, otp);
    if (data.error) setError(data.error);
    else setStep("reset");
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const data = await resetPassword(phone, role, newPassword);

    if (data.error) {
      setError(data.error);
    } else {
      alert("Password reset successful!");
      setStep("login");
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">

          <h2 className="text-3xl font-bold text-center text-brand-primary mb-6">
            Login
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          {/* LOGIN SCREEN */}
          {step === "login" && (
            <div className="space-y-5">

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border rounded-lg bg-gray-50"
              >
                <option value="customer">User</option>
                <option value="shopowner">ShopOwner</option>
              </select>

              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border rounded-lg bg-gray-50"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-gray-50"
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiEyeOff className="w-6 h-6 text-gray-500" />
                  ) : (
                    <HiEye className="w-6 h-6 text-gray-500" />
                  )}
                </span>
              </div>

              <button
                onClick={handleLogin}
                className="w-full p-3 bg-brand-primary text-white rounded-lg font-semibold shadow-sm hover:opacity-90 transition"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/fp")}
                className="w-full p-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Forgot Password
              </button>

              <button
                onClick={() => navigate("/loginwithotp")}
                className="w-full p-3 bg-blue-700 text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Login with OTP [Telegram]
              </button>

              <button
                onClick={handleWhatsapp}
                className="w-full p-3 bg-green-700 text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Login with OTP [WhatsApp]
              </button>

            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
