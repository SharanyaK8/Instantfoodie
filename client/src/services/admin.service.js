import api from "./auth.service";

export const getUsers = async () => {
  const { data } = await api.get("/api/admin/users");
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/api/admin/users/${id}`);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/api/admin/users/${id}`);
  return data;
};

export const blockUser = async (id) => {
  const { data } = await api.patch(`/api/admin/block-user/${id}`);
  return data;
};

export const unblockUser = async (id) => {
  const { data } = await api.patch(`/api/admin/unblock-user/${id}`);
  return data;
};

export const getRestaurants = async () => {
  const { data } = await api.get("/api/admin/restaurants");
  return data;
};

export const deleteRestaurant = async (id) => {
  const { data } = await api.delete(`/api/admin/restaurants/${id}`);
  return data;
};

export const getAllOrders = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await api.get(
    `/api/admin/orders${params ? `?${params}` : ""}`,
  );
  return data;
};

export const getAllFoodsAdmin = async () => {
  const { data } = await api.get("/api/admin/all-food-items");
  return data;
};

export const deleteFoodItemAdmin = async (id) => {
  const { data } = await api.delete(`/api/admin/food-item/${id}`);
  return data;
};