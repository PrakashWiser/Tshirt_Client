"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

import CustomImage from "@/app/common/CustomImage";
import { FetchApi } from "@/app/api/FetchApi";
import type { Product } from "@/app/store/slice/productSlice";

interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  reply: string;
  products: Product[];
  suggestions: string[];
  hasMore: boolean;
  context: ChatContext;
}

interface ChatContext {
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  brand?: string;
  color?: string;
  size?: string;
  terms?: string[];
  sortBy?: "createdAt" | "priceAsc" | "priceDesc";
  page?: number;
}

interface ChatMessage extends ChatHistoryMessage {
  products?: Product[];
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [context, setContext] = useState<ChatContext>({});
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi! Tell me what you are looking”",
    },
  ]);
  const widgetRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !widgetRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [open]);

  useEffect(() => {
    conversationRef.current?.scrollTo({
      top: conversationRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending, open]);

  const sendMessage = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const message = draft.trim();
    if (!message || sending) return;

    const history = messages.slice(-10).map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, { role: "user", content: message }]);
    setDraft("");
    setSending(true);

    try {
      const response = await FetchApi<{ data: ChatResponse }>({
        endpoint: "/chat",
        method: "POST",
        body: { message, history, context },
      });
      setContext(response.data.context ?? {});
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: response.data.reply,
          products: response.data.products,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "Could not send your message. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-24 right-5 z-[60] sm:bottom-24 sm:right-6"
    >
      {open && (
        <section
          aria-label="AI shopping assistant"
          className="fixed inset-0 flex h-[100dvh] w-auto max-w-none flex-col overflow-hidden border-0 border-[#e8ece9] bg-[#fffdf9] pt-[env(safe-area-inset-top)] shadow-none sm:absolute sm:inset-auto sm:bottom-16 sm:right-0 sm:h-[min(72dvh,620px)] sm:w-[calc(100vw-2rem)] sm:max-w-[390px] sm:rounded-2xl sm:border sm:pt-0 sm:shadow-2xl"
        >
          <header className="flex items-center justify-between bg-[#003b1f] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={18} aria-hidden="true" />
              <div>
                <h2 className="text-sm font-semibold">Shopping assistant</h2>
                <p className="text-xs text-white/75">Styles and picks for your budget</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close shopping assistant"
              className="rounded-full p-1 hover:bg-white/15"
            >
              <X size={20} />
            </button>
          </header>

          <div
            ref={conversationRef}
            className="flex-1 space-y-3 overflow-y-auto p-3"
            aria-live="polite"
          >
            {messages.map((item, index) => (
              <div key={`${index}-${item.role}`} className="space-y-2">
                <p
                  className={`w-fit max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-5 ${
                    item.role === "user"
                      ? "ml-auto rounded-br-sm bg-[#003b1f] text-white"
                      : "rounded-bl-sm border border-[#e8ece9] bg-white text-[#171a18]"
                  }`}
                >
                  {item.content}
                </p>
                {item.products?.length ? (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {item.products.map((product) => (
                      <ChatProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {sending ? (
              <p className="w-fit rounded-2xl border border-[#e8ece9] bg-white px-3 py-2 text-sm text-gray-500">
                Finding the right styles...
              </p>
            ) : null}
          </div>

          <form onSubmit={(event) => void sendMessage(event)} className="flex gap-2 border-t border-[#e8ece9] bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3">
            <input
              aria-label="Message shopping assistant"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about styles or budget"
              maxLength={1000}
              className="min-w-0 flex-1 rounded-full border border-[#e1e5e2] bg-[#fffdf9] px-4 py-2 text-sm outline-none focus:border-[#003b1f]"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={sending || !draft.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#003b1f] text-white disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close shopping assistant" : "Open shopping assistant"}
        aria-expanded={open}
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-[#003b1f] text-white shadow-lg transition hover:scale-105 hover:bg-[#002d18] ${open ? "max-sm:hidden" : ""}`}
      >
        {open ? <X size={23} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
}

function ChatProductCard({ product }: { product: Product }) {
  const variant = product.variants[0];
  if (!variant) return null;

  const price = variant.salePrice > 0 ? variant.salePrice : variant.price;
  const image = variant.images?.[0] || product.images?.[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="w-32 shrink-0 overflow-hidden rounded-xl border border-[#e8ece9] bg-white"
    >
      <div className="relative aspect-[4/5] bg-[#f4f7f5]">
        {image ? (
          <CustomImage src={image} alt={product.name} fill sizes="128px" className="object-cover" />
        ) : null}
      </div>
      <div className="p-2">
        <p className="line-clamp-2 min-h-9 text-xs font-medium text-[#171a18]">{product.name}</p>
        <p className="mt-1 text-sm font-semibold text-[#003b1f]">₹{price.toLocaleString("en-IN")}</p>
      </div>
    </Link>
  );
}
