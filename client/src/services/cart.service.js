import api from "./auth.service";

export const getCart = async () => {
  const { data } = await api.get("/api/cart");
  return data;
};

export const addToCart = async (foodItemId, quantity = 1) => {
  const { data } = await api.post("/api/cart", {
    foodItemId,
    quantity,
  });

  return data;
};

export const updateCart = async (cartId, quantity) => {
  const { data } = await api.patch(`/api/cart/${cartId}`, {
    quantity,
  });

  return data;
};

export const removeCart = async (cartId) => {
  const { data } = await api.delete(`/api/cart/${cartId}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await api.delete("/api/cart");
  return data;
};
