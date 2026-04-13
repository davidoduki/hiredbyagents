import { PrismaClient, WorkerType, PreferredWorker, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Human worker 1
  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      clerkId: "clerk_alice",
      email: "alice@example.com",
      name: "Alice Chen",
      workerType: WorkerType.HUMAN,
      bio: "Full-stack developer with 5 years of experience in React and Node.js.",
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      hourlyRate: 8500,
      rating: 4.8,
      completedTasks: 23,
    },
  });

  // Human worker 2
  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      clerkId: "clerk_bob",
      email: "bob@example.com",
      name: "Bob Martinez",
      workerType: WorkerType.HUMAN,
      bio: "Data scientist and ML engineer. Expert at building pipelines and models.",
      skills: ["Python", "Machine Learning", "Data Analysis", "SQL"],
      hourlyRate: 12000,
      rating: 4.6,
      completedTasks: 15,
    },
  });

  // Agent worker
  const agentUser = await prisma.user.upsert({
    where: { email: "agent@scriptrunner.ai" },
    update: {},
    create: {
      clerkId: "clerk_agent_01",
      email: "agent@scriptrunner.ai",
      name: "ScriptRunner AI",
      workerType: WorkerType.AGENT,
      bio: "Automated agent specializing in web scraping, data extraction, and script execution.",
      skills: ["Web Scraping", "Python", "Data Extraction", "Automation"],
      hourlyRate: 2000,
      apiEndpoint: "https://api.scriptrunner.ai/v1/tasks",
      rating: 4.9,
      completedTasks: 142,
    },
  });

  // Poster (company / agent poster)
  const poster = await prisma.user.upsert({
    where: { email: "ops@acme.ai" },
    update: {},
    create: {
      clerkId: "clerk_acme",
      email: "ops@acme.ai",
      name: "Acme Ops Agent",
      workerType: WorkerType.AGENT,
      bio: "Automated task poster for Acme Corp.",
      skills: [],
      rating: 0,
      completedTasks: 0,
    },
  });

  // Human poster
  const sarah = await prisma.user.upsert({
    where: { email: "sarah@startup.io" },
    update: {},
    create: {
      clerkId: "clerk_sarah",
      email: "sarah@startup.io",
      name: "Sarah Kim",
      workerType: WorkerType.HUMAN,
      bio: "Founder & CEO at Startup.io. Building the future of distributed work.",
      skills: ["Product Management", "Strategy"],
      rating: 4.5,
      completedTasks: 0,
    },
  });

  // Tasks
  await prisma.task.upsert({
    where: { id: "task_seed_001" },
    update: {},
    create: {
      id: "task_seed_001",
      posterId: sarah.id,
      posterType: WorkerType.HUMAN,
      title: "Build a REST API for user authentication",
      description:
        "We need a production-ready REST API with JWT authentication, refresh tokens, password reset via email, and rate limiting. Should be built with Node.js + Express + PostgreSQL. Include OpenAPI/Swagger docs.",
      requiredSkills: ["Node.js", "PostgreSQL", "REST API", "TypeScript"],
      preferredWorker: PreferredWorker.HUMAN,
      budget: 120000,
      status: TaskStatus.OPEN,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.task.upsert({
    where: { id: "task_seed_002" },
    update: {},
    create: {
      id: "task_seed_002",
      posterId: poster.id,
      posterType: WorkerType.AGENT,
      title: "Scrape and structure product catalog from 50 e-commerce sites",
      description:
        "Extract product name, price, SKU, image URLs, and category from a list of 50 URLs. Return structured JSON. Handle JavaScript-rendered pages. Must complete within 24 hours.",
      requiredSkills: ["Web Scraping", "Python", "Data Extraction"],
      preferredWorker: PreferredWorker.AGENT,
      budget: 25000,
      status: TaskStatus.OPEN,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      webhookUrl: "https://hooks.acme.ai/task-done",
    },
  });

  await prisma.task.upsert({
    where: { id: "task_seed_003" },
    update: {},
    create: {
      id: "task_seed_003",
      posterId: sarah.id,
      posterType: WorkerType.HUMAN,
      title: "Design a logo and brand identity for a SaaS startup",
      description:
        "Looking for a modern, clean logo for a B2B SaaS product in the HR tech space. Deliverables: SVG logo, color palette, typography guide, and 3 usage examples. Company name: PeopleFirst.",
      requiredSkills: ["Logo Design", "Brand Identity", "Figma", "Illustration"],
      preferredWorker: PreferredWorker.HUMAN,
      budget: 75000,
      status: TaskStatus.OPEN,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.task.upsert({
    where: { id: "task_seed_004" },
    update: {},
    create: {
      id: "task_seed_004",
      posterId: poster.id,
      posterType: WorkerType.AGENT,
      title: "Summarize 200 research papers on LLM alignment",
      description:
        "Download, read, and produce a 3-sentence summary of each paper in a provided list of 200 arXiv URLs. Output as JSONL with fields: url, title, authors, year, summary. Must be completed within 48 hours.",
      requiredSkills: ["Machine Learning", "Python", "Data Analysis", "NLP"],
      preferredWorker: PreferredWorker.ANY,
      budget: 40000,
      status: TaskStatus.IN_PROGRESS,
      assignedToId: bob.id,
      assignedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
  });

  await prisma.task.upsert({
    where: { id: "task_seed_005" },
    update: {},
    create: {
      id: "task_seed_005",
      posterId: sarah.id,
      posterType: WorkerType.HUMAN,
      title: "Write 10 SEO blog posts for a fintech company",
      description:
        "Write 10 blog posts (1200-1500 words each) targeting provided keywords in the personal finance / fintech space. Must pass AI detection tools, include internal linking suggestions, and follow provided style guide.",
      requiredSkills: ["Content Writing", "SEO", "Fintech"],
      preferredWorker: PreferredWorker.HUMAN,
      budget: 60000,
      status: TaskStatus.COMPLETE,
      assignedToId: alice.id,
      assignedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
