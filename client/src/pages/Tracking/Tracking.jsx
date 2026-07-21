import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { trackOrder } from "../../services/order.service";

function Tracking() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await trackOrder(orderId);

        setOrder(response.order);
      } catch (error) {
        console.log("Tracking error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <h2>Loading order tracking...</h2>;
  }

  if (!order) {
    return <h2>Order not found</h2>;
  }

  const steps = ["Placed", "Preparing", "Out for Delivery", "Delivered"];

  return (
    <div>
      <h1>Live Order Tracking</h1>

      <h3>Order ID: {order.orderId}</h3>

      <h2>Current Status: {order.status}</h2>

      <div>
        {steps.map((step, index) => (
          <div
            key={step}
            style={{
              margin: "15px",
              color: steps.indexOf(order.status) >= index ? "green" : "gray",
            }}
          >
            ✅ {step}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tracking;
