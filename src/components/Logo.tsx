import logo from "@/images/logowith.png";

interface LogoProps {
  className?: string;
  alt?: string;
}

export const Logo = ({ className = "h-48 w-auto", alt = "INNO[HUB]" }: LogoProps) => (
  <img src={logo} alt={alt} className={className} />
);
