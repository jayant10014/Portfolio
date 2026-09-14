import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// --- TYPE DEFINITIONS FOR PROPS ---
export interface NavLink { label: string; href: string; }

export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageContent?: React.ReactNode;
  badge?: string;
  linkText?: string;
  linkHref?: string;
}

export interface Stat { value: string; label: string; }

export interface Experience {
  role: string;
  organization: string;
  date: string;
  description: string;
}

export interface Publication {
  year: string;
  journal: string;
  type: string;
  title: string;
  authors: string;
  citation: string;
  abstract: string;
  keywords: string[];
  doi: string;
  link: string;
}

export interface BookChapter {
  year: string;
  bookTitle: string;
  publisher: string;
  chapterTitle: string;
  authors: string;
  editors?: string;
  pages: string;
  abstract: string;
  keywords: string[];
  isbn: string;
}

export interface PortfolioPageProps {
  logo?: { initials: React.ReactNode; name: React.ReactNode; };
  navLinks?: NavLink[];
  resume?: { label: string; onClick?: () => void; };
  hero?: { titleLine1: React.ReactNode; titleLine2Gradient: React.ReactNode; subtitle: React.ReactNode; };
  ctaButtons?: { primary: { label: string; onClick?: () => void; }; secondary: { label: string; onClick?: () => void; }; };
  projects?: Project[];
  stats?: Stat[];
  experience?: Experience[];
  publications?: Publication[];
  bookChapters?: BookChapter[];
  contact?: {
    heading: React.ReactNode;
    subtitle: React.ReactNode;
    links: { label: string; href: string; iconLabel?: string }[];
    terminalJson?: string;
  };
  showAnimatedBackground?: boolean;
}

// --- INTERNAL ANIMATED BACKGROUND COMPONENT ---
const AuroraBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'fixed';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '0';
        renderer.domElement.style.display = 'block';
        currentMount.appendChild(renderer.domElement);
        const material = new THREE.ShaderMaterial({
            uniforms: { iTime: { value: 0 }, iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) } },
            vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
            fragmentShader: `
                uniform float iTime; uniform vec2 iResolution;
                #define NUM_OCTAVES 3
                float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
                float noise(vec2 p){ vec2 ip=floor(p);vec2 u=fract(p);u=u*u*(3.0-2.0*u);float res=mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);return res*res; }
                float fbm(vec2 x) { float v=0.0;float a=0.3;vec2 shift=vec2(100);mat2 rot=mat2(cos(0.5),sin(0.5),-sin(0.5),cos(0.50));for(int i=0;i<NUM_OCTAVES;++i){v+=a*noise(x);x=rot*x*2.0+shift;a*=0.4;}return v;}
                vec4 tanh_compat(vec4 x) {
                    vec4 e2x = exp(2.0 * x);
                    return (e2x - 1.0) / (e2x + 1.0);
                }
                void main() {
                    vec2 p=((gl_FragCoord.xy)-iResolution.xy*0.5)/iResolution.y*mat2(6.,-4.,4.,6.);vec4 o=vec4(0.);float f=2.+fbm(p+vec2(iTime*5.,0.))*.5;
                    for(int i=0; i<35; i++){
                        float fi = float(i);
                        vec2 v=p+cos(fi*fi+(iTime+p.x*.08)*.025+fi*vec2(13.0,11.0))*3.5;
                        float tailNoise=fbm(v+vec2(iTime*.5,fi))*.3*(1.-(fi/35.));
                        vec4 auroraColors=vec4(.1+.3*sin(fi*.2+iTime*.4),.3+.5*cos(fi*.3+iTime*.5),.7+.3*sin(fi*.4+iTime*.3),1.);
                        vec4 currentContribution=auroraColors*exp(sin(fi*fi+iTime*.8))/length(max(v,vec2(v.x*f*.015,v.y*1.5)));
                        float thinnessFactor=smoothstep(0.,1.,fi/35.)*.6;
                        o+=currentContribution*(1.+tailNoise*.8)*thinnessFactor;
                    }
                    o=tanh_compat(pow(o/100.,vec4(1.6)));gl_FragColor=o*1.5;
                }`
        });
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        let animationFrameId: number;
        const animate = () => { animationFrameId = requestAnimationFrame(animate); material.uniforms.iTime.value += 0.016; renderer.render(scene, camera); };
        const handleResize = () => { renderer.setSize(window.innerWidth, window.innerHeight); material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight); };
        window.addEventListener('resize', handleResize);
        animate();
        return () => { cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', handleResize); if (currentMount.contains(renderer.domElement)) currentMount.removeChild(renderer.domElement); renderer.dispose(); material.dispose(); geometry.dispose(); };
    }, []);
    return <div ref={mountRef} />;
};

