const COURSE_GRADIENT_CLASS_MAP = {
  default: "from-slate-900 to-blue-600",
  emerald: "from-emerald-700 to-lime-500",
  violet: "from-violet-700 to-fuchsia-500",
  amber: "from-amber-700 to-orange-500",
  cyan: "from-cyan-700 to-sky-500",
} as const;

const GRADIENT_PAIR_MAP: Record<string, string> = {
  "#0f172a:#2563eb": COURSE_GRADIENT_CLASS_MAP.default,
  "#14532d:#84cc16": COURSE_GRADIENT_CLASS_MAP.emerald,
  "#6d28d9:#d946ef": COURSE_GRADIENT_CLASS_MAP.violet,
  "#b45309:#f97316": COURSE_GRADIENT_CLASS_MAP.amber,
  "#0e7490:#0ea5e9": COURSE_GRADIENT_CLASS_MAP.cyan,
};

const RAW_GRADIENT_CLASS_MAP: Record<string, string> = {
  "from-slate-900 to-blue-600": COURSE_GRADIENT_CLASS_MAP.default,
  "from-emerald-700 to-lime-500": COURSE_GRADIENT_CLASS_MAP.emerald,
  "from-violet-700 to-fuchsia-500": COURSE_GRADIENT_CLASS_MAP.violet,
  "from-amber-700 to-orange-500": COURSE_GRADIENT_CLASS_MAP.amber,
  "from-cyan-700 to-sky-500": COURSE_GRADIENT_CLASS_MAP.cyan,
  "from-[#0f172a] to-[#2563eb]": COURSE_GRADIENT_CLASS_MAP.default,
  "from-[#14532d] to-[#84cc16]": COURSE_GRADIENT_CLASS_MAP.emerald,
  "from-[#6d28d9] to-[#d946ef]": COURSE_GRADIENT_CLASS_MAP.violet,
  "from-[#b45309] to-[#f97316]": COURSE_GRADIENT_CLASS_MAP.amber,
  "from-[#0e7490] to-[#0ea5e9]": COURSE_GRADIENT_CLASS_MAP.cyan,
};

function normalizeTextValue(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function normalizeHexValue(value?: string) {
  const normalized = normalizeTextValue(value);
  if (!normalized) {
    return "";
  }

  return normalized.startsWith("#") ? normalized : `#${normalized}`;
}

export function resolveCourseGradientClass({
  gradient,
  gradientFrom,
  gradientTo,
}: {
  gradient?: string;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  const pairKey = `${normalizeHexValue(gradientFrom)}:${normalizeHexValue(gradientTo)}`;
  if (GRADIENT_PAIR_MAP[pairKey]) {
    return GRADIENT_PAIR_MAP[pairKey];
  }

  const normalizedGradient = normalizeTextValue(gradient).replace(/\s+/g, " ");
  if (RAW_GRADIENT_CLASS_MAP[normalizedGradient]) {
    return RAW_GRADIENT_CLASS_MAP[normalizedGradient];
  }

  return COURSE_GRADIENT_CLASS_MAP.default;
}
