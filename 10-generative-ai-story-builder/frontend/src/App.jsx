import Header from "@/components/Header";
import GalleryPage from "@/pages/GalleryPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage.jsx";
import RegisterPage from "@/pages/RegisterPage.jsx";
import StoryBuilderPage from "@/pages/StoryBuilderPage";
import StoryViewPage from "@/pages/StoryViewPage";
import { AuthProvider } from "@/providers/AuthProvider.jsx";
import { motion } from "framer-motion";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 font-inter">
          <Header />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="pt-20"
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<StoryBuilderPage />} />
              <Route path="/create/:id" element={<StoryBuilderPage />} />
              <Route path="/story/:id" element={<StoryViewPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
