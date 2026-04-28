import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, ImagePlus, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api";
import { isFirebaseAuthEnabled } from "@/lib/firebase";
import { getGoogleAuthErrorMessage, getGoogleRedirectProfile, signInWithGoogle } from "@/lib/googleAuth";

type RegisterFormState = {
  name: string;
  surname: string;
  email: string;
  password: string;
  avatarUrl: string;
};

const Register = () => {
  const navigate = useNavigate();
  const { register, loginWithFirebase, isAuthenticated, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [googleRedirectSubmitting, setGoogleRedirectSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [formData, setFormData] = useState<RegisterFormState>({
    name: "",
    surname: "",
    email: "",
    password: "",
    avatarUrl: "",
  });

  const fullName = useMemo(
    () => [formData.name.trim(), formData.surname.trim()].filter(Boolean).join(" ").trim(),
    [formData.name, formData.surname],
  );
  const isSubmitting = submitting || googleSubmitting || googleRedirectSubmitting;

  useEffect(() => {
    if (loading || isAuthenticated) {
      return;
    }

    let isMounted = true;

    const completeRedirectSignIn = async () => {
      setGoogleRedirectSubmitting(true);

      try {
        const googleProfile = await getGoogleRedirectProfile();

        if (!googleProfile || !isMounted) {
          return;
        }

        await loginWithFirebase(googleProfile);

        if (isMounted) {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        console.error("Google redirect authentication failed", err);
        const message = getGoogleAuthErrorMessage(
          err,
          getApiErrorMessage(err, "Google redirect orqali kirishda xato yuz berdi."),
        );
        setError(message);
        toast.error(message);
      } finally {
        if (isMounted) {
          setGoogleRedirectSubmitting(false);
        }
      }
    };

    void completeRedirectSignIn();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, loading, loginWithFirebase, navigate]);

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const name = formData.name.trim();
    const surname = formData.surname.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();
    const avatarUrl = formData.avatarUrl.trim();
    const normalizedFullName = [name, surname].filter(Boolean).join(" ").trim();

    if (!name) {
      setError("Ism majburiy.");
      return;
    }

    if (!email) {
      setError("Email majburiy.");
      return;
    }

    if (!password) {
      setError("Parol majburiy.");
      return;
    }

    if (!normalizedFullName) {
      setError("To'liq ism kiritilishi kerak.");
      return;
    }

    if (password.length < 8) {
      setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        email,
        password,
        fullName: normalizedFullName,
        ...(avatarUrl ? { avatarUrl } : {}),
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Ro'yxatdan o'tishda xato yuz berdi."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedImageFile(file);

    if (!file) {
      setLocalPreviewUrl("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setLocalPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGoogleRegister = async () => {
    setError("");

    if (!isFirebaseAuthEnabled) {
      const message = "Google orqali kirish hozircha sozlanmagan. Firebase sozlamalarini tekshiring.";
      setError(message);
      toast.error(message);
      return;
    }

    setGoogleSubmitting(true);

    try {
      const result = await signInWithGoogle();

      if (result.status === "redirect") {
        return;
      }

      await loginWithFirebase(result.profile);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Google authentication failed", err);
      const message = getGoogleAuthErrorMessage(
        err,
        getApiErrorMessage(err, "Google orqali kirishda xato yuz berdi."),
      );
      setError(message);
      toast.error(message);
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const previewImage = formData.avatarUrl.trim() || localPreviewUrl;

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
          <div className="w-full max-w-[520px] rounded-2xl border border-[#1E293B] bg-[#111111] p-8 shadow-[0_0_40px_rgba(34,197,94,0.08)] sm:p-10">
            <div className="mb-6 flex items-center justify-center">
              <Link to="/" className="flex items-center">
                <Logo className="h-24 w-auto" />
              </Link>
            </div>

            <div className="mb-8 space-y-4">
              <Button
                type="button"
                onClick={handleGoogleRegister}
                disabled={isSubmitting || !isFirebaseAuthEnabled}
                className="h-12 w-full rounded-xl border border-[#1E293B] bg-[#0A0A0A] font-semibold text-[#F8FAFC] hover:border-[#22C55E] hover:bg-[#111111]"
              >
                {googleSubmitting ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to Google...
                  </>
                ) : googleRedirectSubmitting ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Completing Google sign-in...
                  </>
                ) : !isFirebaseAuthEnabled ? (
                  <>
                    <GoogleIcon className="mr-3 h-5 w-5" />
                    Google sign-in unavailable
                  </>
                ) : (
                  <>
                    <GoogleIcon className="mr-3 h-5 w-5" />
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#1E293B]" />
                <span className="text-xs uppercase tracking-[0.24em] text-[#94A3B8]">yoki</span>
                <div className="h-px flex-1 bg-[#1E293B]" />
              </div>
            </div>

            <div className="mb-8 text-center">
              <h1 className="text-[28px] font-bold text-[#F8FAFC]">Ro&apos;yxatdan o&apos;ting</h1>
              <p className="mt-2 text-[15px] text-[#94A3B8]">Yangi hisob yarating</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm text-[#94A3B8]">Ism</label>
                  <Input
                    value={formData.name}
                    onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                    className="h-12 rounded-xl border-[#1E293B] bg-[#0A0A0A] px-4 text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus-visible:border-[#22C55E] focus-visible:ring-0"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-[#94A3B8]">Familiya</label>
                  <Input
                    value={formData.surname}
                    onChange={(event) => setFormData((current) => ({ ...current, surname: event.target.value }))}
                    className="h-12 rounded-xl border-[#1E293B] bg-[#0A0A0A] px-4 text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus-visible:border-[#22C55E] focus-visible:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#94A3B8]">To&apos;liq ism</label>
                <div className="rounded-xl border border-[#1E293B] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F8FAFC]">
                  {fullName || "Ism va familiya kiritilgach shu yerda ko'rinadi"}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#94A3B8]">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  className="h-12 rounded-xl border-[#1E293B] bg-[#0A0A0A] px-4 text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus-visible:border-[#22C55E] focus-visible:ring-0"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-[#94A3B8]">Parol</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
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

              <div className="space-y-3 rounded-2xl border border-[#1E293B] bg-[#0A0A0A] p-4">
                <div>
                  <label className="mb-1 block text-sm text-[#94A3B8]">Avatar URL</label>
                  <Input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatarUrl}
                    onChange={(event) => setFormData((current) => ({ ...current, avatarUrl: event.target.value }))}
                    className="h-12 rounded-xl border-[#1E293B] bg-[#111111] px-4 text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus-visible:border-[#22C55E] focus-visible:ring-0"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#94A3B8]">Yoki lokal rasm tanlang</label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#1E293B] px-4 py-4 text-sm text-[#94A3B8] transition hover:border-[#22C55E] hover:text-[#22C55E]">
                    <ImagePlus className="h-4 w-4" />
                    Rasm tanlash
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                  </label>
                  <p className="mt-2 text-xs text-[#94A3B8]">
                    Lokal fayl hozircha faqat preview uchun ishlatiladi. Upload backendga yuborilmaydi, chunki file-upload endpoint yo&apos;q.
                  </p>
                </div>

                {previewImage ? (
                  <div className="flex items-center gap-4 rounded-xl border border-[#1E293B] bg-[#111111] p-3">
                    <img src={previewImage} alt="Avatar preview" className="h-16 w-16 rounded-full object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#F8FAFC]">Avatar preview</p>
                      <p className="truncate text-xs text-[#94A3B8]">
                        {formData.avatarUrl.trim() || selectedImageFile?.name || "Lokal preview"}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {error ? (
                <div className="rounded-xl border border-[#EF4444] bg-[#EF4444]/10 px-4 py-3 text-sm text-[#EF4444]">
                  {error}
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-[#22C55E] font-semibold text-black hover:bg-[#16A34A]"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Ro&apos;yxatdan o&apos;tilmoqda...
                  </>
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </Button>
            </form>

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

export default Register;
