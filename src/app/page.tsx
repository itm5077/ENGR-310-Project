"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import { useState, FormEvent } from "react";

const features = [
  {
    icon: "📊",
    title: "Market Intelligence",
    description:
      "Get real-time competitor analysis, local demographic data, and market positioning insights tailored to your specific territory.",
  },
  {
    icon: "🎯",
    title: "Custom Training",
    description:
      "Receive a personalized sales playbook with pitch frameworks, objection handling scripts, and closing strategies built for your product.",
  },
  {
    icon: "🎭",
    title: "Live Sales Experience",
    description:
      "Practice against an AI customer that reflects real local demographics and raises genuine objections — before you're in the field.",
  },
];

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      {/* ── Hero ── */}
      <section
        style={{ backgroundColor: "#0C447C" }}
        className="text-white py-24 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "rgba(55,138,221,0.25)", color: "#93c5fd" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "#378ADD" }}
            />
            AI-Powered Sales Training
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
            Train Smarter.
            <br />
            Sell Better.
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "#93c5fd" }}
          >
            AI-powered sales training that analyzes your market, builds your
            custom playbook, and lets you practice live sales conversations —
            all before you knock on a single door.
          </p>
          <Link
            href="/trainer"
            style={{ backgroundColor: "#378ADD" }}
            className="inline-block text-white font-bold text-lg px-10 py-4 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            Start Training Free →
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-4"
            style={{ color: "#0C447C" }}
          >
            Everything You Need to Close More Deals
          </h2>
          <p className="text-center text-slate-500 mb-12 max-w-xl mx-auto">
            Three powerful AI modules work together to prepare you for every
            sales situation.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: "#0C447C" }}
                >
                  {f.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo Grid ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: "#0C447C" }}
          >
            Real Salespeople. Real Results.
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              "/images/photo1.jpg",
              "/images/photo2.jpg",
              "/images/photo3.jpg",
            ].map((src, i) => (
              <div
                key={i}
                className="aspect-square relative overflow-hidden rounded-2xl bg-slate-100"
              >
                <img
                  src={src}
                  alt={`Sales professional photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Email Capture ── */}
      <section style={{ backgroundColor: "#0C447C" }} className="py-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Early Access
          </h2>
          <p className="mb-8" style={{ color: "#93c5fd" }}>
            Join sales professionals getting AI-powered training insights every
            week.
          </p>
          {submitted ? (
            <div
              className="rounded-2xl px-8 py-8 border"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-white font-semibold text-lg">
                You&apos;re on the list!
              </p>
              <p className="text-sm mt-1" style={{ color: "#93c5fd" }}>
                We&apos;ll be in touch soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-5 py-3.5 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none text-sm"
              />
              <button
                type="submit"
                style={{ backgroundColor: "#378ADD" }}
                className="text-white font-semibold px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap text-sm"
              >
                Get Access
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-slate-400 border-t">
        © 2026 SalesTrainer AI · Powered by Claude
      </footer>
    </div>
  );
}
