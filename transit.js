const fs = require('fs')
		axios = require('axios'),
		qs	= require('qs'),
		cheerio = require('cheerio');

const CONFIG = require('./config'); 

axios.post(CONFIG.host, qs.stringify(CONFIG.options))
	.then(response => parse(response.data))
	//.then(write)
	.catch(failure);

function parse(data) {
	let $ = cheerio.load(data);

	for (selector in CONFIG.selectors){
		if (CONFIG.selectors[selector]){
			let value = $(CONFIG.selectors[selector]).text();
			console.log(value);	
		}
	}

	return data;
}

function write(html){
	let dir = './temp/';

	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}

	var tmpPath = dir + 'webpage-' + new Date().getTime() + '.html';
	fs.writeFileSync(tmpPath, html);
}

function failure(response){
	console.error(response);
}