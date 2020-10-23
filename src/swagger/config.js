module.exports = require('swagger-jsdoc')({
	definition: {
		basePath: '/api',
		info: {
			title: 'API for Pokemon App',
			version: '1.0.0',
			contact: {
				name: 'Adam Muglia',
			},
		},
		consumes: ['application/json'],
		produces: ['application/json'],
	},
	apis: [
		'./src/swagger/definitions.yaml',
		'./src/*/*Controller.js',
		'./src/server.js',
	], // Path to the API docs
});
