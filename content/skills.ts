import type { SkillGroup } from "@/types/content";

/** Icons available: Compass, Sparkles, Terminal, BarChart3 */
export const skills: SkillGroup[] = [
  {
    name: "Data Engineering",
    icon: "Terminal",
    items: ["Python", "SQL", "MySQL", "Data Migration", "Data Engineering Concepts", "Linux", "Google Cloud"],
  },
  {
    name: "Analytics & BI",
    icon: "BarChart3",
    items: ["Power BI", "Tableau", "Microsoft Excel (Advanced)", "Data Visualization", "Matplotlib", "Seaborn"],
  },
  {
    name: "ML & Libraries",
    icon: "Sparkles",
    items: ["Pandas", "NumPy", "scikit-learn", "TensorFlow", "PyTorch"],
  },
  {
    name: "Tools & Practices",
    icon: "Compass",
    items: ["Git / GitHub", "VS Code", "JIRA", "Postman API", "Selenium", "Agile / Scrum", "Problem Solving", "Team Work"],
  },
];
