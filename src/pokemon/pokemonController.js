const {
	respondWith200,
	respondWith401,
	respondWith502,
	handleRequestError,
} = require('../proxy/proxyUtil');
const { chainPokemonCalls } = require('./pokemonServiceChain');

/**
 * @swagger
 * tags:
 *   name: pokemon-controller
 *   description: Pokemon services.
 * /pokemon:
 *   get:
 *     tags: ['pokemon-controller']
 *     summary: Retrieve the Pokemon listing.
 *     description: |
 *       ## Description
 *       Retrieve the Pokemon listing from PokeAPI.
 *       ## Services
 *       `https://pokeapi.co/api/v2/pokemon?limit=151`
 *       `https://pokeapi.co/api/v2/pokemon/{id}`
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Pokemon listing was retrieved successfully.
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               name:
 *                 type: string
 *               abilities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ability:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                     isHidden:
 *                       type: boolean
 *                 baseExperience:
 *                   type: number
 *       502:
 *         description: The underlying service encountered an exception.
 *         schema:
 *           $ref: '#/definitions/Error'
 */
/**
 * Retrieve the Pokemon listing.
 *
 * @param {Request} clientRequest - The request object originating from the client.
 * @param {Response} clientResponse - The response object that will be returned to the client.
 * @returns {Promise} - Resolves to the Pokemon listing.
 */
const retrievePokemon = (clientRequest, clientResponse) => {
	console.log('calling retrievePokemon');

	return chainPokemonCalls(clientRequest.headers).then((response) => {
		if (response.statusCode === 200) {
			respondWith200(response, clientResponse);
		} else {
			respondWith502(response, clientResponse, clientRequest);
		}
	})
		.catch((error) => handleRequestError(error, clientResponse, clientRequest));
};

module.exports = {
	'/pokemon': {
		get: retrievePokemon,
	},
	retrievePokemon,
};
