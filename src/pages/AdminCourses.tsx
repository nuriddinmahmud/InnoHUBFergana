import { type ChangeEvent, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, ImagePlus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createCourse as createCourseRequest,
  deleteCourse as deleteCourseRequest,
  updateCourse as updateCourseRequest,
} from "@/api/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { CourseFormModal } from "@/components/admin/CourseFormModal";
import { useAuth } from "@/context/AuthContext";
import { useAdminCourses as useAdminCoursesQuery } from "@/hooks/useAdminData";
import { buildCreateCoursePayload, buildUpdateCoursePayload, validateCourseForm } from "@/lib/course-admin";
import { getApiErrorMessage } from "@/lib/api";
import type { CourseFormValues, CourseLevel, CourseStatus, CreateCoursePayload } from "@/types/api";

type AdminCourseRow = {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  durationLabel: string;
  image: string;
  status: "Nashr etilgan" | "Qoralama";
  topicCount: number;
};

const inputClassName =
  "w-full rounded-xl border border-[#1E293B] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#94A3B8] focus:border-[#22C55E]";

const emptyForm: CourseFormValues = {
  title: "",
  description: "",
  level: "Boshlang'ich",
  durationLabel: "",
  imageUrl: "",
  status: "Nashr etilgan",
};

const toStatusLabel = (status?: CourseStatus): "Nashr etilgan" | "Qoralama" =>
  status === "published" ? "Nashr etilgan" : "Qoralama";

const AdminCourses = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const adminCoursesQuery = useAdminCoursesQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CourseFormValues>(emptyForm);
  const [formError, setFormError] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");

  const createCourseMutation = useMutation({
    mutationFn: (payload: CreateCoursePayload) => createCourseRequest(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
        queryClient.invalidateQueries({ queryKey: ["courses"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
      ]);
      toast.success("Kurs muvaffaqiyatli yaratildi.");
      closeModal();
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Kursni yaratishda xato yuz berdi.");
      setFormError(message);
      toast.error(message);
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ courseId, payload }: { courseId: string; payload: ReturnType<typeof buildUpdateCoursePayload> }) =>
      updateCourseRequest(courseId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
        queryClient.invalidateQueries({ queryKey: ["courses"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
      ]);
      toast.success("Kurs muvaffaqiyatli yangilandi.");
      closeModal();
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Kursni yangilashda xato yuz berdi.");
      setFormError(message);
      toast.error(message);
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (courseId: string) => deleteCourseRequest(courseId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
        queryClient.invalidateQueries({ queryKey: ["courses"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
      ]);
      toast.success("Kurs muvaffaqiyatli o'chirildi.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Kursni o'chirishda xato yuz berdi."));
    },
  });

  const courses = useMemo<AdminCourseRow[]>(() => {
    const normalizedCourses = Array.isArray(adminCoursesQuery.data) ? adminCoursesQuery.data : [];

    return normalizedCourses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      durationLabel: course.duration,
      image: course.image ?? "",
      status: toStatusLabel(course.status),
      topicCount: course.totalLessons,
    }));
  }, [adminCoursesQuery.data]);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return courses;

    return courses.filter((course) =>
      [course.title, course.description, course.level, course.status].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [courses, searchQuery]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreviewImage("");
    setSelectedImageName("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (course: AdminCourseRow) => {
    setEditingId(course.id);
    setForm({
      title: course.title,
      description: course.description,
      level: course.level,
      durationLabel: course.durationLabel,
      imageUrl: course.image,
      status: course.status,
    });
    setPreviewImage(course.image);
    setSelectedImageName("");
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setPreviewImage("");
    setSelectedImageName("");
    setFormError("");
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewImage(form.imageUrl.trim());
      setSelectedImageName("");
      return;
    }

    setSelectedImageName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFormChange = (next: CourseFormValues) => {
    setForm(next);
    setPreviewImage(next.imageUrl.trim() || previewImage);
    setSelectedImageName(next.imageUrl.trim() ? "" : selectedImageName);
    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async () => {
    const validationError = validateCourseForm(form);
    if (validationError) {
      setFormError(validationError);
      toast.error(validationError);
      return;
    }

    if (editingId) {
      const payload = buildUpdateCoursePayload(form);
      await updateCourseMutation.mutateAsync({ courseId: editingId, payload });
      return;
    }

    if (!user?.id) {
      const message = "Kurs yaratish uchun admin foydalanuvchi aniqlanmadi.";
      setFormError(message);
      toast.error(message);
      return;
    }

    setFormError("");
    const payload = buildCreateCoursePayload(form, user.id);

    if (import.meta.env.DEV) {
      console.debug("[AdminCourses] create payload", payload);
    }

    await createCourseMutation.mutateAsync(payload);
  };

  const handleDelete = (courseId: string) => {
    deleteCourseMutation.mutate(courseId);
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
                Kurs payload avtomatik ravishda backend DTO formatiga o&apos;giriladi.
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
              <p className="mt-1 text-sm text-[#94A3B8]">{filteredCourses.length} ta kurs ko&apos;rsatilmoqda</p>
            </div>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Kurs nomi, daraja yoki holat bo'yicha qidiring"
              className={`${inputClassName} md:max-w-md`}
            />
          </div>

          {adminCoursesQuery.isLoading ? (
            <div className="rounded-2xl border border-[#1E293B] bg-[#111111] p-8 text-sm text-[#94A3B8]">
              Kurslar yuklanmoqda...
            </div>
          ) : adminCoursesQuery.isError ? (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-sm text-red-500">
              Kurslar ma&apos;lumotini yuklab bo&apos;lmadi.
            </div>
          ) : (
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
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#94A3B8]">
                          Ma&apos;lumot yo&apos;q.
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((course, index) => (
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
                                disabled={updateCourseMutation.isPending || deleteCourseMutation.isPending}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A0A0A] text-[#94A3B8] transition hover:border-[#22C55E] hover:text-[#22C55E] disabled:cursor-not-allowed disabled:opacity-70"
                                title="Tahrirlash"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(course.id)}
                                disabled={deleteCourseMutation.isPending}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A0A0A] text-[#94A3B8] transition hover:border-[#ef4444] hover:text-[#ef4444] disabled:cursor-not-allowed disabled:opacity-70"
                                title="O'chirish"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isModalOpen ? (
            <CourseFormModal
              mode={editingId ? "edit" : "create"}
              form={form}
              formError={formError}
              isSubmitting={createCourseMutation.isPending || updateCourseMutation.isPending}
              previewImage={previewImage}
              selectedImageName={selectedImageName}
              onClose={closeModal}
              onChange={handleFormChange}
              onImageChange={handleImageChange}
              onSubmit={handleSubmit}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default AdminCourses;
