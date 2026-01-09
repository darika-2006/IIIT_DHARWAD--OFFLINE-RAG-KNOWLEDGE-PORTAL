import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";

export default function Preloader({ onComplete }) {
  
  useEffect(() => {
    // Total sequence time: 6 seconds
    const timer = setTimeout(() => {
        onComplete();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Animation for the Team Details (Appears AFTER jet leaves)
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delay: 2.8, // Wait slightly longer for flame effect to finish
        staggerChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Letters for the Big "HAL" reveal configuration
  const halLetters = [
    { char: "H", delay: 0.6 },
    { char: "A", delay: 0.9 },
    { char: "L", delay: 1.2 },
  ];

  // The "Fuel" gradient applied inside the text
  // Orange -> Yellow -> Faint White -> Transparent
  const fireGradient = "linear-gradient(to top, #f97316 0%, #eab308 20%, rgba(255,255,255,0.1) 40%, transparent 80%)";


  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col items-center justify-center font-mono text-center overflow-hidden cursor-wait">
        
        {/* --- BACKGROUND LAYERS --- */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]"></div>


        {/* --- LAYER 1: THE BIG "HAL" IGNITION REVEAL --- */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="flex gap-4 md:gap-8">
                {halLetters.map((letter, index) => (
                    <motion.div
                        key={index}
                        // Initial state: Dark, unlit, slightly below
                        initial={{ 
                            opacity: 0, 
                            scale: 0.8, 
                            y: 20, 
                            backgroundPosition: "0% 100%" // Start showing the "transparent/dark" top part of gradient
                        }}
                        // Animate state: Ignite!
                        animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: 0, 
                            backgroundPosition: "0% 0%" // Slide down to show the "fire" bottom part
                        }}
                        transition={{ 
                            delay: letter.delay, 
                            duration: 1.8, // Takes time for flame to rise through letter
                            ease: "easeOut",
                        }}
                        // CSS MAGIC FOR FLAME TEXT
                        style={{
                            backgroundImage: fireGradient,
                            backgroundSize: "100% 250%", // Make gradient taller than text so it can slide
                            WebkitBackgroundClip: "text", // Clip gradient to text shape
                            backgroundClip: "text",
                            color: "transparent", // Hide actual text color so gradient shows
                        }}
                        className="text-[150px] md:text-[250px] font-black leading-none select-none drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                    >
                        {letter.char}
                    </motion.div>
                ))}
            </div>
        </div>


        {/* --- LAYER 2: THE JET TAKEOFF (Center Bottom -> Top) --- */}
        <motion.div
            className="absolute z-30"
            initial={{ y: "120vh", x: "-50%", left: "50%" }} // Start BOTTOM
            animate={{ 
                y: "-120vh" // Fly to TOP
            }} 
            transition={{ 
                duration: 2.5, 
                ease: "easeInOut",
                delay: 0.2
            }}
        >
            {/* Wrapper for Rotation: Pointing UP */}
            <div className="relative transform -rotate-45"> 
                
                <Plane className="w-32 h-32 text-cyan-400 fill-slate-900 drop-shadow-[0_0_50px_rgba(34,211,238,0.8)]" />
                
                {/* The Jet's physical flame (keeps burning) */}
                <motion.div 
                   className="absolute -bottom-4 -left-4 w-24 h-8 bg-gradient-to-r from-transparent via-orange-500 to-yellow-300 blur-md rounded-full"
                   style={{ transformOrigin: "center right", transform: "rotate(135deg)" }} 
                   animate={{ scaleX: [1, 1.8, 1], opacity: [0.8, 1, 0.8] }}
                   transition={{ repeat: Infinity, duration: 0.1 }}
                />
            </div>
        </motion.div>


        {/* --- LAYER 3: TEAM CONTENT (Fades in after jet leaves) --- */}
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="z-40 relative space-y-8 p-6"
        >
            {/* ... (This section remains exactly the same as before) ... */}
            <motion.div variants={item}>
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-cyan-400 drop-shadow-[0_0_10px_rgba(14,165,233,0.8)] tracking-widest">
                    AEROTHON '26
                </h1>
                <div className="h-1 w-32 bg-cyan-500 mx-auto mt-4 rounded-full shadow-[0_0_10px_#0ea5e9]"></div>
            </motion.div>
            {/* ... rest of team details ... */}
             <motion.div variants={item} className="space-y-2">
                <h2 className="text-sm text-slate-400 uppercase tracking-[0.2em] mb-2">Team Identity</h2>
                <div className="text-2xl md:text-3xl font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]">
                    THE HACKALTITUDE
                </div>
            </motion.div>

             <motion.div variants={item} className="bg-slate-900/50 border border-slate-700 p-6 rounded-xl backdrop-blur-sm max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                
                <h3 className="text-xs text-cyan-400 mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Operational Unit Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-slate-300 text-sm md:text-base text-left">
                    <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></span> DARIKA S
                    </div>
                    <div className="flex items-center gap-3">
                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></span> KEERTHANA
                    </div>
                    <div className="flex items-center gap-3">
                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></span> SABARISASTHA V
                    </div>
                    <div className="flex items-center gap-3">
                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></span> BALASUBRAMANIAN G
                    </div>
                </div>
            </motion.div>

            <motion.div variants={item} className="pt-8">
                 <div className="inline-flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span className="w-2 h-2 border border-slate-500 border-t-transparent rounded-full animate-spin"></span>
                      INITIALIZING SYSTEM RESOURCES...
                 </div>
            </motion.div>
        </motion.div>
    </div>
  );
}