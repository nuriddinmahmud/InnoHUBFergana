import { BookOpen, FileText, PlusCircle, Users } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminStats } from "@/hooks/useAdminData";
import { getApiErrorMessage } from "@/lib/api";

const AdminDashboard = () => {
  const statsQuery = useAdminStats();
  const data = statsQuery.data;
  const errorMessage = getApiErrorMessage(statsQuery.error, "Admin dashboard ma'lumotlarini yuklashda xato yuz berdi.");

  const cards = [
    { label: "Foydalanuvchilar", value: data?.totals.users ?? 0, icon: Users, note: "Faol o'quvchilar soni" },
    { label: "Kurslar soni", value: data?.totals.courses ?? 0, icon: BookOpen, note: "Nashrdagi kurslar" },
    { label: "Mavzular soni", value: data?.totals.topics ?? 0, icon: FileText, note: "Jami yuklangan mavzular" },
    { label: "Bugun qo'shilganlar", value: data?.totals.todayUsers ?? 0, icon: PlusCircle, note: "So'nggi 24 soat" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8FAFC]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm text-[#22C55E]">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-bold">Boshqaruv paneli</h1>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Platformadagi foydalanuvchilar, kurslar va mavzular bo&apos;yicha umumiy ko&apos;rinish.
            </p>
          </div>

          {statsQuery.isLoading ? (
            <div className="rounded-2xl border border-[#1E293B] bg-[#111111] p-8 text-sm text-[#94A3B8]">
              Statistika yuklanmoqda...
            </div>
          ) : statsQuery.isError || !data ? (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-sm text-red-500">
              {errorMessage}
            </div>
          ) : (
            <>
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[#1E293B] bg-[#111111] p-6 transition hover:border-[#22C55E]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-[#94A3B8]">{stat.label}</p>
                        <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                        <p className="mt-2 text-xs text-[#94A3B8]">{stat.note}</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#22C55E]">
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              <section className="mt-8 grid gap-6 xl:grid-cols-5">
                <div className="overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111111] xl:col-span-3">
                  <div className="border-b border-[#1E293B] px-6 py-5">
                    <h2 className="text-lg font-semibold">So&apos;nggi foydalanuvchilar</h2>
                    <p className="mt-1 text-sm text-[#94A3B8]">
                      Oxirgi qo&apos;shilgan foydalanuvchilar holati bilan birga.
                    </p>
                  </div>

                  {data.recentUsers.length === 0 ? (
                    <div className="p-8 text-sm text-[#94A3B8]">Ma&apos;lumot yo&apos;q.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="bg-[#1E293B] text-left text-xs uppercase tracking-[0.18em] text-[#94A3B8]">
                          <tr>
                            <th className="px-6 py-4 font-medium">Ism</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Qo&apos;shilgan sana</th>
                            <th className="px-6 py-4 font-medium">Holat</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.recentUsers.map((user, index) => (
                            <tr
                              key={user.id}
                              className={`border-t border-[#1E293B] ${
                                index % 2 === 0 ? "bg-[#111111]" : "bg-[#0D0D0D]"
                              }`}
                            >
                              <td className="px-6 py-4">
                                <p className="font-medium text-[#F8FAFC]">{user.name}</p>
                              </td>
                              <td className="px-6 py-4 text-sm text-[#94A3B8]">{user.email}</td>
                              <td className="px-6 py-4 text-sm text-[#94A3B8]">{user.joinedAt}</td>
                              <td className="px-6 py-4">
                                <span className="inline-flex rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 text-xs font-medium text-[#22C55E]">
                                  {user.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-[#1E293B] bg-[#111111] xl:col-span-2">
                  <div className="border-b border-[#1E293B] px-6 py-5">
                    <h2 className="text-lg font-semibold">Kurslar holati</h2>
                    <p className="mt-1 text-sm text-[#94A3B8]">
                      Kurslarning nashr holati va mavzular soni.
                    </p>
                  </div>

                  <div className="space-y-4 p-6">
                    {data.courseStatuses.length === 0 ? (
                      <div className="text-sm text-[#94A3B8]">Ma&apos;lumot yo&apos;q.</div>
                    ) : (
                      data.courseStatuses.map((course) => (
                        <div
                          key={course.id}
                          className="rounded-xl border border-[#1E293B] bg-[#0A0A0A] p-4 transition hover:border-[#22C55E]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-[#F8FAFC]">{course.name}</p>
                              <p className="mt-1 text-sm text-[#94A3B8]">{course.topicCount} ta mavzu</p>
                            </div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                course.status === "Nashr etilgan"
                                  ? "bg-[#22C55E]/10 text-[#22C55E]"
                                  : "bg-[#1E293B] text-[#94A3B8]"
                              }`}
                            >
                              {course.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
