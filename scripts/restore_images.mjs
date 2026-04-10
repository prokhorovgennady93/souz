import { PrismaClient } from '@prisma/client';
import { PrismaNodeSQLite } from "prisma-adapter-node-sqlite";
import fs from 'fs';
import path from 'path';

const url = "file:./dev.db";
const adapter = new PrismaNodeSQLite({ url });
const prisma = new PrismaClient({ adapter });


async function main() {
    console.log("Restoring images from seed_all_data.json...");
    
    const seedPath = path.join(process.cwd(), 'scripts', 'seed_all_data.json');
    if (!fs.existsSync(seedPath)) {
        console.error("Not found:", seedPath);
        return;
    }
    
    const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
    let restoredCount = 0;
    
    // Flatten all questions from seed data
    const seedQuestions = [];
    for (const category of Object.values(seedData)) {
        // Handle "tickets" or raw array based on schema format
        if (Array.isArray(category)) {
            // It's the raw array format like seen in 'basic'
            for (const q of category) {
                if (q.imageUrl) {
                    seedQuestions.push(q);
                }
            }
        } else if (category.tickets && Array.isArray(category.tickets)) {
            for (const ticket of category.tickets) {
                for (const q of ticket.questions) {
                    if (q.imageUrl) {
                        seedQuestions.push(q);
                    }
                }
            }
        }
    }
    
    console.log(`Found ${seedQuestions.length} questions with images in seed data.`);
    
    for (const sq of seedQuestions) {
        // Clean text to match DB
        const result = await prisma.question.updateMany({
            where: {
                text: sq.text,
                imageUrl: null // Only update if it doesn't have an image
            },
            data: {
                imageUrl: sq.imageUrl
            }
        });
        
        if (result.count > 0) {
            restoredCount += result.count;
            console.log(`Updated image for: ${sq.text.substring(0, 40)}...`);
        }
    }
    
    console.log(`Restore complete! Successfully updated ${restoredCount} questions with images.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
