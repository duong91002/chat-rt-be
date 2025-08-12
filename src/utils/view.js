const viewOne = (res, data) => {
  return res.status(200).json({ data });
};

const viewAll = (res, data) => {
  const { totalEntries, totalPages, currentPage } = data;
  return res.status(200).json({
    data: data.data,
    totalEntries,
    totalPages,
    currentPage,
  });
};
module.exports = {
  viewOne,
  viewAll,
};
