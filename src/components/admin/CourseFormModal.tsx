import { type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import type { CourseFormValues, CourseLevel } from "@/types/api";

const inputClassName =
  "w-full rounded-xl border border-[#1E293B] bg-[#0A0A0A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition placeholder:text-[#94A3B8] focus:border-[#22C55E]";

type CourseFormModalProps = {
  mode: "create" | "edit";
  form: CourseFormValues;
  formError: string;
  isSubmitting: boolean;
  previewImage: string;
  selectedImageName: string;
  onClose: () => void;
  onChange: (next: CourseFormValues) => void;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

export function CourseFormModal({
  mode,
  form,
  formError,
  isSubmitting,
  previewImage,
  selectedImageName,
  onClose,
  onChange,
  onImageChange,
  onSubmit,
}: CourseFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-[#1E293B] bg-[#111111] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">{mode === "edit" ? "Kursni tahrirlash" : "Yangi kurs qo'shish"}</h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              Forma qiymatlari UI uchun qulay, submit payload esa backend DTO formatiga o&apos;giriladi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
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
              onChange={(event) => onChange({ ...form, title: event.target.value })}
              className={inputClassName}
              maxLength={160}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-[#94A3B8]">Tavsif*</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => onChange({ ...form, description: event.target.value })}
              className={`${inputClassName} resize-none`}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#94A3B8]">Daraja*</label>
            <select
              value={form.level}
              onChange={(event) => onChange({ ...form, level: event.target.value as CourseLevel })}
              className={inputClassName}
            >
              <option value="Boshlang'ich">Boshlang'ich</option>
              <option value="O'rta">O'rta</option>
              <option value="Yuqori">Yuqori</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-[#94A3B8]">Davomiylik matni*</label>
            <input
              value={form.durationLabel}
              onChange={(event) => onChange({ ...form, durationLabel: event.target.value })}
              placeholder="12 hours"
              maxLength={64}
              className={inputClassName}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-[#94A3B8]">Muqova rasmi URL</label>
            <input
              value={form.imageUrl}
              onChange={(event) => onChange({ ...form, imageUrl: event.target.value })}
              placeholder="https://cdn.example.com/course-cover.png"
              className={`${inputClassName} mb-3`}
            />
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#1E293B] bg-[#0A0A0A] px-4 py-6 text-sm text-[#94A3B8] transition hover:border-[#22C55E] hover:text-[#22C55E]">
              <ImagePlus className="h-4 w-4" />
              Lokal preview rasm tanlash
              <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
            </label>
            <p className="mt-2 text-xs text-[#94A3B8]">
              Lokal fayl faqat preview uchun ishlatiladi. Backendga faqat `imageUrl` yuboriladi.
            </p>
            {previewImage ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-[#1E293B]">
                <img src={previewImage} alt="Preview" className="h-40 w-full object-cover" />
              </div>
            ) : null}
            {selectedImageName ? (
              <p className="mt-2 truncate text-xs text-[#94A3B8]">Tanlangan fayl: {selectedImageName}</p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-[#94A3B8]">Nashr holati</label>
            <div className="flex rounded-xl border border-[#1E293B] bg-[#0A0A0A] p-1">
              {(["Qoralama", "Nashr etilgan"] as Array<"Nashr etilgan" | "Qoralama">).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onChange({ ...form, status })}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    form.status === status ? "bg-[#22C55E] text-black" : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {formError ? (
            <div className="md:col-span-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {formError}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#1E293B] px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#22C55E] px-5 py-3 text-sm font-medium text-[#22C55E] transition hover:bg-[#22C55E]/10"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-[#22C55E] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}
