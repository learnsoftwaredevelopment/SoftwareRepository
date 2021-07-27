const Software = require('../../models/software');

const searchSoftware = async (req, res) => {
  const { name } = req.query;
  const response = await Software.find({
    name: {
      $regex: name,
      $options: 'i',
    },
  });
  return res.status(200).json(response);
};

module.exports = {
  searchSoftware,
};
