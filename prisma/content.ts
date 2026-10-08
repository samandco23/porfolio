/** Supplied profile content. No inferred proficiency, dates, links or results. */
export const profileContent = {
  fullName: "Berlin Koueni",
  alias: "theghostshell",
  siteName: "BerlinKoueni.tech",
  siteUrl: "https://berlinkoueni.tech",
  title: "Full-Stack Software Engineer",
  specialties: "Cybersecurity · Cloud · DevOps · Systems & Networks",
  tagline: "Building software. Designing architectures. Securing systems.",
  shortBio: "I design, build and secure modern digital solutions — from scalable web and mobile applications to APIs, cloud infrastructure and secure systems.",
  longBio: `## À propos

Je suis un **Full-Stack Software Engineer** avec un profil transversal combinant développement logiciel, architecture, cybersécurité, administration systèmes et réseaux, Cloud et DevOps.

Je conçois et développe des applications web et mobiles modernes, des APIs RESTful et des architectures évolutives. Je m'intéresse également à la sécurisation des applications, des systèmes et des infrastructures.

### Build · Secure · Scale

Mon approche couvre l'ensemble du cycle de vie d'une solution : de la conception et du développement jusqu'au déploiement, à l'infrastructure et à la sécurité.

### Software Engineering & Architecture

Je travaille sur des applications web et mobiles, l'authentification, les autorisations, les intégrations d'APIs et la logique métier. Je m'intéresse à la modélisation des données, aux architectures modulaires, multi-tenant, SaaS et ERP, ainsi qu'à la documentation et à la sécurisation des APIs.

Les besoins métiers explorés comprennent les plateformes de réservation, les applications médicales, l'e-commerce, la gestion scolaire, les plateformes de services et les outils internes.

### Cloud, DevOps & Systems

Je m'intéresse à l'automatisation du cycle **Development → Testing → Build → Deployment**, aux environnements Docker, aux pipelines CI/CD et au déploiement d'applications sur des serveurs Linux et Oracle Cloud.

Mon parcours inclut l'administration Linux, Windows Server 2019, Active Directory, DNS, DHCP, les permissions et les réseaux.

### Cybersecurity

La cybersécurité constitue une deuxième dimension importante de mon profil : sécurité des applications web, des APIs, des systèmes et des infrastructures, contrôle d'accès, secure coding, évaluation des vulnérabilités et Security by Design.

J'explore également la reconnaissance, l'énumération, les tests de sécurité et les environnements de laboratoire et CTF.

### UI / UX & Product Design

Je travaille aussi sur la conception de produits numériques : wireframes, prototypes, parcours utilisateurs, interfaces responsive, design systems, identité visuelle et White Label.

### AI-Assisted Engineering

J'utilise Claude Code, OpenAI Codex et ChatGPT comme outils d'ingénierie pour explorer des architectures, générer et refactorer du code, déboguer, relire, documenter et effectuer des recherches techniques.`,
  email: "berlinkoueni25@gmail.com", phone: "+237653021373", location: "Douala, Cameroun",
  available: false,
  seoTitle: "Berlin Koueni — Full-Stack Software Engineer",
  seoDescription: "Berlin Koueni : développement web et mobile, architecture logicielle, cybersécurité, Cloud et DevOps. Build · Secure · Scale.",
};

