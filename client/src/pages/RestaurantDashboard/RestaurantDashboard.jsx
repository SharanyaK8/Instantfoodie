import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    HiOutlineClipboardDocumentList,
    HiOutlineFire,
    HiOutlineCurrencyRupee,
    HiOutlineClock,
    HiOutlinePlusCircle,
    HiOutlineSquares2X2,
    HiOutlineTruck,
    HiOutlineUser,
} from "react-icons/hi2";
import Navbar from "../../components/Navbar";
import { getMyRestaurants } from "../../services/restaurant.service";
import { getMyFoodItems } from "../../services/food.service";
import { getRestaurantOrders } from "../../services/order.service";

const statusColors = {
    Placed: "bg-amber-500/10 text-amber-400",
    Preparing: "bg-blue-500/10 text-blue-400",
    "Out for Delivery": "bg-purple-500/10 text-purple-400",
    Delivered: "bg-green-500/10 text-green-400",
    Cancelled: "bg-red-500/10 text-red-400",
};

function RestaurantDashboard() {
    const [loading, setLoading] = useState(true);
    const [restaurantName, setRestaurantName] = useState("");
    const [totalFoods, setTotalFoods] = useState(0);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            const [restaurantData, foodData, orderData] = await Promise.all([
                getMyRestaurants().catch(() => null),
                getMyFoodItems().catch(() => null),
                getRestaurantOrders(1, 100).catch(() => null),
            ]);

            const restaurant = restaurantData?.restaurants?.[0];
            setRestaurantName(restaurant?.restaurantName || "your restaurant");

            setTotalFoods(foodData?.FoodItems?.length || 0);
            setOrders(orderData?.Orders || []);
        } catch (err) {
            console.log("Dashboard load error:", err);
        } finally {
            setLoading(false);
        }
    }

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(
        (o) => o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled"
    ).length;
    const revenue = orders
        .filter((o) => o.orderStatus === "Delivered")
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const recentOrders = orders.slice(0, 5);

    const stats = [
        {
            label: "Total Orders",
            value: totalOrders,
            icon: <HiOutlineClipboardDocumentList size={26} />,
            accent: "from-amber-500/20 to-transparent text-amber-400",
        },
        {
            label: "Total Foods",
            value: totalFoods,
            icon: <HiOutlineFire size={26} />,
            accent: "from-orange-500/20 to-transparent text-orange-400",
        },
        {
            label: "Revenue",
            value: `₹${revenue.toLocaleString("en-IN")}`,
            icon: <HiOutlineCurrencyRupee size={26} />,
            accent: "from-green-500/20 to-transparent text-green-400",
        },
        {
            label: "Pending Orders",
            value: pendingOrders,
            icon: <HiOutlineClock size={26} />,
            accent: "from-red-500/20 to-transparent text-red-400",
        },
    ];

    const quickActions = [
        { label: "Add Food", icon: <HiOutlinePlusCircle size={22} />, path: "/restaurant-menu", openAdd: true },
        { label: "Manage Food", icon: <HiOutlineSquares2X2 size={22} />, path: "/restaurant-menu" },
        { label: "View Orders", icon: <HiOutlineTruck size={22} />, path: "/restaurant-orders" },
        { label: "Profile", icon: <HiOutlineUser size={22} />, path: "/restaurant-profile" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505]">
                <Navbar />
                <h2 className="text-white p-10">Loading dashboard...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505]">
            <Navbar />

            <div className="w-[95%] max-w-5xl mx-auto py-10">
                {/* Welcome header */}
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-black text-white flex items-center gap-2">
                        🍴 Welcome, <span className="text-amber-500">{restaurantName}</span>
                    </h1>
                    <p className="text-neutral-400 mt-2">
                        Here's how your restaurant is performing today.
                    </p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`relative overflow-hidden bg-zinc-900 border border-neutral-800 rounded-3xl p-5 hover:border-amber-500/40 transition-colors`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-40`} />
                            <div className="relative z-10">
                                <div className={`mb-3 ${stat.accent.split(" ").pop()}`}>{stat.icon}</div>
                                <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
                                <p className="text-neutral-400 text-xs sm:text-sm mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick actions */}
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            to={action.path}
                            state={action.openAdd ? { openAdd: true } : undefined}
                            className="flex flex-col items-center justify-center gap-2 bg-zinc-900 border border-neutral-800 hover:border-amber-500/50 hover:bg-zinc-800/60 rounded-2xl py-6 transition-all active:scale-95"
                        >
                            <span className="text-amber-500">{action.icon}</span>
                            <span className="text-white text-sm font-semibold">{action.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Recent orders */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                    <Link
                        to="/restaurant-orders"
                        className="text-amber-500 text-sm font-semibold hover:underline"
                    >
                        View all
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <p className="text-neutral-400">No orders yet.</p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {recentOrders.map((order) => (
                            <div
                                key={order._id}
                                className="flex items-center justify-between bg-zinc-900 border border-neutral-800 rounded-2xl px-5 py-4"
                            >
                                <div>
                                    <p className="text-white font-bold text-sm">
                                        Order #{order.orderId}
                                    </p>
                                    <p className="text-neutral-500 text-xs mt-1">
                                        {order.items?.map((it) => `${it.name} x${it.quantity}`).join(", ")}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-white font-bold text-sm">₹{order.totalAmount}</span>
                                    <span
                                        className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${statusColors[order.orderStatus] || "bg-neutral-500/10 text-neutral-400"
                                            }`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RestaurantDashboard;