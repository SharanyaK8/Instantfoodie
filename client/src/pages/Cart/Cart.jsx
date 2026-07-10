import { Link } from "react-router-dom";
import { HiPlus, HiMinus, HiOutlineTrash, HiOutlineShoppingBag } from "react-icons/hi2";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/CartContext";
import { placeOrder } from "../../services/order.service";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, cartTotal, increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  const deliveryFee = cartItems.length > 0 ? 30 : 0;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <div className="min-h-screen bg-white">
      <Navbar cartCount={cartCount} />

      <div className="w-[95%] max-w-4xl mx-auto mt-10 pb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h2>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <HiOutlineShoppingBag size={56} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
            <Link
              to="/home"
              className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:brightness-110 transition-all"
            >
              Browse dishes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items list */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-4"
                >
                  <img
                    src={item.foodItemId.imageUrl}
                    alt={item.foodItemId.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.foodItemId.name}</h3>
                    <p className="text-orange-500 font-bold mt-1">₹{item.foodItemId.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity control */}
                  <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1 shrink-0">
                    <button
                      onClick={() => decreaseQuantity(item.foodItemId._id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-500 transition-colors"
                    >
                      <HiMinus size={14} />
                    </button>
                    <span className="text-sm font-semibold text-gray-900 w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.foodItemId)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                    >
                      <HiPlus size={14} />
                    </button>
                  </div>

                  {/* Line total + remove */}
                  <div className="flex flex-col items-end gap-2 shrink-0 w-20">
                    <span className="font-bold text-gray-900">
                      ₹{(item.foodItemId.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <HiOutlineTrash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="bg-gray-50 rounded-2xl p-6 h-fit sticky top-28">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>Delivery fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>

              <hr className="border-gray-200 mb-4" />

              <div className="flex items-center justify-between text-base font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={async () => {
                  try {

                    const orderData = {

                      restaurantId: cartItems[0].foodItemId.restaurantId,

                      items: cartItems.map(item => ({
                        foodItemId: item.foodItemId._id,
                        quantity: item.quantity
                      })),

                      deliveryAddress: "My Address"

                    };



                    const response = await placeOrder(orderData);


                    alert("Order placed successfully");

                    navigate("/order");

                  } catch (error) {
                    console.log("Full Error:", error);

                    alert("Order failed");
                  }
                }}
                className="w-full bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-white font-bold py-3.5 rounded-xl"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;