export const skillGroups = {
  LANGUAGES: "PHP|JavaScript|TypeScript|Python|C|SQL|Bash / Shell|HTML5|CSS3",
  FRONTEND: "React|Next.js|TypeScript|JavaScript|Tailwind CSS|Vite|Responsive Design|Component-Based Architecture|UI Integration|Web Performance|Zustand|React Query",
  BACKEND: "Laravel|PHP|Node.js|REST APIs|MVC Architecture|Authentication|Authorization|Middleware|API Integration|Business Logic|CRUD Systems|Email Verification|File & Image Management",
  MOBILE: "React Native|Expo|Android|iOS|Push Notifications|Mobile API Integration",
  DATABASE: "MySQL|PostgreSQL|SQL|PDO|Database Design|Data Modeling|Database Relationships|Migrations|Query Design|Multi-Tenant Architecture",
  API: "RESTful APIs|API Architecture|API Security|API Documentation|Swagger / OpenAPI|Postman|Authentication|Authorization|Endpoint Design|API Integration",
  ARCHITECTURE: "MVC|REST Architecture|Client / Server Architecture|Component Architecture|Modular Architecture|Multi-Tenant Architecture|SaaS Architecture|ERP Architecture|API Architecture|Database Architecture|Secure Software Architecture|Infrastructure Architecture",
  DEVOPS: "Docker|Docker Compose|Containerization|Multi-container Applications|Development Environments|Application Deployment|Jenkins|GitLab CI/CD|Git workflows|Automated Build|Deployment Pipelines",
  CLOUD: "Oracle Cloud|Cloud Architecture|Cloud Deployment|Linux Servers|Nginx|Reverse Proxy|Web Server Configuration|Application Deployment|Infrastructure Design",
  SYSTEMS: "Linux|Ubuntu Linux|Bash|Shell scripting|SSH|Permissions|Processes|Package management|Networking|Server administration|Windows Server 2019|Active Directory|Domain Controller|Organizational Units|User & Group Management|Group Policy|DHCP|DNS|File Sharing|Roaming Profiles|Network Drive Mapping",
  NETWORKING: "TCP/IP|IPv4|IPv6|DNS|DHCP|HTTP / HTTPS|SSH|FTP|Client / Server Architecture|Network Administration|Network Troubleshooting|Network Security",
  SECURITY: "Ethical Hacking|Penetration Testing|Web Application Security|Network Security|System Security|Secure Coding|Vulnerability Assessment|Security Testing|Authentication Security|Access Control|API Security|Infrastructure Security|Zero Trust|Security by Design|Reconnaissance|Information Gathering|Network Scanning|Enumeration|Web Security Testing|Network Security Testing|Security Labs|CTF / Practical Security|Nmap|Wireshark|Netcat|Burp Suite|Nikto|Gobuster|SQLMap|Metasploit|Hydra|John the Ripper|Hashcat|Aircrack-ng|Kali Linux",
  DESIGN: "Figma|Adobe XD|Canva|UI Design|UX Design|Wireframing|Prototyping|Design Systems|Responsive Design|User Flow|Interface Design|Brand Identity|White Label Design",
  AI: "Claude Code|OpenAI Codex|ChatGPT|Code Generation|Code Refactoring|Debugging|Code Review|Documentation|Architecture Exploration|Developer Productivity|Technical Research",
  TOOLS: "Visual Studio Code|Git|GitHub|GitLab|Postman|Composer|npm|Vite|Chrome DevTools|VirtualBox|VMware",
} as const;

const mainStack = [
  ["LANGUAGES", "PHP"], ["BACKEND", "Laravel"], ["LANGUAGES", "TypeScript"],
  ["FRONTEND", "React"], ["FRONTEND", "Next.js"], ["MOBILE", "React Native"],
  ["BACKEND", "Node.js"], ["DATABASE", "MySQL"], ["DATABASE", "PostgreSQL"],
  ["DEVOPS", "Docker"], ["TOOLS", "Git"], ["SYSTEMS", "Linux"], ["CLOUD", "Oracle Cloud"],
];
export const skillsContent = Object.entries(skillGroups).flatMap(([category, names]) =>
  names.split("|").map((name, order) => ({
    name, category: category as keyof typeof skillGroups, level: null, isVisible: true,
    featured: mainStack.some(([group, skill]) => group === category && skill === name), order,
  })),
);

