import { Github, Linkedin, Twitter, Mail, Globe, Link2 } from "lucide-react";

export const SOCIAL_ICON_KEYS = ["github", "linkedin", "twitter", "mail", "globe", "link"] as const;

export const SOCIAL_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
  globe: Globe,
  link: Link2,
};
