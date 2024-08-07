// import "./App.css";
// import Dashboard from "./components/Admin/Dashboard/Dashboard";
// import Edit from "./components/Admin/Edit/Edit";
// import NavBar from "./components/Admin/NavBar/NavBar";
// import UserManagement from "./components/Admin/UserManagement/UserManagement";
// import Blog from "./components/Blog/Blog";
// import Cart from "./components/Cart/Cart";
// import HomeScreen from "./components/HomePage/HomeScreen";
// import Login from "./components/loginPage/login";
// import Post from "./components/Post/Post";
// import ProductDetail from "./components/ProductInfo/ProductDetail";
// import Register from "./components/Register/Register";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import StaffManagement from "./components/Staff/StaffManagement/StaffManagement";
// import UserAccount from "./components/UserAccount/UserAccount";
// import RequireAuth from "./components/RequireAuth";
// import Unauthorized from "./components/Unauthorized/Unauthorized";
// import OrderPayment from "./components/OrderPayment/OrderPayment";
// import SearchPage from "./components/HomePage/Search/SearchPage";
// import Trackorder from "./components/UserAccount/Sidebar/ScreenCustomerAccount/TrackingOrder/Trackorder";
// import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
// import ResetPassword from "./components/ForgotPassword/ResetPassword";
// import BrandPage from "./components/HomePage/Content/Brand/BrandPage";
// import CreateUser from "./components/Admin/Create/CreateUser";
// import EditProduct from "./components/Staff/CreateEdit/EditProduct";
// import CreateProduct from "./components/Staff/CreateEdit/CreateProduct";
// import { useEffect } from "react";

// function App() {
//   useEffect(() => {
//     // Function to handle the beforeunload event
//     const handleBeforeUnload = (event) => {
//       if (document.visibilityState === "hidden") {
//         // Clear localStorage if the page is hidden (indicating close)
//         localStorage.clear();
//       }
//     };

//     // Function to handle the visibilitychange event
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "hidden") {
//         // Set a flag in sessionStorage to indicate the page is hidden
//         sessionStorage.setItem("isPageHidden", "true");
//       } else {
//         // Remove the flag if the page is visible
//         sessionStorage.removeItem("isPageHidden");
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     // Cleanup the event listeners on component unmount
//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   return (
//     <>
//       <BrowserRouter>
//         <Routes>
//           {/* public routes */}
//           <Route path="/" element={<HomeScreen />}></Route>
//           <Route path="/home" element={<HomeScreen />}></Route>
//           <Route path="/login" element={<Login />}></Route>
//           <Route path="/register" element={<Register />}></Route>
//           <Route path="/blogs" element={<Blog />}></Route>
//           <Route path="/search" element={<SearchPage />}></Route>
//           <Route path="/brand/:brand_name" element={<BrandPage />}></Route>
//           <Route path="/reset-password" element={<ResetPassword />}></Route>
//           <Route path="/forgot-password" element={<ForgotPassword />}></Route>
//           <Route path="/trackorder/:id" element={<Trackorder />}></Route>
//           <Route
//             path="/home/productdetail/:id"
//             element={<ProductDetail />}
//           ></Route>
//           <Route path="/blogs/post/:id" element={<Post />}></Route>
//           <Route path="/unauthorized" element={<Unauthorized />}></Route>

//           {/* we want to protect these routes */}
//           <Route element={<RequireAuth allowedRoles={"customer"} />}>
//             <Route path="/cart" element={<Cart />}></Route>
//             <Route path="/customer-account" element={<UserAccount />}></Route>
//             <Route path="/order-payment" element={<OrderPayment />}></Route>
//           </Route>

//           {/* admin role */}
//           <Route element={<RequireAuth allowedRoles={"admin"} />}>
//             <Route path="/admin" element={<NavBar />}></Route>
//             <Route path="/admin/user" element={<UserManagement />}></Route>
//             <Route path="/admin/edit/:id" element={<Edit />}></Route>
//             <Route path="/admin/create" element={<CreateUser />}></Route>
//             <Route path="/admin/dashboard" element={<Dashboard />}></Route>
//           </Route>

//           {/* staff */}
//           <Route element={<RequireAuth allowedRoles={"staff"} />}>
//             <Route path="/staff/*" element={<StaffManagement />}></Route>
//             <Route path="/edit-product/:id" element={<EditProduct />}></Route>
//             <Route path="/create-product" element={<CreateProduct />}></Route>
//           </Route>

//           {/* catch all */}
//           <Route path="*" element={<div>There nothing here</div>}></Route>
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;



import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import Edit from "./components/Admin/Edit/Edit";
import NavBar from "./components/Admin/NavBar/NavBar";
import UserManagement from "./components/Admin/UserManagement/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement/ProductManagement";
import Blog from "./components/Blog/Blog";
import Cart from "./components/Cart/Cart";
import HomeScreen from "./components/HomePage/HomeScreen";
import Login from "./components/loginPage/login";
import Post from "./components/Post/Post";
import ProductDetail from "./components/ProductInfo/ProductDetail";
import Register from "./components/Register/Register";
import StaffManagement from "./components/Staff/StaffManagement/StaffManagement";
import UserAccount from "./components/UserAccount/UserAccount";
import Unauthorized from "./components/Unauthorized/Unauthorized";
import OrderPayment from "./components/OrderPayment/OrderPayment";
import SearchPage from "./components/HomePage/Search/SearchPage";
import Trackorder from "./components/UserAccount/Sidebar/ScreenCustomerAccount/TrackingOrder/Trackorder";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ForgotPassword/ResetPassword";
import BrandPage from "./components/HomePage/Content/Brand/BrandPage";
import CreateUser from "./components/Admin/Create/CreateUser";
import EditProduct from "./components/Staff/CreateEdit/EditProduct";
import CreateProduct from "./components/Staff/CreateEdit/CreateProduct";
import { useEffect } from "react";
import EditVoucher from "./components/Staff/CreateVoucher/EditVoucher";
import EditCategory from "./components/Staff/ManageCategory/EditCategory";

function App() {
  useEffect(() => {
    // Function to handle the beforeunload event
    const handleBeforeUnload = (event) => {
      if (document.visibilityState === "hidden") {
        // Clear localStorage if the page is hidden (indicating close)
        localStorage.clear();
      }
    };

    // Function to handle the visibilitychange event
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Set a flag in sessionStorage to indicate the page is hidden
        sessionStorage.setItem("isPageHidden", "true");
      } else {
        // Remove the flag if the page is visible
        sessionStorage.removeItem("isPageHidden");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup the event listeners on component unmount
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
        <Route path="/trackorder/:id" element={<Trackorder />} />
        <Route path="/home/productdetail/:id" element={<ProductDetail />} />
        <Route path="/blogs/post/:id" element={<Post />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* admin routes */}
        <Route path="/admin" element={<NavBar />} />
        <Route path="/admin/user" element={<UserManagement />} />
        <Route path="/admin/product" element={<ProductManagement />} />
        <Route path="/admin/edit/:id" element={<Edit />} />
        <Route path="/admin/create" element={<CreateUser />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* staff routes */}
        <Route path="/staff/*" element={<StaffManagement />} />
        <Route path="/edit-voucher/:voucherId" element={<EditVoucher />} />
        <Route path="/edit-category/:categoryId" element={<EditCategory />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/create-product" element={<CreateProduct />} />

        {/* additional public routes */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/customer-account" element={<UserAccount />} />
        <Route path="/order-payment" element={<OrderPayment />} />

        {/* catch all */}
        <Route path="*" element={<div>Không có gì ở đây</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

