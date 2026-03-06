import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ModeToggle } from "@/components/ModeToggle";

const Navbar = () => {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const navLinks = [
    { label: "Bosh sahifa", href: "/" },
    { label: "Kurslar", href: "/courses" },
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
            // Render hash links (e.g. "/#about") as plain Links so they
            // don't become "active" based only on pathname matching.
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
          <ModeToggle />
          {user ? (
            <>
              <Link to="/dashboard" className="text-muted-foreground text-[15px] hover:text-foreground transition-colors">
                👤 {user.name}
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
