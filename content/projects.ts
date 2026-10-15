import type { Project } from "@/types/content";

/**
 * Written from résumé bullets only — review the `body` paragraphs and add
 * GitHub / live links (`links`) and any extra detail you want to show.
 */
export const projects: Project[] = [
  {
    slug: "quickcompare",
    kind: "build",
    title: "QuickCompare",
    year: "2025",
    featured: true,
    oneLiner:
      "A real-time grocery price comparison platform that fetches live prices from Blinkit and Zepto — no paid APIs.",
    problem:
      "Quick-commerce prices change constantly and differ between apps, so finding the cheapest basket means switching between apps and adding things up by hand.",
    approach: [
      "Built a real-time web app with JavaScript, Puppeteer and WebSockets to fetch live prices from Blinkit and Zepto without paid APIs.",
      "Created a dynamic dashboard where users build a unified cart and compare totals side by side.",
      "Surfaced the maximum possible savings across both platforms for the same basket.",
    ],
    impact: [],
    tags: ["JavaScript", "Puppeteer", "WebSockets", "Web Scraping", "Dashboard"],
    // links: [{ label: "View on GitHub", href: "https://github.com/YOUR-USERNAME/QuickCompare" }],
    body: [
      "QuickCompare pulls live prices from two quick-commerce apps and lets you assemble one cart to see which platform is cheaper for the whole basket.",
      "It uses Puppeteer to collect prices and WebSockets to push updates to the dashboard in real time, which avoids paid price APIs entirely.",
    ],
  },
  {
    slug: "crop-classification",
    kind: "build",
    title: "ML Crop Classification",
    company: "DOIT&C · Bhamashah State Data Centre",
    year: "2024",
    featured: true,
    oneLiner:
      "A machine-learning prototype that classifies crops with 90% accuracy, built during a government data-centre internship.",
    problem:
      "Government digital platforms needed a way to explore automated crop classification from data rather than relying on manual identification.",
    approach: [
      "Built the prototype in Python using TensorFlow and scikit-learn.",
      "Trained and evaluated the model to reach 90% accuracy.",
      "Worked with stakeholders so the prototype fit real platform requirements.",
    ],
    impact: [{ value: 90, suffix: "%", label: "classification accuracy" }],
    tags: ["Python", "TensorFlow", "scikit-learn", "Machine Learning"],
    body: [
      "This prototype was part of my Software Developer internship at DOIT&C (Bhamashah State Data Centre), alongside testing work on government platforms.",
      "Using Python, TensorFlow and scikit-learn, it reached 90% accuracy on crop classification.",
    ],
  },
  {
    slug: "platform-test-automation",
    kind: "case-study",
    title: "Government Platform Test Automation",
    company: "DOIT&C · Bhamashah State Data Centre",
    year: "2024",
    oneLiner:
      "Executed 500+ Selenium test cases across government digital platforms and validated 15+ critical issues.",
    problem:
      "Government digital platforms had to be reliable and match user requirements before going live, and manual checking couldn't cover everything.",
    approach: [
      "Wrote and ran Selenium test cases covering the platforms' key flows.",
      "Identified and validated critical issues, using Postman for API checks.",
      "Collaborated with stakeholders to confirm features on 8+ platforms matched requirements.",
      "Documented 5 government workflows and project progress in JIRA.",
    ],
    impact: [
      { value: 500, suffix: "+", label: "Selenium test cases" },
      { value: 15, suffix: "+", label: "critical issues validated" },
      { value: 8, suffix: "+", label: "platforms validated" },
    ],
    tags: ["Selenium", "Postman", "JIRA", "QA Automation", "Python"],
    body: [
      "At DOIT&C I ran a large automated test suite against state government platforms, finding and validating critical issues before they reached users.",
      "I also documented workflows and progress in JIRA so the team could track the work clearly.",
    ],
  },
  {
    slug: "women-safety-app",
    kind: "build",
    title: "Women Safety Mobile App",
    year: "2023",
    oneLiner:
      "A personal security app that earned 3rd rank in the internal Smart India Hackathon 2023 round.",
    problem:
      "Personal safety tools are often hard to reach quickly in an emergency. The goal was a simple app with innovative safety features.",
    approach: [
      "Designed and built the mobile app as a team for Smart India Hackathon 2023.",
      "Focused on innovative safety features for personal security.",
      "Presented it in the internal round and placed 3rd.",
    ],
    impact: [],
    tags: ["Mobile App", "Hackathon", "SIH'23", "Teamwork"],
    body: [
      "Built for Smart India Hackathon 2023, this personal security app placed 3rd in the internal round for its innovative safety features.",
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
