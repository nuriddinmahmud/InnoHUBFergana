import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";
import Lesson from "./pages/Lesson";
import Profile from "./pages/Profile";
import Compiler from "./pages/Compiler";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTopics from "./pages/AdminTopics";
import AdminCourses from "./pages/AdminCourses";
import AdminUsers from "./pages/AdminUsers";
import AdminStatistics from "./pages/AdminStatistics";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:courseId"
            element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:courseId/lesson/:lessonId"
            element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            }
          />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute>
                <AdminCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/topics"
            element={
              <ProtectedRoute>
                <AdminTopics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute>
                <AdminStatistics />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
