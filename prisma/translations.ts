import { profileContent, projectsContent } from "./content";

const englishBiography = `## About me

I am a **Full-Stack Software Engineer** with a multidisciplinary background in software development, architecture, cybersecurity, systems and network administration, Cloud and DevOps.

I design and develop modern web and mobile applications, RESTful APIs and scalable architectures. I am also interested in securing applications, systems and infrastructure.

### Build · Secure · Scale

My approach covers the entire lifecycle of a solution: from design and development through deployment, infrastructure and security.

### Software Engineering & Architecture

I work on web and mobile applications, authentication, authorization, API integrations and business logic. My interests include data modeling, modular, multi-tenant, SaaS and ERP architectures, as well as API documentation and security.

The business needs explored include booking platforms, medical applications, e-commerce, school management, service platforms and internal tools.

### Cloud, DevOps & Systems

I am interested in automating the **Development → Testing → Build → Deployment** cycle, Docker environments, CI/CD pipelines and application deployment on Linux servers and Oracle Cloud.

My background includes Linux administration, Windows Server 2019, Active Directory, DNS, DHCP, permissions and networking.

### Cybersecurity

Cybersecurity is another important dimension of my profile: security of web applications, APIs, systems and infrastructure, access control, secure coding, vulnerability assessment and Security by Design.

I also explore reconnaissance, enumeration, security testing, lab environments and CTFs.

### UI / UX & Product Design

I also work on digital product design: wireframes, prototypes, user flows, responsive interfaces, design systems, brand identity and White Label.

### AI-Assisted Engineering

I use Claude Code, OpenAI Codex and ChatGPT as engineering tools to explore architectures, generate and refactor code, debug, review, document and carry out technical research.`;
const profileTranslations = {
  "fr:title": "Ingénieur logiciel Full-Stack",
  "fr:specialties": "Cybersécurité · Cloud · DevOps · Systèmes & Réseaux",
  "fr:tagline": "Développer des logiciels. Concevoir des architectures. Sécuriser des systèmes.",
  "fr:shortBio": "Je conçois, développe et sécurise des solutions numériques modernes : applications web et mobiles évolutives, APIs, infrastructure Cloud et systèmes sécurisés.",
  "fr:seoTitle": "Berlin Koueni — Ingénieur logiciel Full-Stack",
  "en:longBio": englishBiography,
  "en:seoDescription": "Berlin Koueni: web and mobile development, software architecture, cybersecurity, Cloud and DevOps. Build · Secure · Scale.",
};
const englishProjects: Record<string, { description: string; work: string[] }> = {
  guidtwam: { description: "A digital booking platform for intercity transportation tickets, with web and mobile features, payments and notifications.", work: ["API architecture and endpoint organization", "API security", "Enkap payment integration", "Swagger documentation", "Expo push notification configuration", "Web and mobile feature development"] },
  "fon-koueni-erp": { description: "Design of an ERP architecture for a beverage distribution business, using a multi-tenant and White Label approach.", work: ["Multi-tenant architecture", "System modeling", "Infrastructure specifications", "ERP architecture exploration", "Visual identity design", "White Label strategy"] },
  "ers-fils-cleaning": { description: "Design of a web portal for a business specializing in cleaning services.", work: ["Web portal design", "Interface design", "User flow prototyping"] },
  "ovni-solutions-ti": { description: "Design of a web architecture for cybersecurity consulting, exploring Cloud, SaaS and Zero Trust concepts.", work: ["Web architecture design", "Exploration of Zero Trust, SaaS and Cloud concepts"] },
  "ideia-agency": { description: "Design of a web platform for an agency specializing in digital marketing and media buying.", work: ["Web platform design", "Interface and user flow design"] },
  ekosse: { description: "A medical application developed as part of my training, covering web features, data and authentication.", work: ["Medical application development", "Database", "Authentication"] },
  "e-commerce-platform": { description: "Design of an e-commerce platform with a product catalog, user accounts, administration and image management.", work: ["Product, category and user management", "Authentication, administration and CRUD", "Multiple image upload and preview", "Front-office interface", "Product slider"] },
  "banking-platform": { description: "Design of a banking management application with authentication, administration, user management and operations.", work: ["Registration, authentication and email verification", "User management", "Administration and super administration", "Operations management", "Security and database"] },
  "school-management-platform": { description: "Design of a school management platform using Laravel and a Tailwind CSS interface.", work: ["Authentication", "Administration and super administration", "User and school management", "Laravel architecture and Tailwind CSS interface"] },
  "it-infrastructure": { description: "A Windows Server 2019 infrastructure project with Active Directory, network services, group policies and access management.", work: ["Active Directory and Domain Controller", "DHCP", "Users, groups and Organizational Units", "Group Policies and roaming profiles", "Access restrictions, network drive mapping and permissions"] },
};
/** Populate translations only when the source still matches the supplied seed. */
export function seedTranslations(profile: Record<string, unknown> | null, projects: { id: string; slug: string; description: string; content: string }[]) {
  const output: Record<string, string> = {};
  for (const [entry, value] of Object.entries(profileTranslations)) {
    const [locale, field] = entry.split(":");
    if (profile?.[field] === (profileContent as Record<string, unknown>)[field]) output[`${locale}:entity.profile.default.${field}`] = value;
  }
  for (const project of projects) {
    const original = projectsContent.find((row) => row.slug === project.slug);
    const translation = englishProjects[project.slug];
    if (!original || !translation) continue;
    if (project.description === original.description) output[`en:entity.project.${project.id}.description`] = translation.description;
    if (project.content === original.content) {
      const subtitle = original.content.split("\n")[0];
      output[`en:entity.project.${project.id}.content`] = `${subtitle}\n\n${translation.description}\n\n### Work and areas explored\n\n${translation.work.map((line) => `- ${line}`).join("\n")}`;
    }
  }
  return output;
}