const project = (title: string, slug: string, subtitle: string, description: string, tags: string[], work: string[], featured = false) => ({
  title, slug, description, tags: JSON.stringify(tags), featured, status: "PUBLISHED" as const,
  content: `## ${subtitle}\n\n${description}\n\n### Travaux et domaines explorés\n\n${work.map((line) => `- ${line}`).join("\n")}`,
});
export const projectsContent = [
  project("Guidtwam", "guidtwam", "Travel & Transportation Platform", "Plateforme digitale de réservation de billets de transport interurbain, avec fonctionnalités web et mobiles, paiement et notifications.", ["Booking", "Travel Tech", "Payment", "API", "Mobile", "Notifications"], ["Architecture et découpage des APIs", "Sécurisation des APIs", "Intégration du paiement Enkap", "Documentation Swagger", "Configuration des notifications push Expo", "Développement de fonctionnalités web et mobiles"], true),
  project("FON KOUENI ERP", "fon-koueni-erp", "Multi-Tenant ERP", "Conception d'une architecture ERP destinée à la gestion d'une activité de distribution de boissons, avec une approche multi-tenant et White Label.", ["ERP", "SaaS", "Multi-Tenant", "Architecture", "White Label"], ["Architecture multi-tenant", "Modélisation du système", "Spécifications d'infrastructure", "Réflexion sur l'architecture ERP", "Conception de la charte graphique", "Stratégie White Label"], true),
  project("ERS & FILS CLEANING", "ers-fils-cleaning", "Service Business Platform", "Conception d'un portail web destiné à une entreprise spécialisée dans les services de nettoyage.", ["Web Design", "UI/UX", "Business Platform", "Prototyping"], ["Conception du portail web", "Design des interfaces", "Prototypage des parcours utilisateurs"]),
  project("OVNI SOLUTIONS TI", "ovni-solutions-ti", "Cybersecurity & Cloud Platform", "Conception d'une architecture web pour une activité orientée conseil en cybersécurité, avec exploration des concepts Cloud, SaaS et Zero Trust.", ["Zero Trust", "SaaS", "Cloud", "Cybersecurity"], ["Conception de l'architecture web", "Étude des concepts Zero Trust, SaaS et Cloud"]),
  project("IDEIA Agency", "ideia-agency", "Digital Marketing Platform", "Conception d'une plateforme web pour une agence spécialisée dans le marketing digital et le media buying.", ["Digital Marketing", "Media Buying", "Web Design", "UI/UX"], ["Conception de la plateforme web", "Design des interfaces et des parcours utilisateurs"]),
  project("Ekosse", "ekosse", "Medical Application", "Projet d'application médicale développé dans le cadre de mon parcours de formation, autour des fonctionnalités web, des données et de l'authentification.", ["Healthcare", "Web Application", "Database", "Authentication"], ["Développement d'une application médicale", "Base de données", "Authentification"]),
  project("E-Commerce Platform", "e-commerce-platform", "E-Commerce Platform", "Conception d'une plateforme e-commerce avec catalogue produits, comptes utilisateurs, administration et gestion des images.", ["Laravel", "PHP", "MySQL", "Tailwind CSS", "JavaScript", "E-Commerce"], ["Gestion des produits, catégories et utilisateurs", "Authentification, administration et CRUD", "Upload multiple et prévisualisation des images", "Interface front-office", "Slider produits"], true),
  project("Banking Platform", "banking-platform", "Banking Platform", "Conception d'une application de gestion bancaire avec authentification, administration, gestion des utilisateurs et des opérations.", ["Authentication", "Administration", "Database", "Security"], ["Inscription, authentification et vérification email", "Gestion des utilisateurs", "Administration et super administration", "Gestion des opérations", "Sécurité et base de données"]),
  project("School Management Platform", "school-management-platform", "School Management Platform", "Conception d'une plateforme de gestion d'établissements scolaires avec Laravel et une interface Tailwind CSS.", ["Laravel", "Tailwind CSS", "Authentication", "Administration"], ["Authentification", "Administration et super administration", "Gestion des utilisateurs et des établissements", "Architecture Laravel et interface Tailwind CSS"]),
  project("IT Infrastructure", "it-infrastructure", "Windows Server Infrastructure", "Projet d'infrastructure Windows Server 2019 avec Active Directory, services réseau, stratégies de groupe et gestion des accès.", ["Windows Server 2019", "Active Directory", "DHCP", "DNS", "Networking"], ["Active Directory et Domain Controller", "DHCP", "Utilisateurs, groupes et Organizational Units", "Group Policies et profils itinérants", "Restrictions d'accès, mappage réseau et permissions"]),
].map((entry, order) => ({ ...entry, order }));
