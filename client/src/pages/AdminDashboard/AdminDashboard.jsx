import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4">
      <div className="mx-auto max-w-5xl rounded-3xl border border-neutral-800 bg-[#111111]/90 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Admin dashboard</p>
            <h1 className="mt-3 text-4xl font-black">Welcome back, {user?.fullName || "Admin"}</h1>
            <p className="mt-2 text-neutral-400 max-w-2xl">
              Manage platform settings, monitor users, and review restaurant activity from here.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-neutral-950 transition hover:bg-amber-400"
          >
            Logout
          </button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-neutral-800 bg-zinc-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Admin overview</h2>
            <p className="mt-3 text-neutral-400">Use the admin panel to inspect orders, restaurants, and the user base.</p>
          </div>
          <div className="rounded-3xl border border-neutral-800 bg-zinc-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Your role</h2>
            <p className="mt-3 text-neutral-400">You are signed in as an <span className="font-semibold text-amber-400">{user?.role || "admin"}</span>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
