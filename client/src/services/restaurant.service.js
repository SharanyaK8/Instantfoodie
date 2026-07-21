import api from "./auth.service";

export const createRestaurant = async (restaurantData) => {
  const { data } = await api.post("/api/restaurants/", restaurantData);
  return data;
};

export const getMyRestaurants = async () => {
  const { data } = await api.get("/api/restaurants/my-restaurants");
  return data;
};

export const updateRestaurant = async (id, restaurantData) => {
  const { data } = await api.put(`/api/restaurants/${id}`, restaurantData);
  return data;
};
