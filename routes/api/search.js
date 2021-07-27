const searchRouter = require('express').Router();
const searchController = require('../../controllers/api/searchController');

searchRouter.get('/software', searchController.searchSoftware);

module.exports = searchRouter;
