const express = require('express');
const _ = require('lodash');

const pokemonController = require('./pokemon/pokemonController');

/**
 * Routes for the application.
 *
 * @returns {object} - Router.
 */
const routes = () => {
	const router = express.Router();

	// Merge together all of the routes from the various controllers
	const controllers = _.merge(
		{},
		pokemonController
	);

	// Add each of the routes to the Router
	_.forOwn(controllers, (controller, path) => {
		_.forOwn(_.pick(controller, ['all', 'get', 'post', 'put', 'delete']), (handler, method) => {
			console.log('Configuring to handle ', _.upperCase(method), ' requests on path ', path);
			router.route(path)[method](handler);
		});
	});
	return router;
};

module.exports = routes;
