const dotObject = require('dot-object');
const Software = require('../../models/software');
const User = require('../../models/user');
const databaseUtils = require('../../utils/databaseUtils');

const getSoftware = async (req, res) => {
  const softwares = await Software.find({}).populate([
    {
      path: 'meta.addedByUser',
      select: 'username name',
    },
    {
      path: 'meta.updatedByUser',
      select: 'username name',
    },
  ]);
  res.status(200).json(softwares);
};

const postSoftware = async (req, res) => {
  const { body } = req;
  const userId = body.decodedToken.backendId;

  // Refer to software Model for required parameters.
  const softwareObject = {
    ...body,
    meta: {
      ...body.meta,
      addedByUser: userId,
      updatedByUser: userId,
    },
  };

  delete softwareObject.token;

  const softwareAdded = new Software(softwareObject);

  const savedSoftware = await softwareAdded.save();

  const user = await User.findById(userId);

  user.contributions.softwaresAdded = user.contributions.softwaresAdded.concat(
    savedSoftware._id,
  );
  // eslint-disable-next-line max-len
  user.contributions.softwaresContributed = user.contributions.softwaresContributed.concat(savedSoftware._id);

  await user.save();

  const saved = await savedSoftware.populate([
    {
      path: 'meta.addedByUser',
      select: 'username name',
    },
    {
      path: 'meta.updatedByUser',
      select: 'username name',
    },
  ]);

  return res.status(201).json(saved);
};

const patchSoftwareById = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const userId = body.decodedToken.backendId;

  // To configure dotObject transformation to not modify how the array is represented.
  dotObject.keepArray = true;

  let newSoftware = {
    ...body,
  };

  newSoftware.meta.updatedByUser = userId;

  // Transform object to dot notaton (dotted key and value pairs)
  // This serves as a workaround for mongoose update of nested objects
  newSoftware = dotObject.dot(newSoftware);

  const updatedSoftware = await Software.findByIdAndUpdate(id, newSoftware, {
    new: true,
  });

  if (updatedSoftware === null) {
    return res.status(404).end();
  }

  const user = await User.findById(userId);

  if (!user.contributions.softwaresContributed.includes(id)) {
    // eslint-disable-next-line max-len
    user.contributions.softwaresContributed = user.contributions.softwaresContributed.concat(updatedSoftware._id);
    await user.save();
  }

  const updated = await updatedSoftware.populate([
    {
      path: 'meta.addedByUser',
      select: 'username name',
    },
    {
      path: 'meta.updatedByUser',
      select: 'username name',
    },
  ]);

  return res.status(200).json(updated);
};

const getSoftwareById = async (req, res) => {
  const { id } = req.params;

  const software = await Software.findById(id);

  if (software === null) {
    return res.status(404).end();
  }

  const response = await software.populate([
    {
      path: 'meta.addedByUser',
      select: 'username name',
    },
    {
      path: 'meta.updatedByUser',
      select: 'username name',
    },
  ]);

  return res.status(200).json(response);
};

const deleteSoftwareById = async (req, res) => {
  const { id } = req.params;

  const response = await Software.findByIdAndDelete(id);

  if (response === null) {
    return res.status(404).end();
  }

  // To clean up fields in documents that have reference to the deleted software.
  databaseUtils.cleanUpSoftwareReferences(id);

  return res.status(204).end();
};

const getRecentAddedSoftware = async (req, res) => {
  const count = parseInt(req.query.count, 10) || 5;

  const response = await Software.find({})
    .sort({ createdAt: 'desc' })
    .limit(count)
    .populate('meta.addedByUser', { username: 1, name: 1 })
    .populate('meta.updatedByUser', { username: 1, name: 1 });

  return res.status(200).json(response);
};

const getRecentUpdatedSoftware = async (req, res) => {
  const count = parseInt(req.query.count, 10) || 5;

  const response = await Software.find({})
    .sort({ updatedAt: 'desc' })
    .limit(count)
    .populate('meta.addedByUser', { username: 1, name: 1 })
    .populate('meta.updatedByUser', { username: 1, name: 1 });

  return res.status(200).json(response);
};

module.exports = {
  getSoftware,
  postSoftware,
  patchSoftwareById,
  getSoftwareById,
  deleteSoftwareById,
  getRecentAddedSoftware,
  getRecentUpdatedSoftware,
};
