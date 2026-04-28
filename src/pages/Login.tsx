import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fromLocation = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)
    ?.from;
  const redirectTo = fromLocation?.pathname
    ? `${fromLocation.pathname}${fromLocation.search ?? ""}${fromLocation.hash ?? ""}`
    : "/dashboard";

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email va parolni kiriting.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Tizimga kirishda xato yuz berdi."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-8 inline-flex items-center gap-2 text-[#94A3B8] transition-colors hover:text-[#22C55E]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Bosh sahifaga qaytish</span>
        </button>

        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <div className="w-full max-w-[440px] rounded-2xl border border-[#1E293B] bg-[#111111] p-8 shadow-[0_0_40px_rgba(34,197,94,0.08)] sm:p-10">
            <div className="mb-6 flex items-center justify-center">
              <Link to="/" className="flex items-center">
                <Logo className="h-24 w-auto" />
              </Link>
            </div>

            <div className="mb-8 text-center">
              <h1 className="text-[28px] font-bold text-[#F8FAFC]">Xush kelibsiz</h1>
              <p className="mt-2 text-[15px] text-[#94A3B8]">Hisobingizga kiring</p>
            </div>

            <div className="mb-8 space-y-4">
              <a
                href={import.meta.env.VITE_GOOGLE_AUTH_URL}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#1E293B] bg-[#0A0A0A] font-semibold text-[#F8FAFC] transition-colors hover:border-[#22C55E] hover:bg-[#111111]"
              >
                <GoogleIcon className="h-5 w-5" />
                Google orqali kirish
              </a>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#1E293B]" />
                <span className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">yoki</span>
                <div className="h-px flex-1 bg-[#1E293B]" />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-[#94A3B8]">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 rounded-xl border-[#1E293B] bg-[#0A0A0A] px-4 text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus-visible:border-[#22C55E] focus-visible:ring-0"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#94A3B8]">Parol</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    className="h-12 rounded-xl border-[#1E293B] bg-[#0A0A0A] px-4 pr-12 text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus-visible:border-[#22C55E] focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#22C55E]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-[#EF4444] bg-[#EF4444]/10 px-4 py-3 text-sm text-[#EF4444]">
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-xl bg-[#22C55E] font-semibold text-black hover:bg-[#16A34A]"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Kirish...
                  </>
                ) : (
                  "Kirish"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#94A3B8]">
              Hisobingiz yo&apos;qmi?{" "}
              <Link to="/register" className="font-medium text-[#22C55E] hover:underline">
                Ro&apos;yxatdan o&apos;ting
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      d="M21.805 10.023H12.25v3.955h5.512c-.236 1.274-.96 2.352-2.006 3.076v2.551h3.244c1.899-1.748 2.995-4.322 2.995-7.38 0-.733-.066-1.437-.19-2.202Z"
      fill="#4285F4"
    />
    <path
      d="M12.25 22c2.734 0 5.027-.907 6.703-2.446l-3.244-2.551c-.902.605-2.057.962-3.459.962-2.643 0-4.883-1.783-5.682-4.181H3.217v2.632A10.117 10.117 0 0 0 12.25 22Z"
      fill="#34A853"
    />
    <path
      d="M6.568 13.784A6.088 6.088 0 0 1 6.25 12c0-.619.111-1.219.318-1.784V7.584H3.217A10.118 10.118 0 0 0 2.125 12c0 1.634.391 3.182 1.092 4.416l3.35-2.632Z"
      fill="#FBBC05"
    />
    <path
      d="M12.25 6.036c1.486 0 2.82.511 3.869 1.512l2.902-2.901C17.273 3.018 14.98 2 12.25 2a10.117 10.117 0 0 0-9.033 5.584l3.35 2.632c.799-2.398 3.04-4.18 5.683-4.18Z"
      fill="#EA4335"
    />
  </svg>
);

export default Login;
