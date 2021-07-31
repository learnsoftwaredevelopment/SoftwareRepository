const Software = require('../../../models/software');

const sampleSoftwareInDb1 = {
  name: 'SampleSoftware',
  shortDescription: 'A sample short description 1',
  description: 'A sample software 1',
  homePage: 'http://example.com',
  platform: 'Windows',
  pricing: 'free',
  isActiveDevelopment: true,
};

const sampleSoftwareInDb2 = {
  name: 'SampleSoftware2',
  shortDescription: 'A sample short description 2',
  description: 'A sample software 1',
  homePage: 'http://apple.com',
  platform: 'MacOS',
  pricing: 'paid',
  isActiveDevelopment: false,
};

const addSoftwareToDb = async (softwareObject, addedByUser, updatedByUser) => {
  const softwareToAdd = new Software({
    ...softwareObject,
    meta: {
      addedByUser,
      updatedByUser,
    },
  });
  await softwareToAdd.save();
};

const softwareInDb = async () => {
  const software = await Software.find({});
  return software;
};

module.exports = {
  softwareInDb,
  addSoftwareToDb,
  sampleSoftwareInDb1,
  sampleSoftwareInDb2,
};
