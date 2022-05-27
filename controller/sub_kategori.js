const express = require('express');
const router = express.Router();
const database = require('../config/database');
const upload = require('../controller/foto/multer');
const fs = require('fs');
const path = require('path');

router.get('/sub_kategori/all/:id_kategori', async(req, res) => {
    try {
        const result = await database('sub_kategori')
        .leftOuterJoin('kategori','kategori.id_kategori','sub_kategori.id_kategori')
        .select('sub_kategori.*','kategori.nama as nama_kategori')
        .where('sub_kategori.id_kategori',req.params.id_kategori);
        if (result.length > 0){
            return res.status(200).json({
                status: 1,
                message: "Success",
                data: result
        })
    } else {
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

router.get('/sub_kategori/one/:id_sub_kategori', async(req, res) => {
    try {
        const result = await database('sub_kategori')
        .leftOuterJoin('kategori','kategori.id_kategori','sub_kategori.id_kategori')
        .select('sub_kategori.*','kategori.nama as nama_kategori')
        .where('sub_kategori.id_sub_kategori',req.params.id_sub_kategori).first();
        if (result){
            return res.status(200).json({
                status: 1,
                message: "Success",
                data: result
        })
    } else {
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

router.post('/sub_kategori/simpan', upload.single('foto'), async(req, res) => {
    const data = {
        id_kategori : req.body.id_kategori,
        nama : req.body.nama,
        foto : req.file.filename,
        status : 'Y'
    }
    try {
        const simpan = await database('sub_kategori').insert(data);
        if (simpan){
            return res.status(200).json({
                status: 1,
                message: "Success",
                result: {
                    id_kategori: simpan[0],
                    ...data
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

router.post('/sub_kategori/edit',upload.single('foto'), async(req, res) => {
    try {
        const result = await database("sub_kategori").select('*').where('id_sub_kategori', req.body.id_sub_kategori).first();        
        if (result) {
            if (!req.file) {
                await database.from("sub_kategori").update({
                    id_kategori : req.body.id_kategori,
                    nama : req.body.nama,
                    status : req.body.status
               }).where('id_kategori', req.body.id_kategori);
               return res.status(200).json({
                   status: 1,
                   message: "Success",
               })
           } else {
            await database.from("sub_kategori").update({
                id_kategori : req.body.id_kategori,
                nama : req.body.nama,
                foto : req.file.filename,
                status : req.body.status
            }).where('id_kategori', req.body.id_kategori);
            fs.unlink(path.join(__dirname + '/foto') + result.foto, (err) => {
                if (err) {
                    return res.status(200).json({
                        status: 1,
                        message: "Success",
                        error : err   
                })
            } else {
                return res.status(200).json({
                    status: 1,
                    message: "Success"
                })
             }
          });
        }
    } else {
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

router.delete('/sub_kategori/hapus/:id_sub_kategori', async(req, res) => {
    try {
        const update = await database('sub_kategori').update('status', 'N').where('id_sub_kategori', req.params.id_sub_kategori);
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