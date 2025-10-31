import React, { useState, useEffect } from "react";
import useStoregobal from "../../store/storegobal";
import { createFood, deleteFood } from "../../api/Food";
import { toast } from "react-toastify";
import Uploadfile from "./Uploadfile";
import { Link } from "react-router-dom";
import { PencilLine, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const initialState = {
  title: "",
  description: "",
  calorie: "",
  fat: "",
  carbohydrate: "",
  protein: "",
  servingSize: "",
  source: "",
  categoryId: "",
  images: [],
};

const FormFood = () => {
  const token = useStoregobal((state) => state.token);
  const getCategory = useStoregobal((state) => state.getCategory);
  const categories = useStoregobal((state) => state.categories);
  const getFood = useStoregobal((state) => state.getFood);
  const foods = useStoregobal((state) => state.foods);

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    getCategory(token);
    getFood(token);
  }, []);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createFood(token, form);
      setForm(initialState);
      getFood(token);
      toast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`);
    } catch (err) {
      console.log(err);
      toast.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "⚠️ ยืนยันการลบ?",
      text: "คุณต้องการลบเมนูนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "🗑️ ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteFood(token, id);
          toast.success("ลบอาหารเรียบร้อยแล้ว!");
          getFood(token);
        } catch (err) {
          console.error("Error:", err);
          toast.error("⚠️ เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      }
    });
  };

  return (
    <div className="container mx-auto p-6">
      {/* ฟอร์มเพิ่มอาหาร */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100"
      >
        <h1 className="mb-4 text-xl font-semibold text-gray-800">
          ➕ เพิ่มข้อมูลอาหาร
        </h1>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            className="rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
            value={form.title}
            onChange={handleOnChange}
            placeholder="ชื่ออาหาร"
            name="title"
            required
          />
          <input
            className="rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
            value={form.servingSize}
            onChange={handleOnChange}
            placeholder="Serving Size (เช่น 100 g)"
            name="servingSize"
            required
          />
          <input
            type="number"
            className="rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
            value={form.calorie}
            onChange={handleOnChange}
            placeholder="Calorie (kcal)"
            name="calorie"
            required
          />
          <input
            type="number"
            className="rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
            value={form.protein}
            onChange={handleOnChange}
            placeholder="Protein (g)"
            name="protein"
            required
          />
          <input
            type="number"
            className="rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
            value={form.carbohydrate}
            onChange={handleOnChange}
            placeholder="Carbohydrate (g)"
            name="carbohydrate"
            required
          />
          <input
            type="number"
            className="rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
            value={form.fat}
            onChange={handleOnChange}
            placeholder="Fat (g)"
            name="fat"
            required
          />
          <input
            className="col-span-2 rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
            value={form.description}
            onChange={handleOnChange}
            placeholder="คำอธิบาย"
            name="description"
          />
          <input
            className="col-span-2 rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
            value={form.source}
            onChange={handleOnChange}
            placeholder="แหล่งที่มา"
            name="source"
          />
          <select
            className="rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-100"
            name="categoryId"
            onChange={handleOnChange}
            required
            value={form.categoryId}
          >
            <option value="" disabled>
              เลือกหมวดหมู่
            </option>
            {categories.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <Uploadfile form={form} setForm={setForm} />
        </div>

        <button
          className="mt-6 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow hover:bg-blue-700"
          type="submit"
        >
        เพิ่มเมนู
        </button>
      </form>

      {/* ตารางแสดงอาหาร */}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">No.</th>
              <th className="px-4 py-3">รูปภาพ</th>
              <th className="px-4 py-3">ชื่ออาหาร</th>
              <th className="px-4 py-3">หมวดหมู่</th>
              <th className="px-4 py-3">พลังงาน</th>
              <th className="px-4 py-3">โปรตีน</th>
              <th className="px-4 py-3">คาร์บ</th>
              <th className="px-4 py-3">ไขมัน</th>
              <th className="px-4 py-3">Serving</th>
              <th className="px-4 py-3">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((item, index) => (
              <tr
                key={index}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-center">{index + 1}</td>
                <td className="px-4 py-3 text-center">
                  {item.images.length > 0 ? (
                    <img
                      className="mx-auto h-16 w-16 rounded-lg object-cover shadow"
                      src={item.images[0].url}
                      alt={item.title}
                    />
                  ) : (
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200 text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3 text-center">
                  {item.category?.name || "ไม่มีหมวดหมู่"}
                </td>
                <td className="px-4 py-3 text-center">{item.calorie}</td>
                <td className="px-4 py-3 text-center">{item.protein}</td>
                <td className="px-4 py-3 text-center">{item.carbohydrate}</td>
                <td className="px-4 py-3 text-center">{item.fat}</td>
                <td className="px-4 py-3 text-center">{item.servingSize}</td>
                <td className="flex items-center justify-center gap-2 px-4 py-3">
                  <Link
                    to={`/admin/food/${item.id}`}
                    className="rounded-md bg-green-500 p-2 text-white shadow hover:bg-green-600"
                  >
                    <PencilLine className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-md bg-red-500 p-2 text-white shadow hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
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

export default FormFood;
