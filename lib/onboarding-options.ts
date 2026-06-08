export const expertiseCatalog = {
  Frontend: [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS"
  ],
  Backend: [
    "Node.js",
    "Express",
    "Laravel",
    "PostgreSQL",
    "Supabase",
    "REST API",
    "Authentication"
  ],
  "UI/UX": [
    "Figma",
    "FigJam",
    "Wireframe",
    "Prototype",
    "User Flow",
    "Design System",
    "Usability Testing"
  ],
  Mobile: [
    "Flutter",
    "React Native",
    "Kotlin",
    "Swift",
    "Expo",
    "Firebase",
    "Mobile UI"
  ],
  "Data/AI": [
    "Python",
    "Pandas",
    "Machine Learning",
    "Prompt Engineering",
    "TensorFlow",
    "SQL",
    "Data Visualization"
  ],
  DevOps: [
    "Git",
    "Docker",
    "CI/CD",
    "Vercel",
    "Linux",
    "Monitoring",
    "Cloud Deployment"
  ],
  "Project Management": [
    "Scrum",
    "Kanban",
    "Documentation",
    "Timeline Planning",
    "Communication",
    "Risk Tracking",
    "Team Facilitation"
  ]
} as const;

export const expertiseFields = Object.keys(expertiseCatalog);

export const skillLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export const availabilityOptions = [
  "1-3 jam per minggu",
  "4-6 jam per minggu",
  "7-10 jam per minggu",
  "10+ jam per minggu"
] as const;
