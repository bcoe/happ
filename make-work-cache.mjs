
setInterval(async ()  => {

const resp = await fetch('http://127.0.0.1:3000/v1/habits-daily', {
  method: 'GET',
  headers: {
    'content-type': 'application/json'
  },
  // body: JSON.stringify({secret: "19a8a3bf-739e-4d86-ba9a-28236b948a68"})
});
  const body = await resp.text();
  console.info(body);
}, 1000);
