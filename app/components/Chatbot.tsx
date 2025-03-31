"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, MessageCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";

const Chatbot = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

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
    <>
      {/* Chat Window */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-in-out ${
          isOpen
            ? "bottom-4 right-4 sm:bottom-6 sm:right-6"
            : "bottom-0 right-0 translate-y-full opacity-0 pointer-events-none"
        } ${isMobile ? "w-[calc(100%-2rem)]" : "w-[380px]"}`}
      >
        {isOpen && (
          <Card className="w-full h-[500px] flex flex-col shadow-xl border-t-4 border-t-primary">
            <CardHeader className="p-4 border-b bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <div className="font-medium">AI Assistant</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleChat}
                  className="h-8 w-8"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender !== "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </CardContent>

            <CardFooter className="p-3 border-t">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex w-full gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Chat Bubble Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "bg-primary opacity-100"
        }`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
    </>
  );
};

export default Chatbot;