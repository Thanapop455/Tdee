
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Foodsearch.css";
import { motion } from "framer-motion";

export default function FoodSearch() {
  const [search, setSearch] = useState("");
  const [popularFoods, setPopularFoods] = useState([]);
  const navigate = useNavigate();

  // ฟังก์ชันค้นหา
  const handleSearch = () => {
    navigate(`/search?query=${encodeURIComponent(search.trim())}`);
  };

  // ค้นหาเมื่อกด Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ดึงข้อมูลอาหารยอดฮิต
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/foods/popular")
      .then((response) => {
        setPopularFoods(response.data);
      })
      .catch((error) => {
        console.error("Error fetching popular foods:", error);
      });
  }, []);

  return (
    <div className="food-search-container">
      <div className="search-box">
        <h1>ค้นหาอาหาร</h1>

        <div className="search-input">
          <input
            type="text"
            placeholder="เช่น ข้าวมันไก่"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="search-btn" onClick={handleSearch}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>

        {/* ใส่เมนูอาหารไว้ใต้ Input */}
        <div className="popular-foods">
          <h2>🔥เมนูอาหารยอดฮิต🔥</h2>
          <div className="food-grid">
            {popularFoods.map((food) => (
              <motion.div
                key={food.id}
                className="food-card"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/food/${food.id}`)}
              >
                <img
                  src={food.images[0]?.url || "/default-food.jpg"}
                  alt={food.title}
                  className="food-image"
                />
                <div className="food-info">
                  <h3>{food.title}</h3>
                  <p>{food.calorie} แคลอรี่</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
