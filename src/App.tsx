import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GlobalLoadingSpinner from "./components/GlobalLoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const Lesson = lazy(() => import("./pages/Lesson"));
const Profile = lazy(() => import("./pages/Profile"));
const Compiler = lazy(() => import("./pages/Compiler"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminTopics = lazy(() => import("./pages/AdminTopics"));
const AdminCourses = lazy(() => import("./pages/AdminCourses"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminStatistics = lazy(() => import("./pages/AdminStatistics"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Courses = lazy(() => import("./pages/Courses"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<GlobalLoadingSpinner />}>
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
                  <Lesson />
                </ProtectedRoute>
              }
            />
            <Route path="/lesson" element={<Navigate to="/courses" replace />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/compiler" element={<Compiler />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/topics"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminTopics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stats"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminStatistics />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
