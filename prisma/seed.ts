/**
 * prisma/seed.ts
 * IMAT Prep Platform — Database Seed Script
 *
 * Seeds the database with:
 *  - 1 test user (free tier)
 *  - IMAT 2024 paper
 *  - 20 real IMAT-style questions across all 6 sections
 *
 * Run with:  npm run db:seed
 */

import { PrismaClient, Section } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ─────────────────────────────────────────
  // 1. UPSERT TEST USER
  // ─────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("password123", 12);

  const testUser = await prisma.user.upsert({
    where: { email: "test@imatprep.com" },
    update: {},
    create: {
      name: "Test Student",
      email: "test@imatprep.com",
      password: hashedPassword,
      subscriptionStatus: "FREE",
    },
  });

  console.log(`✅ Test user: ${testUser.email}`);

  // ─────────────────────────────────────────
  // 2. UPSERT ALL IMAT PAPERS
  // ─────────────────────────────────────────
  const papersToSeed = [
    { year: 2025, isFree: false },
    { year: 2024, isFree: true },
    { year: 2023, isFree: true },
    { year: 2022, isFree: false }, // Not in public/papers but we can create DB record
    { year: 2021, isFree: false },
    { year: 2020, isFree: false },
    { year: 2019, isFree: true },
    { year: 2018, isFree: true },
    { year: 2017, isFree: true },
    { year: 2016, isFree: true },
    { year: 2015, isFree: true },
  ];

  let paper2024;
  for (const p of papersToSeed) {
    const paper = await prisma.paper.upsert({
      where: { year: p.year },
      update: { isFree: p.isFree },
      create: {
        year: p.year,
        title: `IMAT ${p.year} — Official Past Paper`,
        pdfUrl: `/papers/imat-${p.year}.pdf`,
        isFree: p.isFree,
        totalMarks: 60,
        durationMin: 100,
      },
    });
    if (p.year === 2024) paper2024 = paper;
    console.log(`✅ Paper: ${paper.title} (${p.isFree ? 'FREE' : 'LOCKED'})`);
  }

  if (!paper2024) throw new Error("Paper 2024 not found for seeding questions");

  // ─────────────────────────────────────────
  // 3. SEED QUESTIONS
  // 20 IMAT-style questions across all sections
  // ─────────────────────────────────────────

  const questions = [
    // ── BIOLOGY (8 questions) ──────────────────────

    {
      section: Section.BIOLOGY,
      topic: "Cell Biology",
      difficulty: 2,
      year: 2024,
      questionText:
        "Which of the following organelles is responsible for ATP synthesis during aerobic respiration?",
      optionA: "Ribosome",
      optionB: "Mitochondria",
      optionC: "Golgi apparatus",
      optionD: "Lysosome",
      optionE: "Smooth endoplasmic reticulum",
      correctAnswer: "B",
      explanation:
        "Mitochondria are the site of aerobic respiration (Krebs cycle and oxidative phosphorylation), producing the majority of a cell's ATP. The inner mitochondrial membrane houses the electron transport chain and ATP synthase.",
      source: "IMAT 2024 Official",
    },
    {
      section: Section.BIOLOGY,
      topic: "Genetics",
      difficulty: 3,
      year: 2024,
      questionText:
        "A woman who is a carrier for haemophilia A (X-linked recessive) has children with an unaffected man. What is the probability that their son will have haemophilia A?",
      optionA: "0%",
      optionB: "25%",
      optionC: "50%",
      optionD: "75%",
      optionE: "100%",
      correctAnswer: "C",
      explanation:
        "The mother is X^H X^h (carrier). Sons receive their X from the mother and Y from the father. There is a 50% chance the son receives X^h (affected). Daughters receive one X from each parent and cannot be affected (they would need X^h X^h).",
      source: "IMAT-style",
    },
    {
      section: Section.BIOLOGY,
      topic: "Human Physiology",
      difficulty: 3,
      year: 2024,
      questionText:
        "Which hormone directly stimulates the adrenal cortex to produce cortisol?",
      optionA: "Adrenaline (Epinephrine)",
      optionB: "Thyrotropin-releasing hormone (TRH)",
      optionC: "Adrenocorticotropic hormone (ACTH)",
      optionD: "Growth hormone (GH)",
      optionE: "Luteinizing hormone (LH)",
      correctAnswer: "C",
      explanation:
        "ACTH, released from the anterior pituitary in response to CRH from the hypothalamus, stimulates the adrenal cortex to synthesise and release cortisol. This is the HPA (Hypothalamic-Pituitary-Adrenal) axis.",
      source: "IMAT-style",
    },
    {
      section: Section.BIOLOGY,
      topic: "Cell Division",
      difficulty: 2,
      year: 2024,
      questionText:
        "During which phase of meiosis do homologous chromosomes separate?",
      optionA: "Meiosis II — Anaphase II",
      optionB: "Meiosis I — Anaphase I",
      optionC: "Meiosis I — Metaphase I",
      optionD: "Meiosis II — Metaphase II",
      optionE: "Meiosis I — Prophase I",
      correctAnswer: "B",
      explanation:
        "During Anaphase I of meiosis, homologous chromosome pairs (bivalents) are pulled to opposite poles by spindle fibres. This is the key event that halves the chromosome number. In Anaphase II, sister chromatids separate (like mitosis).",
      source: "IMAT-style",
    },
    {
      section: Section.BIOLOGY,
      topic: "Ecology",
      difficulty: 2,
      year: 2024,
      questionText:
        "Which process describes the conversion of atmospheric nitrogen (N₂) into ammonia (NH₃) by bacteria?",
      optionA: "Nitrification",
      optionB: "Denitrification",
      optionC: "Ammonification",
      optionD: "Nitrogen fixation",
      optionE: "Assimilation",
      correctAnswer: "D",
      explanation:
        "Nitrogen fixation is performed by nitrogen-fixing bacteria (e.g. Rhizobium, Azotobacter) using the enzyme nitrogenase to convert N₂ → NH₃. Nitrification converts NH₃ → NO₂⁻ → NO₃⁻. Denitrification converts NO₃⁻ → N₂.",
      source: "IMAT-style",
    },
    {
      section: Section.BIOLOGY,
      topic: "Biochemistry",
      difficulty: 4,
      year: 2024,
      questionText:
        "Which of the following correctly describes a peptide bond?",
      optionA:
        "A bond between the amino group of one amino acid and the carboxyl group of another, releasing water",
      optionB:
        "A bond between two carboxyl groups of adjacent amino acids, releasing CO₂",
      optionC:
        "A hydrogen bond between the R-groups of adjacent amino acids",
      optionD:
        "A disulfide bridge between two cysteine residues",
      optionE:
        "A bond between the phosphate group and amino group of adjacent residues",
      correctAnswer: "A",
      explanation:
        "A peptide bond is a covalent bond formed between the carboxyl group (–COOH) of one amino acid and the amino group (–NH₂) of another, via a condensation reaction that releases one water molecule (H₂O). It is the primary structural link in polypeptide chains.",
      source: "IMAT-style",
    },
    {
      section: Section.BIOLOGY,
      topic: "Plant Biology",
      difficulty: 3,
      year: 2024,
      questionText:
        "In C3 photosynthesis, where does the Calvin cycle (light-independent reactions) take place?",
      optionA: "Thylakoid membrane",
      optionB: "Outer mitochondrial membrane",
      optionC: "Stroma of the chloroplast",
      optionD: "Cytoplasm",
      optionE: "Grana of the chloroplast",
      correctAnswer: "C",
      explanation:
        "The Calvin cycle occurs in the stroma of the chloroplast, using ATP and NADPH produced by the light-dependent reactions on the thylakoid membrane to fix CO₂ into glyceraldehyde-3-phosphate (G3P) via the enzyme RuBisCO.",
      source: "IMAT-style",
    },
    {
      section: Section.BIOLOGY,
      topic: "Human Physiology",
      difficulty: 3,
      year: 2024,
      questionText:
        "Which blood vessel carries oxygenated blood from the lungs back to the heart?",
      optionA: "Pulmonary artery",
      optionB: "Aorta",
      optionC: "Vena cava",
      optionD: "Pulmonary vein",
      optionE: "Coronary artery",
      correctAnswer: "D",
      explanation:
        "The pulmonary vein carries oxygenated blood from the lungs to the left atrium of the heart — this is the exception to the rule that 'veins carry deoxygenated blood'. The pulmonary artery carries deoxygenated blood from the right ventricle to the lungs.",
      source: "IMAT-style",
    },

    // ── CHEMISTRY (5 questions) ────────────────────

    {
      section: Section.CHEMISTRY,
      topic: "Acids & Bases",
      difficulty: 3,
      year: 2024,
      questionText:
        "What is the pH of a 0.01 mol/L solution of hydrochloric acid (HCl) at 25°C? (Assume complete dissociation)",
      optionA: "1",
      optionB: "2",
      optionC: "7",
      optionD: "12",
      optionE: "−2",
      correctAnswer: "B",
      explanation:
        "HCl is a strong acid and fully dissociates: [H⁺] = 0.01 mol/L = 10⁻² mol/L. pH = −log[H⁺] = −log(10⁻²) = 2.",
      source: "IMAT-style",
    },
    {
      section: Section.CHEMISTRY,
      topic: "Atomic Structure",
      difficulty: 2,
      year: 2024,
      questionText:
        "An element has atomic number 17 and mass number 35. How many neutrons does it have?",
      optionA: "17",
      optionB: "18",
      optionC: "35",
      optionD: "52",
      optionE: "16",
      correctAnswer: "B",
      explanation:
        "Neutrons = Mass number − Atomic number = 35 − 17 = 18. This element is chlorine-35 (³⁵Cl). It has 17 protons, 18 neutrons, and 17 electrons.",
      source: "IMAT-style",
    },
    {
      section: Section.CHEMISTRY,
      topic: "Organic Chemistry",
      difficulty: 4,
      year: 2024,
      questionText:
        "Which functional group is present in carboxylic acids?",
      optionA: "–OH (hydroxyl)",
      optionB: "–CHO (aldehyde)",
      optionC: "–NH₂ (amine)",
      optionD: "–COOH (carboxyl)",
      optionE: "–CO– (ketone)",
      correctAnswer: "D",
      explanation:
        "Carboxylic acids contain the –COOH (carboxyl) functional group, which consists of a carbonyl (C=O) and a hydroxyl (–OH) attached to the same carbon. Examples include ethanoic acid (CH₃COOH) and amino acid side chains.",
      source: "IMAT-style",
    },
    {
      section: Section.CHEMISTRY,
      topic: "Moles & Stoichiometry",
      difficulty: 3,
      year: 2024,
      questionText:
        "How many moles of oxygen gas (O₂) are produced when 4 moles of hydrogen peroxide (H₂O₂) decompose according to: 2H₂O₂ → 2H₂O + O₂?",
      optionA: "1 mol",
      optionB: "2 mol",
      optionC: "4 mol",
      optionD: "8 mol",
      optionE: "0.5 mol",
      correctAnswer: "B",
      explanation:
        "The balanced equation shows 2 mol H₂O₂ produces 1 mol O₂ (ratio 2:1). With 4 mol H₂O₂: moles O₂ = 4 × (1/2) = 2 mol.",
      source: "IMAT-style",
    },
    {
      section: Section.CHEMISTRY,
      topic: "Chemical Bonding",
      difficulty: 2,
      year: 2024,
      questionText:
        "Which type of bonding is present in a sample of solid sodium chloride (NaCl)?",
      optionA: "Covalent bonding",
      optionB: "Metallic bonding",
      optionC: "Ionic bonding",
      optionD: "Hydrogen bonding",
      optionE: "Van der Waals forces",
      correctAnswer: "C",
      explanation:
        "NaCl is an ionic compound. Sodium (Na) loses one electron to chlorine (Cl), forming Na⁺ and Cl⁻ ions held together in a lattice structure by electrostatic (ionic) forces. It has a high melting point and conducts electricity when dissolved or melted.",
      source: "IMAT-style",
    },

    // ── PHYSICS (3 questions) ──────────────────────

    {
      section: Section.PHYSICS,
      topic: "Forces & Mechanics",
      difficulty: 3,
      year: 2024,
      questionText:
        "A car of mass 1000 kg accelerates from rest to 20 m/s in 10 seconds. What is the net force acting on the car?",
      optionA: "200 N",
      optionB: "2000 N",
      optionC: "20 000 N",
      optionD: "100 N",
      optionE: "10 000 N",
      correctAnswer: "B",
      explanation:
        "Using Newton's second law: F = ma. Acceleration a = Δv/Δt = (20 − 0)/10 = 2 m/s². F = 1000 kg × 2 m/s² = 2000 N.",
      source: "IMAT-style",
    },
    {
      section: Section.PHYSICS,
      topic: "Waves & Optics",
      difficulty: 2,
      year: 2024,
      questionText:
        "The speed of light in a vacuum is approximately 3 × 10⁸ m/s. If light has a frequency of 6 × 10¹⁴ Hz, what is its wavelength?",
      optionA: "5 × 10⁻⁷ m",
      optionB: "2 × 10²² m",
      optionC: "5 × 10⁷ m",
      optionD: "2 × 10⁻²² m",
      optionE: "1.8 × 10²³ m",
      correctAnswer: "A",
      explanation:
        "Using v = fλ → λ = v/f = (3 × 10⁸) / (6 × 10¹⁴) = 0.5 × 10⁻⁶ = 5 × 10⁻⁷ m (500 nm — visible green light).",
      source: "IMAT-style",
    },
    {
      section: Section.PHYSICS,
      topic: "Energy & Thermodynamics",
      difficulty: 3,
      year: 2024,
      questionText:
        "A 2 kg object is held at a height of 5 m above the ground. What is its gravitational potential energy? (g = 10 m/s²)",
      optionA: "10 J",
      optionB: "25 J",
      optionC: "100 J",
      optionD: "50 J",
      optionE: "1000 J",
      correctAnswer: "C",
      explanation:
        "Gravitational potential energy: GPE = mgh = 2 kg × 10 m/s² × 5 m = 100 J.",
      source: "IMAT-style",
    },

    // ── MATHS (2 questions) ────────────────────────

    {
      section: Section.MATHS,
      topic: "Algebra",
      difficulty: 3,
      year: 2024,
      questionText:
        "Solve for x: 3x² − 12 = 0",
      optionA: "x = ±4",
      optionB: "x = ±2",
      optionC: "x = 4",
      optionD: "x = 2",
      optionE: "x = ±√12",
      correctAnswer: "B",
      explanation:
        "3x² − 12 = 0 → 3x² = 12 → x² = 4 → x = ±√4 = ±2. Both +2 and −2 are valid solutions.",
      source: "IMAT-style",
    },
    {
      section: Section.MATHS,
      topic: "Statistics & Probability",
      difficulty: 4,
      year: 2024,
      questionText:
        "A bag contains 3 red balls and 7 blue balls. Two balls are drawn at random without replacement. What is the probability that both balls are red?",
      optionA: "9/100",
      optionB: "3/10",
      optionC: "1/15",
      optionD: "6/90",
      optionE: "3/45",
      correctAnswer: "C",
      explanation:
        "P(both red) = (3/10) × (2/9) = 6/90 = 1/15. First draw: 3 red out of 10 total. Second draw: 2 red out of 9 remaining (without replacement).",
      source: "IMAT-style",
    },

    // ── LOGICAL REASONING (1 question) ────────────

    {
      section: Section.LOGICAL,
      topic: "Critical Thinking",
      difficulty: 3,
      year: 2024,
      questionText:
        "All scientists are curious. Some curious people are artists. Which conclusion necessarily follows?",
      optionA: "All scientists are artists",
      optionB: "No artists are scientists",
      optionC: "Some scientists are artists",
      optionD: "All curious people are scientists",
      optionE: "None of the above necessarily follows",
      correctAnswer: "E",
      explanation:
        "From the premises: (1) All scientists → curious. (2) Some curious people → artists. We cannot conclude that any scientist is also an artist — the overlap between 'curious people who are artists' and 'scientists' is not established. Therefore none of A–D necessarily follows.",
      source: "IMAT-style",
    },

    // ── READING (1 question) ───────────────────────

    {
      section: Section.READING,
      topic: "General Knowledge",
      difficulty: 2,
      year: 2024,
      questionText:
        "Which of the following is the largest organ in the human body by surface area?",
      optionA: "Liver",
      optionB: "Brain",
      optionC: "Lungs",
      optionD: "Skin",
      optionE: "Small intestine",
      correctAnswer: "D",
      explanation:
        "The skin is the largest organ of the human body by surface area (approximately 1.5–2 m²) and by weight. It forms the integumentary system and serves as a protective barrier against pathogens, regulates temperature, and prevents water loss.",
      source: "IMAT-style",
    },
  ];

  // Upsert all questions (idempotent — safe to re-run)
  let seeded = 0;
  for (const q of questions) {
    // Use questionText as the unique identifier for upsert
    const existing = await prisma.question.findFirst({
      where: {
        questionText: q.questionText,
        paperId: paper2024.id,
      },
    });

    if (!existing) {
      await prisma.question.create({
        data: {
          ...q,
          paperId: paper2024.id,
        },
      });
      seeded++;
    }
  }

  console.log(`✅ Questions: ${seeded} new questions seeded (${questions.length - seeded} already existed)`);

  // ─────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────
  const totalQuestions = await prisma.question.count();
  const totalPapers = await prisma.paper.count();
  const totalUsers = await prisma.user.count();

  console.log("\n📊 Database Summary:");
  console.log(`   Users:     ${totalUsers}`);
  console.log(`   Papers:    ${totalPapers}`);
  console.log(`   Questions: ${totalQuestions}`);
  console.log("\n✨ Seed completed successfully!\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
