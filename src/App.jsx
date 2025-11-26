import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/ResetPassword";
import LoginWithOtp from "./pages/LoginOtp";
// Shop Admin Layout + Pages
import AdminLayout from "./layouts/ShopAdminLayout";
import Dashboard from "./pages/Shopadmin/shopdashboard";
import CreateBill from "./pages/Shopadmin/create-bill";
import BillHistory from "./pages/Shopadmin/bill-history";
import Inventory from "./pages/InventoryControl/inventoryAddItem";
import ShopProfile from "./pages/Shopadmin/ShopProfile";
import EditShopProfile from "./pages/Shopadmin/edit_shop";
import InventoryList from "./pages/InventoryControl/InventoryList";
import EditItemModal from "./pages/InventoryControl/EditItemModal";
import Recharge from "./pages/Shopadmin/Recharge";

// Customer Layout + Pages
import CustomerLayout from "./layouts/CustomerLayout";
import UserProfile from "./pages/userPages/UserProfile";
import BillCustomer from "./pages/userPages/BillCustomer";
export default function App() {
  return (
    <Router>
      <Routes>
        
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/fp" element={<ForgotPassword/>}/>
        <Route path="/rsp" element={<ResetPassword/>}/>
        <Route path="/loginwithotp" element={<LoginWithOtp/>}/>
       
        {/* ===========================
            SHOP OWNER ROUTES (Nested)
        ============================ */}
        <Route path="/shopadmin" element={<AdminLayout />}>
          <Route path="shopdashboard" element={<Dashboard />} />
          <Route path="create-bill" element={<CreateBill />} />
          <Route path="bill-history" element={<BillHistory />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="ShopProfile" element={<ShopProfile />} />
          <Route path="edit_shop" element={<EditShopProfile />} />
          <Route path="inventory-list" element={<InventoryList />} />
          <Route path="edit-item" element={<EditItemModal />} />
          <Route path="recharge" element={<Recharge />} />
        </Route>

        {/* ===========================
            CUSTOMER ROUTES (Nested)
        ============================ */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="CBills" element={<BillCustomer/>}/>
        </Route>

        {/* NOT FOUND */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}
