import fs from 'fs';

const data = JSON.parse(fs.readFileSync('data/dopog_data.json', 'utf8'));
const stats = [];

data.forEach(course => {
  course.themes.forEach(theme => {
    let count = 0;
    theme.questions.forEach(q => {
      // Check for presence of imageUrl and it not being a null literal or 'null' string
      if (q.imageUrl && q.imageUrl !== 'null') {
        count++;
      }
    });
    if (count > 0) {
      stats.push({ 
        theme: theme.title, 
        course: course.title, 
        count 
      });
    }
  });
});

stats.sort((a, b) => b.count - a.count);

console.log('--- Темы с наибольшим количеством изображений ---');
stats.slice(0, 10).forEach((s, i) => {
  console.log(`${i + 1}. [${s.course}] ${s.theme}: ${s.count} шт.`);
});
