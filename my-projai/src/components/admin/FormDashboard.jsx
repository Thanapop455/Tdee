import { useEffect, useState } from "react";
import { getDashboardSummary, getTDEETrend } from "../../api/dashboard";
import { getLatestUsers } from "../../api/user";
import useStoregobal from "../../store/storegobal";
import { FaSyncAlt, FaUser } from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const cardStyle =
  "rounded-xl shadow-md p-6 text-center w-full text-white transition-transform transform hover:scale-105";

const FormDashboard = () => {
  const token = useStoregobal((state) => state.token);
  const [summary, setSummary] = useState(null);
  const [latestUsers, setLatestUsers] = useState([]);
  const [tdeeTrend, setTdeeTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, usersRes, trendRes] = await Promise.all([
        getDashboardSummary(token),
        getLatestUsers(token),
        getTDEETrend(token),
      ]);
      setSummary(summaryRes.data);
      setLatestUsers(usersRes.data);
      setTdeeTrend(trendRes.data); // ✅ ข้อมูลจริงจาก backend
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "👤 ผู้ใช้", value: summary?.users ?? 0, bg: "bg-blue-500" },
    { title: "🍛 อาหาร", value: summary?.foods ?? 0, bg: "bg-green-500" },
    { title: "🔥 คำนวณ TDEE", value: summary?.tdee ?? 0, bg: "bg-yellow-500" },
    { title: "📋 แผนอาหาร", value: summary?.plans ?? 0, bg: "bg-purple-500" },
    {
      title: "📈 บันทึกน้ำหนัก",
      value: summary?.weights ?? 0,
      bg: "bg-pink-500",
    },
    { title: "👀 ผู้เข้าชม", value: summary?.visitors ?? 0, bg: "bg-gray-600" },
  ];

  const barChartData = {
    labels: ["ผู้ใช้", "อาหาร", "TDEE", "แผนอาหาร", "น้ำหนัก"],
    datasets: [
      {
        label: "จำนวนทั้งหมด",
        data: [
          summary?.users ?? 0,
          summary?.foods ?? 0,
          summary?.tdee ?? 0,
          summary?.plans ?? 0,
          summary?.weights ?? 0,
        ],
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#8B5CF6",
          "#EC4899",
        ],
      },
    ],
  };

  const lineChartData = {
    labels: tdeeTrend.map((item) => item.day),
    datasets: [
      {
        label: "จำนวนการคำนวณ TDEE",
        data: tdeeTrend.map((item) => item.count),
        fill: false,
        borderColor: "#3B82F6",
        tension: 0.4,
      },
    ],
  };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          📊 Dashboard
        </h2>
        <button
          onClick={fetchDashboardData}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm flex items-center"
        >
          <FaSyncAlt className="mr-2" />
          รีเฟรชข้อมูล
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {(loading ? Array(5).fill({}) : cards).map((card, idx) => (
          <div
            key={idx}
            className={
              loading
                ? "bg-gray-200 animate-pulse rounded-xl h-32"
                : `${cardStyle} ${card.bg}`
            }
          >
            {!loading && (
              <>
                <p className="text-lg font-semibold">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      {/* สถิติรวม + แนวโน้ม TDEE (อยู่แถวเดียวกัน) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart - สถิติรวม */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">📦 สถิติรวม</h3>
          <div className="w-full h-64">
            <Bar data={barChartData} />
          </div>
        </div>

        {/* Line Chart - แนวโน้ม TDEE */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">
            📉 แนวโน้มการคำนวณ TDEE (รายวัน)
          </h3>
          <div className="w-full h-64">
            <Line data={lineChartData} />
          </div>
        </div>
      </div>

      {/* Latest Users */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold mb-4">🧑‍💻 ผู้ใช้ล่าสุด</h3>
        {latestUsers.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {latestUsers.map((u) => (
              <li key={u.id}>
                <FaUser className="inline mr-2 text-blue-500" />
                <span className="font-medium">{u.email}</span>
                {u.name && (
                  <span className="text-sm text-gray-500"> ({u.name})</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">ไม่มีข้อมูลผู้ใช้</p>
        )}
      </div>
    </div>
  );
};

export default FormDashboard;
