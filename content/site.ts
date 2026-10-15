import type { Site } from "@/types/content";

export const site: Site = {
  name: "Vandit Sharma",
  role: "Data Engineer",
  headline: "I turn raw data\ninto working systems.",
  subhead:
    "Computer Science graduate building data pipelines, analytics and ML workflows with Python and SQL — here to learn fast and grow with a great team.",
  location: "Jaipur, India",
  email: "vanditsharma2711@gmail.com",
  // Set automatically by the GitHub Actions workflow; edit if you add a custom domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://YOUR-USERNAME.github.io",
  metaDescription:
    "Vandit Sharma is a Computer Science graduate and Data Engineer building data pipelines, analytics and machine-learning workflows with Python, SQL and Linux. Immediate joiner, open to relocate.",
  socials: {
    linkedin: "https://www.linkedin.com/in/vanditsharma",
    // github: "https://github.com/YOUR-USERNAME",
  },
  nav: [
    { label: "Impact", href: "#impact" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Work", href: "#work" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],
};
