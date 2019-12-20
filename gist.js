let gistURL = process.env.INPUT_GISTURL;
let token = process.env.INPUT_TOKEN;
let fs = require('fs');
let https = require('https');

console.log('Gist URL:', gistURL);
let gistID = gistURL.split('/')[4]
console.log('Gist ID is:', gistID);

let options = {
    'headers': {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'actions/get-gist-action'
    }
}

https.get(`https://api.github.com/gists/${gistID}`, options, (resp) => {
  let data = '';
  console.log(`GitHub response HTTP status: ${resp.statusCode}`);
    
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
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
