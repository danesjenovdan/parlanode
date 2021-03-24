const fs = require('fs-extra');
const data = require('../../data');

function refetchData(req, res) {
  Promise.resolve()
    .then(() => data.refetch())
    .then((error) => {
      if (!error) {
        res.json({
          ok: true,
          message: 'Finished refetch',
        });
      } else {
        res.json({
          ok: false,
          message: 'Failed refetch',
          error,
        });
      }
    });
}

function listLegislationIcons(req, res) {
  fs.readdir('./parlassets/icons/legislation')
    .then((files) => {
      const icons = files.filter(f => f.toLowerCase() !== 'readme.md');
      res.json({
        icons,
      });
    })
    .catch((pError) => {
      // eslint-disable-next-line no-console
      console.error(pError);
      res.send(`Error: ${pError.message}`);
    });
}

module.exports = {
  refetchData,
  listLegislationIcons,
};
