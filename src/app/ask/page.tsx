"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import AppShell from "@/components/AppShell";
import { MarkdownText } from "@/lib/markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AskAtlasPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend() {
    const q = input.trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    // Log AI chat query to search analytics
    fetch("/api/search-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: q,
        source: "ai_chat",
        results_count: 1,
      }),
    }).catch(() => {});

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer || "Sorry, I couldn't process that request." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-[800px]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#304256] mb-1">Ask Atlas</h1>
          <p className="text-gray-500">AI-powered assistant for Travel Collection knowledge</p>
        </div>

        <div className="bg-white rounded-xl border border-[#E8ECF1] flex flex-col shadow-sm" style={{ height: "calc(100vh - 220px)" }}>
          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && !loading ? (
              /* Welcome screen */
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Image src="/claudette.png" alt="Claudette" width={80} height={80} className="rounded-full object-cover object-top mb-4 ring-2 ring-[#E8ECF1]" />
                <h2 className="text-lg font-bold text-[#304256] mb-1">Hi, I&apos;m Claudette</h2>
                <p className="text-sm font-medium text-[#27a28c] mb-3">Your Atlas AI Assistant</p>
                <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                  I can help you find information about company processes, training courses, wiki articles, and upcoming events across Travel Collection.
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2.5`}>
                    {msg.role === "assistant" && (
                      <Image src="/claudette.png" alt="Claudette" width={36} height={36} className="rounded-full shrink-0 mt-1 w-9 h-9 object-cover object-top" />
                    )}
                    <div className={`max-w-[75%] rounded-xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-[#27a28c] text-white rounded-br-sm"
                        : "bg-white border border-[#E8ECF1] rounded-bl-sm shadow-sm"
                    }`}>
                      {msg.role === "assistant" ? (
                        <MarkdownText text={msg.content} className="text-[13px] text-gray-600 leading-relaxed" />
                      ) : (
                        <p className="text-[13px] leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start gap-2.5">
                    <Image src="/claudette.png" alt="Claudette" width={36} height={36} className="rounded-full shrink-0 mt-1 w-9 h-9 object-cover object-top" />
                    <div className="bg-white border border-[#E8ECF1] rounded-xl rounded-bl-sm px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-[#E8ECF1] p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#E8ECF1] bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#27a28c] focus:ring-1 focus:ring-[#27a28c]/30 transition-colors"
                placeholder="Ask about courses, processes, events..."
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2.5 rounded-lg bg-[#27a28c] text-white hover:bg-[#27a28c]/90 disabled:opacity-40 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
