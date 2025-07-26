import React, { useEffect, useState } from "react";
import { createCategory, listCategory, removeCategory, } from "../../api/Category";
import useStoregobal from "../../store/storegobal";
import { toast } from "react-toastify";
import { Trash2 } from 'lucide-react';

const FormCategory = () => {
  const token = useStoregobal((state) => state.token);
  const [name, setName] = useState("");
  const categories = useStoregobal((state)=>state.categories)
  const getCategory = useStoregobal((state)=>state.getCategory)
  useEffect(() => {
    getCategory(token);
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      return toast.warning("Please fill data");
    }
    try {
      const res = await createCategory(token, { name });
      console.log(res.data.name);
      toast.success(`Add Category ${res.data.name} Success!!!`);
      getCategory(token)
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemove =  async (id) =>{

    console.log(id);
    try{
      const res = await removeCategory(token,id)
      console.log(res);
      toast.success(`Deleted ${res.data.name} Success`)
      getCategory(token)
      
    }catch(err){

    }    
  }
  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <h1>Category Management</h1>
      <form className="my-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setName(e.target.value)}
          className="border"
          type="text"
        />
        <button className="bg-blue-200">Add Category</button>
      </form>

      <hr />
      <ul className="list">
        {categories.map((item, index) => (
          <li className="flex justify-between my-2" key={index}>
            <span>
              {item.name}
            </span>

            <button
            className="bg-red-400 text-white px-3 py-1 rounded-md 
              hover:scale-105 hover:-translate-y-1 hover:duration-200 shadow-md"
            onClick={()=>handleRemove(item.id)}><Trash2 /> </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormCategory;
