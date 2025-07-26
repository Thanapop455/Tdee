import axios from "axios";

export const createFood = async (token, form) => {
  return axios.post("http://localhost:5001/api/food", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const listFood = async (token) => {
  return axios.get("http://localhost:5001/api/foods", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const readFood = async (token, id) => {
  return axios.get("http://localhost:5001/api/food/"+id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteFood = async (token, id) => {
  return axios.delete("http://localhost:5001/api/food/"+id, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateFood = async (token, id, form) => {
  return axios.put("http://localhost:5001/api/food/"+ id, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const uploadfile = async (token, form) => {
  // console.log('form api frontent', form);
  return axios.post(
    "http://localhost:5001/api/images",
    {
      image: form,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removefile = async (token, public_id) => {
  // console.log('form api frontent', form);
  return axios.post(
    "http://localhost:5001/api/removeimages",
    {
      public_id
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
