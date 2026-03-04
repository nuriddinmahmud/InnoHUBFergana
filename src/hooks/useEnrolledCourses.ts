import { useQuery } from "@tanstack/react-query";
import { fetchEnrolledCourses } from "@/api/courses";

export function useEnrolledCourses() {
  return useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: fetchEnrolledCourses,
  });
}
