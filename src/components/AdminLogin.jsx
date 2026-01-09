import { useState, useEffect } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Fingerprint, Lock, ChevronRight, Shield, AlertTriangle } from "lucide-react";

export default function AdminLogin({ setAdminAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError(false);
    try {
      await api.post("/admin/login", { username, password });
      setAdminAuth(true);
    } catch {
      setError(true);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="max-w-xl w-full border border-avionics-blue/30 rounded-2xl overflow-hidden glass-panel relative z-10 shadow-2xl shadow-avionics-blue/20">
        
        {/* Right Panel - Login Form (Now Full Width) */}
        <div className="p-12 flex flex-col justify-center bg-slate-900/50 backdrop-blur-sm relative">
             <div className="mb-8 text-center relative">
                 <div className="inline-block p-4 rounded-full bg-avionics-blue/10 border border-avionics-blue/30 mb-4 relative">
                     <Fingerprint className="w-10 h-10 text-avionics-blue animate-pulse" />
                     <div className="absolute inset-0 rounded-full border border-avionics-blue/50 animate-ping opacity-20"></div>
                 </div>
                 <h2 className="text-2xl font-mono text-white">ADMIN ACCESS</h2>
                 <p className="text-sm text-slate-500 mt-2">Biometric Simulation Active</p>
             </div>

             <div className="space-y-6 max-w-sm mx-auto w-full">
                 <div className="relative group">
                     <span className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-avionics-blue opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">[</span>
                     <input
                        className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-3 rounded-md focus:border-avionics-blue focus:ring-1 focus:ring-avionics-blue outline-none transition-all duration-300 font-mono text-sm"
                        placeholder="IDENTIFIER (Username)"
                        onChange={(e) => setUsername(e.target.value)}
                     />
                     <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-avionics-blue opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">]</span>
                 </div>
                 
                 <div className="relative group">
                     <span className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-avionics-blue opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">[</span>
                     <input
                        type="password"
                        className="w-full bg-slate-950/50 border border-slate-700 text-slate-100 px-4 py-3 rounded-md focus:border-avionics-blue focus:ring-1 focus:ring-avionics-blue outline-none transition-all duration-300 font-mono text-sm"
                        placeholder="ACCESS KEY (Password)"
                        onChange={(e) => setPassword(e.target.value)}
                     />
                     <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-avionics-blue opacity-0 group-focus-within:opacity-100 transition-opacity font-mono text-xs">]</span>
                 </div>

                 {error && (
                     <div className="flex items-center gap-2 text-red-500 text-xs font-mono p-2 bg-red-500/10 border border-red-500/20 rounded">
                         <AlertTriangle className="w-4 h-4" /> ACCESS DENIED: Invalid Credentials
                     </div>
                 )}

                 <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={login}
                    disabled={loading}
                    className="w-full py-4 bg-avionics-blue text-slate-900 font-bold tracking-widest uppercase hover:bg-avionics-blue/90 transition-colors clip-path-polygon flex items-center justify-center gap-2 relative overflow-hidden"
                    style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
                 >
                    {loading ? "AUTHENTICATING..." : <>ENGAGE SYSTEM <ChevronRight size={18} /></>}
                 </motion.button>
             </div>
        </div>
      </div>
    </div>
  );
  
}

