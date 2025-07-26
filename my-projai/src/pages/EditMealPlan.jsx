import React, { useState, useEffect } from "react";
import useStoregobal from "../store/storegobal";
import { getMealPlanById, updateMealPlan, addMealPlanItem } from "../api/mealPlan";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const EditMealPlan = () => {
  const { id } = useParams(); // ดึง `id` จาก URL
  const navigate = useNavigate();
  const token = useStoregobal((state) => state.token);
  const foods = useStoregobal((state) => state.foods);
  const getFood = useStoregobal((state) => state.getFood);
  const editingMealPlan = useStoregobal((state) => state.editingMealPlan);
  const setEditingMealPlan = useStoregobal((state) => state.setEditingMealPlan);

  const [mealPlan, setMealPlan] = useState(editingMealPlan || null);
  const [mealPlanItems, setMealPlanItems] = useState([]);
  const [selectedMealTime, setSelectedMealTime] = useState("breakfast");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!mealPlan && token) {
      fetchMealPlan();
      getFood(token);
    }
  }, [token, getFood]);

  const fetchMealPlan = async () => {
    try {
      const res = await getMealPlanById(token, id);
      if (!res.data) {
        toast.error("⚠️ ไม่พบ Meal Plan");
        navigate("/meal-plans");
        return;
      }
      setMealPlan(res.data);
      setEditingMealPlan(res.data);
      setMealPlanItems(res.data.items);
    } catch (err) {
      toast.error("⚠️ ไม่สามารถโหลด Meal Plan");
      navigate("/meal-plans");
    }
  };

  const handleUpdateMealPlan = async () => {
    try {
      await updateMealPlan(token, id, { name: mealPlan.name });
      toast.success("อัปเดต Meal Plan สำเร็จ!");
      navigate("/meal-plans");
    } catch (err) {
      toast.error("⚠️ อัปเดต Meal Plan ไม่สำเร็จ");
    }
  };

  const handleAddFood = (food) => {
    setMealPlanItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.food.id === food.id && item.mealTime === selectedMealTime
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.food.id === food.id && item.mealTime === selectedMealTime
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { id: Date.now(), food, quantity: 1, mealTime: selectedMealTime }];
      }
    });
  };

  if (!mealPlan) return <p>กำลังโหลด...</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Sidebar ค้นหาอาหาร */}
        <div className="bg-gray-100 p-4 rounded-lg h-screen">
          <h2 className="text-xl font-bold mb-4">🔍 ค้นหาอาหาร</h2>
          <input
            type="text"
            placeholder="ค้นหาอาหาร..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* รายการอาหารทั้งหมด */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">🍽️ รายการอาหารทั้งหมด</h2>
          <div className="grid grid-cols-3 gap-4">
            {foods
              .filter((food) => food.title.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((food) => (
                <div key={food.id} className="border shadow-md rounded-lg p-3 bg-white flex flex-col items-center">
                  <img src={food.images?.[0]?.url || "/no-image.png"} alt={food.title} className="w-24 h-24 object-cover rounded-md border mb-2" />
                  <p className="text-sm font-semibold text-center">{food.title}</p>
                  <button onClick={() => handleAddFood(food)} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition duration-300 ease-in-out text-xs">
                    ➕ เพิ่ม
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Meal Plan ที่เลือก */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">🛒 แก้ไข Meal Plan</h2>
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            value={mealPlan.name}
            onChange={(e) => setMealPlan({ ...mealPlan, name: e.target.value })}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleUpdateMealPlan}>
            💾 บันทึกการแก้ไข
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMealPlan;