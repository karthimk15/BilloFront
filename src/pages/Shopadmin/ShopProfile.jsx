// src/pages/ShopOwner/shopowner-profile.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";

// Decode token utility
const decodeToken = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export default function ShopOwnerProfile() {
  const token = localStorage.getItem("token");
  const decoded = decodeToken(token);
  const shopId = decoded?.id; // shop_id from token

  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch shop data
  const fetchShopData = async () => {
    try {
      const res = await axiosInstance.get(`/shops/${shopId}`);
      setShop(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load shop details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) fetchShopData();
  }, [shopId]);

  if (loading) {
    return (
      <div className="text-center p-10 text-lg font-semibold text-black">
        Loading profile…
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center p-10 text-red-600 font-semibold">
        Shop data not found
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-100 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">Shop Owner Profile</h1>

      <div className="bg-white rounded-xl shadow-md p-6">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          {shop.logo_path ? (
            <img
              src={
                shop.logo_path.startsWith("http")
                  ? shop.logo_path
                  : `${import.meta.env.VITE_API_URL}${shop.logo_path}`
              }
              alt="Shop Logo"
              className="w-32 h-32 rounded-full object-cover border shadow"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
              No Logo
            </div>
          )}
        </div>

        {/* BUTTON TO EDIT PROFILE */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/Shopadmin/edit_shop")}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

          <ProfileField label="Shop Name" value={shop.shop_name} />
          <ProfileField label="Owner Name" value={shop.owner_name} />
          <ProfileField label="Username" value={shop.username} />
          <ProfileField label="Industry Type" value={shop.industry_type} />
          <ProfileField label="Phone" value={shop.phone} />
          <ProfileField label="Phone Verified" value={shop.phone_verified ? "Yes" : "No"} />
          <ProfileField label="Email" value={shop.email} />
          <ProfileField label="GST Number" value={shop.gst_number} />
          <ProfileField label="Pincode" value={shop.pincode} />
          <ProfileField label="Address" value={shop.address} />
          <ProfileField label="UPI ID" value={shop.upi_id} />
          <ProfileField label="Credits Remaining" value={shop.credits} />
          <ProfileField label="Status" value={shop.status} />
          <ProfileField label="Start Date" value={shop.start_date || "Not set"} />
          <ProfileField label="Expiry Date" value={shop.expiry_date || "Not set"} />
          <ProfileField label="Subscription Plan" value={shop.subscription_plan || "None"} />
        </div>

        <p className="text-sm text-right text-gray-500 mt-6">
          Created At: {new Date(shop.created_date).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// Reusable field component
function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );
}
