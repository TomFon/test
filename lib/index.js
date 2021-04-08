// const { readFileSync } = require('fs');
// const { join } = require('path');
// const rules = require('./rules');
// const fileText = readFileSync(join(process.cwd(), 'proxyConfig'), 'utf-8');
// rules.parse(fileText);
const express = require('express');
const port = 6666;
const inspector = require('./inspector');
const middleWare = [...inspector];
const app = express();
const http = require('http');
middleWare.map(function (m) {
	app.use(typeof m === 'string' ? require(m) : m);
});
var server = http.createServer();

server.on('request', app);
server.listen(port, function () {
	console.log('代理服务器已启动，端口为' + port);
});
const net = require('net');

server.on('connect', (req, clientSocket, head) => {
	const { port, hostname } = new URL(`http://${req.url}`);
	console.log(`链接是：${req.url}`, `端口号：${port}`, `域名是：${hostname}`);
	clientSocket.write(
		'HTTP/1.1 200 Connection Established\r\n' +
			'Proxy-agent: MITM-proxy\r\n' +
			'\r\n'
	);

	const serverSocket = new net.Socket()
		.connect(port, hostname, () => {
			clientSocket.pipe(serverSocket);
			serverSocket.pipe(clientSocket);
			clientSocket.on('error', () => {
				//console.log('clientSocket error')
			});
			clientSocket.on('close', () => {
				//console.log('clientSocket close')
			});
			serverSocket.on('error', () => {
				//console.log('serverSocket error')
			});
			serverSocket.on('close', () => {
				//console.log('serverSocket close')
			});
		})
		.on('error', function (e) {
			console.error(`请求遇到问题: ${e.message}`);
			serverSocket.destroy();
		});
});
