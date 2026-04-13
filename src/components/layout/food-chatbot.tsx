"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";
import { Sparkles, Bot, RotateCcw, ChevronDown } from "lucide-react";

function MessageBody({ message }: { message: { parts: Array<{ type: string; text?: string }> } }) {
  return (
    <>
      {message.parts.map((part, i) =>
        part.type === "text" && part.text ? (
          <span key={i} className="whitespace-pre-wrap">
            {part.text}
          </span>
        ) : null
      )}
    </>
  );
}

export function FoodChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    []
  );

  const { messages, sendMessage, status, error, stop } = useChat({
    transport,
    experimental_throttle: 48,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const busy = status === "submitted" || status === "streaming";

  return (
    <>
      <Button 
        type="button"
        size="icon"
        className="fixed right-6 bottom-6 z-[40] size-14 rounded-full shadow-2xl bg-linear-to-r from-primary to-orange-600 hover:scale-110 active:scale-95 transition-all duration-300 border-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close food assistant" : "Open food assistant"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="size-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="size-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed right-6 bottom-2 z-[40] w-[min(100vw-2rem,320px)]"
          >
            <Card className="py-0 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-none rounded-2xl overflow-hidden bg-background"> 
              <CardHeader className="bg-primary  dark:bg-background p-4 flex flex-row items-center justify-between border-none  rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-white/20 flex items-center justify-center border border-white/10 relative">
                    <Bot className="size-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                      Foodie AI
                    </CardTitle>
                    <p className="text-[11px] text-white/80 font-medium mt-1 leading-none">
                      Always here to help
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/80">

                  <button className="hover:text-white transition-colors" title="Minimize" onClick={() => setOpen(false)}>
                    <ChevronDown className="size-5" />
                  </button>
                  <button className="hover:text-white transition-colors" title="Close" onClick={() => setOpen(false)}>
                    <X className="size-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent
                ref={scrollRef}
                className="h-[280px] space-y-4 overflow-y-auto p-4 scroll-smooth"
              >
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="size-16 rounded-3xl bg-muted/50 flex items-center justify-center mb-2">
                      <MessageCircle className="size-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">How can I help you today?</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                        Try asking about dinner ideas, tracking orders, or meal suggestions!
                      </p>
                    </div>
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex animate-in slide-in-from-bottom-2 duration-300",
                      m.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-[20px] px-4 py-2.5 text-xs shadow-sm",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted border border-muted/50 rounded-tl-none"
                      )}
                    >
                      <MessageBody message={m} />
                    </div>
                  </div>
                ))}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-500 text-[11px] font-bold text-center italic">{error.message}</p>
                  </div>
                )}
                {busy && (
                  <div className="flex justify-start">
                    <div className="bg-muted/80 rounded-[20px] rounded-tl-none px-4 py-3 flex gap-1">
                      <span className="size-1.5 bg-primary/40 rounded-full animate-bounce" />
                      <span className="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="size-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-muted/30 bg-muted/20 p-4">
                <form
                  className="flex w-full gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const t = input.trim();
                    if (!t || busy) return;
                    sendMessage({ text: t });
                    setInput("");
                  }}
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={busy}
                    className="flex-1 rounded-xl h-12 bg-background border-muted/50 focus-visible:ring-primary shadow-sm"
                  />
                  {busy ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => stop()}
                      className="h-12 px-4 rounded-xl font-bold uppercase text-[10px] tracking-widest"
                    >
                      Stop
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim()}
                      className="size-12 rounded-xl shadow-lg shadow-primary/20 bg-primary hover:scale-105 transition-transform"
                    >
                      <Send className="size-5" />
                    </Button>
                  )}
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
