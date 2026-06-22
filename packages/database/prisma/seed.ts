import { PrismaClient, ServiceCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Skills
  const skills = [
    { name: "Montage Vidéo", category: ServiceCategory.VIDEO_EDITING, iconName: "Film" },
    { name: "Motion Design", category: ServiceCategory.VIDEO_EDITING, iconName: "Sparkles" },
    { name: "Modélisation 3D", category: ServiceCategory.THREE_D, iconName: "Box" },
    { name: "Animation 3D", category: ServiceCategory.THREE_D, iconName: "Clapperboard" },
    { name: "Développement Web", category: ServiceCategory.DEVELOPMENT, iconName: "Code" },
    { name: "Développement Mobile", category: ServiceCategory.DEVELOPMENT, iconName: "Smartphone" },
    { name: "Développement Bot", category: ServiceCategory.DEVELOPMENT, iconName: "Bot" },
    { name: "Sound Design", category: ServiceCategory.SOUND_DESIGN, iconName: "Music" },
    { name: "Composition Musicale", category: ServiceCategory.SOUND_DESIGN, iconName: "Piano" },
    { name: "Mixage / Mastering", category: ServiceCategory.SOUND_DESIGN, iconName: "Headphones" },
    { name: "Graphisme / Illustration", category: ServiceCategory.GRAPHIC_DESIGN, iconName: "Palette" },
    { name: "UI/UX Design", category: ServiceCategory.GRAPHIC_DESIGN, iconName: "Layout" },
    { name: "Traduction", category: ServiceCategory.TRANSLATION, iconName: "Languages" },
    { name: "Création Serveur Discord", category: ServiceCategory.DISCORD_SERVER, iconName: "MessageSquare" },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
  }
  console.log(`  ✅ ${skills.length} skills created`);

  // Pricing configs
  const pricingConfigs = [
    {
      category: ServiceCategory.VIDEO_EDITING,
      basePriceMin: 50,
      basePriceMax: 200,
      unit: "day",
      multipliers: {},
    },
    {
      category: ServiceCategory.THREE_D,
      basePriceMin: 80,
      basePriceMax: 300,
      unit: "day",
      multipliers: {},
    },
    {
      category: ServiceCategory.DEVELOPMENT,
      basePriceMin: 100,
      basePriceMax: 350,
      unit: "day",
      multipliers: {},
    },
    {
      category: ServiceCategory.SOUND_DESIGN,
      basePriceMin: 60,
      basePriceMax: 250,
      unit: "day",
      multipliers: {},
    },
    {
      category: ServiceCategory.GRAPHIC_DESIGN,
      basePriceMin: 50,
      basePriceMax: 200,
      unit: "day",
      multipliers: {},
    },
    {
      category: ServiceCategory.TRANSLATION,
      basePriceMin: 0.08,
      basePriceMax: 0.15,
      unit: "word",
      multipliers: {},
    },
    {
      category: ServiceCategory.DISCORD_SERVER,
      basePriceMin: 100,
      basePriceMax: 500,
      unit: "fixed",
      multipliers: {},
    },
  ];

  for (const config of pricingConfigs) {
    await prisma.pricingConfig.upsert({
      where: { category: config.category },
      update: {},
      create: config,
    });
  }
  console.log(`  ✅ ${pricingConfigs.length} pricing configs created`);

  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@novastudio.com" },
    update: {},
    create: {
      email: "admin@novastudio.com",
      name: "Admin Nova Studio",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("  ✅ Admin user created");

  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
