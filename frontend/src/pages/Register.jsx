import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import api from "../lib/api.js";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register(email, password, fullName);
      const data = await api.login(email, password);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-void relative flex items-center justify-center px-6 py-16">
      <div className="absolute inset-0 bg-aurora pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg mb-10 justify-center">
          <span className="w-2 h-2 rounded-full bg-ember-gold" />
          Ignite
        </Link>

        <div className="rounded-2xl border border-line bg-surface/70 backdrop-blur-xl p-8">
          <h1 className="font-display text-2xl font-semibold mb-1">Create your account</h1>
          <p className="text-muted text-sm mb-6">Start on the free plan, upgrade anytime.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-mono text-muted mb-2">FULL NAME</label>
              <input
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-gold/50 outline-none transition-colors"
                placeholder="Ada Lovelace"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-mono text-muted mb-2">EMAIL</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-gold/50 outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-mono text-muted mb-2">PASSWORD</label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-gold/50 outline-none transition-colors"
                placeholder="At least 8 characters"
              />
            </div>

            {error && (
              <p className="text-sm text-ember bg-ember/10 border border-ember/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" className="w-full">
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-gold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
