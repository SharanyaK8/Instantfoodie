import api from "./auth.service";


export const placeOrder = async (orderData) => {

  const { data } = await api.post(
    "/api/order/placeOrder",
    orderData
  );

  return data;

};


export const getMyOrders = async () => {

  const { data } = await api.get(
    "/api/order/myOrders"
  );

  return data;

};