// --- MAIN CUSTOMIZABLE PORTFOLIO COMPONENT ---
const PortfolioPage: React.FC<PortfolioPageProps> = ({
  logo,
  navLinks = [],
  resume,
  hero,
  ctaButtons,
  projects = [],
  stats = [],
  experience = [],
  publications = [],
  bookChapters = [],
  contact,
  showAnimatedBackground = true,
}) => {
  return (
    <div className="bg-[#020406] text-[#e2e8f0] font-sans min-h-screen relative antialiased selection:bg-[#818cf8]/30 selection:text-white">
      {showAnimatedBackground && <AuroraBackground />}
      <div className="noise-overlay" />
      <div className="relative z-10">
        {/* NAV */}
        <nav className="w-full px-6 py-4 fixed top-0 left-0 right-0 z-50 glass-nav">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <span className="font-display text-sm font-bold text-white">{logo?.initials}</span>
              </div>
              <span className="font-display text-lg font-semibold tracking-tight text-white">{logo?.name}</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className="text-[#8b9bb4] hover:text-[#818cf8] transition-colors text-xs font-medium tracking-wide">{link.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#818cf8] border border-[#818cf8]/25 px-3.5 py-1 rounded-full bg-[#020406]/60 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#818cf8] glow-pulse-blue"></span>
                Open to work
              </div>
              {resume && (
                <button onClick={resume.onClick} className="btn-outline px-4 py-1.5 rounded-lg text-white text-xs font-medium tracking-wide">{resume.label}</button>
              )}
            </div>
          </div>
        </nav>

        {/* HERO */}
        <main id="home" className="w-full min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12">
          <div className="max-w-4xl w-full text-left">
            <div className="text-xs font-semibold text-[#818cf8] tracking-widest uppercase mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-gradient-to-r from-[#818cf8] to-transparent"></span>
              {hero?.titleLine1}
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-white mb-6">
              Jayant <span className="gradient-text">{hero?.titleLine2Gradient}</span><br />
              <span className="text-[#818cf8] font-bold">M.Sc. Student</span>
            </h1>
            <p className="font-display text-xl md:text-2xl font-semibold text-[#8b9bb4] mb-3">{hero?.subtitle}</p>
            <p className="text-sm md:text-base text-[#94a3b8] leading-relaxed max-w-xl mb-8 font-normal">
              I build <em className="text-[#818cf8] not-italic font-semibold">analysis pipelines</em>, model protein structures, and run experiments — decoding the language of life at the intersection of bench and code.
            </p>
            <div className="flex gap-4 mb-16 flex-wrap">
              {resume && (
                <button onClick={resume.onClick} className="btn-glow-blue px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide shadow-lg">View CV</button>
              )}
              {ctaButtons?.primary && (
                <button onClick={ctaButtons.primary.onClick} className="btn-outline px-6 py-3 rounded-xl text-xs sm:text-sm font-medium tracking-wide">{ctaButtons.primary.label}</button>
              )}
            </div>
            
            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[#818cf8]/10 border border-[#818cf8]/12 rounded-xl overflow-hidden max-w-2xl">
              {stats.map((stat, i) => (
                <div key={i} className="bg-[#020406]/60 backdrop-blur-md p-4 text-center">
                  <span className="font-display text-2xl md:text-3xl font-extrabold text-[#818cf8] block tracking-tight">{stat.value}</span>
                  <span className="text-[11px] font-medium text-[#64748b] uppercase tracking-wider block mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* ABOUT */}
        <section id="about" className="w-full px-6 py-20 bg-[#060a10]/90 border-t border-[#818cf8]/12">
          <div className="max-w-6xl mx-auto">
            <span className="text-xs font-semibold text-[#818cf8] tracking-widest uppercase block mb-3">01 — About</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-12">Where <em className="text-[#818cf8] not-italic">biology</em> meets code</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6 text-[#94a3b8] text-sm md:text-base leading-relaxed font-normal">
                <p>
                  I'm a master's student in Biotechnology with a dual focus in <span className="text-[#818cf8] font-medium">computational genomics</span> and <span className="text-[#818cf8] font-medium">molecular biology</span>. Most biotech students can't code. Most bioinformaticians haven't run a western blot. I do both — and that gap is where my work lives.
                </p>
                <p>
                  My research spans <span className="text-[#818cf8] font-medium">differential gene expression</span>, <span className="text-[#818cf8] font-medium">protein structure prediction</span>, and building reproducible analysis pipelines. I believe in open science and document everything on GitHub.
                </p>
                <p>
                  Currently seeking research internships and industry roles where <span className="text-[#f472b6] font-medium">wet lab experience</span> meets computational biology. Based in India, open to relocate.
                </p>
              </div>
              
              {/* Skills Box */}
              <div className="bg-[#020406]/85 border border-[#818cf8]/15 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-white/[0.02] border-b border-[#818cf8]/15 px-4 py-3 flex items-center gap-2 text-xs font-medium text-[#64748b]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c940]" />
                  <span className="ml-2">tech_stack — DNA double helix</span>
                </div>
                
                <div className="p-6">
                  <div className="h-40 flex items-center justify-center relative overflow-hidden bg-black/40 rounded-xl mb-4 border border-white/[0.02]">
                    <svg className="absolute inset-0 w-full h-full opacity-65" viewBox="0 0 400 200">
                      <defs>
                        <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#22d3a5" />
                          <stop offset="50%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#f472b6" />
                        </linearGradient>
                      </defs>
                      <g>
                        {Array.from({ length: 9 }).map((_, idx) => {
                          const y = 24 + idx * 18;
                          const delay = idx * 0.22;
                          return (
                            <g key={idx}>
                              {/* Rung line */}
                              <line
                                y1={y}
                                y2={y}
                                stroke="url(#dnaGrad)"
                                strokeWidth="1.5"
                                className="dna-rung"
                                style={{ animationDelay: `${delay}s` }}
                              />
                              {/* Node A (Left strand) */}
                              <circle
                                cy={y}
                                r="4.5"
                                fill="#22d3a5"
                                className="dna-node-a"
                                style={{ animationDelay: `${delay}s` }}
                              />
                              {/* Node B (Right strand) */}
                              <circle
                                cy={y}
                                r="4.5"
                                fill="#818cf8"
                                className="dna-node-b"
                                style={{ animationDelay: `${delay}s` }}
                              />
                            </g>
                          );
                        })}
                      </g>
                    </svg>
                    <div className="z-10 font-mono text-xs text-[#8b9bb4] bg-[#020406]/85 px-3 py-1.5 rounded-full border border-[#818cf8]/20">
                      Active base pairs: 9
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#22d3a5]/7 border border-[#22d3a5]/15 text-[#22d3a5]">PCR / qPCR</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#22d3a5]/7 border border-[#22d3a5]/15 text-[#22d3a5]">Cell Culture</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#22d3a5]/7 border border-[#22d3a5]/15 text-[#22d3a5]">SDS-PAGE</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#22d3a5]/7 border border-[#22d3a5]/15 text-[#22d3a5]">ELISA</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#22d3a5]/7 border border-[#22d3a5]/15 text-[#22d3a5]">DNA Extraction</span>
                    
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#818cf8]/7 border border-[#818cf8]/15 text-[#818cf8]">BioPython</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#818cf8]/7 border border-[#818cf8]/15 text-[#818cf8]">Enrichment Analysis</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#818cf8]/7 border border-[#818cf8]/15 text-[#818cf8]">PPI Networks</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#818cf8]/7 border border-[#818cf8]/15 text-[#818cf8]">Molecular Docking</span>
                    
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#f472b6]/7 border border-[#f472b6]/15 text-[#f472b6]">ColabFold</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#f472b6]/7 border border-[#f472b6]/15 text-[#f472b6]">AutoDock Vina</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#f472b6]/7 border border-[#f472b6]/15 text-[#f472b6]">Cytoscape</span>
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-[#f472b6]/7 border border-[#f472b6]/15 text-[#f472b6]">BLAST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="w-full px-6 py-20 border-t border-[#818cf8]/12">
          <div className="max-w-6xl mx-auto">
            <span className="text-xs font-semibold text-[#818cf8] tracking-widest uppercase block mb-3">02 — Projects</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-12">Research <em className="text-[#22d3a5] not-italic">case studies</em></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <div key={index} className={`glass-card rounded-2xl p-6 text-left flex flex-col justify-between relative group overflow-hidden ${index === 1 ? '!border-[#818cf8]/35 !bg-[#818cf8]/5' : (index % 2 === 1 ? '!border-[#818cf8]/15' : '!border-[#22d3a5]/12')}`}>
                  <div>
                    <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${index === 1 ? 'via-[#818cf8]/10' : (index % 2 === 1 ? 'via-[#818cf8]/5' : 'via-[#22d3a5]/5')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-display text-2xl text-[#3d4f66] font-bold">0{index + 1}</span>
                      {project.badge && (
                        <span className={`text-[11px] font-semibold border px-2.5 py-0.5 rounded-md uppercase tracking-wider ${index % 2 === 1 ? 'text-[#818cf8] border-[#818cf8]/25' : 'text-[#22d3a5] border-[#22d3a5]/25'}`}>
                          {project.badge}
                        </span>
                      )}
                    </div>
                    <h3 className={`font-display text-lg md:text-xl font-bold text-white mb-3 leading-snug transition-colors ${index % 2 === 1 ? 'group-hover:text-[#818cf8]' : 'group-hover:text-[#22d3a5]'}`}>{project.title}</h3>
                    <p className="text-[#94a3b8] text-sm leading-relaxed mb-6 font-normal">{project.description}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span key={tag} className={`text-xs font-medium bg-white/[0.03] border text-[#94a3b8] px-2.5 py-1 rounded-md ${index % 2 === 1 ? 'border-[#818cf8]/15' : 'border-[#22d3a5]/15'}`}>{tag}</span>
                      ))}
                    </div>
                    <a href={project.linkHref || "#"} className="border-t border-white/5 pt-4 flex justify-between items-center text-[#94a3b8] group-hover:text-white transition-colors cursor-pointer w-full text-left">
                      <span className="text-xs font-semibold uppercase tracking-wider">{project.linkText || 'Read case study'}</span>
                      <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="w-full px-6 py-20 bg-[#060a10]/90 border-t border-[#818cf8]/12">
          <div className="max-w-4xl mx-auto">
            <span className="text-xs font-semibold text-[#818cf8] tracking-widest uppercase block mb-3">03 — Experience</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-12">Where I've <em className="text-[#818cf8] not-italic">worked</em></h2>
            <div className="timeline">
              {experience.map((exp, index) => (
                <div key={index} className="tl-item group">
                  <div className={`tl-dot ${index % 2 === 1 ? 'blue-dot' : 'green-dot'}`} />
                  <div className="text-xs font-semibold text-[#818cf8]/80 mb-1">{exp.date}</div>
                  <h3 className={`font-display text-xl font-bold text-white mb-0.5 transition-colors ${index % 2 === 1 ? 'group-hover:text-[#818cf8]' : 'group-hover:text-[#22d3a5]'}`}>{exp.role}</h3>
                  <div className={`text-sm font-medium mb-3 ${index % 2 === 1 ? 'text-[#818cf8]' : 'text-[#22d3a5]'}`}>{exp.organization}</div>
                  <p className="text-[#94a3b8] text-sm leading-relaxed font-normal">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PUBLICATIONS */}
        <section id="publications" className="w-full px-6 py-20 border-t border-[#818cf8]/12 bg-[#020406]">
          <div className="max-w-6xl mx-auto">
            <span className="text-xs font-semibold text-[#818cf8] tracking-widest uppercase block mb-3">04 — Publications</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-12">Peer-reviewed <em className="text-[#f472b6] not-italic">work</em></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {publications.map((pub, index) => (
                 <div key={index} className="glass-card aspect-square rounded-3xl p-8 relative group overflow-hidden !border-[#f472b6]/25 !bg-[#f472b6]/3 backdrop-blur-2xl flex flex-col justify-between hover:!border-[#f472b6]/50 hover:!bg-[#f472b6]/5 transition-all duration-500 shadow-2xl">
                  {/* Glass shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#f472b6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="flex flex-col min-h-0">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[11px] font-semibold bg-[#f472b6]/10 border border-[#f472b6]/20 text-[#f472b6] px-2.5 py-0.5 rounded-md uppercase tracking-wider">{pub.year}</span>
                      <span className="text-[11px] font-semibold bg-[#818cf8]/10 border border-[#818cf8]/20 text-[#818cf8] px-2.5 py-0.5 rounded-md uppercase tracking-wider">{pub.journal}</span>
                      <span className="text-[11px] font-semibold bg-[#f472b6]/10 border border-[#f472b6]/20 text-[#f472b6] px-2.5 py-0.5 rounded-md uppercase tracking-wider">{pub.type}</span>
                    </div>
                    <h3 className="font-display text-base md:text-lg font-bold text-white mb-2 leading-snug group-hover:!text-[#f472b6] transition-colors line-clamp-2">{pub.title}</h3>
                    <div className="text-xs font-medium text-[#cbd5e1] mb-0.5">{pub.authors}</div>
                    <div className="text-xs text-[#64748b] mb-3">{pub.citation}</div>
                    
                    {/* Abstract with custom scrollable area to guarantee the card remains a perfect square */}
                    <div className="text-xs md:text-sm leading-relaxed text-[#94a3b8] bg-black/30 p-4 rounded-xl border border-white/5 overflow-y-auto flex-1 mb-4 font-normal">
                      <span className="text-[#f472b6] font-semibold">Abstract:</span> {pub.abstract}
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {pub.keywords.slice(0, 4).map(kw => (
                        <span key={kw} className="text-[11px] font-medium bg-white/5 border border-white/5 text-[#94a3b8] px-2.5 py-0.5 rounded-full">{kw}</span>
                      ))}
                    </div>
                    
                    <div className="border-t border-white/5 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="text-xs text-[#64748b] truncate max-w-[170px]">
                        DOI: <span className="text-[#94a3b8] font-mono">{pub.doi}</span>
                      </div>
                      <a href={pub.link} target="_blank" rel="noopener noreferrer" className="btn-outline px-3.5 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider flex items-center gap-1 hover:!border-[#f472b6] hover:!text-[#f472b6] shrink-0">
                        View Article <span className="text-[9px]">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOOK CHAPTERS */}
        {bookChapters.length > 0 && (
          <section id="book-chapters" className="w-full px-6 py-20 bg-[#060a10]/90 border-t border-[#818cf8]/12">
            <div className="max-w-6xl mx-auto">
              <span className="text-xs font-semibold text-[#818cf8] tracking-widest uppercase block mb-3">05 — Book Chapters</span>
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-12">Published <em className="text-[#22d3a5] not-italic">chapters</em></h2>
              <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
                {bookChapters.map((chapter, index) => (
                  <div key={index} className="book-chapter-card glass-card rounded-3xl p-8 relative group overflow-hidden !border-[#22d3a5]/25 !bg-[#22d3a5]/3 backdrop-blur-2xl hover:!border-[#22d3a5]/50 hover:!bg-[#22d3a5]/5 transition-all duration-500 shadow-2xl">
                    {/* Glass shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#22d3a5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
                      {/* Left: Meta info */}
                      <div className="flex flex-col">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-[11px] font-semibold bg-[#22d3a5]/10 border border-[#22d3a5]/20 text-[#22d3a5] px-2.5 py-0.5 rounded-md uppercase tracking-wider">{chapter.year}</span>
                          <span className="text-[11px] font-semibold bg-[#818cf8]/10 border border-[#818cf8]/20 text-[#818cf8] px-2.5 py-0.5 rounded-md uppercase tracking-wider">{chapter.publisher}</span>
                          <span className="text-[11px] font-semibold bg-[#22d3a5]/10 border border-[#22d3a5]/20 text-[#22d3a5] px-2.5 py-0.5 rounded-md uppercase tracking-wider">Book Chapter</span>
                        </div>
                        
                        <h3 className="font-display text-base md:text-lg font-bold text-white mb-3 leading-snug group-hover:!text-[#22d3a5] transition-colors">{chapter.chapterTitle}</h3>
                        
                        <div className="text-xs font-medium text-[#cbd5e1] mb-1">{chapter.authors}</div>
                        {chapter.editors && (
                          <div className="text-xs text-[#64748b] mb-1">Eds. {chapter.editors}</div>
                        )}
                        
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider shrink-0 mt-0.5">Book:</span>
                            <span className="text-xs text-[#94a3b8] italic">{chapter.bookTitle}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">Pages:</span>
                            <span className="text-xs text-[#94a3b8]">{chapter.pages}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">ISBN:</span>
                            <span className="font-mono text-xs text-[#22d3a5]">{chapter.isbn}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {chapter.keywords.map(kw => (
                            <span key={kw} className="text-[11px] font-medium bg-white/5 border border-white/5 text-[#94a3b8] px-2.5 py-0.5 rounded-full">{kw}</span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right: Abstract */}
                      <div className="flex flex-col">
                        <div className="text-xs md:text-sm leading-relaxed text-[#94a3b8] bg-black/30 p-5 rounded-xl border border-white/5 overflow-y-auto flex-1 font-normal">
                          <span className="text-[#22d3a5] font-semibold">Abstract:</span> {chapter.abstract}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" className="w-full px-6 py-20 bg-[#060a10]/90 border-t border-[#818cf8]/12">
          <div className="max-w-6xl mx-auto">
            <span className="text-xs font-semibold text-[#818cf8] tracking-widest uppercase block mb-3">06 — Contact</span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">Build something at the <em className="text-[#818cf8] not-italic">frontier</em></h2>
                <p className="text-[#94a3b8] text-sm md:text-base leading-relaxed mb-8 max-w-lg font-normal">
                  {contact?.subtitle || "Open to research collaborations, internships, and full-time roles in biotech, genomics, or computational biology. Based in India — open to relocate."}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contact?.links.map((link, index) => (
                    <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 p-3 rounded-xl bg-white/[0.01] border border-white/5 text-[#8b9bb4] hover:text-white transition-all duration-300 ${index % 2 === 1 ? 'hover:border-[#818cf8]/40 hover:bg-[#818cf8]/5' : 'hover:border-[#22d3a5]/30 hover:bg-[#22d3a5]/5'}`}>
                      <div className={`w-8 h-8 rounded-lg font-display text-xs font-bold flex items-center justify-center shrink-0 ${index % 2 === 1 ? 'bg-[#818cf8]/10 text-[#818cf8]' : 'bg-[#22d3a5]/10 text-[#22d3a5]'}`}>
                        {link.iconLabel || '@'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">{link.label}</span>
                        <span className="text-xs md:text-sm font-medium text-white truncate">{link.href.replace('mailto:', '').replace('https://', '').replace('http://', '')}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Terminal emulator */}
              <div className="term-card">
                <div className="term-header">
                  <div className="term-dot bg-[#ff5f57]" />
                  <div className="term-dot bg-[#ffbd2e]" />
                  <div className="term-dot bg-[#28c940]" />
                  <span className="ml-2 font-mono text-xs text-[#64748b]">jayant@biolab ~ researcher.json</span>
                </div>
                <div className="term-body text-[#8b9bb4] font-mono text-xs leading-relaxed space-y-1">
                  <div><span className="text-[#22d3a5]">▸</span> <span className="text-white">cat researcher.json</span></div>
                  <div className="h-2" />
                  <div className="text-[#3d4f66]">{'{'}</div>
                  <div className="pl-4"><span className="text-[#818cf8]">"name"</span>: <span className="text-[#f472b6]">"Jayant Kushwaha"</span>,</div>
                  <div className="pl-4"><span className="text-[#818cf8]">"degree"</span>: <span className="text-[#f472b6]">"M.Sc. Biotechnology"</span>,</div>
                  <div className="pl-4"><span className="text-[#818cf8]">"location"</span>: <span className="text-[#f472b6]">"India"</span>,</div>
                  <div className="pl-4">
                    <span className="text-[#818cf8]">"focus"</span>: [
                      <div className="pl-4 text-[#f472b6]">"Computational Genomics",</div>
                      <div className="pl-4 text-[#f472b6]">"Structural Biology",</div>
                      <div className="pl-4 text-[#f472b6]">"Drug Discovery",</div>
                      <div className="pl-4 text-[#f472b6]">"Cancer Research"</div>
                    ]
                  </div>
                  <div className="pl-4"><span className="text-[#818cf8]">"publications"</span>: <span className="text-[#22d3a5] font-bold">2</span>,</div>
                  <div className="pl-4"><span className="text-[#818cf8]">"open_to_work"</span>: <span className="text-[#4ade80]">true</span></div>
                  <div className="text-[#3d4f66]">{'}'}</div>
                  <div className="h-2" />
                  <div><span className="text-[#22d3a5]">▸</span> <span className="text-[#22d3a5] blink">█</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full py-8 px-6 border-t border-[#22d3a5]/12 flex flex-col md:flex-row justify-between items-center gap-4 text-center bg-[#020406]">
          <span className="font-display text-base font-bold text-white">{logo?.name}</span>
          <span className="text-[#64748b] text-xs font-normal">© 2026 — built at the frontier of biology &amp; code</span>
          <span className="text-xs font-medium text-[#8b9bb4] uppercase tracking-wider">Biotech × Bioinformatics</span>
        </footer>
      </div>
    </div>
  );
};

export { PortfolioPage };
