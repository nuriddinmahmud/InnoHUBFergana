import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Download, LoaderCircle, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUserProfile, updateCurrentUserProfile } from "@/api/auth";
import { getAvatarSrc, handleAvatarError } from "@/lib/auth";
import { getApiErrorMessage } from "@/lib/api";

const MAX_AVATAR_SIZE = 512;
const AVATAR_QUALITY = 0.82;

async function readBlobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Rasmni o'qib bo'lmadi."));
    };
    reader.onerror = () => reject(new Error("Rasmni o'qib bo'lmadi."));
    reader.readAsDataURL(blob);
  });
}

async function compressImageToBase64(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Faqat rasm faylini tanlang.");
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Rasmni yuklab bo'lmadi."));
      img.src = imageUrl;
    });

    const scale = Math.min(1, MAX_AVATAR_SIZE / image.width, MAX_AVATAR_SIZE / image.height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext("2d");

    if (!context) {
      return readBlobAsDataUrl(file);
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const compressedBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
            return;
          }

          reject(new Error("Rasmni siqib bo'lmadi."));
        },
        "image/jpeg",
        AVATAR_QUALITY,
      );
    });

    return readBlobAsDataUrl(compressedBlob);
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
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
        setAvatarPreview(getAvatarSrc(profile.avatar, profile.avatarUrl));
      } catch (err) {
        if (!mounted) return;
        setError(getApiErrorMessage(err, "Profil ma'lumotlarini yuklab bo'lmadi."));
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

  useEffect(() => {
    if (!user) {
      return;
    }

    setAvatarPreview(getAvatarSrc(user.avatar, user.avatarUrl));
  }, [user]);

  const handleSave = async () => {
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

    if (!fullName) {
      toast.error("Ism yoki familiyani kiriting.");
      return;
    }

    setSavingProfile(true);
    setError("");

    try {
      await updateCurrentUserProfile({
        firstName,
        lastName,
        fullName,
        name: fullName,
        email: formData.email.trim(),
      });
      await refreshProfile();
      toast.success("Profil muvaffaqiyatli yangilandi.");
    } catch (err) {
      const message = getApiErrorMessage(err, "Profilni saqlashda xato yuz berdi.");
      setError(message);
      toast.error(message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setUploadingAvatar(true);
    setError("");

    try {
      const avatarBase64 = await compressImageToBase64(file);
      setAvatarPreview(avatarBase64);
      await updateCurrentUserProfile({
        avatar: avatarBase64,
        avatarUrl: avatarBase64,
        photoURL: avatarBase64,
      });
      await refreshProfile();
      toast.success("Profil rasmi yangilandi.");
    } catch (err) {
      const message = getApiErrorMessage(err, "Profil rasmini yuklashda xato yuz berdi.");
      setError(message);
      toast.error(message);
      setAvatarPreview(user ? getAvatarSrc(user.avatar, user.avatarUrl) : "");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const avatarSrc = avatarPreview || (user ? getAvatarSrc(user.avatar, user.avatarUrl) : "");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-[800px] px-8 py-12">
        <div className="mb-10 flex flex-col items-center">
          <div className="relative mb-4">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.name ?? "Foydalanuvchi"}
                onError={handleAvatarError}
                className="h-[120px] w-[120px] rounded-full border-2 border-primary object-cover"
              />
            ) : (
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-2 border-primary bg-primary/20 text-4xl">
                {user?.name?.charAt(0).toUpperCase() ?? "I"}
              </div>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
              title="Change profile picture"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
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

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Ism</label>
              <Input
                value={formData.firstName}
                onChange={(event) => setFormData({ ...formData, firstName: event.target.value })}
                className="bg-card"
                disabled={loading || savingProfile}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Familiya</label>
              <Input
                value={formData.lastName}
                onChange={(event) => setFormData({ ...formData, lastName: event.target.value })}
                className="bg-card"
                disabled={loading || savingProfile}
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
                disabled={loading || savingProfile}
              />
              <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} title="Profilni saqlash" disabled={loading || savingProfile || uploadingAvatar}>
              {savingProfile ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Saqlanmoqda...
                </>
              ) : (
                "Saqlash"
              )}
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
