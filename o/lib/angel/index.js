const request = require('request');
const cheerio = require('cheerio');

const angelsHeaders = {  'Accept': 'application/json, text/javascript, */*; q=0.01', 'X-Requested-With': 'XMLHttpRequest' };

class angelScraper {
	static getAngels(city, callback) {
		this.fetchAngels(city, (angelData) => {
			callback(angelData);
		});
	}

	static fetchAngels(city, callback) {
		const requestOptions = {
			url: `https://angel.co/${city}/investors?page=1&sort=investments`,
			headers: angelsHeaders,
		}
		request(requestOptions, (err, res, body) => {
			if (!err && res.statusCode == 200) {
				this.parseAngelHTML(JSON.parse(body).html, (angelData) => {
					callback(angelData);
				});
			}
		});
	}

	static parseAngelHTML(htmlCrap, callback) {
		let $ = cheerio.load(htmlCrap);
		console.log($('div[data-_tn="tags/show/results"]').children().length)
		let cityAngels = []
		$('div[data-_tn="tags/show/results"]').children().each(function(i, elem) {
  		let fullName = $(this).find('a[data-type="User"]').text();
  		let blurb = $(this).find('div[class="blurb"]').text();
  		let city = $(this).find('div[class="tags"]').children().first().text();
  		let industry = $(this).find('div[class="tags"]').children().last().text();
  		let investments = $(this).find('div[data-column="investments"]').children().last().text();
  		let followers = $(this).find('div[data-column="followers"]').children().last().text();

  		cityAngels.push({fullName, blurb, city, industry, investments, followers});
		});
		callback(cityAngels);
	}

	static getUnifiedData(name, callback) {
		const requestURL = `https://api.rocketreach.co/v1/api/search?name=${name}&api_key=5fd68ke426e1ec3fad6c57b1400f7ab60648ee`;
		console.log(requestURL);
		request(requestURL, (err, res, body) => {
			if (!err) {
				callback(JSON.parse(body));
			}
		});
	}

	static searchBing(name, callback) {
		const requestOptions = {
			url: `https://api.cognitive.microsoft.com/bing/v5.0/search?q=${name}`,
			headers: { 'Ocp-Apim-Subscription-Key' : '8759964d9eb946e8820864effad545fd'},
		}
		request(requestOptions, (err, res, body) => {
			if (!err) {
				callback(JSON.parse(body).webPages.totalEstimatedMatches);
			}
		});
	}
}

module.exports = angelScraper;