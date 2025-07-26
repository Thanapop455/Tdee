import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
// App.js
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useState } from "react";
// import Foodsearch from "./components/Foodsearch";
// import Cal from "./components/Cal";
// import Table from "./components/Table";
// import Profile from "./components/Profile";
// import Navbar from "./components/Navbar";
// import SearchResultPage from "./components/SearchResultPage";
// import FoodDetail from "./components/FoodDetail";
// import Login from "./components/page/auth/Login";
// import Register from "./components/page/auth/Register";
// import FoodPage from "./components/FoodPage";

// function App() {
//   // const [selectedFoods, setSelectedFoods] = useState([]);

//   return (
//     // <BrowserRouter>
//     //   <Navbar />
//     //   <Routes>
//     //     <Route path="/foodsearch" element={<Foodsearch />} />
//     //     <Route path="/cal" element={<Cal />} />
//     //     <Route
//     //       path="/table"
//     //       element={
//     //         <Table
//     //           selectedFoods={selectedFoods}
//     //           setSelectedFoods={setSelectedFoods}
//     //         />
//     //       }
//     //     />
//     //     <Route path="/profile" element={<Profile />} />
//     //     <Route path="/search" element={<SearchResultPage />} />
//     //     <Route path="/food/:id" element={<FoodDetail />} />
//     //     <Route path="/register" element={<Register />} />
//     //     <Route path="/login" element={<Login />} />
//     //     <Route
//     //       path="/foodpage"
//     //       element={<FoodPage setSelectedFoods={setSelectedFoods} />}
//     //     />
//     //     <Route path="/" element={<Foodsearch />} />
//     //   </Routes>
//     // </BrowserRouter>
//   );
// }
const App = () => {
  // Javascript

  return (
    <>
      <ToastContainer />
      <AppRoutes />
    </>
  );
};

export default App;
