const Software = require("../models/software");
const User = require("../models/user");

/**
 * To clean up values in fields of all documents which reference to the input software id
 * @param {Object} softwareId The software id of mongoose ObjectId type
 */
const cleanUpSoftwareReferences = async (softwareId) => {
  await User.updateMany(
    {
      $or: [
        { developerOf: softwareId },
        { maintainerOf: softwareId },
        { "contributions.softwaresAdded": softwareId },
        { "contributions.softwaresContributed": softwareId },
        { "meta.favourites": softwareId },
      ],
    },
    {
      $pull: {
        developerOf: softwareId,
        maintainerOf: softwareId,
        "contributions.softwaresAdded": softwareId,
        "contributions.softwaresContributed": softwareId,
        "meta.favourites": softwareId,
      },
    }
  );
};

/**
 * To clean up values in fields of all documents which reference to the input user id
 * @param {Object} userId The user id of mongoose ObjectId type
 */
const cleanUpUserReferences = async (userId) => {
  await Software.updateMany(
    {
      $or: [
        { developedBy: userId },
        { maintainedBy: userId },
        { "meta.addedByUser": userId },
        { "meta.updatedByUser": userId },
      ],
    },
    {
      $pull: {
        developedBy: userId,
        maintainedBy: userId,
      },
      "meta.addedByUser": null,
      "meta.updatedByUser": null,
    }
  );
};

module.exports = {
  cleanUpSoftwareReferences,
  cleanUpUserReferences,
};
