import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { saveAccessToken } from "@/lib/auth";
import { LoaderCircle } from "lucide-react";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loadUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      saveAccessToken(token);
      void (async () => {
        await loadUser();
        navigate("/dashboard", { replace: true });
      })();
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, loadUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <div className="text-center">
        <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-[#22C55E]" />
        <p className="mt-4 text-lg text-[#F8FAFC]">Tizimga kirilmoqda...</p>
      </div>
    </div>
  );
}
