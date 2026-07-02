import { Link } from "react-router-dom";

export function Button({ children, to, href, onClick, variant = "primary", type = "button", className = "" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-body font-semibold text-sm transition-all duration-200 focus-visible:outline-none";
  const variants = {
    primary: "bg-ember-gold text-void hover:brightness-110 hover:-translate-y-0.5 shadow-lg shadow-ember/20",
    ghost: "border border-line text-ink hover:border-gold/50 hover:bg-surface-2",
    text: "text-ink hover:text-gold",
  };
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) return <Link to={to} className={classes}>{children}</Link>;
  if (href) return <a href={href} className={classes}>{children}</a>;
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export default Button;
