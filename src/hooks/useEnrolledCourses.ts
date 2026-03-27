import { useQuery } from "@tanstack/react-query";
import { getMyCourseById, getMyCourses } from "@/api/enrollments.api";

export function useEnrolledCourses(enabled = true) {
  return useQuery({
    queryKey: ["enrollments", "my-courses"],
    queryFn: getMyCourses,
    enabled,
  });
}

export function useEnrolledCourse(courseId: string, enabled = true) {
  return useQuery({
    queryKey: ["enrollments", "my-courses", courseId],
    queryFn: () => getMyCourseById(courseId),
    enabled: enabled && Boolean(courseId),
  });
}
