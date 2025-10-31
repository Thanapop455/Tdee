import React, { useState, useEffect, useMemo } from "react";
import useStoregobal from "../../store/storegobal";
import { readFood, updateFood } from "../../api/Food";
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
  source: "",
  categoryId: "",
  images: [],
};

// small UI helpers
const Field = ({ label, required, hint, error, children }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
const TextInput = (props) => (
  <input
    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    {...props}
  />
);
const NumberInput = (props) => (
  <input
    type="number"
    step="0.01"
    min="0"
    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    {...props}
  />
);
const TextArea = (props) => (
  <textarea
    rows={3}
    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
    {...props}
  />
);

const FormEditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = useStoregobal((s) => s.token);
  const getCategory = useStoregobal((s) => s.getCategory);
  const categories = useStoregobal((s) => s.categories);

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getCategory(token);
  }, [token, getCategory]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const res = await readFood(token, id);
        setForm({
          ...initialState,
          ...res.data,
          calorie: res.data.calorie ?? "",
          fat: res.data.fat ?? "",
          carbohydrate: res.data.carbohydrate ?? "",
          protein: res.data.protein ?? "",
        });
      } catch (err) {
        console.log("Err fetch data", err);
        toast.error("ไม่พบข้อมูลอาหาร");
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [token, id]);

  const handleOnChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = useMemo(
    () => () => {
      const v = {};
      if (!form.title?.trim()) v.title = "กรุณากรอกชื่ออาหาร";
      if (!form.categoryId) v.categoryId = "กรุณาเลือกหมวดหมู่";
      ["calorie", "fat", "carbohydrate", "protein"].forEach((f) => {
        const val = form[f];
        if (val !== "" && Number(val) < 0) v[f] = "ต้องเป็นค่ามากกว่าหรือเท่ากับ 0";
      });
      return v;
    },
    [form]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) {
      toast.error("กรุณาตรวจสอบข้อมูลให้ครบถ้วน");
      return;
    }
    try {
      setSaving(true);
      const toNumber = (x) => (x === "" ? undefined : Number(x));
      const payload = {
        ...form,
        calorie: toNumber(form.calorie),
        fat: toNumber(form.fat),
        carbohydrate: toNumber(form.carbohydrate),
        protein: toNumber(form.protein),
      };
      const res = await updateFood(token, id, payload);
      toast.success(`บันทึก “${res.data.title}” สำเร็จ`);
      navigate("/admin/food");
    } catch (err) {
      console.log(err);
      toast.error("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="animate-pulse rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <div className="h-6 w-48 rounded bg-gray-200" />
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
            <div className="h-10 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b px-6 py-5">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">แก้ไขข้อมูลอาหาร</h1>
            <p className="text-sm text-gray-500">
              กรอกข้อมูลโภชนาการต่อหนึ่งหน่วยบริโภค (Serving)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/admin/food")}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-12">
          {/* Left */}
          <section className="space-y-6 md:col-span-7">
            <div className="rounded-xl border border-gray-100 p-5">
              <h2 className="mb-3 text-base font-semibold text-gray-900">ข้อมูลพื้นฐาน</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="ชื่ออาหาร (Title)" required error={errors.title}>
                  <TextInput
                    name="title"
                    value={form.title}
                    onChange={handleOnChange}
                    placeholder="เช่น ข้าวอกไก่ย่าง"
                  />
                </Field>

                <Field label="หมวดหมู่ (Category)" required error={errors.categoryId}>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleOnChange}
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="" disabled>
                      เลือกหมวดหมู่
                    </option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="md:col-span-2">
                  <Field label="คำอธิบาย (Description)" hint="อธิบายส่วนประกอบ/วิธีทำคร่าว ๆ">
                    <TextArea
                      name="description"
                      value={form.description}
                      onChange={handleOnChange}
                      placeholder="เช่น อกไก่ย่างเกลือ เสิร์ฟกับข้าวกล้อง 1 ถ้วย"
                    />
                  </Field>
                </div>

                <Field label="แหล่งที่มา (Source)">
                  <TextInput
                    name="source"
                    value={form.source}
                    onChange={handleOnChange}
                    placeholder="เช่น USDA / Thai RDI / อ้างอิงส่วนตัว"
                  />
                </Field>

                <Field label="หน่วยบริโภค (Serving Size)" hint="เช่น 100 g, 1 ถ้วย">
                  <TextInput
                    name="servingSize"
                    value={form.servingSize}
                    onChange={handleOnChange}
                    placeholder="เช่น 1 ถ้วย (150 g)"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h2 className="mb-3 text-base font-semibold text-gray-900">อัปโหลดรูปภาพ</h2>
              <Uploadfile form={form} setForm={setForm} />
              {Array.isArray(form.images) && form.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="overflow-hidden rounded-xl border" title={img?.public_id || `image-${i}`}>
                      <img
                        alt={`food-${i}`}
                        src={img?.url || img}
                        className="h-28 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Right */}
          <section className="space-y-6 md:col-span-5">
            <div className="rounded-xl border border-gray-100 p-5">
              <h2 className="mb-3 text-base font-semibold text-gray-900">
                โภชนาการ (ต่อ 1 หน่วยบริโภค)
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <Field label="พลังงาน (kcal)" error={errors.calorie} hint="ตัวอย่าง 250">
                  <NumberInput
                    name="calorie"
                    value={form.calorie}
                    onChange={handleOnChange}
                    placeholder="เช่น 250"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="ไขมัน (g)" error={errors.fat}>
                    <NumberInput
                      name="fat"
                      value={form.fat}
                      onChange={handleOnChange}
                      placeholder="เช่น 5"
                    />
                  </Field>
                  <Field label="คาร์บ (g)" error={errors.carbohydrate}>
                    <NumberInput
                      name="carbohydrate"
                      value={form.carbohydrate}
                      onChange={handleOnChange}
                      placeholder="เช่น 32"
                    />
                  </Field>
                  <Field label="โปรตีน (g)" error={errors.protein}>
                    <NumberInput
                      name="protein"
                      value={form.protein}
                      onChange={handleOnChange}
                      placeholder="เช่น 20"
                    />
                  </Field>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-5">
              <h2 className="mb-3 text-base font-semibold text-gray-900">สรุป</h2>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• ตรวจสอบชื่ออาหารและหมวดหมู่ให้ถูกต้อง</li>
                <li>• กรอกโภชนาการต่อหนึ่งหน่วยบริโภค</li>
                <li>• เพิ่มรูปภาพเพื่อความน่าเชื่อถือ</li>
              </ul>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default FormEditFood;
