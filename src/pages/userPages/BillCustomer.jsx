// src/pages/bill-history.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios.js";
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
export default function BillCustomer() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewBill, setViewBill] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState("");
   const [billId, setBillId] = useState("");
  const decodeToken = (token) => {
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      const json = JSON.parse(atob(payload));
      return json;
    } catch {
      return null;
    }
  };

  const token = localStorage.getItem("token");
  const decoded = decodeToken(token);
  const customerId = decoded?.id ?? null;

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `bills/customerbills/${customerId}?skip=0&limit=20`
      );
      setBills(res.data);
    } catch {
      setError("Failed to load bills.");
    }
    setLoading(false);
  };

  const openBillDetails = async (billId) => {
    try {
      setModalLoading(true);
      const res = await axiosInstance.get(`/bills/${billId}`);
      setViewBill(res.data);
      setBillId(billId)
      
    } catch {
      alert("Failed to load bill details");
    }
    setModalLoading(false);
  };
  const downloadPDF = async () => {
    try {
      const response = await axiosInstance.get(`/pdf/bill/${billId}`, {
        responseType: "blob", // <-- VERY IMPORTANT
      });
  
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = `bill_${billId}.pdf`;
      a.click();
  
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF");
    }
  };
  
  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
        Bill History
      </h1>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md mb-4 border border-red-300">
          {error}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Bill No</th>
              <th className="py-3 px-4 text-left font-semibold">Customer</th>
              <th className="py-3 px-4 text-left font-semibold">Phone</th>
              <th className="py-3 px-4 text-left font-semibold">Total</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
              <th className="py-3 px-4 text-left font-semibold">Date</th>
              <th className="py-3 px-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-gray-500 animate-pulse"
                >
                  Loading bills...
                </td>
              </tr>
            ) : bills.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-gray-500 italic"
                >
                  No bills found.
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr
                  key={bill.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {bill.bill_number}
                  </td>
                  <td className="py-3 px-4">{bill.customer_name}</td>
                  <td className="py-3 px-4">{bill.customer_phone}</td>
                  <td className="py-3 px-4 font-semibold text-green-700">
                    ₹{bill.total_amount}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bill.payment_status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {bill.payment_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(bill.purchase_date).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => openBillDetails(bill.id)}
                      className="px-4 py-1.5 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-sm transition shadow-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bill Details Modal */}
      {viewBill && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setViewBill(null)}
              className="absolute top-4 right-4 text-gray-700 hover:text-red-600 transition text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Bill Details
            </h2>

            {modalLoading ? (
              <div className="text-center py-6 text-gray-600">
                Loading details...
              </div>
            ) : (
              <>
                {/* Bill Info */}
                <div className="grid grid-cols-2 gap-4 mb-8 text-gray-800 text-sm">
                  <p><strong>Bill No:</strong> {viewBill.bill_number}</p>
                  <p><strong>Customer:</strong> {viewBill.customer_name}</p>
                  <p><strong>Phone:</strong> {viewBill.customer_phone}</p>
                  <p><strong>Total:</strong> ₹{viewBill.total_amount}</p>
                  <p><strong>Status:</strong> {viewBill.status}</p>
                  <p><strong>Payment:</strong> {viewBill.payment_status}</p>
                  <p><strong>Method:</strong> {viewBill.payment_method}</p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {viewBill.purchase_date
                      ? new Date(
                          viewBill.purchase_date.replace(" ", "T")
                        ).toLocaleString("en-IN")
                      : "N/A"}
                  </p>
                </div>

                {/* Items */}
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Items
                </h3>

                <table className="w-full text-sm border rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left">Item</th>
                      <th className="px-3 py-2 text-left">Unit Price</th>
                      <th className="px-3 py-2 text-left">Unit MRP</th>
                      <th className="px-3 py-2 text-left">Qty</th>
                      <th className="px-3 py-2 text-left">CGST%</th>
                      <th className="px-3 py-2 text-left">SGST%</th>
                      <th className="px-3 py-2 text-left">Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {viewBill.items.map((it) => (
                      <tr key={it.id} className="border-b">
                        <td className="px-3 py-2">{it.item_name}</td>
                        <td className="px-3 py-2">₹{it.unit_price}</td>
                        <td className="px-3 py-2">₹{it.MRP_price}</td>
                        <td className="px-3 py-2">{it.quantity}</td>
                        <td className="px-3 py-2">{it.cgst_per}</td>
                        <td className="px-3 py-2">{it.sgst_per}</td>
                        <td className="px-3 py-2 font-semibold">
                          ₹{it.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total */}
                <div className="flex justify-end mt-4">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm text-gray-800 font-medium">
                    Grand Total: ₹{viewBill.total_amount}
                  </div>
                </div>
                 <Button 
      onClick={downloadPDF} 
      className="flex gap-2 bg-black text-white hover:bg-gray-800 rounded-xl px-4 py-2"
    >
      <FileDown size={18} />
      Download Bill PDF
    </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
