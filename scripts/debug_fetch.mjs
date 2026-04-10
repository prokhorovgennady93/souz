import https from 'https';
https.get('https://xn--g1afkd6e.xn--p1ai/ugadn/pog_bk_2020_b/0101.php', {rejectUnauthorized:false}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const index = data.indexOf('pdd__keyup');
    if (index !== -1) {
      console.log(data.substring(index - 100, index + 3000));
    } else {
      console.log('pdd__keyup NOT FOUND');
      console.log(data.substring(data.length - 3000));
    }
  });
}).on('error', (err) => console.error(err));
