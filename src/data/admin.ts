import { courses } from "@/data/courses";
import type { AdminDashboardStats, AdminUser, CourseDetail, CourseSummary, TopicSummary } from "@/types/api";

export const adminUsersMock: AdminUser[] = [
  { id: "u1", name: "Aziza Karimova", email: "aziza@innohub.uz", avatar: "AK", joinedAt: "18 Mart 2026", status: "Faol" },
  { id: "u2", name: "Bekzod Haydarov", email: "bekzod@gmail.com", avatar: "BH", joinedAt: "17 Mart 2026", status: "Bloklangan" },
  { id: "u3", name: "Javohir Tursunov", email: "javohir@mail.com", avatar: "JT", joinedAt: "16 Mart 2026", status: "Faol" },
  { id: "u4", name: "Madinabonu Xasanova", email: "madina@icloud.com", avatar: "MX", joinedAt: "16 Mart 2026", status: "Faol" },
  { id: "u5", name: "Nilufar Qodirova", email: "nilufar@mail.uz", avatar: "NQ", joinedAt: "15 Mart 2026", status: "Faol" },
  { id: "u6", name: "Otabek Isroilov", email: "otabek@pm.me", avatar: "OI", joinedAt: "14 Mart 2026", status: "Bloklangan" },
  { id: "u7", name: "Sardor Raxmatov", email: "sardor@yahoo.com", avatar: "SR", joinedAt: "13 Mart 2026", status: "Faol" },
  { id: "u8", name: "Zilola Abdullayeva", email: "zilola@inbox.uz", avatar: "ZA", joinedAt: "12 Mart 2026", status: "Faol" },
];

export const adminStatsMock: AdminDashboardStats = {
  totals: {
    users: 1248,
    courses: 12,
    topics: 148,
    todayUsers: 18,
  },
  recentUsers: [
    { id: "r1", name: "Aziza Karimova", email: "aziza@innohub.uz", joinedAt: "18 Mart 2026", status: "Faol" },
    { id: "r2", name: "Jamshid Ergashev", email: "jamshid@gmail.com", joinedAt: "18 Mart 2026", status: "Faol" },
    { id: "r3", name: "Madinabonu Tursunova", email: "madina@mail.uz", joinedAt: "17 Mart 2026", status: "Tekshirilmoqda" },
    { id: "r4", name: "Bekzod Haydarov", email: "bekzod@proton.me", joinedAt: "17 Mart 2026", status: "Faol" },
    { id: "r5", name: "Sardor Meliyev", email: "sardor@icloud.com", joinedAt: "16 Mart 2026", status: "Faol" },
    { id: "r6", name: "Nilufar Qodirova", email: "nilufar@mail.com", joinedAt: "16 Mart 2026", status: "Kutilmoqda" },
  ],
  courseStatuses: [
    { id: "html", name: "HTML Fundamentals", status: "Nashr etilgan", topicCount: 35 },
    { id: "css", name: "CSS Fundamentals", status: "Nashr etilgan", topicCount: 35 },
    { id: "javascript", name: "JavaScript Fundamentals", status: "Qoralama", topicCount: 35 },
  ],
  userSeries: [
    { day: "Du", users: 12 },
    { day: "Se", users: 19 },
    { day: "Cho", users: 8 },
    { day: "Pa", users: 25 },
    { day: "Ju", users: 14 },
    { day: "Sha", users: 30 },
    { day: "Yak", users: 22 },
  ],
  courseSeries: [
    { name: "HTML", progress: 45, started: 214, icon: "HTML" },
    { name: "CSS", progress: 30, started: 169, icon: "CSS" },
    { name: "JS", progress: 20, started: 142, icon: "JS" },
  ],
};

export const courseSummariesMock: CourseSummary[] = courses.map((course) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  icon: course.icon,
  image: course.image,
  gradient: course.gradient,
  totalLessons: course.totalLessons,
  level: course.level as CourseSummary["level"],
  duration: course.duration,
  status: course.id === "javascript" ? "draft" : "published",
}));

export const courseDetailsMock: CourseDetail[] = courses.map((course) => ({
  ...courseSummariesMock.find((item) => item.id === course.id)!,
  topics: course.lessons.map<TopicSummary>((lesson) => ({
    id: `${course.id}-${lesson.id}`,
    courseId: course.id,
    lessonNumber: lesson.id,
    title: lesson.title,
    videoId: lesson.videoId,
    duration: lesson.duration,
    content: `# ${lesson.title}\n\n${course.title} kursining ushbu bo'limida ${lesson.title.toLowerCase()} mavzusini amaliy misollar bilan o'rganasiz.`,
  })),
  lessons: course.lessons.map<TopicSummary>((lesson) => ({
    id: `${course.id}-${lesson.id}`,
    courseId: course.id,
    lessonNumber: lesson.id,
    title: lesson.title,
    videoId: lesson.videoId,
    duration: lesson.duration,
    content: `# ${lesson.title}\n\n${course.title} kursining ushbu bo'limida ${lesson.title.toLowerCase()} mavzusini amaliy misollar bilan o'rganasiz.`,
  })),
}));
