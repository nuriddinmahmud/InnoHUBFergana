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

  if (!loading && isAuthenticated) {
    const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/dashboard";
    return <Navigate to={nextPath} replace />;
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
      navigate("/dashboard", { replace: true });
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

export default Login;
