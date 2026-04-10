import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

async function login() {
  try {
    // 1. GET login page to obtain CSRF and session cookies
    console.log('Fetching login page...');
    const getRes = await client.get('https://dopog-exam.ru/login');
    
    // Extract CSRF token
    const tokenMatch = getRes.data.match(/<meta name="csrf-token" content="([^"]+)">/i) || 
                       getRes.data.match(/name="_token" value="([^"]+)"/i);
    const token = tokenMatch ? tokenMatch[1] : null;

    import('fs').then(fs => fs.writeFileSync('/tmp/login_body.html', getRes.data));
    console.log('CSRF Token:', token);

    if (!token) throw new Error('CSRF token not found');

    // 2. POST login credentials
    console.log('Posting credentials...');
    const postData = new URLSearchParams({
      '_token': token,
      'mode': '0',
      'email': 'grevelien@yandex.ru',
      'password': '3ghZ3Z32'
    });

    const postRes = await client.post('https://dopog-exam.ru/login', postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://dopog-exam.ru/login'
      },
      // Axios handles 302 redirects automatically if followRedirects is true (default)
    });

    // 3. Verify login by fetching home page and looking for premium indicators
    const homeRes = await client.get('https://dopog-exam.ru/1');
    console.log('Login successful? Reached Home:', homeRes.data.includes('grevelien@yandex.ru') || !homeRes.data.includes('mode=0'));

    // Print all cookies in jar for future use
    const cookies = await jar.getCookies('https://dopog-exam.ru');
    const cookieStr = cookies.map(c => `${c.key}=${c.value}`).join('; ');
    console.log('Final Cookies:', cookieStr);
    
    // Save cookies to a file
    import('fs').then(fs => {
        fs.writeFileSync('cookie_session.txt', cookieStr);
    });
  } catch (err) {
    console.error('Error during login:', err.message);
    if (err.response && err.response.data) {
        console.error('Validation errors:', err.response.data);
    }
  }
}

login();
