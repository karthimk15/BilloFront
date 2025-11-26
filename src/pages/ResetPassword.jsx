import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "user";
  const phone = searchParams.get("phone") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await api.post("/reset-password", null, {
        params: { phone, role, new_password: newPassword },
      });
      alert("Password reset successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <MainLayout>
      <div className="max-w-md w-full bg-white rounded-card shadow-lg p-6">
        <h2 className="text-2xl font-bold text-brand-primary mb-6 text-center">
          Reset Password
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            className="input input-bordered w-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={handleReset}
            className="btn btn-primary w-full rounded-button mt-2"
          >
            Reset Password
          </button>
        </div>
      </div>
      </MainLayout>
    </div>
  );
}
