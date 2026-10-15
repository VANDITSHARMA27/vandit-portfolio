import type { Experience } from "@/types/content";

/** Reverse-chronological. Add new roles to the top. */
export const experience: Experience[] = [
  {
    id: "regex-softwares",
    company: "Regex Softwares",
    team: "Data Engineering",
    role: "Data Engineer Intern",
    period: "Feb 2026 — Sep 2026",
    location: "Jaipur, India",
    summary:
      "Worked on data analysis, SQL workflows and ML model development using the Python data stack.",
    highlights: [
      "Applied Python, Object-Oriented Programming and data libraries (Pandas, NumPy, Matplotlib, Seaborn) for data analysis and problem solving.",
      "Used Linux, SQL and MySQL, plus ML frameworks (TensorFlow, PyTorch), to support workflows, model development and data integration.",
    ],
    stack: ["Python", "SQL", "MySQL", "Pandas", "TensorFlow", "PyTorch", "Linux"],
  },
  {
    id: "doitc",
    company: "DOIT&C — Bhamashah State Data Centre",
    team: "Government of Rajasthan",
    role: "Software Developer Intern",
    period: "May 2024 — Nov 2024",
    location: "Jaipur, India",
    summary:
      "Tested and validated government digital platforms and built an ML crop-classification prototype.",
    highlights: [
      "Executed 500+ Selenium test cases, identifying and validating 15+ critical issues and improving software reliability.",
      "Developed an ML crop-classification prototype (Python, TensorFlow, scikit-learn) achieving 90% accuracy.",
      "Collaborated with stakeholders to validate features on 8+ government digital platforms against user requirements.",
      "Documented 5 government workflows and project progress in JIRA to streamline project management.",
    ],
    stack: ["Python", "Selenium", "TensorFlow", "scikit-learn", "JIRA", "Postman", "Power BI"],
  },
  {
    id: "bit-mesra-research",
    company: "Birla Institute of Technology, Mesra",
    team: "Cybersecurity Research",
    role: "Cybersecurity Research Intern",
    period: "Jun 2024 — Jul 2024",
    location: "Mesra, India",
    summary:
      "Researched Ethereum blockchain applications and ran security analyses in a Linux environment.",
    highlights: [
      "Researched Ethereum blockchain applications, evaluating scalability and security considerations to support enterprise healthcare development.",
      "Conducted vulnerability assessments and security analyses in Linux, identifying risks and implementing mitigation strategies.",
    ],
    stack: ["Linux", "Ethereum", "Blockchain", "Security Analysis"],
  },
];
