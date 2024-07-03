
const URLs = [
  'http://localhost:3000/v1/internal-api-call',
  'http://localhost:3000/v1/test-statuses',
  'http://localhost:3000/v1/test-statuses',
  'http://localhost:3000/v1/test-statuses',
  'http://localhost:3000/v1/test-statuses',
  'http://localhost:3000/v1/test-statuses',
  'http://localhost:3000/v1/test-statuses',
  'http://localhost:3000/v1/test-post',
  'http://localhost:3000/v1/test-post',
  'http://localhost:3000/v1/test-post',
];
setInterval(async ()  => {
  const url = URLs[parseInt(Math.random() * URLs.length)];
  console.info(url);
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
    //  'content-type': 'application/json'
    },
    // body: JSON.stringify({secret: "19a8a3bf-739e-4d86-ba9a-28236b948a68"})
  });
  const body = await resp.text();
  console.info(body);
}, 1000);
