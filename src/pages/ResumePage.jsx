import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Download, 
  ArrowLeft,
  Calendar,
  Building,
  Award,
  Code2,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCollection } from '../hooks/useCollection';
import { useProjects } from '../hooks/useProjects';

const ResumePage = () => {
  const navigate = useNavigate();
  
  // Data Hooks
  const { data: aboutData } = useCollection('about');
  const { data: educationData } = useCollection('education');
  const { data: experienceData } = useCollection('experience');
  const { projects } = useProjects();
  const { data: skillsData } = useCollection('skills'); 
  const { data: certificatesData } = useCollection('certificates');

  // Fallback Data / Processing
  const profile = aboutData?.[0] || {
    desc: "Innovative Full Stack Developer with a passion for building scalable, user-centric web applications. Expert in the MERN stack and modern frontend architectures. Proven track record of delivering high-quality solutions for complex business challenges."
  };

  const contactInfo = {
    phone: "+251-931-61-90-83",
    email: "biniyamtayeoffical@gmail.com",
    location: "Arbaminch, Ethiopia",
    website: "biniyam-taye.vercel.app"
  };

  const education = educationData?.length > 0 ? educationData : [
    { school: "Scientific Excellence School", degree: "High School Diploma", year: "2018 - 2020" },
    { school: "Technical University", degree: "B.Sc. Computer Science", year: "2020 - 2024" },
    { school: "Global Tech University", degree: "M.Sc. Computer Science", year: "Present" }
  ];

  const experience = experienceData?.length > 0 ? experienceData : [];

  // Helper to normalize skills
  const skills = skillsData?.length > 0 ? skillsData : [
    { category: "Frontend", items: "React, Next.js, Tailwind CSS, TypeScript, HTML5, CSS3" },
    { category: "Backend", items: "Node.js, Express, MongoDB, PostgreSQL, Firebase" },
    { category: "Tools", items: "Git, Docker, AWS, Vercel, Figma" }
  ];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/cv/Mentesnot_Debele_Resume.pdf';
    link.download = 'Mentesnot_Debele_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#525659', 
      padding: '40px 0', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Controls */}
      <div className="no-print" style={{ 
        width: '210mm', 
        maxWidth: '95%',
        marginBottom: '20px', 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '10px 20px', background: '#374151', color: 'white', 
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500,
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#4b5563'}
          onMouseOut={(e) => e.target.style.background = '#374151'}
        >
          <ArrowLeft size={16} /> Return to Portfolio
        </button>
        <button 
          onClick={handleDownload} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '10px 20px', background: '#2563eb', color: 'white', 
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Download size={16} /> Download PDF
        </button>
      </div>

      {/* A4 Paper Document */}
      <div className="resume-document" style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        color: '#1f2937', 
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Header Section */}
        <header style={{ 
          background: '#1e293b', 
          color: 'white',
          padding: '40px 40px',
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Profile Image */}
          <div style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid rgba(255,255,255,0.2)',
            flexShrink: 0,
            backgroundColor: '#334155'
          }}>
            <img 
              src="/biniyam-photo.png" 
              alt="Biniyam Taye" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => e.target.style.display = 'none'} 
            />
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ 
              margin: '0 0 10px 0', 
              fontSize: '32pt', 
              fontWeight: 800, 
              letterSpacing: '-1px',
              fontFamily: "'Inter', sans-serif"
            }}>
              BINIYAM TAYE
            </h1>
            <h2 style={{ 
              margin: 0, 
              fontSize: '14pt', 
              fontWeight: 500, 
              color: '#38bdf8', 
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              Full Stack Developer
            </h2>
            
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '15px', 
              marginTop: '20px',
              fontSize: '9pt',
              color: '#e2e8f0'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} className="icon-blue" /> {contactInfo.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} className="icon-blue" /> {contactInfo.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} className="icon-blue" /> {contactInfo.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={14} className="icon-blue" /> {contactInfo.website}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Info Grid */}
        <div style={{ 
          display: 'flex', 
          flex: 1, 
          background: 'white'
        }}>
          
          {/* Left Column (Sidebar) */}
          <aside style={{ 
            width: '32%', 
            background: '#f8fafc',
            padding: '30px 25px',
            borderRight: '1px solid #e2e8f0'
          }}>
            
            {/* Skills Section */}
            <div className="section-block" style={{ marginBottom: '30px' }}>
               <h3 className="section-title">SKILLS</h3>
               <div className="section-line"></div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {skills.map((skillGroup, idx) => (
                   <div key={idx}>
                     <h4 style={{ fontSize: '9pt', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>
                       {skillGroup.category || (skillGroup.items ? "General" : "Tech Stack")}
                     </h4>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                       {(Array.isArray(skillGroup.items) ? skillGroup.items : (skillGroup.items || "").split(',')).map((skill, sIdx) => (
                         <span key={sIdx} style={{ 
                           background: 'white', border: '1px solid #cbd5e1', 
                           padding: '4px 8px', borderRadius: '4px', fontSize: '8pt',
                           color: '#334155', fontWeight: 500
                         }}>
                           {typeof skill === 'string' ? skill.trim() : skill}
                         </span>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Education Section */}
            <div className="section-block" style={{ marginBottom: '30px' }}>
              <h3 className="section-title">EDUCATION</h3>
              <div className="section-line"></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: '10pt', fontWeight: 700, color: '#1e293b' }}>{edu.degree}</div>
                    <div style={{ fontSize: '9pt', color: '#475569', marginTop: '2px' }}>{edu.school}</div>
                    <div style={{ fontSize: '8pt', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={10} /> {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications (Small) */}
            {certificatesData && certificatesData.length > 0 && (
              <div className="section-block" style={{ marginBottom: '30px' }}>
                <h3 className="section-title">CERTIFICATES</h3>
                <div className="section-line"></div>
                <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '9pt', color: '#334155' }}>
                  {certificatesData.slice(0, 4).map((cert, idx) => (
                     <li key={idx} style={{ marginBottom: '8px' }}>
                       <strong style={{ color: '#1e293b' }}>{cert.title}</strong>
                       <div style={{ fontSize: '8pt', color: '#64748b' }}>{cert.issuer}</div>
                     </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Connect */}
            <div className="section-block">
               <h3 className="section-title">FIND ME</h3>
               <div className="section-line"></div>
               <div style={{ fontSize: '9pt', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <a href={`https://${contactInfo.website}`} style={{ color: '#2563eb', textDecoration: 'none' }}>Personal Portfolio</a>
                 <a href="https://github.com" style={{ color: '#2563eb', textDecoration: 'none' }}>Github Profile</a>
                 <a href="https://linkedin.com" style={{ color: '#2563eb', textDecoration: 'none' }}>LinkedIn Profile</a>
               </div>
            </div>

          </aside>

          {/* Right Column (Main) */}
          <main style={{ 
            width: '68%', 
            padding: '30px 40px' 
          }}>
            
            {/* About Profile */}
            <section style={{ marginBottom: '35px' }}>
              <h3 className="main-title">
                <span style={{ color: '#2563eb' }}>ABOUT</span> ME
              </h3>
              <p style={{ 
                fontSize: '10pt', 
                lineHeight: '1.6', 
                color: '#334155', 
                margin: 0,
                textAlign: 'justify'
              }}>
                {profile.desc}
              </p>
            </section>

            {/* Experience */}
            {experience && experience.length > 0 && (
              <section style={{ marginBottom: '35px' }}>
                <h3 className="main-title">
                  <span style={{ color: '#2563eb' }}>WORK</span> EXPERIENCE
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {experience.map((exp, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <h4 style={{ fontSize: '11pt', fontWeight: 800, color: '#1e293b', margin: 0 }}>{exp.role}</h4>
                          <span style={{ fontSize: '10pt', fontWeight: 500, color: '#2563eb' }}>{exp.company}</span>
                        </div>
                        <span style={{ 
                          fontSize: '9pt', 
                          background: '#eff6ff', 
                          color: '#2563eb', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          fontWeight: 600
                        }}>
                          {exp.date || "2023 - Present"}
                        </span>
                      </div>
                      <p style={{ fontSize: '9.5pt', lineHeight: '1.5', color: '#475569', margin: 0 }}>
                        {exp.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            <section>
              <h3 className="main-title">
                <span style={{ color: '#2563eb' }}>SELECTED</span> PROJECTS
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {projects.slice(0, 5).map((proj, idx) => (
                  <div key={idx} style={{ 
                    borderLeft: '3px solid #e2e8f0', 
                    paddingLeft: '15px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                       <h4 style={{ fontSize: '11pt', fontWeight: 700, color: '#1e293b', margin: 0 }}>{proj.title}</h4>
                       {proj.tech && (
                         <span style={{ fontSize: '8pt', color: '#64748b', fontStyle: 'italic' }}>
                           {Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}
                         </span>
                       )}
                    </div>
                    <p style={{ fontSize: '9.5pt', lineHeight: '1.5', color: '#475569', margin: 0 }}>
                      {proj.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          
          </main>
        </div>

        {/* Footer Decor */}
        <div style={{ background: '#1e293b', height: '15px', width: '100%', marginTop: 'auto' }}></div>
      </div>

      <style>{`
        /* Minimal Reset for the Resume Page */
        .section-title {
          font-size: 10pt;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 8px 0;
          letter-spacing: 1px;
        }
        .section-line {
          width: 30px;
          height: 3px;
          background: #2563eb;
          margin-bottom: 15px;
        }
        .main-title {
          font-size: 14pt;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 15px 0;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 10px;
        }
        .icon-blue {
          color: #38bdf8;
        }

        @media print {
          .no-print { display: none !important; }
          body, html { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            width: 100% !important;
            height: 100% !important;
          }
          .resume-document {
            width: 100% !important;
            height: 100% !important;
            box-shadow: none !important;
            margin: 0 !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePage;
