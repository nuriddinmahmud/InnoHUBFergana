import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="container mx-auto max-w-[1440px] px-8 py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <Link to="/" className="mb-4 flex items-center">
              <Logo className="h-20 w-auto" />
            </Link>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              O&apos;zbek tilida dasturlashni o&apos;rgatuvchi bepul platforma
            </p>
            <div className="flex gap-3">
              <a
                href="https://t.me/IT_Shaharcha_Yaypan"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Telegram
              </a>
              <a
                href="https://www.instagram.com/it_shaharcha_yaypan?utm_source=qr&igsh=cWthM2x1ZTlyYXVu"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Instagram
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[15px] font-semibold text-foreground">Navigatsiya</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Bosh sahifa", href: "/" },
                { label: "Kurslar", href: "/courses" },
                { label: "Kompilyator", href: "/compiler" },
                { label: "Biz haqimizda", href: "/#about" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[15px] font-semibold text-foreground">Aloqa</h4>
            <p className="mb-2 text-sm text-muted-foreground">Toshkent, O&apos;zbekiston</p>
            <a
              href="https://t.me/IT_Shaharcha_Yaypan"
              className="mb-1 block text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Telegram
            </a>
            <a
              href="https://www.instagram.com/it_shaharcha_yaypan?utm_source=qr&igsh=cWthM2x1ZTlyYXVu"
              className="block text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center">
        <p className="text-[13px] text-muted-foreground/50">© 2026 Inno HUB. Barcha huquqlar himoyalangan.</p>
      </div>
    </footer>
  );
};

export default Footer;
