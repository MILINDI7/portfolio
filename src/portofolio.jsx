import React, { useState, useEffect, useRef } from 'react';
import { Github, ExternalLink, Mail, Phone, MapPin, Linkedin, Twitter, Code, Database, Server } from 'lucide-react';
import './portfolio.css';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.keys(sectionRefs.current);
      for (let section of sections) {
        const element = sectionRefs.current[section];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ParticleBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationId;
      
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      const particles = [];
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;

          if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.2})`;
          ctx.fill();
        });

        particles.forEach((particle, i) => {
          particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
              ctx.stroke();
            }
          });
        });

        animationId = requestAnimationFrame(animate);
      };

      resizeCanvas();
      animate();

      window.addEventListener('resize', resizeCanvas);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(animationId);
      };
    }, []);

    return <canvas ref={canvasRef} className="particle-canvas" />;
  };
    const SkillMeter = ({ skill, percentage }) => {
    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 500);
      return () => clearTimeout(timer);
    }, [percentage]);

    return (
      <div className="skill-meter">
        <div className="skill-header">
          <span className="skill-name">{skill}</span>
          <span className="skill-percentage">{percentage}%</span>
        </div>
        <div className="skill-bar">
          <div 
            className="skill-progress"
            style={{ width: `${animatedPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  const ProjectCard = ({ project }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        className="project-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`project-image ${isHovered ? 'hovered' : ''}`}>
          <div className="project-overlay" />
          <div className="project-icon">
            <Code size={64} />
          </div>
        </div>
        <div className="project-content">
          <h3 className="project-title">{project.title}</h3>
          <p className="project-description">{project.description}</p>
          <div className="project-tech">
            {project.tech.map((tech, index) => (
              <span key={index} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
          <div className="project-links">
            <a href={project.githubLink} className="project-link github" target="_blank" rel="noopener noreferrer">
              <Github size={16} />
              Code
            </a>
            <a href={project.demoLink} className="project-link demo" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} />
              Live Demo
            </a>
          </div>
        </div>
      </div>
    );
  };

  const TimelineItem = ({ item, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    const itemRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setIsVisible(true), index * 200);
          }
        },
        { threshold: 0.3 }
      );

      if (itemRef.current) {
        observer.observe(itemRef.current);
      }

      return () => observer.disconnect();
    }, [index]);

    return (
      <div 
        ref={itemRef}
        className={`timeline-item ${isVisible ? 'visible' : ''}`}
      >
        <div className="timeline-dot" />
        <div className="timeline-line" />
        <div className="timeline-content">
          <div className="timeline-header">
            <h3 className="timeline-title">{item.title}</h3>
            <span className="timeline-period">{item.period}</span>
          </div>
          <h4 className="timeline-company">{item.company}</h4>
          <p className="timeline-description">{item.description}</p>
        </div>
      </div>
    );
  };

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with payment integration and admin dashboard",
      tech: ["React", "Node.js", "MongoDB", "Stripe"],
      githubLink: "https://github.com/MILINDI7",
      demoLink: "https://milindi7.github.io/photo-combo/"
    },
    {
      title: "Task Management App",
      description: "Real-time collaborative task management with drag-and-drop functionality",
      tech: ["Vue.js", "Express", "Socket.io", "PostgreSQL"],
      githubLink: "https://github.com/MILINDI7",
      demoLink: "https://milindi7.github.io/photo-combo/"
    },
    {
      title: "Data Visualization Dashboard",
      description: "Interactive dashboard for business analytics with real-time data updates",
      tech: ["React", "D3.js", "Python", "FastAPI"],
      githubLink: "https://github.com/MILINDI7",
      demoLink: "https://milindi7.github.io/photo-combo/"
    }
  ];

  const experiences = [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Innovations Inc.",
      period: "2022 - Present",
      description: "Led development of microservices architecture, mentored junior developers, and improved system performance by 40%"
    },
    {
      title: "Full Stack Developer",
      company: "Digital Solutions Co.",
      period: "2020 - 2022",
      description: "Developed and maintained web applications, collaborated with cross-functional teams, implemented CI/CD pipelines"
    },
    {
      title: "Junior Developer",
      company: "StartUp Labs",
      period: "2019 - 2020",
      description: "Built responsive web interfaces, worked with REST APIs, participated in agile development processes"
    }
  ];
    return (
    <div className="portfolio">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">Portfolio</div>
          <div className="nav-menu">
            {['home', 'about', 'skills', 'projects', 'experience', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`nav-link ${activeSection === section ? 'active' : ''}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section
        ref={el => sectionRefs.current['home'] = el}
        className="hero-section"
      >
        <ParticleBackground />
        <div className="hero-content">
          <h2 className="hero-title">
            This is MILINDI Shema David, welcome to my portfolio!
          </h2>
          <p className="hero-subtitle">
            Full Stack Developer | Problem Solver | Innovator
          </p>
          <div className="hero-buttons">
            <a
              href={process.env.PUBLIC_URL + "/MILINDI-resume.pdf"}
              download="MILINDI-resume.pdf"
              className="btn btn-primary"
            >
              Download My CV
            </a>
            <button
              onClick={() => scrollToSection('contact')}
              className="btn btn-outline"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </section>

      <section 
        ref={el => sectionRefs.current['about'] = el}
        className="about-section"
      >
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p className="about-paragraph">
                I'm a passionate full-stack developer with over 5 years of experience building scalable web applications. 
                I love turning complex problems into simple, beautiful solutions that provide exceptional user experiences.
              </p>
              <p className="about-paragraph">
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, 
                or sharing knowledge with the developer community through blog posts and tech talks.
              </p>
              <div className="about-badges">
                <span className="badge badge-blue">Problem Solver</span>
                <span className="badge badge-purple">Team Player</span>
                <span className="badge badge-green">Lifelong Learner</span>
              </div>
            </div>
            <div className="about-avatar">
              <div className="avatar-container">
                <div className="avatar-inner">
                  <Code size={128} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section 
        ref={el => sectionRefs.current['skills'] = el}
        className="skills-section"
      >
        <div className="container">
          <h2 className="section-title">Skills & Tools</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <div className="category-header">
                <Code size={32} />
                <h3>Frontend</h3>
              </div>
              <SkillMeter skill="React/Next.js" percentage={95} />
              <SkillMeter skill="TypeScript" percentage={90} />
              <SkillMeter skill="Vue.js" percentage={85} />
              <SkillMeter skill="Tailwind CSS" percentage={90} />
            </div>
            <div className="skill-category">
              <div className="category-header">
                <Server size={32} />
                <h3>Backend</h3>
              </div>
              <SkillMeter skill="Node.js" percentage={90} />
              <SkillMeter skill="Python" percentage={85} />
              <SkillMeter skill="PostgreSQL" percentage={80} />
              <SkillMeter skill="MongoDB" percentage={85} />
            </div>
            <div className="skill-category">
              <div className="category-header">
                <Database size={32} />
                <h3>DevOps</h3>
              </div>
              <SkillMeter skill="Docker" percentage={85} />
              <SkillMeter skill="AWS" percentage={80} />
              <SkillMeter skill="CI/CD" percentage={75} />
              <SkillMeter skill="Kubernetes" percentage={70} />
            </div>
          </div>
        </div>
      </section>

      <section 
        ref={el => sectionRefs.current['projects'] = el}
        className="projects-section"
      >
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section 
        ref={el => sectionRefs.current['experience'] = el}
        className="experience-section"
      >
        <div className="container-narrow">
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            {experiences.map((experience, index) => (
              <TimelineItem key={index} item={experience} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section 
        ref={el => sectionRefs.current['contact'] = el}
        className="contact-section"
      >
        <div className="container-narrow">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={24} />
                <span>dshema7@gmail.com</span>
              </div>
              <div className="contact-item">
                <Phone size={24} />
                <span>+250787562222</span>
              </div>
              <div className="contact-item">
                <MapPin size={24} />
                <span>Kigali, Rwanda</span>
              </div>
              <div className="social-links">
                <a href="https://github.com/MILINDI7" className="social-link" target="_blank" rel="noopener noreferrer">
                  <Github size={24} />
                </a>
                <a href="https://www.linkedin.com/in/david-milindi-shema-803954231/" className="social-link" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={24} />
                </a>
                <a href="x.com" className="social-link" target="_blank" rel="noopener noreferrer">
                  <Twitter size={24} />
                </a>
              </div>
            </div>
            <div className="contact-form">
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="Your Name"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Your Email"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <textarea 
                  placeholder="Your Message"
                  rows="5"
                  className="form-textarea"
                />
              </div>
              <button 
                onClick={() => alert('Message sent! (Demo functionality)')}
                className="btn btn-primary btn-full"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© 2025 MILINDI Shema David. Built with React and ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;