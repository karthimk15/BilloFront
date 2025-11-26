import React, { useEffect, useState } from "react";
import axiosInstance from "/src/api/axios";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditItemModal from "./EditItemModal";


// Decode token
const decodeToken = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export default function InventoryList() {
  const token = localStorage.getItem("token");
  const decoded = decodeToken(token);
  const shopId = decoded?.id;

  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get(`/inventory/items?shop_id=${shopId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load inventory!");
    }
  };

  useEffect(() => {
    if (shopId) fetchItems();
  }, [shopId]);

  // Search handler
  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(items.filter((i) => i.name.toLowerCase().includes(s)));
  }, [search, items]);

  return (
    <div className="p-6 text-black">
      <h1 className="text-3xl font-bold mb-4">Inventory</h1>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <Input
          placeholder="Search item by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Item Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <Card key={item.id} className="shadow-md border rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {item.name}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p><strong>SKU:</strong> {item.sku}</p>
              <p><strong>Barcode:</strong> {item.barcode}</p>
              <p><strong>HSN:</strong> {item.hsn_code}</p>
              <p><strong>MRP:</strong> ₹{item.MRP_Price}</p>
              <p><strong>Price:</strong> ₹{item.price}</p>
              <p><strong>Stock:</strong> {item.stock_quantity}</p>
              <p><strong>CGST/SGST:</strong> {item.cgst_per}% / {item.sgst_per}%</p>

              <div className="mt-4">
                <Button
                  className="w-full"
                  onClick={() => setSelectedItem(item)}
                >
                  Edit Item
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {selectedItem && (
        <EditItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdated={fetchItems}
        />
      )}
    </div>
  );
}
