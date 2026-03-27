import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { Edit3, ExternalLink, Eye, EyeOff, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { createTopic as createTopicRequest, deleteTopic as deleteTopicRequest, updateTopic as updateTopicRequest } from "@/api/admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminCourses, useAdminTopics as useAdminTopicsQuery } from "@/hooks/useAdminData";
import { getApiErrorMessage } from "@/lib/api";
import type { TopicMutationPayload, TopicSummary } from "@/types/api";

type TopicCourseOption = {
  id: string;
  title: string;
};

type TopicFormState = {
  courseId: string;
  order: number;
  title: string;
  videoId: string;
  duration: string;
  content: string;
};

const inputClassName =
  "w-full rounded-xl border border-[#1E293B] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#94A3B8] focus:border-[#22C55E]";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildContentHtml(contentMarkdown: string) {
  return contentMarkdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replaceAll("\n", "<br />")}</p>`)
    .join("");
}

const AdminTopics = () => {
  const queryClient = useQueryClient();
  const coursesQuery = useAdminCourses();
  const topicsQuery = useAdminTopicsQuery();
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formError, setFormError] = useState("");

  const createTopicMutation = useMutation({
    mutationFn: (payload: TopicMutationPayload) => createTopicRequest(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "topics"] });
      toast.success("Mavzu muvaffaqiyatli yaratildi.");
      closeModal();
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Mavzuni yaratishda xato yuz berdi.");
      console.error("Create topic failed", error);
      setFormError(message);
      toast.error(message);
    },
  });

  const updateTopicMutation = useMutation({
    mutationFn: ({ topicId, payload }: { topicId: string; payload: TopicMutationPayload }) =>
      updateTopicRequest(topicId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "topics"] });
      toast.success("Mavzu muvaffaqiyatli yangilandi.");
      closeModal();
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Mavzuni yangilashda xato yuz berdi.");
      console.error("Update topic failed", error);
      setFormError(message);
      toast.error(message);
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: (topicId: string) => deleteTopicRequest(topicId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "topics"] });
      toast.success("Mavzu o'chirildi.");
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Mavzuni o'chirishda xato yuz berdi.");
      console.error("Delete topic failed", error);
      toast.error(message);
    },
  });

  const courseOptions = useMemo<TopicCourseOption[]>(
    () => (coursesQuery.data ?? []).map((course) => ({ id: course.id, title: course.title })),
    [coursesQuery.data],
  );

  const createEmptyForm = (): TopicFormState => ({
    courseId: courseOptions[0]?.id ?? "",
    order: 1,
    title: "",
    videoId: "",
    duration: "",
    content: "",
  });

  const [form, setForm] = useState<TopicFormState>(createEmptyForm);

  useEffect(() => {
    if (topicsQuery.data) {
      setTopics(topicsQuery.data);
    }
  }, [topicsQuery.data]);

  useEffect(() => {
    if (!form.courseId && courseOptions[0]?.id) {
      setForm((current) => ({ ...current, courseId: courseOptions[0].id }));
    }
  }, [courseOptions, form.courseId]);

  const filteredTopics = useMemo(() => {
    const visibleTopics =
      selectedCourseId === "all" ? topics : topics.filter((topic) => topic.courseId === selectedCourseId);

    return [...visibleTopics].sort((left, right) => left.lessonNumber - right.lessonNumber);
  }, [selectedCourseId, topics]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setIsPreviewMode(false);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (topic: TopicSummary) => {
    setEditingId(topic.id);
    setForm({
      courseId: topic.courseId,
      order: topic.lessonNumber,
      title: topic.title,
      videoId: topic.videoId,
      duration: topic.duration,
      content: topic.content ?? "",
    });
    setIsPreviewMode(false);
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setIsModalOpen(false);
    setIsPreviewMode(false);
    setForm(createEmptyForm());
    setFormError("");
  };

  const handleSave = async () => {
    const trimmedTitle = form.title.trim();
    const trimmedVideoId = form.videoId.trim();
    const trimmedDuration = form.duration.trim();
    const trimmedContent = form.content.trim();

    if (!form.courseId || !trimmedTitle || !trimmedVideoId || !trimmedDuration || !trimmedContent) {
      setFormError("Barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    if (trimmedDuration.length > 64) {
      setFormError("Davomiyligi 64 belgidan oshmasligi kerak.");
      return;
    }

    const payload: TopicMutationPayload = {
      courseId: form.courseId,
      lessonNumber: Number(form.order),
      title: trimmedTitle,
      videoId: trimmedVideoId,
      durationLabel: String(trimmedDuration),
      contentMarkdown: trimmedContent,
      contentHtml: buildContentHtml(trimmedContent) || `<p>${escapeHtml(trimmedContent)}</p>`,
      isPreview: false,
      status: "DRAFT",
    };

    console.log("TOPIC PAYLOAD:", payload);

    if (editingId) {
      await updateTopicMutation.mutateAsync({ topicId: editingId, payload });
      return;
    }

    await createTopicMutation.mutateAsync(payload);
  };

  const handleDelete = async (topicId: string) => {
    await deleteTopicMutation.mutateAsync(topicId);
  };

  const isLoading = coursesQuery.isLoading || topicsQuery.isLoading;
  const isError = coursesQuery.isError || topicsQuery.isError;
  const isSubmitting = createTopicMutation.isPending || updateTopicMutation.isPending;
  const loadErrorMessage = getApiErrorMessage(
    topicsQuery.error ?? coursesQuery.error,
    "Mavzular ma'lumotini yuklab bo'lmadi.",
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F8FAFC]">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm text-[#22C55E]">Mavzular</p>
              <h1 className="mt-2 text-3xl font-bold">Mavzular boshqaruvi</h1>
              <p className="mt-2 text-sm text-[#94A3B8]">
                Kurslar bo&apos;yicha darslar tartibini, video ID va markdown kontentini boshqaring.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={selectedCourseId}
                onChange={(event) => setSelectedCourseId(event.target.value)}
                className={`${inputClassName} min-w-[220px]`}
              >
                <option value="all">Barcha kurslar</option>
                {courseOptions.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#16A34A]"
              >
                <Plus className="h-4 w-4" />
                Yangi mavzu
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-[#1E293B] bg-[#111111] p-8 text-sm text-[#94A3B8]">
              Mavzular yuklanmoqda...
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-8 text-sm text-red-500">
              {loadErrorMessage}
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111111]">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#1E293B] text-left text-xs uppercase tracking-[0.18em] text-[#94A3B8]">
                    <tr>
                      <th className="px-6 py-4 font-medium">Tartib</th>
                      <th className="px-6 py-4 font-medium">Nomi</th>
                      <th className="px-6 py-4 font-medium">YouTube ID</th>
                      <th className="px-6 py-4 font-medium">Davomiyligi</th>
                      <th className="px-6 py-4 font-medium">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTopics.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-sm text-[#94A3B8]">
                          Ma&apos;lumot yo&apos;q.
                        </td>
                      </tr>
                    ) : (
                      filteredTopics.map((topic, index) => {
                        const course = courseOptions.find((item) => item.id === topic.courseId);

                        return (
                          <tr
                            key={topic.id}
                            className={`border-t border-[#1E293B] ${
                              index % 2 === 0 ? "bg-[#111111]" : "bg-[#0D0D0D]"
                            }`}
                          >
                            <td className="px-6 py-4 text-sm text-[#94A3B8]">{topic.lessonNumber}</td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-[#F8FAFC]">{topic.title}</p>
                              <p className="mt-1 text-sm text-[#94A3B8]">{course?.title}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#94A3B8]">{topic.videoId}</td>
                            <td className="px-6 py-4 text-sm text-[#94A3B8]">{topic.duration}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(topic)}
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A0A0A] text-[#94A3B8] transition hover:border-[#22C55E] hover:text-[#22C55E]"
                                  title="Tahrirlash"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void handleDelete(topic.id)}
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A0A0A] text-[#94A3B8] transition hover:border-[#ef4444] hover:text-[#ef4444]"
                                  title="O'chirish"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isModalOpen ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
              <div className="w-full max-w-4xl rounded-2xl border border-[#1E293B] bg-[#111111] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-5">
                  <div>
                    <h2 className="text-xl font-semibold">{editingId ? "Mavzuni tahrirlash" : "Yangi mavzu qo'shish"}</h2>
                    <p className="mt-1 text-sm text-[#94A3B8]">
                      Video ma&apos;lumoti va markdown kontentini shu oynadan boshqaring.
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

                <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.1fr,0.9fr]">
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm text-[#94A3B8]">Kurs*</label>
                      <select
                        value={form.courseId}
                        onChange={(event) => setForm((current) => ({ ...current, courseId: event.target.value }))}
                        className={inputClassName}
                      >
                        {courseOptions.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-[#94A3B8]">Tartib raqami*</label>
                        <input
                          type="number"
                          min={1}
                          value={form.order}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, order: Number(event.target.value) || 1 }))
                          }
                          className={inputClassName}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-[#94A3B8]">Davomiyligi*</label>
                        <input
                          value={form.duration}
                          onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
                          placeholder="8:24"
                          className={inputClassName}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-[#94A3B8]">Nomi*</label>
                      <input
                        value={form.title}
                        onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label className="block text-sm text-[#94A3B8]">YouTube Video ID*</label>
                        {form.videoId.trim() ? (
                          <a
                            href={`https://youtube.com/watch?v=${form.videoId.trim()}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#22C55E] hover:underline"
                          >
                            Preview link
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                      </div>
                      <input
                        value={form.videoId}
                        onChange={(event) => setForm((current) => ({ ...current, videoId: event.target.value }))}
                        placeholder="dQw4w9WgXcQ"
                        className={inputClassName}
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label className="block text-sm text-[#94A3B8]">Markdown content</label>
                        <button
                          type="button"
                          onClick={() => setIsPreviewMode((current) => !current)}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#1E293B] px-3 py-2 text-xs font-medium text-[#94A3B8] transition hover:border-[#22C55E] hover:text-[#22C55E]"
                        >
                          {isPreviewMode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          {isPreviewMode ? "Tahrirlash" : "Preview"}
                        </button>
                      </div>
                      <p className="mb-3 text-xs text-[#94A3B8]">
                        Matn, # sarlavha, **bold**, ![rasm](url) formatlarini ishlatishingiz mumkin
                      </p>

                      {isPreviewMode ? (
                        <div className="prose prose-invert max-w-none rounded-xl border border-[#1E293B] bg-[#0A0A0A] px-4 py-4 text-sm">
                          <ReactMarkdown>{form.content || "Preview ko'rsatish uchun matn kiriting."}</ReactMarkdown>
                        </div>
                      ) : (
                        <textarea
                          rows={10}
                          value={form.content}
                          onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                          className={`${inputClassName} resize-none`}
                        />
                      )}
                    </div>

                    {formError ? (
                      <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                        {formError}
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-[#1E293B] bg-[#0A0A0A] p-5">
                    <h3 className="text-lg font-semibold text-[#F8FAFC]">Mavzu preview</h3>
                    <div className="mt-4 space-y-4">
                      <div className="rounded-xl border border-[#1E293B] bg-[#111111] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#94A3B8]">Kurs</p>
                        <p className="mt-2 font-medium text-[#F8FAFC]">
                          {courseOptions.find((course) => course.id === form.courseId)?.title ?? "Tanlanmagan"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#1E293B] bg-[#111111] p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#94A3B8]">Mavzu</p>
                        <p className="mt-2 text-lg font-semibold text-[#F8FAFC]">{form.title || "Mavzu nomi"}</p>
                        <p className="mt-2 text-sm text-[#94A3B8]">Tartib: {form.order}</p>
                        <p className="mt-1 text-sm text-[#94A3B8]">Davomiyligi: {form.duration || "--"}</p>
                        <p className="mt-1 text-sm text-[#94A3B8]">Video ID: {form.videoId || "--"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-[#1E293B] px-6 py-5">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className="rounded-xl border border-[#22C55E] px-5 py-3 text-sm font-medium text-[#22C55E] transition hover:bg-[#22C55E]/10"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#16A34A]"
                  >
                    {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default AdminTopics;
