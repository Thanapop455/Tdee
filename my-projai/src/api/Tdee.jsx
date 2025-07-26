import axios from "axios";

export const calculateTdee = async (token, data) => {
    return axios.post("http://localhost:5001/api/tdee/calculate", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}, 
    });
  };
  

export const getLatestTdee = async (token) => {
  return axios.get("http://localhost:5001/api/tdee/results", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchTdee = async (token) => {
  return await axios.get(`${API_URL}/latest`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const listTdee = async (token) => {
  return axios.get("http://localhost:5001/api/tdee/list", {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const listTdeeHistory = async (token) => {
  return axios.get("http://localhost:5001/api/tdee/history", {
    headers: { Authorization: `Bearer ${token}` },
  });
};