import { useState, useRef, useEffect } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Send,  FileText, Shield, Rocket, Clock, Database, ChevronRight, Terminal, WifiOff } from "lucide-react";

// Mock History Data Removed


const TypewriterText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState("");
    
    useEffect(() => {
        let i = 0;
        const speed = 20;
        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text]);

    return <span>{displayedText}</span>;
};

export default function EmployeeUI() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
     {
         id: 'init',
         text: "Secure Channel Established. Ready for queries.",
         sender: "bot",
         timestamp: new Date(),
     }
  ]);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await api.post("/query", {
        query: inputValue,
        role: "user",
      });

      // Construct answer from results if no explicit answer field
      let answerText = response.data.answer;
      if (!answerText && response.data.results && response.data.results.length > 0) {
          // Fallback if backend doesn't provide generated answer
          answerText = "Retrieving relevant intelligence packets..."; 
          if (response.data.answer === "No relevant information found in the uploaded documents.") {
              answerText = response.data.answer;
          }
      }
      
      const botMessage = {
        id: Date.now() + 1,
        text: answerText || (response.data.results && response.data.results.length > 0 ? "Intelligence retrieval complete. Analyzing fragments." : "No intelligence found on this frequency."),
        sender: "bot",
        timestamp: new Date(),
        citations: response.data.results || []
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Transmission Failure: Link unstable.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex bg-slate-900 h-screen overflow-hidden text-slate-100 font-sans relative">
         {/* Background Grids */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Sidebar Removed as requested */}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-0">
        
        {/* Header */}
        <header className="h-14 border-b border-avionics-blue/20 flex items-center justify-between px-6 bg-slate-950/80 backdrop-blur-sm z-20">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-radar-green animate-pulse"></div>
                                <h2 className="flex items-center gap-2 text-avionics-blue font-mono font-bold uppercase tracking-wider">
                    <Terminal className="w-4 h-4" /> RAG System Interaction Console
                </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1"><Rocket size={12} /> Think | Build | Fly</span>
                <span> </span>
                <span> </span>
                <span className="flex items-center gap-1"><Database size={12} /> LOCAL DB</span>
            </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar pb-32">
          {messages.map((msg) => (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div className={`max-w-[80%] rounded-lg p-4 border relative ${
                msg.sender === "user" 
                  ? "bg-avionics-blue/10 border-avionics-blue/30 text-slate-100 rounded-tr-none" 
                  : "bg-slate-900/80 border-slate-700 text-radar-green rounded-tl-none font-mono"
              }`}>
                {/* Decorative Corner */}
                <div className={`absolute top-[-1px] ${msg.sender === "user" ? "right-[-1px] border-r border-t" : "left-[-1px] border-l border-t"} border-current w-2 h-2`}></div>

                {msg.sender === "bot" && (
                     <div className="flex items-center gap-2 mb-2 text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">
                        <Terminal size={12} /> Incoming Transmission
                     </div>
                )}

                <div className="leading-relaxed text-sm">
                    {msg.sender === 'bot' ? <TypewriterText text={msg.text} /> : msg.text}
                </div>
                
                <div className="mt-2 text-[10px] opacity-50 flex justify-end">
                    {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 max-w-[80%]">
                      {msg.citations.map((cit, idx) => (
                           <motion.div 
                                whileHover={{ scale: 1.05 }}
                                key={idx} 
                                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded text-xs text-avionics-blue hover:border-avionics-blue hover:bg-avionics-blue/10 cursor-pointer transition-colors"
                           >
                               <FileText size={12} />
                               <span className="truncate max-w-[150px]">{cit.document || "Unknown Source"}</span>
                               {cit.page_number && <span className="text-slate-500">Pg {cit.page_number}</span>}
                           </motion.div>
                      ))}
                  </div>
              )}
            </motion.div>
          ))}
          {loading && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-avionics-blue font-mono text-xs">
                 <div className="w-2 h-2 bg-avionics-blue rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-avionics-blue rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-avionics-blue rounded-full animate-bounce delay-150"></div>
                 DECRYPTING RESPONSE...
             </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-10 left-0 w-full px-6 py-4 bg-gradient-to-t from-slate-900 to-transparent z-20">
           <div className="max-w-4xl mx-auto flex gap-2 items-center bg-slate-950/80 border border-avionics-blue/50 p-2 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(14,165,233,0.1)] focus-within:shadow-[0_0_20px_rgba(14,165,233,0.3)] focus-within:border-avionics-blue transition-all">
                <div className="pl-3 text-avionics-blue font-mono select-none pointer-events-none py-2">{'>'}</div>
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="ENTER COMMAND OR QUERY..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono placeholder-slate-600 h-10"
                />
                <button 
                    onClick={sendMessage}
                    className="p-2 bg-avionics-blue/20 text-avionics-blue rounded hover:bg-avionics-blue hover:text-white transition-all border border-avionics-blue/50"
                >
                    <Send size={18} />
                </button>
           </div>
        </div>
        
        {/* Status Footer */}
        <div className="h-8 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-4 text-[10px] text-slate-500 font-mono z-30 select-none">
            <div className="flex gap-4">
                 <span className="flex items-center gap-1 text-radar-green"><div className="w-1.5 h-1.5 rounded-full bg-radar-green"></div> HAL AEROTHON '26</span>

                 <span>9TH JAN 2026 TO 10TH JAN 2026</span>
            </div>
            <div>
                The HACKALTITUDE 2.1.0-ALPHA // OFFLINE MODE
            </div>
        </div>
        

      </div>
    </div>
  );
}
