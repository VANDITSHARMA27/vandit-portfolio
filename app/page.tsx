import { SceneController } from "@/components/scene/SceneController";
import { site } from "@/content/site";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: [site.socials.linkedin, site.socials.github].filter(Boolean),
  description: site.metaDescription,
  knowsAbout: [
    "Data Engineering",
    "Python",
    "SQL",
    "Machine Learning",
    "Test Automation",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Birla Institute of Technology, Mesra",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <SceneController />
    </>
  );
}
