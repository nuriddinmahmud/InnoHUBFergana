import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getAvatarSrc, handleAvatarError } from "@/lib/auth";

const Navbar = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const auth = useAuth();
  const { user } = auth;

  const handleLogout = async () => {
    await auth.logout();
  };

  const navLinks = [
    { label: "Bosh sahifa", href: "/" },
    { label: "Kurslar", href: "/courses" },
    ...(user ? [{ label: "Dashboard", href: "/dashboard" }] : []),
    ...(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? [{ label: "Admin", href: "/admin" }] : []),
    { label: "Kompilyator", href: "/compiler" },
    { label: "Biz haqimizda", href: "/#about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-[72px] bg-background border-b border-border flex items-center">
      <div className="container max-w-[1440px] mx-auto flex items-center justify-between px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <Logo className="h-20 w-auto" />
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.href.includes("#") ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground text-[15px] hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <NavLink
                key={link.label}
                to={link.href}
                className="text-muted-foreground text-[15px] hover:text-foreground transition-colors"
                activeClassName="text-foreground font-medium"
              >
                {link.label}
              </NavLink>
            ),
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Mavzuni almashtirish"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-muted-foreground text-[15px] hover:text-foreground transition-colors"
              >
                {user.avatar || user.avatarUrl ? (
                  <img
                    src={getAvatarSrc(user.avatar, user.avatarUrl)}
                    alt={user.name}
                    onError={handleAvatarError}
                    className="h-8 w-8 rounded-full border border-border object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>{user.name}</span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                title="Tizimdan chiqish"
              >
                Chiqish
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Kirish</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Ro'yxatdan o'tish</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
