const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.activityLevel.createMany({
    data: [
      { name: "Sedentary", description: "ไม่ออกกำลังกาย", multiplier: 1.2 },
      { name: "Lightly Active", description: "ออกกำลังกาย 1-3 วัน/สัปดาห์", multiplier: 1.375 },
      { name: "Moderately Active", description: "ออกกำลังกาย 3-5 วัน/สัปดาห์", multiplier: 1.55 },
      { name: "Very Active", description: "ออกกำลังกาย 6-7 วัน/สัปดาห์", multiplier: 1.725 },
      { name: "Extra Active", description: "ออกกำลังกายอย่างหนัก", multiplier: 1.9 }
    ]
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
