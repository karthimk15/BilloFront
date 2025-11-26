// src/pages/Shopadmin/CreateBill.jsx
import React, { useEffect, useState, useRef } from "react";
import { ArrowLeft, Plus, Trash2, Eraser } from "lucide-react";
import axiosInstance from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { getInventoryItems, getShopDetails } from "../../api/createbill"; // optional helper

// decode JWT simple helper
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

export default function CreateBill() {
  const navigate = useNavigate();

  // Auth / shop
  const token = localStorage.getItem("token");
  const decoded = decodeToken(token);
  const shopId = decoded?.id ?? null;

  // basic fields
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const hh = String(today.getHours()).padStart(2, "0");
    const min = String(today.getMinutes()).padStart(2, "0");
    const ss = String(today.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
  });
  const [status, setStatus] = useState("completed");
  const [payment_status, setpayStatus] = useState("paid");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [shopNameFromStore, setShopName] = useState("Shop");

  // inventory (auto-suggest source)
  const [inventoryItems, setInventoryItems] = useState([]);
  async function loadShopName() {
    try {
      const shopData = await getShopDetails(shopId, token);
      const shopNameFromStore = shopData?.shop_name || "shop_name error";
      setShopName(shopNameFromStore);
    } catch (error) {
      console.error("Error fetching shop details:", error);
      setShopName("Error");
    }
  }

  useEffect(() => {
    loadShopName();
  }, [shopId]);

  // rows
  const [items, setItems] = useState([
    {
      item_id: "",
      item_name: "",
      unit_price: 0,
      quantity: 1,
      sgst_per: 0,
      cgst_per: 0,
      MRP_Price: 0,
      total: 0,
    },
  ]);

  // suggestion UI state per row
  const [activeRow, setActiveRow] = useState(null);
  const [suggestionsForRow, setSuggestionsForRow] = useState({});
  const suggestionsTimeout = useRef(null);

  // message
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadInventory() {
      try {
        const shop_arg = shopId ?? (getShopDetails && getShopDetails.shop_id) ?? null;
        if (!shop_arg) {
          console.warn("No shop id available for inventory fetch");
          return;
        }
        const res = await getInventoryItems(shop_arg);
        setInventoryItems(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to load inventory", err);
      }
    }
    loadInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  const calculateRowTotal = (row) => {
    const price = Number(row.unit_price) || 0;
    const qty = Number(row.quantity) || 0;
    const sgst = Number(row.sgst_per) || 0;
    const cgst = Number(row.cgst_per) || 0;
    const base = price * qty;
    const sgstAmt = (base * sgst) / 100;
    const cgstAmt = (base * cgst) / 100;
    return Number((base + sgstAmt + cgstAmt).toFixed(2));
  };

  const billTotal = items.reduce((s, r) => s + (Number(r.total) || 0), 0);

  const updateRow = (index, patch) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      next[index].unit_price = Number(next[index].unit_price) || 0;
      next[index].quantity = Number(next[index].quantity) || 0;
      next[index].sgst_per = next[index].sgst_per === null ? 0 : Number(next[index].sgst_per) || 0;
      next[index].cgst_per = next[index].cgst_per === null ? 0 : Number(next[index].cgst_per) || 0;
      next[index].MRP_Price = Number(next[index].MRP_Price) || 0;
      next[index].total = calculateRowTotal(next[index]);
      return next;
    });
  };

  const handleItemSearch = (index, text) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], item_name: text };
      return next;
    });

    if (!text || !text.trim()) {
      setSuggestionsForRow((s) => ({ ...s, [index]: [] }));
      return;
    }

    const q = text.toLowerCase();
    const filtered = inventoryItems.filter((it) => (it.name || "").toLowerCase().includes(q));
    setSuggestionsForRow((s) => ({ ...s, [index]: filtered }));
    setActiveRow(index);
  };

  const handleSelectItem = (index, item) => {
    updateRow(index, {
      item_id: item.id,
      item_name: item.name,
      unit_price: item.price ?? 0,
      sgst_per: item.sgst_per ?? 0,
      cgst_per: item.cgst_per ?? 0,
      MRP_Price: item.MRP_Price ?? item.MRP_price ?? 0,
    });

    setSuggestionsForRow((s) => ({ ...s, [index]: [] }));
    setActiveRow(null);
  };

  const addRow = () => {
    setItems((p) => [
      ...p,
      {
        item_id: "",
        item_name: "",
        unit_price: 0,
        quantity: 1,
        sgst_per: 0,
        cgst_per: 0,
        MRP_Price: 0,
        total: 0,
      },
    ]);
  };

  const deleteRow = (idx) => {
    if (items.length === 1) {
      setMessage({ text: "At least one item required", type: "error" });
      return;
    }
    setItems((p) => p.filter((_, i) => i !== idx));
  };

  const handleInputBlur = (idx) => {
    if (suggestionsTimeout.current) clearTimeout(suggestionsTimeout.current);
    suggestionsTimeout.current = setTimeout(() => {
      setActiveRow(null);
    }, 150);
  };

  const getHeaders = () => ({
    Authorization: token ? `Bearer ${token}` : undefined,
    "Content-Type": "application/json",
  });

  const handleSubmit = async () => {
    if (!shopId) {
      setMessage({ text: "Shop not identified. Please login again.", type: "error" });
      return;
    }
    if (!customerName || !phone) {
      setMessage({ text: "Customer name and phone are required.", type: "error" });
      return;
    }
    const validItems = items.filter((i) => i.item_id && i.quantity > 0);
    if (validItems.length === 0) {
      setMessage({ text: "Add at least one valid item.", type: "error" });
      return;
    }

    const payload = {
      shop_id: shopId,
      shop_name: shopNameFromStore || "",
      customer_id: 0,
      customer_phone: phone,
      customer_name: customerName,
      status: status,
      date_of_purchase: purchaseDate,
      payment_status: payment_status,
      payment_method: paymentMethod,
      created_by: shopNameFromStore || "",
      total_amount: Number(billTotal.toFixed(2)),
      items: validItems.map((i) => ({
        item_id: Number(i.item_id),
        item_name: i.item_name,
        unit_price: Number(i.unit_price),
        quantity: Number(i.quantity),
        cgst_per: Number(i.cgst_per || 0),
        sgst_per: Number(i.sgst_per || 0),
        MRP_price: Number(i.MRP_Price || 0),
        total: Number(i.total || 0),
      })),
    };

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await axiosInstance.post("/bills/", payload, { headers: getHeaders() });
      setMessage({ text: `Bill ${res.data.bill_number || "created"} successfully`, type: "success" });

      // reset
      setPhone("");
      setCustomerName("");
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const hh = String(today.getHours()).padStart(2, "0");
      const min = String(today.getMinutes()).padStart(2, "0");
      const ss = String(today.getSeconds()).padStart(2, "0");
      setPurchaseDate(`${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`);

      setStatus("completed");
      setPaymentMethod("upi");
      setpayStatus("paid");
      setItems([
        {
          item_id: "",
          item_name: "",
          unit_price: 0,
          quantity: 1,
          sgst_per: 0,
          cgst_per: 0,
          MRP_Price: 0,
          total: 0,
        },
      ]);
    } catch (err) {
      console.error("Create bill error:", err);
      let text = "Failed to create bill";
      if (err?.response?.data?.detail) text = err.response.data.detail;
      setMessage({ text, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const clearRow = (idx) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? {
              item_id: "",
              item_name: "",
              unit_price: 0,
              quantity: 1,
              sgst_per: 0,
              cgst_per: 0,
              MRP_Price: 0,
              total: 0,
            }
          : item
      )
    );
  };

  const fmt = (v) => Number(v || 0).toFixed(2);

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

    {/* Header */}
    <div className="flex items-center mb-6 bg-black text-white p-4 rounded-2xl shadow-xl">
      <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-slate-800">
        <ArrowLeft />
      </button>
      <h1 className="text-2xl font-semibold ml-3 tracking-wide">Create Bill</h1>

      <div className="ml-auto text-sm text-slate-300">
        Shop:
        <span className="font-bold text-white ml-2">{shopNameFromStore}</span>
      </div>
    </div>

    {/* Message */}
    {message.text && (
      <div
        className={`p-4 mb-6 rounded-xl shadow border text-sm flex items-center justify-between ${
          message.type === "success"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}
      >
        <span>{message.text}</span>
        <button onClick={() => setMessage({ text: "", type: "" })} className="underline">
          Close
        </button>
      </div>
    )}

    {/* CUSTOMER DETAILS CARD */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

      {/* Left big card */}
      <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Customer Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone"
              className="mt-1 p-3 bg-slate-50 border rounded-xl w-full text-black focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="mt-1 p-3 bg-slate-50 border rounded-xl w-full text-black focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500">Purchase Date & Time</label>
            <input
              type="datetime-local"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="mt-1 p-3 bg-slate-50 border rounded-xl w-full text-black focus:ring-2 focus:ring-black"
            />
          </div>
        </div>
      </div>

      {/* Right card */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 space-y-4">
        <div>
          <label className="text-xs text-slate-500">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 p-3 w-full bg-slate-50 border rounded-xl focus:ring-2 focus:ring-black"
          >
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-500">Payment Status</label>
          <select
            value={payment_status}
            onChange={(e) => setpayStatus(e.target.value)}
            className="mt-1 p-3 w-full bg-slate-50 border rounded-xl focus:ring-2 focus:ring-black"
          >
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-500">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 p-3 w-full bg-slate-50 border rounded-xl focus:ring-2 focus:ring-black"
          >
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="credit">Credit</option>
          </select>
        </div>
      </div>
    </div>

    {/* ITEMS TABLE */}
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Items</h2>
        <p className="text-sm text-slate-500">Search items and select from dropdown</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black text-white rounded-lg">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-center">Unit Price</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-center">SGST%</th>
              <th className="p-3 text-center">CGST%</th>
              <th className="p-3 text-center">MRP</th>
              <th className="p-3 text-center">Total</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-slate-50">

                {/* ITEM SEARCH CELL */}
                <td className="p-3 relative">
                  <label className="text-xs text-slate-400">Item</label>
                  <input
                    type="text"
                    value={row.item_name}
                    placeholder="Search item..."
                    onChange={(e) => handleItemSearch(idx, e.target.value)}
                    onFocus={() => setActiveRow(idx)}
                    onBlur={() => handleInputBlur(idx)}
                    className="mt-1 p-2 w-full border rounded-xl bg-white text-black focus:ring-2 focus:ring-black"
                  />

                  {/* DROPDOWN FIXED IMPROVED */}
                  {activeRow === idx && (suggestionsForRow[idx] || []).length > 0 && (
                    <ul className="absolute left-0 right-0 z-40 bg-white border rounded-xl shadow-lg max-h-72 overflow-y-auto mt-1">
                      {(suggestionsForRow[idx] || []).map((it) => (
                        <li
                          key={it.id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectItem(idx, it);
                          }}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-black">{it.name}</span>
                            <span className="text-sm text-slate-600">₹{Number(it.price).toFixed(2)}</span>
                          </div>
                          {it.MRP_Price && (
                            <div className="text-xs text-slate-400">MRP ₹{it.MRP_Price}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  <br></br>
                  
                </td>

                {/* UNIT PRICE */}
                <td className="p-3 text-center">
                  <label className="text-xs text-slate-400">Unit</label>
                  <input
                    type="number"
                    value={row.unit_price}
                    onChange={(e) => updateRow(idx, { unit_price: e.target.value })}
                    className="mt-1 p-2 w-full border rounded-xl text-center focus:ring-2 focus:ring-black"
                  />
                </td>

                {/* QTY */}
                <td className="p-3 text-center">
                  <label className="text-xs text-slate-400">Qty</label>
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={(e) => updateRow(idx, { quantity: e.target.value })}
                    className="mt-1 p-2 w-full border rounded-xl text-center focus:ring-2 focus:ring-black"
                  />
                </td>

                {/* SGST */}
                <td className="p-3 text-center">
                  <label className="text-xs text-slate-400">SGST</label>
                  <input
                    type="number"
                    value={row.sgst_per}
                    onChange={(e) => updateRow(idx, { sgst_per: e.target.value })}
                    className="mt-1 p-2 w-full border rounded-xl text-center"
                  />
                </td>

                {/* CGST */}
                <td className="p-3 text-center">
                  <label className="text-xs text-slate-400">CGST</label>
                  <input
                    type="number"
                    value={row.cgst_per}
                    onChange={(e) => updateRow(idx, { cgst_per: e.target.value })}
                    className="mt-1 p-2 w-full border rounded-xl text-center"
                  />
                </td>

                {/* MRP */}
                <td className="p-3 text-center">
                  <label className="text-xs text-slate-400">MRP</label>
                  <input
                    type="number"
                    value={row.MRP_Price}
                    onChange={(e) => updateRow(idx, { MRP_Price: e.target.value })}
                    className="mt-1 p-2 w-full border rounded-xl text-center"
                  />
                </td>

                {/* TOTAL */}
                <td className="p-3 text-center font-bold text-slate-800">
                  ₹ {fmt(row.total)}
                </td>

                {/* ACTIONS */}
                <td className="p-3 text-center flex justify-center gap-2">
                  <button onClick={() => deleteRow(idx)} className="p-2 bg-red-50 hover:bg-red-100 rounded-xl">
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                  <button onClick={() => clearRow(idx)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl">
                    <Eraser size={16} className="text-slate-700" />
                  </button>
                </td>
              </tr>
              
            ))}
          </tbody>
          
        </table>
        <br></br>
        <br></br>
        <br></br>
      </div>

      {/* BOTTOM TOTAL + ADD BUTTON */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={addRow}
          className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl hover:bg-slate-900 shadow-lg"
        >
          <Plus size={16} /> Add Item
        </button>

        <div className="text-right">
          <p className="text-sm text-slate-500">Total Amount</p>
          <p className="text-3xl font-bold text-slate-900">₹ {billTotal.toFixed(2)}</p>
        </div>
      </div>
    </div>

    {/* SUBMIT BUTTON */}
    <div className="flex justify-end mt-8">
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`px-8 py-3 rounded-2xl text-lg font-semibold shadow-xl text-white ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-slate-900"
        }`}
      >
        {isLoading ? "Submitting..." : "Create Bill"}
      </button>
    </div>
  </div>
);
}