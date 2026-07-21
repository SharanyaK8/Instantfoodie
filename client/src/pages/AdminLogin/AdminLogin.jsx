import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import burgerImg from "../../assets/burger.png";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const navigate = useNavigate();
  const { login, authLoading } = useAuth();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (e, targetUrl) => {
    e.preventDefault();
    setIsMerging(true);
    setTimeout(() => navigate(targetUrl), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login({
      email,
      password,
      role: "admin",
    });

    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-neutral-950 px-4 overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_38%,rgba(59,130,246,0.22),transparent_65%)] animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-full bg-gradient-to-b from-sky-300/35 via-sky-500/10 to-transparent blur-2xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-40 bg-sky-600/25 blur-3xl rounded-full" />
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle,rgba(59,130,246,0.5)_1px,transparent_1px)] bg-[length:50px_50px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,transparent_30%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative w-full max-w-md flex items-center justify-center">
        <motion.div
          className="absolute w-[280px] h-[280px] sm:w-[430px] sm:h-[430px] z-0 pointer-events-none filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 58%, 0 46%)" }}
          initial={{
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            rotate: 0,
            scale: 1.1,
          }}
          animate={
            isMerging
              ? {
                  top: "50%",
                  left: "50%",
                  x: "-50%",
                  y: "-50%",
                  rotate: 0,
                  scale: 1.1,
                }
              : {
                  top: isMobile ? "-25%" : "-40%",
                  left: isMobile ? "-10%" : "-30%",
                  x: "0%",
                  y: "0%",
                  rotate: -18,
                  scale: 1.15,
                }
          }
          transition={{ type: "spring", stiffness: 80, damping: 14 }}
        >
          <img
            src={burgerImg}
            alt="Burger"
            className="w-full h-full object-contain"
          />
        </motion.div>

        <motion.div
          className="absolute w-[280px] h-[280px] sm:w-[430px] sm:h-[430px] z-0 pointer-events-none filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]"
          style={{ clipPath: "polygon(0 44%, 100% 56%, 100% 100%, 0 100%)" }}
          initial={{
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            rotate: 0,
            scale: 1.1,
          }}
          animate={
            isMerging
              ? {
                  top: "50%",
                  left: "50%",
                  x: "-50%",
                  y: "-50%",
                  rotate: 0,
                  scale: 1.1,
                }
              : {
                  top: isMobile ? "65%" : "45%",
                  left: isMobile ? "40%" : "52%",
                  x: "-20%",
                  y: "5%",
                  rotate: -12,
                  scale: 1.15,
                }
          }
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 14,
            delay: 0.02,
          }}
        >
          <img
            src={burgerImg}
            alt="Burger"
            className="w-full h-full object-contain"
          />
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="relative z-10 w-full bg-zinc-900/85 backdrop-blur-xl border border-sky-500/10 rounded-[24px] sm:rounded-[28px] p-6 sm:p-8 shadow-[0_32px_64px_rgba(0,0,0,0.7),0_0_60px_-15px_rgba(14,165,233,0.3)]"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 text-center">
            🛡️ Admin Login
          </h2>
          <p className="text-neutral-400 mb-6 text-center text-xs sm:text-sm">
            Use your admin credentials to manage the platform.
          </p>

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-neutral-950/40 rounded-xl px-4 py-3 mb-4 text-white placeholder:text-neutral-600 outline-none border border-neutral-800/80 focus:border-sky-500"
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-neutral-950/40 rounded-xl px-4 py-3 pr-14 text-white placeholder:text-neutral-600 outline-none border border-neutral-800/80 focus:border-sky-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-sky-500"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-neutral-950 font-bold py-3 rounded-xl shadow-lg shadow-sky-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {authLoading ? "Logging in..." : "Admin Sign In"}
          </button>

          <p className="text-center text-neutral-400 text-xs sm:text-sm mt-6">
            Need a restaurant login?{" "}
            <Link
              to="/restaurant-login"
              onClick={(e) => handleNavClick(e, "/restaurant-login")}
              className="text-sky-400 font-bold hover:underline ml-1"
            >
              Restaurant login
            </Link>
          </p>
          <p className="text-center text-neutral-400 text-xs sm:text-sm mt-2">
            Customer?{" "}
            <Link
              to="/login"
              onClick={(e) => handleNavClick(e, "/login")}
              className="text-sky-400 font-bold hover:underline ml-1"
            >
              Customer login
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default AdminLogin;
