import { PortfolioPage } from "@/components/ui/portfolio-landing-page";
import type { PortfolioPageProps } from "@/components/ui/portfolio-landing-page";

const customPortfolioData: PortfolioPageProps = {
  logo: {
    initials: "JK",
    name: "Jayant Kushwaha",
  },
  navLinks: [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Publications', href: '#publications' },
    { label: 'Book Chapters', href: '#book-chapters' },
    { label: 'Contact', href: '#contact' },
  ],
  resume: {
    label: 'View CV',
    onClick: () => {
      window.open(import.meta.env.BASE_URL + 'CV.pdf', '_blank');
    },
  },
  hero: {
    titleLine1: 'Biotechnology × Bioinformatics',
    titleLine2Gradient: 'Kushwaha',
    subtitle: 'Wet lab hands. Dry lab mind.',
  },
  ctaButtons: {
    primary: {
      label: 'View Projects',
      onClick: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    secondary: {
      label: 'Get In Touch',
      onClick: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
  },
  projects: [
    {
      title: 'Green Synthesis of ZnO Nanoparticles from Banana Peel Extract & Agricultural Application',
      badge: 'B.Sc. Dissertation',
      description: 'Synthesized ZnO nanoparticles via bottom-up green approach. Characterized by UV-Vis (SPR ~362nm), FTIR, SEM. Validated antibacterial activity against S. aureus (2cm zone at 15mg/ml). Sample 1 raised plant protein +72% and total length +37% over control by Day 25.',
      tags: ['ZnO-NP Synthesis', 'UV-Vis', 'FTIR', 'SEM', 'Antimicrobial Assay', 'Folin-Lowry'],
      linkText: 'Read case study',
      linkHref: 'project-zno-nanoparticles.html',
    },
    {
      title: 'Structure-Based Virtual Screening of Inhibitors Against Monkeypox Virus Proteins',
      badge: 'Bioinformatics',
      description: 'Modeled MPXV proteins using ColabFold (AlphaFold2). Retrieved ligands from PubChem, performed virtual screening with AutoDock Vina. Analyzed protein-ligand interactions via PyMOL and Discovery Studio.',
      tags: ['ColabFold', 'AutoDock Vina', 'PyMOL', 'Discovery Studio'],
      linkText: 'Case study coming soon',
      linkHref: '#',
    },
    {
      title: 'Systems-Level Analysis of Cervical Cancer Dysregulated Genes via Computational Approaches',
      badge: 'Systems Biology',
      description: 'Assembled a dysregulated gene set from curated literature. Mapped to oncogenic pathways via Enrichr. Built PPI networks in STRING and visualized hub genes in Cytoscape using degree and betweenness centrality.',
      tags: ['PubMed', 'Enrichr', 'STRING', 'Cytoscape'],
      linkText: 'M.Sc. Dissertation',
      linkHref: '#',
    },
    {
      title: 'Rohituka (A. polystachya) as a Source of ALK-Targeting Phytoconstituents: Molecular Docking & Dynamics',
      badge: 'Molecular Docking & MD',
      description: 'Docked 39 A. polystachya phytoconstituents into the ALK ATP-binding site (PDB 4Z55) via Glide XP. Rohitukine ranked highest (−8.28 kcal/mol) with conserved H-bonds to MET1199. MD simulation confirmed stable binding (89.25% H-bond occupancy, MM-PBSA ΔG = −14.50 kcal/mol) — first report linking a specific Rohituka constituent to direct ALK interaction in NSCLC.',
      tags: ['Glide XP Docking', 'MD Simulation', 'MM-PBSA', 'PyMOL', 'Lipinski RO5', 'PDB 4Z55'],
      linkText: 'Case study coming soon',
      linkHref: '#',
    },
  ],
  stats: [
    { value: '4', label: 'Projects' },
    { value: '10+', label: 'Lab Techniques' },
    { value: '2', label: 'Publications' },
    { value: '1', label: 'Book Chapter' },
    { value: '3', label: 'Languages' },
  ],
  experience: [
    {
      role: 'Master\'s Dissertation',
      organization: 'ICMR — National Institute of Cancer Prevention and Research',
      date: 'Jan — Apr 2026',
      description: 'Curated literature-derived gene expression data from cervical cancer studies and compiled a dysregulated gene set for downstream computational analysis. Ran functional enrichment via Enrichr mapping genes to oncogenic pathways. Built PPI networks in STRING and visualized in Cytoscape to identify central network nodes by degree and betweenness centrality.',
    },
    {
      role: 'Industry Internship',
      organization: 'AGRI SEARCH (INDIA) PVT LTD',
      date: 'Jan 23 — Jan 28, 2023',
      description: 'Observed manufacturing processes and water quality assessment protocols. Studied QC/QA techniques in industrial biotech. Experienced fermentation process operations and bio-fertilizer preparation and testing.',
    },
  ],
  publications: [
    {
      year: '2025',
      journal: 'Virus Genes · Springer Nature',
      type: 'Review Article',
      title: 'Targeting Monkeypox Virus (MPXV): Strategies for Molecular Docking Studies on Protein Inhibition',
      authors: 'Kushwaha J.M., Rani M.S.S. & Singh S.',
      citation: 'Vol. 61, pp. 523–534 · June 2025',
      abstract: 'A comprehensive review of molecular docking strategies for identifying protein inhibition approaches against MPXV. Examines viral protein architecture and host-cell interactions to provide a framework for antiviral therapy development.',
      keywords: ['Monkeypox', 'Molecular Docking', 'AutoDock Vina', 'AlphaFold2', 'Antiviral', 'Protein Inhibition'],
      doi: '10.1007/s11262-025-02171-1',
      link: 'https://doi.org/10.1007/s11262-025-02171-1',
    },
    {
      year: '2026',
      journal: 'Crit Rev Oncol Hematol · Elsevier',
      type: 'Review Article',
      title: 'Lung Cancer in Non-Smokers: Molecular Mechanisms, Risk Factors, and Emerging Therapeutic Strategies',
      authors: 'Kushwaha J.M. et al.',
      citation: 'Critical Reviews in Oncology/Hematology · 2026',
      abstract: 'A review examining the distinct molecular landscape of lung cancer arising in never-smokers, covering EGFR/ALK/ROS1 driver mutations, environmental risk factors, and targeted therapy approaches for this epidemiologically important subgroup.',
      keywords: ['Lung Cancer', 'Non-Smokers', 'EGFR', 'ALK', 'Targeted Therapy', 'Oncology'],
      doi: '10.1016/j.critrevonc.2026.105436',
      link: 'https://doi.org/10.1016/j.critrevonc.2026.105436',
    },
  ],
  bookChapters: [
    {
      year: '2026',
      bookTitle: 'Organic Agriculture and Sustainable Farming Systems',
      publisher: 'Learning Media Publication, Meerut',
      chapterTitle: 'Next-Generation Biotechnology for Jaivik Kheti: Biofertilizers & Plant Growth Promoters',
      authors: 'Singh S.*, Kushwaha J.M.',
      editors: 'Hasan F., Singh A.',
      pages: 'pp. 15–19',
      abstract: 'Reviews biofertilizers and plant growth-promoting microorganisms (PGPR, mycorrhizal fungi, endophytes) as biotechnology solutions for India\'s Jaivik Kheti organic farming movement. Covers next-generation formulations — multi-species microbial consortia, nano-encapsulation, and genome-informed strain selection — alongside emerging tools like metagenomics, CRISPR editing, and AI-driven discovery. Also highlights Indian government initiatives (PKVY, NMNF) and quality-control challenges across manufacturers.',
      keywords: ['Biofertilizers', 'PGPR', 'Microbial Consortia', 'Sustainable Agriculture', 'Metagenomics'],
      isbn: '978-81-69199-14-8',
    },
  ],
  contact: {
    heading: 'Build something at the frontier',
    subtitle: 'Open to research collaborations, internships, and full-time roles in biotech, genomics, or computational biology. Based in India — open to relocate.',
    links: [
      { label: 'Email', href: 'mailto:work.jayant10@gmail.com', iconLabel: '@' },
      { label: 'GitHub', href: 'https://github.com/jayant10014', iconLabel: 'gh' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jayantkushwaha10', iconLabel: 'in' },
      { label: 'ResearchGate', href: 'https://www.researchgate.net/profile/Jayant-Kushwaha-3', iconLabel: 'RG' },
      { label: 'ORCID', href: 'https://orcid.org/0009-0000-8320-9034', iconLabel: 'iD' },
      { label: 'Web of Science', href: 'https://www.webofscience.com/wos/author/record/NVM-0932-2025', iconLabel: 'WoS' },
      { label: 'Scopus', href: 'http://www.scopus.com/inward/authorDetails.url?authorID=59959633300', iconLabel: 'Sc' },
    ],
  },
  showAnimatedBackground: true,
};

const PortfolioDataProvider = () => {
  return <PortfolioPage {...customPortfolioData} />;
};

export { PortfolioDataProvider };
