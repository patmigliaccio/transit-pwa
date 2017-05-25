const fs = require('fs')
		axios = require('axios'),
		qs	= require('qs'),
		cheerio = require('cheerio');

const CONFIG = require('./config'); 


/**
 * Initial executing function that makes a request to the transit site,
 * parses out relevant data, and writes the page to a temp .html file.
 * 
 */
function main() {
	request(CONFIG.host, CONFIG.options)
		.then(parse)
		.then(write)
		.catch(failure);
}


/**
 * Makes a POST request to the specified URL and 
 * converts an options object in query params.
 * 
 * Uses: https://github.com/mzabriskie/axios
 * 
 * @param {String} url 
 * @param {Options} options 
 * @returns {Promise}
 */
function request(url, options){
	if (!options) options = {};

	return axios.post(url, qs.stringify(options))
		.then(response => response.data);
}


/**
 * Parses out HTML using based on defined selectors 
 * in CONFIG and logs them to the console for viewing.
 * 
 * Uses: https://github.com/cheeriojs/cheerio
 * 
 * @param {String} html 
 * @returns {String}
 */
function parse(html) {
	let $ = cheerio.load(html);

	for (selector in CONFIG.selectors){
		if (CONFIG.selectors[selector]){
			let value = $(CONFIG.selectors[selector]).text();
			console.log(value);	
		}
	}

	return html;
}


/**
 * Writes HTML to a temporary webpage for viewing.
 * 
 * @param {String} html 
 */
function write(html){
	let dir = './temp/';

	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}

	var tmpPath = dir + 'webpage-' + new Date().getTime() + '.html';
	fs.writeFileSync(tmpPath, html);
}


/**
 * Logs exceptions to the console.
 * 
 * @param {any} err 
 */
function failure(err){
	console.error(err);
}

main();