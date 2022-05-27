const {check} = require('express-validator');

module.exports.login = [
    check('email')
    .not().isEmpty().withMessage('email harus ada data')
    .isEmail().withMessage('your email is invalid'),
    check('password')
    .not().isEmpty().withMessage('password harus ada data')
    .isLength({min : 5}),
]

module.exports.daftar =[
    check('nama')
    .not().isEmpty().withMessage('nama harus ada data'),
    check('id_provinsi')
    .not().isEmpty().withMessage('id_provinsi harus ada data')
    .isNumeric().withMessage('id_provinsi harus angka'),
    check('id_kabupaten')
    .not().isEmpty().withMessage('id_kabupaten harus ada data')
    .isNumeric().withMessage('id_kabupaten harus angka'),
    check('id_kecamatan')
    .not().isEmpty().withMessage('id_kecamatan harus ada data')
    .isNumeric().withMessage('id_kecamatan harus angka'),
    check('id_desa')
    .not().isEmpty().withMessage('id_desa harus ada data')
    .isNumeric().withMessage('id_desa harus angka'),
    check('alamat')
    .not().isEmpty().withMessage('alamat harus ada data'),
    check('telepon')
    .not().isEmpty().withMessage('telepon anda harus ada data')
    .isNumeric().withMessage('telepon anda harus angka')
    .isLength({min : 5, max : 14}),
    check('email')
    .not().isEmpty().withMessage('email harus ada data')
    .isEmail().withMessage('your email is invalid'),
    check('password')
    .not().isEmpty().withMessage('password harus ada data')
    .isLength({min : 5}),
]

module.exports.edit = [
    check('nama')
    .not().isEmpty().withMessage('nama harus ada data'),
    check('id_provinsi')
    .not().isEmpty().withMessage('id_provinsi harus ada data')
    .isNumeric().withMessage('id_provinsi harus angka'),
    check('id_kabupaten')
    .not().isEmpty().withMessage('id_kabupaten harus ada data')
    .isNumeric().withMessage('id_kabupaten harus angka'),
    check('id_kecamatan')
    .not().isEmpty().withMessage('id_kecamatan harus ada data')
    .isNumeric().withMessage('id_kecamatan harus angka'),
    check('id_desa')
    .not().isEmpty().withMessage('id_desa harus ada data')
    .isNumeric().withMessage('id_desa harus angka'),
    check('alamat')
    .not().isEmpty().withMessage('alamat harus ada data'),
    check('telepon')
    .not().isEmpty().withMessage('telepon anda harus ada data')
    .isNumeric().withMessage('telepon anda harus angka')
    .isLength({min : 5, max : 14}),
    check('email')
    .not().isEmpty().withMessage('email harus ada data')
    .isEmail().withMessage('your email is invalid')
]