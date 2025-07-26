import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Caltdee from "../pages/Caltdee";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Layout from "../layouts/Layout";
import LayoutAdmin from "../layouts/LayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import Category from "../pages/admin/Category";
import Food from "../pages/admin/Food";
import Manage from "../pages/admin/Manage";
import LayoutUser from "../layouts/LayoutUser";
import HomeUser from "../pages/user/HomeUser";
import ProtectRouteAdmin from "./ProtectRouteAdmin";
import ProtectRouteUser from "./ProtectRouteUser";
import EditFood from "../pages/admin/EditFood";
import Foodsearch from "../pages/Foodsearch";
import SearchResults from "../pages/SearchResults";
import FoodDetails from "../pages/FoodDetails";
import MealPlan from "../pages/MealPlan";
import WeightRecord from "../pages/WeightRecord";




const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Foodsearch /> },
      { path: "search", element: <SearchResults /> },
      { path: "search",element: <SearchResults /> },
      { path: "food/:id",element: <FoodDetails />},
      { path: "caltdee", element: <Caltdee /> },
      { path: "mealPlan", element: <MealPlan />},
      { path: "weights", element: <WeightRecord />},
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },

  {
    path: '/admin',
    element: <ProtectRouteAdmin element={<LayoutAdmin />}/>,
    children:[
      { index: true,element: <Dashboard />},
      { path: "category",element: <Category />},
      { path: "food",element: <Food />},
      { path: "food/:id",element: <EditFood />},
      { path: "manage",element:<Manage />}
    ]
  },
  {
    path: '/user',
    element: <ProtectRouteUser element={<LayoutUser/>}/>,
    children:[
      { index:true,element: <HomeUser />},
      // { path: "mealplan",element: <MealPlan />},
    ]
  }
]);

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;
