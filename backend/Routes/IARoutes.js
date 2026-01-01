const routes = require('express').Router();

const { matchApplicationWithOffer} = require('../Controllers/IAController');
const { protect, authorizeRole } = require('../Middlewares/AuthMiddleware');


routes.post('/match/:applicationId', matchApplicationWithOffer);

module.exports = routes;