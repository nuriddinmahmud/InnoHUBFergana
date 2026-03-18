import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, FileText, LayoutDashboard, LogOut, Users } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Bosh sahifa", icon: LayoutDashboard, href: "/admin" },
  { label: "Kurslar", icon: BookOpen, href: "/admin/courses" },
  { label: "Mavzular", icon: FileText, href: "/admin/topics" },
  { label: "Foydalanuvchilar", icon: Users, href: "/admin/users" },
  { label: "Statistika", icon: BarChart3, href: "/admin/stats" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="flex min-h-screen w-full max-w-[280px] shrink-0 flex-col border-r border-[#1E293B] bg-[#0D0D0D]">
      <div className="border-b border-[#1E293B] px-6 py-6">
        <Link to="/" className="inline-flex items-center">
          <Logo className="h-14 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const active = location.pathname === item.href;

          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 rounded-r-xl px-4 py-3 text-sm font-medium transition-all ${
                active
                  ? "border-l-2 border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]"
                  : "border-l-2 border-transparent text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#1E293B] px-4 py-5">
        <div className="flex items-center gap-3 rounded-2xl border border-[#1E293B] bg-[#111111] p-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-11 w-11 rounded-full border border-[#1E293B] object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#22C55E]/10 text-sm font-semibold text-[#22C55E]">
              {user?.name?.slice(0, 1).toUpperCase() ?? "A"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#F8FAFC]">
              {user?.name ?? "Super Admin"}
            </p>
            <p className="truncate text-xs text-[#94A3B8]">
              {user?.email ?? "admin@innohub.uz"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A0A0A] text-[#94A3B8] transition hover:border-[#22C55E] hover:text-[#22C55E]"
            title="Tizimdan chiqish"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
