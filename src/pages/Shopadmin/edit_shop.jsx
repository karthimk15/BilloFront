import React, { useEffect, useState } from "react";
import axiosInstance from "/src/api/axios";
import { useNavigate } from "react-router-dom";
import {ArrowLeft} from "lucide-react"
const decodeToken = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export default function EditShopProfile() {

  const token = localStorage.getItem("token");
  const decoded = decodeToken(token);
  const shopId = decoded?.id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shop_name: "",
    owner_name: "",
    industry_type: "",
    gst_number: "",
    address: "",
    pincode: "",
    upi_id: "",
    start_date: "",
    expiry_date: "",
    subscription_plan: "",
    password_shopOwner: "",
  });

  const [loading, setLoading] = useState(true);

  // Load existing data
  const fetchShop = async () => {
    try {
      const res = await axiosInstance.get(`/shops/${shopId}`);
      const data = res.data;

      setForm({
        shop_name: data.shop_name ?? "",
        owner_name: data.owner_name ?? "",
        industry_type: data.industry_type ?? "",
        gst_number: data.gst_number ?? "",
        address: data.address ?? "",
        pincode: data.pincode ?? "",
        upi_id: data.upi_id ?? "",
        start_date: data.start_date ?? "",
        expiry_date: data.expiry_date ?? "",
        subscription_plan: data.subscription_plan ?? "",
        password_shopOwner: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axiosInstance.put(`/shops/${shopId}`, form);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  if (loading) return <p className="p-10 text-black">Loading…</p>;

  return (
    <div className="p-6 bg-slate-100 min-h-screen text-black">
        <div className="flex items-center mb-6 bg-black text-white p-4 rounded-xl shadow-lg">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-800">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold ml-3">Edit Shop Profile</h1>
      </div>
    

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {Object.keys(form).map((key) => (
          <div key={key}>
            <label className="text-sm text-gray-500 capitalize">
              {key.replace("_", " ")}
            </label>
            <input
              type="text"
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full p-2 mt-1 border rounded"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="bg-black text-white px-4 py-2 rounded mt-6"
      >
        Save Changes
      </button>
    </div>
  );
}
