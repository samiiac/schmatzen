import { useContext } from "react";
import { UserAuthContext } from "./AuthProvider";
import Home from "./pages/Home";
import SingleService from "./pages/SingleService";
import Services from "./pages/Services";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import UserReservations from "./pages/UserReservations";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import AddServiceForm from "./components/AddServiceForm";
import AdminReservations from "./pages/AdminReservations";
import AdminServices from "./pages/AdminServices";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./pages/AdminLayout";
import RootLayout from "./pages/RootLayout";
import AuthLayout from "./pages/AuthLayout";

import {
  createBrowserRouter,
  Routes,
  Route,
  RouterProvider,
  Outlet,
  Navigate,
  Link,
} from "react-router-dom";
import "./App.css";

const ProtectedRoutes = () => {
  const { user } = useContext(UserAuthContext);
  if (!user) return <Navigate to="/auth/login" />;
  return <Outlet />;
};

const AdminRoutes = () => {
  const { user } = useContext(UserAuthContext);
  if (!user) return <Navigate to="/auth/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/services", element: <Services /> },
      { path: "/services/:id", element: <SingleService /> },
      { path: "/contact", element: <Contact /> },
      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/booking/:serviceId", element: <Booking /> },
          { path: "/payment/:reservationId", element: <Payment /> },
          { path: "/my-reservations", element: <UserReservations /> },
          { path: "/wishlist", element: <Wishlist /> },
          { path: "/profile", element: <Profile /> },
        ],
      },
      {
        element: <AdminRoutes />,
        children: [
          { path: "/admin", element: <AdminLayout /> },
          { path: "/admin/services", element: <AdminLayout /> },
          { path: "/admin/services/add", element: <AdminLayout /> },
          { path: "/admin/services/edit/:id", element: <AdminLayout /> },
          { path: "/admin/reservations", element: <AdminLayout /> },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "signup", element: <SignUp /> },
      { path: "login", element: <Login /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
