import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { HiCheckCircle, HiOutlineArrowLeft } from "react-icons/hi2";
import Navbar from "../../components/Navbar";
import { trackOrder } from "../../services/order.service";

const steps = [
  { key: "Placed", label: "Order Placed" },
  { key: "Preparing", label: "Preparing" },
  { key: "Out for Delivery", label: "Out for Delivery" },
  { key: "Delivered", label: "Delivered" },
];

function Tracking() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let interval;

    const fetchOrder = async () => {
      try {
        const response = await trackOrder(orderId);
        if (!isMounted) return;

        setOrder(response.order);

        const finalStatuses = ["Delivered", "Cancelled"];
        if (finalStatuses.includes(response.order?.status) && interval) {
          clearInterval(interval);
        }
      } catch (error) {
        console.log("Tracking error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrder();

    interval = setInterval(fetchOrder, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Navbar />
        <h2 className="text-white p-10">Loading order tracking...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <Navbar />
        <h2 className="text-white p-10">Order not found</h2>
      </div>
    );
  }

  const activeStepIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />

      <div className="w-[95%] max-w-3xl mx-auto py-10">
        <Link
          to="/order"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-semibold mb-8 transition-colors"
        >
          <HiOutlineArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="relative rounded-3xl p-[1.5px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9)]">
          <div className="absolute inset-0 z-0 bg-[conic-gradient(from_0deg,transparent_40%,#f59e0b_50%,transparent_60%)] opacity-50 scale-110 animate-streak-active pointer-events-none" />

          <div className="relative z-10 bg-[#121212]/95 backdrop-blur-xl rounded-[23px] p-6 sm:p-8">
            <h1 className="text-2xl font-black text-white mb-1">
              Live Order Tracking
            </h1>
            <p className="text-neutral-400 text-sm mb-1">
              Order #{order.orderId}
            </p>
            <p className="text-neutral-400 text-sm mb-8">
              {order.restaurant?.restaurantName || "Restaurant"}
            </p>

            {order.status === "Cancelled" ? (
              <div className="flex items-center gap-3 mb-10 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4">
                <p className="text-red-400 font-bold text-sm">
                  This order was cancelled.
                </p>
              </div>
            ) : (
              <div className="flex items-start justify-between mb-10">
                {steps.map((step, i) => (
                  <div
                    key={step.key}
                    className="flex-1 flex flex-col items-center relative"
                  >
                    {i !== steps.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-[2px] ${
                          i < activeStepIndex ? "bg-amber-500" : "bg-neutral-800"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        i <= activeStepIndex
                          ? "bg-amber-500 text-neutral-950 shadow-lg shadow-amber-500/30"
                          : "bg-neutral-900 border border-neutral-700 text-neutral-500"
                      }`}
                    >
                      {i <= activeStepIndex ? (
                        <HiCheckCircle size={18} />
                      ) : (
                        i + 1
                      )}
                    </div>

                    <p
                      className={`mt-3 text-[10px] sm:text-xs px-1 font-semibold text-center ${
                        i <= activeStepIndex ? "text-white" : "text-neutral-500"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.foodItemId}
                  className="flex items-center justify-between bg-zinc-900/70 border border-neutral-800 rounded-2xl p-4"
                >
                  <div>
                    <h4 className="text-white font-bold text-base">
                      {item.name}
                    </h4>
                    <p className="text-neutral-400 text-sm mt-1">
                      Quantity : {item.quantity}
                    </p>
                  </div>
                  <p className="text-amber-500 font-bold">₹{item.subtotal}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-800">
              <p className="text-neutral-400 font-semibold">Total Amount</p>
              <p className="text-white font-black text-lg">
                ₹{order.totalAmount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracking;