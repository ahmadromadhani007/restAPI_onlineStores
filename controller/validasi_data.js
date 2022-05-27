const {check} = require("express-validator")

module.exports.data = [
    check('nama_produk').not().isEmpty().withMessage('nama produk harus ada data'),
    check('id_sub_kategori').not().isEmpty().withMessage('id_sub_kategori harus ada data'),
    check('harga').not().isEmpty().withMessage('harga harus ada data'),
    check('berat').not().isEmpty().withMessage('berat harus ada data'),
    check('stok').not().isEmpty().withMessage('stok harus ada data'),
    check('keterangan').not().isEmpty().withMessage('keterangan harus ada data')

]

module.exports.edit_data = [
    check('nama_produk').not().isEmpty().withMessage('nama produk harus ada data'),
    check('id_sub_kategori').not().isEmpty().withMessage('id_sub_kategori harus ada data'),
    check('harga').not().isEmpty().withMessage('harga harus ada data'),
    check('berat').not().isEmpty().withMessage('berat harus ada data'),
    check('stok').not().isEmpty().withMessage('stok harus ada data'),
    check('keterangan').not().isEmpty().withMessage('keterangan harus ada data'),
    check('status').not().isEmpty().withMessage('status harus ada data')

]