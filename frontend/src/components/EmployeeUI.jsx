import { useState, useRef, useEffect } from "react";
// import api from "../api";
import api from "../api/queryApi";
import { motion } from "framer-motion";
import { Send, FileText, Terminal, Rocket, Database } from "lucide-react";

const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default function EmployeeUI({ userContext }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "init",
      text: "Secure Channel Established. Ready for queries.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: userText,
        sender: "user",
        timestamp: new Date(),
      },
    ]);

    setInputValue("");
    setLoading(true);

    try {
      const response = await api.post("/query", {
        query: userText,
        role: userContext.role,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: response.data.answer || "No answer generated.",
          sender: "bot",
          timestamp: new Date(),
          citations: response.data.sources || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Transmission failure. Backend unreachable.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-mono">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-avionics-blue" />
          <span className="uppercase tracking-widest text-avionics-blue">
            Employee Console
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <Rocket size={12} /> Offline RAG
          <Database size={12} /> Local DB
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg border ${
                msg.sender === "user"
                  ? "bg-avionics-blue/10 border-avionics-blue/30"
                  : "bg-slate-800 border-slate-700 text-radar-green"
              }`}
            >
              {msg.sender === "bot" ? (
                <TypewriterText text={msg.text} />
              ) : (
                msg.text
              )}

              <div className="text-[10px] opacity-50 mt-2 text-right">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {/* Sources */}
            {msg.citations && msg.citations.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 max-w-[80%]">
                {msg.citations.map((src, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-avionics-blue"
                  >
                    <FileText size={12} />
                    <span className="truncate max-w-[300px]">
                      {src.slice(0, 140)}...
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <div className="text-xs text-avionics-blue">
            Processing query...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-2 bg-slate-950 border border-avionics-blue/50 rounded-lg p-2">
          <span className="text-avionics-blue">{">"}</span>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-transparent outline-none"
            placeholder="Enter query..."
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-avionics-blue/20 border border-avionics-blue/50 rounded hover:bg-avionics-blue hover:text-white"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
