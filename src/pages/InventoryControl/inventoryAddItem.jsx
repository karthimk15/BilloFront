// UI-redesigned version of your component (NO logic or variables changed)
// Only styling improved.

import React, { useState } from "react";
import axiosInstance from "../../api/axios";
import { excelToJson, generateBulkTemplate } from "../../utils/excelutils";

const decodeToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (err) {
    console.error("Token decode failed", err);
    return null;
  }
};

const token = localStorage.getItem("token");
const decoded = decodeToken(token);
const shopIdfromtoken = decoded?.id ?? null;

export default function AddItemInventory() {
  const [singleItem, setSingleItem] = useState({
    shop_id: decoded.id,
    name: "",
    sku: "",
    barcode: "",
    hsn_code: "",
    MRP_Price: "",
    price: "",
    stock_quantity: "",
    cgst_per: "",
    sgst_per: "",
    reorder_level: "",
    track_batch: false,
  });

  const [bulkItems, setBulkItems] = useState([]);
  const [bulkMessage, setBulkMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSingleItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addItemInventory = async () => {
    try {
      const payload = { ...singleItem, shop_id: shopIdfromtoken };
      const res = await axiosInstance.post("/inventory/items", payload);
      alert(`Item added: ${res.data.name}`);

      setSingleItem({
        shop_id: shopIdfromtoken,
        name: "",
        sku: "",
        barcode: "",
        hsn_code: "",
        MRP_Price: "",
        price: "",
        stock_quantity: "",
        cgst_per: "",
        sgst_per: "",
        reorder_level: "",
        track_batch: false,
      });
    } catch (err) {
      console.error(err);
      alert("Error adding item", err);
    }
  };

  const handleBulkFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const jsonData = await excelToJson(file, shopIdfromtoken);
      setBulkItems(jsonData);
    } catch (err) {
      console.error(err);
      alert("Invalid Excel file");
    }
  };

  const downloadTemplate = async () => {
    try {
      const buffer = await generateBulkTemplate();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "BulkItemTemplate.xlsx";
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const bulkUploadItem = async () => {
    if (bulkItems.length === 0) {
      alert("No items selected for bulk upload");
      return;
    }
    try {
      const res = await axiosInstance.post("/inventory/items/bulk", bulkItems);
      setBulkMessage(`Bulk upload completed. ${res.data.length} items added. Duplicates skipped.`);
      setBulkItems([]);
    } catch (err) {
      console.error(err);
      alert("Error during bulk upload");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Inventory</h1>

        {/* Single Item Section */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add Single Item</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { name: "name", placeholder: "Item Name" },
            { name: "sku", placeholder: "SKU" },
            { name: "barcode", placeholder: "Barcode" },
            { name: "hsn_code", placeholder: "HSN Code" },
            { name: "MRP_Price", placeholder: "MRP Price", type: "number" },
            { name: "price", placeholder: "Price", type: "number" },
            { name: "stock_quantity", placeholder: "Stock Quantity", type: "number" },
            { name: "cgst_per", placeholder: "CGST %", type: "number" },
            { name: "sgst_per", placeholder: "SGST %", type: "number" },
            { name: "reorder_level", placeholder: "Reorder Level", type: "number" },
          ].map((f) => (
            <input
              key={f.name}
              type={f.type || "text"}
              name={f.name}
              placeholder={f.placeholder}
              className="p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white text-gray-900"
              value={singleItem[f.name]}
              onChange={handleChange}
            />
          ))}

          <label className="flex items-center gap-2 text-gray-800 mt-2">
            <input
              type="checkbox"
              name="track_batch"
              checked={singleItem.track_batch}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Track Batch
          </label>
        </div>

        <button
          onClick={addItemInventory}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
        >
          Add Item
        </button>

        <hr className="my-10" />

        {/* Bulk Upload */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Bulk Upload Items</h2>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm">
          <label className="block text-gray-700 font-medium mb-2">Upload Excel File</label>

          <input
            type="file"
            accept=".xlsx"
            onChange={handleBulkFile}
            className="block w-full p-3 border border-gray-300 rounded-xl bg-white shadow-sm cursor-pointer"
          />

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={bulkUploadItem}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md"
            >
              Upload Bulk Items
            </button>

            <button
              onClick={downloadTemplate}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl shadow-md"
            >
              Download Template
            </button>
          </div>

          {bulkMessage && (
            <p className="mt-4 text-green-700 font-medium">{bulkMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}