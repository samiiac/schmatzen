import {  useContext } from "react";
import { UserAuthContext } from "./AuthProvider";
import Home from "./pages/Home";
import SingleService from "./pages/SingleService";
import RootLayout from "./pages/RootLayout";
import AuthLayout from "./pages/AuthLayout";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Services from "./pages/Services";

import {
  createBrowserRouter,
  Routes,
  Route,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import "./App.css";


const ProtectedRoutes = () => {
  const { user } = useContext(UserAuthContext);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/services/:id",
        element: <SingleService />,
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
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
