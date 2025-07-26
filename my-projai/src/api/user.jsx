import axios from "axios";

export const getLatestUsers = async (token) => {
  return await axios.get("http://localhost:5001/api/users/latest", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
