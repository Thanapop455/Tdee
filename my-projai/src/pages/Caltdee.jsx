import React, { useState, useEffect } from "react";
import axios from "axios";
import { calculateTdee, getLatestTdee } from "../api/Tdee";
import useStoregobal from "../store/storegobal";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Caltdee = () => {
  const token = useStoregobal((state) => state.token);
  const [form, setForm] = useState({
    weight: "",
    height: "",
    age: "",
    gender: null,
  });

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [tdeeResult, setTdeeResult] = useState({ bmr: null, tdee: null });
  const [previousTdee, setPreviousTdee] = useState(null);
  const [showModal, setShowModal] = useState(false); // ใช้ state สำหรับ Modal
  const [tdeeHistory, setTdeeHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    if (token) {
      fetchLatestTdee();
    }
  }, [token]);

  const fetchLatestTdee = async () => {
    try {
      const res = await getLatestTdee(token);
      if (res.data) {
        setPreviousTdee(res.data.tdee);
      }
    } catch (err) {
      console.error("❌ Error fetching latest TDEE:", err);
    }
  };

  const activityLevels = {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9,
  };

  const activityOptions = [
    { id: 1, name: "Sedentary", description: "ไม่ออกกำลังกาย" },
    { id: 2, name: "Lightly active", description: "ออกกำลังกายเล็กน้อย" },
    { id: 3, name: "Moderately active", description: "ออกกำลังกายปานกลาง" },
    { id: 4, name: "Very active", description: "ออกกำลังกายหนัก" },
    { id: 5, name: "Extra active", description: "ออกกำลังกายหนักมาก" },
  ];

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const weight = parseFloat(form.weight);
    const height = parseFloat(form.height);
    const age = parseInt(form.age);

    if (age < 1 || age > 120) {
      toast.error("⚠️ อายุควรอยู่ระหว่าง 1 - 120 ปี");
      return;
    }
    if (weight <= 0) {
      toast.error("⚠️ น้ำหนักต้องมากกว่า 0 kg");
      return;
    }
    if (height < 1 || height > 250) {
      toast.error("⚠️ ส่วนสูงควรอยู่ระหว่าง 1 - 250 cm");
      return;
    }
    if (!form.gender || selectedActivity === null) {
      toast.error("⚠️ กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    let bmr =
      form.gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    let tdee = bmr * activityLevels[selectedActivity];

    Swal.fire({
      title: '<span style="font-size: 22px;">📊 <b>ผลลัพธ์ TDEE</b></span>',
      html: `
        <div style="text-align: left; font-size: 18px;">
          <p>🔥 <strong>ค่า BMR:</strong> 
            <span style="color: #FF5733; font-size: 20px;">
              ${bmr.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kcal
            </span>
          </p>
          <p>⚡ <strong>ค่า TDEE:</strong> 
            <span style="color: #FFC107; font-size: 20px;">
              ${tdee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kcal
            </span>
          </p>
        </div>
      `,
      confirmButtonText: "✅ ตกลง",
      confirmButtonColor: "#007BFF",
      customClass: {
        popup: "rounded-lg shadow-lg",
        title: "font-semibold",
        confirmButton: "px-4 py-2 rounded-md",
      },
    });
    

    toast.success("🎉 คำนวณ TDEE สำเร็จ!");

    if (token) {
      try {
        await calculateTdee(token, {
          weight,
          height,
          age,
          gender: form.gender,
          activityId: selectedActivity,
        });
        toast.success("บันทึกค่า TDEE ลงฐานข้อมูลสำเร็จ!");
        fetchLatestTdee();
      } catch (err) {
        console.error("❌ Error saving TDEE:", err);
        toast.error("⚠️ เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    }
  };

  const fetchTdeeHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/tdee/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTdeeHistory(res.data);
      setShowHistoryModal(true);
    } catch (err) {
      console.error("❌ ไม่สามารถดึงประวัติ TDEE ได้:", err);
      toast.error("ไม่สามารถดูประวัติได้ กรุณาLogin");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">คำนวณค่า TDEE</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="border p-2 w-full rounded"
          placeholder="น้ำหนัก (kg)"
          name="weight"
          value={form.weight}
          onChange={handleOnChange}
          type="number"
          required
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="ส่วนสูง (cm)"
          name="height"
          value={form.height}
          onChange={handleOnChange}
          type="number"
          required
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="อายุ"
          name="age"
          value={form.age}
          onChange={handleOnChange}
          type="number"
          required
        />

        <div className="flex space-x-4">
          <button
            type="button"
            className={`flex-1 border py-2 rounded ${
              form.gender === "male"
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-300"
            }`}
            onClick={() => setForm({ ...form, gender: "male" })}
          >
            ชาย
          </button>
          <button
            type="button"
            className={`flex-1 border py-2 rounded ${
              form.gender === "female"
                ? "bg-pink-500 text-white"
                : "bg-white hover:bg-gray-300"
            }`}
            onClick={() => setForm({ ...form, gender: "female" })}
          >
            หญิง
          </button>
        </div>

        <h2 className="text-lg font-bold mt-4">กิจกรรมในชีวิตประจำวัน</h2>

        {activityOptions.map((option) => (
          <div
            key={option.id}
            className={`p-3 border rounded mb-2 cursor-pointer transition-all ${
              selectedActivity === option.id
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-blue-200"
            }`}
            onClick={() => setSelectedActivity(option.id)}
          >
            <strong>{option.name}</strong>
            <p className="text-sm">{option.description}</p>
          </div>
        ))}

        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4">
          คำนวณ
        </button>
        <button
          type="button"
          className="bg-gray-300 text-black px-4 py-2 rounded w-full mt-2"
          onClick={() => fetchTdeeHistory()}
        >
          📜 ดูประวัติ TDEE
        </button>
      </form>

      {/* ✅ Modal แสดงผลลัพธ์ */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-2">📊 ผลลัพธ์ TDEE</h2>
            <p className="text-lg">🔥 ค่า BMR: {tdeeResult.bmr} kcal</p>
            <p className="text-lg">⚡ ค่า TDEE: {tdeeResult.tdee} kcal</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => setShowModal(false)}
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {showHistoryModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          onClick={() => setShowHistoryModal(false)} // ✅ คลิกพื้นหลังเพื่อปิด
        >
          <div
            className="bg-white p-6 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // ✅ ไม่ให้ปิดเมื่อคลิกเนื้อหา
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              📜 ประวัติการคำนวณ TDEE
            </h2>
            {tdeeHistory.length > 0 ? (
              <ul className="space-y-3">
                {tdeeHistory.map((item, idx) => (
                  <li key={idx} className="border p-3 rounded shadow-sm">
                    <p>
                      <strong>📅 วันที่:</strong>{" "}
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>🔥 BMR:</strong>{" "}
                      {(item.tdee / item.activity.multiplier).toFixed(2)} kcal
                    </p>
                    <p>
                      <strong>⚡ TDEE:</strong> {item.tdee} kcal
                    </p>
                    <p>
                      <strong>กิจกรรม:</strong> {item.activity.name}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">ไม่มีประวัติการคำนวณ</p>
            )}

            <button
              className="mt-4 w-full bg-red-500 text-white py-2 rounded"
              onClick={() => setShowHistoryModal(false)}
            >
              ❌ ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Caltdee;
