"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav style={{ backgroundColor: "#0C447C" }}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-white font-bold text-xl tracking-tight hover:opacity-90 transition-opacity"
        >
          SalesTrainer AI
        </Link>
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hidden sm:block ${
                pathname === link.href
                  ? "text-white"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/trainer"
            style={{ backgroundColor: "#378ADD" }}
            className="text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Launch App →
          </Link>
        </div>
      </div>
    </nav>
  );
}
