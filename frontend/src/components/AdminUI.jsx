import { useState, useEffect, useRef } from "react";
// import api from "../api";
import api from "../api/queryApi";

import { motion, AnimatePresence } from "framer-motion";
import { Rocket } from 'lucide-react';
import { Upload, FileText, Server, Activity, CheckCircle, Database, Shield, Send, Terminal, Wifi } from "lucide-react";

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

export default function AdminUI() {
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  // Kept simple indexing params for feedback
  const [indexingParams, setIndexingParams] = useState({ progress: 0, status: "" });
  
  // Chat State
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
     {
         id: 'init',
         text: "Admin Secure Channel. RAG System Ready.",
         sender: "bot",
         timestamp: new Date(),
     }
  ]);
  const messagesEndRef = useRef(null);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

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
    setChatLoading(true);

    try {
      const response = await api.post("/query", {
        query: inputValue,
        role: "admin",
      });

      let answerText = response.data.answer;
      if (!answerText && response.data.results && response.data.results.length > 0) {
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
        text: "Transmission Failure...",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setChatLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const handleFileChange = (e) => {
      setFiles(Array.from(e.target.files));
      setIndexingParams({ progress: 0, status: "" });
  };

  const handleDrop = (e) => {
      e.preventDefault();
      setFiles(Array.from(e.dataTransfer.files));
      setIndexingParams({ progress: 0, status: "" });
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    
    setUploading(true);

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("allowed_roles", "admin,user");
    formData.append("uploaded_by", "admin");

    try {
      setIndexingParams({ progress: 20, status: "Uploading..." });
      
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      setIndexingParams({ progress: 50, status: "Vectorizing..." });
      
      // Simulate indexing delay
      setTimeout(() => {
          setIndexingParams({ progress: 80, status: "Updating Index..." });
      }, 1000);

      setTimeout(() => {
          setIndexingParams({ progress: 100, status: "Complete" });
          setUploading(false);
          setFiles([]);
          setTimeout(() => setIndexingParams({ progress: 0, status: "" }), 3000);
      }, 2500);

    } catch {
      setUploading(false);
      setIndexingParams({ progress: 0, status: "Error: Upload Failed" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6 overflow-x-hidden relative flex flex-col items-center">
      {/* Background Grid */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-avionics-blue/10 border border-avionics-blue/30 rounded-lg">
                  <Activity className="text-avionics-blue" />
              </div>
              <div>
                  <h1 className="text-2xl font-mono font-bold tracking-widest text-white">HAL AEROTHON '26</h1>
                  <p className="text-xs text-slate-500 font-mono">SYSTEM ADMINISTRATOR</p>
              </div>
          </div>
          <button 
                onClick={() => setShowUpload(!showUpload)}
                className={`flex items-center gap-2 px-4 py-2 border rounded transition-all font-mono text-xs uppercase tracking-wider ${showUpload ? "bg-avionics-blue text-slate-900 border-avionics-blue" : "bg-slate-900 text-slate-400 border-slate-700 hover:border-avionics-blue hover:text-avionics-blue"}`}
          >
               <Database size={14} /> {showUpload ? "Hide Ingestion Port" : "Open Ingestion Port"}
          </button>
      </header>

      <div className="w-full max-w-6xl flex flex-col gap-6 relative z-10 h-full">
        
        {/* Document Upload Section */}
        <AnimatePresence>
        {showUpload && (
            <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="overflow-hidden"
            >
                <div className="bg-slate-950/80 border border-avionics-blue/20 rounded-xl p-6 backdrop-blur-md shadow-lg">
                    <h2 className="flex items-center gap-2 text-avionics-blue font-mono font-bold mb-4 uppercase tracking-wider">
                        <Database className="w-4 h-4" /> Data Ingestion Port
                    </h2>
                    
                    <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all relative overflow-hidden ${files.length > 0 ? "border-radar-green bg-radar-green/5" : "border-slate-700 hover:border-avionics-blue hover:bg-slate-900"}`}
                    >
                        {files.length > 0 ? (
                            <div className="text-center">
                                <FileText className="w-10 h-10 text-radar-green mx-auto mb-2" />
                                <p className="font-mono text-radar-green">{files.length} FILES STAGED</p>
                                <p className="text-xs text-slate-500">{files.map(f => f.name).join(", ")}</p>
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 hover:text-avionics-blue transition-colors">
                                <Upload className="w-10 h-10 mx-auto mb-2" />
                                <p className="font-mono text-sm">DRAG INITIAL INTELLIGENCE FILES HERE</p>
                                <p className="text-xs mt-1 opacity-50">OR CLICK TO BROWSE</p>
                            </div>
                        )}
                        <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer h-full z-20" />
                        
                        {/* Upload Progress Overlay */}
                        {indexingParams.status && (
                            <div className="absolute inset-x-0 bottom-0 bg-slate-900/90 py-2 px-4 border-t border-avionics-blue/20 flex items-center justify-between z-30">
                                <span className="text-xs font-mono text-avionics-blue">{indexingParams.status}</span>
                                <div className="w-1/2 h-1 bg-slate-800 rounded-full overflow-hidden">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${indexingParams.progress}%` }}
                                        className="h-full bg-avionics-blue"
                                    ></motion.div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <div className="text-xs font-mono text-slate-500">
                            SUPPORTED FORMATS: PDF, DOCX, TXT
                        </div>
                        <button 
                            onClick={uploadFiles}
                            disabled={files.length === 0 || uploading}
                            className="bg-avionics-blue text-slate-900 font-bold px-6 py-2 rounded font-mono disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-neon-blue transition-all"
                        >
                            {uploading ? "PROCESSING..." : "UPLOAD"}
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
        </AnimatePresence>

        {/* Admin Chat Terminal */}
        <div className="bg-slate-950/80 border border-avionics-blue/20 rounded-xl p-0 backdrop-blur-md shadow-lg flex flex-col flex-1 min-h-[500px] overflow-hidden relative">
             {/* Header */}
            <div className="p-4 border-b border-avionics-blue/20 flex justify-between items-center bg-slate-900/50">
                 <h2 className="flex items-center gap-2 text-avionics-blue font-mono font-bold uppercase tracking-wider">
                    <Terminal className="w-4 h-4" /> RAG System Interaction Console
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-radar-green">
                    <Rocket size={12} /> Think | Build | fly
                </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar bg-slate-900/30 relative">
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
                        {msg.sender === "bot" && (
                            <div className="flex items-center gap-2 mb-2 text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">
                                <Terminal size={12} /> Response
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
                                <div 
                                        key={idx} 
                                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded text-xs text-avionics-blue"
                                >
                                    <FileText size={12} />
                                    <span className="truncate max-w-[150px]">{cit.document || "Unknown Source"}</span>
                                    {cit.page_number && <span className="text-slate-500">Pg {cit.page_number}</span>}
                                </div>
                            ))}
                        </div>
                    )}
                    </motion.div>
                ))}
                
                {chatLoading && (
                    <div className="flex items-center gap-2 text-avionics-blue font-mono text-xs p-4">
                        <div className="w-2 h-2 bg-avionics-blue rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-avionics-blue rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-avionics-blue rounded-full animate-bounce delay-150"></div>
                        PROCESSING QUERY...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/80 border-t border-avionics-blue/20">
                 <div className="flex gap-2 items-center bg-slate-950 border border-avionics-blue/50 p-2 rounded-lg focus-within:shadow-[0_0_15px_rgba(14,165,233,0.2)] focus-within:border-avionics-blue transition-all">
                    <div className="pl-3 text-avionics-blue font-mono select-none pointer-events-none py-2">{'>'}</div>
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="ENTER COMMAND OR QUERY..."
                        className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono placeholder-slate-600 h-10 px-2"
                        disabled={chatLoading}
                    />
                    <button 
                        onClick={sendMessage}
                        disabled={chatLoading}
                        className="p-2 bg-avionics-blue/20 text-avionics-blue rounded hover:bg-avionics-blue hover:text-white transition-all border border-avionics-blue/50"
                    >
                        <Send size={18} />
                    </button>
                 </div>
            </div>

        </div>

      </div>
    </div>
  );
}