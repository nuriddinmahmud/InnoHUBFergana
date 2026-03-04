import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import CoursesSection from "@/components/landing/CoursesSection";
import WhySection from "@/components/landing/WhySection";
import LearningPathSection from "@/components/landing/LearningPathSection";
import CompilerPreviewSection from "@/components/landing/CompilerPreviewSection";
import AboutSection from "@/components/landing/AboutSection";
import Footer from "@/components/landing/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    const el = document.getElementById(id);
    if (!el) return;
    // account for sticky navbar height (72px)
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <CoursesSection />
      <WhySection />
      <LearningPathSection />
      <CompilerPreviewSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
