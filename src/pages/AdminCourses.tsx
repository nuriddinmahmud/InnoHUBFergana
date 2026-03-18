import { type ChangeEvent, useMemo, useState } from "react";
import { Edit3, ImagePlus, Plus, Trash2, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { courses as seedCourses } from "@/data/courses";

type CourseLevel = "Boshlang'ich" | "O'rta" | "Yuqori";
type CourseStatus = "Nashr etilgan" | "Qoralama";

type AdminCourse = {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  duration: string;
  image: string;
  status: CourseStatus;
  topicCount: number;
};

type CourseFormState = {
  title: string;
  description: string;
  level: CourseLevel;
  duration: string;
  image: string;
  status: CourseStatus;
};

const inputClassName =
  "w-full rounded-xl border border-[#1E293B] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#94A3B8] focus:border-[#22C55E]";

const initialCourses: AdminCourse[] = seedCourses.map((course) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  level: course.level as CourseLevel,
  duration: course.duration,
  image: course.image ?? "",
  status: course.id === "javascript" ? "Qoralama" : "Nashr etilgan",
  topicCount: course.lessons.length,
}));

const emptyForm: CourseFormState = {
  title: "",
  description: "",
  level: "Boshlang'ich",
  duration: "",
  image: "",
  status: "Qoralama",
};

const AdminCourses = () => {
  const [courses, setCourses] = useState<AdminCourse[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseFormState>(emptyForm);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return courses;
    }

    return courses.filter((course) =>
      [course.title, course.description, course.level, course.status].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [courses, searchQuery]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (course: AdminCourse) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      description: course.description,
      level: course.level,
      duration: course.duration,
      image: course.image,
      status: course.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setForm((current) => ({ ...current, image: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const trimmedTitle = form.title.trim();
    const trimmedDescription = form.description.trim();
    const trimmedDuration = form.duration.trim();

    if (!trimmedTitle || !trimmedDescription || !trimmedDuration) {
      return;
    }

    if (editingId) {
      setCourses((current) =>
        current.map((course) =>
          course.id === editingId
            ? {
                ...course,
                title: trimmedTitle,
                description: trimmedDescription,
                level: form.level,
                duration: trimmedDuration,
                image: form.image,
                status: form.status,
              }
            : course,
        ),
      );
    } else {
      setCourses((current) => [
        {
          id: `course-${Date.now()}`,
          title: trimmedTitle,
          description: trimmedDescription,
          level: form.level,
          duration: trimmedDuration,
          image: form.image,
          status: form.status,
          topicCount: 0,
        },
        ...current,
      ]);
    }

    closeModal();
  };

  const handleDelete = (courseId: string) => {
    setCourses((current) => current.filter((course) => course.id !== courseId));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8FAFC]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-[#22C55E]">Kurslar</p>
              <h1 className="mt-2 text-3xl font-bold">Kurslar boshqaruvi</h1>
              <p className="mt-2 text-sm text-[#94A3B8]">
                Kurslar ro'yxatini yangilang, muqova rasmlarini boshqaring va nashr holatini belgilang.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#16A34A]"
            >
              <Plus className="h-4 w-4" />
              Yangi kurs
            </button>
          </div>

          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#1E293B] bg-[#111111] p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#F8FAFC]">Kurslar jadvali</p>
              <p className="mt-1 text-sm text-[#94A3B8]">{filteredCourses.length} ta kurs ko'rsatilmoqda</p>
            </div>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Kurs nomi, daraja yoki holat bo'yicha qidiring"
              className={`${inputClassName} md:max-w-md`}
            />
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111111]">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#1E293B] text-left text-xs uppercase tracking-[0.18em] text-[#94A3B8]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Muqova</th>
                    <th className="px-6 py-4 font-medium">Nomi</th>
                    <th className="px-6 py-4 font-medium">Daraja</th>
                    <th className="px-6 py-4 font-medium">Mavzular soni</th>
                    <th className="px-6 py-4 font-medium">Holat</th>
                    <th className="px-6 py-4 font-medium">Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course, index) => (
                    <tr
                      key={course.id}
                      className={`border-t border-[#1E293B] ${
                        index % 2 === 0 ? "bg-[#111111]" : "bg-[#0D0D0D]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex h-10 w-[60px] items-center justify-center overflow-hidden rounded-lg border border-[#1E293B] bg-[#0A0A0A]">
                          {course.image ? (
                            <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                          ) : (
                            <ImagePlus className="h-4 w-4 text-[#94A3B8]" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#F8FAFC]">{course.title}</p>
                        <p className="mt-1 max-w-md text-sm text-[#94A3B8]">{course.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full border border-[#22C55E] px-3 py-1 text-xs font-semibold text-[#22C55E]">
                          {course.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#94A3B8]">{course.topicCount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            course.status === "Nashr etilgan"
                              ? "bg-[#22C55E]/10 text-[#22C55E]"
                              : "bg-[#1E293B] text-[#94A3B8]"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(course)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A0A0A] text-[#94A3B8] transition hover:border-[#22C55E] hover:text-[#22C55E]"
                            title="Tahrirlash"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(course.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A0A0A] text-[#94A3B8] transition hover:border-[#ef4444] hover:text-[#ef4444]"
                            title="O'chirish"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
              <div className="w-full max-w-2xl rounded-2xl border border-[#1E293B] bg-[#111111] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-5">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {editingId ? "Kursni tahrirlash" : "Yangi kurs qo'shish"}
                    </h2>
                    <p className="mt-1 text-sm text-[#94A3B8]">
                      Kurs ma'lumotlarini kiriting va muqova rasmni yuklang.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-[#1E293B] p-2 text-[#94A3B8] transition hover:border-[#22C55E] hover:text-[#22C55E]"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-[#94A3B8]">Nomi*</label>
                    <input
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                      className={inputClassName}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-[#94A3B8]">Tavsif*</label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, description: event.target.value }))
                      }
                      className={`${inputClassName} resize-none`}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[#94A3B8]">Daraja*</label>
                    <select
                      value={form.level}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, level: event.target.value as CourseLevel }))
                      }
                      className={inputClassName}
                    >
                      <option value="Boshlang'ich">Boshlang'ich</option>
                      <option value="O'rta">O'rta</option>
                      <option value="Yuqori">Yuqori</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-[#94A3B8]">Davomiyligi*</label>
                    <input
                      value={form.duration}
                      onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
                      placeholder="6 soat"
                      className={inputClassName}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-[#94A3B8]">Muqova rasmi</label>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#1E293B] bg-[#0A0A0A] px-4 py-6 text-sm text-[#94A3B8] transition hover:border-[#22C55E] hover:text-[#22C55E]">
                      <ImagePlus className="h-4 w-4" />
                      Rasm yuklash
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    {form.image && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-[#1E293B]">
                        <img src={form.image} alt="Preview" className="h-40 w-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm text-[#94A3B8]">Nashr holati</label>
                    <div className="flex rounded-xl border border-[#1E293B] bg-[#0A0A0A] p-1">
                      {(["Qoralama", "Nashr etilgan"] as CourseStatus[]).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setForm((current) => ({ ...current, status }))}
                          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                            form.status === status
                              ? "bg-[#22C55E] text-black"
                              : "text-[#94A3B8] hover:text-[#F8FAFC]"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[#1E293B] px-6 py-5">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-[#22C55E] px-5 py-3 text-sm font-medium text-[#22C55E] transition hover:bg-[#22C55E]/10"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#16A34A]"
                  >
                    Saqlash
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminCourses;
