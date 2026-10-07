import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !isValidEmail(email)) {
    throw new Error("Set ADMIN_EMAIL to a valid address before running the seed.");
  }
  if (!password || password.length < 16) {
    throw new Error("Set ADMIN_PASSWORD to a unique password of at least 16 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Berlinkoueni" },
  });
  console.log(`Admin user ready: ${email}`);

  await prisma.profile.upsert({
    where: { id: "default" },
    update: {
      fullName: "Berlinkoueni",
      alias: "theghostshell",
      title: "Développeur",
      shortBio:
        "Développeur basé à Douala, au Cameroun, je suis Berlinkoueni, connu sous le nom de theghostshell.",
      longBio:
        "## À propos\n\nJe m'appelle Berlinkoueni, aussi connu sous le pseudonyme theghostshell. Je suis développeur basé à Douala, au Cameroun.\n\nCe portfolio présente mon parcours et mes projets. Contactez-moi pour échanger au sujet d'une collaboration.",
      email: "berlinkoueni25@gmail.com",
      phone: "+237653021373",
      location: "Douala, Cameroun",
      available: false,
      seoTitle: "Berlinkoueni (theghostshell) — Portfolio",
      seoDescription:
        "Portfolio de Berlinkoueni, alias theghostshell, développeur basé à Douala, au Cameroun.",
    },
    create: {
      id: "default",
      fullName: "Berlinkoueni",
      alias: "theghostshell",
      title: "Développeur",
      shortBio:
        "Développeur basé à Douala, au Cameroun, je suis Berlinkoueni, connu sous le nom de theghostshell.",
      longBio:
        "## À propos\n\nJe m'appelle Berlinkoueni, aussi connu sous le pseudonyme theghostshell. Je suis développeur basé à Douala, au Cameroun.\n\nCe portfolio présente mon parcours et mes projets. Contactez-moi pour échanger au sujet d'une collaboration.",
      email: "berlinkoueni25@gmail.com",
      phone: "+237653021373",
      location: "Douala, Cameroun",
      available: false,
      seoTitle: "Berlinkoueni (theghostshell) — Portfolio",
      seoDescription:
        "Portfolio de Berlinkoueni, alias theghostshell, développeur basé à Douala, au Cameroun.",
    },
  });
  console.log("Profile ready. Add only your real projects, skills, and social links in the admin.");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
