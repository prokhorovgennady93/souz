import https from 'https';

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testLogin() {
  const loginUrl = 'https://dopog-exam.ru/login';
  
  // 1. GET login page
  const getRes = await fetchUrl(loginUrl);
  console.log('GET Status:', getRes.status);
  
  const tokenMatch = getRes.data.match(/<meta name="csrf-token" content="([^"]+)">/i) || getRes.data.match(/name="_token" value="([^"]+)"/i);
  console.log('Token Match:', tokenMatch ? tokenMatch[1] : 'NOT FOUND');

  const inputs = [...getRes.data.matchAll(/<input[^>]+name="([^"]+)"(?:[^>]+value="([^"]*)")?/gi)];
  console.log('Form Inputs:', inputs.map(m => m[1] + '=' + (m[2] || '')));

  const cookies = getRes.headers['set-cookie'] || [];
  const sessionCookie = cookies.map(c => c.split(';')[0]).join('; ');

  console.log('Extracted Cookies:', sessionCookie);
  
  // 2. POST login page
  if (tokenMatch) {
     const token = tokenMatch[1];
     const postData = new URLSearchParams({
       '_token': token,
       'mode': '0',
       'email': 'grevelien@yandex.ru',
       'password': '3ghZ3Z32'
     }).toString();

     console.log('Posting Data...');

     const postRes = await fetchUrl(loginUrl, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
         'Cookie': sessionCookie,
         'Content-Length': Buffer.byteLength(postData),
         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
         'Referer': loginUrl
       },
       body: postData
     });

     console.log('POST Status:', postRes.status);
     console.log('POST Set-Cookie:', postRes.headers['set-cookie']);
     console.log('POST Location:', postRes.headers['location']);
  }
}

testLogin().catch(console.error);
