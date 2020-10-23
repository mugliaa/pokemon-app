const request = require('request-promise');
const shortid = require('shortid');

/**
 * Use the client request headers to generate the headers to be used for an outgoing request.
 *
 * @param {object} clientRequestHeaders - The request headers from the client.
 * @returns {Request} - The headers to be passed along with an outgoing request.
 */
const generateOutgoingHeaders = (clientRequestHeaders) => {
	const outgoingHeaders = {};
	outgoingHeaders['accept'] = 'application/json';
	outgoingHeaders['authorization'] = clientRequestHeaders['authorization'];
	return outgoingHeaders;
};

/**
 * Handles sending a request to the url specified.
 *
 * @param {object} requestOptions - The request information, must contain the url.
 * @returns {Promise} - Resolves to the response object.
 */
const proxyRequest = (requestOptions) => request({
	credentials: 'same-origin',
	strictSSL: false,
	gzip: true,
	simple: false, // prevents non 2xx response codes from being rejected
	resolveWithFullResponse: true,
	transform2xxOnly: true, // prevents non 2xx response codes from being transformed so we have access to original JSON
	...requestOptions,
});

/**
 * Log the error details before returning an error response.
 *
 * @param {string} errorMessage - The error message being returned.
 * @param {string} ticketId - The support ticket ID.
 * @param {Request} clientRequest - The request object originating from the client.
 */
const logError = (errorMessage, ticketId, clientRequest) => {
	const userId = (clientRequest && clientRequest.user && clientRequest.user.userId) || '';
	const originalUrl = (clientRequest && clientRequest.originalUrl) || '';
	console.error(`Error message: ${errorMessage}.\nSupport Ticket ID: ${ticketId}.\nUser ID: ${userId}.\nRequested URL: ${originalUrl}.`);
};

/**
 * Handles returning the response body with a 200 status code when the underlying service
 * call was successful and returned data.
 *
 * @param {Response} serverResponse - The response from the server.
 * @param {Response} clientResponse - The response that will be sent to the client.
 * @param {object} options - Response options.
 * @param {boolean} options.isJson - Whether or not to convert response body to JSON.
 */
const respondWith200 = (serverResponse, clientResponse, { isJson = true } = {}) => {
	if (isJson) {
		clientResponse.status(200).json(serverResponse.body);
	} else {
		// Copy content-related headers for non-JSON responses
		const serverResponseHeaders = serverResponse.headers;
		if (serverResponseHeaders['content-type']) {
			clientResponse.set('content-type', serverResponseHeaders['content-type']);
		}
		if (serverResponseHeaders['content-language']) {
			clientResponse.set('content-language', serverResponseHeaders['content-language']);
		}
		if (serverResponseHeaders['content-disposition']) {
			clientResponse.set('content-disposition', serverResponseHeaders['content-disposition']);
		}
		clientResponse.status(200).send(serverResponse.body);
	}
};

/**
 * The gateway failed to connect to the server or the gateway had an internal error. The request failed due to technical reasons.
 *
 * @param {object} error - Error information.
 * @param {Response} response - The response object.
 * @param {Request} clientRequest - The request object originating from the client.
 */
const handleRequestError = (error, response, clientRequest) => {
	const errorMessage = error.message || 'Could not process request';
	const ticketId = shortid.generate();
	logError(errorMessage, ticketId, clientRequest);
	response.status(500).json({
		error: errorMessage,
		ticketId,
	});
};

/**
 * Handles passing the auth challenge response back to the client.
 *
 * @param {Response} serverResponse - The response from the server.
 * @param {Response} clientResponse - The response that will be sent to the client.
 */
const respondWith401 = (serverResponse, clientResponse) => {
	const { statusMessage } = serverResponse;
	clientResponse.status(401).json({ error: statusMessage });
};

/**
 * Handles returning an empty response with a 404 status code.
 *
 * @param {Response} serverResponse - The response from the server.
 * @param {Response} clientResponse - The response that will be sent to the client.
 */
const respondWith404 = (serverResponse, clientResponse) => {
	clientResponse.status(404).json();
};

/**
 * Handles returning the appropriate response when the underlying service returns a 500 response.
 *
 * @param {Response} serverResponse - The response from the server.
 * @param {Response} clientResponse - The response that will be sent to the client.
 * @param {Request} clientRequest - The request object originating from the client.
 */
const respondWith502 = (serverResponse, clientResponse, clientRequest) => {
	const isJson = serverResponse.headers['content-type']
		&& serverResponse.headers['content-type'].includes('application/json');
	// Include downstream error message and ticket if underlying service provided error JSON
	const underlyingMessage = (isJson && (serverResponse.body.errorMsg || serverResponse.body.error)) || '';
	const underlyingTicket = (isJson && serverResponse.body.ticketId) || '';

	// Log error details, generating our own support ticket
	const errorMessage = 'Error in underlying service call.  Service returned with '
		+ `status: ${serverResponse.statusCode}, message: "${underlyingMessage}", and ticket: "${underlyingTicket}"`;
	const ticketId = shortid.generate();
	logError(errorMessage, ticketId, clientRequest);

	clientResponse.status(502).json({
		error: errorMessage,
		ticketId,
	});
};

module.exports = {
	generateOutgoingHeaders,
	handleRequestError,
	logError,
	proxyRequest,
	respondWith200,
	respondWith401,
	respondWith404,
	respondWith502,
};
