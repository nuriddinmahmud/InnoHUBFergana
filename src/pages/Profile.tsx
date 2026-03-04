import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Lock, Download } from "lucide-react";

const Profile = () => {
  const [formData, setFormData] = useState({ firstName: "Sardor", lastName: "Karimov", email: "sardor@email.com" });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-[800px] mx-auto px-8 py-12">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="w-[120px] h-[120px] rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-4xl">
              👨‍💻
            </div>
            <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground" title="Change profile picture">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-[28px] font-bold">Sardor Karimov</h2>
          <p className="text-muted-foreground text-[15px] mb-2">sardor@email.com</p>
          <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-medium">
            2025 yildan a'zo
          </span>
        </div>

        {/* Edit form */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6">Shaxsiy ma'lumotlar</h3>
          {saved && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm mb-4">
              ✓ Profil muvaffaqiyatli yangilandi
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-foreground text-sm font-medium mb-1.5 block">Ism</label>
              <Input 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="bg-card" 
              />
            </div>
            <div>
              <label className="text-foreground text-sm font-medium mb-1.5 block">Familiya</label>
              <Input 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="bg-card" 
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="text-foreground text-sm font-medium mb-1.5 block">Email manzil</label>
            <div className="relative">
              <Input 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-card pr-10" 
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave} title="Profilni saqlash">Saqlash</Button>
          </div>
        </div>

        {/* Certificates */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Mening sertifikatlarim</h3>
          <div className="space-y-3">
            {[
              { course: "HTML", date: "2025-01-15" },
              { course: "CSS", date: "2025-02-20" },
            ].map((cert) => (
              <div key={cert.course} className="flex items-center gap-4 p-4 bg-card border border-border border-l-[3px] border-l-primary rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{cert.course} kursi</p>
                  <p className="text-muted-foreground text-xs">{cert.date}</p>
                </div>
                <button className="text-primary text-sm hover:underline">PDF yuklab olish</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
