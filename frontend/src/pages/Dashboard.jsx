import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import api from "../lib/api.js";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    Promise.all([api.me(), api.mySubscription()])
      .then(([u, s]) => {
        setUser(u);
        setSubscription(s);
      })
      .catch((err) => setError(err.message));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-void relative">
      <div className="absolute inset-0 bg-aurora pointer-events-none" />

      <header className="relative border-b border-line">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
            <span className="w-2 h-2 rounded-full bg-ember-gold" />
            Ignite
          </Link>
          <Button variant="ghost" onClick={handleLogout}>Log out</Button>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-6 py-14">
        {error && (
          <p className="text-sm text-ember bg-ember/10 border border-ember/30 rounded-lg px-4 py-3 mb-8">
            {error} — try logging in again.
          </p>
        )}

        <h1 className="font-display text-3xl font-semibold mb-1">
          {user ? `Welcome, ${user.full_name || user.email}` : "Loading…"}
        </h1>
        <p className="text-muted mb-10">Here's where your account stands.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-line bg-surface/60 p-7">
            <h2 className="font-mono text-xs text-muted mb-4">ACCOUNT</h2>
            {user && (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Email</dt>
                  <dd>{user.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Verified</dt>
                  <dd>{user.is_verified ? "Yes" : "Not yet"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Member since</dt>
                  <dd>{new Date(user.created_at).toLocaleDateString()}</dd>
                </div>
              </dl>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-surface/60 p-7">
            <h2 className="font-mono text-xs text-muted mb-4">SUBSCRIPTION</h2>
            {subscription && (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Plan</dt>
                  <dd className="capitalize">{subscription.plan}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Status</dt>
                  <dd className="capitalize">
                    <span className={subscription.status === "active" ? "text-gold" : "text-muted"}>
                      {subscription.status}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Provider</dt>
                  <dd className="capitalize">{subscription.provider}</dd>
                </div>
              </dl>
            )}
            {subscription?.plan === "free" && (
              <Button variant="primary" className="w-full mt-6" href="/#pricing">
                Upgrade plan
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
