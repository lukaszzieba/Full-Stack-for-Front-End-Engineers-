const http = require('http');

http.createServer(function(req, res) {
	res.write('tada');
	res.end();
}).listen(3000)

console.log('Sserver is litening on port 3000');
