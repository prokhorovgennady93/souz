import { db } from "../src/lib/db";
import fs from "fs";
import path from "path";
import axios from "axios";

async function downloadImages() {
  const questions = await db.question.findMany({
    where: {
      imageUrl: {
        contains: "http"
      }
    }
  });

  console.log(`Found ${questions.length} questions with remote images.`);

  const baseDir = path.join(process.cwd(), "public", "images", "questions");
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  for (const q of questions) {
    if (!q.imageUrl) continue;

    try {
      const url = q.imageUrl;
      const extension = path.extname(url.split("?")[0]) || ".jpg";
      const filename = `${q.id}${extension}`;
      const localPath = path.join(baseDir, filename);

      console.log(`Downloading ${url} -> ${filename}`);

      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      const writer = fs.createWriteStream(localPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      await db.question.update({
        where: { id: q.id },
        data: { imageUrl: `/images/questions/${filename}` }
      });

      console.log(`Updated question ${q.id} with local image.`);
    } catch (error) {
      console.error(`Failed to download image for question ${q.id}:`, error);
    }
  }
}

downloadImages().catch(console.error);
