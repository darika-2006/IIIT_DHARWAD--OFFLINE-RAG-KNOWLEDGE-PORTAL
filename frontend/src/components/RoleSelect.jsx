import { motion } from "framer-motion";
import { Shield, Users } from "lucide-react";

export default function RoleSelect({ setRole }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="max-w-2xl w-full border border-avionics-blue/30 rounded-2xl overflow-hidden glass-panel relative z-10 shadow-2xl shadow-avionics-blue/20">
        
        {/* Right Panel - Interaction (Now Full Width) */}
        <div className="p-12 flex flex-col justify-center bg-slate-900/50 backdrop-blur-sm relative">
             <div className="absolute top-4 right-4 text-xs text-slate-500 font-mono">
                THE HACKALTITUDE V2.5
             </div>

          <h2 className="text-3xl font-mono mb-8 text-center bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">SELECT CLEARANCE</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(14, 165, 233, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole("admin")}
              className="group p-6 border border-slate-700 hover:border-avionics-blue rounded-xl bg-slate-800/50 transition-all cursor-pointer flex flex-col items-center gap-4 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-avionics-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Shield className="w-12 h-12 text-slate-400 group-hover:text-avionics-blue transition-colors" />
              <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-avionics-blue">ADMIN</h3>
                  <p className="text-xs text-slate-500 mt-1">System Configuration & Data Ingestion</p>
              </div>
              <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100">
                  <div className="w-2 h-2 bg-avionics-blue rounded-full shadow-[0_0_5px_#0ea5e9]"></div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.1)" }} // Green for Employee
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole("employee")}
              className="group p-6 border border-slate-700 hover:border-radar-green rounded-xl bg-slate-800/50 transition-all cursor-pointer flex flex-col items-center gap-4 text-center relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-radar-green/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Users className="w-12 h-12 text-slate-400 group-hover:text-radar-green transition-colors" />
              <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-radar-green">EMPLOYEE</h3>
                  <p className="text-xs text-slate-500 mt-1">Chat & Information Retrieval</p>
              </div>
               <div className="absolute bottom-0 right-0 p-2 opacity-0 group-hover:opacity-100">
                  <div className="w-2 h-2 bg-radar-green rounded-full shadow-[0_0_5px_#10b981]"></div>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}


