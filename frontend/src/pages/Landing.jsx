import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Button from "../components/Button.jsx";
import TerminalWindow from "../components/TerminalWindow.jsx";

const FEATURES = [
  {
    title: "Auth that's actually done",
    body: "JWT access + refresh tokens, password reset, and role-based admin access. Not a tutorial — production middleware.",
  },
  {
    title: "Billing, two ways",
    body: "Stripe for card markets. A crypto provider wired in for the 30+ countries Stripe won't touch. Swap either on or off.",
  },
  {
    title: "An admin panel that ships",
    body: "List users, deactivate accounts, manually confirm a payment. The unglamorous screens you'd otherwise build at 1am.",
  },
  {
    title: "Migrations, not guesswork",
    body: "Alembic wired to your models from commit one. Change a schema, generate a migration, move on.",
  },
];

const STACK = ["FastAPI", "PostgreSQL", "SQLAlchemy", "Docker", "Alembic", "React"];

export default function Landing() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora pointer-events-none" />
      <div className="noise-overlay" />

      <Navbar />

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-28 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-gold border border-gold/30 rounded-full px-3 py-1 mb-6">
            v1.0 · backend + frontend included
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
            Ship your SaaS
            <br />
            <span className="text-gradient">this weekend,</span>
            <br />
            not this quarter.
          </h1>
          <p className="mt-6 text-lg text-muted max-w-md">
            A FastAPI starter kit with auth, dual billing, and an admin panel
            already wired together. Clone it, rename it, charge for it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/register" variant="primary">Get the kit</Button>
            <Button href="#features" variant="ghost">See what's inside</Button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <TerminalWindow />
        </div>
      </section>

      {/* Stack strip */}
      <section id="stack" className="relative border-y border-line bg-surface/40">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {STACK.map((s) => (
            <span key={s} className="font-mono text-sm text-muted">{s}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative max-w-6xl mx-auto px-6 py-28">
        <div className="max-w-lg mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Everything you'd build anyway.
            <span className="text-gradient"> Already built.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-line bg-surface/60 p-7 transition-colors hover:border-gold/40"
            >
              <h3 className="font-display text-xl font-medium mb-2">{f.title}</h3>
              <p className="text-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative max-w-6xl mx-auto px-6 py-20">
        <div className="rounded-3xl border border-line bg-gradient-to-br from-surface to-surface-2 p-10 md:p-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold mb-3">One license. Unlimited projects.</h2>
            <p className="text-muted leading-relaxed">
              Buy once, use it for every client project or your own startup.
              No seat limits, no recurring fee to the kit itself.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl font-semibold text-gradient">$249</span>
              <span className="text-muted">one-time</span>
            </div>
            <Button to="/register" variant="primary" className="mt-6">Get the kit</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
