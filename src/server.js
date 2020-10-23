const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/config');
const config = require('./config');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get(`${config.basePath}hello`, (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post(`${config.basePath}world`, (req, res) => {
  console.log(req.body);
  res.send(
	`I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

/**
 * @swagger
 * tags:
 *   name: health-controller
 *   description: Health services.
 * /ping:
 *   get:
 *     tags: ['health-controller']
 *     summary: Returns 'pong' if gateway is up.
 *     responses:
 *       200:
 *         description: OK.
 *         schema:
 *           type: string
 */
app.get(`${config.basePath}ping`, (request, response) => {
	response.status(200).send('pong');
});

app.get(`${config.basePath}api-docs`, (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});
app.get(`${config.basePath}swagger-ui$`, (req, res) => {
	// swagger-ui requires the trailing '/', but the built-in redirect does so without the full path on OpenShift.
	res.redirect('swagger-ui/');
});
app.use(`${config.basePath}swagger-ui/`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`${config.basePath}`, require('./routes')());

app.listen(port, () => console.log(`Listening on port ${port}`));
