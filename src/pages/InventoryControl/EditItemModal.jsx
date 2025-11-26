import React, { useState } from "react";
import axiosInstance from "/src/api/axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function EditItemModal({ item, onClose, onUpdated }) {
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: item.name,
    sku: item.sku,
    barcode: item.barcode,
    hsn_code: item.hsn_code,
    MRP_Price: item.MRP_Price,
    price: item.price,
    sgst_per: item.sgst_per,
    cgst_per: item.cgst_per,
    reorder_level: item.reorder_level,
    track_batch: item.track_batch,
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const updateItem = async () => {
    try {
      await axiosInstance.put(`/inventory/items/${item.id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update item!");
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="text-black max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Item</DialogTitle>
        </DialogHeader>

        {/* Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <Label>Item Name</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter item name"
            />
          </div>

          {/* SKU */}
          <div className="flex flex-col gap-1">
            <Label>SKU</Label>
            <Input
              value={form.sku}
              onChange={(e) => handleChange("sku", e.target.value)}
              placeholder="Enter SKU"
            />
          </div>

          {/* Barcode */}
          <div className="flex flex-col gap-1">
            <Label>Barcode</Label>
            <Input
              value={form.barcode}
              onChange={(e) => handleChange("barcode", e.target.value)}
              placeholder="Enter barcode"
            />
          </div>

          {/* HSN Code */}
          <div className="flex flex-col gap-1">
            <Label>HSN Code</Label>
            <Input
              value={form.hsn_code}
              onChange={(e) => handleChange("hsn_code", e.target.value)}
              placeholder="Enter HSN Code"
            />
          </div>

          {/* MRP */}
          <div className="flex flex-col gap-1">
            <Label>MRP Price</Label>
            <Input
              type="number"
              value={form.MRP_Price}
              onChange={(e) => handleChange("MRP_Price", e.target.value)}
              placeholder="Enter MRP price"
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1">
            <Label>Selling Price</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="Enter selling price"
            />
          </div>

          {/* SGST */}
          <div className="flex flex-col gap-1">
            <Label>SGST (%)</Label>
            <Input
              type="number"
              value={form.sgst_per}
              onChange={(e) => handleChange("sgst_per", e.target.value)}
              placeholder="SGST %"
            />
          </div>

          {/* CGST */}
          <div className="flex flex-col gap-1">
            <Label>CGST (%)</Label>
            <Input
              type="number"
              value={form.cgst_per}
              onChange={(e) => handleChange("cgst_per", e.target.value)}
              placeholder="CGST %"
            />
          </div>

          {/* Reorder Level */}
          <div className="flex flex-col gap-1">
            <Label>Reorder Level</Label>
            <Input
              type="number"
              value={form.reorder_level}
              onChange={(e) => handleChange("reorder_level", e.target.value)}
              placeholder="Min stock before reorder"
            />
          </div>

          {/* Track Batch */}
          <div className="flex flex-col gap-1">
            <Label>Track Batch (true/false)</Label>
            <Input
              value={form.track_batch}
              onChange={(e) => handleChange("track_batch", e.target.value)}
              placeholder="true / false"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={updateItem}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
