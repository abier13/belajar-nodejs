const { Nation } = require('../../models');

const createNation = async (req, res) => {
  try {
    const body = req.body;
    await Nation.create(body);

    res.status(201).json({ message: 'Berhasil tambah data' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createNation };
