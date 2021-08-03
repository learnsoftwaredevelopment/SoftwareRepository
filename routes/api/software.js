const softwareRouter = require('express').Router();
const middleware = require('../../utils/middleware');
const softwareController = require('../../controllers/api/softwareController');

softwareRouter.get('/', softwareController.getSoftware);

softwareRouter.get('/added/recent', softwareController.getRecentAddedSoftware);

softwareRouter.get(
  '/updates/recent',
  softwareController.getRecentUpdatedSoftware,
);

softwareRouter.post(
  '/',
  middleware.tokenValidation,
  softwareController.postSoftware,
);

softwareRouter.patch(
  '/:id',
  middleware.tokenValidation,
  softwareController.patchSoftwareById,
);

softwareRouter.get('/:id', softwareController.getSoftwareById);

softwareRouter.delete(
  '/:id',
  middleware.tokenValidation,
  softwareController.deleteSoftwareById,
);

module.exports = softwareRouter;
