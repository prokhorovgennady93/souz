import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

const COURSES = [
    { id: 1, name: 'Базовый курс' },
    { id: 2, name: 'Перевозка в цистернах' },
    { id: 4, name: 'Перевозка веществ класса 1' },
    { id: 8, name: 'Перевозка веществ класса 7' }
];

const dataFilePath = path.join(process.cwd(), 'data', 'dopog_data.json');
const imagesDir = path.join(process.cwd(), 'public', 'images', 'questions');

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Same cookie as provided
const COOKIE_STRING = "_ym_uid=1774571187589330676; _ym_d=1774571187; _ym_isad=2; stc=EAAdABYAEAA=; ta=AgAOAA8ABgAIAA==; acb=AgAOAA8ABgAIAA==; hrl=AgAOAA8ABgAIAA==; cookieConsent=EAAdABYAEAA=; e_activatedPremium=EAAdABYAEAA=; cc=VQBcAA==; remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6IlFtVFRLWkhER1dOMUp5RmV6eGNzRWc9PSIsInZhbHVlIjoibTNQSGRPSDFjZU8xdWJNRTMyUUJ5UG1jL1BXN3hrN1dQZmIyRUx5VWZta2dlbWE0VHAwTVhibHVZSjB5QlpCT1RJa1pyRFpOZFhwdWNtMWttWDZWK0hDdmU0N1JKWXdQUkZwVXV3ZGYzOUF6VkV1YTNYMjdBL1VLQTVlcndJUHMyMC9JeUtMWWNOU0t3QUdCVjVLQjFONVJnKzg5Z3N1KzAwa3lDZkZiR0d0VTNXS0hyT3lIb3lsUlluM0RWei9Gb0plV3FJRmlnblhTYnZVT0FodmI1cWFmOVpGak0zNjhMWHV5aVNoVGkzUT0iLCJtYWMiOiI1MTRhNjZjNGEwN2MzMDNkZDkzMzA5MmViZjdhNTY5OTgxNGY5NjRiMWI5NmZhODljZjM2NzFiMTNkZjc0MmY1IiwidGFnIjoiIn0%3D; sp=HwBNAAoAEQBPAF8ATABNAFUATQBPAFcACQAMAB0ABAAIAA4AGgA8AAkARwBUAFYAXQBeAEEAWQBPAAYADwAAAAEACAAMAAcAFAAsAAoAVgBeAF4ATwBXABkADQALABkAAQAmAAcAVwBXAFQAXgBEAFcAQwBBABYAIwAEAAMAEQBGAFUAQQBpBF0EJQRUBEwEJARRBFEETwRdBEUAVgRDBFAEWgRYBE0EVARFAFYEVAAnBFAEUwRPBFMEVwRQBE4ERAAuBEMASwRSBFUELwRJBC8EUwRbBFUAXgQlBC0EQwRUBFMEWwRXAEEARwAaADoABQACAAYAVwBXAEcAfwREBFMEUQRRBD4EVARFAFQENwQkBC4EQQBZAE8AFAAgABUACQAKAEEATwBPAH8EXgROBCcEIQRDAEsEUgRVBC8ESQRaBC4EIQQ5BE0AWgQuBEEEUAQuBCEERQRfBF4EIQRBBCYETwAiBEsEWQRQBC4EQgRcBFMEXQRABE0AXwRQBEkEJgRaBFoESARYBCUEXgRUACUETwBdBEoEXQQkBFMEPwRYBE8AUAQ1BC4EUgRQBEgERABVBFgERQQsBCQEXgRUAF0AQwBDAEAELAReBFYEVABeBE8AIQQ1BF0EWAQvBEsEWgQvBCEESARTBFkELQRUACUELwRWBEEELAQnBFwENwREAFAEIwRNBE0AXQQrBFQAWwRaBCMEQARfBFsEWQROBFEETwBcBDUEVQRfBC4EQQRbBFQEVgRIBE0AWgRQBE4EVARYBFMESARQBC4EVwRUAFkEXwRDADUEVQRkBC0ESQReBFoEQwBCBFAEVQRUBEsARgASAA==; XSRF-TOKEN=eyJpdiI6IjN3V1hDSU0vZHNycFJMWHNReURrYVE9PSIsInZhbHVlIjoiRDlNZXRaUmJjeXhadGdabXRsTTNXdW5tcVNBK1pxSXZISjFHMjZXSXdsMGFCUWhQWkdobGtocDNHZThTbDBGK1BUZEw3ME0wWGtSOWtxbm5HS0dHSUdpVFRaMFl3UlJnZDhXa2JIV1kvSUNESWlCNEh6aUhJMHRJVDFmcXdLakQiLCJtYWMiOiI5OWI5NGQ4YWY0OWE2N2I5MDY3ZGRiMzg3ZDdjNDQyODBiNDUyNGQwNzAyOGE2NDg3MGQ5MjRjNTU4YzVhYmM1IiwidGFnIjoiIn0%3D; dopog_bilety_2026_session=eyJpdiI6ImdweVNkRUR1bUdSSW9GdnZBd2IwMHc9PSIsInZhbHVlIjoicUVNNFF1NnNCaktMMjNEYUVJSUlYSGdLUkZoRjd4dE5aYXllbkNhRDNoN2N5QmNaVTJ1Q3hwbzRzakVGUWd6dEVScVJNb0VPMkVjNDNic0hTa01vUmVTQitKd2lwTnE0U1M1dGplWUQyNU5TMVdrWWZnZVNmRmNjRDhKaEFickMiLCJtYWMiOiI1NmMxZTMzODA0NjY3MGZmNWQxOTJhYmNiY2M3ZWI4OThlZjBjZWMyNzhhNTZlNTI2YjgyOGEzYjgwMDU2YTdhIiwidGFnIjoiIn0%3D";

