import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Edit3, ExternalLink, Eye, EyeOff, Plus, Trash2, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { courses as seedCourses } from "@/data/courses";

type TopicCourseOption = {
  id: string;
  title: string;
};

type AdminTopic = {
  id: string;
  courseId: string;
  order: number;
  title: string;
  videoId: string;
  duration: string;
  content: string;
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

const courseOptions: TopicCourseOption[] = seedCourses.map((course) => ({
  id: course.id,
  title: course.title,
}));

const initialTopics: AdminTopic[] = seedCourses.flatMap((course) =>
  course.lessons.slice(0, 6).map((lesson) => ({
    id: `${course.id}-${lesson.id}`,
    courseId: course.id,
    order: lesson.id,
    title: lesson.title,
    videoId: lesson.videoId,
    duration: lesson.duration,
    content: `# ${lesson.title}\n\nBu bo'limda **${course.title}** kursining ${lesson.id}-mavzusi haqida o'rganasiz.\n\n- Asosiy tushuncha\n- Qisqa misol\n- Amaliy tavsiya`,
  })),
);

const createEmptyForm = (): TopicFormState => ({
  courseId: courseOptions[0]?.id ?? "",
  order: 1,
  title: "",
  videoId: "",
  duration: "",
  content: "",
});

const AdminTopics = () => {
  const [topics, setTopics] = useState<AdminTopic[]>(initialTopics);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [form, setForm] = useState<TopicFormState>(createEmptyForm);

  const filteredTopics = useMemo(() => {
    const visibleTopics =
      selectedCourseId === "all"
        ? topics
        : topics.filter((topic) => topic.courseId === selectedCourseId);

    return [...visibleTopics].sort((left, right) => left.order - right.order);
  }, [selectedCourseId, topics]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setIsPreviewMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (topic: AdminTopic) => {
    setEditingId(topic.id);
    setForm({
      courseId: topic.courseId,
      order: topic.order,
      title: topic.title,
      videoId: topic.videoId,
      duration: topic.duration,
      content: topic.content,
    });
    setIsPreviewMode(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setIsModalOpen(false);
    setIsPreviewMode(false);
    setForm(createEmptyForm());
  };

  const handleSave = () => {
    const trimmedTitle = form.title.trim();
    const trimmedVideoId = form.videoId.trim();
    const trimmedDuration = form.duration.trim();
    const trimmedContent = form.content.trim();

    if (!form.courseId || !trimmedTitle || !trimmedVideoId || !trimmedDuration || !trimmedContent) {
      return;
    }

    if (editingId) {
      setTopics((current) =>
        current.map((topic) =>
          topic.id === editingId
            ? {
                ...topic,
                courseId: form.courseId,
                order: form.order,
                title: trimmedTitle,
                videoId: trimmedVideoId,
                duration: trimmedDuration,
                content: trimmedContent,
              }
            : topic,
        ),
      );
    } else {
      setTopics((current) => [
        {
          id: `topic-${Date.now()}`,
          courseId: form.courseId,
          order: form.order,
          title: trimmedTitle,
          videoId: trimmedVideoId,
          duration: trimmedDuration,
          content: trimmedContent,
        },
        ...current,
      ]);
    }

    closeModal();
  };

  const handleDelete = (topicId: string) => {
    setTopics((current) => current.filter((topic) => topic.id !== topicId));
  };

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
                Kurslar bo'yicha darslar tartibini, video ID va markdown kontentini boshqaring.
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
                  {filteredTopics.map((topic, index) => {
                    const course = courseOptions.find((item) => item.id === topic.courseId);

                    return (
                      <tr
                        key={topic.id}
                        className={`border-t border-[#1E293B] ${
                          index % 2 === 0 ? "bg-[#111111]" : "bg-[#0D0D0D]"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-[#94A3B8]">{topic.order}</td>
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
                              onClick={() => handleDelete(topic.id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E293B] bg-[#0A0A0A] text-[#94A3B8] transition hover:border-[#ef4444] hover:text-[#ef4444]"
                              title="O'chirish"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
              <div className="w-full max-w-4xl rounded-2xl border border-[#1E293B] bg-[#111111] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-5">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {editingId ? "Mavzuni tahrirlash" : "Yangi mavzu qo'shish"}
                    </h2>
                    <p className="mt-1 text-sm text-[#94A3B8]">
                      Video ma'lumoti va markdown kontentini shu oynadan boshqaring.
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
                        onChange={(event) =>
                          setForm((current) => ({ ...current, courseId: event.target.value }))
                        }
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
                            setForm((current) => ({
                              ...current,
                              order: Number(event.target.value) || 1,
                            }))
                          }
                          className={inputClassName}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-[#94A3B8]">Davomiyligi*</label>
                        <input
                          value={form.duration}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, duration: event.target.value }))
                          }
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
                        {form.videoId.trim() && (
                          <a
                            href={`https://youtube.com/watch?v=${form.videoId.trim()}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#22C55E] hover:underline"
                          >
                            Preview link
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
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
                          onChange={(event) =>
                            setForm((current) => ({ ...current, content: event.target.value }))
                          }
                          className={`${inputClassName} resize-none`}
                        />
                      )}
                    </div>
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
                        <p className="mt-2 text-lg font-semibold text-[#F8FAFC]">
                          {form.title || "Mavzu nomi"}
                        </p>
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

export default AdminTopics;
