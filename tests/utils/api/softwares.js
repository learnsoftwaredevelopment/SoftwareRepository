const Software = require("../../../models/software");

const sampleSoftwareInDb1 = {
  name: "SampleSoftware",
  homepage: "http://example.com",
  platforms: ["Windows"],
};

const sampleSoftwareInDb2 = {
  name: "SampleSoftware2",
  homepage: "http://apple.com",
  platforms: ["MacOS"],
};

const addSoftwareToDb = async (softwareObject) => {
  const softwareToAdd = new Software(softwareObject);
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
