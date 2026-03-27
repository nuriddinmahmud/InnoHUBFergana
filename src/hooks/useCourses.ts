import { useQuery } from "@tanstack/react-query";
import { getCourseById, getCourses } from "@/api/courses.api";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ["courses", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: Boolean(courseId),
  });
}
