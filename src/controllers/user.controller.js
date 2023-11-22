const bcrypt = require('bcrypt');
const yup = require('yup');
const { User, Nation } = require('../../models');
const { set, get, del } = require('../modules/redis');
const { sendEmail } = require('../middlewares/sendEmail');

const createUserSchema = yup.object().shape({
  fullName: yup.string().required('Nama lengkap harus diisi'),
  email: yup.array().of(
    yup.string().email().required('Email harus diisi'),
  ).unique('Email sudah ada'),
  password: yup.string().required('Password harus diisi').min(8, 'Password minimal 8 karakter'),
  passwordConfirm: yup.string()
    .oneOf([yup.ref('password'), null], 'Password harus sama'),
});

// const createUserSchema = yup.object().shape({
//   fullName: yup.string().required('Nama lengkap harus diisi'),
//   email: yup.string().email().required('Email harus diisi'),
//   password: yup.string().required('Password harus diisi').min(8, 'Password minimal 8 karakter'),
// });

const getAllUser = async (req, res) => {
  try {
    const data = await get('getAllUser');
    if (data) {
      res.status(200).json(data);
    } else {
      let { page, pageSize, fullName } = req.query;
      page = parseInt(page) || 1;
      pageSize = parseInt(pageSize) || 10;

      let where = {};
      if (fullName) {
        where = { fullName };
      }

      const user = await User.findAll({
        limit: pageSize,
        offset: (page - 1) * pageSize,
        where,
        include: [
          {
            model: Nation,
          },
        ],
      });

      const total = await User.count();

      // ada perubahan
      // const buildResponse = BuildResponse.get({ data: user, total });
      const resp = { data: user, total };

      res.status(200).json(resp);
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { body } = req;

    createUserSchema.validate(body)
      .then(async (valid) => {
        const { fullName, email, password } = valid;

        const saltRound = 10;
        const hashPassword = bcrypt.hashSync(password, saltRound);

        const resp = await User.create({
          fullName, email, password: hashPassword, status: 'Active',
        });

        await set(`user/${resp.id}`, resp);

        sendEmail('mifachry@gmail.com', email, 'Register user');

        res.status(201).json({ message: 'Berhasil tambah data' });
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const {
      fullName, email, status, NationId,
    } = body;
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error('User not found');
    }

    // await del(`user/${id}`);

    await User.update({
      fullName, email, status, NationId,
    }, { where: { id } });

    // const resp = await User.findByPk(id);

    // await set(`user/${resp.id}`, resp);

    // const buildResponse = BuildResponse.updated({});

    res.status(200).json({});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllUser,
  createUser,
  updateUser,
};

// .then(result => { 4a7b170f-9dcd-4667-9f55-ab54b3e81846
//     res.status(201).json({ message: 'Berhasil tambah data' })
// })
// .catch(err => {
//     res.status(500).json({ message: 'Internal server error' })
// });
// .then(result => {
//     res.json(result)
// })
// .catch(err => {
//     res.status(500).json({ message: 'Internal server error' })
// });
