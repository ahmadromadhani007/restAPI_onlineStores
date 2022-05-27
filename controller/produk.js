const express = require('express');
const router = express.Router();
const database = require('../config/database');
const validasi_data = require('./validasi_data');
const verifikasi_validasi_data = require('../middleware/verifikasi_validasi_data');

router.get('/produk/all', async(req, res) => {
    try {
        const result = await database('produk')
        .leftOuterJoin('sub_kategori', 'sub_kategori.id_sub_kategori', 'produk.id_sub_kategori')      
        .leftOuterJoin('kategori', 'kategori.id_kategori', 'sub_kategori.id_kategori')
        .select('produk.id_produk', 'produk.nama_produk', 'kategori.nama AS nama_kategori', 'sub_kategori.nama AS nama_sub_kategori', 'produk.harga', 'produk.berat', 'produk.stok', 'produk.keterangan');
        if (result.length > 0) {
        return res.status(200).json({
            status: 1,
            message : 'Success',
            result : result
         })
      } else {
        return res.status(400).json({
            status: 0,
            message : 'Data Not Found'
        })
      }
    } catch (error) {
            return res.status(500).json({
                status:0,
                message: error.message
            });
        }
});

router.get('/produk/kategori/:id_kategori', async(req, res) => {
    try {
        const result = await database('produk')
        .leftOuterJoin('sub_kategori', 'sub_kategori.id_sub_kategori', 'produk.id_sub_kategori')      
        .leftOuterJoin('kategori', 'kategori.id_kategori', 'sub_kategori.id_kategori')
        .select('produk.id_produk', 'produk.nama_produk', 'kategori.nama AS nama_kategori', 'sub_kategori.nama AS nama_sub_kategori', 'produk.harga', 'produk.berat', 'produk.stok', 'produk.keterangan')
        .where('kategori.id_kategori', req.params.id_kategori)
        .andWhere('produk.status','y')
        .andWhere('sub_kategori.status','y')
        .andWhere('kategori.status','y')
        
        if (result.length > 0) {
        return res.status(200).json({
            status: 1,
            message : 'Success',
            result : result
         })
      } else {
        return res.status(400).json({
            status: 0,
            message : 'Data Not Found'
        })
      }
    } catch (error) {
            return res.status(500).json({
                status:0,
                message: error.message
            });
        }
});

router.get('/produk/sub_kategori/:id_sub_kategori', async(req, res) => {
    try {
        const result = await database('produk')
        .leftOuterJoin('sub_kategori', 'sub_kategori.id_sub_kategori', 'produk.id_sub_kategori')      
        .leftOuterJoin('kategori', 'kategori.id_kategori', 'sub_kategori.id_kategori')
        .select('produk.id_produk', 'produk.nama_produk', 'kategori.nama AS nama_kategori', 'sub_kategori.nama AS nama_sub_kategori', 'produk.harga', 'produk.berat', 'produk.stok', 'produk.keterangan')
        .where('sub_kategori.id_sub_kategori', req.params.id_sub_kategori)
        .andWhere('produk.status','y')
        .andWhere('sub_kategori.status','y')
        .andWhere('kategori.status','y')
        
        if (result.length > 0) {
        return res.status(200).json({
            status: 1,
            message : 'Success',
            result : result
         })
      } else {
        return res.status(400).json({
            status: 0,
            message : 'Data Not Found'
        })
      }
    } catch (error) {
            return res.status(500).json({
                status:0,
                message: error.message
            });
        }
});

router.get('/produk/one/:id_produk', async(req, res) => {
    try {
        const result = await database('produk')
        .leftOuterJoin('sub_kategori', 'sub_kategori.id_sub_kategori', 'produk.id_sub_kategori')      
        .leftOuterJoin('kategori', 'kategori.id_kategori', 'sub_kategori.id_kategori')
        .select('produk.id_produk', 'produk.nama_produk', 'kategori.nama AS nama_kategori', 'sub_kategori.nama AS nama_sub_kategori', 'produk.harga', 'produk.berat', 'produk.stok', 'produk.keterangan')
        .where('produk.id_produk', req.params.id_produk).first();
        if (result) {
            return res.status(200).json({
                status: 1,
                message : 'Success',
                result : result
             })
        } else {
            return res.status(400).json({
                status: 0,
                message : 'Data Not Found'
            })
        }

    } catch (error) {
            return res.status(500).json({
                status:0,
                message: error.message
            });
        }
});

router.post('/produk/simpan', validasi_data.data, verifikasi_validasi_data, async(req, res) => {
    const data = req.body;
    const input = {
        ...data,
        status : 'Y'
    }
    try {
        const simpan = await database('produk').insert(input);
        if (simpan){
            return res.status(200).json({
                status: 1,
                message: "Success",
                result: {
                    id_produk: simpan[0],
                    ...input
                }
            })   
    } else {
        return res.status(400).json({
            status: 0,
            message: "Failed",
        })
    }

} catch (error) {
        return res.status(500).json({
            status:0,
            message: error.message
        })
    }
});

router.put('/produk/edit/:id_produk', validasi_data.edit_data, verifikasi_validasi_data, async(req, res) => {
    const data = req.body;
    try {
        const result = await database('produk').where('id_produk', req.params.id_produk).first();
        if (result) {
            await database('produk').update(data).where('id_produk', req.params.id_produk);
            return res.status(200).json({
                status: 1,
                message: "Success",
            })  
        }else {
            return res.status(400).json({
                status: 0,
                message: "Data not found",
            })
        }

} catch (error) {
        return res.status(500).json({
            status:0,
            message: error.message
        })
    }
});

router.delete('/produk/hapus/:id_produk', async(req, res) => {
    try {
        const update = await database('produk').update('status', 'N').where('id_produk', req.params.id_produk);
        if (update){
            return res.status(200).json({
                status: 1,
                message: "Success",
            })
        } else {
            return res.status(400).json({
                status: 0,
                message: "Failed",
            })
        }         
    } catch (error) {
            return res.status(500).json({
                status:0,
                message: error.message
            })
        }
});

module.exports = router;