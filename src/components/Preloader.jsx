import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Power } from "lucide-react";

export default function Preloader({ onComplete }) {
  // 1. STATE: WAITING FOR USER INPUT
  const [hasLaunched, setHasLaunched] = useState(false);
  const [decodedName, setDecodedName] = useState("________________"); // Placeholder

  // The Target Name
  const TARGET_NAME = "THE HACKALTITUDE";

  // 2. THE LAUNCH HANDLER
  const handleLaunch = () => {
    setHasLaunched(true);
    
    // Start the total timer (Animation + Read time)
    setTimeout(() => {
        onComplete();
    }, 7500); // 7.5 seconds total show

    // Start the "Decode" effect after the jet passes (approx 3.5s mark)
    setTimeout(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDecodedName(prev => 
                TARGET_NAME.split("").map((letter, index) => {
                    if (index < iterations) return TARGET_NAME[index];
                    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*#"[Math.floor(Math.random() * 35)];
                }).join("")
            );
            
            if (iterations >= TARGET_NAME.length) clearInterval(interval);
            iterations += 1/3; 
        }, 30);
    }, 3200);
  };

  // --- ANIMATION VARIANTS ---
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { delay: 2.8, staggerChildren: 0.3 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const halLetters = [
    { char: "H", delay: 0.6 },
    { char: "A", delay: 0.9 },
    { char: "L", delay: 1.2 },
  ];

  const fireGradient = "linear-gradient(to top, #f97316 0%, #eab308 20%, rgba(255,255,255,0.1) 40%, transparent 80%)";

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center font-mono text-center overflow-hidden">
        
        {/* --- BACKGROUND --- */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]"></div>

        {/* --- PHASE 1: THE LAUNCH BUTTON --- */}
        <AnimatePresence>
            {!hasLaunched && (
                <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLaunch}
                    className="z-50 group relative px-8 py-4 bg-transparent border border-cyan-500/50 text-cyan-400 font-bold tracking-[0.3em] overflow-hidden rounded transition-colors hover:bg-cyan-500/10 hover:border-cyan-400"
                >
                    <span className="relative z-10 flex items-center gap-4">
                        <Power className="w-5 h-5 animate-pulse" />
                        INITIALIZE SYSTEM
                    </span>
                    {/* Glowing background sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                </motion.button>
            )}
        </AnimatePresence>


        {/* --- PHASE 2: THE ANIMATION SEQUENCE (Only renders after click) --- */}
        {hasLaunched && (
            <>
                {/* 1. HAL IGNITION REVEAL */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="flex gap-4 md:gap-8">
                        {halLetters.map((letter, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8, y: 20, backgroundPosition: "0% 100%" }}
                                animate={{ opacity: 1, scale: 1, y: 0, backgroundPosition: "0% 0%" }}
                                transition={{ delay: letter.delay, duration: 1.8, ease: "easeOut" }}
                                style={{
                                    backgroundImage: fireGradient,
                                    backgroundSize: "100% 250%",
                                    WebkitBackgroundClip: "text",
                                    backgroundClip: "text",
                                    color: "transparent",
                                }}
                                className="text-[150px] md:text-[250px] font-black leading-none select-none drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                            >
                                {letter.char}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 2. JET TAKEOFF */}
                <motion.div
                    className="absolute z-30"
                    initial={{ y: "120vh", x: "-50%", left: "50%" }}
                    animate={{ y: "-120vh" }}
                    transition={{ duration: 2.5, ease: "easeInOut", delay: 0.2 }}
                >
                    <div className="relative transform -rotate-45"> 
                        <Plane className="w-32 h-32 text-cyan-400 fill-slate-900 drop-shadow-[0_0_50px_rgba(34,211,238,0.8)]" />
                        <motion.div 
                           className="absolute -bottom-4 -left-4 w-24 h-8 bg-gradient-to-r from-transparent via-orange-500 to-yellow-300 blur-md rounded-full"
                           style={{ transformOrigin: "center right", transform: "rotate(135deg)" }}
                           animate={{ scaleX: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
                           transition={{ repeat: Infinity, duration: 0.1 }}
                        />
                    </div>
                </motion.div>

                {/* 3. TEAM CONTENT + DECODING EFFECT */}
                <motion.div variants={container} initial="hidden" animate="show" className="z-40 relative space-y-8 p-6">
                    <motion.div variants={item}>
                        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-400 drop-shadow-[0_0_10px_rgba(14,165,233,0.8)] tracking-widest">
                            AEROTHON '26
                        </h1>
                        <div className="h-1 w-32 bg-cyan-500 mx-auto mt-4 rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
                    </motion.div>

                    <motion.div variants={item} className="space-y-2">
                        <h2 className="text-sm text-slate-400 uppercase tracking-[0.2em] mb-2">Team Identity</h2>
                        <div className="text-2xl md:text-3xl font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)] font-mono">
                            {decodedName}
                        </div>
                    </motion.div>

                    {/* Keep your existing team members list here... */}
                     <motion.div variants={item} className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl backdrop-blur-sm max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        <h3 className="text-xs text-cyan-400 mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Operational Unit Members</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-slate-300 text-sm md:text-base text-left">
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> DARIKA S
                            </div>
                            <div className="flex items-center gap-3">
                                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> KEERTHANA
                            </div>
                            <div className="flex items-center gap-3">
                                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> SABARISASTHA V
                            </div>
                            <div className="flex items-center gap-3">
                                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> BALASUBRAMANIAN G
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </>
        )}
    </div>
  );
}