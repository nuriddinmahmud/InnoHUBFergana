import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AdminSidebar from "@/components/admin/AdminSidebar";

const userStats = [
  { day: "Du", users: 12 },
  { day: "Se", users: 19 },
  { day: "Cho", users: 8 },
  { day: "Pa", users: 25 },
  { day: "Ju", users: 14 },
  { day: "Sha", users: 30 },
  { day: "Yak", users: 22 },
];

const courseProgress = [
  { name: "HTML", progress: 45, started: 214, icon: "HTML" },
  { name: "CSS", progress: 30, started: 169, icon: "CSS" },
  { name: "JS", progress: 20, started: 142, icon: "JS" },
];

const AdminStatistics = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8FAFC]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm text-[#22C55E]">Statistika</p>
            <h1 className="mt-2 text-3xl font-bold">Platforma statistikasi</h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Foydalanuvchilar o'sishi va kurslar bo'yicha progress ko'rsatkichlari.
            </p>
          </div>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-[#1E293B] bg-[#111111] p-6 transition hover:border-[#22C55E]">
              <p className="text-sm text-[#94A3B8]">Foydalanuvchilar statistikasi</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-bold text-[#22C55E]">1,248</p>
                  <p className="mt-2 text-sm text-[#94A3B8]">Jami foydalanuvchilar soni</p>
                </div>
                <div className="rounded-xl border border-[#1E293B] bg-[#0A0A0A] px-4 py-3 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#94A3B8]">7 kun</p>
                  <p className="mt-2 text-sm text-[#F8FAFC]">O'sish trendi</p>
                </div>
              </div>

              <div className="mt-6 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userStats}>
                    <CartesianGrid stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="day" stroke="#94A3B8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111111",
                        border: "1px solid #1E293B",
                        borderRadius: "12px",
                        color: "#F8FAFC",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#22C55E"
                      strokeWidth={3}
                      dot={{ fill: "#22C55E", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1E293B] bg-[#111111] p-6 transition hover:border-[#22C55E]">
              <p className="text-sm text-[#94A3B8]">Kurslar bo'yicha progress</p>
              <p className="mt-3 text-lg font-semibold">O'rtacha tugatish foizi</p>

              <div className="mt-6 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseProgress}>
                    <CartesianGrid stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="name" stroke="#94A3B8" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111111",
                        border: "1px solid #1E293B",
                        borderRadius: "12px",
                        color: "#F8FAFC",
                      }}
                    />
                    <Bar dataKey="progress" fill="#22C55E" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Kurslar kesimidagi faollik</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Har bir kursni nechta foydalanuvchi boshlagani va o'rtacha progress ko'rsatkichi.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {courseProgress.map((course) => (
                <div
                  key={course.name}
                  className="rounded-2xl border border-[#1E293B] bg-[#111111] p-5 transition hover:border-[#22C55E]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10 text-sm font-semibold text-[#22C55E]">
                      {course.icon}
                    </div>
                    <span className="rounded-full bg-[#22C55E]/10 px-3 py-1 text-xs font-semibold text-[#22C55E]">
                      {course.progress}%
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold">{course.name}</h3>
                  <p className="mt-1 text-sm text-[#94A3B8]">{course.started} ta foydalanuvchi boshlagan</p>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#1E293B]">
                    <div
                      className="h-full rounded-full bg-[#22C55E]"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminStatistics;
