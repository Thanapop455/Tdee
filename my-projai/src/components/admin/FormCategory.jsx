import React, { useEffect, useMemo, useRef, useState } from "react";
import { createCategory, removeCategory } from "../../api/Category";
import useStoregobal from "../../store/storegobal";
import { toast } from "react-toastify";
import { Trash2, Plus, FolderPlus, Search } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const FormCategory = () => {
  const token = useStoregobal((state) => state.token);

  // global store
  const categories = useStoregobal((state) => state.categories);
  const getCategory = useStoregobal((state) => state.getCategory);

  // local ui states
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    getCategory(token);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [token]); // ให้ refetch เมื่อ token เปลี่ยน

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = name.trim();
    if (!value) return toast.warning("กรุณากรอกชื่อหมวดหมู่");
    try {
      setLoading(true);
      const res = await createCategory(token, { name: value });
      toast.success(`เพิ่มหมวดหมู่ “${res.data.name}” สำเร็จ`);
      setName("");
      inputRef.current?.focus();
      await getCategory(token);
    } catch (err) {
      console.error(err);
      toast.error("เพิ่มหมวดหมู่ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, label) => {
    const { isConfirmed } = await Swal.fire({
      title: "ลบหมวดหมู่?",
      text: `คุณต้องการลบ “${label}” ใช่ไหม`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!isConfirmed) return;

    try {
      setDeletingId(id);
      // แสดงกำลังลบ
      Swal.fire({
        title: "กำลังลบ...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await removeCategory(token, id);

      await getCategory(token);
      Swal.close();
      toast.success(`ลบ “${res?.data?.name ?? label}” แล้ว`);
    } catch (err) {
      console.error(err);
      Swal.close();
      toast.error("ลบไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-800">
          <FolderPlus className="h-6 w-6 text-blue-600" />
          Category Management
        </h1>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
          ทั้งหมด {categories.length} รายการ
        </span>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Add form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row"
        >
          <div className="relative grow">
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="เพิ่มหมวดหมู่ใหม่ เช่น อาหารเช้า"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-12 text-slate-800 outline-none ring-blue-500/20 focus:border-blue-500 focus:ring"
            />
            <Plus className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition
            ${loading ? "bg-blue-400" : "bg-blue-600 hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0"}
            shadow-sm`}
          >
            <Plus className="h-4 w-4" />
            {loading ? "กำลังเพิ่ม..." : "Add Category"}
          </button>
        </form>

        {/* Toolbar: search */}
        <div className="flex items-center gap-3 p-4">
          <div className="relative w-full sm:w-72">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="ค้นหาหมวดหมู่…"
              className="w-full rounded-xl border border-slate-300 bg-white px-10 py-2.5 text-slate-800 outline-none ring-blue-500/20 focus:border-blue-500 focus:ring"
            />
            <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
          {query && (
            <span className="text-sm text-slate-500">
              พบ {filtered.length} รายการ
            </span>
          )}
        </div>

        {/* List */}
        <ul className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <li className="p-10 text-center text-slate-500">
              ไม่พบหมวดหมู่ที่ค้นหา
            </li>
          ) : (
            filtered.map((item) => (
              <li
                key={item.id}
                className="group flex items-center justify-between px-4 py-3 transition hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500/80" />
                  <span className="truncate text-slate-800">{item.name}</span>
                </div>

                <button
                  onClick={() => handleRemove(item.id, item.name)}
                  className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-3 py-2 text-sm font-medium text-white shadow-sm 
                             transition hover:-translate-y-0.5 hover:bg-rose-600 active:translate-y-0 disabled:opacity-60"
                  disabled={deletingId === item.id}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                  {deletingId === item.id ? "กำลังลบ…" : "ลบ"}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default FormCategory;
