import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";

export const maxDuration = 60;

async function fetchMenuSummary(baseUrl: string): Promise<string> {
  try {
    const res = await fetch(`${baseUrl}/meal`, {
      cache: "no-store",
    });
    if (!res.ok) return "";
    const meals = (await res.json()) as Array<{
      name: string;
      price: number;
      description?: string;
      category?: { name?: string };
      provider?: { name?: string };
    }>;
    if (!Array.isArray(meals) || meals.length === 0) return "";
    return meals
      .slice(0, 40)
      .map(
        (m) =>
          `${m.name} — $${m.price} (${m.category?.name ?? "meal"}) @ ${
            m.provider?.name ?? "restaurant"
          }`
      )
      .join("\n");
  } catch {
    return "";
  }
}

async function fetchRecentOrdersSummary(
  baseUrl: string,
  cookie: string | null
): Promise<string> {
  if (!cookie) return "";
  try {
    const res = await fetch(`${baseUrl}/order/user`, {
      cache: "no-store",
      headers: { cookie },
    });
    if (!res.ok) return "";
    const orders = (await res.json()) as Array<{
      id: string;
      status: string;
      createdAt: string;
      items?: Array<{ meal?: { name?: string }; quantity?: number }>;
    }>;
    if (!Array.isArray(orders) || orders.length === 0) return "";
    return orders
      .slice(0, 5)
      .map((o) => {
        const items =
          o.items
            ?.map((i) => `${i.quantity ?? 1}× ${i.meal?.name ?? "item"}`)
            .join(", ") ?? "";
        return `#${o.id.slice(0, 8)} — ${o.status} — ${items}`;
      })
      .join("\n");
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Chat is not configured (GROQ_API_KEY)." },
      { status: 503 }
    );
  }

  const body = (await req.json()) as {
    messages?: UIMessage[];
    id?: string;
  };
  const messages = body.messages ?? [];
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages required" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const cookie = req.headers.get("cookie");

  const [menuSummary, ordersSummary] = await Promise.all([
    fetchMenuSummary(baseUrl),
    fetchRecentOrdersSummary(baseUrl, cookie),
  ]);

  const modelId = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  const system = `You are a friendly food delivery assistant for a web app called FoodHub.

Capabilities:
- Recommend meals and restaurants, suggest combos, dietary ideas (healthy, spicy, budget lunch, vegetarian).
- Answer FAQs about ordering, delivery times, and payments in generic helpful terms.
- If the user asks about *their* order status, use ONLY the "Recent orders" data below. If empty, say they can sign in as a customer and check the dashboard, or share an order ID.
- Keep replies concise (2–6 short paragraphs max unless they ask for detail). No markdown tables.

Menu snapshot (may be partial):
${menuSummary || "(Menu unavailable — give general food advice.)"}

Recent orders for this signed-in user (if any):
${ordersSummary || "(No recent orders loaded or not signed in.)"}
`;

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: groq(modelId),
    system,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
