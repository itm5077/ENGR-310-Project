"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import { useState } from "react";

const steps = [
  {
    id: 1,
    icon: "📊",
    title: "Market Intelligence",
    subtitle: "Know your battlefield before you show up.",
    description:
      "Enter your product and target location. SalesTrainer AI instantly analyzes competitors, local demographics, economic conditions, and market opportunities — giving you the intel top reps spend hours researching.",
    placeholder: "e.g. Solar panels in Austin, TX",
    inputLabel: "Try it: enter a product + location",
    color: "#378ADD",
  },
  {
    id: 2,
    icon: "🎯",
    title: "Custom Training",
    subtitle: "Your personalized sales playbook, built by AI.",
    description:
      "Based on your market intelligence, the platform generates a custom training guide with three pitch variations, the top five objections you'll face, a value proposition framework, and closing strategies tailored to your local market.",
    placeholder: "e.g. Life insurance in Chicago suburbs",
    inputLabel: "Try it: what would you like a playbook for?",
    color: "#7c3aed",
  },
  {
    id: 3,
    icon: "🎭",
    title: "Live Sales Experience",
    subtitle: "Practice with a customer who pushes back.",
    description:
      "Step into a live conversation with an AI customer built from real local demographics. They'll greet you, express genuine interest, and immediately raise real objections. Practice your responses until you're ready for the field.",
    placeholder: "e.g. SaaS software in New York City",
    inputLabel: "Try it: describe your sales scenario",
    color: "#059669",
  },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [inputs, setInputs] = useState(["", "", ""]);

  const step = steps[activeStep];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1 w-full">
        {/* Header */}
        <section
          style={{ backgroundColor: "#0C447C" }}
          className="py-16 px-6 text-white text-center"
        >
          <h1 className="text-4xl font-bold mb-4">How It Works</h1>
          <p className="text-blue-200 max-w-xl mx-auto text-lg">
            Three AI-powered steps take you from zero context to fully prepared
            — in minutes.
          </p>
        </section>

        {/* Tab nav */}
        <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 flex">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                  activeStep === i
                    ? "border-current text-current"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
                style={
                  activeStep === i ? { borderColor: s.color, color: s.color } : {}
                }
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">Step {s.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="max-w-4xl mx-auto px-6 py-14">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: description */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${step.color}18` }}
                >
                  {step.icon}
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: step.color }}
                >
                  Step {step.id} of 3
                </span>
              </div>
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: "#0C447C" }}
              >
                {step.title}
              </h2>
              <p className="text-slate-500 font-medium mb-4">{step.subtitle}</p>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>

            {/* Right: demo input */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-3">
                {step.inputLabel}
              </p>
              <input
                type="text"
                value={inputs[activeStep]}
                onChange={(e) => {
                  const updated = [...inputs];
                  updated[activeStep] = e.target.value;
                  setInputs(updated);
                }}
                placeholder={step.placeholder}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none text-slate-800 placeholder-slate-400 text-sm transition-colors mb-4"
                style={{ borderColor: inputs[activeStep] ? step.color : undefined }}
              />
              <Link
                href="/trainer"
                className="block w-full text-center text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
                style={{ backgroundColor: step.color }}
              >
                Launch the full app →
              </Link>
              <p className="text-xs text-slate-400 text-center mt-3">
                Free to use · No signup required
              </p>
            </div>
          </div>

          {/* Step nav buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
            <button
              onClick={() => setActiveStep((i) => Math.max(0, i - 1))}
              disabled={activeStep === 0}
              className="px-5 py-2.5 text-sm text-slate-600 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className="w-2.5 h-2.5 rounded-full transition-colors"
                  style={{
                    backgroundColor:
                      activeStep === i ? step.color : "#cbd5e1",
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveStep((i) => Math.min(steps.length - 1, i + 1))}
              disabled={activeStep === steps.length - 1}
              className="px-5 py-2.5 text-sm text-white font-semibold rounded-xl transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: step.color }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* CTA */}
        <section
          style={{ backgroundColor: "#0C447C" }}
          className="py-16 px-6 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start training?
          </h2>
          <p className="text-blue-200 mb-8 max-w-md mx-auto">
            Enter your product and location and go from zero context to fully
            prepared in under 5 minutes.
          </p>
          <Link
            href="/trainer"
            style={{ backgroundColor: "#378ADD" }}
            className="inline-block text-white font-bold px-10 py-4 rounded-xl hover:opacity-90 transition-opacity text-lg shadow-lg"
          >
            Launch SalesTrainer AI →
          </Link>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-slate-400 border-t">
        © 2026 SalesTrainer AI · Powered by Claude
      </footer>
    </div>
  );
}
