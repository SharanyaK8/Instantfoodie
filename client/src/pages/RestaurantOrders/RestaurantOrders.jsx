import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRestaurants } from "../../services/restaurant.service";
import Navbar from "../../components/Navbar";
import {
  getRestaurantOrders,
  updateOrderStatus,
} from "../../services/order.service";


const statusOptions = [
  "Preparing",
  "Out for Delivery",
  "Delivered",
];
const nextValidStatus = {
  Placed: ["Preparing", "Cancelled"],
  Preparing: ["Out for Delivery"],
  "Out for Delivery": ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

function RestaurantOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    checkRestaurantAndFetchOrders();
  }, []);

  async function checkRestaurantAndFetchOrders() {
    try {
      const restaurantData = await getMyRestaurants();
      const restaurants = restaurantData.restaurants || [];

      if (restaurants.length === 0) {
        navigate("/restaurant-profile");
        return;
      }

      await fetchOrders();
    } catch (error) {
      console.log("Restaurant check error:", error);
      setLoading(false);
    }
  }

  async function fetchOrders() {

    try {

      const data = await getRestaurantOrders();

      setOrders(data.Orders || []);

    } catch (error) {

      console.log(
        "Restaurant orders error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  async function changeStatus(orderId, status) {

    try {

      setUpdatingId(orderId);
      setStatusError("");

      await updateOrderStatus(
        orderId,
        status
      );

      await fetchOrders();

    } catch (error) {

      setStatusError(
        error?.response?.data?.message || "Could not update order status."
      );

    } finally {

      setUpdatingId(null);

    }

  }


  if (loading) {
    return (
      <h2 className="text-white p-10">
        Loading restaurant orders...
      </h2>
    );
  }


  return (

    <div className="min-h-screen bg-[#050505]">

      <Navbar />


      <div className="w-[95%] max-w-6xl mx-auto py-10">

        <h1 className="text-3xl font-black text-white mb-8">
          Restaurant Orders
        </h1>

        {statusError && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-red-400 text-sm font-semibold text-center">
            {statusError}
          </div>
        )}


        {
          orders.length === 0 ? (

            <div className="text-neutral-400">
              No orders received yet.
            </div>

          ) : (

            <div className="space-y-6">

              {
                orders.map((order) => (

                  <div
                    key={order.orderId}
                    className="bg-zinc-900 border border-neutral-800 rounded-3xl p-6"
                  >

                    <div className="flex justify-between items-center mb-5">

                      <h2 className="text-white text-xl font-bold">
                        Order #{order.orderId}
                      </h2>


                      <span className="text-amber-500 font-bold">
                        {order.orderStatus}
                      </span>

                    </div>


                    <p className="text-neutral-400 text-sm mb-1">
                      Customer: {order.userId?.fullName || order.userId?.name || "Customer"}
                    </p>
                    <p className="text-neutral-500 text-xs mb-4">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>


                    <div className="space-y-3">

                      {
                        order.items.map((item) => (

                          <div
                            key={item.foodItemId}
                            className="flex justify-between bg-black/40 rounded-xl p-3"
                          >

                            <span className="text-white">
                              {item.name} x {item.quantity}
                            </span>

                            <span className="text-amber-500">
                              ₹{item.subtotal}
                            </span>

                          </div>

                        ))
                      }

                    </div>


                    <div className="mt-5 flex justify-between items-center">

                      <p className="text-white font-bold">
                        Total: ₹{order.totalAmount}
                      </p>

                      {
                        nextValidStatus[order.orderStatus]?.length > 0 && (
                          <div className="flex gap-2">
                            {nextValidStatus[order.orderStatus].map((status) => (
                              <button
                                key={status}
                                disabled={updatingId === order.orderId}
                                onClick={() => changeStatus(order.orderId, status)}
                                className={`text-sm font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50 ${status === "Cancelled"
                                    ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                                    : "bg-amber-500 text-neutral-950 hover:bg-amber-600"
                                  }`}
                              >
                                {updatingId === order.orderId
                                  ? "Updating..."
                                  : status === "Cancelled"
                                    ? "Cancel Order"
                                    : `Mark as ${status}`}
                              </button>
                            ))}
                          </div>
                        )
                      }


                    </div>


                  </div>

                ))
              }

            </div>

          )
        }


      </div>

    </div>

  );

}


export default RestaurantOrders;