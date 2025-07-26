import React, { useState, useEffect } from "react";
import useStoregobal from "../store/storegobal";
import {
  getMealPlans,
  createMealPlan,
  addMealPlanItem,
  deleteMealPlan,
} from "../api/mealPlan";
import { getLatestTdee } from "../api/Tdee";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./MealPlan.css";

const MealPlan = () => {
  const token = useStoregobal((state) => state.token);
  const foods = useStoregobal((state) => state.foods);
  const getFood = useStoregobal((state) => state.getFood);
  const getTdee = useStoregobal((state) => state.getTdee);
  const tdees = useStoregobal((state) => state.tdees);

  const [mealPlans, setMealPlans] = useState([]);
  const [mealPlanItems, setMealPlanItems] = useState([]);
  const [selectedMealTime, setSelectedMealTime] = useState("breakfast");
  const [mealPlanName, setMealPlanName] = useState("");
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [latestTdee, setLatestTdee] = useState(null);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [goal, setGoal] = useState("maintain");
  const categories = useStoregobal((state) => state.categories);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    console.log("📊 Debug Meal Plan Items:", selectedMealPlan?.items);
  }, [selectedMealPlan]);

  useEffect(() => {
    if (token) {
      fetchMealPlans();
      fetchLatestTdee();
      getFood(token);
      getTdee(token);
    }
  }, [token, getFood, getTdee]);

  const fetchLatestTdee = async () => {
    try {
      const res = await getLatestTdee(token);
      console.log("📊 ค่า TDEE ที่ดึงมา:", res.data);

      if (res.data && res.data.length > 0) {
        const tdeeValue = res.data[0].tdee; // ดึงค่าจาก Array
        console.log("🛠 กำหนดค่า latestTdee:", tdeeValue);
        setLatestTdee(tdeeValue);
      } else {
        console.warn("⚠️ ไม่พบค่า TDEE ใช้ค่าเริ่มต้น 2000");
        setLatestTdee(2000);
      }
    } catch (err) {
      console.error("❌ Error fetching TDEE:", err);
      setLatestTdee(2000);
    }
  };

  const fetchMealPlans = async () => {
    try {
      const res = await getMealPlans(token);
      console.log("📊 Meal Plans ที่โหลด:", res.data);

      // ต้องแน่ใจว่า `items` รวมอยู่ในแผนอาหาร
      setMealPlans(res.data?.mealPlans || []);
    } catch (err) {
      console.error("❌ Error fetching meal plans:", err);
    }
  };

  const filterByCategory = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleCreateMealPlan = () => {
    setMealPlanName("");
    setMealPlanItems([]);
    setStep(2); // ไปที่หน้าสร้าง Meal Plan
  };

  const handleDeleteMealPlan = async (planId, event) => {
    event.stopPropagation(); // ❌ ป้องกันการไปเรียก toggleMealPlan(plan)

    const result = await Swal.fire({
      title: "⚠️ ยืนยันการลบ?",
      text: "คุณต้องการลบ Meal Plan นี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "🗑 ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        // ถ้ากำลังดูแผนนี้อยู่ ให้ปิดก่อน
        if (selectedMealPlan?.id === planId) {
          setSelectedMealPlan(null);
        }

        await deleteMealPlan(token, planId);
        toast.success("ลบ Meal Plan สำเร็จ!");
        fetchMealPlans();
      } catch (err) {
        console.error("❌ Error deleting Meal Plan:", err);
        toast.error("❌ ไม่สามารถลบ Meal Plan ได้");
      }
    }
  };

  const handleConfirmMealPlan = async () => {
    if (!mealPlanName.trim()) {
      toast.error("⚠️ กรุณาตั้งชื่อ Meal Plan ก่อนกดตกลง!");
      return;
    }

    try {
      const newPlan = { name: mealPlanName, dailyCalorie: latestTdee };
      const res = await createMealPlan(token, newPlan);
      const createdMealPlan = res.data;

      for (const item of mealPlanItems) {
        await addMealPlanItem(token, {
          mealPlanId: createdMealPlan.id,
          foodId: item.food.id,
          mealTime: item.mealTime, // ส่งค่า mealTime ไปยัง API
          quantity: item.quantity,
        });
      }

      toast.success("Meal Plan บันทึกเรียบร้อย!");
      setMealPlanItems([]);
      setMealPlanName("");
      setStep(1);
      fetchMealPlans();
    } catch (err) {
      console.error("❌ Error creating meal plan:", err);
      toast.error("❌ ไม่สามารถสร้าง Meal Plan");
    }
  };

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(food.category?.name);
    return matchesSearch && matchesCategory;
  });

  const [nutrients, setNutrients] = useState({
    adjustedTdee: latestTdee,
    remainingProtein: 0,
    remainingFat: 0,
    remainingCarbs: 0,
    remainingTdee: 0,
  });

  // คำนวณค่าทุกอย่างใน useEffect ตัวเดียว
  useEffect(() => {
    if (!latestTdee) return;

    let adjustedTdee = latestTdee;
    if (goal === "cut") adjustedTdee -= 500;
    if (goal === "bulk") adjustedTdee += 300;

    const userWeight = tdees.length > 0 ? tdees[0].user.weight : 0;
    const protein = goal === "bulk" ? userWeight * 2.2 : userWeight * 1.6;
    const fat = (adjustedTdee * 0.25) / 9;
    const carbs = (adjustedTdee - (protein * 4 + fat * 9)) / 4;

    let totalProtein = 0,
      totalFat = 0,
      totalCarbs = 0,
      totalCalories = 0;

    mealPlanItems.forEach((item) => {
      totalProtein += item.food.protein * item.quantity;
      totalFat += item.food.fat * item.quantity;
      totalCarbs += item.food.carbohydrate * item.quantity;
      totalCalories += item.food.calorie * item.quantity;
    });

    setNutrients({
      adjustedTdee,
      remainingProtein: protein - totalProtein,
      remainingFat: fat - totalFat,
      remainingCarbs: carbs - totalCarbs,
      remainingTdee: adjustedTdee - totalCalories,
    });
  }, [goal, latestTdee, tdees, mealPlanItems]);

  const groupedMealItems = mealPlanItems.reduce((acc, item) => {
    if (!acc[item.mealTime]) {
      acc[item.mealTime] = [];
    }
    acc[item.mealTime].push(item);
    return acc;
  }, {});

  useEffect(() => {
    if (!selectedMealPlan) return;

    let totalProtein = 0,
      totalFat = 0,
      totalCarbs = 0,
      totalCalories = 0;

    selectedMealPlan.items.forEach((item) => {
      totalProtein += item.food.protein * item.quantity;
      totalFat += item.food.fat * item.quantity;
      totalCarbs += item.food.carbohydrate * item.quantity;
      totalCalories += item.food.calorie * item.quantity;
    });

    // คำนวณค่าเกิน
    const exceededCalories =
      totalCalories > latestTdee ? totalCalories - latestTdee : 0;
    const exceededProtein =
      totalProtein > nutrients.remainingProtein
        ? totalProtein - nutrients.remainingProtein
        : 0;
    const exceededFat =
      totalFat > nutrients.remainingFat ? totalFat - nutrients.remainingFat : 0;
    const exceededCarbs =
      totalCarbs > nutrients.remainingCarbs
        ? totalCarbs - nutrients.remainingCarbs
        : 0;

    setExceededNutrients({
      exceededCalories: exceededCalories.toFixed(1),
      exceededProtein: exceededProtein.toFixed(1),
      exceededFat: exceededFat.toFixed(1),
      exceededCarbs: exceededCarbs.toFixed(1),
    });

    setNutrients({
      totalCalories,
      totalProtein,
      totalFat,
      totalCarbs,
    });
  }, [selectedMealPlan, latestTdee]);

  const [exceededNutrients, setExceededNutrients] = useState({
    exceededCalories: 0,
    exceededProtein: 0,
    exceededFat: 0,
    exceededCarbs: 0,
  });

  // เมื่อเพิ่มอาหาร

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
        return [
          ...prevItems,
          { id: Date.now(), food, quantity: 1, mealTime: selectedMealTime },
        ];
      }
    });
  };

  // เมื่อกดลบอาหาร
  const handleRemoveFood = (id) => {
    setMealPlanItems((prevItems) => {
      const newItems = prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      return newItems;
    });

    setTimeout(() => {
      updateRemainingNutrients(); // 🛠 เรียกอัปเดตค่าหลังจาก State อัปเดตแล้ว
    }, 100);
  };

  const handleIncreaseQuantity = (foodId) => {
    setMealPlanItems((prevItems) =>
      prevItems.map((item) =>
        item.food.id === foodId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (foodId) => {
    setMealPlanItems(
      (prevItems) =>
        prevItems
          .map((item) =>
            item.food.id === foodId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0) // ลบออกถ้าจำนวนเป็น 0
    );
  };

  const translateMealTime = (mealTime) => {
    const mapping = {
      breakfast: "เช้า",
      lunch: "กลางวัน",
      dinner: "เย็น",
    };
    return mapping[mealTime] || mealTime; // ถ้าไม่เจอ ใช้ค่าต้นฉบับ
  };

  const toggleMealPlan = async (plan) => {
    if (selectedMealPlan?.id === plan.id) {
      setSelectedMealPlan(null);
      return;
    }

    try {
      // สร้าง mapping ของอาหารจาก foods
      const foodMap = {};
      foods.forEach((food) => {
        foodMap[food.id] = food;
      });

      // เพิ่มข้อมูล food เข้าไปใน items
      const enrichedItems = plan.items.map((item) => ({
        ...item,
        food: foodMap[item.foodId] || {}, // ถ้าไม่มีข้อมูล ให้เป็นออบเจกต์ว่าง
      }));

      setSelectedMealPlan({ ...plan, items: enrichedItems });
    } catch (error) {
      console.error("Error loading meal plan details:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* หน้าแสดงรายการ Meal Plan */}
      {step === 1 && (
        <div className="w-1/2 mx-auto p-6 bg-white shadow rounded text-center">
          <h2 className="text-xl font-bold mb-4">Meal Plan</h2>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
            onClick={handleCreateMealPlan}
          >
            ➕ สร้าง Meal Plan
          </button>

          {/* แสดงรายการ Meal Plans ที่เคยสร้างไว้ */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              📌 Meal Plans ที่สร้างแล้ว
            </h3>
            <ul>
              {mealPlans.map((plan) => (
                <li
                  key={plan.id}
                  className="p-2 border rounded my-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-all"
                  onClick={() => toggleMealPlan(plan)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {plan.name} - {plan.dailyCalorie} kcal
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleDeleteMealPlan(plan.id, e)}
                        className="bg-red-500 text-white px-2 py-1 rounded-md text-xs hover:bg-red-700 transition"
                      >
                        ลบ❌
                      </button>
                      <span>
                        {selectedMealPlan?.id === plan.id ? "🔼" : "🔽"}
                      </span>
                    </div>
                  </div>

                  {/* Slide แสดงข้อมูลอาหาร */}
                  {selectedMealPlan?.id === plan.id && (
                    <div className="p-4 bg-white shadow-md rounded-lg mt-2">
                      <h4 className="text-lg font-bold border-b pb-2 mb-3">
                        🍽 รายการอาหารในแผนนี้
                      </h4>
                      {/* แสดงค่าพลังงานและสารอาหารที่เกิน */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-300">
                        <h4 className="text-md font-bold text-gray-700">
                          ⚠️ รายงานพลังงาน & สารอาหารที่เกิน
                        </h4>

                        <p className="font-semibold flex items-center text-gray-700">
                          🎯 เป้าหมายพลังงาน: {latestTdee} kcal
                        </p>

                        <p
                          className={`font-semibold flex items-center ${
                            exceededNutrients.exceededCalories > 0
                              ? "text-red-500"
                              : "text-gray-700"
                          }`}
                        >
                          🔥 พลังงานรวม: {nutrients.totalCalories} kcal
                          {exceededNutrients.exceededCalories > 0 && (
                            <span className="ml-2 text-red-500">
                              (เกิน {exceededNutrients.exceededCalories} kcal)
                            </span>
                          )}
                        </p>

                        <p
                          className={`font-semibold flex items-center ${
                            exceededNutrients.exceededProtein > 0
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          🍗 โปรตีนรวม: {nutrients.totalProtein}g
                          {exceededNutrients.exceededProtein > 0 && (
                            <span className="ml-2 text-red-500">
                              (เกิน {exceededNutrients.exceededProtein}g)
                            </span>
                          )}
                        </p>

                        <p
                          className={`font-semibold flex items-center ${
                            exceededNutrients.exceededFat > 0
                              ? "text-red-500"
                              : "text-orange-500"
                          }`}
                        >
                          🥑 ไขมันรวม: {nutrients.totalFat}g
                          {exceededNutrients.exceededFat > 0 && (
                            <span className="ml-2 text-red-500">
                              (เกิน {exceededNutrients.exceededFat}g)
                            </span>
                          )}
                        </p>

                        <p
                          className={`font-semibold flex items-center ${
                            exceededNutrients.exceededCarbs > 0
                              ? "text-red-500"
                              : "text-blue-500"
                          }`}
                        >
                          🍚 คาร์บรวม: {nutrients.totalCarbs}g
                          {exceededNutrients.exceededCarbs > 0 && (
                            <span className="ml-2 text-red-500">
                              (เกิน {exceededNutrients.exceededCarbs}g)
                            </span>
                          )}
                        </p>
                      </div>

                      {selectedMealPlan.items?.length > 0 ? (
                        <ul className="space-y-4">
                          {/* จัดกลุ่มตามมื้ออาหาร (เช้า, กลางวัน, เย็น) */}
                          {Object.entries(
                            selectedMealPlan.items.reduce((acc, item) => {
                              if (!acc[item.mealTime]) acc[item.mealTime] = [];
                              acc[item.mealTime].push(item);
                              return acc;
                            }, {})
                          ).map(([mealTime, items], index) => (
                            <li
                              key={index}
                              className="bg-gray-100 p-3 rounded-lg shadow"
                            >
                              {/* แสดงชื่อมื้ออาหารเพียงครั้งเดียว */}
                              <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center">
                                🕛{translateMealTime(mealTime)}
                              </h3>

                              <ul className="space-y-3">
                                {items.map((item, i) => (
                                  <li
                                    key={i}
                                    className="bg-white p-3 rounded-md shadow-sm border flex items-center space-x-3"
                                  >
                                    {/* รูปภาพอาหาร */}
                                    <img
                                      src={
                                        item.food?.images?.length > 0
                                          ? item.food.images[0].url
                                          : "/no-image.png"
                                      }
                                      alt={item.food?.title}
                                      className="w-14 h-14 object-cover rounded-md border"
                                    />

                                    {/* ข้อมูลอาหาร */}
                                    <div className="flex-1">
                                      {/* ชื่ออาหาร + จำนวน */}
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                          <strong>
                                            {item.food?.title ||
                                              "ไม่พบชื่ออาหาร"}
                                          </strong>
                                          <span className="text-gray-500 text-sm">
                                            ({item.quantity}{" "}
                                            {item.food?.servingSize || "หน่วย"})
                                          </span>
                                        </div>
                                        <span className="text-orange-500 font-semibold text-sm">
                                          🔥{" "}
                                          {item.food?.calorie
                                            ? item.food.calorie * item.quantity
                                            : "ไม่พบข้อมูล"}{" "}
                                          kcal
                                        </span>
                                      </div>

                                      {/* Fat, Protein, Carbs */}
                                      <div className="flex justify-between text-xs font-medium mt-1 text-gray-700">
                                        <span className="text-orange-500">
                                          🥑 Fat:{" "}
                                          {item.food?.fat
                                            ? (
                                                item.food.fat * item.quantity
                                              ).toFixed(1)
                                            : 0}
                                          g
                                        </span>
                                        <span className="text-green-500">
                                          🍗 Protein:{" "}
                                          {item.food?.protein
                                            ? (
                                                item.food.protein *
                                                item.quantity
                                              ).toFixed(1)
                                            : 0}
                                          g
                                        </span>
                                        <span className="text-blue-500">
                                          🍚 Carbs:{" "}
                                          {item.food?.carbohydrate
                                            ? (
                                                item.food.carbohydrate *
                                                item.quantity
                                              ).toFixed(1)
                                            : 0}
                                          g
                                        </span>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">
                          ไม่มีอาหารในแผนนี้
                        </p>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* หน้าสร้าง Meal Plan */}
      {step === 2 && (
        <div className="grid grid-cols-3 gap-4">
          {/* Sidebar ค้นหาอาหาร */}
          <div className="bg-gray-100 p-4 roun  ded-lg h-screen">
            <h2 className="text-xl font-bold mb-4">🔍 ค้นหาอาหาร</h2>
            <input
              type="text"
              placeholder="ค้นหาอาหาร..."
              className="w-full p-2 border rounded"
              value={searchTerm} // ใช้ค่า searchTerm
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md border">
              <h3 className="text-md font-bold mb-3 text-red-500 flex items-center">
                📌 หมวดหมู่อาหาร
              </h3>
              <div className="flex flex-col space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center text-sm space-x-2"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox accent-red-500"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => filterByCategory(cat.name)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
                <button
                  onClick={() => setSelectedCategories([])}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            </div>
          </div>

          {/* รายการอาหารทั้งหมด */}
          <div className="p-4 overflow-y-auto h-screen scroll-custom">
            <h2 className="text-xl font-bold mb-4">🍽️ รายการอาหารทั้งหมด</h2>
            <div className="grid grid-cols-3 gap-4">
              {" "}
              {/* ปรับเป็น 3 Card ต่อแถว */}
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  className="border shadow-md rounded-lg p-3 bg-white flex flex-col items-center"
                >
                  {/* แสดงรูปภาพอาหาร */}
                  <img
                    src={
                      food.images.length > 0
                        ? food.images[0].url
                        : "/no-image.png"
                    }
                    alt={food.title}
                    className="w-24 h-24 object-cover rounded-md border mb-2"
                  />

                  {/* ชื่ออาหาร */}
                  <p className="text-sm font-semibold text-center">
                    {food.title}
                  </p>

                  {/* แคลอรี่ */}
                  <p className="text-gray-600 flex items-center mt-1 text-xs">
                    🔥{" "}
                    <span className="ml-1 font-medium">
                      {food.calorie} kcal
                    </span>
                  </p>

                  {/* Fat | Protein | Carbs (แสดงเป็นแนวตั้ง) */}
                  <div className="text-xs flex flex-col items-center mt-1 w-full space-y-0.5">
                    <span className="text-orange-500 font-medium flex items-center space-x-1">
                      🥑<span>ไขมัน</span> <span>{food.fat}g</span>
                    </span>
                    <span className="text-green-500 font-medium flex items-center space-x-1">
                      🍗<span>โปรตีน</span> <span>{food.protein}g</span>
                    </span>
                    <span className="text-blue-500 font-medium flex items-center space-x-1">
                      🍚<span>คาร์บ</span> <span>{food.carbohydrate}g</span>
                    </span>
                  </div>

                  {/* ปุ่มเพิ่มอาหาร */}
                  <button
                    onClick={() => handleAddFood(food)}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-md transition duration-300 ease-in-out text-xs"
                  >
                    ➕ เพิ่ม
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Plan ที่เลือก */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">🛒 Meal Plan</h2>
            <p className="text-gray-600 text-sm mb-2">
              🔥 เป้าหมายพลังงานต่อวัน:{" "}
              <span className="font-semibold">
                {latestTdee || "กำลังโหลด..."} kcal
              </span>
            </p>
            <p className="text-gray-600 text-sm mb-2">
              🎯 <span className="font-semibold">TDEE เป้าหมาย:</span>{" "}
              {nutrients.adjustedTdee} kcal
            </p>
            <label className="text-sm font-semibold">เลือกเป้าหมาย:</label>
            <select
              className="w-full p-2 border rounded mb-2"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="cut">ลดไขมัน (-500 kcal)</option>
              <option value="maintain">รักษาน้ำหนัก</option>
              <option value="bulk">เพิ่มกล้ามเนื้อ (+300 kcal)</option>
            </select>

            {/* อัปเดตแสดงแคลอรี่ของสารอาหารแบบเรียงลงมา */}
            <div className="text-sm text-gray-700 mt-2 space-y-1">
              <p
                className={`font-semibold flex items-center ${
                  nutrients.remainingProtein < 0
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                🍗 โปรตีนที่เหลือ:{" "}
                {nutrients.remainingProtein >= 0
                  ? nutrients.remainingProtein.toFixed(1)
                  : `0`}
                g
                <span className="ml-1">
                  (
                  {nutrients.remainingProtein >= 0
                    ? (nutrients.remainingProtein * 4).toFixed(0)
                    : `0`}{" "}
                  kcal)
                </span>
                {nutrients.remainingProtein < 0 && (
                  <span className="text-red-500 ml-2">
                    (เกินมา {Math.abs(nutrients.remainingProtein.toFixed(1))}g)
                  </span>
                )}
              </p>

              <p
                className={`font-semibold flex items-center ${
                  nutrients.remainingFat < 0
                    ? "text-red-500"
                    : "text-orange-500"
                }`}
              >
                🥑 ไขมันที่เหลือ:{" "}
                {nutrients.remainingFat >= 0
                  ? nutrients.remainingFat.toFixed(1)
                  : `0`}
                g
                <span className="ml-1">
                  (
                  {nutrients.remainingFat >= 0
                    ? (nutrients.remainingFat * 9).toFixed(0)
                    : `0`}{" "}
                  kcal)
                </span>
                {nutrients.remainingFat < 0 && (
                  <span className="text-red-500 ml-2">
                    (เกินมา {Math.abs(nutrients.remainingFat.toFixed(1))}g)
                  </span>
                )}
              </p>

              <p
                className={`font-semibold flex items-center ${
                  nutrients.remainingCarbs < 0
                    ? "text-red-500"
                    : "text-blue-500"
                }`}
              >
                🍚 คาร์บที่เหลือ:{" "}
                {nutrients.remainingCarbs >= 0
                  ? nutrients.remainingCarbs.toFixed(1)
                  : `0`}
                g
                <span className="ml-1">
                  (
                  {nutrients.remainingCarbs >= 0
                    ? (nutrients.remainingCarbs * 4).toFixed(0)
                    : `0`}{" "}
                  kcal)
                </span>
                {nutrients.remainingCarbs < 0 && (
                  <span className="text-red-500 ml-2">
                    (เกินมา {Math.abs(nutrients.remainingCarbs.toFixed(1))}g)
                  </span>
                )}
              </p>

              <p
                className={`text-sm font-semibold mt-2 ${
                  nutrients.remainingTdee < 0 ? "text-red-500" : "text-gray-700"
                }`}
              >
                🔥 พลังงานคงเหลือ:{" "}
                {nutrients.remainingTdee >= 0 ? nutrients.remainingTdee : `0`}{" "}
                kcal
                {nutrients.remainingTdee < 0 && (
                  <span className="text-red-500 ml-2">
                    (เกินมา {Math.abs(nutrients.remainingTdee)} kcal)
                  </span>
                )}
              </p>
            </div>

            <input
              type="text"
              placeholder="ตั้งชื่อ Meal Plan..."
              className="w-full p-2 border rounded mb-2"
              value={mealPlanName}
              onChange={(e) => setMealPlanName(e.target.value)}
            />

            <label className="text-sm font-semibold">เลือกมื้ออาหาร:</label>
            <select
              className="w-full p-2 border rounded mb-2"
              value={selectedMealTime}
              onChange={(e) => setSelectedMealTime(e.target.value)}
            >
              <option value="breakfast">⛅️ เช้า</option>
              <option value="lunch">☀️ กลางวัน</option>
              <option value="dinner">🌙 เย็น</option>
            </select>

            {/* รายการอาหารที่เลือก */}
            {/* วนลูปแสดงรายการอาหารแยกตามมื้อ */}
            {Object.entries(groupedMealItems).map(([mealTime, items]) => (
              <div key={mealTime} className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  {mealTime === "breakfast"
                    ? "⛅️ มื้อเช้า"
                    : mealTime === "lunch"
                    ? "☀️  มื้อกลางวัน"
                    : "🌙 มื้อเย็น"}
                </h3>

                <ul>
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded my-2 bg-white shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            item.food.images.length > 0
                              ? item.food.images[0].url
                              : "/no-image.png"
                          }
                          alt={item.food.title}
                          className="w-12 h-12 object-cover rounded-md border"
                        />
                        <div>
                          <p className="text-sm font-semibold">
                            {item.food?.title} - {item.quantity}{" "}
                            {item.food?.servingSize || "หน่วย"}
                          </p>

                          <p className="text-xs text-gray-500 flex space-x-2">
                            <span className="text-orange-500">
                              🥑 {item.food.fat}g Fat
                            </span>
                            <span className="text-green-500">
                              🍗 {item.food.protein}g Protein
                            </span>
                            <span className="text-blue-500">
                              🍚 {item.food.carbohydrate}g Carbs
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* ปุ่มเพิ่ม/ลดจำนวนอาหาร */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleDecreaseQuantity(item.food.id, mealTime)
                          }
                          className="bg-blue-500 text-white px-2 py-1 rounded-md"
                        >
                          ➖
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleIncreaseQuantity(item.food.id, mealTime)
                          }
                          className="bg-blue-500 text-white px-2 py-1 rounded-md"
                        >
                          ➕
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                onClick={handleConfirmMealPlan}
              >
                ✔ ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlan;
