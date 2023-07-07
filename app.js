const http = require('http');
const fs = require('fs');
const axios = require('axios');
const qs = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

const BASE_URL = 'https://notify-api.line.me';
const PATH = '/api/notify';
const LINE_TOKEN = 'Your_Line_Token'; // Replace with your own LINE token

const server = http.createServer((req, res) => {
    if(req.url === '/notify' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();  // Here, 'body' is the classLabel from the client.
        });
        req.on('end', () => {
            const config = {
                baseURL: BASE_URL,
                url: PATH,
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${LINE_TOKEN}`
                },
                data: qs.stringify({
                    message: body,
                })
            };

            (async function(){
                try {
                    const response = await axios.request(config);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(response.data));
                } catch(err) {
                    res.statusCode = 500;
                    res.end('Error sending LINE notification');
                }
            })();
        });
    } else {
        fs.readFile('index.html', function(err, data) {
            if(err) {
                res.statusCode = 500;
                res.end('Error loading index.html');
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                res.end(data);
            }
        });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
