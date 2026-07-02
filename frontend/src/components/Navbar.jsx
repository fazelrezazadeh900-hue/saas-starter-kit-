import { Link } from "react-router-dom";
import Button from "./Button.jsx";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-void/70 backdrop-blur-xl">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg tracking-tight">
          <span className="w-2 h-2 rounded-full bg-ember-gold animate-float-slow" />
          Ignite
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted">
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <a href="#pricing" className="hover:text-ink transition-colors">Pricing</a>
          <a href="#stack" className="hover:text-ink transition-colors">Stack</a>
        </div>

        <div className="flex items-center gap-3">
          <Button to="/login" variant="text">Log in</Button>
          <Button to="/register" variant="primary">Get started</Button>
        </div>
      </nav>
    </header>
  );
}
