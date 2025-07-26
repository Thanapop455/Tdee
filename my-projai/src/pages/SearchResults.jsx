import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { listFood } from "../api/Food";
import useStoregobal from "../store/storegobal";
import "./SearchResults.css";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [foods, setFoods] = useState([]); // รายการทั้งหมด
  const [filteredFoods, setFilteredFoods] = useState([]); // รายการที่กรองแล้ว
  const [selectedCategories, setSelectedCategories] = useState([]);
  const token = useStoregobal((state) => state.token);
  const categories = useStoregobal((state) => state.categories);
  
  const navigate = useNavigate();


  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      await useStoregobal.getState().getCategory(token);
    };
    fetchCategories();
  }, [token]);

  const fetchFoods = async () => {
    try {
      const res = await listFood(token);
      console.log("🍛 อาหารทั้งหมด:", res.data);
      setFoods(res.data);
      setFilteredFoods(res.data); // กำหนดค่าเริ่มต้น
    } catch (err) {
      console.error("❌ Error fetching foods:", err);
    }
  };

  //เอาไว้กรองอาหารตามหมวดหมู่
  const filterByCategory = (category) => {
    let updatedCategories = [...selectedCategories];

    if (updatedCategories.includes(category)) {
      updatedCategories = updatedCategories.filter((c) => c !== category);
    } else {
      updatedCategories.push(category);
    }

    setSelectedCategories(updatedCategories);
  };

  //useEffect เพื่อกรองข้อมูลเมื่อ query หรือ selectedCategories เปลี่ยน
  useEffect(() => {
    let filtered = foods;

    // กรองตาม query ค้นชื่ออาหาร
    if (query) {
      filtered = filtered.filter((food) =>
        food.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    // กรองตามหมวดหมู่
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (food) => selectedCategories.includes(food.category?.name)
      );
    }

    setFilteredFoods(filtered);
  }, [query, selectedCategories, foods]);

  const handleCardClick = (id) => {
    navigate(`/food/${id}`);
  };

  
  return (
    <div className="search-results-container">
      <div className="search-header">
        <h1>ผลลัพธ์การค้นหา: {query}</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 ค้นหาชื่ออาหาร..."
            value={query}
            onChange={(e) => setSearchParams({ query: e.target.value })}
            className="search-input2"
          />
          <button className="search-button">🔍 ค้นหา</button>
        </div>
      </div>

      {/* หมวดหมู่ไปไว้ใต้ตัว*/}
      <div className="category-filter">
        <h2>📌 หมวดหมู่อาหาร</h2>
        <div className="category-list">
          {categories.map((cat) => (
            <label key={cat.id} className="category-checkbox">
              <input
                type="checkbox"
                value={cat.name}
                checked={selectedCategories.includes(cat.name)}
                onChange={() => filterByCategory(cat.name)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div className="search-content">
        <motion.div
          className="food-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence>
            {filteredFoods.length > 0 ? (
              filteredFoods.map((food, index) => (
                <motion.div
                  key={food.id}
                  className="food-card"
                  onClick={() => handleCardClick(food.id)}
                  style={{ cursor: "pointer" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <img
                    src={
                      food.images.length > 0
                        ? food.images[0].url
                        : "/no-image.png"
                    }
                    alt={food.title}
                    className="food-card-image"
                  />
                  <div className="food-card-content">
                    <h2 className="food-card-title">{food.title}</h2>
                    <p className="food-card-description">{food.description}</p>
                    <p>
                      <strong>แคลอรี่:</strong> {food.calorie} kcal
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.p
                className="mama"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ไม่พบอาหารที่ค้นหา
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
