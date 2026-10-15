/* ----------------------------------------------------------------------------
   Content schema — the single, typed contract for all site data.
   Adding an entry anywhere = append one object to the relevant array in
   /content. No component or layout changes required. This same schema is what
   a future inline edit-mode will read from / write to.
---------------------------------------------------------------------------- */

export interface NavItem {
  label: string;
  href: string; // in-page anchor, e.g. "#work"
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface Site {
  name: string;
  role: string;
  /** Hero headline (can include the gradient word, see Hero). */
  headline: string;
  /** Hero supporting line. */
  subhead: string;
  location?: string;
  email: string;
  url: string;
  metaDescription: string;
  socials: {
    linkedin: string;
    github?: string;
  };
  nav: NavItem[];
}

export interface Metric {
  /** Numeric value to count up to. */
  value: number;
  /** Prefix/suffix rendered around the number, e.g. "~", "x", "%". */
  prefix?: string;
  suffix?: string;
  /** Decimal places to display (e.g. 1.5x → decimals: 1). */
  decimals?: number;
  label: string;
}

export interface Experience {
  id: string;
  company: string;
  team?: string;
  role: string;
  period: string;
  current?: boolean;
  location?: string;
  summary: string;
  highlights: string[];
  stack?: string[];
}

export type ProjectKind = "case-study" | "build";

export interface Project {
  slug: string;
  kind: ProjectKind;
  title: string;
  company?: string;
  year?: string;
  oneLiner: string;
  problem: string;
  approach: string[];
  /** Headline outcomes — reuses Metric for the animated detail-page stats. */
  impact: Metric[];
  tags: string[];
  links?: SocialLink[];
  featured?: boolean;
  /** Optional longer-form paragraphs for the /work/[slug] detail page. */
  body?: string[];
}

export interface SkillGroup {
  name: string;
  /** Lucide icon name (resolved in the Skills section). */
  icon: string;
  items: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year?: string;
  verifyUrl?: string;
}

export interface Education {
  degree: string;
  institution: string;
  detail?: string;
  period?: string;
}
