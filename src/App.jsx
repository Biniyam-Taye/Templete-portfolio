import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

// Personal Portfolio Components
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import PortfolioGallery from './components/PortfolioGallery';
import SkillsInterests from './components/SkillsInterests';
import JourneyTimeline from './components/JourneyTimeline';
import AchievementsSection from './components/AchievementsSection';
import TestimonialsSection from './components/TestimonialsSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import SidebarNav from './components/SidebarNav';
import LifeOSSection from './components/LifeOSSection';

// State Management
import { useAdminAuth } from './context/AuthContext';

// Pages
import ArtGalleryPage from './components/ArtGalleryPage';
import DesignGalleryPage from './components/DesignGalleryPage';
import MemoriesGalleryPage from './components/MemoriesGalleryPage';
import DiaryPage from './components/DiaryPage';
import ExperimentalMe from './components/ExperimentalMe';
import MovieDatabase from './components/MovieDatabase';
import RecipeBook from './components/RecipeBook';
import CourseList from './components/CourseList';
import ImportantDocuments from './components/ImportantDocuments';
import TravelPlanner from './components/TravelPlanner';
import StrategicThinking from './components/StrategicThinking';
import DiaryNewEntry from './components/DiaryNewEntry';
import ExperimentalNewEntry from './components/ExperimentalNewEntry';
import MovieNewEntry from './components/MovieNewEntry';
import RecipeNewEntry from './components/RecipeNewEntry';
import CourseNewEntry from './components/CourseNewEntry';
import DocumentNewEntry from './components/DocumentNewEntry';
import TravelNewEntry from './components/TravelNewEntry';
import StrategyNewEntry from './components/StrategyNewEntry';
import Library from './components/Library';
import LibraryNewEntry from './components/LibraryNewEntry';
import Bin from './components/Bin';
import PlanPage from './components/PlanPage';
import SettingsPage from './components/SettingsPage';
import AdminLoginPage from './components/AdminLoginPage';

// Hooks
import { useCollection } from './hooks/useCollection';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoaded } = useAdminAuth();
  if (!isLoaded) return null;
  return isAuthenticated ? children : <Navigate to="/admin-login" />;
};

