const express = require('express');
const router = express.Router();
const database = require('../../config/database');
const validasi_data = require('./validasi_data_keranjang');
const verifikasi_validasi_data = require('../../middleware/verifikasi_validasi_data');

router.get('/keranjang/all/:id_user', async(req, res) => {
    try {
       
} catch (error) {
        return res.status(500).json({
            status:0,
            message: error.message
        })
    }
});

router.post('/keranjang/tambah', validasi_data.data, verifikasi_validasi_data, async(req, res) => {
    const data = req.body;
    try {
       const cek = await database('keranjang').where('id_produk', data.id_produk).andWhere('id_user', data.id_user).first();
       if (cek) {
            var jumlah = parseInt(cek.jumlah) + parseInt(data.jumlah)
            await database('keranjang').update('jumlah',jumlah).where('id_produk', data.id_produk).andWhere('id_user', data.id_user);
            return res.status(200).json({
                status:1,
                message: 'Berhasil menambahkan produk ke keranjang',
                data: req.body
            });
        }else{
            await database('keranjang').insert(data);
            return res.status(200).json({
                status:1,
                message: 'Berhasil menambahkan produk ke keranjang',
                data: req.body
            });
        }    
} catch (error) {
        return res.status(500).json({
            status:0,
            message: error.message
        })
    }
});

router.put('/keranjang/stock/:id_keranjang', async(req, res) => {
    try {
       
} catch (error) {
        return res.status(500).json({
            status:0,
            message: error.message
        })
    }
});

router.delete('/keranjang/hapus/all/:id_user', async(req, res) => {
    try {
       
} catch (error) {
        return res.status(500).json({
            status:0,
            message: error.message
        })
    }
});

router.delete('/keranjang/one/:id_keranjang', async(req, res) => {
    try {
       
} catch (error) {
        return res.status(500).json({
            status:0,
            message: error.message
        })
    }
});

router.post('/keranjang/transaksi', async(req, res) => {
    try {
       
} catch (error) {
        return res.status(500).json({
            status:0,
            message: error.message
        })
    }
});

module.exports = router;