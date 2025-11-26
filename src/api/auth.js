// src/api/auth.js
import axiosInstance from "./axios";

export const loginUser = async (phone, password, role) => {
  try {
    if (phone.length === 0 || password.length === 0) {
      return { error: "Phone and password cannot be empty" };
    }
    let endpoint = "";
    if (role === "customer") endpoint = "/user/Userlogin";
    else if (role === "shopowner") endpoint = "/ShopOwner/Ownerlogin";
    else if (role === "masteradmin") endpoint = "/master/login";

    const response = await axiosInstance.post(endpoint, null, {
      params: { phone, password, role },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    if (error.response) return { error: error.response.data };
    else return { error: "Network error. Please try again." };
  }
};

// Send OTP
export const sendOTP = async (phone, role) => {
  try {
    const response = await axiosInstance.post("/send-otp", null, {
      params: { phone, role, verified: "true" },
    });
    return response.data;
  } catch (error) {
    return { error: "Failed to send OTP" };
  }
};

// Verify OTP
export const verifyOTP = async (phone, otp) => {
  try {
    if (otp.length !== 6) {
      return { error: "OTP cannot be empty" };
    }
    const response = await axiosInstance.post("/verify-otp", null, {
      params: { phone, otp },
    });
    return response.data;
  } catch (error) {
    return { error: "OTP verification failed" };
  }
};

// Reset Password
export const resetPassword = async (phone, role, new_password) => {
  try {
    if (new_password.length === 0) {
      return { error: "New password cannot be empty" };
    }
    const response = await axiosInstance.post("/reset-password", null, {
      params: { phone, role, new_password },
    });
    return response.data;
  } catch (error) {
    return { error: "Reset password failed" };
  }
};
