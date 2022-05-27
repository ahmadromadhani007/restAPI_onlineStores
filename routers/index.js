const express = require('express');
const router = express.Router();

router.use("/controller",require('./wilayah'));
router.use("/controller",require('./kategori'));
router.use("/controller",require('./sub_kategori'));
router.use("/controller",require('./produk'));
router.use("/controller",require('./produk_foto'));
router.use("/controller",require('./admin'));
router.use("/controller",require('./users'));
router.use("/controller",require('./keranjang'));

module.exports = router;
