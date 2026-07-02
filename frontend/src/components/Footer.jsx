export default function Footer() {
  return (
    <footer className="border-t border-line mt-32">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-display font-semibold">
          <span className="w-2 h-2 rounded-full bg-ember-gold" />
          Ignite
        </div>
        <p className="text-sm text-muted">Auth, billing, and an admin panel — ready before your coffee gets cold.</p>
        <p className="text-xs text-muted font-mono">© 2026 Ignite Starter Kit</p>
      </div>
    </footer>
  );
}
