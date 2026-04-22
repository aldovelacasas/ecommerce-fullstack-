const getHealth = (req, res) => {
  res.json({
    ok: true,
    message: "Servidor funcionando correctamente"
  });
};

module.exports = {
  getHealth
};