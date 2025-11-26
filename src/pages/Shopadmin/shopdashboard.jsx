// src/pages/Shopadmin/shopdashboard.jsx

import React, { useEffect, useState } from "react";
import api from "../../api/axios.js"; // your axios.api wrapper
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; 
const ShopDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // You can replace this later with login-based decoded.id
  const navigate = useNavigate
  console.log("🔥 VITE_API_URL =", import.meta.env.VITE_API_URL);

  const token = localStorage.getItem("token");
   if (!token || token.split(".").length !== 3) {
        console.warn("Invalid token. Redirecting to login...");
        navigate("/login");
        return null;
}

  const decoded = jwtDecode(token);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        
        const res = await api.get(`/dashboard/${decoded.id}`);
        setData(res.data);
        const token = localStorage.getItem("token");
       
        console.log("Token:", token);

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [decoded.id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="text-red-600 p-6">{error}</p>;
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Top Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold text-stone-900">Today's Sales</h2>
          <p className="text-3xl font-bold text-brand-primary">
            ₹ {data.today_sales}
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold text-stone-900">Your credits</h2>
          <p className="text-3xl font-bold text-brand-primary">
             {data.credit}
          </p>
        </div>
        

        <div className="p-5 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold text-stone-900">Yesterday Bills</h2>
          <p className="text-3xl font-bold text-brand-primary">
            {data.bills_yesterday}
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold text-stone-900">Start Your Day</h2>
          <p
            className={`text-2xl font-bold ${
              data.start_your_day ? "text-red-600" : "text-green-600"
            }`}
          >
            {data.start_your_day ?   "No Sales Yet": "Good to Go!"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Top Customers */}
      <div className="bg-white rounded-xl shadow p-6 ">
        <h2 className="text-xl font-semibold mb-3 text-stone-900">Top Customers (7 days)</h2>
        {data.top_customers_7days.length === 0 ? (
          <p className="text-blue-600">No customers found</p>
        ) : (
          <ul className="space-y-2 text-blue-600">
            {data.top_customers_7days.map((cust, idx) => (
              <li key={idx} className="flex justify-between border-b py-2 text-blue-800">
                <div className="relative group inline-block">
  <span className="font-semibold text-blue-600">
    {cust.name.length > 6
      ? cust.name.slice(0, 6) + "..."
      : cust.name}
  </span>

  {/* Tooltip */}
  <div className="
    absolute left-1/2 -translate-x-1/2 -top-10 
    hidden group-hover:block
    bg-gray-900 text-white text-xs 
    px-2 py-1 rounded shadow-lg whitespace-nowrap z-50
  ">
    {cust.name}
  </div>
</div>
                <span className="font-semibold text-stone-900">{cust.phone}</span>
                <span className="font-semibold text-blue-600">₹ {cust.total_spent}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Best Selling Items */}
      <div className="bg-white rounded-xl shadow p-6 font-semibold text-blue-600">
        <h2 className="text-xl font-semibold mb-3 text-blue-600">
          Best Selling Items (7 days)
        </h2>
        {data.best_selling_items_7days.length === 0 ? (
          <p className="text-blue-600">No selling items found</p>
        ) : (
          <ul className="space-y-2">
            {data.best_selling_items_7days.map((item, idx) => (
              <li key={idx} className="flex justify-between border-b py-2">
                <div className="relative group inline-block">
  <span className="font-semibold text-blue-600">
    {item.name.length > 6
      ? item.name.slice(0, 6) + "..."
      : item.name}
  </span>

  {/* Tooltip */}
  <div className="
    absolute left-1/2 -translate-x-1/2 -top-10 
    hidden group-hover:block
    bg-gray-900 text-white text-xs 
    px-2 py-1 rounded shadow-lg whitespace-nowrap z-50
  ">
    {item.name}
  </div>
</div>

                <span className="font-semibold text-blue-600">{item.sold_qty} sold</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Stock */}
      <div className="bg-white rounded-xl shadow p-6 text-stone-900">
        <h2 className="text-xl font-semibold mb-3 text-blue-600">Stock</h2>
        {data.stock.length === 0 ? (
          <p className="text-blue-600">No stock items</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-red-100">
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Stock</th>
                <th className="p-2 border">Reserved</th>
              

              </tr>
            </thead>
            <tbody >
              {data.stock.map((stock, idx) => (
                <tr className="" key={idx}>
                  <td className="border p-2 font-semibold text-blue-600">{stock.name}</td>
                  <td className="border p-2 font-semibold text-blue-600">{stock.available_qty}</td>
                  <td className="border p-2 font-semibold text-blue-600">{stock.stock}</td>
                  <td className="border p-2 font-semibold text-blue-600">{stock.reserved}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
          
        )}
      </div>
    </div>
    </div>
  );
};

export default ShopDashboard;
