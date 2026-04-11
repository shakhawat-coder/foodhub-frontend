"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Mic, Search, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AiSearchResponse, SearchMealResult } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const RECENT_KEY = "foodhub-recent-searches";
const DEBOUNCE_MS = 420;

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
  } catch {
    return [];
  }
}

function saveRecent(q: string) {
  const t = q.trim();
  if (t.length < 2) return;
  const prev = loadRecent().filter((x) => x.toLowerCase() !== t.toLowerCase());
  const next = [t, ...prev].slice(0, 8);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function highlightMatch(text: string, query: string) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (terms.length === 0) return text;
  const re = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = text.split(re);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark
        key={i}
        className="rounded-sm bg-amber-200/70 px-0.5 text-inherit dark:bg-amber-500/30"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function NavbarSearch({ className }: { className?: string }) {
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AiSearchResponse | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const seq = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecent(loadRecent());
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const q = debounced.trim();
    if (!q) {
      setData(null);
      setLoading(false);
      return;
    }

    const id = ++seq.current;
    const ac = new AbortController();
    setLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/ai-search", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
          signal: ac.signal,
        });
        const json = (await res.json()) as AiSearchResponse & { error?: string };
        if (seq.current !== id) return;
        if (!res.ok) throw new Error(json.error || "Search failed");
        setData(json);
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        if (seq.current !== id) return;
        setData(null);
      } finally {
        if (seq.current === id) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [debounced]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const applyQuery = useCallback((q: string) => {
    setValue(q);
    saveRecent(q);
    setRecent(loadRecent());
    setOpen(true);
  }, []);

  const startVoice = () => {
    if (typeof window === "undefined") return;
    const SR = (
      window as unknown as {
        webkitSpeechRecognition?: new () => {
          lang: string;
          interimResults: boolean;
          maxAlternatives: number;
          onresult: ((ev: { results: Array<{ 0: { transcript: string } }> }) => void) | null;
          start: () => void;
        };
      }
    ).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (ev) => {
      const text = ev.results[0]?.[0]?.transcript?.trim();
      if (text) applyQuery(text);
    };
    rec.start();
  };

  const results = data?.results ?? [];
  const suggestions = data?.suggestions ?? [];
  const didYouMean = data?.didYouMean;
  const mode = data?.mode;
  const showPanel =
    open && (value.trim().length > 0 || recent.length > 0);

  return (
    <div ref={wrapRef} className={cn("relative w-full min-w-0", className)}>
      <div
        className={cn(
          "relative flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-1 shadow-sm transition-shadow",
          open && "ring-ring/40 ring-[3px]"
        )}
      >
        <Search className="text-muted-foreground pointer-events-none absolute left-3 size-4" />
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search for food, restaurants..."
          className="h-9 flex-1 border-0 bg-transparent dark:bg-transparent pl-9 pr-20 shadow-none focus-visible:ring-0"
          aria-autocomplete="list"
          aria-expanded={showPanel}
          autoComplete="off"
        />
        <div className="absolute right-1.5 flex items-center gap-0.5">
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              onClick={() => {
                setValue("");
                setData(null);
              }}
              aria-label="Clear search"
            >
              <X className="size-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={startVoice}
            aria-label="Voice search"
            title="Voice search"
          >
            <Mic className="size-4" />
          </Button>
        </div>
      </div>

      {showPanel && (
        <div
          className="bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute top-full z-[60] mt-2 max-h-[min(70vh,420px)] w-full overflow-hidden rounded-xl border shadow-lg"
          role="listbox"
        >
          <div className="max-h-[min(70vh,420px)] overflow-y-auto p-2">
            {didYouMean && (
              <button
                type="button"
                className="text-muted-foreground hover:bg-muted/80 mb-2 w-full rounded-lg px-2 py-1.5 text-left text-xs"
                onClick={() => applyQuery(didYouMean)}
              >
                Did you mean{" "}
                <span className="text-foreground font-medium">{didYouMean}</span>?
              </button>
            )}

            {!value.trim() && recent.length > 0 && (
              <div className="mb-2">
                <div className="text-muted-foreground px-2 pb-1 text-xs font-medium">
                  Recent
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recent.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className="bg-muted/60 hover:bg-muted rounded-full px-2.5 py-1 text-xs"
                      onClick={() => applyQuery(r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {value.trim().length > 0 && (
              <div className="text-muted-foreground flex items-center gap-2 px-2 pb-2 text-xs">
                {loading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Searching…
                  </>
                ) : mode === "ai" ? (
                  <>
                    <Sparkles className="text-amber-500 size-3.5" />
                    Smart ranking on
                  </>
                ) : (
                  <span>Results from menu</span>
                )}
              </div>
            )}

            {loading && value.trim().length > 0 && (
              <div className="space-y-2 px-1">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            )}

            {!loading &&
              value.trim().length > 0 &&
              results.map((m: SearchMealResult) => (
                <Link
                  key={m.id}
                  href={`/meals/${m.id}`}
                  role="option"
                  className="hover:bg-muted/80 flex gap-3 rounded-lg px-2 py-2 transition-colors"
                  onClick={() => {
                    saveRecent(value);
                    setOpen(false);
                  }}
                >
                  <div className="bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                    {m.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.image}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex size-full items-center justify-center text-[10px]">
                        Meal
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {highlightMatch(m.name, value)}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      {m.providerName} · {m.categoryName}
                    </div>
                    <div className="text-primary text-xs font-semibold">
                      ${m.price.toFixed(2)}
                    </div>
                  </div>
                </Link>
              ))}

            {!loading &&
              value.trim().length > 0 &&
              results.length === 0 && (
                <p className="text-muted-foreground px-2 py-6 text-center text-sm">
                  No meals found. Try a suggestion below.
                </p>
              )}

            {suggestions.length > 0 && value.trim().length > 0 && (
              <div className="border-t pt-2">
                <div className="text-muted-foreground px-2 pb-1 text-xs font-medium">
                  Suggested searches
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="bg-secondary/60 hover:bg-secondary rounded-full px-2.5 py-1 text-xs"
                      onClick={() => applyQuery(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
