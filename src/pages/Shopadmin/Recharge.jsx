import React, { useState } from "react";
import axiosInstance from "/src/api/axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Recharge() {
  const [loading, setLoading] = useState(false);

  // 🔘 Start Recharge
  const startRecharge = async (plan) => {
    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/start-recharge?plan=" + plan
      );

      const { order_id, amount, key } = res.data;

      const options = {
        key,
        amount,
        currency: "INR",
        name: "Billo Recharge",
        description: `Recharge Plan ${plan}`,
        order_id,
        handler: async function (response) {
          await verifyPayment(response);
        },
        theme: { color: "#0F172A" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      alert("Failed to start recharge");
    } finally {
      setLoading(false);
    }
  };

  // 🔘 Verify Payment Signature
  const verifyPayment = async (data) => {
    try {
      const res = await axiosInstance.post("/verify-payment", {
        razorpay_order_id: data.razorpay_order_id,
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
      });

      if (res.data.status === "verified") {
        alert("Payment Verified! Credits will reflect shortly.");
      }
    } catch (err) {
      console.error(err);
      alert("Payment verification failed.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">
        Recharge Credits
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ---- PLAN ONE ---- */}
        <Card className="rounded-2xl shadow-sm border bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              ₹9 Recharge
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600">Get <b>1000 Credits</b></p>

            <Button
              className="w-full mt-4"
              onClick={() => startRecharge("1000")}
              disabled={loading}
            >
              {loading ? "Processing…" : "Recharge ₹9"}
            </Button>
          </CardContent>
        </Card>

        {/* ---- PLAN TWO ---- */}
        <Card className="rounded-2xl shadow-sm border bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              ₹49 Recharge
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600">Get <b>10,000 Credits</b></p>

            <Button
              className="w-full mt-4"
              onClick={() => startRecharge("10000")}
              disabled={loading}
            >
              {loading ? "Processing…" : "Recharge ₹49"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
