import api from "./auth.service";

// Create a new restaurant profile
export const createRestaurant = async (restaurantData) => {
  const { data } = await api.post("/api/restaurants/", restaurantData);
  return data;
};

// Get restaurants owned by the logged-in restaurant user
export const getMyRestaurants = async () => {
  const { data } = await api.get("/api/restaurants/my-restaurants");
  return data;
};

// Update an existing restaurant
export const updateRestaurant = async (id, restaurantData) => {
  const { data } = await api.put(`/api/restaurants/${id}`, restaurantData);
  return data;
};