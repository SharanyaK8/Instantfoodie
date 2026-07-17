import { createContext, useContext, useEffect, useState, useRef } from "react";
import * as cartService from "../services/cart.service";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [switchPrompt, setSwitchPrompt] = useState(null); 
  const resolveSwitchRef = useRef(null);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
     if (!authLoading && user?.role === "user") {
      loadCart();
    }
  }, [authLoading, user]);

  const loadCart = async () => {
    try {
      const data = await cartService.getCart();
      setCartItems(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getItemQuantity = (foodId) => {
    const item = cartItems.find(
      (i) => i.foodItemId?._id === foodId
    );

    return item ? item.quantity : 0;
  };

  const increaseQuantity = async (dish) => {
    try {
      const existing = cartItems.find(
        (i) => i.foodItemId?._id === dish._id
      );

      if (existing) {
        await cartService.updateCart(
          existing._id,
          existing.quantity + 1
        );
        loadCart();
        return;
      }

      const currentRestaurantId = cartItems[0]?.foodItemId?.restaurantId;

      if (
        currentRestaurantId &&
        dish.restaurantId &&
        currentRestaurantId !== dish.restaurantId
      ) {
        const confirmed = await new Promise((resolve) => {
          resolveSwitchRef.current = resolve;
          setSwitchPrompt({ dish });
        });

        if (!confirmed) return;

        await cartService.clearCart();
      }

      await cartService.addToCart(dish._id, 1);
      loadCart();
    } catch (err) {
      console.log(err);
    }
  };

  const resolveSwitchPrompt = (confirmed) => {
    setSwitchPrompt(null);
    if (resolveSwitchRef.current) {
      resolveSwitchRef.current(confirmed);
      resolveSwitchRef.current = null;
    }
  };

  const decreaseQuantity = async (foodId) => {
    try {
      const existing = cartItems.find(
        (i) => i.foodItemId?._id === foodId
      );

      if (!existing) return;

      if (existing.quantity === 1) {
        await cartService.removeCart(existing._id);
      } else {
        await cartService.updateCart(
          existing._id,
          existing.quantity - 1
        );
      }

      loadCart();
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromCart = async (cartId) => {
    await cartService.removeCart(cartId);
    loadCart();
  };

  const clearCart = async () => {
    await cartService.clearCart();
    loadCart();
  };

  // ===== NEW: reorder items from a past order =====
  const reorderItems = async (items) => {
    try {
      for (const item of items) {
        const existing = cartItems.find(
          (i) => i.foodItemId?._id === item.foodItemId
        );

        if (existing) {
          await cartService.updateCart(existing._id, existing.quantity + item.quantity);
        } else {
          await cartService.addToCart(item.foodItemId, item.quantity);
        }
      }
      await loadCart();
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  };

  const cartCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (sum, item) =>
      sum + item.foodItemId.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        getItemQuantity,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        loadCart,
        reorderItems,
      }}
    >
      {children}

      {switchPrompt && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-amber-500/20 rounded-3xl p-6 shadow-[0_32px_64px_rgba(0,0,0,0.7)]">
            <h3 className="text-white font-bold text-lg mb-2">
              Start a new order?
            </h3>
            <p className="text-neutral-400 text-sm mb-6">
              Your cart has items from another restaurant. Adding{" "}
              <span className="text-white font-semibold">
                {switchPrompt.dish.name}
              </span>{" "}
              will clear your current cart first.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => resolveSwitchPrompt(false)}
                className="flex-1 bg-zinc-950 border border-neutral-700 text-white font-semibold py-3 rounded-xl hover:bg-neutral-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => resolveSwitchPrompt(true)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold py-3 rounded-xl transition-colors"
              >
                Clear & Add
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);