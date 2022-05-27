const {check} = require("express-validator")

module.exports.data = [
    check('id_user').not().isEmpty().withMessage('user harus ada data')
    .isInt().withMessage('id_user harus berupa angka'),
    check('id_produk').not().isEmpty().withMessage('id_sub_kategori harus ada data')
    .isInt().withMessage('id_sub_kategori harus berupa angka'),
    check('jumlah').not().isEmpty().withMessage('jumlah harus ada data')
    .isInt().withMessage('harga harus berupa angka'),
    check('harga').not().isEmpty().withMessage('harga harus ada data')
    .isInt().withMessage('berat harus berupa angka'),
    check('berat').not().isEmpty().withMessage('berat harus ada data')
    .isInt().withMessage('berat harus berupa angka')

]