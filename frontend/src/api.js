import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5002/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = async (formData) => {
  try {
    const response = await axiosInstance.post("/auth/register", formData);
    return response.data;
  } catch (error) {
    if (
      error.response &&
      error.response.data.message === "User already exists"
    ) {
      throw new Error("User with this email already exists");
    } else {
      console.error(
        "Register user error:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error(
      "Login user error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (error) {
    console.error(
      "Fetch products error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const addItemToCart = async (cartItem) => {
  try {
    const response = await axiosInstance.post("/cart", cartItem);
    return response.data;
  } catch (error) {
    console.error(
      "Add item to cart error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const fetchCartItems = async (userId) => {
  try {
    const response = await axiosInstance.get(`/cart/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Fetch cart items error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateCartItem = async (id, quantity) => {
  try {
    const response = await axiosInstance.put(`/cart/${id}`, { quantity });
    return response.data;
  } catch (error) {
    console.error(
      "Update cart item error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const removeCartItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`/cart/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Remove cart item error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const checkout = async (orderData) => {
  console.log("Order data:", orderData);
  try {
    const response = await axiosInstance.post("/checkout", orderData);
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Checkout error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
