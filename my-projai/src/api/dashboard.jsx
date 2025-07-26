
import axios from 'axios';

export const getDashboardSummary = async (token) => {
  return await axios.get("http://localhost:5001/api/dashboard/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getTDEETrend = async (token) =>
  await axios.get("http://localhost:5001/api/dashboard/tdee-trend", {
    headers: { Authorization: `Bearer ${token}` },
  });

  export const getVisitorCount = async (token) =>
    await axios.get("http://localhost:5001/api/dashboard/visitors", {
      headers: { Authorization: `Bearer ${token}` },
    });