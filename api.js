const https = require('https');
const url = require('./url.json');

module.exports = {
	get: function(request) {
		return new Promise(function(resolve, reject) {
			https.get(`https://api-ratp.pierre-grimaud.fr/v4/${request}`, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});
				resp.on('end', () => {
					if (resp.statusCode != 200) {
						reject(JSON.parse(data));
					}
					resolve(JSON.parse(data));
				});
			}).on('error', (err) => {
				reject(new Error(err.message));
			});
		});
	},
	checkType: function(type) {
		if (type === 'bus') {
			return 'buses';
		}
		if (['N', 'n', 'noctilien', 'noctiliens', 'busn'].includes(type)) {
			return 'noctiliens';
		}
		if (['rer', 'rers'].includes(type)) {
			return 'rers';
		}
		if (['metro', 'm', 'metros'].includes(type)) {
			return 'metros';
		}
		if (['T', 'tramway', 'tramways', 't'].includes(type)) {
			return 'tramways';
		}
		return null;
	},
	checkTypeweb: function(type) {
		if (type === 'buses') {
			return url.plan_type.buses_plan;
		}
		if (['N', 'n', 'noctilien', 'noctiliens', 'busn'].includes(type)) {
			return url.plan_type.noctiliens_plan;
		}
		if (['rer', 'rers'].includes(type)) {
			return url.plan_type.rers_plan;
		}
		if (['metro', 'm', 'metros'].includes(type)) {
			return url.plan_type.metros_plan;
		}
		if (['T', 'tramway', 'tramways', 't'].includes(type)) {
			return url.plan_type.tramways_plan;
		}
		return null;
	},
};