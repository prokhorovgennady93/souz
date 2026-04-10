import fs from 'fs';
import path from 'path';

const dataPath = 'data/dopog_data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const stats = [];

data.forEach(course => {
  course.themes.forEach(theme => {
    const imgCount = theme.questions.filter(q => q.imageUrl).length;
    stats.push({
      theme: theme.title,
      course: course.title,
      count: imgCount
    });
  });
});

const top5 = stats.sort((a, b) => b.count - a.count).slice(0, 10);

console.log('--- ТОП ТЕМ ПО КОЛИЧЕСТВУ КАРТИНОК ---');
top5.forEach((s, i) => {
  console.log(`${i + 1}. [${s.course}] ${s.theme}: ${s.count} шт.`);
});
