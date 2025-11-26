//import axios from "axios";
import axiosInstance from "/src/api/axios";
//const API_BASE = "http://127.0.0.1:800";

export const getInventoryItems = async (shop_id) => {
  try {
    const response = await axiosInstance.get(`/inventory/items`, {
      params: { shop_id },
      headers: { accept: "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return [];
  }
};

export const createBill = async (data, token) => {
  try {
    const response = await axiosInstance.post(`/bills/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating bill:", error);
    throw error;
  }
};

// Fetch shop details by shop_id
export const getShopDetails = async (shop_id) => {
  try {
    const response = await axiosInstance.get(`/shops/${shop_id}`); 
    return response.data;
  } catch (error) {
    console.error("Error fetching shop details:", error);
    return null;
  }
};
