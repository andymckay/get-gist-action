let gistURL = process.env.INPUT_GISTURL;
let fs = require('fs');
let https = require('https');

console.log('Gist URL:', gistURL);
let gistID = gistURL.split('/')[4]
console.log('Gist ID is:', gistID);

let options = {
    'headers': {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'actions/get-gist-action'
    }
}

https.get(`https://api.github.com/gists/${gistID}`, options, (resp) => {
  if (resp.statusCode !== 200) {
    console.log(`Got an error: ${resp.statusCode}`);
    process.exit(1)
  }

  let data = '';
  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    console.log('Gotten gist successfully from GitHub.')
    let parsed = JSON.parse(data);
    if (!parsed.files) {
        console.log("Error: not a successful response.");
        return;
    }
    let files = Object.values(parsed.files);
    if (files.length != 1) {
        console.log("Error: looking for one and only one file.");
        return;
    }
    let file = files[0];
    fs.writeFile(`/tmp/${file['filename']}`, file['content'],
    function(err) {
        if (err) throw err;
        console.log(`Gist is written to /tmp/${file['filename']} successfully.`);
        process.stdout.write(`::set-output name=file::/tmp/${file['filename']}`);
    });
  });

}).on("error", (err) => {
  console.log(`Error getting gist: ${err.message}`);
});
