"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizonal } from "lucide-react";

const Chatbot = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([...newMessages, { sender: "bot", text: data.reply }]);
      } else {
        setMessages([...newMessages, { sender: "bot", text: "Error: " + data.error }]);
      }
    } catch (error) {
      setMessages([...newMessages, { sender: "bot", text: "Failed to connect to server." }]);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto h-[80vh] border rounded-2xl shadow-lg bg-gray-50 p-4">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-gray-900 self-start"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Field */}
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-md">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask me a DSA question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          onClick={sendMessage}
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
