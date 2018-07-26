
function render(req, res) {
  const { name } = req.params;
  const { title, image, icon, acronym, h1, h2 } = req.query;

  res.send(req.query);
}

module.exports = {
  render,
};
