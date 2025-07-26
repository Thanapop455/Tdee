import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./MainNav.css";
import useStoregobal from "../store/storegobal";
import { toast } from "react-toastify";
import { ChevronDown } from 'lucide-react';

const MainNav = () => {
  const navigate = useNavigate();
  const user = useStoregobal((state) => state.user);
  const logout = useStoregobal((s) => s.logout);

  const handleMealPlanClick = (e) => {
    if (!user) {
      e.preventDefault();
      toast.error("⚠️ กรุณาเข้าสู่ระบบก่อน!");
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ ปิด dropdown ถ้าคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav>
      <div className="mx-auto px-4">
        <div className="McNav">
          <div className="LeftNav">
            <Link to={"/"}>LOGO</Link>

            <NavLink to={"search"} className="titles">อาหาร</NavLink>
            <NavLink to={"caltdee"} className="titles">คำนวนแคล</NavLink>
            <NavLink 
              to={user ? "/mealPlan" : "#"} 
              className={`titles ${!user ? "disabled-link" : ""}`} 
              onClick={handleMealPlanClick}
            >
              ตาราง
            </NavLink>
          </div>

          {user ? (
            <div className="flex items-center gap-4" ref={dropdownRef}>
              {/* ปุ่ม dropdown */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-blue-600 px-2 py-2 rounded-md"
              >
                <img
                  className="w-8 h-8"
                  src="data:image/png;base64,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"
                />
                <ChevronDown className="text-white" />
              </button>

              {/* Dropdown เมนู */}
              {isOpen && (
                <div className="text-gray-500 absolute top-16 bg-white shadow-md z-50 rounded-lg">
                  <Link
                    to={"/weights"}
                    className="block px-4 py-2 hover:bg-gray-200 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    บันทึกน้ำหนัก
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                      navigate("/");
                    }}
                    className="block px-4 py-2 hover:bg-gray-200 w-full text-left rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="RightNav">
              <NavLink to={"/register"}>Register</NavLink>
              <NavLink to={"/login"}>Login</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
