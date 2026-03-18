import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>,
);
