const express = require('express');
const router = express.Router();
const database = require('../config/database');
const upload = require('../controller/foto/multer');
const fs = require('fs');
const path = require('path');

router.get('/kategori/all', async(req, res) => {
    try {
        const result = await database.select('*').from('kategori');
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

router.post('/kategori/simpan', upload.single('foto'), async(req, res) => {
    const data = {
        name : req.body.name,
        foto : req.file.filename,
        status : 'Y'
    }
    try {
        const simpan = await database('kategori').insert(data);
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

router.post('/kategori/edit', upload.single('foto'), async(req, res) => {
    try {
        const result = await database("kategori").select('*').where('id_kategori', req.body.id_kategori).first();
        if (result) {
            if (!req.file) {
             await database.from("kategori").update({
                name : req.body.name,
                status : req.body.status
            }).where('id_kategori', req.body.id_kategori);
            return res.status(200).json({
                status: 1,
                message: "Success",
            })
        } else {
            await database.from("kategori").update({
                name : req.body.name,
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

router.delete('/kategori/hapus/:id_kategori', async(req, res) => {
    
    try {
        const update = await database('kategori').update('status', 'N').where('id_kategori', req.params.id_kategori);
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

router.get('/kategori/one/:id_kategori', async(req, res) => {
    try {
        const result = await database("kategori").select('*').where('id_kategori', req.params.id_kategori).first();
        if (result) {
            return res.status(200).json({
                status: 1,
                message: "Success",
                result : result
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

router.get('/kategori/all/:name', async(req, res) => {
    try {
        const result = await database.select('*').from('kategori').whereILike('name', '%' + req.params.name + '%');
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

module.exports = router;