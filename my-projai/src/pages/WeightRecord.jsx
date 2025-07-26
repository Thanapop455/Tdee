import React, { useEffect, useState } from "react";
import {
  getWeightRecords,
  addWeightRecord,
  updateWeightRecord,
  deleteWeightRecord,
} from "../api/weightRecord";
import useStoregobal from "../store/storegobal";
import { toast } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const WeightRecord = () => {
  const token = useStoregobal((state) => state.token);
  const [weights, setWeights] = useState([]);
  const [newWeight, setNewWeight] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showModal, setShowModal] = useState(false);
  const [editingWeight, setEditingWeight] = useState(null);

  useEffect(() => {
    if (token) fetchWeights();
  }, [token]);

  const fetchWeights = async () => {
    try {
      const data = await getWeightRecords(token);
      setWeights(data);
    } catch (err) {
      toast.error("❌ โหลดข้อมูลน้ำหนักไม่สำเร็จ");
    }
  };

  const handleSaveWeight = async () => {
    if (!newWeight || isNaN(parseFloat(newWeight))) {
      return toast.error("⚠️ กรุณากรอกน้ำหนักให้ถูกต้อง");
    }
    if (!selectedDate || isNaN(Date.parse(selectedDate))) {
      return toast.error("⚠️ กรุณาเลือกวันที่วัดค่า");
    }

    try {
      if (editingWeight) {
        await updateWeightRecord(
          token,
          editingWeight.id,
          parseFloat(newWeight)
        );
        toast.success("แก้ไขน้ำหนักสำเร็จ!");
      } else {
        await addWeightRecord(token, parseFloat(newWeight), selectedDate);
        toast.success("บันทึกน้ำหนักสำเร็จ!");
      }

      setNewWeight("");
      setShowModal(false);
      setEditingWeight(null);
      fetchWeights();
    } catch (err) {
      console.error("Error saving weight record:", err);
      toast.error("❌ ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  const handleDeleteWeight = async (id) => {
    try {
      await deleteWeightRecord(token, id);
      toast.success("ลบน้ำหนักสำเร็จ!");
      fetchWeights();
    } catch (err) {
      toast.error("❌ ไม่สามารถลบข้อมูลได้");
    }
  };

  const handleEditWeight = (record) => {
    setEditingWeight(record);
    setNewWeight(record.weight);
    setSelectedDate(record.recordedAt.split("T")[0]);
    setShowModal(true);
  };
  // เรียงข้อมูลใหม่ ให้ล่าสุดอยู่ที่ index 0
  const sortedWeights = [...weights].sort(
    (a, b) => new Date(b.recordedAt) - new Date(a.recordedAt)
  );

  const latestWeight = sortedWeights.length > 0 ? sortedWeights[0].weight : "-";
  const previousWeight =
    sortedWeights.length > 1 ? sortedWeights[1].weight : latestWeight;
  const totalChange =
    sortedWeights.length > 1
      ? latestWeight - sortedWeights[sortedWeights.length - 1].weight
      : 0;

  const weightChange = latestWeight - previousWeight;

  const chartData = {
    labels: weights.map((w) =>
      new Date(w.recordedAt).toLocaleDateString("th-TH")
    ),
    datasets: [
      {
        label: "น้ำหนัก (kg)",
        data: weights.map((w) => w.weight),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      {/* ส่วนแสดงสรุปข้อมูล */}
      <div className="grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-lg shadow">
        <div className="text-center">
          <h3 className="text-xl font-bold">{latestWeight} kg</h3>
          <p className="text-gray-500">ล่าสุด</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">
            {weightChange >= 0 ? `+${weightChange}` : weightChange} kg
          </h3>
          <p className="text-gray-500 text-xs">(กิโลกรัม)</p>
          <p className="text-blue-500">จากครั้งก่อนหน้า</p>
          <p className="text-gray-500 text-xs">โดยคำนวณจาก</p>
          <p className="text-gray-500 text-xs">น้ำหนักล่าสุด - นำ้หนักครั้งก่อน</p>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">
            {totalChange >= 0 ? `+${totalChange}` : totalChange} kg
          </h3>
          
          <p className="text-gray-500 text-xs">(กิโลกรัม)</p>
          <p className="text-blue-500">เปลี่ยนแปลงรวม</p>
          <p className="text-gray-500 text-xs">โดยคำนวณจาก</p>
          <p className="text-gray-500 text-xs">น้ำหนักล่าสุด - นำ้หนักเริ่มต้น</p>
        </div>
      </div>

      {/* ปุ่มเพิ่มข้อมูล */}
      <div className="mt-4">
        <button
          onClick={() => {
            setEditingWeight(null); // รีเซ็ตค่า
            setNewWeight(""); // รีเซ็ตค่าน้ำหนัก
            setSelectedDate(new Date().toISOString().split("T")[0]); // ตั้งค่าวันที่เป็นวันนี้
            setShowModal(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          ➕ เพิ่มข้อมูล
        </button>
      </div>

      {/* โมดัลเพิ่ม/แก้ไขข้อมูล */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              {editingWeight ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
            </h3>
            <label className="block mb-2">วันที่วัดค่า</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <label className="block mb-2">น้ำหนัก (kg)</label>
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                ปิด
              </button>
              <button
                onClick={handleSaveWeight}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {editingWeight ? "บันทึกการแก้ไข" : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* แสดงกราฟ */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">ข้อมูลน้ำหนัก</h2>
        <div style={{ width: "100%", height: "300px" }}>
          <Line data={chartData} />
        </div>

        {/* ตารางข้อมูล */}
        <table className="mt-4 w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ครั้งที่</th>
              <th className="border border-gray-300 p-2">วันที่</th>
              <th className="border border-gray-300 p-2">น้ำหนัก (kg)</th>
              <th className="border border-gray-300 p-2">แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            {weights.map((record, index) => (
              <tr key={record.id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  {new Date(record.recordedAt).toLocaleDateString("th-TH")}
                </td>
                <td className="border p-2">{record.weight}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEditWeight(record)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    ✏ แก้ไข
                  </button>
                  <button
                    onClick={() => handleDeleteWeight(record.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    ❌ ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeightRecord;
