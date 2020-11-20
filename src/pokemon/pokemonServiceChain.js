const _ = require('lodash');
const { proxyRequest, generateOutgoingHeaders } = require("../proxy/proxyUtil");

const transform = (body, response) => {
	const keys = { is_hidden: 'isHidden' };
	return {
		...response,
		body: response.statusCode === 200
			? {
				id: body.id,
				name: body.name,
				abilities: body.abilities.map((obj) => (
					_.mapKeys(obj, (value, key) => (
						key in keys ? keys[key] : key
					))
				)),
				baseExperience: body.base_experience,
			}
			: undefined,
	};
};

const getPokemon = (clientRequestHeaders) => {
	const params = new URLSearchParams();
	params.append('limit', '151');
	const serviceUrl = 'https://pokeapi.co/api/v2/pokemon?' + params;

	return proxyRequest({
		url: serviceUrl,
		method: 'GET',
		headers: generateOutgoingHeaders(clientRequestHeaders),
		json: true,
	});
};

const getPokemonDetails = (serviceUrl, clientRequestHeaders) => {
	return proxyRequest({
		url: serviceUrl,
		method: 'GET',
		headers: generateOutgoingHeaders(clientRequestHeaders),
		json: true,
		transform2xxOnly: true,
		transform,
	});
};

const chainPokemonCalls = (clientRequestHeaders) => getPokemon(clientRequestHeaders)
	.then((pokemonResponse) => {
		const { body } = pokemonResponse;
		const pokemon = _.map(body.results, 'url');

		let result = [];

		const newPromises = _.map(pokemon, (serviceUrl) => {
			return getPokemonDetails(serviceUrl, clientRequestHeaders).then(({ body }) => {
				result.push(body);
			});
		});

		return Promise.all(newPromises).then(() => {
			return {
				...pokemonResponse,
				body: _.orderBy(result, 'id', 'asc'),
			};
		});
	});

module.exports = {
	chainPokemonCalls,
};
