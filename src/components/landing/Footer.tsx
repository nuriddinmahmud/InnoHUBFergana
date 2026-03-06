import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="w-full bg-card border-t border-border">
      <div className="container max-w-[1440px] mx-auto px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <Logo className="h-20 w-auto" />
            </Link>
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              O'zbek tilida dasturlashni o'rgatuvchi bepul platforma
            </p>
            <div className="flex gap-3">
              <a href="https://t.me/IT_Shaharcha_Yaypan" className="text-muted-foreground hover:text-primary transition-colors text-sm">Telegram</a>
              <a href="https://www.instagram.com/it_shaharcha_yaypan?utm_source=qr&igsh=cWthM2x1ZTlyYXVu" className="text-muted-foreground hover:text-primary transition-colors text-sm">Instagram</a>
            </div>
          </div>

          {/* Center */}
          <div>
            <h4 className="text-foreground font-semibold text-[15px] mb-4">Navigatsiya</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Bosh sahifa", href: "/" },
                { label: "Kurslar", href: "/courses" },
                { label: "Kompilyator", href: "/compiler" },
                { label: "Biz haqimizda", href: "/#about" },
              ].map((link) => (
                <Link key={link.label} to={link.href} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right */}
          <div>
            <h4 className="text-foreground font-semibold text-[15px] mb-4">Aloqa</h4>
            <p className="text-muted-foreground text-sm mb-2">Toshkent, O'zbekiston</p>
            <a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors block mb-1">Telegram</a>
            <a href="#" className="text-muted-foreground text-sm hover:text-primary transition-colors block">Instagram</a>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center">
        <p className="text-muted-foreground/50 text-[13px]">© 2026 Inno HUB. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );
};

export default Footer;
