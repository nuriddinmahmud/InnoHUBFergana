import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register as registerUser } from "@/api/auth";
import { ApiError } from "@/lib/api";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = formData.password.length === 0 ? 0 : formData.password.length < 6 ? 1 : formData.password.length < 10 ? 2 : 3;
  const strengthColors = ["", "bg-[#EF4444]", "bg-yellow-500", "bg-[#22C55E]"];
  const strengthLabels = ["", "Kuchsiz", "O'rtacha", "Kuchli"];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.surname || !formData.email || !formData.password) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }

    if (formData.password.length < 8) {
      setError("Parol kamida 8 ta belgiga ega bo'lishi kerak");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password,
      });

      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof ApiError ? err.message : "Ro'yxatdan o'tishda xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google orqali kirishda xato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-8 inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#22C55E] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Bosh sahifaga qaytish</span>
        </button>

        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <div className="w-full max-w-[440px] rounded-2xl border border-[#1E293B] bg-[#111111] p-8 sm:p-10 shadow-[0_0_40px_rgba(34,197,94,0.08)]">
            <div className="mb-6 flex items-center justify-center">
              <Link to="/" className="flex items-center">
                <Logo className="h-24 w-auto" />
              </Link>
            </div>

            <div className="mb-8 text-center">
              <h1 className="text-[28px] font-bold text-[#F8FAFC]">Ro&apos;yxatdan o&apos;ting</h1>
              <p className="mt-2 text-[15px] text-[#94A3B8]">Bepul hisob yarating</p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl border border-[#1E293B] bg-white px-4 py-3 text-[15px] font-medium text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
              title="Google bilan davom etish"
            >
              {loading ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              {loading ? "Kirish..." : "Continue with Google"}
            </button>

            <div className="mb-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#1E293B]" />
              <span className="text-sm text-[#94A3B8]">yoki</span>
              <div className="h-px flex-1 bg-[#1E293B]" />
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm text-[#94A3B8]">Ism</label>
                  <Input
                    placeholder="Ma'murjon"
                    className="h-12 rounded-xl border-[#1E293B] bg-[#0A0A0A] px-4 text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus-visible:ring-0 focus-visible:border-[#22C55E]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-[#94A3B8]">Familiya</label>
                  <Input
                    placeholder="Saidov"
                    className="h-12 rounded-xl border-[#1E293B] bg-[#0A0A0A] px-4 text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus-visible:ring-0 focus-visible:border-[#22C55E]"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#94A3B8]">Email manzil</label>
                <Input
                  type="email"
                  placeholder="mamurjon@email.com"
                  className="h-12 rounded-xl border-[#1E293B] bg-[#0A0A0A] px-4 text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus-visible:ring-0 focus-visible:border-[#22C55E]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#94A3B8]">Parol</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-[#1E293B] bg-[#0A0A0A] px-4 pr-12 text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus-visible:ring-0 focus-visible:border-[#22C55E]"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#22C55E] transition-colors"
                    title={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {formData.password.length > 0 ? (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3].map((index) => (
                        <div
                          key={index}
                          className={`h-1.5 flex-1 rounded-full ${index <= strength ? strengthColors[strength] : "bg-[#1E293B]"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#94A3B8]">{strengthLabels[strength]}</span>
                  </div>
                ) : null}
              </div>

              <Button
                type="submit"
                className="mt-2 h-12 w-full rounded-xl bg-[#22C55E] py-3 font-semibold text-black hover:bg-[#16A34A]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Ro&apos;yxatdan o&apos;tilmoqda...
                  </>
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </Button>
            </form>

            {error ? (
              <div className="mt-4 rounded-xl border border-[#EF4444] bg-[#EF4444]/10 px-4 py-3 text-sm text-[#EF4444]">
                {error}
              </div>
            ) : null}

            <p className="mt-6 text-center text-sm text-[#94A3B8]">
              Hisobingiz bormi?{" "}
              <Link to="/login" className="font-medium text-[#22C55E] hover:underline">
                Kirish
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
