import { useState, useContext } from "react";
import { UserAuthContext } from "./AuthProvider";

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
  const { token } = useContext(UserAuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index:true,element:<Home/>
      },
      {
        path: "/services",
        element: <ServicesPage />,
      },
      {
        path: "/services/:id",
        element: <SingleService />,
      },
    ],
  },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
