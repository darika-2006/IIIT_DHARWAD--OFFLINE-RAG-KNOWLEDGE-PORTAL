import { Shield, WifiOff, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityShield() {
  return (
    <motion.div 
        className="fixed top-4 right-4 z-50 flex items-center gap-2 group cursor-default"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
    >
        <div className="bg-slate-900/80 backdrop-blur-md border border-radar-green/30 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)] group-hover:border-radar-green/80 transition-all overflow-hidden max-w-[40px] group-hover:max-w-[300px] duration-500 ease-in-out whitespace-nowrap">
            <div className="relative">
                <Shield className="w-4 h-4 text-radar-green" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-radar-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-radar-green"></span>
                </span>
            </div>
            
            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300">
                <span className="text-[10px] font-bold text-radar-green uppercase tracking-wide flex items-center gap-2">
                    <WifiOff size={10} /> Internet: Disconnected (Secure)
                </span>
                <span className="text-[9px] text-slate-400 font-mono flex items-center gap-2">
                     <Database size={8} /> Data Residency: Localhost
                </span>
            </div>
        </div>
    </motion.div>
  );
}
