import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { readFood } from "../api/Food";
import useStoregobal from "../store/storegobal";
import "./FoodDetails.css";

export default function FoodDetails() {
  const { id } = useParams();
  const token = useStoregobal((state) => state.token);
  const [food, setFood] = useState(null);
  const [serving, setServing] = useState(1);

  useEffect(() => {
    fetchFoodDetails();
  }, []);

  const fetchFoodDetails = async () => {
    try {
      const res = await readFood(token, id);
      setFood(res.data);
    } catch (err) {
      console.error("Error fetching food details:", err);
    }
  };

  const handleServingChange = (value) => {
    setServing((prev) => Math.max(1, prev + value));
  };

  return (
    <div className="food-details-container">
      {food ? (
        <>
          <div className="food-header">
            <img
              src={
                food.images.length > 0 ? food.images[0].url : "/no-image.png"
              }
              alt={food.title}
              className="food-image"
            />
            <div className="food-info">
              <h1>{food.title}</h1>
              <h2 className="calorie-count">
                {food.calorie * serving} <span>Calories</span>
              </h2>

              <div className="serving-controls">
                <button onClick={() => handleServingChange(-1)}>-</button>
                <span>{serving}</span>
                <button onClick={() => handleServingChange(1)}>+</button>
              </div>
            </div>
          </div>

          <div className="food-details-content">
            {/* 🔥 วิธีเผาผลาญ */}
            <div className="burning-methods">
              <h3>วิธีการเผาผลาญ {food.calorie * serving} แคลอรี่</h3>
              <div className="burning-grid">
                <div className="burning-card">
                  <span className="icon">🚶</span>
                  <span className="text">เดิน</span>
                  <span className="minutes">
                    {Math.ceil((food.calorie * serving) / 3)} นาที
                  </span>
                </div>
                <div className="burning-card">
                  <span className="icon">🚴</span>
                  <span className="text">ปั่นจักรยาน</span>
                  <span className="minutes">
                    {Math.ceil((food.calorie * serving) / 5)} นาที
                  </span>
                </div>
                <div className="burning-card">
                  <span className="icon">🏃</span>
                  <span className="text">วิ่ง</span>
                  <span className="minutes">
                    {Math.ceil((food.calorie * serving) / 6)} นาที
                  </span>
                </div>
                <div className="burning-card">
                  <span className="icon">🏊</span>
                  <span className="text">ว่ายน้ำ</span>
                  <span className="minutes">
                    {Math.ceil((food.calorie * serving) / 9)} นาที
                  </span>
                </div>
              </div>
            </div>

            {/* 🔹 ข้อมูลโภชนาการ */}
            <div className="nutrition-container">
              <h3 className="nutrition-title">ข้อมูลโภชนาการ</h3>
              <p className="nutrition-food-name">{food.title}</p>
              <p className="nutrition-serving">
                ปริมาณของอาหาร: {food.servingSize}
              </p>

              <hr className="divider" />

              <p className="nutrition-label">คุณค่าทางอาหารที่ได้รับ</p>
              <div className="nutrition-content">
                <div className="nutrition-item">
                  <span>Calories</span>
                  <span className="nutrition-value">
                    {food.calorie * serving}
                  </span>
                </div>
                <div className="nutrition-item">
                  <span>Fat</span>
                  <span className="nutrition-value">
                    {(food.fat * serving).toFixed(1)} g
                  </span>
                </div>
                <div className="nutrition-item">
                  <span>Carbohydrate</span>
                  <span className="nutrition-value">
                    {(food.carbohydrate * serving).toFixed(1)} g
                  </span>
                </div>
                <div className="nutrition-item">
                  <span>Protein</span>
                  <span className="nutrition-value">
                    {(food.protein * serving).toFixed(1)} g
                  </span>
                </div>
              </div>

              <p className="nutrition-note">
                *ปริมาณแนะนำต่อวันสำหรับคนทั่วไปอยู่ที่ 2,000 กิโลแคลอรี่
              </p>

              <hr className="divider" />

              <p className="nutrition-source">
                แหล่งที่มา: {food.source || "ไม่มีข้อมูล"}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p>กำลังโหลด...</p>
      )}
    </div>
  );
}