const client = axios.create({
    headers: {
        'Cookie': COOKIE_STRING,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
    },
    timeout: 30000,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    validateStatus: () => true 
});

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, retries = 5) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await client.get(url, options);
            if (res.status === 200) return res;
            if (res.status === 404) return res;
            
            if (res.status === 429) {
                console.warn(`[429] Rate limit hit for ${url}. Waiting 120 seconds before retry ${i+1}/${retries}...`);
                await delay(120000); // 2 minutes wait
                continue;
            }
            
            console.warn(`[Status ${res.status}] Fetch failed for ${url}. Attempt ${i+1}/${retries}`);
        } catch (err) {
            console.warn(`[Retry ${i+1}/${retries}] Fetch failed for ${url}: ${err.message}`);
        }
        await delay(5000 * (i + 1));
    }
    throw new Error(`Failed to fetch ${url} after ${retries} retries.`);
}

function sanitizeId(id) {
    return id.replace(/[^0-9]/g, '');
}

async function scrapeQuestionsForCourse(course, targetThemeId) {
    console.log(`\n\n=== Scraping course: ${course.name} ===`);
    let themesData = [];
    
    const courseUrl = `https://dopog-exam.ru/${course.id}`;
    let res = await fetchWithRetry(courseUrl);
    if (res.status !== 200) {
        console.error(`Failed to load course page ${courseUrl}. Status: ${res.status}`);
        return null;
    }
    
    const $ = cheerio.load(res.data);
    let themeIds = [];
    const themeRegex = new RegExp(`^https://dopog-exam.ru/${course.id}/(\\d+)\\?view=theme$`);
    
    $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (href) {
            const match = href.match(themeRegex);
            if (match && !themeIds.includes(match[1])) themeIds.push(match[1]);
        }
    });

    if (targetThemeId) {
        themeIds = themeIds.filter(id => id === targetThemeId);
    }
    
    console.log(`Found ${themeIds.length} themes for course ${course.id}`);
    let globalQCount = 0;

    for (const themeId of themeIds) {
        console.log(`\n--- Theme ${themeId} ---`);
        let themeQuestions = [];
        let page = 1;
        let hasNextPage = true;
        let themeTitle = `Тема ${themeId}`;

        while (hasNextPage) {
            const themePageUrl = `https://dopog-exam.ru/${course.id}/${themeId}?view=theme&page=${page}`;
            console.log(`  Fetching page ${page}: ${themePageUrl}`);
            
            let qRes = await fetchWithRetry(themePageUrl);
            if (qRes.status !== 200) break;
            
            const $t = cheerio.load(qRes.data);
            if (page === 1) {
                const fullTitle = $t('title').text().trim();
                themeTitle = fullTitle.split('(')[0].trim() || themeTitle;
                console.log(`  Title identified: ${themeTitle}`);
            }

            const questionLinks = [];
            const qRegex = new RegExp(`^https://dopog-exam.ru/${course.id}/${themeId}/(\\d+)\\?view=theme$`);
            
            $t('a').each((_, el) => {
                const href = $t(el).attr('href');
                if (href) {
                    const match = href.match(qRegex);
                    if (match && !questionLinks.some(l => l.url === href)) {
                        questionLinks.push({ url: href, id: match[1] });
                    }
                }
            });

            if (questionLinks.length === 0) break;

            for (const qEntry of questionLinks) {
                globalQCount++;
                if (globalQCount % 10 === 0) {
                    console.log("  [Rate Limit] Waiting 5 seconds...");
                    await delay(5000);
                } else {
                    await delay(500 + Math.random() * 500);
                }

                console.log(`    [Q ${globalQCount}] ${qEntry.url}`);
                let pRes = await fetchWithRetry(qEntry.url);
                if (pRes.status !== 200) continue;

                const $q = cheerio.load(pRes.data);
                const text = $q('div#question').text().trim();
                if (!text) continue;

                let imageUrl = null;
                const imgEl = $q('img').filter((_, el) => {
                    const src = $q(el).attr('src') || '';
                    return src.includes('/storage/questions/') || $q(el).attr('id') === 'questionImage' || $q(el).hasClass('qPage_questionImage');
                });

                if (imgEl.length > 0) {
                    const rawSrc = imgEl.attr('src');
                    if (rawSrc && !rawSrc.includes('svg') && !rawSrc.includes('favicon')) {
                        const fullSrc = rawSrc.startsWith('http') ? rawSrc : `https://dopog-exam.ru${rawSrc}`;
                        const filename = `dopog_${course.id}_${themeId}_${qEntry.id}.jpg`;
                        const filepath = path.join(imagesDir, filename);
                        
                        try {
                            const imgRes = await axios({
                                method: 'get',
                                url: fullSrc,
                                responseType: 'stream',
                                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                                headers: { 'Cookie': COOKIE_STRING }
                            });
                            
                            const writer = fs.createWriteStream(filepath);
                            imgRes.data.pipe(writer);
                            await new Promise((resolve, reject) => {
                                writer.on('finish', resolve);
                                writer.on('error', reject);
                            });
                            imageUrl = `/images/questions/${filename}`;
                        } catch(err) {
                            console.error(`      FImg Failed: ${fullSrc}`);
                        }
                    }
                }

                const options = [];
                let correctOptionId = null;
                $q('#answersList .qPage_answerElement').each((idx, el) => {
                    const inputEl = $q(el).find('input[type="radio"]');
                    const labelEl = $q(el).find('label.qPage_answer');
                    const optId = inputEl.attr('id') || `opt_${idx}`;
                    const isCorrect = $q(el).attr('itemprop') === 'acceptedAnswer';
                    let optText = labelEl.text().trim().replace(/^\d+\.\s*/, '');
                    
                    options.push({ id: sanitizeId(optId) || String(idx), text: optText });
                    if (isCorrect) correctOptionId = sanitizeId(optId) || String(idx);
                });

                themeQuestions.push({
                    text,
                    imageUrl,
                    options,
                    correctOption: correctOptionId,
                    explanation: $q('div#commentBlockText').text().trim() || null
                });
            }

            const nextPageEl = $t('a').filter((_, el) => $t(el).text().includes('>>') || $t(el).attr('href')?.includes(`page=${page + 1}`));
            if (nextPageEl.length > 0) {
                page++;
                await delay(2000);
            } else {
                hasNextPage = false;
            }
        }

        themesData.push({
            id: themeId,
            title: themeTitle,
            questions: themeQuestions
        });
    }

    return {
        id: String(course.id),
        title: course.name,
        themes: themesData
    };
}

