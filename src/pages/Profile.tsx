import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Download, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUserProfile } from "@/api/auth";
import { getAvatarSrc, handleAvatarError } from "@/lib/auth";

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const profile = await getCurrentUserProfile();
        if (!mounted) return;

        const [firstName = "", ...rest] = profile.name.split(" ");
        setFormData({
          firstName,
          lastName: rest.join(" "),
          email: profile.email,
        });
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Profil ma'lumotlarini yuklab bo'lmadi");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setSaved(true);
    await refreshProfile();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-[800px] px-8 py-12">
        <div className="mb-10 flex flex-col items-center">
          <div className="relative mb-4">
            {user?.avatar || user?.avatarUrl ? (
              <img
                src={getAvatarSrc(user.avatar, user.avatarUrl)}
                alt={user.name}
                onError={handleAvatarError}
                className="h-[120px] w-[120px] rounded-full border-2 border-primary object-cover"
              />
            ) : (
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-primary bg-primary/20 text-4xl">
                {user?.name?.charAt(0).toUpperCase() ?? "I"}
              </div>
            )}
            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
              title="Change profile picture"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <h2 className="text-[28px] font-bold">{user?.name ?? "Foydalanuvchi"}</h2>
          <p className="mb-2 text-[15px] text-muted-foreground">{user?.email ?? "Email topilmadi"}</p>
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {user?.role === "ADMIN" || user?.role === "SUPER_ADMIN" ? "Admin" : "Talaba"}
          </span>
        </div>

        <div className="mb-12">
          <h3 className="mb-6 text-xl font-semibold">Shaxsiy ma&apos;lumotlar</h3>
          {loading ? (
            <div className="mb-4 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
              Profil yuklanmoqda...
            </div>
          ) : null}
          {error ? (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
              {error}
            </div>
          ) : null}
          {saved ? (
            <div className="mb-4 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
              Profil muvaffaqiyatli yangilandi
            </div>
          ) : null}

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Ism</label>
              <Input
                value={formData.firstName}
                onChange={(event) => setFormData({ ...formData, firstName: event.target.value })}
                className="bg-card"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Familiya</label>
              <Input
                value={formData.lastName}
                onChange={(event) => setFormData({ ...formData, lastName: event.target.value })}
                className="bg-card"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Email manzil</label>
            <div className="relative">
              <Input
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="bg-card pr-10"
              />
              <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} title="Profilni saqlash">
              Saqlash
            </Button>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-xl font-semibold">Mening sertifikatlarim</h3>
          <div className="space-y-3">
            {[
              { course: "HTML", date: "2025-01-15" },
              { course: "CSS", date: "2025-02-20" },
            ].map((cert) => (
              <div
                key={cert.course}
                className="flex items-center gap-4 rounded-xl border border-border border-l-[3px] border-l-primary bg-card p-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{cert.course} kursi</p>
                  <p className="text-xs text-muted-foreground">{cert.date}</p>
                </div>
                <button type="button" className="text-sm text-primary hover:underline">
                  PDF yuklab olish
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
