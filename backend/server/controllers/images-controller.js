const User = require('../models/user-model');
const Product = require('../models/product-model');
const path = require('path');
const fs = require('fs');

const ctrl = {};

ctrl.uploadUser = async (req, res) => {
  const logedUser = req.user.user;
  let image = req.img;

  // console.log(logedUser);

  const paramID = req.params.id;

  let id;
  if (paramID && !(logedUser.role === 'ADMIN_ROLE')) {
    return res.status(401).json({
      status: false,
      err: {
        msg: 'No tiene permisos para realizar esta accion.',
      },
    });
  }

  id = paramID ? paramID : logedUser._id;

  const fileName = `${id}-${new Date().getMilliseconds()}.${image.ext}`;

  image = image.file;
  const outDir = path.resolve(
    __dirname,
    `../../uploads/images/users/${fileName}`
  );

  image.mv(outDir, (err) => {
    if (err)
      return res.status(500).json({
        status: false,
        err,
      });

    updateUserImg(res, id, fileName);
  });
};

ctrl.uploadProduct = async (req, res) => {
  const prod = req.params.id;
  let image = req.img;
  // cambia el nombre del archivo a uno unico
  const fileName = `${prod}-${new Date().getMilliseconds()}.${image.ext}`;
  image = image.file;
  // console.log(image);
  const outDir = path.resolve(
    __dirname,
    `../../uploads/images/products/${fileName}`
  );
  image.mv(outDir, (err) => {
    if (err)
      return res.status(500).json({
        status: false,
        err,
      });

    updateProductImg(res, prod, fileName);
  });
};
// desde aqui la falla del Gabriel

const updateProductImg = (response, productID, imgName) => {
  Product.findOne({ _id: productID }, (err, productDB) => {
    if (err) {
      deleteImg(imgName, 'products');
      return response.status(500).json({
        status: false,
        err: {
          msg: 'Error en la peticion.',
        },
      });
    }

    if (!productDB) {
      deleteImg(imgName, 'products');
      return response.status(404).json({
        status: false,
        err: {
          msg: 'El producto no existe.',
        },
      });
    }

    if (productDB.img) {
      deleteImg(productDB.img, 'products');
    }

    productDB.img = imgName;
    productDB.save((err, saved) => {
      if (err) {
        deleteImg(productDB.img, 'products');
        return response.status(500).json({
          status: false,
          err: {
            msg: 'Error en la peticion.',
          },
        });
      }

      return response.json({
        status: true,
        product: saved,
      });
    });
  });
};

const updateUserImg = (response, userID, imgName) => {
  User.findOne({ _id: userID }, (err, userDB) => {
    if (err) {
      deleteImg(imgName, 'users');
      return response.status(500).json({
        status: false,
        err: {
          msg: 'Error en la peticion.',
        },
      });
    }

    if (!userDB) {
      deleteImg(imgName, 'users');
      return response.status(404).json({
        status: false,
        err: {
          msg: 'El usuario no existe.',
        },
      });
    }

    if (userDB.img) {
      deleteImg(userDB.img, 'users');
    }

    userDB.img = imgName;
    userDB.save((err, saved) => {
      if (err) {
        deleteImg(userDB.img, 'users');
        return response.status(500).json({
          status: false,
          err: {
            msg: 'Error en la peticion.',
          },
        });
      }

      return response.json({
        status: true,
        user: saved,
      });
    });
  });
};

const deleteImg = (filename, type) => {
  const pathimg = path.resolve(
    __dirname,
    `../../uploads/images/${type}/${filename}`
  );

  if (fs.existsSync(pathimg)) {
    fs.unlinkSync(pathimg);
  }
};

module.exports = ctrl;
