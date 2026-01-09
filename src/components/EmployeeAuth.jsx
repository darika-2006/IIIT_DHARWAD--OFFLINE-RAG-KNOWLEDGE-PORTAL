import { useState } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Users, Lock, ChevronRight, AlertTriangle, UserPlus, LogIn } from "lucide-react";

export default function EmployeeAuth({ setEmployeeAuth }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);
    try {
      const endpoint = isSignUp ? "/signup" : "/login";
      const payload = isSignUp 
        ? { userID, username, userRole, password } 
        : { userID, password };
      
      await api.post(endpoint, payload);
      // If signup is successful, we might want to auto login or ask them to login. 
      // For smooth UX, let's assume auto-auth or just auth success.
      // But usually signup returns a user/token just like login.
      setEmployeeAuth(true);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
        {/* Background Grids - Green Tint */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="max-w-xl w-full border border-radar-green/30 rounded-2xl overflow-hidden glass-panel relative z-10 shadow-2xl shadow-radar-green/20">
        
        {/* Auth Panel */}
        <div className="p-12 flex flex-col justify-center bg-slate-900/50 backdrop-blur-sm relative">
             <div className="mb-8 text-center relative">
                 <div className="inline-block p-4 rounded-full bg-radar-green/10 border border-radar-green/30 mb-4 relative">
                     <Users className="w-10 h-10 text-radar-green animate-pulse" />
                     <div className="absolute inset-0 rounded-full border border-radar-green/50 animate-ping opacity-20"></div>
                 </div>
                 <h2 className="text-2xl font-mono text-white tracking-wider">
                    {isSignUp ? "PERSONNEL REGISTRATION" : "EMPLOYEE AUTH"}
                 </h2>
                 <p className="text-sm text-slate-500 mt-2">SECURE LINE ESTABLISHED</p>
             </div>

             <div className="space-y-6 max-w-sm mx-auto w-full">

                 <div className="relative group">
                     <span className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-radar-green opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">[</span>
                     <input
                        className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-3 rounded-md focus:border-radar-green focus:ring-1 focus:ring-radar-green outline-none transition-all duration-300 font-mono text-sm"
                        placeholder="USER ID"
                        value={userID}
                        onChange={(e) => setUserID(e.target.value)}
                     />
                     <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-radar-green opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">]</span>
                 </div>
                 
                 {isSignUp && (
                    <>
                        <div className="relative group">
                            <span className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-radar-green opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">[</span>
                            <input
                                className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-3 rounded-md focus:border-radar-green focus:ring-1 focus:ring-radar-green outline-none transition-all duration-300 font-mono text-sm"
                                placeholder="USERNAME"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-radar-green opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">]</span>
                        </div>
                        <div className="relative group">
                            <span className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-radar-green opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">[</span>
                            <input
                                className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-3 rounded-md focus:border-radar-green focus:ring-1 focus:ring-radar-green outline-none transition-all duration-300 font-mono text-sm"
                                placeholder="USER ROLE"
                                value={userRole}
                                onChange={(e) => setUserRole(e.target.value)}
                            />
                            <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-radar-green opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">]</span>
                        </div>
                    </>
                 )}
                 
                 <div className="relative group">
                     <span className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-radar-green opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">[</span>
                     <input
                        type="password"
                        className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-3 rounded-md focus:border-radar-green focus:ring-1 focus:ring-radar-green outline-none transition-all duration-300 font-mono text-sm"
                        placeholder="ACCESS KEY (Password)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                     <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-radar-green opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">]</span>
                 </div>

                 {error && (
                     <div className="flex items-center gap-2 text-red-500 text-xs font-mono p-2 bg-red-500/10 border border-red-500/20 rounded">
                         <AlertTriangle className="w-4 h-4" /> 
                         {isSignUp ? "REGISTRATION FAILED" : "ACCESS DENIED: Invalid Credentials"}
                     </div>
                 )}

                 <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 bg-radar-green text-slate-900 font-bold tracking-widest uppercase hover:bg-radar-green/90 transition-colors clip-path-polygon flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
                 >
                    {loading ? "PROCESSING..." : (isSignUp ? <>INITIATE REGISTRATION <UserPlus size={18} /></> : <>AUTHENTICATE <ChevronRight size={18} /></>)}
                 </motion.button>

                 <div className="text-center mt-4">
                     <button 
                        className="text-slate-400 hover:text-radar-green text-xs font-mono underline underline-offset-4 transition-colors"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setError(false);
                            // Clear fields when switching? Maybe not required, but helpful.
                            // but userID and password are shared, so keep them.
                        }}
                     >
                         {isSignUp ? "ALREADY CREDENTIALED? LOGIN" : "NO CREDENTIALS? REGISTER"}
                     </button>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
}
