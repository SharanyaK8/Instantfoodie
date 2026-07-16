import api from "./auth.service";

export async function getAllFoodItems() {
  const { data } = await api.get("/api/foodItems/AllFoodItems");
  return data;
}

export async function getFoodByCategory(category) {
  const { data } = await api.get(`/api/foodItems/category/${category}`);
  return data;
}

export async function getPublicFoodItems() {
  const { data } = await api.get("/api/foodItems/public");
  return data;
}

// Restaurant-only: get items belonging to logged-in restaurant
export async function getMyFoodItems() {
  const { data } = await api.get("/api/foodItems/my-food");
  return data;
}

// Restaurant-only: create a new food item
export async function createFoodItem(foodData) {
  const { data } = await api.post("/api/foodItems/newFoodItem", foodData);
  return data;
}

// Restaurant-only: update a food item
export async function updateFoodItem(id, foodData) {
  const { data } = await api.patch(`/api/foodItems/${id}`, foodData);
  return data;
}

// Restaurant-only: delete a food item
export async function deleteFoodItem(id) {
  const { data } = await api.delete(`/api/foodItems/${id}`);
  return data;
}