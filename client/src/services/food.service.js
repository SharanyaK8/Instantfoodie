import api from "./auth.service";

export async function getAllFoodItems() {
  const { data } = await api.get("/api/foodItems/AllFoodItems");
  return data;
}

export async function getFoodByCategory(category) {
  const { data } = await api.get(`/api/foodItems/category/${category}`);
  return data;
}