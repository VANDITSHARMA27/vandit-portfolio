<div align="center">

# Vandit Sharma — Portfolio

**Data Engineer · Python · SQL · Machine Learning**

An interactive, black-and-white portfolio with a 3D particle hero, scene-based navigation and project case studies.

[![Live Site](https://img.shields.io/badge/Live-Website-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vanditsharma.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vanditsharma)

**[🌐 View the live portfolio → vanditsharma.vercel.app](https://vanditsharma.vercel.app)**

</div>

---

## About

This is my personal portfolio. It presents my internships, projects, skills and education in a single full-screen experience, and each project has its own detail page.

I'm a Computer Science graduate from BIT Mesra, focused on data engineering, analytics and automation, and I'm open to opportunities (immediate joiner, willing to relocate).

## Features

- **Interactive 3D hero** — a Three.js particle field that adapts to the device and pauses when off-screen
- **Scene-based navigation** — move between sections with scroll, keyboard, swipe or the navbar
- **Animated impact stats** — count-up metrics taken from my experience
- **Project case studies** — a card deck with a dedicated page for each project
- **Interactive 3D robot** in the About section (desktop)
- **Fully responsive**, with reduced-motion support
- **Content-driven** — all text lives in typed files in `content/`, so updating the site means editing data, not layouts

## Featured Projects

| Project | What it is |
| --- | --- |
| **QuickCompare** | Real-time grocery price comparison across Blinkit and Zepto using Puppeteer and WebSockets |
| **ML Crop Classification** | Machine-learning prototype (Python, TensorFlow, scikit-learn) reaching 90% accuracy |
| **Government Platform Test Automation** | 500+ Selenium test cases, 15+ critical issues validated |
| **Women Safety App** | Personal security app, 3rd rank in the internal SIH'23 round |

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Animation & 3D | Motion, Three.js, Spline |
| Hosting | Vercel |

## Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/VANDITSHARMA27/vandit-portfolio.git
cd vandit-portfolio

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run build   # production build (also type-checks and lints)
npm run lint    # lint only
```

## Project Structure

```
├── app/            # Routes: home page, /work/[slug] case-study pages
├── components/
│   ├── scene/      # Scene controller and navigation
│   ├── scenes/     # Hero, About, Experience, Work, Credentials, Skills, Contact
│   └── ui/         # Reusable UI and 3D/animated components
├── content/        # All site text and data (edit here)
├── lib/            # Helpers
├── public/         # Static assets
└── types/          # TypeScript content types
```

## Customising

Edit the files in `content/` — `site.ts`, `experience.ts`, `projects.ts`, `skills.ts`, `certifications.ts`, `education.ts` and `impact.ts`. Then push to `main`, and Vercel redeploys automatically.

## Contact

- 📧 vanditsharma2711@gmail.com
- 💼 [linkedin.com/in/vanditsharma](https://www.linkedin.com/in/vanditsharma)
