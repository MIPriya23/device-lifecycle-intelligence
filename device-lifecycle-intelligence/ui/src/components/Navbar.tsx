import { NavLink, Link } from "react-router-dom";
import { Settings, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/overview" },
  { label: "Device Search", href: "/devices" },
  { label: "Alerts", href: "/alerts" },
  { label: "Reports", href: "/reports" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-zinc-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 ring-1 ring-zinc-800 transition-all group-hover:bg-zinc-700">
            <Cpu className="h-4 w-4 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-bold tracking-tight text-zinc-900">
            Device Lifecycle Intelligence
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ label, href }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400
                       transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
