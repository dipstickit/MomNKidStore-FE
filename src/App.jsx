
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.scss";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import Edit from "./components/Admin/Edit/Edit";
import NavBar from "./components/Admin/NavBar/NavBar";
import UserManagement from "./components/Admin/UserManagement/UserManagement";
import Blog from "./components/Blog/Blog";
import Cart from "./components/Cart/Cart";
import HomeScreen from "./components/HomePage/HomeScreen";
import Login from "./components/loginPage/login";
import Post from "./components/Post/Post";
import ProductDetail from "./components/ProductInfo/ProductDetail";
import Register from "./components/Register/Register";
import StaffManagement from "./components/Staff/StaffManagement/StaffManagement";
import DeliverierManagement from "./components/Deliverier/DeliverierManagement";
import UserAccount from "./components/UserAccount/UserAccount";
import CustomerProfile from "./components/UserAccount/UserProfile/CustomerProfile";
import Unauthorized from "./components/Unauthorized/Unauthorized";
import SearchPage from "./components/HomePage/Search/SearchPage";
import Trackorder from "./components/UserAccount/Sidebar/ScreenCustomerAccount/TrackingOrder/Trackorder";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ForgotPassword/ResetPassword";
import BrandPage from "./components/HomePage/Content/Brand/BrandPage";
import CreateUser from "./components/Admin/Create/CreateUser";
import EditProduct from "./components/Staff/ProductManagement/EditProduct";
import CreateProduct from "./components/Staff/ProductManagement/CreateProduct";
import { useEffect } from "react";
import EditVoucher from "./components/Staff/CreateVoucher/EditVoucher";
import EditCategory from "./components/Staff/ManageCategory/EditCategory";
import EditPost from "./components/Staff/ManagePosts/EditPost/EditPost";
import ReportDetail from "./components/Staff/Report/ReportDetail";
import ModalCreatePost from "./components/Staff/ManagePosts/ModalCreatePost/ModalCreatePost";
import PurchaseHistory from "./components/UserAccount/UserProfile/PurchaseHistory";
import OrderDetail from "./components/UserAccount/UserProfile/OrderDetail";
import Contact from "./components/Contact/Contact";
import UpdateInfo from "./components/UserAccount/UserProfile/UpdateInfo";
import ViewReport from "./components/UserAccount/UserProfile/ViewReport";
import ViewReportDetail from "./components/UserAccount/UserProfile/ViewReportDetail";
import PreOrderPage from "./components/ProductInfo/PreOrderPage/PreOrderPage";
import CreateReport from "./components/UserAccount/UserProfile/CreateReport";
import PaymentSuccess from "./components/PaymentSuccess";
import RequireAuth from "./components/RequireAuth";
import PaymentFail from "./components/PaymentFail";
function App() {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (document.visibilityState === "hidden") {
        localStorage.clear();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sessionStorage.setItem("isPageHidden", "true");
      } else {
        sessionStorage.removeItem("isPageHidden");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/brand/:brand_name" element={<BrandPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/trackorder/:productId" element={<Trackorder />} />
        <Route path="/home/productdetail/:productId" element={<ProductDetail />} />
        <Route path="/blogs/post/:id" element={<Post />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/contact" element={<Contact />} />

        {/* admin routes */}
        <Route element={<RequireAuth allowedRoles={"1"} />}>
          <Route path="/admin" element={<NavBar />} />
          <Route path="/admin/user" element={<UserManagement />} />
          <Route path="/admin/edit/:id" element={<Edit />} />
          <Route path="/admin/create-staff" element={<CreateUser />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>


        {/* Deliverier routes */}
        <Route element={<RequireAuth allowedRoles={"4"} />}>
          <Route path="/deliverier/*" element={<DeliverierManagement />} />
          <Route path="/deliverier/detail-report/:reportId" element={<ReportDetail />} />
        </Route>


        {/* staff routes */}
        <Route element={<RequireAuth allowedRoles={"2"} />}>
          <Route path="/staff/*" element={<StaffManagement />} />
          <Route path="/edit-voucher/:voucherId" element={<EditVoucher />} />
          <Route path="/edit-category/:categoryId" element={<EditCategory />} />
          <Route path="/edit-product/:productId" element={<EditProduct />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path="/create-blog" element={<ModalCreatePost />} />
          <Route path="/edit-blog/:blogId" element={<EditPost />} />
          <Route path="/staff/detail-report/:reportId" element={<ReportDetail />} />


        </Route>


        {/* additional public routes */}
        <Route element={<RequireAuth allowedRoles={"3"} />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/customer-account" element={<CustomerProfile />} />
          <Route path="/purchase-history" element={<PurchaseHistory />} />
          <Route path="/update-info" element={<UpdateInfo />} />
          <Route path="/order-detail/:orderId" element={<OrderDetail />} /> {/* Add OrderDetail route */}
          <Route path="/product-reports" element={<ViewReport />} />
          <Route path="/customer/report-detail/:reportId" element={<ViewReportDetail />} />
          <Route path="/create-report/:orderId" element={<CreateReport />} />
          <Route path="/pre-order/:productId" element={<PreOrderPage />} />
          <Route path="/payment-fail" element={<PaymentFail />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<div>There are no records to display</div>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;

