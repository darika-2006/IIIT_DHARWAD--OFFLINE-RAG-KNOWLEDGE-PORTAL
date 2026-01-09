import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Preloader({ onComplete }) {
  
  useEffect(() => {
    // Show the splash screen for 5 seconds then finish
    const timer = setTimeout(() => {
        onComplete();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center font-mono text-center overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        {/* Radar Sweep Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]"></div>

        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="z-10 relative space-y-8 p-6"
        >
            <motion.div variants={item}>
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-avionics-blue via-white to-avionics-blue drop-shadow-[0_0_10px_rgba(14,165,233,0.8)] tracking-widest">
                    HAL AEROTHON '26
                </h1>
                <div className="h-1 w-32 bg-avionics-blue mx-auto mt-4 rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
            </motion.div>

            <motion.div variants={item} className="space-y-2">
                <h2 className="text-sm text-slate-400 uppercase tracking-[0.2em] mb-2">Team Identity</h2>
                <div className="text-2xl md:text-3xl font-bold text-radar-green drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">
                    THE HACKALTITUDE
                </div>
            </motion.div>

             <motion.div variants={item} className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl backdrop-blur-sm max-w-2xl mx-auto shadow-2xl">
                <h3 className="text-xs text-avionics-blue mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Operational Unit Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 text-sm md:text-base">
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                        <span className="w-1.5 h-1.5 bg-radar-green rounded-full animate-pulse"></span> DARIKA S
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                         <span className="w-1.5 h-1.5 bg-radar-green rounded-full animate-pulse"></span> KEERTHANA
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                         <span className="w-1.5 h-1.5 bg-radar-green rounded-full animate-pulse"></span> SABARISASTHA V
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                         <span className="w-1.5 h-1.5 bg-radar-green rounded-full animate-pulse"></span> BALASUBRAMANIAN G
                    </div>
                </div>
            </motion.div>

            <motion.div variants={item} className="pt-8">
                 <div className="inline-flex items-center gap-2 text-xs text-slate-500 animate-pulse">
                     Loading System Resources...
                 </div>
            </motion.div>
        </motion.div>
    </div>
  );
}
