import { useState } from "react";
import api from "../api/authApi";
import { motion } from "framer-motion";
import { Users, ChevronRight, AlertTriangle, UserPlus } from "lucide-react";

export default function EmployeeAuth({ setEmployeeAuth, setUserContext }) {
  const [isSignUp, setIsSignUp] = useState(false);

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [domainRole, setDomainRole] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        // ---------- SIGNUP ----------
        await api.post("/signup", {
          user_id: userId,
          username: username,
          password: password,
          domain_role: domainRole,
        });

        setIsSignUp(false);
        setError("Registration successful. Please login.");
      } else {
        // ---------- LOGIN ----------
        const res = await api.post("/login", {
          username: username,
          password: password,
        });

        // 🔴 FRONTEND FIX #1: normalize role
        const accessRole =
          res.data.role?.toLowerCase() === "admin" ? "admin" : "user";

        setUserContext({
          user_id: res.data.user_id,
          username: res.data.username,
          role: accessRole, // ✅ always admin | user
        });

        // 🔴 FRONTEND FIX #2: clear old error
        setError("");
        setEmployeeAuth(true);
      }
    } catch (err) {
      console.error(err);
      setError(
        isSignUp
          ? "Registration failed. Check details."
          : "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-slate-100">
      <div className="w-full max-w-md border border-green-500/30 rounded-xl p-8 bg-slate-900/70">

        <div className="text-center mb-6">
          <Users className="mx-auto text-green-400 mb-2" size={40} />
          <h2 className="text-xl font-mono tracking-wider">
            {isSignUp ? "EMPLOYEE REGISTRATION" : "EMPLOYEE LOGIN"}
          </h2>
        </div>

        <div className="space-y-4">

          {isSignUp && (
            <input
              placeholder="USER ID"
              className="w-full p-3 bg-slate-800 rounded"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          )}

          <input
            placeholder="USERNAME"
            className="w-full p-3 bg-slate-800 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {isSignUp && (
            <input
              placeholder="ROLE (admin / anything else)"
              className="w-full p-3 bg-slate-800 rounded"
              value={domainRole}
              onChange={(e) => setDomainRole(e.target.value)}
            />
          )}

          <input
            type="password"
            placeholder="PASSWORD"
            className="w-full p-3 bg-slate-800 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-400 text-black font-bold py-3 rounded flex justify-center gap-2"
          >
            {loading
              ? "PROCESSING..."
              : isSignUp
              ? <>REGISTER <UserPlus size={16} /></>
              : <>LOGIN <ChevronRight size={16} /></>}
          </motion.button>

          <button
            className="text-xs text-green-400 underline w-full text-center"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
          >
            {isSignUp ? "Already registered? Login" : "No account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
