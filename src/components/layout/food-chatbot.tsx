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

  const busy = status === "submitted" || status === "streaming";

  return (
    <>
      <Button
        type="button"
        size="icon"
        className="fixed right-5 bottom-5 z-[70] size-14 rounded-full shadow-lg"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close food assistant" : "Open food assistant"}
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="fixed right-5 bottom-24 z-[70] w-[min(100vw-2rem,380px)]"
          >
            <Card className="shadow-xl">
              <CardHeader className="border-b py-3">
                <CardTitle className="text-base">Food assistant</CardTitle>
                <p className="text-muted-foreground text-xs">
                  Ask for meal ideas, order help, or FAQs.
                </p>
              </CardHeader>
              <CardContent className="max-h-[min(50vh,320px)] space-y-3 overflow-y-auto p-3">
                {messages.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Try: &quot;Suggest dinner&quot;, &quot;What should I eat?&quot;, or
                    &quot;Where is my order?&quot;
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[90%] rounded-2xl px-3 py-2 text-sm",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <MessageBody message={m} />
                    </div>
                  </div>
                ))}
                {error && (
                  <p className="text-destructive text-xs">{error.message}</p>
                )}
              </CardContent>
              <CardFooter className="border-t flex-col gap-2 p-3">
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
                    placeholder="Message…"
                    disabled={busy}
                    className="flex-1"
                  />
                  {busy ? (
                    <Button type="button" variant="secondary" onClick={() => stop()}>
                      Stop
                    </Button>
                  ) : (
                    <Button type="submit" size="icon" disabled={!input.trim()}>
                      <Send className="size-4" />
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
