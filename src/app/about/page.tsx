import Nav from "@/components/Nav";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        {/* Bio section */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
          <div className="overflow-hidden rounded-2xl shadow-lg bg-slate-100">
            <img
              src="/images/photo3.jpg"
              alt="Profile photo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1
              className="text-4xl font-bold mb-6"
              style={{ color: "#0C447C" }}
            >
              About
            </h1>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base">
              <p>
                I&apos;m a sales trainer and entrepreneur passionate about
                helping sales professionals close more deals with confidence and
                authenticity.
              </p>
              <p>
                After years in the field selling everything from solar to SaaS,
                I built SalesTrainer AI to give every salesperson the edge that
                top performers have — deep market knowledge, a polished pitch,
                and endless practice opportunities.
              </p>
              <p>
                SalesTrainer AI combines real-time market intelligence with
                AI-powered coaching so you walk into every sales conversation
                fully prepared. No more winging it. No more leaving money on
                the table.
              </p>
              <p>
                Whether you&apos;re brand new to sales or a seasoned rep
                entering a new territory, this tool meets you where you are and
                trains you to perform at your best.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="/trainer"
                style={{ backgroundColor: "#378ADD" }}
                className="inline-block text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                Try SalesTrainer AI →
              </a>
            </div>
          </div>
        </div>

        {/* Video section */}
        <div>
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: "#0C447C" }}
          >
            Watch: How It Works
          </h2>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-slate-100">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/FTdEoHVeSEw"
              title="SalesTrainer AI Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-slate-400 border-t">
        © 2026 SalesTrainer AI · Powered by Claude
      </footer>
    </div>
  );
}
