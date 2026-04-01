"use client";

import { useState, useRef, useEffect, FormEvent, Fragment } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "input" | "market" | "training" | "roleplay";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  isHidden?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_ORDER: Step[] = ["input", "market", "training", "roleplay"];

const STEPS = [
  { id: "market" as Step, label: "Market Intelligence", num: 1 },
  { id: "training" as Step, label: "Custom Training", num: 2 },
  { id: "roleplay" as Step, label: "Live Sales Experience", num: 3 },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const currentIdx = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-6 py-5">
        <div className="flex items-center justify-center">
          {STEPS.map((step, i) => {
            const stepIdx = STEP_ORDER.indexOf(step.id);
            const isComplete = currentIdx > stepIdx;
            const isActive = currentIdx === stepIdx;

            return (
              <Fragment key={step.id}>
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 ${
                      isComplete
                        ? "bg-emerald-500 text-white"
                        : isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isComplete ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.num
                    )}
                  </div>
                  <span
                    className={`hidden sm:block text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-blue-600"
                        : isComplete
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 sm:w-14 h-px mx-3 sm:mx-4 transition-all duration-300 ${
                      currentIdx > stepIdx ? "bg-emerald-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Streaming Content Display ────────────────────────────────────────────────

function StreamingContent({
  content,
  isDone,
}: {
  content: string;
  isDone: boolean;
}) {
  if (!content) return null;

  return isDone ? (
    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-base prose-h2:text-slate-800 prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-sm prose-h3:text-slate-700 prose-p:text-slate-600 prose-p:text-sm prose-li:text-slate-600 prose-li:text-sm prose-strong:text-slate-800 prose-ul:space-y-1">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  ) : (
    <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
      {content}
      <span className="inline-block w-0.5 h-[1em] bg-blue-500 animate-pulse ml-0.5 align-text-bottom" />
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────

function Spinner({ color = "blue" }: { color?: "blue" | "violet" }) {
  return (
    <div
      className={`w-4 h-4 rounded-full border-2 border-t-transparent animate-spin ${
        color === "violet"
          ? "border-violet-600"
          : "border-blue-600"
      }`}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Page() {
  const [step, setStep] = useState<Step>("input");
  const [product, setProduct] = useState("");
  const [location, setLocation] = useState("");
  const [marketContent, setMarketContent] = useState("");
  const [trainingContent, setTrainingContent] = useState("");
  const [marketDone, setMarketDone] = useState(false);
  const [trainingDone, setTrainingDone] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingReply, setStreamingReply] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingReply]);

  // ── Streaming helper ────────────────────────────────────────────────────────

  async function streamResponse(
    url: string,
    body: object,
    onChunk: (chunk: string) => void
  ) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error((await res.text()) || "Request failed");
    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }
  }

  // ── Step 1 → Market Intelligence ───────────────────────────────────────────

  async function handleStartTraining(e: FormEvent) {
    e.preventDefault();
    if (!product.trim() || !location.trim()) return;
    setError(null);
    setMarketContent("");
    setMarketDone(false);
    setStep("market");
    setIsGenerating(true);
    try {
      await streamResponse(
        "/api/market-intelligence",
        { product, location },
        (chunk) => setMarketContent((p) => p + chunk)
      );
      setMarketDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    } finally {
      setIsGenerating(false);
    }
  }

  // ── Step 2 → Custom Training ────────────────────────────────────────────────

  async function handleContinueToTraining() {
    setTrainingContent("");
    setTrainingDone(false);
    setStep("training");
    setIsGenerating(true);
    try {
      await streamResponse(
        "/api/training",
        { product, location, marketContent },
        (chunk) => setTrainingContent((p) => p + chunk)
      );
      setTrainingDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }

  // ── Step 3 → Live Sales Experience ─────────────────────────────────────────

  async function handleStartRoleplay() {
    setMessages([]);
    setStreamingReply("");
    setStep("roleplay");
    setIsGenerating(true);

    const hiddenPrompt: ChatMessage = {
      role: "user",
      content: `Start the conversation. You are the customer. Greet the salesperson briefly, express genuine interest in ${product}, but immediately voice one specific concern or question you have.`,
      isHidden: true,
    };

    try {
      let opening = "";
      await streamResponse(
        "/api/roleplay",
        {
          product,
          location,
          marketContent,
          trainingContent,
          messages: [hiddenPrompt],
        },
        (chunk) => {
          opening += chunk;
          setStreamingReply(opening);
        }
      );
      setMessages([hiddenPrompt, { role: "assistant", content: opening }]);
      setStreamingReply("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || isGenerating) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setChatInput("");
    setIsGenerating(true);
    setStreamingReply("");
    try {
      let reply = "";
      await streamResponse(
        "/api/roleplay",
        { product, location, marketContent, trainingContent, messages: updated },
        (chunk) => {
          reply += chunk;
          setStreamingReply(reply);
        }
      );
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setStreamingReply("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">
                SalesTrainer AI
              </h1>
              <p className="text-blue-400 text-[11px] mt-0.5">
                Powered by Claude
              </p>
            </div>
          </div>
          {step !== "input" && (
            <div className="text-right">
              <p className="text-blue-200 text-xs font-medium">{product}</p>
              <p className="text-slate-400 text-[11px]">{location}</p>
            </div>
          )}
        </div>
      </header>

      {/* ── Step Indicator ── */}
      {step !== "input" && <StepIndicator currentStep={step} />}

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
            <span className="text-base mt-0.5">⚠️</span>
            <div>
              <strong className="font-semibold">Error:</strong> {error}
              <button
                className="ml-3 underline text-red-600 hover:text-red-800"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* ───────── INPUT STEP ───────── */}
        {step === "input" && (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                AI-Powered Sales Training
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Train smarter.
                <br />
                Sell better.
              </h2>
              <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                Enter your product and target market to get competitor intel,
                a personalized pitch guide, and a live sales experience.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <form onSubmit={handleStartTraining} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    What are you selling?
                  </label>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="e.g. Solar panels, SaaS software, Life insurance…"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-800 placeholder-slate-400 text-sm transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Where are you selling it?
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Austin TX, New York City, Chicago suburbs…"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none text-slate-800 placeholder-slate-400 text-sm transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm mt-2"
                >
                  Start Training
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: "📊", label: "Market Intel" },
                  { icon: "🎯", label: "Pitch Training" },
                  { icon: "🎭", label: "Live Experience" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-xl mb-1">{item.icon}</div>
                    <p className="text-[11px] font-medium text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ───────── MARKET INTELLIGENCE STEP ───────── */}
        {step === "market" && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                📊
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900">
                  Market Intelligence Report
                </h2>
                <p className="text-xs text-slate-500">
                  {product} · {location}
                </p>
              </div>
              {isGenerating && (
                <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                  <Spinner color="blue" />
                  Analyzing market…
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
              <StreamingContent content={marketContent} isDone={marketDone} />
              {!marketContent && isGenerating && (
                <div className="space-y-3 animate-pulse">
                  {[80, 60, 90, 50, 70].map((w, i) => (
                    <div
                      key={i}
                      className="h-3 bg-slate-100 rounded"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {marketDone && (
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => setStep("input")}
                  className="px-5 py-2.5 text-sm text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleContinueToTraining}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  Continue to Training
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ───────── TRAINING STEP ───────── */}
        {step === "training" && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-violet-50 border border-violet-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                🎯
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900">
                  Custom Sales Training Guide
                </h2>
                <p className="text-xs text-slate-500">
                  {product} · {location}
                </p>
              </div>
              {isGenerating && (
                <div className="flex items-center gap-2 text-xs text-violet-600 font-medium">
                  <Spinner color="violet" />
                  Building training…
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
              <StreamingContent
                content={trainingContent}
                isDone={trainingDone}
              />
              {!trainingContent && isGenerating && (
                <div className="space-y-3 animate-pulse">
                  {[75, 55, 85, 65, 45, 80].map((w, i) => (
                    <div
                      key={i}
                      className="h-3 bg-slate-100 rounded"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {trainingDone && (
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => setStep("market")}
                  className="px-5 py-2.5 text-sm text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  ← Market Intel
                </button>
                <button
                  onClick={handleStartRoleplay}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  🎭 Start Live Session
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ───────── LIVE SALES EXPERIENCE STEP ───────── */}
        {step === "roleplay" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                🎭
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900">
                  Live Sales Experience
                </h2>
                <p className="text-xs text-slate-500">
                  Simulated {location} customer for {product}
                </p>
              </div>
              <button
                onClick={() => setStep("training")}
                className="px-4 py-2 text-xs text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex-shrink-0"
              >
                ← Training Guide
              </button>
            </div>

            {/* Tip */}
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
              <span className="text-sm flex-shrink-0">💡</span>
              <span>
                This customer reflects real {location} demographics and objections.
                Reference your training guide to handle their concerns effectively.
              </span>
            </div>

            {/* Chat window */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[520px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Customer info bar */}
                <div className="flex items-center justify-center mb-2">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-xs text-slate-500">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Customer from {location} · Considering {product}
                  </div>
                </div>

                {messages
                  .filter((m) => !m.isHidden)
                  .map((msg, i) => (
                    <div
                      key={i}
                      className={`flex items-end gap-2.5 ${
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                          msg.role === "assistant"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {msg.role === "assistant" ? "👤" : "💼"}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`max-w-[75%] ${
                          msg.role === "user"
                            ? "items-end"
                            : "items-start"
                        } flex flex-col gap-1`}
                      >
                        <span
                          className={`text-[10px] font-semibold ${
                            msg.role === "user"
                              ? "text-blue-400 text-right"
                              : "text-slate-400"
                          }`}
                        >
                          {msg.role === "user" ? "You" : "Customer"}
                        </span>
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-slate-100 text-slate-800 rounded-bl-sm"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Streaming reply */}
                {streamingReply && (
                  <div className="flex items-end gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-emerald-100 text-emerald-700">
                      👤
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-slate-400">
                        Customer
                      </span>
                      <div className="max-w-[75%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed bg-slate-100 text-slate-800">
                        {streamingReply}
                        <span className="inline-block w-0.5 h-[1em] bg-slate-500 animate-pulse ml-0.5 align-text-bottom" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Initial typing indicator */}
                {isGenerating &&
                  !streamingReply &&
                  messages.filter((m) => !m.isHidden).length === 0 && (
                    <div className="flex items-end gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-emerald-100">
                        👤
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-slate-400">
                          Customer
                        </span>
                        <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-slate-100 flex items-center gap-1">
                          {[0, 150, 300].map((delay) => (
                            <span
                              key={delay}
                              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                              style={{ animationDelay: `${delay}ms` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-100 p-4">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your sales response…"
                    disabled={isGenerating}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-none text-slate-800 placeholder-slate-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isGenerating || !chatInput.trim()}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center gap-1.5 text-sm flex-shrink-0"
                  >
                    Send
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            {/* Restart */}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setStep("input");
                  setProduct("");
                  setLocation("");
                  setMarketContent("");
                  setTrainingContent("");
                  setMarketDone(false);
                  setTrainingDone(false);
                  setMessages([]);
                }}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline"
              >
                Start over with a new product / location
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-xs text-slate-400">
        SalesTrainer AI · Powered by Claude Opus
      </footer>
    </div>
  );
}
