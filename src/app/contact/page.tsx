"use client";

import Nav from "@/components/Nav";
import { useState, FormEvent } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.name.trim() && form.email.trim() && form.message.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      {/* Header */}
      <section
        style={{ backgroundColor: "#0C447C" }}
        className="py-16 px-6 text-white text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-blue-200 max-w-md mx-auto">
          Questions, feedback, or partnership inquiries — we&apos;d love to
          hear from you.
        </p>
      </section>

      <main className="flex-1 max-w-2xl mx-auto px-6 py-16 w-full">
        {submitted ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">✅</div>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "#0C447C" }}
            >
              Message received!
            </h2>
            <p className="text-slate-500">
              Thanks for reaching out. We&apos;ll get back to you within one
              business day.
            </p>
            <button
              onClick={() => {
                setForm({ name: "", email: "", message: "" });
                setSubmitted(false);
              }}
              className="mt-8 text-sm underline text-slate-400 hover:text-slate-600 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: "#0C447C" }}
            >
              Send a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none text-slate-800 placeholder-slate-400 text-sm transition-colors"
                  style={
                    form.name
                      ? { borderColor: "#378ADD" }
                      : {}
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none text-slate-800 placeholder-slate-400 text-sm transition-colors"
                  style={
                    form.email
                      ? { borderColor: "#378ADD" }
                      : {}
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none text-slate-800 placeholder-slate-400 text-sm transition-colors resize-none"
                  style={
                    form.message
                      ? { borderColor: "#378ADD" }
                      : {}
                  }
                />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: "#0C447C" }}
                className="w-full py-3.5 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm mt-2"
              >
                Send Message
              </button>
            </form>
          </div>
        )}
      </main>

      <footer className="py-8 text-center text-sm text-slate-400 border-t">
        © 2026 SalesTrainer AI · Powered by Claude
      </footer>
    </div>
  );
}
