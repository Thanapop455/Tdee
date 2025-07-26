import React, { useState, useEffect } from "react";
import useStoregobal from "../../store/storegobal";
import { createFood, deleteFood } from "../../api/Food";
import { toast } from "react-toastify";
import Uploadfile from "./Uploadfile";
import { Link } from "react-router-dom";
import { LucideTrash, PencilLine, Trash, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const initialState = {
  title: "",
  description: "",
  calorie: 0,
  fat: 0,
  carbohydrate: 0,
  protein: 0,
  servingSize: "",
  source:"",
  categoryId: "",
  images: []
};

const FormFood = () => {  
  const token = useStoregobal((state) => state.token);
  const getCategory = useStoregobal((state) => state.getCategory);
  const categories = useStoregobal((state) => state.categories);
  const getFood = useStoregobal((state) => state.getFood);
  const foods = useStoregobal((state) => state.foods);

  const [form, setForm] = useState({
    title: "",
    description: "",
    calorie: "",
    fat: "",
    carbohydrate: "",
    protein: "",
    servingSize: "",
    source:"",
    categoryId: "",
    images: []
  });

  useEffect(() => {
    getCategory(token)
    getFood(token)
  }, [])

  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createFood(token, form);
      console.log(res);
      setForm(initialState)
      getFood(token);
      toast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`);
    } catch (err) {
      console.log(err);
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
          const res = await deleteFood(token, id);
          console.log(res);
          toast.success(" ลบอาหารเรียบร้อยแล้ว!");
          getFood(token);
        } catch (err) {
          console.error(" Error:", err);
          toast.error("⚠️ เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      }
    });
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <form onSubmit={handleSubmit}>
        <h1>เพิ่มข้อมูลอาหาร</h1>
        <input
          className="border"
          value={form.title}
          onChange={handleOnChange}
          placeholder="Title"
          name="title"
          required
        />
        <input
          className="border"
          value={form.description}
          onChange={handleOnChange}
          placeholder="Description"
          name="description"
        />
        <input
          type="number"
          className="border"
          value={form.calorie}
          onChange={handleOnChange}
          placeholder="Calorie"
          name="calorie"
          required
        />
        <input
          type="number"
          className="border"
          value={form.fat}
          onChange={handleOnChange}
          placeholder="Fat"
          name="fat"
          required
        />
        <input
          type="number"
          className="border"
          value={form.carbohydrate}
          onChange={handleOnChange}
          placeholder="Carbohydrate"
          name="carbohydrate"
          required
        />
        <input
          type="number"
          className="border"
          value={form.protein}
          onChange={handleOnChange}
          placeholder="Protein"
          name="protein"
          required
        />
        <input
          className="border"
          value={form.servingSize}
          onChange={handleOnChange}
          placeholder="ServingSize"
          name="servingSize"
          required
        />
        <input
          className="border"
          value={form.source}
          onChange={handleOnChange}
          placeholder="แหล่งที่มา"
          name="source"
        />
        <select
          className="border"
          name="categoryId"
          onChange={handleOnChange}
          required
          value={form.categoryId}
        >
          <option value="" disabled>
            Please Select
          </option>
          {categories.map((item, index) => (
            <option key={index} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <hr />

        <Uploadfile form={form} setForm={setForm} />

        <button className="bg-blue-500 mt-4 mb-5 p-1">เพิ่มเมนู</button>
        <hr />
        <br />

        <table className="table border-separate border-spacing-2 w-full">
  <thead>
    <tr className="bg-gray-200">
      <th className="px-4 py-2">No.</th>
      <th className="px-4 py-2">รูปภาพ</th>
      <th className="px-4 py-2">ชื่ออาหาร</th>
      <th className="px-4 py-2">หมวดหมู่</th>
      <th className="px-4 py-2">แคลลอรี่</th>
      <th className="px-4 py-2">Fat</th>
      <th className="px-4 py-2">Protein</th>
      <th className="px-4 py-2">carbohydrate</th>
      <th className="px-4 py-2">servingSize</th>
      <th className="px-4 py-2">การจัดการ</th>
    </tr>
  </thead>
  <tbody>
    {foods.map((item, index) => {
      return (
        <tr key={index} className="hover:bg-gray-100">
          <td className="px-4 py-2 text-center">{index + 1}</td>
          <td className="px-4 py-2 text-center">
            {item.images.length > 0 ? (
              <img
                className="w-24 h-24 rounded-lg shadow-md"
                src={item.images[0].url}
                alt={item.title}
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center shadow-sm">
                No Image
              </div>
            )}
          </td>
          <td className="px-4 py-2">{item.title}</td>
          <td className="px-4 py-2 text-center">{item.category?.name || "ไม่มีหมวดหมู่"}</td>
          <td className="px-4 py-2 text-center">{item.calorie}</td>
          <td className="px-4 py-2 text-center">{item.fat}</td>
          <td className="px-4 py-2 text-center">{item.protein}</td>
          <td className="px-4 py-2 text-center">{item.carbohydrate}</td>
          <td className="px-4 py-2 text-center" >{item.servingSize}</td>
          <td className="px-4 py-2 flex justify-around">
            <p className="bg-green-400 text-white px-3 py-1 rounded-md 
            hover:scale-105 hover:-translate-y-1 hover:duration-200 shadow-md">
              <Link to={`/admin/food/${item.id}`}>
              <PencilLine />
              </Link>
            </p>
            <p
              className="bg-red-400 text-white px-3 py-1 rounded-md 
              hover:scale-105 hover:-translate-y-1 hover:duration-200 shadow-md"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 />
            </p>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
      </form>
    </div>
  );
};

export default FormFood;
