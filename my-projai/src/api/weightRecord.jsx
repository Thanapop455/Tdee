import axios from "axios";

const API_URL = "http://localhost:5001/api/weights"; // เปลี่ยนตาม Backend จริง

// ✅ ดึงข้อมูลน้ำหนักทั้งหมด
export const getWeightRecords = async (token) => {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching weight records:", err);
    throw err;
  }
};

// ✅ เพิ่มข้อมูลน้ำหนักใหม่
export const addWeightRecord = async (token, weight, recordedAt) => {
  try {
    const res = await axios.post(
      API_URL,
      { weight, recordedAt }, // ✅ เพิ่ม recordedAt
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error adding weight record:", err);
    throw err;
  }
};


// ✅ แก้ไขข้อมูลน้ำหนัก
export const updateWeightRecord = async (token, id, weight) => {
  try {
    const res = await axios.put(
      API_URL,
      { id, weight },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error updating weight record:", err);
    throw err;
  }
};

// ✅ ลบข้อมูลน้ำหนัก
export const deleteWeightRecord = async (token, id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting weight record:", err);
    throw err;
  }
};
