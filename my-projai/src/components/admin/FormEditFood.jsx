import React, { useState, useEffect } from "react";
import useStoregobal from "../../store/storegobal";
import { createFood, readFood, listFood, updateFood } from "../../api/Food";
import { toast } from "react-toastify";
import Uploadfile from "./Uploadfile";
import { useParams, useNavigate } from "react-router-dom";

const initialState = {
  title: "",
  description: "",
  calorie: "",
  fat: "",
  carbohydrate: "",
  protein: "",
  servingSize: "",
  source:"",
  categoryId: "",
  images: [],
};

const FormEditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate()

  const token = useStoregobal((state) => state.token);
  const getCategory = useStoregobal((state) => state.getCategory);
  const categories = useStoregobal((state) => state.categories);

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    getCategory(token);
    fetchFood(token, id);
  }, [token, id ]);

  const fetchFood = async (token, id) => {
    try {
      const res = await readFood(token, id);
      console.log("res from backend", res);
      setForm(res.data);
    } catch (err) {
      console.log("Err fetch data", err);
    }
  };
    
  console.log(form);

  const handleOnChange = (e) => {
    console.log(e.target.name, e.target.value);
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateFood(token, id, form);
      console.log(res)
      toast.success(`เพิ่มข้อมูล ${res.data.title} สำเร็จ`);
      navigate('/admin/food')
    } catch (err) {
      console.log(err);
    }
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
        />
        <input
          type="number"
          className="border"
          value={form.fat}
          onChange={handleOnChange}
          placeholder="Fat"
          name="fat"
        />
        <input
          type="number"
          className="border"
          value={form.carbohydrate}
          onChange={handleOnChange}
          placeholder="Carbohydrate"
          name="carbohydrate"
        />
        <input
          type="number"
          className="border"
          value={form.protein}
          onChange={handleOnChange}
          placeholder="Protein"
          name="protein"
        />
        <input
          className="border"
          value={form.servingSize}
          onChange={handleOnChange}
          placeholder="ServingSize"
          name="servingSize"
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

        <button className="bg-blue-500 mt-4 mb-5 p-1">แก้ไขสินค้า</button>
        <hr />
        <br />
      </form>
    </div>
  );
};

export default FormEditFood;
