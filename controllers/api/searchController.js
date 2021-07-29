const Software = require('../../models/software');

const searchSoftware = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 0;
  const perPage = parseInt(req.query.per_page, 10) || 30;
  const query = {
    name: {
      $regex: req.query.q,
      $options: 'i',
    },
  };

  const queryResponse = await Software.find(query)
    .sort({ name: 'asc' })
    .skip(page * perPage)
    .limit(perPage);

  const totalQueryResultCount = await Software.find(query).countDocuments();

  return res.status(200).json({
    totalQueryResultCount,
    queryResponse,
  });
};

module.exports = {
  searchSoftware,
};