const PortfolioHome = () => {
  const { data: portfolio, loading: portfolioLoading } = useCollection('portfolio');
  const { data: skills, loading: skillsLoading } = useCollection('skills');
  const { data: journey, loading: journeyLoading } = useCollection('journey');
  const { data: achievements, loading: achievementsLoading } = useCollection('achievements');

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const handleOpenDetail = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
    setGalleryIndex(0);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
    setSelectedType(null);
    setGalleryIndex(0);
  };

  const getImages = () => {
    if (!selectedItem) return [];
    if (selectedType === 'portfolio') {
      return [selectedItem.imageUrl || selectedItem.image, ...(selectedItem.gallery || [])].filter(Boolean);
    }
    if (selectedType === 'journey') {
      return [selectedItem.image, ...(selectedItem.gallery || [])].filter(Boolean);
    }
    if (selectedType === 'achievement') {
      return [selectedItem.imageUrl, ...(selectedItem.gallery || [])].filter(Boolean);
    }
    return [];
  };

  const images = getImages();

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      <div className="bg-mesh"></div>
      <SidebarNav />

      <motion.div
        animate={{
          filter: selectedItem ? 'blur(10px) brightness(0.7)' : 'blur(0px) brightness(1)',
          scale: selectedItem ? 0.98 : 1
        }}
        transition={{ duration: 0.5 }}
        style={{ pointerEvents: selectedItem ? 'none' : 'auto' }}
      >
        <HeroSection />
        <AboutSection />
        <PortfolioGallery
          items={portfolio}
          onItemClick={(item) => handleOpenDetail(item, 'portfolio')}
        />
        <LifeOSSection />
        <SkillsInterests skills={skills} />
        <JourneyTimeline
          milestones={journey}
          onOpenDetail={(item) => handleOpenDetail(item, 'journey')}
        />
        <AchievementsSection
          achievements={achievements}
          onOpenDetail={(item) => handleOpenDetail(item, 'achievement')}
        />
        <TestimonialsSection />
        <ServicesSection />
        <ContactSection />
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetail}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(20px)', zIndex: 2000, cursor: 'zoom-out'
              }}
            />
            <div style={{
              position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 2001, pointerEvents: 'none', padding: '40px'
            }}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                style={{
                  width: 'min(1000px, 95vw)', height: 'min(750px, 85vh)',
                  background: 'var(--card-bg)', borderRadius: '40px',
                  border: `1.5px solid ${selectedItem.color || 'var(--accent-primary)'}`,
                  padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px',
                  boxShadow: '0 50px 100px rgba(0,0,0,0.5)', overflow: 'hidden',
                  pointerEvents: 'auto', position: 'relative'
                }}
              >
                <button
                  onClick={handleCloseDetail}
                  style={{
                    position: 'absolute', top: '25px', right: '25px',
                    background: 'var(--bg-color)', border: '1px solid var(--border-color)',
                    borderRadius: '50%', width: '50px', height: '50px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-primary)', cursor: 'pointer', zIndex: 10
                  }}
                >
                  <X size={24} />
                </button>

                <div className="modal-content-grid" style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '50px', height: '100%', overflowY: 'auto', paddingRight: '10px'
                }}>
                  {images.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{
                        width: '100%', height: '450px', borderRadius: '24px',
                        overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                        position: 'relative'
                      }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%', background: 'rgba(0,0,0,0.2)' }}>
                          <div className="custom-slider" style={{
                            display: 'flex', width: '100%', height: '100%',
                            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                            transform: `translateX(-${galleryIndex * 100}%)`
                          }}>
                            {images.map((img, i) => (
                              <div key={i} style={{ minWidth: '100%', height: '100%', position: 'relative' }}>
                                <img src={img} alt={`${selectedItem.title} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              </div>
                            ))}
                          </div>
                          {images.length > 1 && (
                            <>
                              <button onClick={() => setGalleryIndex(prev => Math.max(0, prev - 1))} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5, opacity: galleryIndex === 0 ? 0.3 : 1 }}><ChevronLeft size={24} /></button>
                              <button onClick={() => setGalleryIndex(prev => Math.min(images.length - 1, prev + 1))} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5, opacity: galleryIndex === images.length - 1 ? 0.3 : 1 }}><ChevronRight size={24} /></button>
                            </>
                          )}
                        </div>
                      </div>
                      {images.length > 1 && (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          {images.map((_, i) => (
                            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === galleryIndex ? (selectedItem.color || 'var(--accent-primary)') : 'var(--border-color)', cursor: 'pointer' }} onClick={() => setGalleryIndex(i)} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 0' }}>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)', marginBottom: '20px', textTransform: 'uppercase' }}>{selectedItem.title}</h2>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '30px' }}>{selectedItem.description || selectedItem.desc}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route path="/art-gallery" element={<ArtGalleryPage />} />
        <Route path="/design-gallery" element={<DesignGalleryPage />} />
        <Route path="/memories-gallery" element={<MemoriesGalleryPage />} />
        
        <Route path="/diary" element={<ProtectedRoute><DiaryPage /></ProtectedRoute>} />
        <Route path="/diary/new" element={<ProtectedRoute><DiaryNewEntry /></ProtectedRoute>} />
        <Route path="/plan" element={<ProtectedRoute><PlanPage /></ProtectedRoute>} />
        
        <Route path="/experimental-me" element={<ProtectedRoute><ExperimentalMe /></ProtectedRoute>} />
        <Route path="/experimental-me/new" element={<ProtectedRoute><ExperimentalNewEntry /></ProtectedRoute>} />
        <Route path="/movies" element={<ProtectedRoute><MovieDatabase /></ProtectedRoute>} />
        <Route path="/movies/new" element={<ProtectedRoute><MovieNewEntry /></ProtectedRoute>} />
        <Route path="/recipes" element={<ProtectedRoute><RecipeBook /></ProtectedRoute>} />
        <Route path="/recipes/new" element={<ProtectedRoute><RecipeNewEntry /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><CourseList /></ProtectedRoute>} />
        <Route path="/courses/new" element={<ProtectedRoute><CourseNewEntry /></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><ImportantDocuments /></ProtectedRoute>} />
        <Route path="/documents/new" element={<ProtectedRoute><DocumentNewEntry /></ProtectedRoute>} />
        <Route path="/travel" element={<ProtectedRoute><TravelPlanner /></ProtectedRoute>} />
        <Route path="/travel/new" element={<ProtectedRoute><TravelNewEntry /></ProtectedRoute>} />
        <Route path="/strategy" element={<ProtectedRoute><StrategicThinking /></ProtectedRoute>} />
        <Route path="/strategy/new" element={<ProtectedRoute><StrategyNewEntry /></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/library/new" element={<ProtectedRoute><LibraryNewEntry /></ProtectedRoute>} />
        <Route path="/bin" element={<ProtectedRoute><Bin /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
