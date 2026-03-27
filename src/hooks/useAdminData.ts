import { useQuery } from "@tanstack/react-query";
import { fetchAdminCourses, fetchAdminStats, fetchAdminTopics, fetchAdminUsers } from "@/api/admin";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: fetchAdminStats,
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: fetchAdminUsers,
  });
}

export function useAdminCourses() {
  return useQuery({
    queryKey: ["admin", "courses"],
    queryFn: fetchAdminCourses,
  });
}

export function useAdminTopics(courseId?: string) {
  return useQuery({
    queryKey: ["admin", "topics", courseId ?? "all"],
    queryFn: () => fetchAdminTopics(courseId),
  });
}
