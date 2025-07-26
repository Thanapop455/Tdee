import axios from "axios";

const API_URL = "http://localhost:5001/api";

//ข้อมูล Meal Plan ทั้งหมด
export const getMealPlans = async (token) => {
  return await axios.get(`${API_URL}/user/meal-plans`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//สร้าง Meal Plan ใหม่
export const createMealPlan = async (token, mealPlanData) => {
  return await axios.post(`${API_URL}/user/meal-plan`, mealPlanData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//ลบ Meal Plan
export const deleteMealPlan = async (token, mealPlanId) => {
  return axios.delete(`http://localhost:5001/api/meal-plan/${mealPlanId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//อัปเดตชื่อ Meal Plan (เพิ่มเข้ามาใหม่)
export const updateMealPlan = async (token, mealPlanId, updatedData) => {
  return await axios.put(`http://localhost:5001/api/meal-plan/${mealPlanId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


//ดึงรายการอาหารใน Meal Plan
export const getMealPlanItems = async (token, mealPlanId) => {
  return await axios.get(`${API_URL}/meal-plan/${mealPlanId}/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//เพิ่มอาหารเข้า Meal Plan
export const addMealPlanItem = async (token, mealPlanItemData) => {
  return await axios.post(`${API_URL}/meal-plan/${mealPlanItemData.mealPlanId}/items`, mealPlanItemData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//ลบอาหารออกจาก Meal Plan
export const deleteMealPlanItem = async (token, id) => {
  return await axios.delete(`${API_URL}/meal-plan/item/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMealPlanById = async (token, id) => {
  return axios.get(`http://localhost:5001/api/meal-plans/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ เพิ่มฟังก์ชัน updateMealPlanItem
export const updateMealPlanItem = async (token, mealPlanItemId, updatedData) => {
  return await axios.put(
    `http://localhost:5001/api/meal-plan/item/${mealPlanItemId}`,
    updatedData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
