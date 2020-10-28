const Software = require('../../../models/software');

const sampleSoftwareInDb1 = {
  name: 'SampleSoftware',
  description: 'A sample software 1',
  homePage: 'http://example.com',
  platforms: ['Windows'],
  isActiveDevelopment: true,
};

const sampleSoftwareInDb2 = {
  name: 'SampleSoftware2',
  description: 'A sample software 1',
  homePage: 'http://apple.com',
  platforms: ['MacOS'],
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

const softwaresInDb = async () => {
  const softwares = await Software.find({});
  return softwares;
};

module.exports = {
  softwaresInDb,
  addSoftwareToDb,
  sampleSoftwareInDb1,
  sampleSoftwareInDb2,
};