async function main() {
    const targetThemeId = process.argv[2];
    console.log(`Starting DOPOG Scrape. Target Theme: ${targetThemeId || 'ALL'}`);
    
    let resultData = [];
    if (fs.existsSync(dataFilePath)) {
        try {
            resultData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        } catch (e) {
            resultData = [];
        }
    }

    for (const course of COURSES) {
        const scrapedCourse = await scrapeQuestionsForCourse(course, targetThemeId);
        if (scrapedCourse && scrapedCourse.themes.length > 0) {
            let existingCourse = resultData.find(c => c.id === String(course.id));
            if (!existingCourse || !existingCourse.themes) {
                if (existingCourse) {
                    const idx = resultData.indexOf(existingCourse);
                    resultData[idx] = scrapedCourse;
                } else {
                    resultData.push(scrapedCourse);
                }
            } else {
                scrapedCourse.themes.forEach(newTheme => {
                    const tIndex = existingCourse.themes.findIndex(t => t.id === newTheme.id);
                    if (tIndex > -1) existingCourse.themes[tIndex] = newTheme;
                    else existingCourse.themes.push(newTheme);
                });
            }
        }
    }
    
    if (!fs.existsSync(path.dirname(dataFilePath))) fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(resultData, null, 2));
    console.log(`\n\n✅ Scrape Step Complete! Saved to: ${dataFilePath}`);
}

main();
