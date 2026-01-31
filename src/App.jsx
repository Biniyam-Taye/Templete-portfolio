import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Pages
// Pages
// All unrelated pages removed as per request

// Hooks
import { useCollection } from './hooks/useCollection';

const PortfolioHome = () => {
  const { data: portfolio, loading: portfolioLoading } = useCollection('portfolio');
  const { data: skills, loading: skillsLoading } = useCollection('skills');
  const { data: journey, loading: journeyLoading } = useCollection('journey');
  const { data: achievements, loading: achievementsLoading } = useCollection('achievements');

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // 'portfolio', 'journey', 'achievement'
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

      {/* Main Content with Blur Effect */}
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

      {/* Universal Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetail}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(20px)',
                zIndex: 2000,
                cursor: 'zoom-out'
              }}
            />

            <div style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2001,
              pointerEvents: 'none',
              padding: '40px'
            }}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                style={{
                  width: 'min(1000px, 95vw)',
                  height: 'min(750px, 85vh)',
                  background: 'var(--card-bg)',
                  borderRadius: '40px',
                  border: `1.5px solid ${selectedItem.color || 'var(--accent-primary)'}`,
                  padding: '40px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '30px',
                  boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  pointerEvents: 'auto',
                  position: 'relative'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={handleCloseDetail}
                  style={{
                    position: 'absolute',
                    top: '25px',
                    right: '25px',
                    background: 'var(--bg-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                >
                  <X size={24} />
                </button>

                <div className="modal-content-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '50px',
                  height: '100%',
                  overflowY: 'auto',
                  paddingRight: '10px'
                }}>
                  {/* Left Column: Image Gallery */}
                  {images.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{
                        width: '100%',
                        height: '450px',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                        position: 'relative'
                      }}>
                        <div style={{ position: 'relative', width: '100%', height: '100%', background: 'rgba(0,0,0,0.2)' }}>
                          <div className="custom-slider" style={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                            transform: `translateX(-${galleryIndex * 100}%)`
                          }}>
                            {images.map((img, i) => (
                              <div key={i} style={{
                                minWidth: '100%',
                                height: '100%',
                                position: 'relative'
                              }}>
                                <img
                                  src={img}
                                  alt={`${selectedItem.title} ${i + 1}`}
                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                              </div>
                            ))}
                          </div>

                          {/* Navigation Buttons */}
                          {images.length > 1 && (
                            <>
                              <button
                                onClick={() => setGalleryIndex(prev => Math.max(0, prev - 1))}
                                style={{
                                  position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
                                  width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.5)',
                                  backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                  zIndex: 5, opacity: galleryIndex === 0 ? 0.3 : 1, transition: 'all 0.3s ease'
                                }}
                              >
                                <ChevronLeft size={24} />
                              </button>
                              <button
                                onClick={() => setGalleryIndex(prev => Math.min(images.length - 1, prev + 1))}
                                style={{
                                  position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                                  width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.5)',
                                  backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.1)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                  zIndex: 5, opacity: galleryIndex === images.length - 1 ? 0.3 : 1, transition: 'all 0.3s ease'
                                }}
                              >
                                <ChevronRight size={24} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Gallery Indicators */}
                      {images.length > 1 && (
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          {images.map((_, i) => (
                            <div
                              key={i}
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: i === galleryIndex ? (selectedItem.color || 'var(--accent-primary)') : 'var(--border-color)',
                                cursor: 'pointer'
                              }}
                              onClick={() => setGalleryIndex(i)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Right Column: Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 0' }}>
                    {/* Category/Type Badge */}
                    {(selectedItem.category || selectedType) && (
                      <div style={{
                        display: 'inline-block',
                        padding: '6px 16px',
                        borderRadius: '100px',
                        background: `${selectedItem.color || 'var(--accent-primary)'}22`,
                        border: `1px solid ${selectedItem.color || 'var(--accent-primary)'}`,
                        color: selectedItem.color || 'var(--accent-primary)',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontFamily: "'Inter', sans-serif, sans-serif",
                        marginBottom: '20px',
                        width: 'fit-content'
                      }}>
                        {selectedItem.category || selectedType}
                      </div>
                    )}

                    {/* Title */}
                    <h2 style={{
                      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                      fontFamily: 'Playfair Display', serif,
                      color: 'var(--text-primary)',
                      lineHeight: 1.1,
                      marginBottom: '20px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}>
                      {selectedItem.title}
                    </h2>

                    {/* Subtitle (issuer, location, etc) */}
                    {(selectedItem.issuer || selectedItem.location) && (
                      <div style={{
                        fontSize: '1.1rem',
                        color: selectedItem.color || 'var(--accent-primary)',
                        marginBottom: '20px',
                        fontFamily: "'Inter', sans-serif, sans-serif",
                        fontWeight: 600
                      }}>
                        {selectedItem.issuer || selectedItem.location}
                      </div>
                    )}

                    <div style={{ width: '60px', height: '4px', background: selectedItem.color || 'var(--accent-primary)', marginBottom: '30px' }}></div>

                    {/* Description */}
                    <p style={{
                      fontSize: '1.05rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.8,
                      marginBottom: '30px',
                      fontFamily: "'Inter', sans-serif, sans-serif",
                      fontWeight: 400
                    }}>
                      {selectedItem.description || selectedItem.desc}
                    </p>

                    {/* Date */}
                    {selectedItem.date && (
                      <div style={{
                        padding: '15px 20px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        border: `1px dashed ${selectedItem.color || 'var(--accent-primary)'}44`,
                        marginTop: 'auto'
                      }}>
                        <div style={{
                          fontSize: '0.75rem',
                          color: selectedItem.color || 'var(--accent-primary)',
                          fontFamily: "'Inter', sans-serif, sans-serif",
                          fontWeight: 600,
                          letterSpacing: '2px',
                          marginBottom: '5px',
                          textTransform: 'uppercase'
                        }}>
                          DATE
                        </div>
                        <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                          {selectedItem.date}
                        </div>
                      </div>
                    )}

                    {/* Link Button */}
                    {selectedItem.link && (
                      <motion.a
                        href={selectedItem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, backgroundColor: selectedItem.color || 'var(--accent-primary)', color: 'white' }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          marginTop: '20px',
                          width: '100%',
                          padding: '18px',
                          background: 'var(--text-primary)',
                          color: 'var(--bg-color)',
                          borderRadius: '16px',
                          fontFamily: "'Inter', sans-serif, sans-serif",
                          fontSize: '1rem',
                          letterSpacing: '2px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          textAlign: 'center',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        VIEW MORE <ExternalLink size={18} />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .modal-content-grid::-webkit-scrollbar {
          width: 4px;
        }
        .modal-content-grid::-webkit-scrollbar-thumb {
          background: var(--border-color);
          borderRadius: 10px;
        }
        
        @media (max-width: 1024px) {
          .modal-content-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
        
        @media (max-width: 768px) {
          .modal-content-grid {
            padding: 10px !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/art-gallery" element={<ArtGalleryPage />} />
        <Route path="/design-gallery" element={<DesignGalleryPage />} />
        <Route path="/memories-gallery" element={<MemoriesGalleryPage />} />
        <Route path="/diary" element={<DiaryPage />} />
        <Route path="/diary/new" element={<DiaryNewEntry />} />
        <Route path="/experimental-me" element={<ExperimentalMe />} />
        <Route path="/experimental-me/new" element={<ExperimentalNewEntry />} />
        <Route path="/movies" element={<MovieDatabase />} />
        <Route path="/movies/new" element={<MovieNewEntry />} />
        <Route path="/recipes" element={<RecipeBook />} />
        <Route path="/recipes/new" element={<RecipeNewEntry />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/courses/new" element={<CourseNewEntry />} />
        <Route path="/documents" element={<ImportantDocuments />} />
        <Route path="/documents/new" element={<DocumentNewEntry />} />
        <Route path="/travel" element={<TravelPlanner />} />
        <Route path="/travel/new" element={<TravelNewEntry />} />
        <Route path="/strategy" element={<StrategicThinking />} />
        <Route path="/strategy/new" element={<StrategyNewEntry />} />
        <Route path="/library" element={<Library />} />
        <Route path="/library/new" element={<LibraryNewEntry />} />
        <Route path="/bin" element={<Bin />} />
        <Route path="/plan" element={<PlanPage />} />
      </Routes>
    </Router>
  );
}

export default App;
