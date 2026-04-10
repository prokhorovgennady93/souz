import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

const COOKIE_STRING = "_ym_uid=1774571187589330676; dopog_bilety_2026_session=eyJpdiI6ImgxUkZScjZWbkRhR1pxb3F4aUZtd1E9PSIsInZhbHVlIjoibnJMU0UwbWZxQ2FyY0RCQWU3MythdG1vbDNBcDFvOTNwSXdYekp0Q1I1SDVINDZJMnNzVWFvaFdjbEdPRHQwekRTc0JoVXkxTlVRbXErcDZ0V0M0MTNaMUcxeklYTWJydkNpMWFyYm1tZWlTZnhIWFZYSFc5WHBqK3JOLzZCbW8iLCJtYWMiOiI3ZWRhYTk5ODU1MjEyZmM4MjBlODQ1Yzg4YjNhNGE0OTk2ZGQzZDZmZTYzMWYyZTIwNjk4ZWFlNDZjMmQ0MTVhIiwidGFnIjoiIn0%3D";

const client = axios.create({
    headers: {
        'Cookie': COOKIE_STRING,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
    timeout: 15000,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

async function testThemePage() {
    const url = 'https://dopog-exam.ru/1/1001?view=theme';
    try {
        const res = await client.get(url);
        const $ = cheerio.load(res.data);
        console.log("Title (title tag):", $('title').text().trim());
        console.log("H1:", $('h1').text().trim());
        console.log("Breadcrumb:", $('.breadcrumb').text().trim());
        // Look for next page link
        const nextPage = $('a').filter((_, el) => $(el).text().includes('>>') || $(el).attr('href')?.includes('page=2')).attr('href');
        console.log("Next Page Link:", nextPage);
    } catch (e) {
        console.error(e.message);
    }
}

testThemePage();
